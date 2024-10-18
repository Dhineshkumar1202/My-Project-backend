const express = require('express');
const router = express.Router();
const Student = require('../models/student');


router.post('/', async (req, res) => {
  const { name, email, department, graduationYear } = req.body;
  try {
    const student = new Student({ name, email, department, graduationYear });
    await student.save();
    res.status(201).json(student);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/', async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
