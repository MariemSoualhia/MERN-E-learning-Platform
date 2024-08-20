import React, { useEffect, useState } from "react";
import { Card, Button, Modal, message } from "antd";
import axios from "axios";
import { Box, Container, Typography, Grid } from "@mui/material";
import Sidebar from "../navbar/Sidebar";
import theme from "../../theme";

const MyEnrollments = () => {
  const [formationsBySpecialty, setFormationsBySpecialty] = useState({
    upcoming: {},
    completed: {},
  });
  const [currentFormation, setCurrentFormation] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

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
      console.log(res.data);
    } catch (error) {
      console.error(error);
      message.error("Erreur lors de la récupération des formations.");
    }
  };

  useEffect(() => {
    fetchFormations();
  }, []);

  const showDetails = (formation) => {
    setCurrentFormation(formation);
    setIsModalVisible(true);
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
                        <strong>Prix:</strong> {formation.prix}
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
                        type="danger"
                        onClick={() => handleCancelEnrollment(formation._id)}
                        style={{
                          backgroundColor: "#FF4D4F",
                          color: "#FFFFFF",
                        }}
                      >
                        Annuler Inscription
                      </Button>
                    </Box>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        ))}

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
                        <strong>Prix:</strong> {formation.prix}
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
                        }}
                      >
                        Détails
                      </Button>
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
                  <strong>Prix:</strong> {currentFormation.prix}
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
      </Container>
    </Box>
  );
};

export default MyEnrollments;
