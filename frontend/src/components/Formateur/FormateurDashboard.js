import React, { useEffect, useState } from "react";
import { Container, Typography, Box, Grid, Paper } from "@mui/material";
import Sidebar from "../navbar/Sidebar";
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
import axios from "axios";
import { makeStyles } from "@mui/styles";

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
  chartCard: {
    padding: "20px",
    borderRadius: "15px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
    backgroundColor: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "300px",
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

const FormateurDashboard = () => {
  const classes = useStyles();
  const [totalFormations, setTotalFormations] = useState(0);
  const [totalEnrolledStudents, setTotalEnrolledStudents] = useState(0);
  const [formationStatusCounts, setFormationStatusCounts] = useState({
    activeCount: 0,
    pendingCount: 0,
    rejectedCount: 0,
  });
  const [completedFormations, setCompletedFormations] = useState(0);
  const [mostEnrolledFormation, setMostEnrolledFormation] = useState("");
  const [todayNewEnrollments, setTodayNewEnrollments] = useState(0);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const token = localStorage.getItem("token");
        const totalFormationsRes = await axios.get(
          "http://localhost:5000/api/formations/total-formations",
          {
            headers: {
              "x-auth-token": token,
            },
          }
        );
        const totalEnrolledStudentsRes = await axios.get(
          "http://localhost:5000/api/formations/total-enrolled-students",
          {
            headers: {
              "x-auth-token": token,
            },
          }
        );
        const formationStatusCountsRes = await axios.get(
          "http://localhost:5000/api/formations/formation-status-counts",
          {
            headers: {
              "x-auth-token": token,
            },
          }
        );
        const completedFormationsRes = await axios.get(
          "http://localhost:5000/api/formations/completed-formations",
          {
            headers: {
              "x-auth-token": token,
            },
          }
        );
        const mostEnrolledFormationRes = await axios.get(
          "http://localhost:5000/api/formations/most-enrolled-formation",
          {
            headers: {
              "x-auth-token": token,
            },
          }
        );
        const todayNewEnrollmentsRes = await axios.get(
          "http://localhost:5000/api/formations/today-new-enrollments",
          {
            headers: {
              "x-auth-token": token,
            },
          }
        );

        setTotalFormations(totalFormationsRes.data.totalFormations);
        setTotalEnrolledStudents(totalEnrolledStudentsRes.data.totalEnrolled);
        setFormationStatusCounts(formationStatusCountsRes.data);
        setCompletedFormations(completedFormationsRes.data.completedFormations);
        setMostEnrolledFormation(mostEnrolledFormationRes.data.formationTitle);
        setTodayNewEnrollments(todayNewEnrollmentsRes.data.newEnrollments);
      } catch (error) {
        console.error("Failed to fetch statistics:", error);
      }
    };

    fetchStatistics();
  }, []);

  const statusData = [
    { name: "Active", value: formationStatusCounts.activeCount },
    { name: "Pending", value: formationStatusCounts.pendingCount },
    { name: "Rejected", value: formationStatusCounts.rejectedCount },
  ];

  return (
    <Box sx={{ marginTop: "50px", display: "flex", minHeight: "100vh" }}>
      <Sidebar role="formateur" />
      <Container className={classes.dashboardContainer}>
        <Typography variant="h2" className={classes.title}>
          Tableau de bord Formateur
        </Typography>
        <Grid container spacing={3}>
          {/* Stat Cards */}
          <Grid item xs={12} sm={6} md={4}>
            <Paper className={classes.card}>
              <Typography variant="h6">Total des Formations</Typography>
              <Typography className={classes.statText}>
                {totalFormations}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Paper className={classes.card}>
              <Typography variant="h6">
                Total des Apprenants Inscrits
              </Typography>
              <Typography className={classes.statText}>
                {totalEnrolledStudents}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Paper className={classes.card}>
              <Typography variant="h6">Formations Terminées</Typography>
              <Typography className={classes.statText}>
                {completedFormations}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Paper className={classes.card}>
              <Typography variant="h6">Formation la Plus Inscrite</Typography>
              <Typography className={classes.statText}>
                {mostEnrolledFormation}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Paper className={classes.card}>
              <Typography variant="h6">
                Nouvelles Inscriptions Aujourd'hui
              </Typography>
              <Typography className={classes.statText}>
                {todayNewEnrollments}
              </Typography>
            </Paper>
          </Grid>
          {/* Charts */}
          <Grid item xs={12} sm={12} md={6}>
            <Paper className={classes.chartCard}>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {statusData.map((entry, index) => (
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
          <Grid item xs={12} sm={12} md={6}>
            <Paper className={classes.chartCard}>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={[
                    { name: "Formations", count: totalFormations },
                    {
                      name: "Apprenants Inscrits",
                      count: totalEnrolledStudents,
                    },
                  ]}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default FormateurDashboard;
