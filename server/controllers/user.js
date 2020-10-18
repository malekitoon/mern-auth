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
