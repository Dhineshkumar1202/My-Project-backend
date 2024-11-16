const express = require("express");
const Job = require("../models/job"); // Import Job model
const { isAdmin } = require("../middleware/auth"); // Middleware for admin check
const router = express.Router();

// Add a new job (Admin only)
router.post("/jobs",async (req, res) => {
    const { title, description, qualifications, deadline } = req.body;
    try {
        const job = new Job({
            title,
            description,
            qualifications,
            postedBy: req.user.name, // Assuming the admin's name is in req.user
            deadline,
        });
        await job.save();
        res.status(201).json({ message: "Job created successfully", job });
    } catch (error) {
        console.error("Error creating job:", error.message);
        res.status(500).json({ error: "Failed to create job" });
    }
});

// Get all jobs (Accessible to all)
router.get("/jobs", async (req, res) => {
    try {
        const jobs = await Job.find();
        res.status(200).json(jobs);
    } catch (error) {
        console.error("Error fetching jobs:", error.message);
        res.status(500).json({ error: "Failed to fetch jobs" });
    }
});

// Apply to a job (Students only)
router.post("/jobs/:id/apply", async (req, res) => {
    const { studentId, resume } = req.body;
    const jobId = req.params.id;

    try {
        // You can create logic to add this application in an "applications" collection
        res.status(200).json({ message: `Application submitted for Job ID: ${jobId}` });
    } catch (error) {
        console.error("Error applying to job:", error.message);
        res.status(500).json({ error: "Failed to apply to job" });
    }
});

module.exports = router;
