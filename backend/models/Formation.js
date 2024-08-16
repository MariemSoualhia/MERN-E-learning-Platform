const mongoose = require("mongoose");

const FormationSchema = new mongoose.Schema({
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
    enum: ["dev", "réseau", "gestion de projets"],
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "active", "rejected"],
    default: "pending",
  },
  dateDebut: {
    type: Date,
    required: true,
  },
  dateFin: {
    type: Date,
    required: true,
  },
  duree: {
    type: Number, // Durée en heures
    required: true,
  },
  prix: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
    default: "", // URL de l'image
  },
  formateur: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  meetLink: { type: String }, // Nouveau champ pour le lien Google Meet

  dateCreation: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Formation", FormationSchema);
