const connectDB = require("../config/db");
const { connectToCloudinary } = require("../config/cloudinary");
const controlRoute = require("../routes/admin");

const express = require("express");
const app = express();
const cors = require("cors");

app.use(express.json());
app.use(cors());

connectDB();
connectToCloudinary();
app.use("/api/admin", controlRoute);

module.exports = app;
