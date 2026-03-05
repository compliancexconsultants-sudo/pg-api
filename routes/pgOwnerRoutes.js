const express = require('express');
const router = express.Router();
const { signupPGOwner, loginPGOwner } = require('../controllers/pgOwnerController');

router.post('/signup', signupPGOwner);
router.post('/login', loginPGOwner);

module.exports = router;
