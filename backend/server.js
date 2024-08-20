const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const http = require("http");
const { Server } = require("socket.io");
const bcrypt = require("bcryptjs");
const connectDB = require("./db");
const User = require("./models/User");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const formationRoutes = require("./routes/formation");
const contactRoutes = require("./routes/contact");

const socket = require("./socket");
require("dotenv").config();

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

// Fonction pour créer un administrateur par défaut
const createDefaultAdmin = async () => {
  try {
    const adminEmail = "admin@gmail.com";
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (!existingAdmin) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash("admin", salt);

      const admin = new User({
        name: "Admin User",
        email: adminEmail,
        password: hashedPassword,
        role: "admin",
      });

      await admin.save();
      console.log("Default admin created");
    } else {
      console.log("Admin already exists");
    }
  } catch (error) {
    console.error("Error creating default admin:", error.message);
  }
};

// Appeler la fonction de création d'admin après la connexion à la base de données
connectDB().then(createDefaultAdmin);

// Routes
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/formations", formationRoutes);
app.use("/api/contact", contactRoutes);

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
