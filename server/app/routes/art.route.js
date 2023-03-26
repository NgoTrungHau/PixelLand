const express = require('express');
const arts = require('../controllers/art.controller');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router
  .route('/')
  .get(arts.findAll)
  .post(protect, arts.create)
  .delete(protect, arts.deleteAll);

router
  .route('/:id')
  .get(arts.findOne)
  .post(protect, arts.update)
  .delete(protect, arts.delete);

module.exports = router;
