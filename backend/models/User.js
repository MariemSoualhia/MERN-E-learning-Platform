const mongoose = require("mongoose");

const defimg =
  "https://cdn.pixabay.com/photo/2017/03/21/13/27/evil-2162179_640.png";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email address",
      ],
      index: true,
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
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
    },
    resetPasswordToken: {
      type: String,
    },
    resetPasswordExpires: {
      type: Date,
    },
    phoneNumber: {
      type: String,
    },
    address: {
      street: { type: String },
      city: { type: String },
      state: { type: String },
      zipCode: { type: String },
      country: { type: String },
    },
    bio: {
      type: String,
      maxlength: 500,
    },
    socialLinks: {
      facebook: { type: String },
      twitter: { type: String },
      linkedIn: { type: String },
      github: { type: String },
    },
    notifications: {
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: false },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", UserSchema);
