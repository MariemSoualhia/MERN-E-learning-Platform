const express = require("express");
const router = express.Router();
const {
  addFormation,
  getPendingFormations,
  updateFormationStatus,
  getActiveFormations,
  getMyFormations,
  updateFormation,
} = require("../controllers/formationController");
const auth = require("../middleware/auth");
const { isAdmin, isFormateur } = require("../middleware/roles");

// Formateur Routes
router.post("/add", auth, isFormateur, addFormation);
router.get("/my-formations", auth, isFormateur, getMyFormations);
router.put("/update/:id", auth, isFormateur, updateFormation); // Change this line to use isFormateur

// Admin Routes
router.get("/pending", auth, isAdmin, getPendingFormations);
router.put("/update-status/:id", auth, isAdmin, updateFormationStatus); // Change this line for clarity

// Public Routes
router.get("/active", getActiveFormations);

module.exports = router;
