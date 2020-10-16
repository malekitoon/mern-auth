const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { sendEmailWithNodemailer } = require('../helpers/email');

exports.signup = (req, res) => {
  const { name, email, password } = req.body;

  User
    .findOne({ email })
    .exec((err, user) => {
      if (user) {
        return res.status(400).json({ error: 'Email is taken'});
      }
    });

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