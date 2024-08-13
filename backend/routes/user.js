const express = require("express");
const router = express.Router();
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
} = require("../controllers/userController");
const auth = require("../middleware/auth");
const { isAdmin, isFormateur, isApprenant } = require("../middleware/roles");

// Route pour les actions des administrateurs
router.get("/admin", auth, isAdmin, adminAction);

// Route pour les actions des formateurs
router.get("/formateur", auth, isFormateur, formateurAction);

// Route pour les actions des apprenants
router.get("/apprenant", auth, isApprenant, apprenantAction);
// Route pour récupérer les utilisateurs en fonction de leur rôle
router.get("/", auth, isAdmin, getUsersByRole); // Route pour récupérer les utilisateurs par rôle

// CRUD pour les formateurs
router.get("/formateurs", auth, isAdmin, getFormateurs);
router.post("/formateurs", auth, isAdmin, createFormateur);
router.put("/formateurs/:id", auth, isAdmin, updateFormateur);
router.delete("/formateurs/:id", auth, isAdmin, deleteFormateur);

// CRUD pour les apprenants
router.post("/apprenants", auth, isAdmin, createApprenant);
router.put("/apprenants/:id", auth, isAdmin, updateApprenant);
router.delete("/apprenants/:id", auth, isAdmin, deleteApprenant);

// Route to update profile
router.put("/profile/:id", auth, updateProfile);

// Route to change password
router.put("/profile/change-password/:id", auth, changePassword);

// Route to update profile picture
router.put("/profile/picture/:id", auth, updateProfilePicture);

module.exports = router;
