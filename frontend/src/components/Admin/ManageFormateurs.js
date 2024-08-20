import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  message,
  Modal,
  Form,
  Input,
  Select,
  Popconfirm,
  Upload,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UploadOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { Container, Box, Typography } from "@mui/material";
import axios from "axios";
import Sidebar from "../navbar/Sidebar";

const { Option } = Select;

const ManageFormateurs = () => {
  const [formateurs, setFormateurs] = useState([]);
  const [filteredFormateurs, setFilteredFormateurs] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedFormateur, setSelectedFormateur] = useState(null);
  const [filters, setFilters] = useState({ name: "" });
  const [file, setFile] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchFormateurs();
  }, []);

  const fetchFormateurs = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get("http://localhost:5000/api/users", {
        params: { role: "formateur" },
        headers: {
          "x-auth-token": token,
        },
      });
      setFormateurs(response.data);
      setFilteredFormateurs(response.data); // Set filtered data initially
    } catch (error) {
      message.error("Erreur lors de la récupération des formateurs");
      console.error(error);
    }
  };

  const handleFileChange = ({ file }) => {
    setFile(file);
  };

  const handleAdd = () => {
    setSelectedFormateur(null);
    setIsEdit(false);
    setIsModalVisible(true);
  };

  const handleEdit = (formateur) => {
    setSelectedFormateur(formateur);
    setIsEdit(true);
    setIsModalVisible(true);
    form.setFieldsValue({
      name: formateur.name,
      email: formateur.email,
      phoneNumber: formateur.phoneNumber,
      address: formateur.address,
      bio: formateur.bio,
      specialty: formateur.specialty,
      socialLinks: formateur.socialLinks,
    });
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`http://localhost:5000/api/users/formateurs/${id}`, {
        headers: {
          "x-auth-token": token,
        },
      });
      setFormateurs(formateurs.filter((formateur) => formateur._id !== id));
      setFilteredFormateurs(
        filteredFormateurs.filter((formateur) => formateur._id !== id)
      );
      message.success("Formateur supprimé avec succès");
    } catch (error) {
      message.error("Erreur lors de la suppression du formateur");
      console.error(error);
    }
  };

  const handleFinish = async (values) => {
    const token = localStorage.getItem("token");
    console.log(values);
    // Vérification si le token existe
    if (!token) {
      message.error("Token non trouvé. Veuillez vous reconnecter.");
      return;
    }

    // const formData = new FormData();

    // // Ajouter toutes les valeurs du formulaire dans formData
    // Object.keys(values).forEach((key) => {
    //   formData.append(key, values[key]);
    // });

    // Vérification si un fichier est sélectionné avant de l'ajouter à formData
    // if (file) {
    //   formData.append("photoProfil", file.originFileObj);
    // }

    // Déterminer l'URL et la méthode en fonction de l'état de l'édition
    let url;
    let method;
    try {
      if (isEdit && selectedFormateur && selectedFormateur._id) {
        url = `http://localhost:5000/api/users/formateurs/${selectedFormateur._id}`;
        method = "put";
        const response = await axios.put(
          `http://localhost:5000/api/users/formateurs/${selectedFormateur._id}`,
          values,
          {
            headers: {
              "x-auth-token": token,
            },
          }
        );
        console.log(response.data);
      } else {
        url = "http://localhost:5000/api/users";
        method = "post";
        const response = await axios.post(
          "http://localhost:5000/api/users",
          values,
          {
            headers: {
              "x-auth-token": token,
            },
          }
        );
      }

      // Appel API pour créer ou mettre à jour le formateur

      // Message de succès selon l'opération
      message.success(
        isEdit
          ? "Formateur mis à jour avec succès"
          : "Formateur ajouté avec succès"
      );

      // Rechargement des formateurs et fermeture du modal
      fetchFormateurs();
      setIsModalVisible(false);
    } catch (error) {
      // Gestion des erreurs lors de l'appel API
      console.error("Erreur lors de l'appel API:", error);
      message.error("Erreur lors de l'ajout/mise à jour du formateur");
    }
  };

  const handleFilterChange = (e) => {
    const { value } = e.target;
    setFilters({ name: value });

    const newFilteredFormateurs = formateurs.filter((formateur) =>
      formateur.name.toLowerCase().includes(value.toLowerCase())
    );

    setFilteredFormateurs(newFilteredFormateurs);
  };

  const handleRefresh = () => {
    setFilters({ name: "" });
    form.resetFields();
    setFilteredFormateurs(formateurs);
  };

  const columns = [
    {
      title: "Nom",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Téléphone",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
    },
    {
      title: "Adresse",
      dataIndex: ["address", "street"],
      key: "address",
      render: (text, record) =>
        record.address
          ? `${record.address.street}, ${record.address.city}, ${record.address.state}`
          : "N/A",
    },
    {
      title: "Spécialité",
      dataIndex: "specialty",
      key: "specialty",
    },
    {
      title: "Biographie",
      dataIndex: "bio",
      key: "bio",
      render: (text) => (text ? text : "N/A"),
    },
    {
      title: "Photo de Profil",
      dataIndex: "photoProfil",
      key: "photoProfil",
      render: (photoProfil) =>
        photoProfil ? (
          <img
            src={`http://localhost:5000/static-images/${photoProfil}`}
            alt="Profil"
            style={{ width: 50 }}
          />
        ) : (
          "N/A"
        ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <>
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            style={{
              backgroundColor: "#1E3A8A",
              color: "#FFFFFF",
              marginRight: 8,
            }}
          >
            Modifier
          </Button>
          <Popconfirm
            title="Êtes-vous sûr de vouloir supprimer ce formateur?"
            onConfirm={() => handleDelete(record._id)}
            okText="Oui"
            cancelText="Non"
          >
            <Button
              icon={<DeleteOutlined />}
              type="danger"
              style={{
                backgroundColor: "#FF4D4F",
                color: "#FFFFFF",
              }}
            >
              Supprimer
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <Box sx={{ margin: "20px", display: "flex", minHeight: "100vh" }}>
      <Sidebar role="admin" />
      <Container sx={{ flexGrow: 1, p: 3, backgroundColor: "#f4f6f8" }}>
        <Box sx={{ my: 4 }}>
          <Typography variant="h2" component="h1" gutterBottom>
            Gestion des Formateurs
          </Typography>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 2,
            }}
          >
            <Input
              placeholder="Rechercher par nom"
              value={filters.name}
              onChange={handleFilterChange}
              style={{ width: 300 }}
            />
            <Box>
              <Button
                icon={<ReloadOutlined />}
                onClick={handleRefresh}
                style={{
                  backgroundColor: "#1E3A8A",
                  color: "#FFFFFF",
                  marginRight: 8,
                }}
              >
                Refresh
              </Button>
              {/* <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleAdd}
                style={{
                  backgroundColor: "#1E3A8A",
                  borderColor: "#1E3A8A",
                }}
              >
                Ajouter un formateur
              </Button> */}
            </Box>
          </Box>

          <Table
            columns={columns}
            dataSource={filteredFormateurs}
            rowKey="_id"
          />
        </Box>

        <Modal
          title={isEdit ? "Modifier le Formateur" : "Ajouter un Formateur"}
          visible={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={null}
        >
          <Form form={form} layout="vertical" onFinish={handleFinish}>
            <Form.Item
              name="name"
              label="Nom"
              initialValue={selectedFormateur?.name}
              rules={[{ required: true, message: "Veuillez entrer le nom" }]}
            >
              <Input placeholder="Nom" />
            </Form.Item>
            <Form.Item
              name="email"
              label="Email"
              initialValue={selectedFormateur?.email}
              rules={[{ required: true, message: "Veuillez entrer l'email" }]}
            >
              <Input placeholder="Email" />
            </Form.Item>
            <Form.Item
              name="phoneNumber"
              label="Téléphone"
              initialValue={selectedFormateur?.phoneNumber}
              rules={[
                {
                  required: true,
                  message: "Veuillez entrer le numéro de téléphone",
                },
              ]}
            >
              <Input placeholder="Téléphone" />
            </Form.Item>
            <Form.Item
              name={["address", "street"]}
              label="Rue"
              initialValue={selectedFormateur?.address?.street}
            >
              <Input placeholder="Rue" />
            </Form.Item>
            <Form.Item
              name={["address", "city"]}
              label="Ville"
              initialValue={selectedFormateur?.address?.city}
            >
              <Input placeholder="Ville" />
            </Form.Item>
            <Form.Item
              name={["address", "state"]}
              label="État"
              initialValue={selectedFormateur?.address?.state}
            >
              <Input placeholder="État" />
            </Form.Item>
            <Form.Item
              name={["address", "zipCode"]}
              label="Code Postal"
              initialValue={selectedFormateur?.address?.zipCode}
            >
              <Input placeholder="Code Postal" />
            </Form.Item>
            <Form.Item
              name={["address", "country"]}
              label="Pays"
              initialValue={selectedFormateur?.address?.country}
            >
              <Input placeholder="Pays" />
            </Form.Item>
            <Form.Item
              name="bio"
              label="Biographie"
              initialValue={selectedFormateur?.bio}
            >
              <Input.TextArea placeholder="Biographie" />
            </Form.Item>
            <Form.Item
              name="specialty"
              label="Spécialité"
              initialValue={selectedFormateur?.specialty}
              rules={[
                {
                  required: true,
                  message: "Veuillez sélectionner la spécialité",
                },
              ]}
            >
              <Select placeholder="Sélectionnez la spécialité">
                <Option value="dev">Dev</Option>
                <Option value="réseau">Réseau</Option>
                <Option value="gestion de projets">Gestion de projets</Option>
              </Select>
            </Form.Item>
            {/* <Form.Item
              name="photoProfil"
              label="Photo de Profil"
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
            </Form.Item> */}
            <Form.Item>
              <Button type="primary" htmlType="submit">
                {isEdit ? "Mettre à jour" : "Ajouter"}
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </Container>
    </Box>
  );
};

export default ManageFormateurs;
