// routes/quiz.js
const express = require("express");
const router = express.Router();
const {
  createQuiz,
  getQuizByFormationId,
  submitQuiz,
  checkQuizSubmission,
  getLearnerScores,
  updateQuiz,
  deleteQuiz,
} = require("../controllers/quizController");
const auth = require("../middleware/auth");
const { isAdmin, isApprenant, isFormateur } = require("../middleware/roles");
const isApprenantOrFormateur = (req, res, next) => {
  if (req.user.role !== "apprenant" && req.user.role !== "formateur") {
    return res.status(403).json({
      message:
        "Access denied. Only admins and formateurs can perform this action.",
    });
  }
  next();
};
// Route for submitting a quiz
router.post("/submit", auth, isApprenantOrFormateur, submitQuiz);
// Route for creating a quiz
router.post("/create", auth, isFormateur, createQuiz);
router.put("/update/:formationId", auth, isFormateur, updateQuiz);

// Route to get a quiz by formation ID
router.get(
  "/formation/:formationId",
  auth,
  isApprenantOrFormateur,
  getQuizByFormationId
);
router.get(
  "/check-submission/:formationId",
  auth,
  isApprenant,
  checkQuizSubmission
);
router.get("/formateur/learner-scores", auth, isFormateur, getLearnerScores);

router.delete("/delete/:quizId", auth, isFormateur, deleteQuiz);
module.exports = router;
