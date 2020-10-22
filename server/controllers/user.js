const User = require('../models/User');
const jwt = require('jsonwebtoken');

exports.read = (req, res) => {
  const userId = req.params.id;
  User.findById(userId)
    .exec((err, user) => {
      if (err || !user) {
        return res.status(400).json({ error: 'User not found' });
      }

      user.hashed_password = undefined;
      user.salt = undefined;
      
      return res.json(user);
    })
};

exports.update = (req, res) => {
  const { name, password } = req.body;

  User.findById(req.user._id)
    .exec((err, user) => {
      if (err || !user) {
        res.status(400).json({ error: 'User not found' });
      }

      if (!name) {
        return res.status(400).json({ error: 'Name is required' });
      } else {
        user.name = name;
      }

      if (password) {
        if (password.length < 6) {
          return res.status(400).json({ error: 'Password must be min 6 characters long' });
        } else {
          user.password = password;
        }
      }

      user.save((err, updatedUser) => {
        if (err) {
          return res.status(400).json({ error: 'User update failed' });
        }

        updatedUser.hashed_password = undefined;
        updatedUser.salt = undefined;
        
        return res.json(updatedUser);
      });
    })
};
