const User = require("../models/User");
const bcrypt = require("bcryptjs");

// Actions spécifiques aux administrateurs
exports.adminAction = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Erreur serveur");
  }
};

// Actions spécifiques aux formateurs
exports.formateurAction = async (req, res) => {
  try {
    const formateur = await User.findById(req.user.id);
    res.json({
      message: "Action spécifique au formateur exécutée",
      specialty: formateur.specialty,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Erreur serveur");
  }
};

// Actions spécifiques aux apprenants
exports.apprenantAction = async (req, res) => {
  try {
    res.send("Action spécifique à l'apprenant exécutée");
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Erreur serveur");
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  console.log("hhhhhhhhhhhhhh");
  const { name, phone, specialty } = req.body;
  const userId = req.params.id;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.name = name || user.name;
    user.phone = phone || user.phone;
    if (user.role === "formateur") {
      user.specialty = specialty || user.specialty;
    }

    await user.save();
    res.json({ user });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Change user password
exports.changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.params.id;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    await user.save();
    res.json({ message: "Password changed successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Update profile picture
exports.updateProfilePicture = async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.photoProfil = req.file.path;

    await user.save();
    res.json({ user });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
