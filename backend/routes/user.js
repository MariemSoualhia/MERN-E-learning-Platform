const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const {
  adminAction,
  formateurAction,
  apprenantAction,
  updateProfile,
  changePassword,
  updateProfilePicture,
  getFormateurs,
  createFormateur,
  updateFormateur,
  deleteFormateur,
  createApprenant,
  updateApprenant,
  deleteApprenant,
  getUsersByRole,
  getUserById,
} = require("../controllers/userController");

const auth = require("../middleware/auth");
const { isAdmin, isFormateur, isApprenant } = require("../middleware/roles");

// Configuration du stockage des fichiers avec multer

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "../uploads");
    // Vérifie si le dossier d'upload existe, sinon il le crée
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

// Routes pour les actions spécifiques aux rôles
router.get("/admin", auth, isAdmin, adminAction);
router.get("/formateur", auth, isFormateur, formateurAction);
router.get("/apprenant", auth, isApprenant, apprenantAction);
router.get(
  "/:id",
  auth,
  (req, res, next) => {
    if (req.user.role === "admin" || req.user.role === "formateur") {
      return next(); // Proceed to getUserById
    } else {
      return res.status(403).json({
        message:
          "Access denied. Only admins and formateurs can perform this action.",
      });
    }
  },
  getUserById
);

// Route pour récupérer les utilisateurs en fonction de leur rôle
router.get("/", getUsersByRole);

// CRUD pour les formateurs
router.get("/formateurs", auth, isAdmin, getFormateurs);
router.post("/formateurs", auth, isAdmin, createFormateur);
router.put("/formateurs/:id", auth, isAdmin, updateFormateur);
router.delete("/formateurs/:id", auth, isAdmin, deleteFormateur);

// CRUD pour les apprenants
router.post("/apprenants", auth, isAdmin, createApprenant);
router.put("/apprenants/:id", auth, isAdmin, updateApprenant);
router.delete("/apprenants/:id", auth, isAdmin, deleteApprenant);

// Route pour mettre à jour le profil
router.put("/profile/:id", auth, updateProfile);

// Route pour changer le mot de passe
router.put("/profile/change-password/:id", auth, changePassword);

// Route pour mettre à jour la photo de profil
router.put(
  "/profile/photo/:id",
  auth, // Middleware d'authentification
  upload.single("photoProfil"), // Middleware multer pour gérer un seul fichier nommé 'photo'
  updateProfilePicture // Contrôleur pour mettre à jour la photo de profil
);

module.exports = router;
