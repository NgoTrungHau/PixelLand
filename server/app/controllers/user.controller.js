const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const cloudinary = require('../utils/cloudinary');
const ApiError = require('../api-error');
const User = require('../models/User');

// Register
exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return next(new ApiError(400, 'Please add all fields'));
    }

    const exists = await User.findOne({ email: email });

    if (exists) {
      return next(new ApiError(400, 'User already exists'));
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // create user
    const user = new User({
      username,
      email,
      password: hashedPassword,
    });
    const refresh_token = generateRefreshToken(user._id);
    const access_token = generateAccessToken(user._id);
    const tokens = {
      refresh_token,
      access_token,
    };
    user.refresh_token = refresh_token;

    const createUser = await user.save();
    res.json({
      tokens,
      ...createUser._doc,
      password: '',
    });
  } catch (error) {
    console.log(error);
    return next(new ApiError(400, 'Invalid user data'));
  }
};

// generateToken function for access token
const generateAccessToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: '6m',
  });
};

// generateToken function for refresh token
const generateRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: '1w',
  });
};

// Login
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new ApiError(400, 'Please add all fields'));
    }

    const user = await User.findOne({
      email,
    }).populate('followers followings', 'avatar username followers followings');

    if (!user) {
      return next(new ApiError(400, 'User does not exist'));
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return next(new ApiError(400, 'Entered wrong password'));
    }

    const refresh_token = generateRefreshToken(user._id);
    const access_token = generateAccessToken(user._id);
    const tokens = {
      refresh_token,
      access_token,
    };
    user.refresh_token = refresh_token;
    const savedUser = await user.save();
    if (savedUser && isPasswordValid) {
      return res.json({
        tokens,
        ...savedUser._doc,
        password: '',
      });
    }
  } catch (error) {
    console.log(error);
    return next(new ApiError(400, `Invalid credentials`));
  }
};

exports.refreshToken = async (req, res, next) => {
  try {
    const refToken = req.user.refresh_token;

    if (!refToken) {
      throw new Error('Refresh token missing');
    }

    // Verify the refresh token
    jwt.verify(
      refToken,
      process.env.JWT_REFRESH_SECRET,
      function (err, decoded) {
        if (err) {
          // Refresh token expired or invalid, send failure response
          return res
            .status(400)
            .json({ msg: 'Token expired, please log in again' });
        }

        // If successful, generate a new access token
        const accessToken = generateAccessToken(req.user._id);
        res.json({
          accessToken,
        });
      },
    );
  } catch (error) {
    next(new ApiError(400, 'Invalid refresh token'));
  }
};

// get user data
exports.getUser = async (req, res, next) => {
  try {
    const { refresh_token, access_token } = req.body;
    if (!refresh_token) {
      throw new Error('Refresh token missing');
    }
    if (!access_token) {
      throw new Error('Access token missing');
    }
    const user = await User.findOne({ refresh_token: refresh_token }).exec();
    res.json({
      ...user._doc,
      tokens: {
        refresh_token,
        access_token,
      },
    });
  } catch (error) {
    console.log(error);
    next(new ApiError(400, 'Invalid refresh token'));
  }
};
// get user data
exports.getMe = async (req, res) => {
  res.status(200).json(req.user);
};

exports.search = async (req, res, next) => {
  try {
    const users = await User.find({
      username: { $regex: req.query.username },
    })
      .limit(10)
      .select('username avatar');
    return res.json({ users });
  } catch (error) {
    return next(
      new ApiError(500, `Error retrieving user with id=${req.body.username}`),
    );
  }
};

exports.findAll = async (req, res, next) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    return next(new ApiError(500, 'An error occurred while retrieving user'));
  }
};

exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return next(new ApiError(404, 'User not found'));
    }
    user._doc.followed = user.followers.includes(req.user._id.toString());
    res.json(user);
  } catch (error) {
    console.log(error);
    return next(
      new ApiError(500, `Error retrieving user with id=${req.params.id}`),
    );
  }
};

exports.update = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return next(new ApiError(404, 'User not found'));
    }

    let { username, description } = req.body;

    // Check if avatar file is provided
    if (req.files.avatar) {
      // Delete the old avatar
      if (user.avatar.url) {
        await cloudinary.uploader.destroy(user.avatar.public_id, {
          folder: `profile/${user.username}/avatar`,
        });
      }
      // Upload the avatar file to Cloudinary
      const avatarResult = await new Promise((resolve, reject) => {
        const streamLoad = cloudinary.uploader.upload_chunked_stream(
          { folder: `profile/${user.username}/avatar` },
          function (error, result) {
            if (result) {
              resolve(result);
            } else {
              reject(error);
            }
          },
        );
        streamLoad.end(req.files.avatar[0].buffer);
      });
      // update user's avatar
      user.avatar = {
        public_id: avatarResult.public_id,
        url: avatarResult.secure_url,
      };
    }

    // Check if background file is provided
    if (req.files.background) {
      // Delete the old background
      if (user.background.url) {
        await cloudinary.uploader.destroy(user.background.public_id, {
          folder: `profile/${user.username}/background`,
        });
      }
      // Upload the background file to Cloudinary
      const backgroundResult = await new Promise((resolve, reject) => {
        const streamLoad = cloudinary.uploader.upload_chunked_stream(
          { folder: `profile/${user.username}/background` },
          function (error, result) {
            if (result) {
              resolve(result);
            } else {
              reject(error);
            }
          },
        );
        streamLoad.end(req.files.background[0].buffer);
      });
      // update user's background
      user.background = {
        public_id: backgroundResult.public_id,
        url: backgroundResult.secure_url,
      };
    }

    // Update the user's data
    user.username = username;
    user.description = description;

    const savedProfile = await user.save();

    res.json(savedProfile);
  } catch (error) {
    console.log(error);
    return next(
      new ApiError(500, `Error updating user with id=${req.params.id}`),
    );
  }
};

exports.delete = async (req, res, next) => {
  try {
    const deleteUser = await User.deleteOne({ _id: req.params.id });
    res.json(deleteUser);
  } catch (error) {
    return next(
      new ApiError(500, `Error deleting user with id=${req.params.id}`),
    );
  }
};

exports.deleteAll = async (req, res, next) => {
  try {
    const deleteAllUsers = await User.deleteMany({});
    res.json(deleteAllUsers);
  } catch (error) {
    return next(new ApiError(500, `Error deleting all user `));
  }
};
// Follow
exports.follow = async (req, res, next) => {
  try {
    const followed = await User.findByIdAndUpdate(
      { _id: req.params.id },
      {
        $addToSet: { followers: req.user._id },
      },
      { new: true },
    );
    const followings = await User.findByIdAndUpdate(
      { _id: req.user._id },
      {
        $addToSet: { followings: req.params.id },
      },
      { new: true },
    );

    if (!followed || !followings)
      return res.status(400).json({ error: 'This user does not exist.' });
    return res.status(200).send({ followed, followings });
  } catch (error) {
    console.log(error);
    return next(
      new ApiError(500, `Error retrieving user with id=${req.params.id}`),
    );
  }
};
// Unfollow
exports.unfollow = async (req, res, next) => {
  try {
    const unfollowed = await User.findByIdAndUpdate(
      req.params.id,
      {
        $pull: { followers: req.user._id },
      },
      { new: true },
    );
    const unfollowings = await User.findByIdAndUpdate(
      req.user._id,
      {
        $pull: { followings: req.params.id },
      },
      { new: true },
    );

    if (!unfollowed || !unfollowings)
      return res.status(400).json({ msg: 'This user does not exist.' });

    return res.status(200).send({ unfollowed, unfollowings });
  } catch (error) {
    return next(
      new ApiError(500, `Error retrieving user with id=${req.params.id}`),
    );
  }
};
