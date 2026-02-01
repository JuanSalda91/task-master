// 1. import core tools
const express = require('express');
const Project = require('../../models/Project.js');
const authenticateToken = require('../../utils/auth.js');

// 2. create router
const router = express.Router();

// All routes are protected by authenticateToken middleware
// User can only see/edit/delete projects they own
// req.user.userId is available after middleware

// ===== CREATE PROJECT =====
// @route   POST /api/projects
// @desc    Create a new project owned by the logged-in user
// @access  Private (requires token)

router.post("/", authenticateToken, async (req, res) => {
    // 1. Get name and description from req.body
    // 2. Get userId from req.user (provided by middleware)
    // 3. Create new Project with user reference
    // 4. Save to DB
    // 5. Return the created project

    // 1.get name and description
    const { name, description } = req.body

    try {
        //validate input
        if(!name) {
            return res.status(400).json({ message: "Project name is required" });
        }
        // create new project with logged-in user as owner
        const newProject = new Project({
            name,
            description: description || "",
            user: req.user.userId, //attach to current user
        });
        // save to database
        const savedProject = await newProject.sace();
        // return created project
        res.status(201).json(savedProject);
    } catch (err) {
        console.error("Error in POST /projects:", err.message);
        res.status(500).json({ message: "Server error creating project" });
    }
});