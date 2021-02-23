// Adding additional packages
const express = require('express');
const bodyParser = require ('body-parser');
const mongoose = require('mongoose');
const path = require('path');

// Creation of the express application
const app = express();

// Import routes
const sauceRoutes = require('./routes/sauces');
const userRoutes = require('./routes/user');

// Connection to the MongoDB Database
// & data masking thanks to DOTENV package.
require("dotenv").config();
const ID = process.env.ID;
const MDP = process.env.MDP;

mongoose.connect('mongodb+srv://facu:hpyecdf4@cluster0.v34kw.mongodb.net/<dbname>?retryWrites=true&w=majority',
  { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Successful connection to MongoDB !'))
  .catch(() => console.log('Connection to MongoDB failed !'));

// Header to work around CORS errors
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

// Make request body data actionable
app.use(bodyParser.json());

// Static image resource management
app.use('/images', express.static(path.join(__dirname, 'images')));

// Expected routes for the different APIs
app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);

module.exports = app;