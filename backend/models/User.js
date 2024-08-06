const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["admin", "formateur", "apprenant"],
    default: "apprenant",
  },
  specialty: {
    type: String,
    enum: ["réseau", "dev", "gestion de projets"],
    required: function () {
      return this.role === "formateur";
    },
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("User", UserSchema);
