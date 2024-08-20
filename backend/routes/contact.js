// routes/contact.js
const express = require("express");
const Contact = require("../models/Contact");
const { isAdmin } = require("../middleware/auth"); // Assuming you have an admin authentication middleware

const router = express.Router();

// Handle contact form submissions
router.post("/submit", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Basic validation
    if (!name || !email || !message) {
      return res
        .status(400)
        .json({ error: "Veuillez remplir tous les champs du formulaire." });
    }

    // Save the contact message in the database (optional)
    const newContact = new Contact({
      name,
      email,
      message,
    });

    await newContact.save();

    // If you want to send an email instead of storing it in the database, you would do it here.
    // For example, using nodemailer:
    // const nodemailer = require("nodemailer");
    // let transporter = nodemailer.createTransport({...});
    // await transporter.sendMail({
    //   from: email,
    //   to: "support@example.com",
    //   subject: `Contact form submission from ${name}`,
    //   text: message,
    // });

    res
      .status(200)
      .json({ message: "Votre message a été envoyé avec succès !" });
  } catch (error) {
    console.error("Error submitting contact form:", error.message);
    res.status(500).json({ error: "Erreur du serveur." });
  }
});
// Get all contact messages (only accessible by admin)
router.get("/all", async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ date: -1 }); // Fetch contacts sorted by date (most recent first)
    res.status(200).json(contacts);
  } catch (error) {
    console.error("Error fetching contact messages:", error.message);
    res.status(500).json({ error: "Erreur du serveur." });
  }
});
module.exports = router;
