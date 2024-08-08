const express = require("express");
const router = express.Router();
const {
  adminAction,
  formateurAction,
  apprenantAction,
  updateProfile,
  changePassword,
  updateProfilePicture,
} = require("../controllers/userController");
const auth = require("../middleware/auth");
const { isAdmin, isFormateur, isApprenant } = require("../middleware/roles");

// Route pour les actions des administrateurs
router.get("/admin", auth, isAdmin, adminAction);

// Route pour les actions des formateurs
router.get("/formateur", auth, isFormateur, formateurAction);

// Route pour les actions des apprenants
router.get("/apprenant", auth, isApprenant, apprenantAction);

// Route to update profile
router.put("/profile/:id", updateProfile);

// Route to change password
router.put("/profile/change-password/:id", auth, changePassword);

// Route to update profile picture

module.exports = router;
