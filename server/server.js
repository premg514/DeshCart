// dev-server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const { connectToCloudinary } = require("./config/cloudinary");

const authroute = require("./routes/authRoutes");
const controlRoute = require("./routes/admin");
const userRoute = require("./routes/user");

const app = express();
app.use(express.json());
app.use(cors());

connectDB();
connectToCloudinary();

app.use("/api/auth", authroute);
app.use("/api/admin", controlRoute);
app.use("/api/user", userRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Local Dev Server running on port ${PORT}`));
