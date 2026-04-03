const express = require('express');
const { getPublicTutors } = require('../controllers/tutorController');

const router = express.Router();

router.get('/', getPublicTutors);

module.exports = router;
