
const express = require('express');
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user'); // Import the User model

const router = express.Router();

// Signup Route
router.post('/signup', [
    check('name', 'Name is required').notEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password must be at least 6 characters long').isLength({ min: 6 }),
    check('role', 'Role must be "admin" or "student"').optional().isIn(['admin', 'student']),
], async (req, res) => {
    const errors = validationResult(req);
    
    // If validation errors occur, return them
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: errors.array().map(error => error.msg).join(', '),
        });
    }

    const { name, email, password, role } = req.body;

    try {
        // Check if the user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({
                success: false,
                message: 'User already exists with this email',
            });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        user = new User({
            name,
            email,
            password: hashedPassword,
            role: role || 'student', // default role is 'student' if not provided
        });

        // Save the user to the database
        const savedUser = await user.save();

        // Generate JWT token
        const token = jwt.sign({ id: savedUser._id, role: savedUser.role }, process.env.JWT_SECRET, {
            expiresIn: '1h', // Token expires in 1 hour
        });

        // Send success response
        return res.status(201).json({
            success: true,
            message: 'Signup successful',
            token,
            user: {
                id: savedUser._id,
                name: savedUser.name,
                email: savedUser.email,
                role: savedUser.role,
            },
        });
    } catch (error) {
        console.error('Signup error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
});

// Login Route
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, message: "No user found with this email" });
        }

        // Compare password with stored hash
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Incorrect password" });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });

        // Send response with token and user details
        return res.json({
            success: true,
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            }
        });
    } catch (err) {
        console.error('Login error:', err.message);
        return res.status(500).json({ success: false, message: "Server error" });
    }
});

module.exports = router;
