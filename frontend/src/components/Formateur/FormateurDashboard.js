import React from "react";
import { Container, Typography, Box } from "@mui/material";
import Sidebar from "../navbar/Sidebar";
import AddFormation from "./AddFormation";

const FormateurDashboard = () => {
  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar role="formateur" />
      <Container
        sx={{
          padding: 0,
          margin: 0,
          backgroundColor: "#F1F1F1",
          width: "100%",
          backgroundColor: "#f4f6f8",
        }}
      >
        <Box sx={{ my: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Tableau de bord Formateur
          </Typography>
          <Typography>
            Bienvenue sur votre tableau de bord, Formateur. Ajoutez et gérez vos
            formations ici.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default FormateurDashboard;
