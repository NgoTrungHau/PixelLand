const ApiError = require('../api-error');
const Art = require('../models/Art');
const cloudinary = require('../utils/cloudinary');
const { deleteAllComments } = require('../controllers/comment.controller');

exports.create = async (req, res, next) => {
  try {
    if (!req.file) {
      return next(new ApiError(400, 'Art can not be empty'));
    }
    // upload image to cloudinary
    const result = await new Promise((resolve, reject) => {
      const streamLoad = cloudinary.uploader.upload_chunked_stream(
        { resource_type: 'image', folder: 'arts' },
        function (error, result) {
          if (result) {
            resolve(result);
          } else {
            reject(error);
          }
        },
      );
      streamLoad.end(req.file.buffer);
    });

    const art = new Art({
      author: req.user.id,
      title: req.body.title,
      description: req.body.description,
      privacy: req.body.privacy,
      style: req.body.style,
      art: {
        public_id: result.public_id,
        url: result.secure_url,
      },
    });

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
    console.log(error);

    return next(new ApiError(500, 'An error occurred while creating the art'));
  }
};

// get all arts
exports.getArts = async (req, res, next) => {
  try {
    const arts = await Art.find({
      privacy: 'Public',
    })
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
    const { start, newArtOffset, limit } = req.query;

    const allArts = await Art.find()
      .sort({ createdAt: -1 })
      .skip(Number(start) * Number(limit) + Number(newArtOffset))
      .limit(Number(limit))
      .populate('author', 'username avatar');

    // Filter out arts with varied privacy settings except the ones from the request user
    const arts = allArts.filter((art) => {
      const userIsAuthor =
        art.author._id.toString() === req.user._id.toString();
      if (userIsAuthor) return true;

      switch (art.privacy) {
        case 'Public':
          return true;
        case 'Only me':
          return false;
        // case 'Followers only':
        //     // You'll replace `checkIfUserIsFollower` function with real implementation
        //     return checkIfUserIsFollower(art.author._id, req.user._id);
        // case 'Members only':
        //     // You'll replace `checkIfUserIsMember` function with real implementation
        //     return checkIfUserIsMember(art.author._id, req.user._id);
        default:
          return false;
      }
    });

    // If the art was liked by the request user, assign true to the liked field
    arts.forEach((art) => {
      if (art.likes.includes(req.user._id.toString())) {
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
    if (req.file) {
      // Delete the old art and upload the new art
      await cloudinary.uploader.destroy(art.art.public_id);
      const result = await new Promise((resolve, reject) => {
        const streamLoad = cloudinary.uploader.upload_stream(
          { folder: 'arts' },
          function (error, result) {
            if (result) {
              resolve(result);
            } else {
              reject(error);
            }
          },
        );
        streamLoad.end(req.file.buffer);
      });
      art.art = {
        public_id: result.public_id,
        url: result.url,
      };
    }

    // save art

    art.title = req.body.title;
    art.description = req.body.description;
    art.privacy = req.body.privacy;

    let savedArt = await art.save();
    savedArt = await savedArt.populate('author', 'username avatar');
    res.send(savedArt);
  } catch (error) {
    console.log(error);
    return next(
      new ApiError(500, `Error updating art with id=${req.params.id}`),
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

    // Delete old image from Cloudinary
    await cloudinary.uploader.destroy(art.art.public_id, {
      folder: 'arts',
    });

    const deleteArt = await art.remove();
    res.json(deleteArt);
    deleteAllComments(art._id, 'art');
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

// View art
exports.viewArt = async (req, res, next) => {
  try {
    const art = await Art.findById(req.params.id);

    if (!art) {
      return next(new ApiError(401, 'Art not found'));
    }
    art.views++; // Increase views count
    const view = await art.save(); // Save the updated art object

    return res.status(200).send(view);
  } catch (error) {
    return next(
      new ApiError(500, `Error retrieving art with id=${req.params.id}`),
    );
  }
};

// Like art
exports.likeArt = async (req, res, next) => {
  try {
    const like = await Art.findByIdAndUpdate(
      { _id: req.params.id },
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
    const unlike = await Art.findByIdAndUpdate(
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
