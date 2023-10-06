const express = require('express');
const comments = require('../controllers/comment.controller');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/').get(protect, comments.getAllComments);
router.route('/create').post(protect, comments.createComment);
router.route('/:id/like').patch(protect, comments.likeCmt);
router.route('/:id/unlike').patch(protect, comments.unlikeCmt);
// router.route('/delete').delete(protect, comments.deleteAll);

router
  .route('/:id')
  .get(protect, comments.getComments)
  .post(protect, comments.updateComment)
  .delete(protect, comments.deleteComment);

module.exports = router;
