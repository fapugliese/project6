// Add additional packages 
const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user');

// Route all APIs 
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;