const express = require('express');

const posts = require('../controllers/post.controller');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// post
router.route('/').get(posts.findAll);
router.route('/create').post(protect, posts.create);
router.route('/delete').delete(protect, posts.deleteAll);

router
  .route('/:id')
  .get(posts.findOne)
  .post(protect, posts.update)
  .delete(protect, posts.delete);

module.exports = router;
