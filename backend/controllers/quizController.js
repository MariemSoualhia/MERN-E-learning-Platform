// controllers/quizController.js
const Quiz = require("../models/Quiz");
const Formation = require("../models/Formation");
const User = require("../models/User");
const QuizSubmission = require("../models/QuizSubmission");

exports.createQuiz = async (req, res) => {
  const { formationId, questions } = req.body;
  try {
    const formation = await Formation.findById(formationId);

    if (!formation) {
      return res.status(404).json({ message: "Formation not found" });
    }

    const quiz = new Quiz({ formation: formationId, questions });
    await quiz.save();

    formation.quiz = quiz._id;
    await formation.save();

    res.status(201).json(quiz);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
    console.log(error);
  }
};

exports.getQuizByFormationId = async (req, res) => {
  const { formationId } = req.params;

  try {
    const quiz = await Quiz.findOne({ formation: formationId });

    if (!quiz) {
      return res
        .status(404)
        .json({ message: "Quiz not found for this formation" });
    }

    res.status(200).json(quiz);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
    console.log(error);
  }
};

exports.submitQuiz = async (req, res) => {
  const { formationId, score, answers, totalQuestions } = req.body;
  const userId = req.user.id; // Assuming `auth` middleware sets `req.user`
  console.log(req.body);
  try {
    // Check if formation exists
    const formation = await Formation.findById(formationId);
    if (!formation) {
      return res.status(404).json({ message: "Formation not found" });
    }

    // Check if quiz submission already exists for this user and formation
    const existingSubmission = await QuizSubmission.findOne({
      formation: formationId,
      user: userId,
    });
    if (existingSubmission) {
      return res.status(400).json({ message: "Quiz already submitted" });
    }

    // Create a new quiz submission
    const quizSubmission = new QuizSubmission({
      formation: formationId,
      user: userId,
      score,
      totalQuestions, // Add total number of questions
      answers,
    });
    await quizSubmission.save();

    // Optionally, notify the formateur
    const formateur = await User.findById(formation.formateur);
    if (formateur) {
      console.log(`Notification sent to formateur: ${formateur.email}`);
    }

    res
      .status(201)
      .json({ message: "Quiz submitted successfully", score, totalQuestions });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
    console.log(error);
  }
};

exports.checkQuizSubmission = async (req, res) => {
  const { formationId } = req.params;
  const userId = req.user.id;

  try {
    const submission = await QuizSubmission.findOne({
      formation: formationId,
      user: userId,
    });
    if (submission) {
      res.status(200).json({
        submitted: true,
        score: submission.score,
        totalQuestions: submission.totalQuestions,
      });
    } else {
      res.status(200).json({ submitted: false });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error" });
    console.log(error);
  }
};

exports.getLearnerScores = async (req, res) => {
  const formateurId = req.user.id; // Assuming `auth` middleware sets `req.user`

  try {
    // Get all formations created by the formateur
    const formations = await Formation.find({ formateur: formateurId });

    // Extract formation IDs
    const formationIds = formations.map((formation) => formation._id);

    // Get all quiz submissions for these formations and populate user and formation details
    const quizSubmissions = await QuizSubmission.find({
      formation: { $in: formationIds },
    })
      .populate("user", "name email")
      .populate("formation", "title description dateDebut dateFin");

    res.status(200).json({ quizSubmissions });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
    console.log(error);
  }
};
exports.updateQuiz = async (req, res) => {
  const { formationId } = req.params;
  const { questions } = req.body;
  console.log;
  try {
    // Check if the formation has an existing quiz
    let quiz = await Quiz.findOne({ formation: formationId });

    if (!quiz) {
      return res
        .status(404)
        .json({ message: "Quiz not found for this formation" });
    }

    // Validate questions
    if (!Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ message: "Invalid quiz questions" });
    }

    // Update the quiz with new questions
    quiz.questions = questions;
    await quiz.save();

    res.status(200).json({ message: "Quiz updated successfully", quiz });
  } catch (error) {
    console.error("Error updating quiz:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a quiz and its associated submissions
exports.deleteQuiz = async (req, res) => {
  const { quizId } = req.params;

  try {
    // Find the quiz by its ID
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    // Get the formation ID from the quiz
    const formationId = quiz.formation;

    // Delete the quiz
    await Quiz.findByIdAndDelete(quizId);

    // Delete all associated quiz submissions using formation ID
    await QuizSubmission.deleteMany({ formation: formationId });

    res.status(200).json({
      message: "Quiz and associated submissions deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting quiz:", error);
    res.status(500).json({ message: "Server error while deleting quiz" });
  }
};
