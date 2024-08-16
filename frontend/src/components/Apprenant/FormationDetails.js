import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Box,
  Button,
  Card,
  CardContent,
} from "@mui/material";
import axios from "axios";
import { useParams } from "react-router-dom";
import Sidebar from "../navbar/Sidebar";
import { message, Popconfirm } from "antd";
import theme from "../../theme";

const FormationDetails = () => {
  const { formationId } = useParams();
  const [formation, setFormation] = useState(null);
  const [formateur, setFormateur] = useState(null);
  const [user] = useState(() =>
    JSON.parse(localStorage.getItem("currentuser"))
  );

  useEffect(() => {
    const fetchFormationDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/formations/${formationId}`
        );
        setFormation(response.data);
        setFormateur(response.data.formateur);
      } catch (error) {
        message.error(
          "Erreur lors de la récupération des détails de la formation"
        );
        console.error(error);
      }
    };

    fetchFormationDetails();
  }, [formationId]);

  const handleInscription = async () => {
    const token = localStorage.getItem("token");

    try {
      await axios.post(
        `http://localhost:5000/api/formations/enroll/${formationId}`,
        {},
        {
          headers: {
            "x-auth-token": token,
          },
        },
        {
          user: user.id,
        }
      );
      message.success("Demande d'inscription envoyée !");
    } catch (error) {
      if (error.response) {
        if (error.response.status === 400) {
          message.error(
            error.response.data.message ||
              "Vous êtes déjà inscrit à cette formation."
          );
        } else {
          message.error(
            `Erreur: ${error.response.statusText} (${error.response.status})`
          );
        }
      } else {
        message.error("Erreur lors de l'inscription. Veuillez réessayer.");
      }
      console.error("Erreur d'inscription:", error);
    }
  };

  if (!formation) return <Typography>Chargement...</Typography>;

  return (
    <Box sx={{ marginTop: "30px", display: "flex", minHeight: "100vh" }}>
      <Sidebar role="apprenant" />
      <Container sx={{ padding: 3, backgroundColor: "#F1F1F1", width: "100%" }}>
        <Box sx={{ my: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Détails de la Formation
          </Typography>
          <Card
            sx={{ mb: 4, borderRadius: "8px", boxShadow: theme.shadows[2] }}
          >
            <CardContent>
              <Typography variant="h5" gutterBottom>
                {formation.title}
              </Typography>
              <Typography variant="body1" gutterBottom>
                Description: {formation.description}
              </Typography>
              <Typography variant="body1" gutterBottom>
                Spécialité: {formation.specialty}
              </Typography>
              <Typography variant="body1" gutterBottom>
                Durée: {formation.duree} heures
              </Typography>
              <Typography variant="body1" gutterBottom>
                Prix: {formation.prix} €
              </Typography>
              <Typography variant="body1" gutterBottom>
                Date de début:{" "}
                {new Date(formation.dateDebut).toLocaleDateString()}
              </Typography>
              <Typography variant="body1" gutterBottom>
                Date de fin: {new Date(formation.dateFin).toLocaleDateString()}
              </Typography>
              <Box sx={{ textAlign: "center", mt: 2 }}>
                <Popconfirm
                  title="Êtes-vous sûr de vouloir vous inscrire à cette formation?"
                  onConfirm={handleInscription}
                  okText="Oui"
                  cancelText="Non"
                >
                  <Button
                    variant="contained"
                    color="primary"
                    style={{
                      backgroundColor: theme.palette.primary.main,
                      color: "#FFFFFF",
                    }}
                  >
                    S'inscrire à cette formation
                  </Button>
                </Popconfirm>
              </Box>
            </CardContent>
          </Card>
          {formateur && (
            <Card sx={{ borderRadius: "8px", boxShadow: theme.shadows[2] }}>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  Détails du Formateur
                </Typography>
                <Typography variant="body1" gutterBottom>
                  Nom: {formateur.name}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  Email: {formateur.email}
                </Typography>
              </CardContent>
            </Card>
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default FormationDetails;
