const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv').config()
const CredentialModel = require("../models/credentialModel")

const signUp = async (req, res) => {
    const { name, email, role, password } = req.body;
    try {
        let user = await CredentialModel.findOne({ email });
        if (user) return res.status(400).json({ message: "User already exists" });
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)
        user = new CredentialModel({ name, email, role, password: hashedPassword })
        await user.save()
        res.status(201).json({
            message: `${role} created successfully!`
        })
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
}

const login = async (req, res) => {
    const { email, role, password } = req.body
    try {
        let user = await CredentialModel.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid credentials" });
        let isRole = user.role === role
        if (!isRole) return res.status(400).json({ message: "Role is not matched with this user" });
        let isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
        res.status(201).json({
            message: `login successfully!`,
            token,
            user
        })

    } catch (e) {
        res.status(500).json({ message: "Server error", e });
    }
}

module.exports = { signUp, login }