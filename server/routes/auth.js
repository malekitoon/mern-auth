const express = require('express');

// import controllers
const { signup, accountActivation, signin } = require('../controllers/auth');

// import validators
const { runValidation } = require('../validators');
const { userSignupValidator, userSigninValidator } = require('../validators/auth');

const router = express.Router();

router.post('/signup', userSignupValidator, runValidation, signup);
router.post('/account-activation', accountActivation); // TODO add req params validation
router.post('/signin', userSigninValidator, runValidation, signin);

module.exports = router;