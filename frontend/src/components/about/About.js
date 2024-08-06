import React from "react";
import { Container, Typography } from "@mui/material";

const About = () => {
  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        À propos de nous
      </Typography>
      <Typography variant="body1" component="p">
        Nous sommes une plateforme d'e-learning dédiée à fournir des cours de
        haute qualité.
      </Typography>
    </Container>
  );
};

export default About;
