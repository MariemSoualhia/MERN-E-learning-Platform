import React, { useEffect, useState } from "react";
import { Button, Card, Modal, message, List as AntList } from "antd";
import axios from "axios";
import { Box, Container } from "@mui/material";
import Sidebar from "../navbar/Sidebar";
import EditFormationForm from "./EditFormationForm";

const MyFormations = () => {
  const [formations, setFormations] = useState([]);
  const [visible, setVisible] = useState(false);
  const [currentFormation, setCurrentFormation] = useState(null);
  const [apprenants, setApprenants] = useState([]);
  const [apprenantsVisible, setApprenantsVisible] = useState(false);

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

  useEffect(() => {
    fetchFormations();
  }, []);

  const showEditModal = (formation) => {
    setCurrentFormation(formation);
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const handleUpdate = (updatedFormation) => {
    setFormations((prevFormations) =>
      prevFormations.map((formation) =>
        formation._id === updatedFormation._id ? updatedFormation : formation
      )
    );
    setVisible(false);
  };

  const showApprenantsModal = async (formationId) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/formations/${formationId}/apprenants`,
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
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar role="formateur" />
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
                <Button type="link" onClick={() => showEditModal(formation)}>
                  Modifier
                </Button>,
                <Button
                  type="link"
                  onClick={() => showApprenantsModal(formation._id)}
                >
                  Voir les apprenants
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

        {/* Modal pour modifier une formation */}
        <Modal
          title="Modifier la formation"
          visible={visible}
          onCancel={handleCancel}
          footer={null}
        >
          {currentFormation && (
            <EditFormationForm
              formation={currentFormation}
              onUpdate={handleUpdate}
              onClose={handleCancel}
            />
          )}
        </Modal>

        {/* Modal pour afficher la liste des apprenants */}
        <Modal
          title="Liste des apprenants inscrits"
          visible={apprenantsVisible}
          onCancel={handleApprenantsCancel}
          footer={null}
        >
          <AntList
            dataSource={apprenants}
            renderItem={(apprenant) => (
              <AntList.Item>
                <div>
                  {apprenant.name} - {apprenant.email}
                </div>
              </AntList.Item>
            )}
          />
        </Modal>
      </Container>
    </Box>
  );
};

export default MyFormations;
