const express = require('express');
const {
  registerStudent,
  loginStudent,
} = require('../controllers/studentController');

const router = express.Router();

// Public Routes
router.post('/register', registerStudent);
router.post('/login', loginStudent);

module.exports = router;
