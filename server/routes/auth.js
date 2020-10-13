const express = require('express');

// import controllers
const { signup } = require('../controllers/auth');

// import validators
const { runValidation } = require('../validators');
const { userSignupValidator } = require('../validators/auth');

const router = express.Router();

router.post('/signup', userSignupValidator, runValidation, signup);

module.exports = router;