const ApiError = require('../api-error');
const Art = require('../models/Art');
const User = require('../models/User');
const cloudinary = require('../utils/cloudinary');

exports.create = async (req, res, next) => {
  if (!req.body?.art) {
    return next(new ApiError(400, 'Art can not be empty'));
  }

  const result = await cloudinary.uploader.upload(req.body.art, {
    folder: 'arts',
    // width: 300,
    // crop: 'scale'
  });

  const art = new Art({
    author: req.user.id,
    title: req.body.title,
    description: req.body.description,
    art: {
      public_id: result.public_id,
      url: result.secure_url,
    },
  });

  try {
    const createArt = await art.save();
    res.json({
      ...createArt._doc,
      user: {
        _id: req.user._id,
        username: req.user.username,
        avatar: req.user.avatar,
      },
    });
  } catch (error) {
    return next(new ApiError(500, 'An error occurred while creating the art'));
  }
};
exports.findAll = async (req, res, next) => {
  try {
    const arts = await Art.find({})
      .sort({ createdAt: -1 })
      .populate('author', 'username avatar');
    res.json(arts);
  } catch (error) {
    return next(new ApiError(500, 'An error occurred while retrieving art'));
  }
};
exports.findOne = async (req, res, next) => {
  try {
    const art = await Art.findById(req.params.id);
    if (!art) {
      return next(new ApiError(404, 'Art not found'));
    }
    return res.json(art);
  } catch (error) {
    return next(
      new ApiError(500, `Error retrieving art with id=${req.params.id}`),
    );
  }
};
exports.update = async (req, res, next) => {
  try {
    const art = await Art.findById(req.params.id);

    if (!art) {
      return next(new ApiError(401, 'Art not found'));
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return next(new ApiError(401, 'User not found'));
    }

    // Make sure the logged in user matches the goal user
    if (art.author.toString() !== req.user.id) {
      return next(new ApiError(401, 'User not authorized'));
    }

    const updateArt = await Art.Post.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      },
    );
    res.json(updateArt);
  } catch (error) {
    return next(
      new ApiError(500, `Error updating art with id=${req.params.id}`),
    );
  }
};
exports.delete = async (req, res, next) => {
  try {
    const art = await Art.findById(req.params.id);

    if (!art) {
      return next(new ApiError(401, 'Art not found'));
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return next(new ApiError(401, 'User not found'));
    }

    // Make sure the logged in user matches the goal user
    if (art.author.toString() !== req.user.id) {
      return next(new ApiError(401, 'User not authorized'));
    }

    const deleteArt = await art.remove();
    res.json(deleteArt);
  } catch (error) {
    return next(
      new ApiError(500, `Error updating art with id=${req.params.id}`),
    );
  }
};
exports.deleteAll = async (req, res, next) => {
  try {
    const deleteAllArts = await Art.deleteMany({});
    res.json(deleteAllArts);
  } catch (error) {
    return next(new ApiError(500, `Error deleting all user `));
  }
};
