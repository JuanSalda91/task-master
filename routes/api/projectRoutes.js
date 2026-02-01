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
        const savedProject = await newProject.save();
        // return created project
        res.status(201).json(savedProject);
    } catch (err) {
        console.error("Error in POST /projects:", err.message);
        res.status(500).json({ message: "Server error creating project" });
    }
});

// ===== GET ALL PROJECTS (for logged-in user) =====
// @route   GET /api/projects
// @desc    Get all projects owned by the logged-in user
// @access  Private (requires token)

router.get("/", authenticateToken, async (req, res) => {
    // 1. Query projects where user === req.user.userId
    // 2. Return array of projects

    try {
        //find all projects owned by this user
        const projects = await Project.find({ user: req.user.userId });
        //return the projects
        res.json(projects);
    } catch (err) {
        console.error("Error in GET /projects:", err.message);
        res.status(500).json({ message: "Server error finding projects" });
    }
});

// ===== GET SINGLE PROJECT =====
// @route   GET /api/projects/:id
// @desc    Get a single project by ID (with ownership check)
// @access  Private (requires token)

router.get("/:id", authenticateToken, async (req, res) => {
    // 1. Find project by ID
    // 2. Check if the logged-in user owns it
    // 3. If not owner -> return 403 "Forbidden"
    // 4. If owner -> return the project

    const { id } = req.params;

    try {
        //find project by id
        const project = await Project.findById(id);
        //check if proect exists
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }
        // check ownership: cover ID to strings for comparison
        if(project.user.toString() !== req.user.userId) {
            return res.status(403).json({ message: "Forbidden: You do not own this project" });
        }
        // return the project
        res.json(project);
    } catch (err) {
        console.error("Error in GET /projects/:id:", err.message);
        res.status(500).json({ message: "Server error fetching project" });
    }
});