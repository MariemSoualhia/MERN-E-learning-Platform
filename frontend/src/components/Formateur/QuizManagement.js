import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  Modal,
  Box,
  Container,
  Typography,
  Grid,
  TextField,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Divider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { DeleteOutlined, EditOutlined, SyncOutlined } from "@ant-design/icons";
import { message } from "antd";
import axios from "axios";
import Sidebar from "../navbar/Sidebar";
import theme from "../../theme";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import VisibilityIcon from "@mui/icons-material/Visibility";

const QuizManagement = () => {
  const [formations, setFormations] = useState([]);
  const [currentFormation, setCurrentFormation] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [quizVisible, setQuizVisible] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState([
    { questionText: "", options: ["", "", "", ""], correctAnswer: "" },
  ]);
  const [editingQuiz, setEditingQuiz] = useState(null);
  const [learnerScores, setLearnerScores] = useState([]);
  const [showScoreModal, setShowScoreModal] = useState(false);

  useEffect(() => {
    fetchFormations();
  }, []);

  const fetchFormations = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/formations/my-formations",
        {
          headers: { "x-auth-token": localStorage.getItem("token") },
        }
      );
      setFormations(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchQuizzes = async (formationId) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/quiz/formation/${formationId}`,
        {
          headers: { "x-auth-token": localStorage.getItem("token") },
        }
      );
      if (res.data && res.data.questions) {
        setQuizzes([res.data]);
        fetchLearnerScores(formationId); // Fetch scores when a quiz is present
      } else {
        setQuizzes([]);
        setLearnerScores([]);
      }
    } catch (error) {
      console.error(error);
      setQuizzes([]);
      setLearnerScores([]);
    }
  };

  const fetchLearnerScores = async (formationId) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/quiz/formateur/learner-scores?formationId=${formationId}`,
        {
          headers: { "x-auth-token": localStorage.getItem("token") },
        }
      );
      setLearnerScores(res.data.quizSubmissions || []);
    } catch (error) {
      console.error("Error fetching learner scores:", error);
      setLearnerScores([]);
    }
  };

  const handleOpenQuizModal = (formation) => {
    setCurrentFormation(formation);
    fetchQuizzes(formation._id);
  };

  const handleCreateQuiz = () => {
    setQuizQuestions([
      { questionText: "", options: ["", "", "", ""], correctAnswer: "" },
    ]);
    setEditingQuiz(null);
    setQuizVisible(true);
  };

  const handleEditQuiz = (quiz) => {
    setQuizQuestions(quiz.questions);
    setEditingQuiz(quiz._id);
    setQuizVisible(true);
  };

  const handleDeleteQuiz = async (quizId) => {
    try {
      await axios.delete(`http://localhost:5000/api/quiz/delete/${quizId}`, {
        headers: { "x-auth-token": localStorage.getItem("token") },
      });
      message.success("Quiz supprimé avec succès !");
      fetchQuizzes(currentFormation._id);
    } catch (error) {
      console.error(error);
      message.error("Erreur lors de la suppression du quiz.");
    }
  };

  const handleQuizSubmit = async () => {
    const isValidQuiz = quizQuestions.every(
      (question) =>
        question.questionText.trim() !== "" &&
        question.correctAnswer.trim() !== "" &&
        question.options.every((option) => option.trim() !== "")
    );

    if (!isValidQuiz) {
      message.error("Veuillez remplir tous les champs du quiz correctement.");
      return;
    }

    try {
      const url = editingQuiz
        ? `http://localhost:5000/api/quiz/update/${currentFormation._id}`
        : `http://localhost:5000/api/quiz/create`;
      const method = editingQuiz ? "put" : "post";

      await axios({
        method: method,
        url: url,
        data: {
          formationId: currentFormation._id,
          questions: quizQuestions,
        },
        headers: { "x-auth-token": localStorage.getItem("token") },
      });

      message.success(
        editingQuiz
          ? "Quiz mis à jour avec succès !"
          : "Quiz créé avec succès !"
      );
      setQuizVisible(false);
      fetchQuizzes(currentFormation._id);
    } catch (error) {
      console.error(error);
      message.error("Erreur lors de l'enregistrement du quiz.");
    }
  };

  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...quizQuestions];
    if (field === "questionText") {
      updatedQuestions[index].questionText = value;
    } else if (field === "correctAnswer") {
      updatedQuestions[index].correctAnswer = value;
    } else {
      updatedQuestions[index].options[field] = value;
    }
    setQuizQuestions(updatedQuestions);
  };

  const handleAddQuestion = () => {
    setQuizQuestions([
      ...quizQuestions,
      { questionText: "", options: ["", "", "", ""], correctAnswer: "" },
    ]);
  };

  const handleRemoveQuestion = (index) => {
    const updatedQuestions = quizQuestions.filter((_, i) => i !== index);
    setQuizQuestions(updatedQuestions);
  };

  const handleViewScores = () => {
    setShowScoreModal(true);
  };

  return (
    <Box sx={{ marginTop: "50px", display: "flex", minHeight: "100vh" }}>
      <Sidebar role="formateur" />
      <Container sx={{ padding: 3, backgroundColor: "#F1F1F1", width: "100%" }}>
        <Typography variant="h2" gutterBottom>
          Gestion des Quiz
        </Typography>

        <Grid container spacing={2}>
          {formations.map((formation) => (
            <Grid item xs={12} sm={6} md={4} key={formation._id}>
              <Card sx={{ padding: 2, borderRadius: "8px" }}>
                <Box sx={{ position: "relative", height: "40%" }}>
                  <Typography variant="h5" sx={{ mt: 2 }}>
                    {formation.title}
                  </Typography>
                  <Button
                    variant="contained"
                    sx={{ mt: 2 }}
                    onClick={() => handleOpenQuizModal(formation)}
                  >
                    Voir les Quiz
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Modal
          open={quizVisible}
          onClose={() => setQuizVisible(false)}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1300,
            backdropFilter: "blur(3px)",
          }}
        >
          <Box
            sx={{
              backgroundColor: "white",
              padding: 3,
              borderRadius: 2,
              maxHeight: "80vh",
              overflowY: "auto",
            }}
          >
            <Typography variant="h4" gutterBottom>
              {editingQuiz ? "Modifier le Quiz" : "Créer un Quiz"}
            </Typography>
            {quizQuestions.map((question, index) => (
              <Box key={index} sx={{ marginBottom: 2 }}>
                <TextField
                  label={`Question ${index + 1}`}
                  fullWidth
                  value={question.questionText}
                  onChange={(e) =>
                    handleQuestionChange(index, "questionText", e.target.value)
                  }
                  sx={{ mb: 2 }}
                />
                {question.options.map((option, optionIndex) => (
                  <TextField
                    key={optionIndex}
                    label={`Option ${optionIndex + 1}`}
                    fullWidth
                    value={option}
                    onChange={(e) =>
                      handleQuestionChange(index, optionIndex, e.target.value)
                    }
                    sx={{ mb: 1 }}
                  />
                ))}
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Réponse correcte</InputLabel>
                  <Select
                    value={question.correctAnswer}
                    onChange={(e) =>
                      handleQuestionChange(
                        index,
                        "correctAnswer",
                        e.target.value
                      )
                    }
                  >
                    {question.options.map((option, optionIndex) => (
                      <MenuItem key={optionIndex} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                  <IconButton onClick={() => handleRemoveQuestion(index)}>
                    <RemoveCircleIcon />
                  </IconButton>
                </Box>
              </Box>
            ))}
            <Button
              variant="outlined"
              fullWidth
              sx={{ mb: 2 }}
              onClick={handleAddQuestion}
            >
              Ajouter une Question
            </Button>
            <Button variant="contained" onClick={handleQuizSubmit}>
              {editingQuiz ? "Mettre à jour" : "Créer"}
            </Button>
          </Box>
        </Modal>

        {currentFormation && (
          <Modal
            open={Boolean(currentFormation)}
            onClose={() => setCurrentFormation(null)}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1300,
              backdropFilter: "blur(3px)",
            }}
          >
            <Box
              sx={{
                backgroundColor: "background.paper",
                borderRadius: 2,
                boxShadow: 24,
                p: 4,
                maxWidth: "80%",
              }}
            >
              <Typography variant="h4" gutterBottom>
                Quiz pour {currentFormation.title}
              </Typography>
              {quizzes.length > 0 ? (
                quizzes.map((quiz) => (
                  <Box key={quiz._id}>
                    <Typography variant="body1">
                      Date de création:{" "}
                      {new Date(quiz.createdAt).toLocaleDateString()}
                    </Typography>
                    <List>
                      {quiz.questions.map((question, index) => (
                        <ListItem key={index}>
                          <ListItemText
                            primary={`Question ${index + 1}: ${
                              question.questionText
                            }`}
                          />
                        </ListItem>
                      ))}
                    </List>
                    <IconButton
                      color="secondary"
                      onClick={() => handleEditQuiz(quiz)}
                      sx={{ mt: 2, mr: 1 }}
                    >
                      <EditOutlined />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDeleteQuiz(quiz._id)}
                      sx={{ mt: 2 }}
                    >
                      <DeleteOutlined />
                    </IconButton>
                    <IconButton
                      color="primary"
                      onClick={handleViewScores}
                      sx={{ mt: 2, ml: 1 }}
                    >
                      <VisibilityIcon />
                    </IconButton>
                  </Box>
                ))
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleCreateQuiz}
                  fullWidth
                >
                  Ajouter un nouveau Quiz
                </Button>
              )}
            </Box>
          </Modal>
        )}

        {/* Modal for displaying learner scores */}
        <Modal
          open={showScoreModal}
          onClose={() => setShowScoreModal(false)}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1300,
            backdropFilter: "blur(3px)",
          }}
        >
          <Box
            sx={{
              backgroundColor: "background.paper",
              borderRadius: 2,
              boxShadow: 24,
              p: 4,
              maxWidth: "80%",
            }}
          >
            <Typography variant="h4" gutterBottom>
              Scores des Apprenants pour {currentFormation?.title}
            </Typography>
            <List>
              {learnerScores.map((submission) => (
                <ListItem key={submission._id}>
                  <ListItemText
                    primary={`Apprenant: ${submission.user.name} - Score: ${submission.score} / ${submission.totalQuestions}`}
                    secondary={`Date de soumission: ${new Date(
                      submission.submittedAt
                    ).toLocaleDateString()}`}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        </Modal>
      </Container>
    </Box>
  );
};

export default QuizManagement;
