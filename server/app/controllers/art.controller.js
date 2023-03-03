const PostService = require('../services/art.service');
const MongoDB = require('../utils/mongodb.util');
const ApiError = require('../api-error');
const Art = require('../models/Art');

exports.create = async (req, res, next) => {
  if (!req.body?.art) {
    return next(new ApiError(400, 'Art can not be empty'));
  }

  const art = new Art(req.body);

  try {
    const createArt = await art.save();
    res.json(createArt);
  } catch (error) {
    return next(
      new ApiError(500, 'An error occurred while creating the art'),
    );
  }
};
exports.findAll = async (req, res, next) => {
  try {
    const arts = await Art.find({});
    res.json(arts);
  } catch (error) {
    return next(
      new ApiError(500, 'An error occurred while retrieving art'),
    );
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
      new ApiError(
        500,
        `Error retrieving art with id=${req.params.id}`,
      ),
    );
  }
};
exports.update = async (req, res, next) => {
  try {
    const updateArt = await Art.updateOne(
      { _id: req.params.id },
      { $set: req.body },
    );
    res.json(updateArt);
  } catch (error) {
    return next(
      new ApiError(
        500,
        `Error updating art with id=${req.params.id}`,
      ),
    );
  }
};
exports.delete = async (req, res, next) => {
  try {
    const deleteArt = await Art.deleteOne({ _id: req.params.id });
    res.json(deleteArt);
  } catch (error) {
    return next(
      new ApiError(
        500,
        `Error updating art with id=${req.params.id}`,
      ),
    );
  }
};
exports.deleteAll = async (req, res, next) => {
  res.send({ message: 'deleteAll handler' });
};
