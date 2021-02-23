// Adding additional packages
const express = require('express');
const router = express.Router();

const sauceCtrl = require('../controllers/sauces');

// Import of auth middleware to secure routes
const auth = require('../middleware/auth');

// Import of multer middleware for image management
const multer = require ('../middleware/multer-config');

// Route all APIs
router.post ('/', auth, multer, sauceCtrl.createSauce);
router.put ('/:id', auth, multer, sauceCtrl.modifySauce);
router.delete('/:id', auth, sauceCtrl.deleteSauce);
router.get('/:id', auth, sauceCtrl.getOneSauce);
router.get('/', auth, sauceCtrl.getListe);
router.post('/:id/like', auth, sauceCtrl.likeSauce);


module.exports = router;