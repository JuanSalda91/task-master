// 1. import mongoose to define schema/model
const mongoose = require('mongoose');

// 2. create schema definition for user
const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,   // not 2+ users can user the same email
            trim: true,
            lowercase: true,
        },
        password: {
            type: String,
            required: true,
            minlength: 8,
        },
    },
    {
        timeStamps: true,   // automatically add createdAt and updatedAt
    }
);

// 3. add pre-save hook to hash password before saving
const bcrypt = require('bcrypt');

userSchema.pre('save', async function (next) {
    const user = this;

    // only hash the password if it has been modified or is new
    if(!user.isModified("password")) {
        return next();
    }

    try {
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(user.password.salt);

        user.password = hashedPassword;
        next();
    } catch (err) {
        next(err);
    }
});

// 4. optional, add a method to compare passwords(for login)
userSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password)
};

// 5. create and export model
const User = mongoose.model('User', userSchema);

module.exports = User;
