const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const http = require("http");
const { Server } = require("socket.io");
const connectDB = require("./db");
const authRoutes = require("./routes/auth");
const courseRoutes = require("./routes/courses");
const userRoutes = require("./routes/user");
const formationRoutes = require("./routes/formation");
const socket = require("./socket");

const app = express();
const server = http.createServer(app);
const io = socket.init(server);

// Middleware
app.use(cors());
app.use(express.json());
connectDB();

// Socket.io connection
io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

// Routes
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/users", userRoutes);
app.use("/api/formations", formationRoutes);

app.get("/static-images/:filename", (req, res) => {
  const filename = req.params.filename;
  const resolvedFilePath = path.join(__dirname, "uploads", filename);

  fs.access(resolvedFilePath, fs.constants.F_OK, (err) => {
    if (err) {
      console.error(`File not found: ${resolvedFilePath}`);
      return res.status(404).send("Image not found");
    }
    res.sendFile(resolvedFilePath);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
