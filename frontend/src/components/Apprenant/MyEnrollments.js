import React, { useEffect, useState } from "react";
import { Card, Button, Modal, message, Radio } from "antd";
import axios from "axios";
import { Box, Container, Typography, Grid } from "@mui/material";
import Sidebar from "../navbar/Sidebar";
import theme from "../../theme";
import LinearProgress from "@mui/material/LinearProgress";
const MyEnrollments = () => {
  const [formationsBySpecialty, setFormationsBySpecialty] = useState({
    upcoming: {},
    completed: {},
  });
  const [currentFormation, setCurrentFormation] = useState(null);
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isQuizModalVisible, setIsQuizModalVisible] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false); // Track if quiz has been submitted
  const [quizSubmissionStatus, setQuizSubmissionStatus] = useState({});
  const [timeLeft, setTimeLeft] = useState(900); // Set 15 minutes in seconds
  const [quizSubmitting, setQuizSubmitting] = useState(false); // New state to track if submitting

  const fetchFormations = async () => {
    const token = localStorage.getItem("token");

    try {
      const res = await axios.get(
        "http://localhost:5000/api/formations/my-enrollments",
        {
          headers: { "x-auth-token": token },
        }
      );
      setFormationsBySpecialty(res.data);

      // Initialize submissionStatus object
      const submissionStatus = {};
      for (const specialty of Object.keys(res.data.completed)) {
        for (const formation of res.data.completed[specialty]) {
          const submissionRes = await axios.get(
            `http://localhost:5000/api/quiz/check-submission/${formation._id}`,
            {
              headers: { "x-auth-token": token },
            }
          );
          submissionStatus[formation._id] = {
            submitted: submissionRes.data.submitted,
            score: submissionRes.data.score,
            totalQuestions: submissionRes.data.totalQuestions,
          };
        }
      }
      setQuizSubmissionStatus(submissionStatus);
    } catch (error) {
      console.error(error);
      message.error("Erreur lors de la récupération des formations.");
    }
  };

  const fetchQuiz = async (formationId) => {
    const token = localStorage.getItem("token");

    try {
      const res = await axios.get(
        `http://localhost:5000/api/quiz/formation/${formationId}`,
        {
          headers: { "x-auth-token": token },
        }
      );
      setCurrentQuiz(res.data);
      setQuizSubmitted(false); // Reset quiz submission status
      setQuizAnswers({}); // Reset quiz answers
      setIsQuizModalVisible(true);
    } catch (error) {
      console.error(error);
      message.error("Erreur lors de la récupération du quiz.");
    }
  };

  useEffect(() => {
    fetchFormations();
  }, []);
  useEffect(() => {
    let timer;
    if (isQuizModalVisible && !quizSubmitted && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleQuizSubmit(); // Automatically submit when time runs out
    }
    return () => clearInterval(timer); // Cleanup on component unmount
  }, [isQuizModalVisible, timeLeft, quizSubmitted]);
  const showDetails = (formation) => {
    setCurrentFormation(formation);
    setIsModalVisible(true);
  };

  const showQuiz = (formation) => {
    setCurrentFormation(formation);
    fetchQuiz(formation._id);
  };

  const handleQuizAnswerChange = (questionIndex, selectedOption) => {
    setQuizAnswers({
      ...quizAnswers,
      [questionIndex]: selectedOption,
    });
  };

  const handleQuizSubmit = async () => {
    let score = 0;

    // Calculate the score
    currentQuiz.questions.forEach((question, index) => {
      if (quizAnswers[index] === question.correctAnswer) {
        score += 1;
      }
    });
    const totalQuestions = currentQuiz.questions.length; // Get the total number of questions

    const token = localStorage.getItem("token");
    try {
      const rep = await axios.post(
        `http://localhost:5000/api/quiz/submit/`,
        {
          formationId: currentFormation._id,
          score: score,
          answers: quizAnswers,
          totalQuestions: totalQuestions, // Pass totalQuestions in the request
        },
        {
          headers: { "x-auth-token": token },
        }
      );
      message.success("Quiz soumis avec succès !");
      setQuizSubmitted(true);
      setIsQuizModalVisible(false);

      // Wait 200 milliseconds before fetching formations
      setTimeout(() => {
        fetchFormations();
      }, 200);
    } catch (error) {
      console.error(error);
      //message.error("Erreur lors de la soumission du quiz.");
    }
  };

  const handleCancelEnrollment = async (formationId) => {
    const token = localStorage.getItem("token");

    try {
      await axios.delete(
        `http://localhost:5000/api/formations/cancel-enrollment/${formationId}`,
        {
          headers: { "x-auth-token": token },
        }
      );
      message.success("Inscription annulée avec succès.");
      fetchFormations();
    } catch (error) {
      console.error(error);
      message.error("Erreur lors de l'annulation de l'inscription.");
    }
  };

  return (
    <Box sx={{ marginTop: "50px", display: "flex", minHeight: "100vh" }}>
      <Sidebar role="apprenant" />
      <Container sx={{ padding: 3, backgroundColor: "#F1F1F1", width: "100%" }}>
        <Typography variant="h2" gutterBottom>
          Mes Inscriptions
        </Typography>

        {/* Formations à venir */}
        <Typography variant="h4" gutterBottom>
          Formations à venir
        </Typography>
        {Object.keys(formationsBySpecialty.upcoming).map((specialty) => (
          <Box key={specialty} sx={{ mb: 4 }}>
            <Typography variant="h5">{specialty}</Typography>
            <Grid container spacing={3}>
              {formationsBySpecialty.upcoming[specialty].map((formation) => (
                <Grid item xs={12} sm={6} md={4} key={formation._id}>
                  <Card
                    hoverable
                    cover={
                      <img
                        alt={formation.title}
                        src={`http://localhost:5000/static-images/${formation.image}`}
                        style={{
                          borderTopLeftRadius: "8px",
                          borderTopRightRadius: "8px",
                          height: "200px",
                          objectFit: "cover",
                        }}
                      />
                    }
                    style={{
                      borderRadius: "8px",
                      boxShadow: theme.shadows[3],
                    }}
                  >
                    <Box sx={{ p: 2 }}>
                      <Typography variant="h5" sx={{ mt: 2 }}>
                        {formation.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 1 }}
                      >
                        {formation.description}
                      </Typography>
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        <strong>Date de début:</strong>{" "}
                        {new Date(formation.dateDebut).toLocaleDateString()}
                      </Typography>
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        <strong>Date de fin:</strong>{" "}
                        {new Date(formation.dateFin).toLocaleDateString()}
                      </Typography>
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        <strong>Durée:</strong> {formation.duree} heures
                      </Typography>
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        <strong>Niveau:</strong> {formation.niveau}
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: "center", mb: 2 }}>
                      <Button
                        type="primary"
                        onClick={() => showDetails(formation)}
                        style={{
                          backgroundColor: theme.palette.primary.main,
                          borderColor: theme.palette.primary.main,
                          color: "#FFFFFF",
                          marginRight: "10px",
                        }}
                      >
                        Détails
                      </Button>
                      <Button
                        type="primary"
                        onClick={() => handleCancelEnrollment(formation._id)}
                        style={{
                          backgroundColor: theme.palette.error.main,
                          borderColor: theme.palette.error.main,
                          color: "#FFFFFF",
                        }}
                      >
                        Annuler l'inscription
                      </Button>
                    </Box>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        ))}

        {/* Formations terminées */}
        <Typography variant="h4" gutterBottom>
          Formations terminées
        </Typography>
        {Object.keys(formationsBySpecialty.completed).map((specialty) => (
          <Box key={specialty} sx={{ mb: 4 }}>
            <Typography variant="h5">{specialty}</Typography>
            <Grid container spacing={3}>
              {formationsBySpecialty.completed[specialty].map((formation) => (
                <Grid item xs={12} sm={6} md={4} key={formation._id}>
                  <Card
                    hoverable
                    cover={
                      <img
                        alt={formation.title}
                        src={`http://localhost:5000/static-images/${formation.image}`}
                        style={{
                          borderTopLeftRadius: "8px",
                          borderTopRightRadius: "8px",
                          height: "200px",
                          objectFit: "cover",
                        }}
                      />
                    }
                    style={{
                      borderRadius: "8px",
                      boxShadow: theme.shadows[3],
                    }}
                  >
                    <Box sx={{ p: 2 }}>
                      <Typography variant="h5" sx={{ mt: 2 }}>
                        {formation.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 1 }}
                      >
                        {formation.description}
                      </Typography>
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        <strong>Date de début:</strong>{" "}
                        {new Date(formation.dateDebut).toLocaleDateString()}
                      </Typography>
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        <strong>Date de fin:</strong>{" "}
                        {new Date(formation.dateFin).toLocaleDateString()}
                      </Typography>
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        <strong>Durée:</strong> {formation.duree} heures
                      </Typography>
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        <strong>Niveau:</strong> {formation.niveau}
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: "center", mb: 2 }}>
                      <Button
                        type="primary"
                        onClick={() => showDetails(formation)}
                        style={{
                          backgroundColor: theme.palette.primary.main,
                          borderColor: theme.palette.primary.main,
                          color: "#FFFFFF",
                          marginRight: "10px",
                        }}
                      >
                        Détails
                      </Button>
                      {quizSubmissionStatus[formation._id]?.submitted ? (
                        <Typography
                          variant="body2"
                          sx={{ mt: 2, color: "green" }}
                        >
                          Quiz déjà soumis - Score:{" "}
                          {quizSubmissionStatus[formation._id].score !==
                          undefined
                            ? `${quizSubmissionStatus[formation._id].score} / ${
                                quizSubmissionStatus[formation._id]
                                  .totalQuestions
                              }`
                            : "Score indisponible"}
                        </Typography>
                      ) : (
                        <Button
                          type="primary"
                          onClick={() => showQuiz(formation)}
                          style={{
                            backgroundColor: theme.palette.secondary.main,
                            borderColor: theme.palette.secondary.main,
                            color: "#FFFFFF",
                          }}
                        >
                          Voir le Quiz
                        </Button>
                      )}
                    </Box>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        ))}

        <Modal
          title={<Typography variant="h4">Détails de l'Inscription</Typography>}
          open={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={null}
          centered
          style={{ top: 20 }} // Optional: Adjust the modal position
        >
          {currentFormation && (
            <Box sx={{ p: 2 }}>
              <Typography variant="h5" gutterBottom>
                {currentFormation.title}
              </Typography>
              <Typography
                variant="body1"
                gutterBottom
                sx={{ color: "text.secondary" }}
              >
                {currentFormation.description}
              </Typography>
              <Box sx={{ my: 2 }}>
                <Typography
                  variant="subtitle1"
                  gutterBottom
                  sx={{ fontWeight: 500 }}
                >
                  Détails de la Formation
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Date de début:</strong>{" "}
                  {new Date(currentFormation.dateDebut).toLocaleDateString()}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Date de fin:</strong>{" "}
                  {new Date(currentFormation.dateFin).toLocaleDateString()}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Durée:</strong> {currentFormation.duree} heures
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Niveau:</strong> {currentFormation.niveau}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Formateur:</strong>{" "}
                  {currentFormation.formateur
                    ? currentFormation.formateur.name
                    : "N/A"}
                </Typography>
              </Box>
            </Box>
          )}
        </Modal>

        <Modal
          title={
            <Typography variant="h4" sx={{ textAlign: "center" }}>
              Quiz
            </Typography>
          }
          open={isQuizModalVisible}
          onCancel={() => setIsQuizModalVisible(false)}
          footer={
            !quizSubmitted ? (
              <Button
                type="primary"
                onClick={handleQuizSubmit}
                style={{
                  backgroundColor: theme.palette.primary.main,
                  borderColor: theme.palette.primary.main,
                  color: "#FFFFFF",
                }}
              >
                Soumettre le Quiz
              </Button>
            ) : (
              <Typography variant="h6">
                Score: {quizSubmissionStatus[currentFormation._id]?.score} /{" "}
                {currentQuiz?.questions.length}
              </Typography>
            )
          }
          centered
          bodyStyle={{
            backgroundColor: "#FFF",
            padding: "20px",
            borderRadius: "10px",
            boxShadow: theme.shadows[3],
            maxHeight: "60vh",
            overflowY: "auto", // Scroll si le contenu dépasse la hauteur
          }}
        >
          {currentQuiz && (
            <Box sx={{ p: 2, textAlign: "center" }}>
              <Box sx={{ mb: 2 }}>
                <LinearProgress
                  variant="determinate"
                  value={((900 - timeLeft) / 900) * 100} // Pourcentage du temps écoulé
                  sx={{
                    height: "10px",
                    borderRadius: "5px",
                    backgroundColor: theme.palette.background.default,
                    "& .MuiLinearProgress-bar": {
                      backgroundColor: theme.palette.primary.main,
                    },
                  }}
                />
                <Typography
                  variant="h6"
                  sx={{ mt: 2, color: theme.palette.secondary.main }}
                >
                  Temps restant: {Math.floor(timeLeft / 60)}:
                  {timeLeft % 60 < 10 ? `0${timeLeft % 60}` : timeLeft % 60}
                </Typography>
              </Box>
              {currentQuiz.questions.map((question, index) => (
                <Box key={index} sx={{ mb: 3 }}>
                  <Typography variant="h6">
                    {index + 1}. {question.questionText}
                  </Typography>
                  <Radio.Group
                    onChange={(e) =>
                      handleQuizAnswerChange(index, e.target.value)
                    }
                    value={quizAnswers[index]}
                    disabled={quizSubmitted}
                  >
                    {question.options.map((option, optionIndex) => (
                      <Radio key={optionIndex} value={option}>
                        {option}
                      </Radio>
                    ))}
                  </Radio.Group>
                </Box>
              ))}
            </Box>
          )}
        </Modal>
      </Container>
    </Box>
  );
};

export default MyEnrollments;
