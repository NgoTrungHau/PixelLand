const express = require('express');
const multer = require('multer');
const upload = multer();

const posts = require('../controllers/post.controller');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// post
router.route('/').get(protect, posts.getPosts);
router.route('/create').post(upload.single('media'), protect, posts.createPost);
router.route('/like/:id').patch(protect, posts.likePost);
router.route('/unlike/:id').patch(protect, posts.unlikePost);
router.route('/delete').delete(protect, posts.deleteAll);

router
  .route('/:id')
  .get(posts.findOne)
  .post(protect, posts.update)
  .delete(protect, posts.delete);

module.exports = router;
