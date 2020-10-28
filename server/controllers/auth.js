const User = require('../models/User');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const _ = require('lodash');
const { OAuth2Client } = require('google-auth-library');
const { sendEmailWithNodemailer } = require('../helpers/email');

exports.signup = (req, res) => {
  const { name, email, password } = req.body;

  User
    .findOne({ email })
    .exec((err, user) => {
      if (user) {
        return res.status(400).json({ error: 'Email is taken'});
      }

      const token = jwt.sign(
        { name, email, password },
        process.env.JWT_ACCOUNT_ACTIVATION,
        { expiresIn: '10m' },
      );
    
      const emailData = {
        from: 'MERN-AUTH <process.env.GMAIL_EMAIL>',
        to: email,
        subject: 'Account activation link',
        html: `
          <h1>Please use this link to activate your account</h1>
          <p>${process.env.CLIENT_URL}/auth/activate/${token}</p>
          <hr />
          <p>This email may contain sensitive information</p>
          <p>${process.env.CLIENT_URL}</p>
        `,
      };
    
      sendEmailWithNodemailer(req, res, emailData);
    });
};

exports.accountActivation = (req, res) => {
  const { token } = req.body;

  if (token) {
    jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION, function(err, decoded) {
      if(err) {
        console.log('JWT account activation error');
        return res.status(401).json({ error: 'Expired link. Sign up again.' })
      }

      const { name, email, password } = jwt.decode(token, process.env.JWT_ACCOUNT_ACTIVATION);

      const newUser = new User({ name, email, password });

      newUser.save((err, user) => {
        if (err) {
          console.log('SAVE USER IN ACCOUNT ACTIVATION ERROR', err);
          // TODO add check that user with such email is already present in db
          return res.status(401).json({ error: 'Error saving user in database. Try signup again.'});
        }
        return res.json({ message: 'Signup success. Please signin.' });
      });
    });
  } else {
    return res.json({ message: 'Something went wrong. Try again.' });
  }
};

exports.signin = (req, res) => {
  const { email, password } = req.body;

  // check if user exists
  User
    .findOne({ email })
    .exec((err, user) => {
      if (err || !user) {
        return res.status(400).json({ error: 'User with that email does not exist'});
      }

      if(!user.authenticate(password)) {
        return res.status(400).json({ error: 'Email and password do not match' });
      }

      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

      const { _id, name, email, role } = user;

      return res.json({ token, user: { _id, name, email, role }});
    });
};

exports.requireSignin = expressJwt({
  secret: process.env.JWT_SECRET, // req.user
  algorithms: ['HS256'],
});

exports.adminMiddleware = (req, res, next) => {
  User
    .findById(req.user._id)
    .exec((err, user) => {
      if (err || !user) {
        return res.status(400).json({ error: 'User not found'});
      }

      if (user.role !== 'admin') {
        return res.status(400).json({ error: 'Admin resourse. Access denied.'});
      }

      req.profile = user;

      next();
    })
};

exports.forgotPassword = (req, res) => {
  const { email } = req.body;

  User.findOne({ email })
    .exec((err, user) => {
      if (err || !user) {
        res.status(400).json({ error: 'User with that email does not exist' });
      }

      const token = jwt.sign(
        { _id: user._id, name: user.name },
        process.env.JWT_RESET_PASSWORD,
        { expiresIn: '10m' },
      );

      user.updateOne({ resetPasswordLink: token })
        .exec((err, success) => {
          if (err) {
            console.log(err);
            return res.status(400).json({ error: 'Database connection error on reset password request'});
          } else {
            const emailData = {
              from: 'MERN-AUTH <process.env.GMAIL_EMAIL>',
              to: email,
              subject: 'Password reset link',
              html: `
                <h1>Please use this link to reset your password</h1>
                <p>${process.env.CLIENT_URL}/auth/password/reset/${token}</p>
                <hr />
                <p>This email may contain sensitive information</p>
                <p>${process.env.CLIENT_URL}</p>
              `,
            };
          
            sendEmailWithNodemailer(req, res, emailData);
          }
        });
    })
};

exports.resetPassword = (req, res) => {
  const { resetPasswordLink, newPassword } = req.body;

  jwt.verify(resetPasswordLink, process.env.JWT_RESET_PASSWORD, function(err, decoded) {
    if (err) {
      return res.status(400).json({ error: 'Expired link. Try again.' }); 
    }

    User.findOne({ resetPasswordLink })
      .exec((err, user) => {
        if (err || !user) {
          // TODO add err msg for expired links when user not found by the reset link
          return res.status(400).json({ error: 'Something went wrong. Try later.' });
        }

        const updatedFields = {
          password: newPassword,
          resetPasswordLink: '',
        };

        user = _.extend(user, updatedFields);

        user.save((err, user) => {
          if (err) {
            return res.status(400).json({ error: 'Error resetting password' });
          }

          return res.json({ message: 'Great! Now you can login with your new password' });
        })
      })
  });
};

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
exports.googleLogin = (req, res) => {
  const { idToken } = req.body;
  client.verifyIdToken({ idToken, audience: process.env.GOOGLE_CLIENT_ID })
    .then(response => {
      console.log('GOOGLE LOGIN SUCCESS', response);
      const { email_verified, name, email } = response.payload;
      if (email_verified) {
        User.findOne({ email })
          .exec((err, user) => {
            if (user) {
              const { _id, email, name, role } = user;
              const token = jwt.sign({ _id }, process.env.JWT_SECRET, { expiresIn: '7d' });
              return res.json({ token, user: { _id, name, email, role } });
            } else {
              let password = email + process.env.JWT_SECRET;
              user = new User({ name, email, password });
              user.save((err, data) => {
                if (err) {
                  return res.status(400).json({ error: 'User signup failed with google' });
                }
                const { _id, email, name, role } = data;
                const token = jwt.sign({ _id }, process.env.JWT_SECRET, { expiresIn: '7d' });
                return res.json({ token, user: { _id, name, email, role } });
              })
            }
          })
      } else {
        return res.status(400).json({ error: 'Google login failed. Try again.' });
      }
    });
};

// exports.signup = (req, res) => {
//   const { name, email, password } = req.body;

//   User
//     .findOne({ email })
//     .exec((err, user) => {
//       if (user) {
//         return res.status(400).json({ error: 'Email is taken'});
//       }

//       let newUser = new User({ name, email, password });

//       newUser.save((err, success) => {
//         if (err) {
//           console.log('SIGNUP ERROR', err);
//           return res.status(400).json({ error: err });
//         }

//         return res.json({
//           message: 'Sing up success! Please sign in'
//         })
//       });
//     });
// };