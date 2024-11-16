// controllers/jobController.js
const Job = require('../models/job'); // Ensure the model is correct

// Controller to add a job posting
const addJob = async (req, res) => {
    try {
        const { title, description, company, location, salary } = req.body;
        const job = new Job({ title, description, company, location, salary });
        await job.save();
        res.status(201).json({ message: 'Job added successfully', job });
    } catch (error) {
        console.error('Error adding job:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

// Controller to fetch all job listings
const getJobs = async (req, res) => {
    try {
        const jobs = await Job.find();
        res.status(200).json(jobs);
    } catch (error) {
        console.error('Error fetching jobs:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

// Controller to handle job applications
const applyToJob = async (req, res) => {
    try {
        const jobId = req.params.id;
        const { studentId } = req.body;

        const job = await Job.findById(jobId);
        if (!job) return res.status(404).json({ message: 'Job not found' });

        job.applicants.push(studentId); // Assuming `applicants` is an array field in your job model
        await job.save();

        res.status(200).json({ message: 'Application successful', job });
    } catch (error) {
        console.error('Error applying to job:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { addJob, getJobs, applyToJob };
