const express = require('express');

// import controllers
const { signup, accountActivation, signin, forgotPassword, resetPassword, googleLogin } = require('../controllers/auth');

// import validators
const { runValidation } = require('../validators');
const {
  userSignupValidator,
  userSigninValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
} = require('../validators/auth');

const router = express.Router();

router.post('/signup', userSignupValidator, runValidation, signup);
router.post('/account-activation', accountActivation); // TODO add req params validation
router.post('/signin', userSigninValidator, runValidation, signin);

router.put('/forgot-password', forgotPasswordValidator, runValidation, forgotPassword);
router.put('/reset-password', resetPasswordValidator, runValidation, resetPassword);

router.post('/google-login', googleLogin);

module.exports = router;