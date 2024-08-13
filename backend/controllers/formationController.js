// formationController.js
const Formation = require("../models/Formation");
const Notification = require("../models/Notification");
const Enrollment = require("../models/Enrollment");
const User = require("../models/User");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const socket = require("../socket");
const auth = require("../middleware/auth");

// Configuration de Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "../uploads");
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

const upload = multer({ storage: storage });

// Ajouter une formation
exports.addFormation = [
  auth,
  upload.single("image"),
  async (req, res) => {
    const { title, description, dateDebut, dateFin, duree, prix, specialty } =
      req.body;

    try {
      const newFormation = new Formation({
        title,
        description,
        specialty,
        dateDebut,
        dateFin,
        duree,
        prix,
        image: req.file ? req.file.filename : "",
        formateur: req.user.id,
      });

      const formation = await newFormation.save();

      // Récupérer l'identifiant de l'administrateur
      const adminUsers = await User.find({ role: "admin" }).select("_id");

      // Créer des notifications pour chaque administrateur
      const notifications = adminUsers.map((admin) => ({
        user: admin._id,
        type: "newFormation",
        formation: formation._id,
        isRead: false,
      }));

      await Notification.insertMany(notifications);

      // Envoyer une notification via socket.io
      const io = socket.getIo();
      io.emit("newFormation", formation);
      // Faites ceci :
      adminUsers.forEach((admin) => {
        io.to(admin._id.toString()).emit("newFormation", formation);
      });

      // De même pour updateFormationStatus :
      io.to(formation.formateur._id.toString()).emit(
        "formationStatusUpdated",
        formation
      );
      res.status(201).json(formation);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server error");
    }
  },
];
// Récupérer les formations avec des filtres
// Récupérer les formations avec des filtres
exports.getFormations = async (req, res) => {
  try {
    const { status, specialty } = req.query;
    const filter = {};

    // Appliquer les filtres si présents dans la requête
    if (status) filter.status = status;
    if (specialty) filter.specialty = specialty;

    // Rechercher les formations avec les filtres et peupler les informations du formateur
    const formations = await Formation.find(filter).populate(
      "formateur",
      "name email"
    );

    // Retourner les formations trouvées
    res.json(formations);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Erreur du serveur");
  }
};

// Récupérer les notifications non lues
exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      user: req.user.id,
      isRead: false,
    }).populate("formation");

    res.json(notifications);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

// Marquer les notifications comme lues
exports.markNotificationsAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { isRead: false },
      { $set: { isRead: true } }
    );
    res.status(200).send("Notifications marked as read");
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};
// backend/controllers/formationController.js

exports.deleteFormation = async (req, res) => {
  try {
    const formation = await Formation.findById(req.params.id);

    if (!formation) {
      return res.status(404).json({ msg: "Formation not found" });
    }

    await Formation.findByIdAndDelete(req.params.id); // Utilisation de findByIdAndDelete

    res.json({ msg: "Formation supprimée" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

// Mettre à jour le statut d'une formation
exports.updateFormationStatus = async (req, res) => {
  const { status } = req.body;
  try {
    let formation = await Formation.findById(req.params.id).populate(
      "formateur"
    );

    if (!formation) {
      return res.status(404).json({ msg: "Formation not found" });
    }

    formation.status = status;
    await formation.save();

    // Créer une notification pour le formateur
    const notification = new Notification({
      user: formation.formateur._id,
      type: "formationStatusUpdated",
      formation: formation._id,
      isRead: false,
    });

    await notification.save();

    // Envoyer une notification via socket.io pour la mise à jour du statut
    const io = socket.getIo();
    io.emit("formationStatusUpdated", formation);

    res.json(formation);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

// Récupérer les formations en attente
exports.getPendingFormations = async (req, res) => {
  try {
    const formations = await Formation.find({ status: "pending" });
    res.json(formations);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

// Récupérer les formations actives
// controllers/formationController.js

exports.getActiveFormations = async (req, res) => {
  try {
    const { specialty } = req.query;
    const filter = { status: "active" };

    if (specialty) {
      filter.specialty = specialty;
    }

    const formations = await Formation.find(filter);
    res.json(formations);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

// Récupérer les formations d'un formateur
exports.getMyFormations = async (req, res) => {
  try {
    const formations = await Formation.find({ formateur: req.user.id });
    res.json(formations);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

// Mettre à jour une formation
exports.updateFormation = [
  auth,
  upload.single("image"),
  async (req, res) => {
    const { title, description, dateDebut, dateFin, duree, prix, specialty } =
      req.body;

    try {
      let formation = await Formation.findById(req.params.id);

      if (!formation) {
        return res.status(404).json({ msg: "Formation not found" });
      }

      if (formation.formateur.toString() !== req.user.id) {
        return res.status(403).json({ msg: "User not authorized" });
      }

      formation.title = title || formation.title;
      formation.description = description || formation.description;
      formation.specialty = specialty || formation.specialty;
      formation.dateDebut = dateDebut || formation.dateDebut;
      formation.dateFin = dateFin || formation.dateFin;
      formation.duree = duree || formation.duree;
      formation.prix = prix || formation.prix;
      formation.image = req.file
        ? `/uploads/${req.file.filename}`
        : formation.image;

      await formation.save();

      // Envoyer une notification via socket.io
      const io = socket.getIo();
      io.emit("formationUpdated", formation);

      res.json(formation);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server error");
    }
  },
];

// Récupérer les détails d'une formation par ID
exports.getFormationById = async (req, res) => {
  try {
    const formation = await Formation.findById(req.params.id).populate(
      "formateur",
      "name email"
    );

    if (!formation) {
      return res.status(404).json({ msg: "Formation non trouvée" });
    }

    res.json(formation);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Erreur du serveur");
  }
};
// Method to handle enrollment
exports.enrollInFormation = async (req, res) => {
  try {
    const { formationId } = req.params;
    const apprenantId = req.user.id;
    console.log(apprenantId);
    // Vérifier s'il existe déjà une inscription pour cette formation et cet apprenant
    const existingEnrollment = await Enrollment.findOne({
      apprenant: apprenantId,
      formation: formationId,
    });

    if (existingEnrollment) {
      return res
        .status(400)
        .json({ message: "Vous êtes déjà inscrit à cette formation." });
    }

    // Créer une nouvelle inscription avec le statut "pending"
    const enrollment = new Enrollment({
      apprenant: apprenantId,
      formation: formationId,
      status: "pending",
    });

    await enrollment.save();

    // Récupérer les détails de la formation et de l'apprenant pour les inclure dans la notification
    const formation = await Formation.findById(formationId).populate(
      "formateur"
    );
    const apprenant = await User.findById(apprenantId);

    // Notifier les administrateurs de la nouvelle inscription
    const adminUsers = await User.find({ role: "admin" }).select("_id");

    const notifications = adminUsers.map((admin) => ({
      user: admin._id,
      type: "newEnrollment",
      formation: formationId,
      enrollment: enrollment._id,
      message: `Nouvelle inscription de ${apprenant.name} à la formation ${formation.title}.`,
      isRead: false,
    }));

    await Notification.insertMany(notifications);

    const io = socket.getIo();
    notifications.forEach((notification) => {
      io.emit("newEnrollment", notification);
    });

    res
      .status(201)
      .json({ message: "Demande d'inscription soumise avec succès." });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Erreur du serveur.");
  }
};

// Update enrollment status
exports.updateEnrollmentStatus = async (req, res) => {
  try {
    const { enrollmentId } = req.params;
    const { status } = req.body;

    const enrollment = await Enrollment.findById(enrollmentId)
      .populate("formation")
      .populate("apprenant");

    if (!enrollment) {
      return res.status(404).json({ msg: "Inscription non trouvée" });
    }

    enrollment.status = status;
    await enrollment.save();

    // Créer la notification pour l'apprenant uniquement
    const apprenantNotification = new Notification({
      user: enrollment.apprenant._id,
      type: `enrollment${status}`,
      formation: enrollment.formation._id,
      enrollment: enrollment._id,
      message: `Votre inscription à la formation ${enrollment.formation.title} a été ${status}.`,
      isRead: false,
    });

    // Sauvegarder la notification pour l'apprenant
    await apprenantNotification.save();

    // Envoyer la notification en temps réel à l'apprenant via Socket.io
    const io = socket.getIo();
    io.emit("test", apprenantNotification);
    console.log("Emitting to:", enrollment.apprenant._id.toString()); // Log pour déboguer
    // io.to(enrollment.apprenant._id.toString()).emit(
    //   `enrollment${status}`,
    //   apprenantNotification
    // );

    res.status(200).json({ message: `Inscription ${status}`, enrollment });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Erreur du serveur");
  }
};

// Fetch pending enrollments
exports.getPendingEnrollments = async (req, res) => {
  try {
    const pendingEnrollments = await Enrollment.find({ status: "pending" })
      .populate("apprenant", "name email")
      .populate("formation", "title");

    res.json(pendingEnrollments);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};
exports.getEnrolledStudents = async (req, res) => {
  try {
    const { formationId } = req.params;
    const enrollments = await Enrollment.find({
      formation: formationId,
    }).populate("apprenant", "name email");

    res.status(200).json(enrollments);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Erreur du serveur");
  }
};
// Récupérer les apprenants inscrits à une formation spécifique
exports.getEnrolledStudents = async (req, res) => {
  try {
    const { formationId } = req.params;
    const enrollments = await Enrollment.find({
      formation: formationId,
      status: "accepted", // Filtrer par statut si nécessaire
    }).populate("apprenant", "name email");

    // Renvoyer uniquement les détails des apprenants
    const apprenants = enrollments.map((enrollment) => enrollment.apprenant);

    res.status(200).json(apprenants);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Erreur du serveur");
  }
};
// Récupérer les formations auxquelles un apprenant est inscrit
exports.getFormationsForApprenant = async (req, res) => {
  try {
    const apprenantId = req.user.id;

    // Rechercher les inscriptions de l'apprenant et peupler les informations de la formation
    const enrollments = await Enrollment.find({
      apprenant: apprenantId,
      status: "accepted",
    }).populate("formation");

    // Extraire les formations des inscriptions
    const formations = enrollments.map((enrollment) => enrollment.formation);

    res.status(200).json(formations);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Erreur du serveur.");
  }
};
// Annuler une inscription pour une formation spécifique
exports.cancelEnrollment = async (req, res) => {
  try {
    const { formationId } = req.params;
    const apprenantId = req.user.id;

    // Rechercher l'inscription pour cet apprenant et cette formation
    const enrollment = await Enrollment.findOneAndDelete({
      apprenant: apprenantId,
      formation: formationId,
    });

    if (!enrollment) {
      return res.status(404).json({ message: "Inscription non trouvée." });
    }

    res.status(200).json({ message: "Inscription annulée avec succès." });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Erreur du serveur.");
  }
};
