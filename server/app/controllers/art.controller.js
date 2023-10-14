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
      author: {
        _id: req.user._id,
        username: req.user.username,
        avatar: req.user.avatar,
      },
    });
  } catch (error) {
    return next(new ApiError(500, 'An error occurred while creating the art'));
  }
};

// get all arts
exports.getArts = async (req, res, next) => {
  try {
    const arts = await Art.find({})
      .sort({ createdAt: -1 })
      .populate('author', 'username avatar');
    res.json(arts);
  } catch (error) {
    return next(new ApiError(500, 'An error occurred while retrieving art'));
  }
};
// get all auth arts
exports.getAuthArts = async (req, res, next) => {
  try {
    const arts = await Art.find({})
      .sort({ createdAt: -1 })
      .populate('author', 'username avatar');
    arts.map((art) => {
      if (art.likes.includes(req.params.id.toString())) {
        art._doc.liked = true;
      }
    });

    res.json(arts);
  } catch (error) {
    return next(new ApiError(500, 'An error occurred while retrieving art'));
  }
};

// get art
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

// Update art
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

    let result = null;
    if (art.art.url !== req.body.image) {
      await cloudinary.uploader.destroy(art.art.public_id, (error, result) => {
        console.log(result, error);
      });
      // Upload new image
      result = await cloudinary.uploader.upload(req.body.image, {
        folder: 'arts',
      });
    }

    const updateArt = await Art.findByIdAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          title: req.body.title,
          description: req.body.description,
          art: result ? result : art.art,
        },
      },
      { new: true },
    ).populate('author', 'username avatar');
    res.json(updateArt);
  } catch (error) {
    return next(
      new ApiError(500, `Error updating art with id=${req.params.id}`),
    );
  }
};

// Like art
exports.likeArt = async (req, res, next) => {
  try {
    const like = await Art.findOneAndUpdate(
      req.params.id,
      {
        $addToSet: { likes: req.user._id },
      },
      { new: true },
    );

    if (!like)
      return res.status(400).json({ error: 'This art does not exist.' });

    return res.status(200).send(like);
  } catch (error) {
    return next(
      new ApiError(500, `Error retrieving art with id=${req.params.id}`),
    );
  }
};

// Unlike art
exports.unlikeArt = async (req, res, next) => {
  try {
    const unlike = await Art.findOneAndUpdate(
      req.params.id,
      {
        $pull: { likes: req.user._id },
      },
      { new: true },
    );

    if (!unlike)
      return res.status(400).json({ msg: 'This art does not exist.' });

    return res.status(200).send(unlike);
  } catch (error) {
    return next(
      new ApiError(500, `Error retrieving art with id=${req.params.id}`),
    );
  }
};

// Delete art
exports.delete = async (req, res, next) => {
  try {
    const art = await Art.findById(req.params.id);

    if (!art) {
      return next(new ApiError(401, 'Art not found'));
    }
    const user = await User.findById(req.user._id);

    if (!user) {
      return next(new ApiError(401, 'User not found'));
    }

    // Make sure the logged in user matches the goal user
    if (art.author.toString() !== req.user.id) {
      return next(new ApiError(401, 'User not authorized'));
    }

    // Delete old image from Cloudinary
    const oldImageUrl = art.art.url;
    const public_id = oldImageUrl.split('/').slice(-1)[0].split('.')[0]; // extract public_id from url
    await cloudinary.uploader.destroy(public_id, (error, result) => {
      console.log(result, error);
    });
    const deleteArt = await art.remove();
    res.json(deleteArt);
  } catch (error) {
    return next(
      new ApiError(500, `Error updating art with id=${req.params.id}`),
    );
  }
};

// Delete all arts
exports.deleteAll = async (req, res, next) => {
  try {
    const deleteAllArts = await Art.deleteMany({});
    res.json(deleteAllArts);
  } catch (error) {
    return next(new ApiError(500, `Error deleting all user `));
  }
};
