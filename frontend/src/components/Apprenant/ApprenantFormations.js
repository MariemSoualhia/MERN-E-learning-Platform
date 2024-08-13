import React, { useEffect, useState } from "react";
import { Button, Card, message } from "antd";
import axios from "axios";
import { Box, Container, Typography } from "@mui/material";
import Sidebar from "../navbar/Sidebar";
import { useNavigate, useParams } from "react-router-dom";

const ApprenantFormations = () => {
  const [formations, setFormations] = useState([]);
  const navigate = useNavigate();
  const { specialty } = useParams(); // Récupère la spécialité depuis l'URL

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
  }, [specialty]); // Recharger les formations lorsque la spécialité change

  const handleViewDetails = (formationId) => {
    navigate(`/apprenant/formation/${formationId}`);
  };

  return (
    <Box sx={{ margin: "20px", display: "flex", minHeight: "100vh" }}>
      <Sidebar role="apprenant" />
      <Container
        sx={{
          padding: 0,
          margin: 0,
          backgroundColor: "#F1F1F1",
          width: "100%",
        }}
      >
        <br /> <br />
        <Typography variant="h2" component="h1" gutterBottom>
          Formations Disponibles ({specialty})
        </Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
          {formations.map((formation) => (
            <Card
              key={formation._id}
              cover={
                <img
                  alt={formation.title}
                  src={`http://localhost:5000/static-images/${formation.image}`}
                />
              }
              actions={[
                <Button
                  type="link"
                  onClick={() => handleViewDetails(formation._id)}
                >
                  Voir Détails
                </Button>,
              ]}
              style={{ width: 300 }}
            >
              <Card.Meta
                title={formation.title}
                description={`Statut: ${formation.status}`}
              />
              <p>{formation.description}</p>
              <p>
                Date de début:{" "}
                {new Date(formation.dateDebut).toLocaleDateString()}
              </p>
              <p>
                Date de fin: {new Date(formation.dateFin).toLocaleDateString()}
              </p>
              <p>Durée: {formation.duree} heures</p>
              <p>Prix: {formation.prix} €</p>
            </Card>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default ApprenantFormations;
