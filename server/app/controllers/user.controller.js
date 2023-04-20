const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const ApiError = require('../api-error');
const User = require('../models/User');

// Register
exports.register = async (req, res, next) => {
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

  try {
    const createUser = await user.save();
    res.json({
      _id: createUser.id,
      username: createUser.username,
      email: createUser.email,
      avatar: createUser.avatar,
      token: generateToken(createUser._id),
    });
  } catch (error) {
    return next(new ApiError(400, 'Invalid user data'));
  }
};

// Login
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

exports.login = async (req, res, next) => {
  try {
    const user = await User.findOne({
      email: req.body.email,
    });

    const isPasswordValid = await bcrypt.compare(
      req.body.password,
      user.password,
    );
    if (user && isPasswordValid) {
      return res.json({
        _id: user.id,
        name: user.username,
        email: user.email,
        avatar: user.avatar,
        token: generateToken(user._id),
      });
    }
  } catch (error) {
    return next(new ApiError(400, `Invalid credentials`));
  }
};

// get user data
exports.getMe = async (req, res) => {
  res.status(200).json(req.user);
};

exports.search = async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) {
      return next(new ApiError(404, 'User not found'));
    }
    return res.json(user.username, user.avatar, user.nickname);
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

exports.findOne = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return next(new ApiError(404, 'User not found'));
    }
    return res.json({
      _id: user.id,
      name: user.username,
      email: user.email,
      avatar: user.avatar,
      bio: user.bio,
      followings: user.followings,
      followers: user.followers,
    });
  } catch (error) {
    return next(
      new ApiError(500, `Error retrieving user with id=${req.params.id}`),
    );
  }
};

exports.update = async (req, res, next) => {
  try {
    const updateUser = await User.updateOne(
      { _id: req.params.id },
      { $set: req.body },
    );
    res.json(updateUser);
  } catch (error) {
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
