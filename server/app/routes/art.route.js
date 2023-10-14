const express = require('express');
const arts = require('../controllers/art.controller');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/').get(arts.getArts);
router.route('/auth/:id').get(protect, arts.getAuthArts);
router.route('/create').post(protect, arts.create);
router.route('/like/:id').patch(protect, arts.likeArt);
router.route('/unlike/:id').patch(protect, arts.unlikeArt);
router.route('/delete').delete(protect, arts.deleteAll);

router
  .route('/:id')
  .get(arts.findOne)
  .post(protect, arts.update)
  .delete(protect, arts.delete);

module.exports = router;
