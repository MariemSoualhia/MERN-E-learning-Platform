module.exports.isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res
      .status(403)
      .json({ msg: "Accès refusé: vous n'êtes pas administrateur." });
  }
  next();
};

module.exports.isFormateur = (req, res, next) => {
  if (req.user.role !== "formateur") {
    return res
      .status(403)
      .json({ msg: "Accès refusé: vous n'êtes pas formateur." });
  }
  next();
};

module.exports.isApprenant = (req, res, next) => {
  if (req.user.role !== "apprenant") {
    return res
      .status(403)
      .json({ msg: "Accès refusé: vous n'êtes pas apprenant." });
  }
  next();
};
