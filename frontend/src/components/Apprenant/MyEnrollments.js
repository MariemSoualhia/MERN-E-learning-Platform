import React, { useEffect, useState } from "react";
import { Card, Button, Modal, message } from "antd";
import axios from "axios";
import { Box, Container } from "@mui/material";
import Sidebar from "../navbar/Sidebar";

const MyEnrollments = () => {
  const [formations, setFormations] = useState([]);
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
      setFormations(res.data);
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
      fetchFormations(); // Rafraîchir la liste des formations après annulation
    } catch (error) {
      console.error(error);
      message.error("Erreur lors de l'annulation de l'inscription.");
    }
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar role="apprenant" />
      <Container
        sx={{
          padding: 0,
          margin: 0,
          backgroundColor: "#F1F1F1",
          width: "100%",
        }}
      >
        <h2>Mes Formations</h2>
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
                <Button type="link" onClick={() => showDetails(formation)}>
                  Détails
                </Button>,
                <Button
                  type="link"
                  danger
                  onClick={() => handleCancelEnrollment(formation._id)}
                >
                  Annuler Inscription
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
        <Modal
          title="Détails de la Formation"
          visible={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={null}
        >
          {currentFormation && (
            <div>
              <h3>{currentFormation.title}</h3>
              <p>{currentFormation.description}</p>
              <p>
                Date de début:{" "}
                {new Date(currentFormation.dateDebut).toLocaleDateString()}
              </p>
              <p>
                Date de fin:{" "}
                {new Date(currentFormation.dateFin).toLocaleDateString()}
              </p>
              <p>Durée: {currentFormation.duree} heures</p>
              <p>Prix: {currentFormation.prix} €</p>
              <p>Formateur: {currentFormation.formateur.name}</p>
            </div>
          )}
        </Modal>
      </Container>
    </Box>
  );
};

export default MyEnrollments;
