const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const connectDB = require("./db");
const authRoutes = require("./routes/auth");
const courseRoutes = require("./routes/courses");

const userRoutes = require("./routes/user");
const formationRoutes = require("./routes/formation");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
connectDB();
// Routes
// Servir les fichiers statiques du répertoire 'uploads'
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);

app.use("/api/users", userRoutes);
app.use("/api/formations", formationRoutes);
// Créez un chemin absolu pour le dossier des uploads
const uploadsDir = path.join(__dirname, "uploads");

// Middleware pour servir les fichiers statiques
app.use("/uploads", express.static(uploadsDir));

// Ajouter cette route pour servir les images
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
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
