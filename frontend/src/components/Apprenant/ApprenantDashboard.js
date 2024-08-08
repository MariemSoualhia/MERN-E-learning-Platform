import React from "react";
import { Container, Typography, Box } from "@mui/material";
import Sidebar from "../navbar/Sidebar";

const ApprenantDashboard = () => {
  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar role="apprenant" />
      <Container sx={{ flexGrow: 1, p: 3, backgroundColor: "#f4f6f8" }}>
        <Box sx={{ my: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Tableau de bord Apprenant
          </Typography>
          <Typography>
            Bienvenue sur votre tableau de bord, Apprenant. Consultez vos
            formations et suivez votre progression ici.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default ApprenantDashboard;
