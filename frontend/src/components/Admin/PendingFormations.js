import React, { useEffect, useState } from "react";
import { Table, Button, message, Modal, Descriptions, List } from "antd";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  EyeOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { Container, Typography, Box } from "@mui/material";
import HourglassBottomIcon from "@mui/icons-material/HourglassBottom";
import axios from "axios";
import io from "socket.io-client";
import Sidebar from "../navbar/Sidebar";
import theme from "../../theme"; // Ensure theme is imported

const PendingFormations = () => {
  const [formations, setFormations] = useState([]);
  const [selectedFormation, setSelectedFormation] = useState(null);
  const [selectedFormateur, setSelectedFormateur] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isFormateurDetailsVisible, setIsFormateurDetailsVisible] =
    useState(false); // Modal visibility for formateur details

  useEffect(() => {
    const fetchFormations = async () => {
      const token = localStorage.getItem("token");

      try {
        const response = await axios.get(
          "http://localhost:5000/api/formations/pending",
          {
            headers: {
              "x-auth-token": token,
            },
          }
        );
        setFormations(response.data);
      } catch (error) {
        message.error("Erreur lors de la récupération des formations");
        console.error(error);
      }
    };

    fetchFormations();

    const socket = io("http://localhost:5000");
    socket.on("newFormation", (formation) => {
      message.info("Une nouvelle formation a été ajoutée !");
      setFormations((prevFormations) => [...prevFormations, formation]);
    });

    return () => socket.disconnect();
  }, []);

  const fetchFormateurDetails = async (formateurId) => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(
        `http://localhost:5000/api/users/${formateurId}`,
        {
          headers: {
            "x-auth-token": token,
          },
        }
      );
      setSelectedFormateur(response.data);
      setIsFormateurDetailsVisible(true);
    } catch (error) {
      message.error("Erreur lors de la récupération des détails du formateur");
      console.error(error);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/formations/update-status/${id}`,
        { status },
        {
          headers: {
            "x-auth-token": token,
          },
        }
      );
      setFormations(formations.filter((formation) => formation._id !== id));
      message.success("Formation mise à jour avec succès");
    } catch (error) {
      message.error("Erreur lors de la mise à jour de la formation");
    }
  };

  const handleViewDetails = (formation) => {
    setSelectedFormation(formation);
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedFormation(null);
  };

  const columns = [
    {
      title: "Titre",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Spécialité",
      dataIndex: "specialty",
      key: "specialty",
    },
    {
      title: "Formateur",
      dataIndex: ["formateur", "name"], // Display formateur's name
      key: "formateur",
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <>
          <Button
            type="primary"
            icon={<CheckCircleOutlined />}
            onClick={() => handleUpdateStatus(record._id, "active")}
            style={{
              backgroundColor: theme.palette.primary.main,
              borderColor: theme.palette.primary.main,
            }}
          >
            Approuver
          </Button>
          <Button
            type="danger"
            icon={<CloseCircleOutlined />}
            onClick={() => handleUpdateStatus(record._id, "rejetée")}
            style={{
              color: "#d14249",
              borderColor: "#d14249",
              marginLeft: 8,
            }}
          >
            Rejeter
          </Button>
          <Button
            icon={<EyeOutlined />}
            onClick={() => handleViewDetails(record)}
            style={{
              borderColor: theme.palette.primary.main,
              color: "#1E3A8A",
              marginLeft: 8,
            }}
          >
            Détails
          </Button>
          <Button
            icon={<InfoCircleOutlined />}
            onClick={() => fetchFormateurDetails(record.formateur._id)}
            style={{
              backgroundColor: "#4CAF50",
              color: "#FFFFFF",
              marginLeft: 8,
            }}
          >
            Détails Formateur
          </Button>
        </>
      ),
    },
  ];

  return (
    <Box sx={{ margin: "20px", display: "flex", minHeight: "100vh" }}>
      <Sidebar role="admin" />
      <Container sx={{ flexGrow: 1, p: 3, backgroundColor: "#f4f6f8" }}>
        <Box sx={{ my: 4 }}>
          <Typography variant="h2" component="h1" gutterBottom>
            Formations en attente <HourglassBottomIcon />
          </Typography>
          <Table columns={columns} dataSource={formations} rowKey="_id" />
        </Box>
        {selectedFormation && (
          <Modal
            visible={isModalVisible}
            onCancel={handleModalClose}
            footer={null}
            style={{ top: 20 }}
            bodyStyle={{
              padding: "20px",
              backgroundColor: theme.palette.background.default,
            }}
            titleStyle={{
              backgroundColor: theme.palette.primary.main,
              color: "#1E3A8A",
              padding: "86px",
              textAlign: "center",
            }}
          >
            <Typography
              variant="h2"
              component="h1"
              gutterBottom
            >{`Détails de la formation: ${selectedFormation.title}`}</Typography>
            <List
              itemLayout="horizontal"
              dataSource={[
                { label: "Titre", value: selectedFormation.title },
                { label: "Description", value: selectedFormation.description },
                { label: "Spécialité", value: selectedFormation.specialty },
                {
                  label: "Date de début",
                  value: new Date(selectedFormation.dateDebut).toLocaleString(),
                },
                {
                  label: "Date de fin",
                  value: new Date(selectedFormation.dateFin).toLocaleString(),
                },
                { label: "Durée", value: `${selectedFormation.duree} heures` },
                { label: "Prix", value: `${selectedFormation.prix} €` },
              ]}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    title={<strong>{item.label}:</strong>}
                    description={item.value}
                  />
                </List.Item>
              )}
            />
            {selectedFormation.image && (
              <div style={{ textAlign: "center", marginTop: "20px" }}>
                <img
                  src={`http://localhost:5000/uploads/${selectedFormation.image}`}
                  alt={selectedFormation.title}
                  style={{
                    maxWidth: "100%",
                    height: "auto",
                    borderRadius: "8px",
                    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                  }}
                />
              </div>
            )}
          </Modal>
        )}

        {/* Modal for Formateur Details */}
        <Modal
          title="Détails du Formateur"
          visible={isFormateurDetailsVisible}
          onCancel={() => setIsFormateurDetailsVisible(false)}
          footer={null}
          width={700}
        >
          {selectedFormateur ? (
            <Descriptions bordered column={2}>
              <Descriptions.Item label="Nom" span={1}>
                {selectedFormateur.name}
              </Descriptions.Item>
              <Descriptions.Item label="Email" span={1}>
                {selectedFormateur.email}
              </Descriptions.Item>
              <Descriptions.Item label="Spécialité" span={1}>
                {selectedFormateur.specialty}
              </Descriptions.Item>
              <Descriptions.Item label="Téléphone" span={1}>
                {selectedFormateur.phoneNumber || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Adresse" span={2}>
                {selectedFormateur.address
                  ? `${selectedFormateur.address.street}, ${selectedFormateur.address.city}, ${selectedFormateur.address.state}, ${selectedFormateur.address.zipCode}, ${selectedFormateur.address.country}`
                  : "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Biographie" span={2}>
                {selectedFormateur.bio || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Liens sociaux" span={2}>
                {selectedFormateur.socialLinks
                  ? Object.entries(selectedFormateur.socialLinks).map(
                      ([platform, link]) => (
                        <div key={platform}>
                          {platform}:{" "}
                          <a
                            href={link}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {link}
                          </a>
                        </div>
                      )
                    )
                  : "N/A"}
              </Descriptions.Item>
            </Descriptions>
          ) : (
            <p>Aucun détail disponible pour ce formateur.</p>
          )}
        </Modal>
      </Container>
    </Box>
  );
};

export default PendingFormations;
