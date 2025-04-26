const connectDB = require("../config/db");
const { connectToCloudinary } = require("../config/cloudinary");
const userRoute = require("../routes/user");

const express = require("express");
const app = express();
const cors = require("cors");

app.use(express.json());
app.use(cors());

connectDB();
connectToCloudinary();
app.use("/api/user", userRoute);

module.exports = app;
