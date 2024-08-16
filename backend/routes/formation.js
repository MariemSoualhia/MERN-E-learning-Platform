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
  sendEmailToApprenants,
  getTotalFormations,
  getTotalEnrolledStudents,
  getFormationStatusCounts,
  getCompletedFormations,
  getMostEnrolledFormation,
  getDailyNewEnrollments,
  getTodayNewEnrollments,
  getAdminDashboardStats,
  getTopFormationsByEnrollment,
  getEnrollments,
  deleteEnrollment,
  getApprenantDashboardStats,
} = require("../controllers/formationController");
const auth = require("../middleware/auth");
const { isAdmin, isFormateur } = require("../middleware/roles");

// Formateur Routes
const isAdminOrFormateur = (req, res, next) => {
  if (req.user.role !== "admin" && req.user.role !== "formateur") {
    return res.status(403).json({
      message:
        "Access denied. Only admins and formateurs can perform this action.",
    });
  }
  next();
};

router.post("/add", auth, isAdminOrFormateur, addFormation);

router.get("/my-enrollments", auth, getFormationsForApprenant); // Placez cette route avant les routes dynamiques
router.delete("/cancel-enrollment/:formationId", auth, cancelEnrollment);
router.get("/", auth, isAdmin, getFormations);
router.get("/my-formations", auth, isFormateur, getMyFormations);
router.get("/:formationId/apprenants", auth, isFormateur, getEnrolledStudents);

router.put(
  "/:id",
  auth,
  (req, res, next) => {
    // Check if the user is either an admin or formateur
    if (req.user.role === "admin" || req.user.role === "formateur") {
      return next(); // Proceed to updateFormation
    } else {
      // Return 403 Forbidden if the user is not authorized
      return res.status(403).json({
        message:
          "Access denied. Only admins and formateurs can perform this action.",
      });
    }
  },
  updateFormation
);

router.delete(
  "/:id",
  auth, // Ensure user is authenticated first
  (req, res, next) => {
    // Check if the user is either an admin or formateur
    if (
      req.user &&
      (req.user.role === "admin" || req.user.role === "formateur")
    ) {
      return next(); // Proceed to deleteFormation
    } else {
      // Return 403 Forbidden if the user is not authorized
      return res.status(403).json({
        message:
          "Access denied. Only admins and formateurs can perform this action.",
      });
    }
  },
  deleteFormation
);
router.get("/total-formations", auth, isFormateur, getTotalFormations);
router.get(
  "/total-enrolled-students",
  auth,
  isFormateur,
  getTotalEnrolledStudents
);
router.get(
  "/formation-status-counts",
  auth,
  isFormateur,
  getFormationStatusCounts
);
router.get("/today-new-enrollments", auth, isFormateur, getTodayNewEnrollments);

router.get("/completed-formations", auth, isFormateur, getCompletedFormations);
router.get(
  "/most-enrolled-formation",
  auth,
  isFormateur,
  getMostEnrolledFormation
);
router.get("/daily-new-enrollments", auth, isFormateur, getDailyNewEnrollments);
// Admin Routes
router.get("/pending", auth, isAdmin, getPendingFormations);
router.put("/update-status/:id", auth, isAdmin, updateFormationStatus);
router.get("/notifications", auth, getNotifications);
router.put("/notifications/mark-as-read", auth, markNotificationsAsRead);
router.get("/dashboard-stats", auth, isAdmin, getAdminDashboardStats);
router.get(
  "/top-formations-by-enrollment",
  auth,
  isAdmin,
  getTopFormationsByEnrollment
);
router.get("/dashboard-stats-apprenant", auth, getApprenantDashboardStats);
router.get("/totalEnrollments", auth, isAdmin, getEnrollments);

// Public Routes
router.get("/active", getActiveFormations);
router.get("/:id", getFormationById); // Placez les routes dynamiques à la fin pour éviter les conflits
router.post("/enroll/:formationId", auth, enrollInFormation);
router.put("/enrollment/:enrollmentId", auth, isAdmin, updateEnrollmentStatus);
router.get("/enrollments/pending", auth, isAdmin, getPendingEnrollments);
router.post(
  "/:formationId/send-email",
  auth,
  isFormateur,
  sendEmailToApprenants
);
router.delete("/enrollment/:enrollmentId", auth, isAdmin, deleteEnrollment);

module.exports = router;
