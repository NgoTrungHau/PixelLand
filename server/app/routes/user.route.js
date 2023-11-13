const express = require('express');
const multer = require('multer');
const upload = multer();
const users = require('../controllers/user.controller');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/').get(users.findAll);
router.route('/profile/:id').get(protect, users.getProfile);
router.route('/register').post(users.register);
router.route('/login').post(users.login);
router.route('/refresh-token').post(protect, users.refreshToken);
router.route('/search').get(users.search);
router.route('/user').post(users.getUser);
router.route('/follow/:id').patch(protect, users.follow);
router.route('/unfollow/:id').patch(protect, users.unfollow);
router.route('/me').get(protect, users.getMe);

router
  .route('/:id')
  .get(users.getProfile)
  .post(
    upload.fields([
      { name: 'avatar', maxCount: 1 },
      { name: 'background', maxCount: 1 },
    ]),
    protect,
    users.update,
  )
  .delete(protect, users.delete);

module.exports = router;
