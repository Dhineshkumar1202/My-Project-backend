const express = require('express');
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');


const router = express.Router();
// Signup Route
router.post('/signup', [
    check('name', 'Name is required').notEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password must be at least 6 characters long').isLength({ min: 6 }),
    check('role', 'Role must be "admin" or "student"').optional().isIn(['admin', 'student']),
], async (req, res) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: errors.array().map(error => error.msg).join(', '),
        });
    }

    const { name, email, password } = req.body;
    
    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            name,
            email: email.trim(),
            password: hashedPassword,
            role: "student",
        });

        const save = await user.save();

        if (save) {
            const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
                expiresIn: '1h',
            });
            return res.status(201).json({
                success: true,
                message: 'Signup successful',
                token,
                user: { id: user._id, name: user.name, email: user.email, role: user.role },
            });
        } else {
            return res.status(400).json({
                success: false,
                message: 'Failed to save user',
            });
        }
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
        console.log('Request Body:', req.body); // Debugging: Check what is being sent to the server

        // Find the user by email
        const user = await User.findOne({ email }).exec();
        console.log('User from DB:', user); // Debugging: Log the user found in DB

        if (!user) {
            return res.status(400).json({ success: false, message: "No user found" });
        }

        // Compare the entered password with the stored password (bcrypt hash)
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(400).json({ success: false, message: "Wrong password" });
        }

        // If passwords match, generate a JWT token
        const token = jwt.sign({ _id: user._id, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });

        // Optionally, remove the password from the user object before sending it back
        user.password = undefined;

        // Send the response with user data and token
        res.json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            }
        });
    } catch (err) {
        console.error('Login error:', err);
        return res.status(500).json({ success: false, message: "Server error" });
    }
});


module.exports = router;
