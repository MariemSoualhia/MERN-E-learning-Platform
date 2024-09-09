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
    enum: ["en attente", "active", "rejetée"],
    default: "en attente",
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
  image: {
    type: String,
    default: "", // URL de l'image
  },
  formateur: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  meetLink: {
    type: String,
  },
  quiz: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Quiz",
  },
  dateCreation: {
    type: Date,
    default: Date.now,
  },
  apprenants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  quizSubmissions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "QuizSubmission",
    },
  ],
  videos: [
    {
      url: {
        type: String,
        required: false,
      },
      title: {
        type: String,
        required: false,
      },
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  niveau: {
    type: String,
    enum: ["débutant", "intermédiaire", "avancé"], // Nouveau champ niveau
    required: true,
  },
});

module.exports = mongoose.model("Formation", FormationSchema);
