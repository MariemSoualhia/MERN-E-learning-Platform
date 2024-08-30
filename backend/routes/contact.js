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
// Get all contact messages with pagination (only accessible by admin)
router.get("/all", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 5; // Number of contacts per page
  const skip = (page - 1) * limit;

  try {
    const totalContacts = await Contact.countDocuments();
    const contacts = await Contact.find()
      .sort({ date: -1 }) // Most recent first
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      contacts,
      totalPages: Math.ceil(totalContacts / limit),
    });
  } catch (error) {
    console.error("Error fetching contact messages:", error.message);
    res.status(500).json({ error: "Erreur du serveur." });
  }
});

// Delete a contact message by ID
router.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Contact.findByIdAndDelete(id);
    res
      .status(200)
      .json({ message: "Message de contact supprimé avec succès." });
  } catch (error) {
    console.error("Error deleting contact message:", error.message);
    res
      .status(500)
      .json({ error: "Erreur du serveur lors de la suppression du message." });
  }
});

module.exports = router;
