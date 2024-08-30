import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  CircularProgress,
  IconButton,
} from "@mui/material";
import { Pagination, Popconfirm, message } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import axios from "axios";
import Sidebar from "../navbar/Sidebar";

const AdminContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1); // Current page for pagination
  const [totalPages, setTotalPages] = useState(1); // Total number of pages

  useEffect(() => {
    fetchContacts(page);
  }, [page]);

  const fetchContacts = async (currentPage) => {
    const token = localStorage.getItem("token"); // Assuming admin token is stored in localStorage

    try {
      const res = await axios.get(
        `http://localhost:5000/api/contact/all?page=${currentPage}`,
        {
          headers: { "x-auth-token": token },
        }
      );
      setContacts(res.data.contacts);
      setTotalPages(res.data.totalPages); // Set total pages from the response
      setLoading(false);
    } catch (error) {
      console.error("Erreur lors de la récupération des contacts:", error);
      setLoading(false);
    }
  };

  const handleDelete = async (contactId) => {
    const token = localStorage.getItem("token");

    try {
      await axios.delete(
        `http://localhost:5000/api/contact/delete/${contactId}`,
        {
          headers: { "x-auth-token": token },
        }
      );
      setContacts((prevContacts) =>
        prevContacts.filter((contact) => contact._id !== contactId)
      );
      message.success("Message de contact supprimé avec succès.");
    } catch (error) {
      console.error(
        "Erreur lors de la suppression du message de contact:",
        error
      );
      message.error("Erreur lors de la suppression du message de contact.");
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ marginTop: "50px", display: "flex", minHeight: "100vh" }}>
      <Sidebar role="admin" />
      <Container sx={{ py: 5 }}>
        <Typography variant="h4" component="h2" gutterBottom>
          Messages de Contact
        </Typography>
        {contacts.length === 0 ? (
          <Typography variant="body1">
            Aucun message de contact trouvé.
          </Typography>
        ) : (
          <Grid container spacing={3}>
            {contacts.map((contact) => (
              <Grid item xs={12} key={contact._id}>
                <Paper sx={{ p: 3 }}>
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Box>
                      <Typography variant="h6">{contact.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {contact.email}
                      </Typography>
                      <Typography variant="body1" sx={{ mt: 2 }}>
                        {contact.message}
                      </Typography>
                      <Typography
                        variant="caption"
                        display="block"
                        sx={{ mt: 1, color: "text.secondary" }}
                      >
                        Reçu le: {new Date(contact.date).toLocaleString()}
                      </Typography>
                    </Box>
                    <Popconfirm
                      title="Êtes-vous sûr de vouloir supprimer ce message de contact?"
                      onConfirm={() => handleDelete(contact._id)}
                      okText="Oui"
                      cancelText="Non"
                    >
                      <IconButton color="error">
                        <DeleteOutlined />
                      </IconButton>
                    </Popconfirm>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        )}
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <Pagination
            current={page}
            total={totalPages * 10}
            onChange={(page) => setPage(page)}
            showSizeChanger={false}
            style={{ marginTop: 20 }}
          />
        </Box>
      </Container>
    </Box>
  );
};

export default AdminContacts;
