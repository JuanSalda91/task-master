// 1. import core tools and User model
const express = require('express');
const jwt = require('jsonwebtoken');
const user = require('../../models/User.js');

// 2. create a router instance
const router = express.Router();

// - POST /api/users/register -> create new user (Registration Endpoint)
router.post("/register", async (req, res) => {

    // 1. Get username, email, password from req.body
    // 2. Check if a user with that email already exists
    // 3. If exists -> send 400 error (Bad request)
    // 4. If not -> create new User instance
    // 5. Save user (pre-save hook will hash password)
    // 6. Respond with basic user info (never password)

    // 1. Get username, email, password from req.body
    const { username, email, password } = req.body;
    try {
        // 2. check for existing user by email
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res
            // 3. if exist, send error 400
            .status(400)
            .json({ message: "user with this email already exists" });
        }

        // 4. create new user
        const newUser = new User ({
            username,
            email,
            password, // plain texy here will be hashed by pre-save hook
        });

        // 5. save user to DB (triggers pre-save hook)
        const savedUser = await newUser.save();

        // 6. return user info (omit password)
        res.status(201).json({
            _id: savedUser._id,
            username: savedUser.username,
            emaile: savedUser.email,
        });
    } catch (err) {
        console.error("Error in /register:", err.message);
        res.status(500).json({ message: "Server error during registration" });
    }
});
// - POST /api/users/login -> authenticate and return JWT (Login Endpoint)
// - use User model's pre-save hook to hash passwords
// - use comparePassword method to verify login