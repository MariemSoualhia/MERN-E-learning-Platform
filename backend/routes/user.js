const express = require("express");
const router = express.Router();
const {
  adminAction,
  formateurAction,
  apprenantAction,
} = require("../controllers/userController");
const auth = require("../middleware/auth");
const { isAdmin, isFormateur, isApprenant } = require("../middleware/roles");

// Route pour les actions des administrateurs
router.get("/admin", auth, isAdmin, adminAction);

// Route pour les actions des formateurs
router.get("/formateur", auth, isFormateur, formateurAction);

// Route pour les actions des apprenants
router.get("/apprenant", auth, isApprenant, apprenantAction);

module.exports = router;
