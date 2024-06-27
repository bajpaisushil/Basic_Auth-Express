const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');

router.post('/add-info', auth, userController.addUserInfo);
router.get('/me', auth, userController.getUserInfo);
router.put('/update-info', auth, userController.updateUserInfo);

module.exports = router;

