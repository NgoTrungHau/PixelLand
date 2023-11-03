const express = require('express');
const multer = require('multer');
const upload = multer();

const arts = require('../controllers/art.controller');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/').get(arts.getArts);
router.route('/auth').get(protect, arts.getAuthArts);
router.route('/author/:id').get(protect, arts.getUserArts);
router.route('/create').post(upload.single('art'), protect, arts.create);
router.route('/view/:id').patch(arts.viewArt);
router.route('/like/:id').patch(protect, arts.likeArt);
router.route('/unlike/:id').patch(protect, arts.unlikeArt);
router.route('/delete').delete(protect, arts.deleteAll);

router
  .route('/:id')
  .get(arts.findOne)
  .patch(upload.single('art'), protect, arts.update)
  .delete(protect, arts.delete);

module.exports = router;
