const express = require("express");
const mongoose = require("mongoose");
const connectDB = require("./db");
const app = express();

// Middleware
app.use(express.json());

// Routes
connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
