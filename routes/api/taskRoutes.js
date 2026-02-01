// 1. import core tool
const express = require('express');
const Task = require("../../models/Task.js");
const Project = require("../../models/Projects.js");
const authenticateToken = require("../../utils/auth.js");

// 2. create router
const router = express.Router();

// Tasks are nested under projects
// All routes require: authentication + ownership check on parent project
// User can only create tasks in projects they own
// User can only read/update/delete tasks in projects they own

// ===== CREATE TASK (nested route) =====
// @route   POST /api/projects/:projectId/tasks
// @desc    Create a new task for a specific project
// @access  Private (requires token + user must own project)

router.post("/projects/:projectId/tasks", authenticateToken, async (req, res) => {

    // 1. Get projectId from params, ant title, description, and status from req.body
    // 2. Find project by ID
    // 3. Check if project exists
    // 4. Check if logged-in user owns this project
    // 5. Get title, description, status from req.body
    // 6. Create new Task with project reference
    // 7. Save and return

    // 1. get project id/title, description, status
    const { projectId } = req.params;
    const { title, description, status } = req.body;

    try {
        //2. find project
        const project = await Project.findById(projectId);
        //3. check if project exist
        if(!project) {
            return status(404).json({ mesage: "Project not found" });
        }
        //4. check ownership, user must own the project
        if(project.user.toString() !== req.user.userId) {
            return res.status(403).json({ message: "Forbidden: You do not own this project, cannot add tasks" });
        }
        //5. validate input
        if(!title) {
            return res.status(400).json({ message: "Task title is required" });
        }
        //6. create new task with project reference
        const newTask = new Task({
            title,
            description: description || "",
            status: status || "To Do",
            project: projectId,
        });
        //7. save to database
        const savedTask = await newTask.save();
        // return created task
        res.status(201).json(savedTask);
    } catch (err) {
        console.error("Error in POST /projects/:projectId/tasks:", err.message);
        res.status(500).json({ message: "Server error creating task" });
    }
});

// ===== GET TASKS FOR PROJECT (nested route) =====
// @route   GET /api/projects/:projectId/tasks
// @desc    Get all tasks for a specific project
// @access  Private (requires token + user must own project)

router.get("/projects/:projectId/tasks", authenticateToken, async (req,res) => {
    // 1. Get projectId from params
    // 2. Find project by ID
    // 3. Check ownership
    // 4. Find all tasks for this project
    // 5. Return array of tasks

    //1. get project by id
    const { projectId } = req.params;

    try {
        //2. find project
        const project = await Project.findbyId(projectId);

        if (!project) {
            return res.status(404).json({ message: "Project not ofund" });
        }
        //3. check ownership
        if (project.user.toString() !== req.user.userId) {
            return res(403).json({ message: "Forbidden: You do not own this project, cannot view task" });
        }
        //4. fin all tasks for this project
        const tasks = await Task.find({ project: projectId });
        //5. return tasks
        res.json(tasks);
    } catch (err) {
        console.error("Error in GET /projects/:projectId/tasks", err.message);
        res.status(500).json({ messsage: "Server error fetching tasks" });
    }
});