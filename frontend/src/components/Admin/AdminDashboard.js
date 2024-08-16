import React, { useEffect, useState } from "react";
import { Container, Typography, Box, Grid, Paper } from "@mui/material";
import Sidebar from "../navbar/Sidebar";
import axios from "axios";
import { makeStyles } from "@mui/styles";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
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

const AdminDashboard = () => {
  const classes = useStyles();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalFormations: 0,
    totalEnrollments: 0,
    totalAdmins: 0,
    totalFormateurs: 0,
    totalApprenants: 0,
    formationStatusCounts: [],
    specialtyCounts: [],
    enrollmentStatusCounts: [],
    apprenantsByFormation: [],
    apprenantsByFormateur: [],
  });
  const [topFormations, setTopFormations] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:5000/api/formations/dashboard-stats",
          {
            headers: {
              "x-auth-token": token,
            },
          }
        );
        setStats(response.data);
      } catch (error) {
        console.error("Failed to fetch statistics:", error);
      }
    };

    fetchStats();
  }, []);

  useEffect(() => {
    const fetchStats2 = async () => {
      try {
        const token = localStorage.getItem("token");
        const topFormationsResponse = await axios.get(
          "http://localhost:5000/api/formations/top-formations-by-enrollment",
          {
            headers: {
              "x-auth-token": token,
            },
          }
        );
        setTopFormations(topFormationsResponse.data);
      } catch (error) {
        console.error("Failed to fetch statistics:", error);
      }
    };

    fetchStats2();
  }, []);

  const formationStatusData = stats.formationStatusCounts.map((item) => ({
    name: item.status,
    value: item.count,
  }));

  const specialtyData = stats.specialtyCounts.map((item) => ({
    name: item.specialty,
    value: item.count,
  }));

  const enrollmentStatusData = stats.enrollmentStatusCounts.map((item) => ({
    name: item.status,
    value: item.count,
  }));

  const apprenantsByFormationData = stats.apprenantsByFormation.map((item) => ({
    name: item.formationTitle,
    value: item.count,
  }));

  const apprenantsByFormateurData = stats.apprenantsByFormateur.map((item) => ({
    name: item.formateurName,
    value: item.count,
  }));

  return (
    <Box sx={{ marginTop: "50px", display: "flex", minHeight: "100vh" }}>
      <Sidebar role="admin" />
      <Container className={classes.dashboardContainer}>
        <Typography variant="h2" className={classes.title}>
          Tableau de bord Admin
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4}>
            <Paper className={classes.card}>
              <Typography variant="h6">Total des Utilisateurs</Typography>
              <Typography className={classes.statText}>
                {stats.totalUsers}
              </Typography>
            </Paper>
          </Grid>
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
              <Typography variant="h6">Total des Inscriptions</Typography>
              <Typography className={classes.statText}>
                {stats.totalEnrollments}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Paper className={classes.card}>
              <Typography variant="h6">Total des Admins</Typography>
              <Typography className={classes.statText}>
                {stats.totalAdmins}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Paper className={classes.card}>
              <Typography variant="h6">Total des Formateurs</Typography>
              <Typography className={classes.statText}>
                {stats.totalFormateurs}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Paper className={classes.card}>
              <Typography variant="h6">Total des Apprenants</Typography>
              <Typography className={classes.statText}>
                {stats.totalApprenants}
              </Typography>
            </Paper>
          </Grid>

          {/* Répartition des Formations par Statut and Spécialité on the same line */}
          <Grid item xs={12} sm={6} md={6}>
            <Paper className={classes.card}>
              <Typography variant="h6">
                Répartition des Formations par Statut
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={formationStatusData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {formationStatusData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <Paper className={classes.card}>
              <Typography variant="h6">
                Répartition des Formations par Spécialité
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={specialtyData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#82ca9d"
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {specialtyData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>

          {/* Top 5 Formations and Statut des Inscriptions on the same line */}
          <Grid item xs={12} sm={6} md={6}>
            <Paper className={classes.card}>
              <Typography variant="h6">
                Top 5 Formations par Nombre d'Inscriptions
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={topFormations.map((formation) => ({
                    name: formation.formationTitle,
                    value: formation.count,
                  }))}
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
                  <Legend />
                  <Bar dataKey="value" fill="#FF8042" />
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <Paper className={classes.card}>
              <Typography variant="h6">Statut des Inscriptions</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={enrollmentStatusData}
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
                  <Legend />
                  <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>

          {/* Nombre d'Apprenants par Formation and Nombre d'Apprenants par Formateur on the same line */}
          <Grid item xs={12} sm={6} md={6}>
            <Paper className={classes.card}>
              <Typography variant="h6">
                Nombre d'Apprenants par Formation
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={apprenantsByFormationData}
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
                  <Legend />
                  <Bar dataKey="value" fill="#00C49F" />
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <Paper className={classes.card}>
              <Typography variant="h6">
                Nombre d'Apprenants par Formateur
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={apprenantsByFormateurData}
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
                  <Legend />
                  <Bar dataKey="value" fill="#FFBB28" />
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default AdminDashboard;
