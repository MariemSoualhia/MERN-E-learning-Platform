const express = require("express");
const mongoose = require("mongoose");
const connectDB = require("./db");
const authRoutes = require("./routes/auth");
const courseRoutes = require("./routes/courses");

const userRoutes = require("./routes/user");

const app = express();

// Middleware
app.use(express.json());
connectDB();
// Routes
app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);

app.use("/api/users", userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
