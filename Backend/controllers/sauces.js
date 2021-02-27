// Import of the sauce model
const Sauce = require('../models/sauces');

// Add FS package for removal
const fs = require ('fs');

// Creating a sauce
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new Sauce({
      ...sauceObject,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
   sauce.save()
   .then(() => res.status(201).json({ message: 'Registered object!'}))
   .catch(error => res.status(400).json({ error }));
  };

// Editing a sauce
exports.modifySauce = (req, res, next) =>  {
    const sauceObject = req.file ?
    { 
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
    Sauce.updateOne({ _id: req.params.id}, {... sauceObject, _id: req.params.id})
    .then(() => {res.status(200).json({message: 'Modified object!'});})
    .catch(error => res.status(400).json({error}));
  };

// Removing a sauce
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id})
    .then((sauce) => {
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id})
        .then(() => res.status(200).json({message: 'Deleted object!'}))
        .catch(error => res.status(400).json({error}));
      });
    })
    .catch(error => res.status(500).json({error}));
  };

// Recovery of a single sauce thanks to the ID
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id})
    .then((sauce) => res.status(200).json(sauce))
    .catch(error => res.status(404).json({error}));
  };

// Retrieving the list of sauces
exports.getListe = (req, res, next) => {
    Sauce.find()
    .then((sauces) => res.status(200).json(sauces))
    .catch(error => res.status(400).json({error}));
  };

// Incrementation of LIKE & DISLIKES of sauces
exports.likeSauce = (req, res, next) => {
  switch (req.body.like) {
    // Défault = 0
    // Verification that the user does not already LIKE the sauce
    case 0:
      Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
          if (sauce.usersLiked.find(user => user === req.body.userId)) {
            Sauce.updateOne({ _id: req.params.id }, {
              $inc: { likes: -1 },
              $pull: { usersLiked: req.body.userId },
              _id: req.params.id
            })
              .then(() => { res.status(201).json({ message: 'Your opinion has been taken into account!' }); })
              .catch((error) => { res.status(400).json({ error: error }); });

              // Verification that the user does not already have DISLIKER the sauce
          } if (sauce.usersDisliked.find(user => user === req.body.userId)) {
            Sauce.updateOne({ _id: req.params.id }, {
              $inc: { dislikes: -1 },
              $pull: { usersDisliked: req.body.userId },
              _id: req.params.id
            })
              .then(() => { res.status(201).json({ message: 'Your opinion has been taken into account!' }); })
              .catch((error) => { res.status(400).json({ error: error }); });
          }
        })
        .catch((error) => { res.status(404).json({ error: error }); });
      break;
    //likes = 1
    case 1:
      Sauce.updateOne({ _id: req.params.id }, {
        $inc: { likes: 1 },
        $push: { usersLiked: req.body.userId },
        _id: req.params.id
      })
        .then(() => { res.status(201).json({ message: 'Your like has been taken into account!' }); })
        .catch((error) => { res.status(400).json({ error: error }); });
      break;
    //likes = -1
    case -1:
      Sauce.updateOne({ _id: req.params.id }, {
        $inc: { dislikes: 1 },
        $push: { usersDisliked: req.body.userId },
        _id: req.params.id
      })
        .then(() => { res.status(201).json({ message: 'Your dislike has been taken into account!' }); })
        .catch((error) => { res.status(400).json({ error: error }); });
      break;
    default:
      console.error('oops! bad request! ');
  }
};