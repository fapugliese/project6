// Adding additional packages
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

// User Model
const userSchema = mongoose.Schema({
    email: { type: String, require: true, unique: true},
    password: { type: String, require: true}
});

// Import of the plugin which allows the creation of a single user with a single email address
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('user', userSchema);