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
        status: {
            type: Schema.Types.ObjectId,
            ref: 'Project', // model name from Project.js
            required: true, // every task must belong to a project
        },
    },
    {
        timeStamps: true,
    }
);

// 3. create and export task model
const Task = mongoose.model('Task', taskSchema);

module.exports = Task;