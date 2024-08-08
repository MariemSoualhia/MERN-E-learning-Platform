// middleware/roles.js

exports.isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res
      .status(403)
      .json({ msg: "Accès refusé: vous n'êtes pas administrateur." });
  }
  next();
};

exports.isFormateur = (req, res, next) => {
  if (req.user.role !== "formateur") {
    return res
      .status(403)
      .json({ msg: "Accès refusé: vous n'êtes pas formateur." });
  }
  next();
};

exports.isApprenant = (req, res, next) => {
  if (req.user.role !== "apprenant") {
    return res
      .status(403)
      .json({ msg: "Accès refusé: vous n'êtes pas apprenant." });
  }
  next();
};
