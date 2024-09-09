import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Typography,
  Box,
  MenuItem,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { UploadOutlined } from "@mui/icons-material";
import axios from "axios";
import dayjs from "dayjs";
import { LocalizationProvider, DateRangePicker } from "@mui/x-date-pickers-pro";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { message } from "antd";

const EditFormationForm = ({ formation, onClose, onUpdate }) => {
  const [title, setTitle] = useState(formation.title || "");
  const [description, setDescription] = useState(formation.description || "");
  const [dateRange, setDateRange] = useState([
    dayjs(formation.dateDebut),
    dayjs(formation.dateFin),
  ]);
  const [duree, setDuree] = useState(formation.duree || "");
  const [specialty, setSpecialty] = useState(formation.specialty || "");
  const [meetLink, setMeetLink] = useState(formation.meetLink || "");
  const [niveau, setNiveau] = useState(formation.niveau || ""); // Ajout du niveau
  const [file, setFile] = useState(null);
  const user = JSON.parse(localStorage.getItem("currentuser"));

  useEffect(() => {
    setFile(null); // Clear the file input when formation changes
  }, [formation]);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = async () => {
    const [dateDebut, dateFin] = dateRange;

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("dateDebut", dateDebut);
    formData.append("dateFin", dateFin);
    formData.append("duree", duree);
    formData.append("specialty", user.specialty);
    formData.append("niveau", niveau);
    formData.append("meetLink", meetLink);
    if (file) {
      formData.append("image", file);
    }

    try {
      const res = await axios.put(
        `http://localhost:5000/api/formations/${formation._id}`,
        formData,
        {
          headers: {
            "x-auth-token": localStorage.getItem("token"),
            "Content-Type": "multipart/form-data",
          },
        }
      );
      message.success("Formation mise à jour avec succès");
      onUpdate(res.data);
    } catch (error) {
      message.error("Échec de la mise à jour de la formation");
    }
  };

  return (
    <Box sx={{ mt: 2, maxHeight: "70vh", overflowY: "auto" }}>
      <Typography variant="h4" gutterBottom>
        Modifier la formation
      </Typography>
      <Box component="form" noValidate autoComplete="off" sx={{ mt: 3 }}>
        <TextField
          fullWidth
          label="Titre"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          margin="normal"
          multiline
          rows={4}
          required
        />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateRangePicker
            startText="Date de début"
            endText="Date de fin"
            value={dateRange}
            onChange={(newValue) => setDateRange(newValue)}
            renderInput={(startProps, endProps) => (
              <>
                <TextField {...startProps} fullWidth margin="normal" required />
                <Box sx={{ mx: 2 }}> à </Box>
                <TextField {...endProps} fullWidth margin="normal" required />
              </>
            )}
          />
        </LocalizationProvider>
        <TextField
          fullWidth
          label="Durée (heures)"
          value={duree}
          onChange={(e) => setDuree(e.target.value)}
          margin="normal"
          type="number"
          required
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">heures</InputAdornment>
            ),
          }}
        />

        <TextField
          fullWidth
          select
          label="Niveau"
          value={niveau}
          onChange={(e) => setNiveau(e.target.value)}
          margin="normal"
          required
        >
          <MenuItem value="débutant">Débutant</MenuItem>
          <MenuItem value="intermédiaire">Intermédiaire</MenuItem>
          <MenuItem value="avancé">Avancé</MenuItem>
        </TextField>
        <TextField
          fullWidth
          label="Lien Google Meet"
          value={meetLink}
          onChange={(e) => setMeetLink(e.target.value)}
          margin="normal"
          type="url"
          placeholder="https://meet.google.com/..."
        />
        <Button
          variant="outlined"
          component="label"
          startIcon={<UploadOutlined />}
          sx={{ mt: 2 }}
        >
          Téléverser une image
          <input type="file" hidden onChange={handleFileChange} />
        </Button>
        {file && (
          <Typography variant="body2" sx={{ mt: 1 }}>
            {file.name}
          </Typography>
        )}
        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 3 }}
          onClick={handleSubmit}
        >
          Mettre à jour
        </Button>
      </Box>
    </Box>
  );
};

export default EditFormationForm;
