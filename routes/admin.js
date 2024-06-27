const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const auth = require('../middleware/auth');

router.get('/users', auth, adminController.getAllUsers);
router.get('/user/:username', auth, adminController.getUserByUsername);
router.delete('/user/:username', auth, adminController.deleteUser);

module.exports = router;

