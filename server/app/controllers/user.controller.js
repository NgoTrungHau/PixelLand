const PostService = require('../services/user.service');
const MongoDB = require('../utils/mongodb.util');
const ApiError = require('../api-error');
const User = require('../models/User');

exports.create = async (req, res, next) => {
  if (!req.body?.user) {
    return next(new ApiError(400, 'User can not be empty'));
  }

  const user = new User(req.body);

  try {
    const createUser = await user.save();
    res.json(createUser);
  } catch (error) {
    return next(new ApiError(500, 'An error occurred while creating the user'));
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
    return res.json(user);
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
      new ApiError(500, `Error updating user with id=${req.params.id}`),
    );
  }
};
exports.deleteAll = async (req, res, next) => {
  res.send({ message: 'deleteAll handler' });
};
