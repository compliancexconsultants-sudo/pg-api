const express = require('express');
const router = express.Router();
const { setupPG } = require('../controllers/pgController');

router.post('/setup', setupPG);

module.exports = router;
