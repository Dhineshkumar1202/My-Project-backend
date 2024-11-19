const Student = require('../models/student');
const jwt = require('jsonwebtoken');

// Register Student
const registerStudent = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const student = await Student.create({ name, email, password });
    const token = jwt.sign({ id: student._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });
    res.status(201).send({ token, student });
  } catch (error) {
    res.status(400).send({ message: 'Error creating student', error });
  }
};

// Login Student
const loginStudent = async (req, res) => {
  const { email, password } = req.body;

  try {
    const student = await Student.findOne({ email });
    if (!student) return res.status(404).send({ message: 'Student not found' });

    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) return res.status(401).send({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: student._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });
    res.status(200).send({ token, student });
  } catch (error) {
    res.status(500).send({ message: 'Error logging in', error });
  }
};

module.exports = { registerStudent, loginStudent };
