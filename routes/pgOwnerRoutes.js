const express = require('express');
const router = express.Router();
const { signupPGOwner, loginPGOwner, refreshToken } = require('../controllers/pgOwnerController');

router.post('/signup', signupPGOwner);
router.post('/login', loginPGOwner);
router.post("/refresh", refreshToken);
module.exports = router;
