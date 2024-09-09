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
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");
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
  upload.single("image"), // Middleware pour gérer l'upload de l'image
  async (req, res) => {
    const {
      title,
      description,
      dateDebut,
      dateFin,
      duree,
      prix,
      specialty,
      formateur,
      niveau,
    } = req.body;

    try {
      // Déterminer l'ID du formateur en fonction du rôle de l'utilisateur
      let formateurId;
      if (req.user.role === "admin") {
        // Si l'utilisateur est un admin, utiliser l'ID du formateur fourni dans le corps de la requête
        if (!formateur) {
          return res.status(400).json({
            msg: "Formateur is required when adding a formation as an admin",
          });
        }
        formateurId = formateur;
      } else if (req.user.role === "formateur") {
        // Si l'utilisateur est un formateur, s'auto-assigner en tant que formateur
        formateurId = req.user.id;
      } else {
        // Si l'utilisateur n'a pas le bon rôle, refuser la requête
        return res.status(403).json({ msg: "Access denied" });
      }
      console.log;
      // Créer la nouvelle formation
      const newFormation = new Formation({
        title,
        description,
        specialty,
        dateDebut,
        dateFin,
        duree,
        prix,
        niveau,
        image: req.file ? req.file.filename : "", // Stocker le nom du fichier de l'image
        formateur: formateurId,
      });

      const formation = await newFormation.save();

      // Récupérer les identifiants des administrateurs
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

      // Envoyer une notification à chaque admin
      adminUsers.forEach((admin) => {
        io.to(admin._id.toString()).emit("newFormation", formation);
      });

      // Envoyer une notification au formateur
      io.to(formateurId.toString()).emit("formationStatusUpdated", formation);

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
    // Find the formation by ID
    const formation = await Formation.findById(req.params.id);

    // If the formation does not exist, return a 404 error
    if (!formation) {
      return res.status(404).json({ msg: "Formation not found" });
    }

    // Delete all enrollments associated with the formation
    await Enrollment.deleteMany({ formation: req.params.id });
    await Notification.deleteMany({ formation: req.params.id });

    // Delete the formation
    await Formation.findByIdAndDelete(req.params.id);

    // Return a success message
    res.json({ msg: "Formation and related enrollments deleted" });
  } catch (error) {
    // Log the error and return a 500 status with an error message
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
    const formations = await Formation.find({ status: "en attente" }).populate(
      "formateur",
      "name email"
    );
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
    const formations = await Formation.find({
      formateur: req.user.id,
    }).populate("quiz");
    const formationsWithQuizFlag = formations.map((formation) => {
      return {
        ...formation.toObject(),
        quizExists: formation.quiz ? true : false,
      };
    });

    res.json(formationsWithQuizFlag);
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
    const {
      title,
      description,
      dateDebut,
      dateFin,
      duree,
      prix,
      specialty,
      meetLink,
      niveau,
    } = req.body;

    try {
      let formation = await Formation.findById(req.params.id);

      if (!formation) {
        return res.status(404).json({ msg: "Formation not found" });
      }

      // Check if the user is the formateur who owns the formation or an admin
      if (
        formation.formateur.toString() !== req.user.id &&
        req.user.role !== "admin"
      ) {
        return res.status(403).json({ msg: "User not authorized" });
      }

      formation.title = title || formation.title;
      formation.description = description || formation.description;
      formation.specialty = specialty || formation.specialty;
      formation.dateDebut = dateDebut || formation.dateDebut;
      formation.dateFin = dateFin || formation.dateFin;
      formation.duree = duree || formation.duree;
      formation.prix = prix || formation.prix;
      formation.meetLink = meetLink || formation.meetLink;
      formation.image = req.file ? req.file.filename : formation.image;
      formation.niveau = niveau || formation.niveau;
      await formation.save();

      // Send a notification via socket.io
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

    // Créer une nouvelle inscription avec le statut "en attente"
    const enrollment = new Enrollment({
      apprenant: apprenantId,
      formation: formationId,
      status: "en attente",
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
    const pendingEnrollments = await Enrollment.find({ status: "en attente" })
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
      status: "acceptée", // Filtrer par statut si nécessaire
    }).populate("apprenant", "name email");

    // Renvoyer uniquement les détails des apprenants
    const apprenants = enrollments.map((enrollment) => enrollment.apprenant);

    res.status(200).json(apprenants);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Erreur du serveur");
  }
};

exports.getFormationsForApprenant = async (req, res) => {
  try {
    const apprenantId = req.user.id;
    const currentDate = new Date();

    // Find all enrollments for the apprenant
    const enrollments = await Enrollment.find({
      apprenant: apprenantId,
      status: "acceptée",
    })
      .populate({
        path: "formation",
        populate: {
          path: "formateur",
          select: "name email",
        },
      })
      .exec();

    // Categorize formations into upcoming and completed, grouped by specialty
    const formationsBySpecialty = enrollments.reduce(
      (acc, enrollment) => {
        const formation = enrollment.formation;
        if (!formation) return acc;

        const specialty = formation.specialty;

        // Determine if the formation is upcoming or completed
        if (
          formation.dateDebut > currentDate &&
          formation.dateFin > currentDate
        ) {
          if (!acc.upcoming[specialty]) {
            acc.upcoming[specialty] = [];
          }
          acc.upcoming[specialty].push(formation);
        } else if (formation.dateFin <= currentDate) {
          // Modification ici pour inclure les formations qui sont toujours en cours
          if (!acc.completed[specialty]) {
            acc.completed[specialty] = [];
          }
          acc.completed[specialty].push(formation);
        }

        return acc;
      },
      { upcoming: {}, completed: {} }
    );

    res.status(200).json(formationsBySpecialty);
  } catch (error) {
    console.error(error);
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

exports.sendEmailToApprenants = async (req, res) => {
  try {
    const { formationId } = req.params;
    const formation = await Formation.findById(formationId).populate(
      "formateur"
    );

    if (!formation) {
      return res.status(404).json({ message: "Formation non trouvée." });
    }

    const enrollments = await Enrollment.find({
      formation: formationId,
      status: "acceptée",
    }).populate("apprenant");

    const apprenantsEmails = enrollments.map(
      (enrollment) => enrollment.apprenant.email
    );

    if (apprenantsEmails.length === 0) {
      return res.status(400).json({ message: "Aucun apprenant inscrit." });
    }

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER, // Assurez-vous que ces variables sont configurées dans .env
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: apprenantsEmails.join(","),
      subject: `Lien Google Meet pour la formation : ${formation.title}`,
      html: `
        <p>Bonjour,</p>
        <p>Vous êtes inscrit à la formation <strong>${
          formation.title
        }</strong>, animée par ${formation.formateur.name}.</p>
        <p>Voici le lien Google Meet pour rejoindre la formation :</p>
        <p><a href="${formation.meetLink}">${formation.meetLink}</a></p>
        <p>Informations supplémentaires :</p>
        <ul>
          <li>Date de début : ${new Date(
            formation.dateDebut
          ).toLocaleDateString()}</li>
          <li>Date de fin : ${new Date(
            formation.dateFin
          ).toLocaleDateString()}</li>
          <li>Durée : ${formation.duree} heures</li>
         
        </ul>
        <p>Merci.</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Email envoyé avec succès." });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Erreur lors de l'envoi de l'email." });
  }
};
// controllers/formationController.js

exports.getTotalFormations = async (req, res) => {
  try {
    const totalFormations = await Formation.countDocuments({
      formateur: req.user.id,
    });
    res.json({ totalFormations });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};
exports.getTodayNewEnrollments = async (req, res) => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    // Query for enrollments created today
    const newEnrollments = await Enrollment.countDocuments({
      createdAt: { $gte: startOfDay },
      formation: {
        $in: await Formation.find({ formateur: req.user.id }).select("_id"),
      }, // Ensure this checks formations of the current formateur
    });

    res.status(200).json({ newEnrollments });
  } catch (error) {
    console.error("Error fetching today's new enrollments:", error.message);
    res.status(500).send("Server error");
  }
};
exports.getTotalEnrolledStudents = async (req, res) => {
  try {
    const formateurId = req.user._id;

    // Rechercher toutes les formations qui appartiennent à ce formateur
    const formations = await Formation.find({ formateur: formateurId }).select(
      "_id"
    );

    // Extraire les IDs des formations
    const formationIds = formations.map((formation) => formation._id);

    // Rechercher toutes les inscriptions acceptées pour ces formations
    const totalEnrolled = await Enrollment.countDocuments({
      formation: { $in: formationIds },
      status: "acceptée",
    });

    res.json({ totalEnrolled });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Erreur du serveur");
  }
};

exports.getFormationStatusCounts = async (req, res) => {
  try {
    const activeCount = await Formation.countDocuments({
      formateur: req.user.id,
      status: "active",
    });
    const pendingCount = await Formation.countDocuments({
      formateur: req.user.id,
      status: "en attente",
    });
    const rejectedCount = await Formation.countDocuments({
      formateur: req.user.id,
      status: "rejetée",
    });
    res.json({ activeCount, pendingCount, rejectedCount });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};
exports.getDailyNewEnrollments = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dailyNewEnrollments = await Enrollment.countDocuments({
      createdAt: { $gte: today },
      status: "acceptée", // Assuming you only want to count acceptée enrollments
      formation: {
        $in: await Formation.find({ formateur: req.user.id }).select("_id"),
      }, // Only formations of the current formateur
    });

    res.status(200).json({ dailyNewEnrollments });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};
exports.getCompletedFormations = async (req, res) => {
  try {
    const today = new Date();

    const completedFormations = await Formation.countDocuments({
      formateur: req.user.id,
      dateFin: { $lt: today }, // Check if the end date is before today
    });

    res.status(200).json({ completedFormations });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

exports.getMostEnrolledFormation = async (req, res) => {
  try {
    const formateurId = req.user.id;

    // Rechercher toutes les formations pour le formateur actuel
    const formateurFormations = await Formation.find({
      formateur: formateurId,
    }).select("_id");

    if (formateurFormations.length === 0) {
      return res.status(200).json({ formationTitle: "No Enrollments" });
    }

    // Agrégation pour trouver la formation avec le plus d'inscriptions
    const mostEnrolledFormation = await Enrollment.aggregate([
      {
        $match: {
          status: "acceptée",
          formation: { $in: formateurFormations.map((f) => f._id) },
        },
      },
      {
        $group: {
          _id: "$formation",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 1 },
    ]);

    if (mostEnrolledFormation.length > 0) {
      const formation = await Formation.findById(mostEnrolledFormation[0]._id);
      return res.status(200).json({ formationTitle: formation.title });
    } else {
      return res.status(200).json({ formationTitle: "No Enrollments" });
    }
  } catch (error) {
    console.error("Error fetching most enrolled formation:", error.message);
    res.status(500).send("Server error");
  }
};

exports.getAdminDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalFormations = await Formation.countDocuments();
    const totalEnrollments = await Enrollment.countDocuments();
    const totalAdmins = await User.countDocuments({ role: "admin" });
    const totalFormateurs = await User.countDocuments({ role: "formateur" });
    const totalApprenants = await User.countDocuments({ role: "apprenant" });

    const formationStatusCounts = await Formation.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
      { $project: { status: "$_id", count: 1, _id: 0 } },
    ]);

    const specialtyCounts = await Formation.aggregate([
      { $group: { _id: "$specialty", count: { $sum: 1 } } },
      { $project: { specialty: "$_id", count: 1, _id: 0 } },
    ]);

    const enrollmentStatusCounts = await Enrollment.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
      { $project: { status: "$_id", count: 1, _id: 0 } },
    ]);

    // Calculate the number of apprenants by formation
    const apprenantsByFormation = await Enrollment.aggregate([
      { $match: { status: "acceptée" } }, // Only count acceptée enrollments
      { $group: { _id: "$formation", count: { $sum: 1 } } },
      {
        $lookup: {
          from: "formations",
          localField: "_id",
          foreignField: "_id",
          as: "formation",
        },
      },
      { $unwind: "$formation" },
      { $project: { formationTitle: "$formation.title", count: 1, _id: 0 } },
    ]);

    // Calculate the number of apprenants by formateur
    const apprenantsByFormateur = await Enrollment.aggregate([
      { $match: { status: "acceptée" } },
      {
        $lookup: {
          from: "formations",
          localField: "formation",
          foreignField: "_id",
          as: "formation",
        },
      },
      { $unwind: "$formation" },
      {
        $group: {
          _id: "$formation.formateur",
          count: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "formateur",
        },
      },
      { $unwind: "$formateur" },
      { $project: { formateurName: "$formateur.name", count: 1, _id: 0 } },
    ]);

    res.json({
      totalUsers,
      totalFormations,
      totalEnrollments,
      totalAdmins,
      totalFormateurs,
      totalApprenants,
      formationStatusCounts,
      specialtyCounts,
      enrollmentStatusCounts,
      apprenantsByFormation, // New data to return
      apprenantsByFormateur, // New data to return
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};
// Assuming you have a function like this in your formationController.js
exports.getTopFormationsByEnrollment = async (req, res) => {
  try {
    const topFormations = await Enrollment.aggregate([
      { $match: { status: "acceptée" } }, // Filter only acceptée enrollments
      { $group: { _id: "$formation", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }, // Top 5 formations
      {
        $lookup: {
          from: "formations", // Collection name
          localField: "_id",
          foreignField: "_id",
          as: "formationDetails",
        },
      },
      { $unwind: "$formationDetails" }, // Unwind the formation details
      {
        $project: {
          formationTitle: "$formationDetails.title",
          count: 1,
        },
      },
    ]);

    console.log(topFormations);
    res.status(200).json(topFormations);
  } catch (error) {
    console.error("Error fetching top formations:", error.message);
    res.status(500).send("Server error");
  }
};

exports.getEnrollments = async (req, res) => {
  try {
    // Fetch all enrollments, populate apprenant and formation fields
    const enrollments = await Enrollment.find()
      .populate("apprenant", "name email") // Populate apprenant with name and email fields
      .populate(
        "formation",
        "title description dateDebut dateFin formateur niveau"
      ); // Populate formation with multiple fields

    // Send the populated enrollments as a JSON response
    res.json(enrollments);
  } catch (error) {
    // Log the error and send a 500 status code with an error message
    console.error(error.message);
    res.status(500).send("Erreur du serveur");
  }
};
// Supprimer une inscription par ID
exports.deleteEnrollment = async (req, res) => {
  try {
    const { enrollmentId } = req.params;

    // Attempt to find and delete the enrollment by its ID
    const deletedEnrollment = await Enrollment.findByIdAndDelete(enrollmentId);

    // Check if the enrollment was found and deleted
    if (!deletedEnrollment) {
      return res.status(404).json({ message: "Inscription non trouvée." });
    }

    // Return a success message if the deletion was successful
    res.status(200).json({ message: "Inscription supprimée avec succès." });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Erreur du serveur");
  }
};

exports.getApprenantDashboardStats = async (req, res) => {
  try {
    const apprenantId = req.user.id;
    const currentDate = new Date();

    // Convert apprenantId to ObjectId using 'new' keyword
    const objectIdApprenantId = new mongoose.Types.ObjectId(apprenantId);

    // Get total formations the user is enrolled in
    const totalFormations = await Enrollment.countDocuments({
      apprenant: objectIdApprenantId,
      status: "acceptée",
    });

    // Get completed formations where the end date is in the past
    const completedFormations = await Enrollment.find({
      apprenant: objectIdApprenantId,
      status: "acceptée",
    })
      .populate({
        path: "formation",
        match: {
          dateFin: { $lt: currentDate },
          dateDebut: { $lt: currentDate },
        }, // Completed if end date is before the current date
        select: "title dateFin dateDebut ",
      })
      .exec();

    // Get upcoming formations where the start date is in the future
    const upcomingFormations = await Enrollment.find({
      apprenant: objectIdApprenantId,
      status: "acceptée",
    })
      .populate({
        path: "formation",
        match: {
          dateDebut: { $gt: currentDate }, // Ongoing if start date is before the current date
          dateFin: { $gt: currentDate }, // and end date is after the current date
        },
        select: "title dateDebut dateFin",
      })
      .exec();

    // Filter out any enrollments that don't have populated formations (just in case)
    const filteredCompletedFormations = completedFormations.filter(
      (enrollment) => enrollment.formation !== null
    );

    const filteredUpcomingFormations = upcomingFormations.filter(
      (enrollment) => enrollment.formation !== null
    );

    // Aggregation for formations by month
    const formationsByMonth = await Enrollment.aggregate([
      {
        $match: {
          apprenant: objectIdApprenantId,
          status: "acceptée",
        },
      },
      {
        $lookup: {
          from: "formations",
          localField: "formation",
          foreignField: "_id",
          as: "formationDetails",
        },
      },
      { $unwind: "$formationDetails" },
      {
        $group: {
          _id: { month: { $month: "$formationDetails.dateDebut" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.month": 1 } },
    ]);

    // Aggregation for formations by year
    const formationsByYear = await Enrollment.aggregate([
      {
        $match: {
          apprenant: objectIdApprenantId,
          status: "acceptée",
        },
      },
      {
        $lookup: {
          from: "formations",
          localField: "formation",
          foreignField: "_id",
          as: "formationDetails",
        },
      },
      { $unwind: "$formationDetails" },
      {
        $group: {
          _id: { year: { $year: "$formationDetails.dateDebut" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1 } },
    ]);

    // Return the data
    res.status(200).json({
      totalFormations,
      completedFormations: filteredCompletedFormations.length,
      upcomingFormations: filteredUpcomingFormations.map((enrollment) => ({
        _id: enrollment.formation._id,
        title: enrollment.formation.title,
        dateDebut: enrollment.formation.dateDebut,
      })),
      formationsByMonth: formationsByMonth || [], // Ensure array is returned
      formationsByYear: formationsByYear || [], // Ensure array is returned
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Erreur du serveur.");
  }
};

exports.uploadVideo = async (req, res) => {
  const { formationId } = req.params;
  const { title } = req.body;

  // Check if a file is uploaded
  if (!req.file) {
    return res.status(400).json({ message: "No video file uploaded" });
  }

  try {
    const formation = await Formation.findById(formationId);

    if (!formation) {
      return res.status(404).json({ message: "Formation not found" });
    }

    const videoPath = req.file.path; // Absolute path of the uploaded video

    // Store video details in the database
    formation.videos.push({ url: videoPath, title });
    await formation.save();

    res.status(200).json({
      message: "Video uploaded successfully",
      videos: formation.videos,
    });
  } catch (error) {
    console.error("Error uploading video:", error);
    res.status(500).json({ message: "Server error while uploading video" });
  }
};

exports.getVideos = async (req, res) => {
  const { formationId } = req.params;

  try {
    const formation = await Formation.findById(formationId);

    if (!formation) {
      return res.status(404).json({ message: "Formation not found" });
    }

    res.status(200).json({ videos: formation.videos });
  } catch (error) {
    console.error("Error fetching videos:", error);
    res.status(500).json({ message: "Server error while fetching videos" });
  }
};

exports.serveVideo = async (req, res) => {
  const { formationId, videoIndex } = req.params; // Using formationId and videoIndex to identify the video

  try {
    // Find the formation by ID
    const formation = await Formation.findById(formationId);

    // Check if the formation exists
    if (!formation) {
      return res.status(404).json({ message: "Formation not found" });
    }

    // Ensure videoIndex is valid
    if (!formation.videos[videoIndex]) {
      return res
        .status(404)
        .json({ message: "Video not found in the formation" });
    }

    // Get the video path
    const videoPath = formation.videos[videoIndex].url; // Access the video path from the formation's videos array

    // Check if the video file exists
    if (!fs.existsSync(videoPath)) {
      return res.status(404).json({ message: "Video file not found" });
    }

    const stat = fs.statSync(videoPath);
    const fileSize = stat.size;
    const range = req.headers.range;

    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

      const chunksize = end - start + 1;
      const file = fs.createReadStream(videoPath, { start, end });
      const head = {
        "Content-Range": `bytes ${start}-${end}/${fileSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": chunksize,
        "Content-Type": "video/mp4",
      };

      res.writeHead(206, head);
      file.pipe(res);
    } else {
      const head = {
        "Content-Length": fileSize,
        "Content-Type": "video/mp4",
      };

      res.writeHead(200, head);
      fs.createReadStream(videoPath).pipe(res);
    }
  } catch (error) {
    console.error("Error serving video:", error);
    res.status(500).json({ message: "Server error while serving video" });
  }
};

exports.deleteVideo = async (req, res) => {
  const { formationId, videoId } = req.params;

  try {
    const formation = await Formation.findById(formationId);

    if (!formation) {
      return res.status(404).json({ message: "Formation not found" });
    }

    formation.videos = formation.videos.filter(
      (video) => video._id.toString() !== videoId
    );
    await formation.save();

    res.status(200).json({
      message: "Video deleted successfully",
      videos: formation.videos,
    });
  } catch (error) {
    console.error("Error deleting video:", error);
    res.status(500).json({ message: "Server error while deleting video" });
  }
};
