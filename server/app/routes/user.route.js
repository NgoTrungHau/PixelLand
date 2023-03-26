const express = require('express');
const users = require('../controllers/user.controller');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/').get(users.findAll).delete(users.deleteAll);
router.route('/register').post(users.register);
router.route('/login').post(users.login);
router.route('/search').get(users.search);
router.route('/me').get(protect, users.getMe);

router.route('/:id').get(users.findOne).post(users.update).delete(users.delete);

module.exports = router;
