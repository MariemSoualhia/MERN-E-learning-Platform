const express = require("express");
const router = express.Router();
const {
  register,
  login,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");

// Route pour l'inscription
router.post("/register", register);

// Route pour la connexion
router.post("/login", login);
// Route to handle forgot password
router.post("/forgot-password", forgotPassword);

// Route to handle password reset
router.post("/reset-password/:token", resetPassword);
module.exports = router;
