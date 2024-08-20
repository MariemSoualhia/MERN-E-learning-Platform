import React, { useEffect, useState } from "react";
import { Button, Card, message } from "antd";
import axios from "axios";
import { Box, Container, Typography, Grid } from "@mui/material";
import Sidebar from "../navbar/Sidebar";
import { useNavigate, useParams } from "react-router-dom";
import theme from "../../theme";

const ApprenantFormations = () => {
  const [formations, setFormations] = useState([]);
  const navigate = useNavigate();
  const { specialty } = useParams();

  const fetchFormations = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/formations/active?specialty=${specialty}`
      );
      setFormations(res.data);
    } catch (error) {
      console.error(error);
      message.error("Erreur lors de la récupération des formations");
    }
  };

  useEffect(() => {
    fetchFormations();
  }, [specialty]);

  const handleViewDetails = (formationId) => {
    navigate(`/apprenant/formation/${formationId}`);
  };

  return (
    <Box sx={{ marginTop: "50px", display: "flex", minHeight: "100vh" }}>
      <Sidebar role="apprenant" />
      <Container sx={{ padding: 3, backgroundColor: "#F1F1F1", width: "100%" }}>
        <Typography variant="h2" gutterBottom>
          Formations Disponibles ({specialty})
        </Typography>
        <Grid container spacing={2}>
          {formations.map((formation) => (
            <Grid item xs={12} sm={6} md={4} key={formation._id}>
              <Card
                hoverable
                cover={
                  <img
                    alt={formation.title}
                    src={`http://localhost:5000/static-images/${formation.image}`}
                    style={{ borderRadius: "8px" }}
                  />
                }
                style={{ borderRadius: "8px", boxShadow: theme.shadows[2] }}
              >
                <Box sx={{ p: 2 }}>
                  <Typography variant="h5" sx={{ mt: 2 }}>
                    {formation.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {formation.description}
                  </Typography>
                  <Typography variant="body2">
                    Date de début:{" "}
                    {new Date(formation.dateDebut).toLocaleDateString()}
                  </Typography>
                  <Typography variant="body2">
                    Date de fin:{" "}
                    {new Date(formation.dateFin).toLocaleDateString()}
                  </Typography>
                  <Typography variant="body2">
                    Durée: {formation.duree} heures
                  </Typography>
                  <Typography variant="body2">
                    Prix: {formation.prix} DT
                  </Typography>
                </Box>
                <Box sx={{ textAlign: "center", mb: 2 }}>
                  <Button
                    type="primary"
                    onClick={() => handleViewDetails(formation._id)}
                    style={{
                      backgroundColor: theme.palette.primary.main,
                      borderColor: theme.palette.primary.main,
                      color: "#FFFFFF",
                    }}
                  >
                    Voir Détails
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default ApprenantFormations;
