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
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { styled } from "@mui/material/styles";

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
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/auth/register", {
        name,
        email,
        password,
        role,
        specialty,
      });
      navigate("/login");
    } catch (err) {
      console.error(err.response.data);
    }
  };

  return (
    <BackgroundContainer>
      <CssBaseline />
      <Container
        component={Paper}
        maxWidth="xs"
        sx={{ padding: 4, boxShadow: 3, borderRadius: 2 }}
      >
        <Typography variant="h2" component="h1" gutterBottom>
          Sign up
        </Typography>
        <Typography variant="body2" gutterBottom>
          Already have an account? <Link href="/login">Sign in</Link>
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            fullWidth
            margin="normal"
          />
          <TextField
            label="Email address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            fullWidth
            margin="normal"
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            fullWidth
            margin="normal"
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Role</InputLabel>
            <Select value={role} onChange={(e) => setRole(e.target.value)}>
              <MenuItem value="apprenant">Apprenant</MenuItem>
              <MenuItem value="formateur">Formateur</MenuItem>
            </Select>
          </FormControl>
          {role === "formateur" && (
            <FormControl fullWidth margin="normal">
              <InputLabel>Specialty</InputLabel>
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
          >
            Sign up
          </Button>
        </form>
      </Container>
    </BackgroundContainer>
  );
};

export default Register;
