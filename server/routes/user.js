const express = require('express');
const { requireSignin } = require('../controllers/auth');

// import controllers
const { read } = require('../controllers/user');

const router = express.Router();

router.get('/user/:id', requireSignin, read);

module.exports = router;