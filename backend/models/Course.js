const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  specialty: {
    type: String,
    enum: ["réseau", "dev", "gestion de projets"],
    required: true,
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  status: {
    type: String,
    enum: ["en attente", "active", "rejetée"],
    default: "en attente",
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Course", CourseSchema);
