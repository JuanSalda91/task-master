// 1. imoprt mongoosee to defime schema/model
const mongoose = require('mongoose');
const { Schema } = mongoose;

// 2. define project schema
const projectSchema = new Schema (
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            default: "",
            trim: true,
        },
        user: {
            // here's were project links to the user who owns it
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    {
        timestamps: true, // createdAt / updatedAt
    }
);

// 3. create and export project model
const Project = mongoose.model('Project', projectSchema);

module.exports = projects;