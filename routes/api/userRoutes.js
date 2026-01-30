// 1. import core tools and User model
const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../../models/User.js');
const bcrypt = require('bcrypt');

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
            .json({ message: "User with this email already exists" });
        }

        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 4. create new user
        const newUser = new User ({
            username,
            email,
            password: hashedPassword, // plain texy here will be hashed by pre-save hook
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
router.post("/login", async (req, res) => {

    // 1. Get email and password from req.body
    // 2. Find user by email
    // 3. If not found -> 400 "Invalid credentials"
    // 4. Compare provided password with stored hash using comparePassword
    // 5. If mismatch -> 400 "Invalid credentials"
    // 6. If match -> sign a JWT with user id
    // 7. Return token + basic user info

    // 1. get email and password from req.body
    const { email, password } = req.body;
    try {
        // 2. find user by email
        const user = await User.findOne({ email });
        if(!user) {
            // 3. If not found -> 400 "Invalid credentials" (Bad Request error)
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // 4. compare passwords
        const isMatch = await user.comparePassword(password);
        if(!isMatch) {
            // 5. If mismatch -> 400 "Invalid credentials" (Bad Rquest)
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // 6. build payload for JWT
        const payload = {
            userId: user._id,
        };

        // 7. Sign JWT
        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });
        res.json({
            token,
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
            }
        })
    } catch (err) {
        console.error("Error in /login:", err.message);
        res.status(500).json({ message: "Server error during login" });
    }
});
// - use User model's pre-save hook to hash passwords
// - use comparePassword method to verify login

module.exports = router;