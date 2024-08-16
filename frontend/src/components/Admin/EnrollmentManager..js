import React, { useEffect, useState } from "react";
import { Table, Button, message, Modal } from "antd";
import axios from "axios";
import { Container, Box, Typography } from "@mui/material";
import Sidebar from "../navbar/Sidebar";
import theme from "../../theme";

const EnrollmentManager = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDetails, setSelectedDetails] = useState(null);
  const [detailsType, setDetailsType] = useState(""); // Track type of details being viewed
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const fetchEnrollments = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:5000/api/formations/totalEnrollments",
        {
          headers: { "x-auth-token": localStorage.getItem("token") },
        }
      );
      setEnrollments(response.data);
    } catch (error) {
      message.error("Erreur lors de la récupération des inscriptions.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (details, type) => {
    setSelectedDetails(details);
    setDetailsType(type); // Set the type of details (apprenant or formation)
    setIsModalVisible(true);
  };

  const columns = [
    {
      title: "Apprenant",
      dataIndex: "apprenant",
      key: "apprenant",
      render: (apprenant) => (
        <>
          <Button
            type="link"
            onClick={() => handleViewDetails(apprenant, "apprenant")}
          >
            {apprenant.name} ({apprenant.email})
          </Button>
        </>
      ),
    },
    {
      title: "Formation",
      dataIndex: "formation",
      key: "formation",
      render: (formation) => (
        <>
          <Button
            type="link"
            onClick={() => handleViewDetails(formation, "formation")}
          >
            {formation.title}
          </Button>
        </>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <>
          <Button
            type="danger"
            onClick={() => handleDeleteEnrollment(record._id)}
          >
            Supprimer
          </Button>
        </>
      ),
    },
  ];

  const handleDeleteEnrollment = async (enrollmentId) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/formations/enrollment/${enrollmentId}`,
        {
          headers: { "x-auth-token": localStorage.getItem("token") },
        }
      );
      message.success("Inscription supprimée avec succès!");
      fetchEnrollments();
    } catch (error) {
      message.error("Erreur lors de la suppression de l'inscription.");
      console.error(error);
    }
  };

  return (
    <Box sx={{ marginTop: "50px", display: "flex", minHeight: "100vh" }}>
      <Sidebar role="admin" />
      <Container sx={{ padding: 3, backgroundColor: "#F1F1F1", width: "100%" }}>
        <Typography variant="h2" gutterBottom>
          Gestion des Inscriptions
        </Typography>
        <Table
          columns={columns}
          dataSource={enrollments}
          rowKey="_id"
          loading={loading}
          pagination={{ pageSize: 10 }}
          style={{
            borderRadius: "8px",
            boxShadow: theme.shadows[2],
          }}
        />
        <Modal
          title="Détails"
          visible={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={null}
          bodyStyle={{ padding: "20px", backgroundColor: "#fff" }}
        >
          {selectedDetails && detailsType === "apprenant" && (
            <div>
              <p>
                <strong>Nom:</strong> {selectedDetails.name}
              </p>
              <p>
                <strong>Email:</strong> {selectedDetails.email}
              </p>
            </div>
          )}
          {selectedDetails && detailsType === "formation" && (
            <div>
              <p>
                <strong>Titre de la Formation:</strong> {selectedDetails.title}
              </p>
              <p>
                <strong>Description:</strong> {selectedDetails.description}
              </p>
              <p>
                <strong>Date de Début:</strong>{" "}
                {new Date(selectedDetails.dateDebut).toLocaleDateString()}
              </p>
              <p>
                <strong>Date de Fin:</strong>{" "}
                {new Date(selectedDetails.dateFin).toLocaleDateString()}
              </p>
            </div>
          )}
        </Modal>
      </Container>
    </Box>
  );
};

export default EnrollmentManager;
