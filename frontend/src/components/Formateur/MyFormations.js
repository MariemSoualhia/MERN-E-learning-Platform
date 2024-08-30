import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  Modal,
  Box,
  Container,
  Typography,
  Grid,
  List,
  ListItem,
  ListItemText,
  Divider,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  TextField,
  IconButton,
} from "@mui/material";
import {
  DeleteOutlined,
  SyncOutlined,
  AddCircleOutline,
} from "@ant-design/icons";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import { message } from "antd";
import axios from "axios";
import Sidebar from "../navbar/Sidebar";
import EditFormationForm from "./EditFormationForm";
import UserDetails from "../Profil/UserDetails";
import theme from "../../theme";

const MyFormations = () => {
  const [formations, setFormations] = useState([]);
  const [visible, setVisible] = useState(false);
  const [currentFormation, setCurrentFormation] = useState(null);
  const [apprenants, setApprenants] = useState([]);
  const [apprenantsVisible, setApprenantsVisible] = useState(false);
  const [userDetailsVisible, setUserDetailsVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [statusFilter, setStatusFilter] = useState(""); // Filter by status
  const [quizVisible, setQuizVisible] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState([
    { questionText: "", options: ["", "", "", ""], correctAnswer: "" },
  ]);

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

  const filteredFormations = formations.filter((formation) =>
    statusFilter ? formation.status === statusFilter : true
  );

  const showEditModal = (formation) => {
    setCurrentFormation(formation);
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
    setCurrentFormation(null);
  };

  const handleUpdate = (updatedFormation) => {
    setFormations((prevFormations) =>
      prevFormations.map((formation) =>
        formation._id === updatedFormation._id ? updatedFormation : formation
      )
    );
    setVisible(false);
    setCurrentFormation(null);
  };

  const showApprenantsModal = async (formation) => {
    setCurrentFormation(formation);
    try {
      const res = await axios.get(
        `http://localhost:5000/api/formations/${formation._id}/apprenants`,
        {
          headers: { "x-auth-token": localStorage.getItem("token") },
        }
      );
      setApprenants(res.data);
      setApprenantsVisible(true);
    } catch (error) {
      console.error(error);
      message.error("Erreur lors de la récupération des apprenants.");
    }
  };

  const handleApprenantsCancel = () => {
    setApprenantsVisible(false);
    setCurrentFormation(null);
  };

  const showUserDetailsModal = (apprenant) => {
    setSelectedUser(apprenant);
    setUserDetailsVisible(true);
  };

  const handleUserDetailsCancel = () => {
    setUserDetailsVisible(false);
    setSelectedUser(null);
  };

  const handleSendEmail = async () => {
    if (!currentFormation || !currentFormation._id) {
      message.error("Formation non sélectionnée ou invalide.");
      return;
    }

    try {
      const res = await axios.post(
        `http://localhost:5000/api/formations/${currentFormation._id}/send-email`,
        {},
        {
          headers: { "x-auth-token": localStorage.getItem("token") },
        }
      );
      message.success(res.data.message);
    } catch (error) {
      console.error(error);
      message.error("Erreur lors de l'envoi de l'email.");
    }
  };

  const handleCancelEnrollment = async (formationId) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/formations/${formationId}`,
        {
          headers: { "x-auth-token": localStorage.getItem("token") },
        }
      );
      message.success("Inscription annulée avec succès.");
      fetchFormations(); // Refresh formations
    } catch (error) {
      console.error(error);
      message.error("Erreur lors de l'annulation de l'inscription.");
    }
  };

  const handleRefresh = () => {
    fetchFormations();
    setStatusFilter(""); // Reset the filter
  };

  const showQuizModal = async (formation) => {
    setCurrentFormation(formation);

    if (formation.quizExists) {
      try {
        // API call to get existing quiz questions
        const res = await axios.get(
          `http://localhost:5000/api/quiz/formation/${formation._id}`,
          {
            headers: { "x-auth-token": localStorage.getItem("token") },
          }
        );
        setQuizQuestions(res.data.questions); // Assuming API returns { questions: [...] }
      } catch (error) {
        console.error("Erreur lors du chargement du quiz existant:", error);
        message.error("Impossible de charger le quiz existant.");
        return;
      }
    } else {
      // If no existing quiz, reset to default empty question
      setQuizQuestions([
        { questionText: "", options: ["", "", "", ""], correctAnswer: "" },
      ]);
    }

    setQuizVisible(true);
  };

  const handleQuizCancel = () => {
    setQuizVisible(false);
  };

  const handleQuizSubmit = async () => {
    // Validate quiz before submission
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
      if (currentFormation?.quizExists) {
        // API call to update existing quiz
        await axios.put(
          `http://localhost:5000/api/quiz/update/${currentFormation._id}`,
          { questions: quizQuestions },
          {
            headers: { "x-auth-token": localStorage.getItem("token") },
          }
        );
        message.success("Quiz updated successfully!");
      } else {
        // API call to create a new quiz
        await axios.post(
          `http://localhost:5000/api/quiz/create`,
          { formationId: currentFormation._id, questions: quizQuestions },
          {
            headers: { "x-auth-token": localStorage.getItem("token") },
          }
        );
        message.success("Quiz created successfully!");
      }

      setQuizVisible(false);
    } catch (error) {
      message.error("Failed to update quiz.");
      console.error(error);
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

  return (
    <Box sx={{ marginTop: "50px", display: "flex", minHeight: "100vh" }}>
      <Sidebar role="formateur" />
      <Container sx={{ padding: 3, backgroundColor: "#F1F1F1", width: "100%" }}>
        <Typography variant="h2" gutterBottom>
          Mes Formations
        </Typography>

        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Filtrer par statut</InputLabel>
            <Select
              value={statusFilter}
              label="Filtrer par statut"
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <MenuItem value="">
                <em>Tous</em>
              </MenuItem>
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="en attente">En attente</MenuItem>
              <MenuItem value="rejetée">Rejetée</MenuItem>
            </Select>
          </FormControl>
          <Button
            icon={<SyncOutlined />}
            onClick={handleRefresh}
            sx={{
              backgroundColor: theme.palette.primary.main,
              color: "#FFFFFF",
            }}
          >
            Refresh
          </Button>
        </Box>

        <Grid container spacing={2}>
          {filteredFormations.map((formation) => (
            <Grid item xs={12} sm={6} md={4} key={formation._id}>
              <Card sx={{ padding: 2, borderRadius: "8px" }}>
                <Box sx={{ position: "relative", height: "40%" }}>
                  <img
                    alt={formation.title}
                    src={`http://localhost:5000/static-images/${formation.image}`}
                    style={{ width: "100%", borderRadius: "8px" }}
                  />
                  <Typography variant="h5" sx={{ mt: 2 }}>
                    {formation.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Statut: {formation.status}
                  </Typography>
                  <Typography variant="body1">
                    Date de début:{" "}
                    {new Date(formation.dateDebut).toLocaleDateString()}
                  </Typography>
                  <Typography variant="body1">
                    Date de fin:{" "}
                    {new Date(formation.dateFin).toLocaleDateString()}
                  </Typography>
                  <Typography variant="body1">
                    Durée: {formation.duree} heures
                  </Typography>
                  <Typography variant="body1">
                    Prix: {formation.prix} DT
                  </Typography>
                </Box>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Button
                    color="primary"
                    onClick={() => showEditModal(formation)}
                  >
                    Modifier
                  </Button>
                  <Button
                    color="primary"
                    onClick={() => showApprenantsModal(formation)}
                  >
                    Voir les apprenants
                  </Button>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                  <Button
                    icon={<DeleteOutlined />}
                    type="danger"
                    style={{
                      backgroundColor: "#FF4D4F",
                      color: "#FFFFFF",
                    }}
                    onClick={() => handleCancelEnrollment(formation._id)}
                  >
                    Annuler la formation
                  </Button>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                  {formation.quizExists ? (
                    <Button onClick={() => showQuizModal(formation)}>
                      Modifier le Quiz
                    </Button>
                  ) : (
                    <Button onClick={() => showQuizModal(formation)}>
                      Ajouter un Quiz
                    </Button>
                  )}
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
        <Modal
          open={quizVisible}
          onClose={handleQuizCancel}
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
              {currentFormation?.quizExists
                ? "Modifier le Quiz"
                : "Créer un Quiz"}
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
                    <RemoveCircleOutlineIcon />
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
              {currentFormation?.quizExists
                ? "Modifier le Quiz"
                : "Créer le Quiz"}
            </Button>
          </Box>
        </Modal>

        {/* Modal pour modifier une formation */}
        {currentFormation && (
          <Modal
            open={visible}
            onClose={handleCancel}
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
              <EditFormationForm
                formation={currentFormation}
                onUpdate={handleUpdate}
                onClose={handleCancel}
              />
            </Box>
          </Modal>
        )}

        {/* Modal pour afficher la liste des apprenants */}
        {currentFormation && (
          <Modal
            open={apprenantsVisible}
            onClose={handleApprenantsCancel}
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
                Liste des apprenants inscrits
              </Typography>
              <List>
                {apprenants.map((apprenant) => (
                  <ListItem
                    key={apprenant._id}
                    secondaryAction={
                      <Button
                        style={{
                          borderColor: theme.palette.primary.main,
                        }}
                        onClick={() => showUserDetailsModal(apprenant)}
                      >
                        Détails
                      </Button>
                    }
                  >
                    <ListItemText
                      primary={`${apprenant.name} - ${apprenant.email}`}
                    />
                  </ListItem>
                ))}
              </List>
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}
              >
                {apprenants.length > 0 && (
                  <Button
                    color="primary"
                    variant="outlined"
                    onClick={handleSendEmail}
                    disabled={!currentFormation || !currentFormation._id}
                  >
                    Envoyer Email
                  </Button>
                )}
                <Button color="secondary" onClick={handleApprenantsCancel}>
                  Fermer
                </Button>
              </Box>
            </Box>
          </Modal>
        )}

        {/* Modal pour afficher les détails d'un apprenant */}
        {selectedUser && (
          <Modal
            open={userDetailsVisible}
            onClose={handleUserDetailsCancel}
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
              <UserDetails userId={selectedUser._id} />
              <Button
                sx={{ mt: 2 }}
                color="secondary"
                onClick={handleUserDetailsCancel}
              >
                Fermer
              </Button>
            </Box>
          </Modal>
        )}
      </Container>
    </Box>
  );
};

export default MyFormations;
