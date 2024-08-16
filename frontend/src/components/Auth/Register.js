import React, { useState } from "react";
import axios from "axios";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Link,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CssBaseline,
  Paper,
  Alert,
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

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("apprenant");
  const [specialty, setSpecialty] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await axios.post("http://localhost:5000/api/auth/register", {
        name,
        email,
        password,
        role,
        specialty,
      });
      navigate("/login");
    } catch (err) {
      if (err.response && err.response.data && err.response.data.msg) {
        setError(err.response.data.msg);
      } else {
        setError("Quelque chose s'est mal passé. Veuillez réessayer.");
      }
      console.error(err);
    }
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
          Inscription
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
          Vous avez déjà un compte ? <Link href="/login">Connectez-vous</Link>
        </Typography>
        {error && (
          <Alert
            severity="error"
            component={motion.div}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {error}
          </Alert>
        )}
        <form onSubmit={handleSubmit}>
          <TextField
            label="Nom"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            fullWidth
            margin="normal"
            component={motion.div}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          />
          <TextField
            label="Adresse email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            fullWidth
            margin="normal"
            component={motion.div}
            initial={{ opacity: 0, x: 50 }}
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
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          />
          <FormControl
            fullWidth
            margin="normal"
            component={motion.div}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <InputLabel>Rôle</InputLabel>
            <Select value={role} onChange={(e) => setRole(e.target.value)}>
              <MenuItem value="apprenant">Apprenant</MenuItem>
              <MenuItem value="formateur">Formateur</MenuItem>
            </Select>
          </FormControl>
          {role === "formateur" && (
            <FormControl
              fullWidth
              margin="normal"
              component={motion.div}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <InputLabel>Spécialité</InputLabel>
              <Select
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
              >
                <MenuItem value="réseau">Réseau</MenuItem>
                <MenuItem value="dev">Développement</MenuItem>
                <MenuItem value="gestion de projets">
                  Gestion de projets
                </MenuItem>
              </Select>
            </FormControl>
          )}
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
            Inscription
          </Button>
        </form>
      </Container>
    </BackgroundContainer>
  );
};

export default Register;
