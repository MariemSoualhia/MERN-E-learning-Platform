import React, { useEffect, useState } from "react";
import { Table, Button, message, Popconfirm } from "antd";
import axios from "axios";
import { Box, Container, Typography } from "@mui/material";
import Sidebar from "../navbar/Sidebar";

const AdminPendingEnrollments = () => {
  const [enrollments, setEnrollments] = useState([]);

  const fetchPendingEnrollments = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/formations/enrollments/pending",
        {
          headers: { "x-auth-token": localStorage.getItem("token") },
        }
      );
      setEnrollments(res.data);
    } catch (error) {
      console.error(error);
      message.error(
        "Erreur lors de la récupération des inscriptions en attente"
      );
    }
  };

  useEffect(() => {
    fetchPendingEnrollments();
  }, []);

  const handleUpdateStatus = async (enrollmentId, status) => {
    try {
      await axios.put(
        `http://localhost:5000/api/formations/enrollment/${enrollmentId}`,
        { status },
        {
          headers: { "x-auth-token": localStorage.getItem("token") },
        }
      );
      message.success(
        `Inscription ${
          status === "acceptée" ? "acceptée" : "rejetée"
        } avec succès!`
      );
      fetchPendingEnrollments();
    } catch (error) {
      message.error("Erreur lors de la mise à jour de l'inscription");
      console.error(error);
    }
  };

  const columns = [
    {
      title: "Formation",
      dataIndex: ["formation", "title"],
      key: "formation",
    },
    {
      title: "Apprenant",
      dataIndex: ["apprenant", "name"],
      key: "apprenant",
    },
    {
      title: "Email",
      dataIndex: ["apprenant", "email"],
      key: "email",
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <>
          <Popconfirm
            title="Êtes-vous sûr de vouloir accepter cette inscription?"
            onConfirm={() => handleUpdateStatus(record._id, "acceptée")}
            okText="Oui"
            cancelText="Non"
          >
            <Button type="primary" style={{ marginRight: 8 }}>
              Accepter
            </Button>
          </Popconfirm>
          <Popconfirm
            title="Êtes-vous sûr de vouloir rejeter cette inscription?"
            onConfirm={() => handleUpdateStatus(record._id, "rejected")}
            okText="Oui"
            cancelText="Non"
          >
            <Button type="danger">Rejeter</Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <Box sx={{ marginTop: "50px", display: "flex", minHeight: "100vh" }}>
      <Sidebar role="admin" />
      <Container sx={{ flexGrow: 1, p: 3, backgroundColor: "#f4f6f8" }}>
        <Box sx={{ my: 4 }}>
          <Typography variant="h2" component="h1" gutterBottom>
            Inscriptions en Attente
          </Typography>
          <Table columns={columns} dataSource={enrollments} rowKey="_id" />
        </Box>
      </Container>
    </Box>
  );
};

export default AdminPendingEnrollments;
