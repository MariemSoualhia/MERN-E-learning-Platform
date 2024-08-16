import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Button,
  Row,
  Col,
  Select,
  Typography,
  Menu,
  Divider,
  message,
  Avatar,
  Checkbox,
} from "antd";
import { Container, Box } from "@mui/material";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";
import Sidebar from "../navbar/Sidebar";

const { Title } = Typography;

const Profile = () => {
  const [accountForm] = Form.useForm();
  const [securityForm] = Form.useForm(); // Formulaire pour la section Sécurité
  const [userData, setUserData] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedMenu, setSelectedMenu] = useState("account");

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("currentuser"));
    if (data) {
      setUserData(data);
      accountForm.setFieldsValue(data);
    } else {
      message.error("User data not found in local storage.");
    }
  }, [accountForm]);

  const handleAccountFinish = async (values) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `http://localhost:5000/api/users/profile/${userData.id}`,
        values,
        {
          headers: {
            "x-auth-token": token,
          },
        }
      );
      localStorage.setItem("currentuser", JSON.stringify(response.data.user));
      setUserData(response.data.user);
      message.success("Profile updated successfully");
    } catch (error) {
      message.error(
        error.response?.data?.message || "Failed to update profile"
      );
    }
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUploadProfilePicture = async () => {
    if (!selectedFile) {
      message.error("No file selected.");
      return;
    }

    const formData = new FormData();
    formData.append("photoProfil", selectedFile);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `http://localhost:5000/api/users/profile/photo/${userData.id}`,
        formData,
        {
          headers: {
            "x-auth-token": token,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      localStorage.setItem("currentuser", JSON.stringify(response.data.user));
      setUserData(response.data.user);
      message.success("Profile photo updated successfully");
    } catch (error) {
      if (error.response) {
        message.error(
          error.response.data.message || "Failed to update profile photo"
        );
      } else if (error.request) {
        message.error("Server is not responding. Please check your backend.");
      } else {
        message.error("An error occurred while sending the request.");
      }
    }
  };

  const handleSecurityFinish = async (values) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/users/profile/change-password/${userData.id}`,
        values,
        {
          headers: {
            "x-auth-token": token,
          },
        }
      );
      message.success("Password changed successfully");
    } catch (error) {
      message.error(
        error.response?.data?.message || "Failed to change password"
      );
    }
  };

  const handleMenuClick = (e) => {
    setSelectedMenu(e.key);
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar role={userData.role} />
      <Container sx={{ flexGrow: 1, p: 3, backgroundColor: "#f4f6f8" }}>
        <Title level={2} style={{ color: "#333" }}>
          Paramètres
        </Title>
        <Row gutter={16}>
          <Col span={6}>
            <Menu
              mode="vertical"
              selectedKeys={[selectedMenu]}
              onClick={handleMenuClick}
              style={{ backgroundColor: "#f0f2f5", borderRight: "none" }}
            >
              <Menu.Item key="account" style={{ fontSize: "16px" }}>
                Compte
              </Menu.Item>
              <Menu.Item key="security" style={{ fontSize: "16px" }}>
                Sécurité
              </Menu.Item>
            </Menu>
          </Col>
          <Col span={18}>
            {selectedMenu === "account" && (
              <Form
                form={accountForm}
                layout="vertical"
                onFinish={handleAccountFinish}
                initialValues={userData}
                style={{
                  backgroundColor: "#fff",
                  padding: "24px",
                  borderRadius: "8px",
                }}
              >
                <Title level={4} style={{ color: "#333" }}>
                  Profil
                </Title>
                <Row gutter={16}>
                  <Col span={8}>
                    <Form.Item
                      name="name"
                      label="Nom"
                      rules={[
                        {
                          required: true,
                          message: "Veuillez entrer votre nom!",
                        },
                      ]}
                    >
                      <Input placeholder="Nom" />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item
                      name="phoneNumber"
                      label="Téléphone"
                      rules={[
                        {
                          required: true,
                          message: "Veuillez entrer votre numéro de téléphone!",
                        },
                      ]}
                    >
                      <Input placeholder="Téléphone" />
                    </Form.Item>
                  </Col>
                  {userData.role === "formateur" && (
                    <Col span={8}>
                      <Form.Item
                        name="specialty"
                        label="Spécialité"
                        rules={[
                          {
                            required: true,
                            message: "Veuillez sélectionner votre spécialité!",
                          },
                        ]}
                      >
                        <Select placeholder="Sélectionnez votre spécialité">
                          <Select.Option value="réseau">Réseau</Select.Option>
                          <Select.Option value="dev">
                            Développement
                          </Select.Option>
                          <Select.Option value="gestion de projets">
                            Gestion de projets
                          </Select.Option>
                        </Select>
                      </Form.Item>
                    </Col>
                  )}
                </Row>
                <Row gutter={16}>
                  <Col span={24}>
                    <Form.Item
                      name="bio"
                      label="Biographie"
                      rules={[
                        {
                          max: 500,
                          message:
                            "La biographie ne peut pas dépasser 500 caractères.",
                        },
                      ]}
                    >
                      <Input.TextArea placeholder="Parlez un peu de vous" />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item name={["address", "street"]} label="Rue">
                      <Input placeholder="Rue" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name={["address", "city"]} label="Ville">
                      <Input placeholder="Ville" />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col span={8}>
                    <Form.Item name={["address", "state"]} label="État">
                      <Input placeholder="État" />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item
                      name={["address", "zipCode"]}
                      label="Code postal"
                    >
                      <Input placeholder="Code postal" />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item name={["address", "country"]} label="Pays">
                      <Input placeholder="Pays" />
                    </Form.Item>
                  </Col>
                </Row>
                <Divider />
                <Title level={4} style={{ color: "#333" }}>
                  Liens sociaux
                </Title>
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      name={["socialLinks", "facebook"]}
                      label="Facebook"
                    >
                      <Input placeholder="Lien Facebook" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name={["socialLinks", "twitter"]}
                      label="Twitter"
                    >
                      <Input placeholder="Lien Twitter" />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      name={["socialLinks", "linkedIn"]}
                      label="LinkedIn"
                    >
                      <Input placeholder="Lien LinkedIn" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name={["socialLinks", "github"]} label="GitHub">
                      <Input placeholder="Lien GitHub" />
                    </Form.Item>
                  </Col>
                </Row>
                <Divider />

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    style={{
                      backgroundColor: "#722ed1",
                      borderColor: "#722ed1",
                    }}
                  >
                    Mettre à jour
                  </Button>
                </Form.Item>
                <div
                  style={{
                    marginTop: "20px",
                    padding: "10px",
                    border: "1px solid #e8e8e8",
                    borderRadius: "4px",
                    backgroundColor: "#fff",
                    textAlign: "center",
                  }}
                >
                  <Avatar
                    src={`http://localhost:5000/static-images/${userData.photoProfil}`}
                    size={100}
                    style={{ marginBottom: "10px" }}
                  />

                  <input
                    type="file"
                    hidden
                    onChange={handleFileChange}
                    name="photo"
                    id="upload-profile-picture"
                  />
                  <Button
                    icon={<UploadOutlined />}
                    onClick={() =>
                      document.getElementById("upload-profile-picture").click()
                    }
                  >
                    Changer la photo de profil
                  </Button>
                </div>
                {selectedFile && (
                  <Button
                    type="primary"
                    onClick={handleUploadProfilePicture}
                    style={{
                      backgroundColor: "#722ed1",
                      borderColor: "#722ed1",
                      marginTop: "10px",
                    }}
                  >
                    Upload Profile Picture
                  </Button>
                )}
              </Form>
            )}
            {selectedMenu === "security" && (
              <Form
                form={securityForm}
                layout="vertical"
                onFinish={handleSecurityFinish}
                style={{
                  backgroundColor: "#fff",
                  padding: "24px",
                  borderRadius: "8px",
                }}
              >
                <Title level={4} style={{ color: "#333" }}>
                  Changer votre mot de passe
                </Title>
                <p>Utilisez ce formulaire pour changer le mot de passe!</p>
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      name="currentPassword"
                      label="Mot de passe actuel"
                      rules={[
                        {
                          required: true,
                          message: "Veuillez entrer votre mot de passe actuel!",
                        },
                      ]}
                    >
                      <Input.Password placeholder="Mot de passe actuel" />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      name="newPassword"
                      label="Nouveau mot de passe"
                      rules={[
                        {
                          required: true,
                          message:
                            "Veuillez entrer votre nouveau mot de passe!",
                        },
                      ]}
                    >
                      <Input.Password placeholder="Nouveau mot de passe" />
                    </Form.Item>
                  </Col>
                </Row>
                <p>
                  Veuillez utiliser des caractères spéciaux et un minimum de 8
                  lettres pour une meilleure sécurité du mot de passe.
                </p>
                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    style={{
                      backgroundColor: "#722ed1",
                      borderColor: "#722ed1",
                    }}
                  >
                    Mettre à jour
                  </Button>
                </Form.Item>
              </Form>
            )}
          </Col>
        </Row>
      </Container>
    </Box>
  );
};

export default Profile;
