import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";

import Layout from "./components/navbar/Layout";
import Home from "./components/home/Home";
import About from "./components/about/About";
import Contact from "./components/contact/Contact";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import AdminDashboard from "./components/Admin/AdminDashboard";
import FormateurDashboard from "./components/Formateur/FormateurDashboard";
import ApprenantDashboard from "./components/Apprenant/ApprenantDashboard";
import MyFormations from "./components/Formateur/MyFormations"; // New import
import AddFormation from "./components/Formateur/AddFormation";
import theme from "./theme";
import PrivateRoute from "./components/PrivateRoute";
import PublicRoute from "./components/PublicRoute";
import Profile from "./components/Profil/Profile";

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Layout>
          <Routes>
            {/* Routes publiques */}
            <Route
              path="/"
              element={
                <PublicRoute>
                  <Home />
                </PublicRoute>
              }
            />
            <Route
              path="/about"
              element={
                <PublicRoute>
                  <About />
                </PublicRoute>
              }
            />
            <Route
              path="/contact"
              element={
                <PublicRoute>
                  <Contact />
                </PublicRoute>
              }
            />
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />
            <Route
              path="/register"
              element={
                <PublicRoute>
                  <Register />
                </PublicRoute>
              }
            />
            {/* Routes protégées */}
            <Route
              path="/admin"
              element={
                <PrivateRoute>
                  <AdminDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/formateur"
              element={
                <PrivateRoute>
                  <FormateurDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/apprenant"
              element={
                <PrivateRoute>
                  <ApprenantDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              }
            />
            <Route
              path="/formateur/my-formations"
              element={
                <PrivateRoute>
                  <MyFormations />
                </PrivateRoute>
              }
            />
            <Route
              path="/formateur/add-formation"
              element={
                <PrivateRoute>
                  <AddFormation />
                </PrivateRoute>
              }
            />
            {/* Redirection vers la page de connexion pour toutes les autres URL */}
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
};

export default App;
