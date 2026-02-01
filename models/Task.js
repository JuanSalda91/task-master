// 1. import mongoose to define schema/model
const mongoose = require('mongoose');
const { Schema } = mongoose;

// 2. define Task schema/model
const taskSchema = new Schema (
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            default: "",
            trim: true,
        },
        status: {
            type: String,
            enum: ["To Do", "In Progress", "Done"],
            default: "To Do",
        },
        project: {
            type: Schema.Types.ObjectId,
            ref: "Project",
            required: true,
        }
    },
    {
        timestamps: true,
    }
);

// 3. create and export task model
const Task = mongoose.model('Task', taskSchema);

module.exports = Task;