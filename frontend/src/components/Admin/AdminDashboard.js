import React from "react";
import { Container, Typography, Box } from "@mui/material";
import Sidebar from "../navbar/Sidebar";
import PendingFormations from "./PendingFormations";

const AdminDashboard = () => {
  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar role="admin" />
      <Container sx={{ flexGrow: 1, p: 3, backgroundColor: "#f4f6f8" }}>
        <Box sx={{ my: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Tableau de bord Admin
          </Typography>
          <Typography>
            Bienvenue sur votre tableau de bord, Admin. Gérez les utilisateurs,
            les cours, et les inscriptions ici.
          </Typography>
          <PendingFormations />
        </Box>
      </Container>
    </Box>
  );
};

export default AdminDashboard;
