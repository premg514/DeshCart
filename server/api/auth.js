const connectDB = require("../config/db");
const { connectToCloudinary } = require("../config/cloudinary");
const authroute = require("../routes/authRoutes");

const express = require("express");
const app = express();
const cors = require("cors");

app.use(express.json());
app.use(cors());

connectDB();
connectToCloudinary();
app.use("/api/auth", authroute);

module.exports = app;
