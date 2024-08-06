const Course = require("../models/Course");
const User = require("../models/User");

// Ajout de formation par le formateur
exports.addCourse = async (req, res) => {
  const { title, description, specialty } = req.body;
  try {
    const newCourse = new Course({
      title,
      description,
      specialty,
      creator: req.user.id,
    });
    const course = await newCourse.save();
    res.json(course);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Erreur serveur");
  }
};

// Validation des formations par l'administrateur
exports.approveCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ msg: "Formation non trouvée" });
    }
    course.status = "active";
    await course.save();
    res.json(course);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Erreur serveur");
  }
};

// Rejet des formations par l'administrateur
exports.rejectCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ msg: "Formation non trouvée" });
    }
    course.status = "rejetée";
    await course.save();
    res.json(course);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Erreur serveur");
  }
};

// Consultation des formations par les apprenants
exports.getCourses = async (req, res) => {
  try {
    const courses = await Course.find({ status: "active" });
    res.json(courses);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Erreur serveur");
  }
};

// Inscription à une formation par l'apprenant
exports.enrollCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ msg: "Formation non trouvée" });
    }
    // Logic for payment and enrollment
    // ...

    res.send("Inscription réussie");
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Erreur serveur");
  }
};
