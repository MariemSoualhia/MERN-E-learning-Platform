const Formation = require("../models/Formation");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const auth = require("../middleware/auth");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "../uploads"); // Notez que nous montons d'un niveau
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

const upload = multer({ storage: storage });

exports.addFormation = [
  upload.single("image"),
  async (req, res) => {
    const { title, description, dateDebut, dateFin, duree, prix, specialty } =
      req.body;

    try {
      const newFormation = new Formation({
        title,
        description,
        specialty,
        dateDebut,
        dateFin,
        duree,
        prix,
        image: req.file ? req.file.filename : "",
        formateur: req.user.id,
      });

      const formation = await newFormation.save();
      res.status(201).json(formation);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server error");
    }
  },
];

// Mettre à jour une formation
exports.updateFormation = [
  auth, // Ensure this middleware is used to check authentication
  upload.single("image"),
  async (req, res) => {
    const { title, description, dateDebut, dateFin, duree, prix, specialty } =
      req.body;

    try {
      let formation = await Formation.findById(req.params.id);

      if (!formation) {
        return res.status(404).json({ msg: "Formation not found" });
      }

      // Check if the user is authorized to update the formation
      if (formation.formateur.toString() !== req.user.id) {
        return res.status(403).json({ msg: "User not authorized" });
      }

      formation.title = title || formation.title;
      formation.description = description || formation.description;
      formation.specialty = req.user.specialty || formation.specialty; // Utiliser la spécialité du formateur
      formation.dateDebut = dateDebut || formation.dateDebut;
      formation.dateFin = dateFin || formation.dateFin;
      formation.duree = duree || formation.duree;
      formation.prix = prix || formation.prix;
      formation.image = req.file
        ? `/uploads/${req.file.filename}`
        : formation.image;

      await formation.save();

      res.json(formation);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server error");
    }
  },
];
// Récupérer les formations en attente
exports.getPendingFormations = async (req, res) => {
  try {
    const formations = await Formation.find({ status: "pending" });
    res.json(formations);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

// Mettre à jour le statut d'une formation
exports.updateFormationStatus = async (req, res) => {
  const { status } = req.body;
  try {
    let formation = await Formation.findById(req.params.id);

    if (!formation) {
      return res.status(404).json({ msg: "Formation not found" });
    }

    formation.status = status;
    await formation.save();

    res.json(formation);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

// Récupérer les formations actives
exports.getActiveFormations = async (req, res) => {
  try {
    const formations = await Formation.find({ status: "active" });
    res.json(formations);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

// Récupérer les formations d'un formateur
exports.getMyFormations = async (req, res) => {
  try {
    const formations = await Formation.find({ formateur: req.user.id });
    res.json(formations);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};
