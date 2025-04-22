require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const authroute = require("./routes/authRoutes");
const controlRoute = require("./routes/admin");
const userRoute = require("./routes/user");
const path = require("path");
const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// Connect to MongoDB
connectDB();

// Routes
app.use("/api/auth", authroute);
app.use("/api/admin", controlRoute);
app.use("/api/user", userRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));