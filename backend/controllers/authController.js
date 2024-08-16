const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const nodemailer = require("nodemailer");
const sendEmail = require("./emailService"); // Adjust the path accordingly
exports.register = async (req, res) => {
  const { name, email, password, role, specialty } = req.body;
  try {
    console.log(req.body);
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: "User already exists" });
    }
    user = new User({
      name,
      email,
      password,
      role,
      specialty: role === "formateur" ? specialty : null,
    });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();
    const payload = {
      user: {
        id: user.id,
        role: user.role,
      },
    };
    jwt.sign(payload, "yourSecretKey", { expiresIn: 3600 }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "Invalid Credentials" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid Credentials" });
    }
    const payload = {
      user: {
        id: user.id,
        role: user.role,
      },
    };
    const token = jwt.sign(payload, "yourSecretKey", { expiresIn: "1h" });

    res.status(200).json({
      token: token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        photoProfil: user.photoProfil,
        specialty: user.specialty,
        phoneNumber: user.phoneNumber,
        address: user.address,
        bio: user.bio,
        socialLinks: user.socialLinks,
        notifications: user.notifications,
        date: user.date,
        lastLogin: user.lastLogin,
        isActive: user.isActive,
      },
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Controller function for handling password reset requests
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const token = crypto.randomBytes(20).toString("hex");

    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

    await user.save();

    const resetUrl = `http://localhost:3000/reset-password/${token}`;

    await sendEmail({
      to: user.email,
      subject: "Réinitialisation du mot de passe",
      text: `Vous recevez cet email parce que vous (ou quelqu'un d'autre) avez demandé la réinitialisation du mot de passe de votre compte.\n\n
      Veuillez cliquer sur le lien suivant, ou le copier dans votre navigateur pour terminer le processus dans l'heure suivant la réception de cet email :\n\n
      ${resetUrl}\n\n
      Si vous n'avez pas fait cette demande, veuillez ignorer cet email et votre mot de passe restera inchangé.\n`,
    });

    res
      .status(200)
      .json({ message: "Email de réinitialisation du mot de passe envoyé" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Controller function for handling password resets
exports.resetPassword = async (req, res) => {
  try {
    const user = await User.findOne({
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Password reset token is invalid or has expired" });
    }

    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();
    res.status(200).json({ message: "Password has been reset" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
