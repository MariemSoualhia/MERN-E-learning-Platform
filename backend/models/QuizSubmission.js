// models/QuizSubmission.js
const mongoose = require("mongoose");

const QuizSubmissionSchema = new mongoose.Schema({
  formation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Formation",
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  score: {
    type: Number,
    required: true,
  },
  totalQuestions: {
    type: Number,
    required: true,
  },
  answers: {
    type: Map,
    of: String, // Question index to selected answer
    required: true,
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("QuizSubmission", QuizSubmissionSchema);
