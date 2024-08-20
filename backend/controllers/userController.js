const User = require("../models/User");
const Formation = require("../models/Formation");
const Enrollment = require("../models/Enrollment");
const bcrypt = require("bcryptjs");
const path = require("path");
const fs = require("fs");

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
  const { name, email, phoneNumber, specialty, address, bio, socialLinks } =
    req.body;
  console.log(req.body);
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "Formateur non trouvé" });
    }

    // Mise à jour des informations utilisateur
    user.name = name || user.name;
    user.email = email || user.email;
    user.phoneNumber = phoneNumber || user.phoneNumber;

    // Mise à jour de la spécialité uniquement si l'utilisateur est un formateur
    if (user.role === "formateur") {
      user.specialty = specialty || user.specialty;
    }

    // Mise à jour de l'adresse si elle est présente dans la requête
    if (address) {
      user.address = {
        street: address.street || user.address?.street || "",
        city: address.city || user.address?.city || "",
        state: address.state || user.address?.state || "",
        zipCode: address.zipCode || user.address?.zipCode || "",
        country: address.country || user.address?.country || "",
      };
    }

    // Mise à jour de la bio si présente dans la requête
    user.bio = bio || user.bio;

    // Mise à jour des liens sociaux si présents dans la requête
    if (socialLinks) {
      user.socialLinks = {
        facebook: socialLinks.facebook || user.socialLinks?.facebook || "",
        twitter: socialLinks.twitter || user.socialLinks?.twitter || "",
        linkedIn: socialLinks.linkedIn || user.socialLinks?.linkedIn || "",
        github: socialLinks.github || user.socialLinks?.github || "",
      };
    }

    // Sauvegarder les modifications
    await user.save();

    res.json(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Erreur du serveur");
  }
};

exports.deleteFormateur = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "Formateur non trouvé" });
    }
    // Find all formations associated with this formateur
    const formations = await Formation.find({ formateur: req.params.id });

    // Extract formation IDs
    const formationIds = formations.map((formation) => formation._id);

    // Delete all enrollments associated with these formations
    await Enrollment.deleteMany({ formation: { $in: formationIds } });

    // Delete all formations associated with this formateur
    await Formation.deleteMany({ _id: { $in: formationIds } });

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
  const { name, email, phoneNumber, specialty, address, bio, socialLinks } =
    req.body;
  console.log(req.body);
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "Formateur non trouvé" });
    }

    // Mise à jour des informations utilisateur
    user.name = name || user.name;
    user.email = email || user.email;
    user.phoneNumber = phoneNumber || user.phoneNumber;

    // Mise à jour de l'adresse si elle est présente dans la requête
    if (address) {
      user.address = {
        street: address.street || user.address?.street || "",
        city: address.city || user.address?.city || "",
        state: address.state || user.address?.state || "",
        zipCode: address.zipCode || user.address?.zipCode || "",
        country: address.country || user.address?.country || "",
      };
    }

    // Mise à jour de la bio si présente dans la requête
    user.bio = bio || user.bio;

    // Mise à jour des liens sociaux si présents dans la requête
    if (socialLinks) {
      user.socialLinks = {
        facebook: socialLinks.facebook || user.socialLinks?.facebook || "",
        twitter: socialLinks.twitter || user.socialLinks?.twitter || "",
        linkedIn: socialLinks.linkedIn || user.socialLinks?.linkedIn || "",
        github: socialLinks.github || user.socialLinks?.github || "",
      };
    }

    await user.save();
    res.json(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Erreur du serveur");
  }
};

exports.deleteApprenant = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "Formateur non trouvé" });
    }

    res.json({ message: "Apprenant supprimé" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Erreur du serveur");
  }
};

// Mise à jour du profil utilisateur
exports.updateProfile = async (req, res) => {
  const {
    name,
    email,
    phoneNumber,
    specialty,
    address,
    bio,
    socialLinks,
    notifications,
  } = req.body;

  const userId = req.params.id;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Mise à jour des informations utilisateur
    user.name = name || user.name;
    user.email = email || user.email;
    user.phoneNumber = phoneNumber || user.phoneNumber;

    if (user.role === "formateur") {
      user.specialty = specialty || user.specialty;
    }

    if (address) {
      user.address.street = address.street || user.address.street;
      user.address.city = address.city || user.address.city;
      user.address.state = address.state || user.address.state;
      user.address.zipCode = address.zipCode || user.address.zipCode;
      user.address.country = address.country || user.address.country;
    }

    user.bio = bio || user.bio;

    if (socialLinks) {
      user.socialLinks.facebook =
        socialLinks.facebook || user.socialLinks.facebook;
      user.socialLinks.twitter =
        socialLinks.twitter || user.socialLinks.twitter;
      user.socialLinks.linkedIn =
        socialLinks.linkedIn || user.socialLinks.linkedIn;
      user.socialLinks.github = socialLinks.github || user.socialLinks.github;
    }

    if (notifications) {
      user.notifications.email =
        notifications.email ?? user.notifications.email;
      user.notifications.sms = notifications.sms ?? user.notifications.sms;
    }

    await user.save();
    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        photoProfil: user.photoProfil,
        specialty: user.specialty,
        phoneNumber: user.phoneNumber,
        address: user.address,
        bio: user.bio,
        socialLinks: user.socialLinks,
        notifications: user.notifications,
        date: user.date,
        lastLogin: user.lastLogin,
        isActive: user.isActive,
      },
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Erreur du serveur");
  }
};

// Mise à jour de la photo de profil utilisateur
// Contrôleur pour mettre à jour la photo de profil
exports.updateProfilePicture = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    (user.photoProfil = req.file ? req.file.filename : ""), await user.save();

    res.status(200).json({
      message: "Profile picture updated successfully",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        photoProfil: user.photoProfil,
        specialty: user.specialty,
        phoneNumber: user.phoneNumber,
        address: user.address,
        bio: user.bio,
        socialLinks: user.socialLinks,
        notifications: user.notifications,
        date: user.date,
        lastLogin: user.lastLogin,
        isActive: user.isActive,
      },
    });
  } catch (err) {
    res.status(400).send(err);
  }
};

// Changement du mot de passe utilisateur
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
    res.status(500).send("Erreur du serveur");
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

    const users = await User.find(filter);
    res.json(users);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Erreur du serveur");
  }
};
// Récupérer les détails d'un utilisateur par son ID
exports.getUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
};
