import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
} from "@mui/material";
import { Link } from "react-router-dom";

const Formations = () => {
  const [formations, setFormations] = useState([]);

  useEffect(() => {
    const fetchFormations = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/formations/active"
        );
        setFormations(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des formations:", error);
      }
    };

    fetchFormations();
  }, []);

  return (
    <Container sx={{ py: 5 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Nos Formations
      </Typography>
      <Grid container spacing={4}>
        {formations.map((formation) => (
          <Grid item key={formation._id} xs={12} sm={6} md={4}>
            <Card>
              <CardMedia
                component="img"
                height="140"
                image={`http://localhost:5000/uploads/${formation.image}`}
                alt={formation.title}
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {formation.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {formation.description}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  color="primary"
                  component={Link}
                  to={`/formations/${formation._id}`}
                >
                  Voir détails
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Formations;
