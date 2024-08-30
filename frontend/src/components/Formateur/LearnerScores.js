// src/components/Formateur/LearnerScores.js
import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  Card,
  Grid,
} from "@mui/material";
import axios from "axios";
import Sidebar from "../navbar/Sidebar";
import theme from "../../theme";

const LearnerScores = () => {
  const [groupedSubmissions, setGroupedSubmissions] = useState({});

  useEffect(() => {
    fetchLearnerScores();
  }, []);

  const fetchLearnerScores = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/quiz/formateur/learner-scores",
        {
          headers: { "x-auth-token": localStorage.getItem("token") },
        }
      );

      // Group submissions by formation ID
      const submissionsGroupedByFormation = res.data.quizSubmissions.reduce(
        (acc, submission) => {
          const formationId = submission.formation._id;

          if (!acc[formationId]) {
            acc[formationId] = {
              formation: submission.formation,
              submissions: [],
            };
          }
          acc[formationId].submissions.push(submission);
          return acc;
        },
        {}
      );

      setGroupedSubmissions(submissionsGroupedByFormation);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Box sx={{ marginTop: "50px", display: "flex", minHeight: "100vh" }}>
      <Sidebar role="formateur" />
      <Container sx={{ padding: 3, backgroundColor: "#F1F1F1", width: "100%" }}>
        <Typography variant="h2" gutterBottom>
          Scores des Apprenants par Formation
        </Typography>

        {Object.values(groupedSubmissions).map((group) => (
          <Card
            key={group.formation._id}
            sx={{ padding: 2, borderRadius: "8px", mb: 4 }}
          >
            <Typography variant="h5" sx={{ mt: 2 }}>
              {group.formation.title}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {group.formation.description}
            </Typography>
            <Typography variant="body2">
              Date de début:{" "}
              {new Date(group.formation.dateDebut).toLocaleDateString()}
            </Typography>
            <Typography variant="body2">
              Date de fin:{" "}
              {new Date(group.formation.dateFin).toLocaleDateString()}
            </Typography>
            <Divider sx={{ my: 2 }} />

            <Grid container spacing={2}>
              {group.submissions.map((submission) => (
                <Grid item xs={12} sm={6} md={4} key={submission._id}>
                  <Card sx={{ padding: 2, borderRadius: "8px" }}>
                    <List>
                      <ListItem>
                        <ListItemText
                          primary={`Apprenant: ${submission.user.name}`}
                          secondary={`Email: ${submission.user.email}`}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary={`Score: ${submission.score} / ${submission.totalQuestions}`}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary={`Date de soumission: ${new Date(
                            submission.submittedAt
                          ).toLocaleDateString()}`}
                        />
                      </ListItem>
                    </List>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Card>
        ))}
      </Container>
    </Box>
  );
};

export default LearnerScores;
