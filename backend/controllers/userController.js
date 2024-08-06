const User = require("../models/User");

// Actions spécifiques aux administrateurs
exports.adminAction = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Erreur serveur");
  }
};

// Actions spécifiques aux formateurs
exports.formateurAction = async (req, res) => {
  try {
    const formateur = await User.findById(req.user.id);
    res.json({
      message: "Action spécifique au formateur exécutée",
      specialty: formateur.specialty,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Erreur serveur");
  }
};

// Actions spécifiques aux apprenants
exports.apprenantAction = async (req, res) => {
  try {
    res.send("Action spécifique à l'apprenant exécutée");
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Erreur serveur");
  }
};
