const express = require('express');
const multer = require('multer');
const upload = multer();

const comments = require('../controllers/comment.controller');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/').get(protect, comments.getAllComments);
router
  .route('/create')
  .post(upload.single('media'), protect, comments.createComment);
router
  .route('/reply/:id')
  .post(upload.single('media'), protect, comments.replyToCmt);
router.route('/:id/like').patch(protect, comments.likeCmt);
router.route('/:id/unlike').patch(protect, comments.unlikeCmt);
// router.route('/delete').delete(protect, comments.deleteAll);

router
  .route('/:id')
  .get(protect, comments.getComments)
  .patch(upload.single('media'), protect, comments.updateComment)
  .delete(protect, comments.deleteComment);

module.exports = router;
