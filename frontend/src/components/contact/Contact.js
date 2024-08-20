import React, { useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Grid,
  Paper,
  Snackbar,
  Alert,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import axios from "axios";

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
  const [open, setOpen] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !message) {
      alert("Veuillez remplir tous les champs du formulaire.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/contact/submit",
        { name, email, message }
      );

      // Clear the form
      setName("");
      setEmail("");
      setMessage("");

      // Show confirmation
      setOpen(true);
    } catch (error) {
      console.error("Erreur lors de l'envoi du message:", error);
      alert("Erreur lors de l'envoi du message.");
    }
  };

  const handleClose = () => {
    setOpen(false);
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

      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success" sx={{ width: "100%" }}>
          Votre message a été envoyé avec succès !
        </Alert>
      </Snackbar>
      <Box sx={{ bgcolor: "#1E3A8A", color: "#FFFFFF", py: 3 }}>
        <Container>
          <Typography variant="h6" component="h3" align="center">
            Rejoignez CNILearn aujourd'hui et commencez votre parcours
            d'apprentissage!
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
            <Button
              variant="contained"
              color="secondary"
              size="large"
              href="/register"
              sx={{
                "&:hover": {
                  transform: "scale(1.05)",
                  transition: "transform 0.3s ease-in-out",
                },
              }}
            >
              Inscrivez-vous maintenant
            </Button>
          </Box>
        </Container>
      </Box>

      <Box sx={{ bgcolor: "#0D1B47", color: "#FFFFFF", py: 2 }}>
        <Container>
          <Typography variant="body2" align="center">
            © 2024 CNILearn. Tous droits réservés.
          </Typography>
        </Container>
      </Box>
    </>
  );
};

export default Contact;
