const express = require('express');
const users = require('../controllers/user.controller');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/').get(users.findAll);
router.route('/register').post(users.register);
router.route('/login').post(users.login);
router.route('/refresh-token').post(protect, users.refreshToken);
router.route('/search').get(users.search);
router.route('/user').post(users.getUser);
router.route('/me').get(protect, users.getMe);

router
  .route('/:id')
  .get(users.findOne)
  .post(protect, users.update)
  .delete(protect, users.delete);

module.exports = router;
