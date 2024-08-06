const express = require("express");
const router = express.Router();
const {
  addCourse,
  approveCourse,
  rejectCourse,
  getCourses,
  enrollCourse,
} = require("../controllers/courseController");
const auth = require("../middleware/auth");
const { isAdmin, isFormateur, isApprenant } = require("../middleware/roles");

// Route pour ajouter une formation (Formateur)
router.post("/add", auth, isFormateur, addCourse);

// Route pour approuver une formation (Admin)
router.put("/approve/:id", auth, isAdmin, approveCourse);

// Route pour rejeter une formation (Admin)
router.put("/reject/:id", auth, isAdmin, rejectCourse);

// Route pour consulter les formations (Apprenant)
router.get("/", auth, isApprenant, getCourses);

// Route pour s'inscrire à une formation (Apprenant)
router.post("/enroll/:id", auth, isApprenant, enrollCourse);

module.exports = router;
