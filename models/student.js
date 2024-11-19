const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  graduationYear: { type: Number, required: true },
  department: { type: String, required: true },
  applications: [
    {
      resume: String,
      coverLetter: String,
      personalDetails: {
        phone: String,
        address: String,
        college: String,
      },
      status: { type: String, default: 'submitted' },
      interviewSchedule: { type: String, default: null },
    },
  ],
});

// Hash password before saving
studentSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

module.exports = mongoose.model('Student', studentSchema);
