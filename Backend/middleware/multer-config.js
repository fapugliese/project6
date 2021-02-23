// Add additional packages 
const multer = require ('multer');

// Adding a dictionary for image formats 
const MIME_TYPES = {
     'image/jpg': 'jpg',
     'image/jpeg': 'jpg',
     'image/png': 'png'
 };

// Create a constant to indicate where to save the incoming file 
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'images')
    },
    filename: (req, file, callback) => {
        const name = file.originalname.split (' ').join('_');
        const extension = MIME_TYPES[file.mimetype];
        callback(null, name + Date.now() + '.' + extension);
    }
});

module.exports = multer({ storage }).single('image');

