const mongoose = require("mongoose");
const defimg =
  "https://cdn.pixabay.com/photo/2017/03/21/13/27/evil-2162179_640.png";
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
  photoProfil: {
    type: String,
    default: defimg,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("User", UserSchema);
