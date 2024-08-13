import React, { useState } from "react";
import {
  Form,
  Input,
  Button,
  DatePicker,
  InputNumber,
  message,
  Upload,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { Box, Container, Typography } from "@mui/material";
import Sidebar from "../navbar/Sidebar";
import styled from "styled-components";
import { ThemeProvider } from "@mui/material/styles";
import theme from "../../theme";
import axios from "axios";
const { RangePicker } = DatePicker;

const StyledForm = styled(Form)`
  .ant-form-item-label > label {
    color: ${theme.palette.text.primary};
  }

  .ant-input,
  .ant-input-number,
  .ant-picker {
    border-radius: ${theme.typography.button.borderRadius};
  }

  .ant-input:focus,
  .ant-input-focused,
  .ant-input-number:focus,
  .ant-input-number-focused,
  .ant-picker-focused {
    border-color: ${theme.palette.primary.main};
    box-shadow: 0 0 0 2px rgba(30, 58, 138, 0.2);
  }

  .ant-btn-primary {
    background-color: ${theme.palette.primary.main};
    border-color: ${theme.palette.primary.main};
    &:hover {
      background-color: ${theme.palette.primary.dark};
      border-color: ${theme.palette.primary.dark};
      box-shadow: ${theme.typography.button.boxShadow};
    }
  }
`;

const AddFormation = () => {
  const [form] = Form.useForm();
  const [file, setFile] = useState(null);
  const [user, setUser] = useState(() =>
    JSON.parse(localStorage.getItem("currentuser"))
  );
  const handleFileChange = ({ file }) => {
    setFile(file);
  };

  const handleFinish = async (values) => {
    const { dateRange, ...rest } = values;
    const [dateDebut, dateFin] = dateRange;

    const formData = new FormData();
    formData.append("title", rest.title);
    formData.append("description", rest.description);
    formData.append("dateDebut", dateDebut);
    formData.append("dateFin", dateFin);
    formData.append("duree", rest.duree);
    formData.append("prix", rest.prix);
    formData.append("specialty", user.specialty);
    if (file) {
      formData.append("image", file);
    }

    try {
      await axios.post("http://localhost:5000/api/formations/add", formData, {
        headers: {
          "x-auth-token": localStorage.getItem("token"),
          "Content-Type": "multipart/form-data",
        },
      });
      message.success("Formation ajoutée avec succès");
    } catch (error) {
      message.error("Échec de l'ajout de la formation");
    }
  };

  return (
    <Box sx={{ margin: "50px", display: "flex", minHeight: "100vh" }}>
      <Sidebar role="formateur" />
      <Container sx={{ flexGrow: 1, p: 3, backgroundColor: "#f4f6f8" }}>
        <Typography variant="h2" component="h1" gutterBottom>
          Ajouter une formation
        </Typography>
        <StyledForm form={form} layout="vertical" onFinish={handleFinish}>
          <Form.Item
            name="title"
            label="Titre"
            rules={[{ required: true, message: "Veuillez entrer le titre" }]}
          >
            <Input placeholder="Titre" />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            rules={[
              { required: true, message: "Veuillez entrer la description" },
            ]}
          >
            <Input.TextArea placeholder="Description" />
          </Form.Item>
          <Form.Item
            name="dateRange"
            label="Date de début et de fin"
            rules={[
              { required: true, message: "Veuillez sélectionner les dates" },
            ]}
          >
            <RangePicker />
          </Form.Item>
          <Form.Item
            name="duree"
            label="Durée (heures)"
            rules={[{ required: true, message: "Veuillez entrer la durée" }]}
          >
            <InputNumber min={1} placeholder="Durée (heures)" />
          </Form.Item>
          <Form.Item
            name="prix"
            label="Prix"
            rules={[{ required: true, message: "Veuillez entrer le prix" }]}
          >
            <InputNumber min={0} placeholder="Prix" />
          </Form.Item>
          <Form.Item
            name="image"
            label="Image"
            valuePropName="fileList"
            getValueFromEvent={handleFileChange}
          >
            <Upload
              listType="picture"
              beforeUpload={() => false}
              onChange={handleFileChange}
            >
              <Button icon={<UploadOutlined />}>Upload Image</Button>
            </Upload>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Ajouter
            </Button>
          </Form.Item>
        </StyledForm>
      </Container>
    </Box>
  );
};

export default AddFormation;
