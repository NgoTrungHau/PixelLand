const express = require('express');
const arts = require('../controllers/art.controller');

const router = express.Router();

router.route('/').get(arts.findAll).post(arts.create);
// .delete(arts.deleteAll);

router
  .route('/:id')
  .get(arts.findOne)
  .post(arts.update)
  .delete(arts.delete);

module.exports = router;
