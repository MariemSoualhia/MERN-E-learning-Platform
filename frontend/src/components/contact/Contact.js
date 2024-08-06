import React from "react";
import { Container, Typography } from "@mui/material";

const Contact = () => {
  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Contactez-nous
      </Typography>
      <Typography variant="body1" component="p">
        Pour toute question, veuillez nous contacter à l'adresse email suivante:
        contact@edubravo.com
      </Typography>
    </Container>
  );
};

export default Contact;
