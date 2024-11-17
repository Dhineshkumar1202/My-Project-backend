const express = require('express');
const router = express.Router();
const Application = require('../models/application');
router.post('/', async (req, res) => {
  const { studentId, companyName, jobTitle } = req.body;
  try {
    const application = new Application({ studentId, companyName, jobTitle });
    await application.save();
    res.status(201).json(application);
  } catch (error) {
    console.error(error); 
    res.status(500).json({ message: 'Server error', error: error.message }); 
  }
});
const handleSubmit = async (e) => {
  e.preventDefault();
  console.log('Submitting:', { studentId, companyName, jobTitle }); 
  try {
    const response = await axios.post('https://my-project-backend-ssaj.vercel.app/api/applications/', { studentId, companyName, jobTitle });
    if (response.status === 201) {
      alert('Application submitted successfully');
      setStudentId('');
      setCompanyName('');
      setJobTitle('');
    }
  } catch (error) {
    setError('Failed to submit the application. Please try again later.');
    console.error(error); 
  }
};

module.exports = router;
