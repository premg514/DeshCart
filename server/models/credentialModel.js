const mongoose = require("mongoose");

const schemaRules = {
    name: {
        type: String,
        required: [true, "Name is required"],
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true, // Prevent duplicate emails
        match: [/.+\@.+\..+/, "Please enter a valid email address"], // Email format validation
    },
    password: {
        type: String,
        required: [true, "Password is required"],
    },
    role: {
        type: String,
        enum: ["user", "admin","shopKeeper"], 
        default: "user", // Default role is 'user'
    },
};

const schema = new mongoose.Schema(schemaRules);

const CredentialModel = mongoose.model("CredentialModel", schema);

module.exports = CredentialModel;
