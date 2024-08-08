import React, { useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Grid,
  Paper,
} from "@mui/material";
import { styled } from "@mui/material/styles";

const ContactSection = styled(Box)({
  backgroundSize: "cover",
  backgroundPosition: "center",
  minHeight: "40vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  color: "#fff",
  textAlign: "center",
  padding: "20px",
  backgroundColor: "#1E3A8A",
});

const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic
    console.log("Form submitted:", { name, email, message });
  };

  return (
    <>
      <ContactSection>
        <Container>
          <Typography variant="h2" component="h1" gutterBottom>
            Contactez-nous
          </Typography>
          <Typography variant="h5" component="h2" gutterBottom>
            Nous sommes là pour vous aider
          </Typography>
        </Container>
      </ContactSection>

      <Container sx={{ py: 5 }}>
        <Typography variant="h4" component="h2" gutterBottom>
          Nous contacter
        </Typography>
        <Typography paragraph>
          Si vous avez des questions, des préoccupations ou des suggestions,
          n'hésitez pas à nous contacter. Nous sommes là pour vous aider et nous
          nous efforçons de répondre à toutes vos demandes dans les plus brefs
          délais.
        </Typography>

        <Paper sx={{ p: 4, mt: 5 }}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Nom"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  fullWidth
                  multiline
                  rows={4}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                >
                  Envoyer
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Container>
    </>
  );
};

export default Contact;
