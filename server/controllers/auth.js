const User = require('../models/User');

exports.signup = (req, res) => {
  const { name, email, password } = req.body;

  User
    .findOne({ email })
    .exec((err, user) => {
      if (user) {
        return res.status(400).json({ error: 'Email is taken'});
      }

      let newUser = new User({ name, email, password });

      newUser.save((err, success) => {
        if (err) {
          console.log('SIGNUP ERROR', err);
          return res.status(400).json({ error: err });
        }

        return res.json({
          message: 'Sing up success! Please sign in'
        })
      });
    });
};