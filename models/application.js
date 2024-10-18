const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  studentId: { type: String, ref: 'Student', required: true },
  companyName: { type: String, required: true },
  jobTitle: { type: String, required: true },
  applicationDate: { type: Date, default: Date.now },
  status: { type: String, default: 'Pending' },
});

const Application = mongoose.model('Application', applicationSchema);

module.exports = Application;
