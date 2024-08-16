import React, { useState, useEffect } from "react";
import { Typography, Grid, Divider, Avatar, Box } from "@mui/material";
import axios from "axios";

const UserDetails = ({ userId }) => {
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `http://localhost:5000/api/users/${userId}`,
          {
            headers: {
              "x-auth-token": token,
            },
          }
        );
        setUserData(response.data);
      } catch (error) {
        console.error("Échec du chargement des détails de l'utilisateur.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [userId]);

  return (
    <Box
      sx={{
        backgroundColor: "background.default",
        padding: "24px",
        borderRadius: "8px",
      }}
    >
      <Typography variant="h4" gutterBottom>
        Détails de l'apprenant
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <Avatar
            alt={userData.name}
            src={userData.photoProfil}
            sx={{ width: 64, height: 64 }}
          />
          <Typography variant="body1">
            <strong>Nom :</strong> {userData.name}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Typography variant="body1">
            <strong>Email :</strong> {userData.email}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Typography variant="body1">
            <strong>Téléphone :</strong> {userData.phoneNumber || "N/A"}
          </Typography>
        </Grid>
      </Grid>

      <Divider sx={{ my: 2 }} />

      {userData.specialty && (
        <>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <Typography variant="body1">
                <strong>Spécialité :</strong> {userData.specialty || "N/A"}
              </Typography>
            </Grid>
          </Grid>

          <Divider sx={{ my: 2 }} />
        </>
      )}

      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <Typography variant="body1">
            <strong>Rue :</strong> {userData.address?.street || "N/A"}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Typography variant="body1">
            <strong>Ville :</strong> {userData.address?.city || "N/A"}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Typography variant="body1">
            <strong>État :</strong> {userData.address?.state || "N/A"}
          </Typography>
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <Typography variant="body1">
            <strong>Code postal :</strong> {userData.address?.zipCode || "N/A"}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Typography variant="body1">
            <strong>Pays :</strong> {userData.address?.country || "N/A"}
          </Typography>
        </Grid>
      </Grid>

      <Divider sx={{ my: 2 }} />

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="body1">
            <strong>Biographie :</strong> {userData.bio || "N/A"}
          </Typography>
        </Grid>
      </Grid>

      <Divider sx={{ my: 2 }} />

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Typography variant="body1">
            <strong>Facebook :</strong>{" "}
            {userData.socialLinks?.facebook || "N/A"}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="body1">
            <strong>Twitter :</strong> {userData.socialLinks?.twitter || "N/A"}
          </Typography>
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Typography variant="body1">
            <strong>LinkedIn :</strong>{" "}
            {userData.socialLinks?.linkedIn || "N/A"}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="body1">
            <strong>GitHub :</strong> {userData.socialLinks?.github || "N/A"}
          </Typography>
        </Grid>
      </Grid>

      <Divider sx={{ my: 2 }} />
    </Box>
  );
};

export default UserDetails;
