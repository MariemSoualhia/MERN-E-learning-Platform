import React, { useState } from "react";
import axios from "axios";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Link,
  CssBaseline,
  Paper,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { styled } from "@mui/material/styles";
import { motion } from "framer-motion";

const BackgroundContainer = styled(Box)({
  backgroundImage: `url('https://img.freepik.com/vecteurs-libre/banniere-publicitaire-technologie-vecteur-modele-education-e-learning_53876-125996.jpg?t=st=1722953018~exp=1722956618~hmac=2b40f76098b6c2e6c3a22a788d85809e5b2fca5b446c106f525d03fab3854305&w=1060')`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
});

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false); // État pour la boîte de dialogue du mot de passe oublié
  const [resetEmail, setResetEmail] = useState(""); // État pour le champ email dans la boîte de dialogue
  const [resetMessage, setResetMessage] = useState(""); // État pour le message de réinitialisation
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("hooooooooooooooooooooooooooo");
    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.msg);
        return;
      }

      const responseData = await response.json();
      const token = responseData.token;
      const user = JSON.stringify(responseData.user);
      localStorage.setItem("token", token);
      localStorage.setItem("currentuser", user);

      if (responseData && user) {
        const userRole = JSON.parse(user).role;
        switch (userRole) {
          case "admin":
            navigate("/admin");
            break;
          case "formateur":
            navigate("/formateur");
            break;
          case "apprenant":
            navigate("/apprenant");
            break;
          default:
            navigate("/");
        }
      }
    } catch (err) {
      console.error(err.message);
      setError("Quelque chose a mal tourné. Veuillez réessayer.");
    }
  };

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    setResetMessage("");

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/forgot-password",
        { email: resetEmail }
      );
      setResetMessage(response.data.message);
    } catch (err) {
      setResetMessage(
        err.response?.data?.message ||
          "Quelque chose a mal tourné. Veuillez réessayer."
      );
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setResetMessage("");
    setResetEmail("");
  };

  return (
    <BackgroundContainer>
      <CssBaseline />
      <Container
        component={motion.div}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        maxWidth="xs"
        sx={{
          padding: 4,
          boxShadow: 3,
          borderRadius: 2,
          backgroundColor: "rgba(255, 255, 255, 0.8)",
        }}
      >
        <Typography
          variant="h2"
          component={motion.h1}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          gutterBottom
          align="center"
        >
          Connexion
        </Typography>
        <Typography
          variant="body2"
          gutterBottom
          align="center"
          component={motion.div}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          Vous n'avez pas de compte ?{" "}
          <Link href="/register">Inscrivez-vous</Link>
        </Typography>
        {error && <Alert severity="error">{error}</Alert>}
        <form onSubmit={handleSubmit}>
          <TextField
            label="Adresse email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            fullWidth
            margin="normal"
            component={motion.div}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          />
          <TextField
            label="Mot de passe"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            fullWidth
            margin="normal"
            component={motion.div}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          />
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mt: 2,
            }}
          >
            <Link href="#" variant="body2" onClick={handleClickOpen}>
              Mot de passe oublié ?
            </Link>
          </Box>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 3, mb: 2 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            Connexion
          </Button>
        </form>
      </Container>

      {/* Boîte de dialogue de réinitialisation de mot de passe */}
      <Dialog
        open={open}
        onClose={handleClose}
        component={motion.div}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <DialogTitle>Mot de passe oublié</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Veuillez saisir votre adresse email. Nous vous enverrons un lien
            pour réinitialiser votre mot de passe.
          </DialogContentText>
          {resetMessage && (
            <Alert severity="info" sx={{ mt: 2 }}>
              {resetMessage}
            </Alert>
          )}
          <TextField
            autoFocus
            margin="dense"
            label="Adresse email"
            type="email"
            fullWidth
            value={resetEmail}
            onChange={(e) => setResetEmail(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Annuler
          </Button>
          <Button onClick={handleForgotPasswordSubmit} color="primary">
            Envoyer
          </Button>
        </DialogActions>
      </Dialog>
    </BackgroundContainer>
  );
};

export default Login;
