const express = require("express");
const router = express.Router();
const {
  addFormation,
  getPendingFormations,
  updateFormationStatus,
  getActiveFormations,
  getMyFormations,
  updateFormation,
  getNotifications,
  markNotificationsAsRead,
  deleteFormation,
  getFormations,
  getFormationById,
  enrollInFormation,
  updateEnrollmentStatus,
  getPendingEnrollments,
  getEnrolledStudents,
  getFormationsForApprenant,
  cancelEnrollment,
} = require("../controllers/formationController");
const auth = require("../middleware/auth");
const { isAdmin, isFormateur } = require("../middleware/roles");

// Formateur Routes
router.post("/add", auth, isFormateur, addFormation);
router.get("/my-enrollments", auth, getFormationsForApprenant); // Placez cette route avant les routes dynamiques
router.delete("/cancel-enrollment/:formationId", auth, cancelEnrollment);
router.get("/", auth, isAdmin, getFormations);
router.get("/my-formations", auth, isFormateur, getMyFormations);
router.get("/:formationId/apprenants", auth, isFormateur, getEnrolledStudents);
router.put("/:id", auth, isFormateur, updateFormation);
router.delete("/:id", auth, isAdmin, deleteFormation);

// Admin Routes
router.get("/pending", auth, isAdmin, getPendingFormations);
router.put("/update-status/:id", auth, isAdmin, updateFormationStatus);
router.get("/notifications", auth, getNotifications);
router.put("/notifications/mark-as-read", auth, markNotificationsAsRead);

// Public Routes
router.get("/active", getActiveFormations);
router.get("/:id", getFormationById); // Placez les routes dynamiques à la fin pour éviter les conflits
router.post("/enroll/:formationId", auth, enrollInFormation);
router.put("/enrollment/:enrollmentId", auth, isAdmin, updateEnrollmentStatus);
router.get("/enrollments/pending", auth, isAdmin, getPendingEnrollments);

module.exports = router;
