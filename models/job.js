// models/job.js
const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    qualifications: { type: String },
    postedBy: { type: String, required: true },
    deadline: { type: Date, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Job', jobSchema);
