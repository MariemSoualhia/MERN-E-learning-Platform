// models/Enrollment.js
const mongoose = require("mongoose");

const EnrollmentSchema = new mongoose.Schema({
  apprenant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  formation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Formation",
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    default: "pending",
  },
  progression: {
    type: Number,
    default: 0, // Progression en pourcentage, 0 à 100
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Enrollment", EnrollmentSchema);
