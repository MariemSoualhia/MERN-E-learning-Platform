import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  CircularProgress,
} from "@mui/material";
import axios from "axios";
import Sidebar from "../navbar/Sidebar";

const AdminContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContacts = async () => {
      const token = localStorage.getItem("token"); // Assuming admin token is stored in localStorage

      try {
        const res = await axios.get("http://localhost:5000/api/contact/all", {
          headers: { "x-auth-token": token },
        });
        setContacts(res.data);
        setLoading(false);
      } catch (error) {
        console.error("Erreur lors de la récupération des contacts:", error);
        setLoading(false);
      }
    };

    fetchContacts();
  }, []);

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
                </Paper>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default AdminContacts;
