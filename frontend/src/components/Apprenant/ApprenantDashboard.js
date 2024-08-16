import React, { useEffect, useState } from "react";
import { Container, Typography, Box, Grid, Paper } from "@mui/material";
import Sidebar from "../navbar/Sidebar";
import axios from "axios";
import { makeStyles } from "@mui/styles";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const useStyles = makeStyles((theme) => ({
  dashboardContainer: {
    padding: "20px",
    backgroundColor: "#f5f7fa",
    minHeight: "100vh",
  },
  card: {
    padding: "20px",
    borderRadius: "15px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
    backgroundColor: "#ffffff",
    textAlign: "center",
  },
  title: {
    marginBottom: "20px",
    fontWeight: "bold",
    color: "#34495e",
    textAlign: "center",
  },
  statText: {
    fontSize: "36px",
    fontWeight: "600",
    color: "#2c3e50",
  },
}));

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const ApprenantDashboard = () => {
  const classes = useStyles();
  const [stats, setStats] = useState({
    totalFormations: 0,
    completedFormations: 0,
    upcomingFormations: [],
    formationsByMonth: [], // Initialize as array
    formationsByYear: [], // Initialize as array
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:5000/api/formations/dashboard-stats-apprenant",
          {
            headers: {
              "x-auth-token": token,
            },
          }
        );
        console.log("Dashboard Data: ", response.data); // Log the received data
        setStats(response.data);
      } catch (error) {
        console.error("Failed to fetch statistics:", error);
      }
    };

    fetchStats();
  }, []);

  const formatMonthData = stats.formationsByMonth.map((item) => ({
    name: `Mois ${item._id.month}`,
    value: item.count,
  }));

  const formatYearData = stats.formationsByYear.map((item) => ({
    name: `Année ${item._id.year}`,
    value: item.count,
  }));

  return (
    <Box sx={{ marginTop: "50px", display: "flex", minHeight: "100vh" }}>
      <Sidebar role="apprenant" />
      <Container className={classes.dashboardContainer}>
        <Typography variant="h2" className={classes.title}>
          Tableau de bord Apprenant
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4}>
            <Paper className={classes.card}>
              <Typography variant="h6">Total des Formations</Typography>
              <Typography className={classes.statText}>
                {stats.totalFormations}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Paper className={classes.card}>
              <Typography variant="h6">Formations Complétées</Typography>
              <Typography className={classes.statText}>
                {stats.completedFormations}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Paper className={classes.card}>
              <Typography variant="h6">Prochaines Formations</Typography>
              <Typography className={classes.statText}>
                {stats.upcomingFormations.length}
              </Typography>
              <ul>
                {stats.upcomingFormations.map((formation) => (
                  <li key={formation._id}>{formation.title}</li>
                ))}
              </ul>
            </Paper>
          </Grid>
          {/* Formations by Month */}
          <Grid item xs={12} sm={12} md={6}>
            <Paper className={classes.card}>
              <Typography variant="h6">Formations par Mois</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={formatMonthData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
          {/* Formations by Year */}
          <Grid item xs={12} sm={12} md={6}>
            <Paper className={classes.card}>
              <Typography variant="h6">Formations par Année</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={formatYearData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#FF8042" />
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default ApprenantDashboard;
