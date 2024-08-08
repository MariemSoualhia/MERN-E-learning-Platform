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

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

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
        throw new Error(errorData.message);
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
          Sign in
        </Typography>
        <Typography variant="body2" gutterBottom>
          Don't have an account? <Link href="/register">Sign up</Link>
        </Typography>
        <form onSubmit={handleSubmit}>
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
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mt: 2,
            }}
          >
            <Link href="#" variant="body2">
              Forgot password?
            </Link>
          </Box>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 3, mb: 2 }}
          >
            Sign in
          </Button>
        </form>
      </Container>
    </BackgroundContainer>
  );
};

export default Login;
