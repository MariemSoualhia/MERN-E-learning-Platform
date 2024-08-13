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

// Récupérer tous les formateurs
exports.getFormateurs = async (req, res) => {
  try {
    const formateurs = await User.find({ role: "formateur" }).select(
      "name email specialty"
    );
    res.json(formateurs);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Erreur du serveur");
  }
};

// CRUD pour formateurs
exports.createFormateur = async (req, res) => {
  const { name, email, password, specialty } = req.body;
  try {
    const newUser = new User({
      name,
      email,
      password,
      role: "formateur",
      specialty,
    });

    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(password, salt);

    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Erreur du serveur");
  }
};

exports.updateFormateur = async (req, res) => {
  const { name, email, specialty } = req.body;
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "Formateur non trouvé" });
    }

    user.name = name || user.name;
    user.email = email || user.email;
    user.specialty = specialty || user.specialty;

    await user.save();
    res.json(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Erreur du serveur");
  }
};

exports.deleteFormateur = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "Formateur non trouvé" });
    }

    await user.remove();
    res.json({ message: "Formateur supprimé" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Erreur du serveur");
  }
};

// CRUD pour apprenants
exports.createApprenant = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const newUser = new User({ name, email, password, role: "apprenant" });

    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(password, salt);

    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Erreur du serveur");
  }
};

exports.updateApprenant = async (req, res) => {
  const { name, email } = req.body;
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "Apprenant non trouvé" });
    }

    user.name = name || user.name;
    user.email = email || user.email;

    await user.save();
    res.json(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Erreur du serveur");
  }
};

exports.deleteApprenant = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "Apprenant non trouvé" });
    }

    await user.remove();
    res.json({ message: "Apprenant supprimé" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Erreur du serveur");
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
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
// Récupérer les utilisateurs avec un filtrage par rôle
exports.getUsersByRole = async (req, res) => {
  try {
    const { role } = req.query;
    const filter = {};

    if (role) {
      filter.role = role;
    }

    const users = await User.find(filter).select("name email role specialty");
    res.json(users);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Erreur du serveur");
  }
};
