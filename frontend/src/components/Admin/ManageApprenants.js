import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  message,
  Modal,
  Form,
  Input,
  Popconfirm,
  Upload,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ReloadOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { Container, Box, Typography } from "@mui/material";
import axios from "axios";
import Sidebar from "../navbar/Sidebar";

const ManageApprenants = () => {
  const [apprenants, setApprenants] = useState([]);
  const [filteredApprenants, setFilteredApprenants] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedApprenant, setSelectedApprenant] = useState(null);
  const [filters, setFilters] = useState({ name: "" });
  const [form] = Form.useForm();

  useEffect(() => {
    fetchApprenants();
  }, []);

  const fetchApprenants = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get("http://localhost:5000/api/users", {
        params: { role: "apprenant" },
        headers: {
          "x-auth-token": token,
        },
      });
      setApprenants(response.data);
      console.log(response.data);
      setFilteredApprenants(response.data); // Initially set the filtered data to be the same
    } catch (error) {
      message.error("Erreur lors de la récupération des apprenants");
      console.error(error);
    }
  };

  const handleAdd = () => {
    setSelectedApprenant(null);
    setIsEdit(false);
    setIsModalVisible(true);
  };

  const handleEdit = (apprenant) => {
    setSelectedApprenant(apprenant);
    setIsEdit(true);
    setIsModalVisible(true);
    form.setFieldsValue({
      name: apprenant.name,
      email: apprenant.email,
      phoneNumber: apprenant.phoneNumber,
      address: apprenant.address,
      bio: apprenant.bio,
      socialLinks: apprenant.socialLinks,
      photoProfil: apprenant.photoProfil,
    });
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`http://localhost:5000/api/users/${id}`, {
        headers: {
          "x-auth-token": token,
        },
      });
      setApprenants(apprenants.filter((apprenant) => apprenant._id !== id));
      setFilteredApprenants(
        filteredApprenants.filter((apprenant) => apprenant._id !== id)
      );
      message.success("Apprenant supprimé avec succès");
    } catch (error) {
      message.error("Erreur lors de la suppression de l'apprenant");
      console.error(error);
    }
  };

  const handleFinish = async (values) => {
    const token = localStorage.getItem("token");
    const url = isEdit
      ? `http://localhost:5000/api/users/apprenants/${selectedApprenant._id}`
      : "http://localhost:5000/api/users";
    const method = isEdit ? "put" : "post";

    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("email", values.email);
    formData.append("phoneNumber", values.phoneNumber);
    formData.append("address", JSON.stringify(values.address)); // Store as JSON
    formData.append("bio", values.bio);
    formData.append("socialLinks", JSON.stringify(values.socialLinks)); // Store as JSON

    if (values.photoProfil && values.photoProfil.file) {
      formData.append("photoProfil", values.photoProfil.file.originFileObj);
    }

    if (!isEdit) {
      formData.append("password", values.password);
    }

    try {
      await axios[method](url, formData, {
        headers: {
          "x-auth-token": token,
          "Content-Type": "multipart/form-data",
        },
      });
      message.success(
        isEdit
          ? "Apprenant mis à jour avec succès"
          : "Apprenant ajouté avec succès"
      );
      fetchApprenants();
      setIsModalVisible(false);
    } catch (error) {
      message.error("Erreur lors de l'ajout/mise à jour de l'apprenant");
      console.error(error);
    }
  };

  const handleFilterChange = (e) => {
    const { value } = e.target;
    setFilters({ name: value });

    const newFilteredApprenants = apprenants.filter((apprenant) =>
      apprenant.name.toLowerCase().includes(value.toLowerCase())
    );

    setFilteredApprenants(newFilteredApprenants);
  };

  const handleRefresh = () => {
    // Reset filters and form
    setFilters({ name: "" });
    form.resetFields();
    setFilteredApprenants(apprenants);
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
      dataIndex: "address",
      key: "address",
      render: (address) =>
        address
          ? `${address.street}, ${address.city}, ${address.state}, ${address.zipCode}, ${address.country}`
          : "N/A",
    },
    {
      title: "Biographie",
      dataIndex: "bio",
      key: "bio",
      render: (bio) => (bio ? bio : "N/A"),
    },
    {
      title: "Photo de Profil",
      dataIndex: "photoProfil",
      key: "photoProfil",
      render: (photoProfil) => (
        <img
          src={`http://localhost:5000/static-images/${photoProfil}`}
          alt="Profil"
          style={{ width: 50, height: 50 }}
        />
      ),
    },
    {
      title: "Dernière connexion",
      dataIndex: "lastLogin",
      key: "lastLogin",
      render: (lastLogin) =>
        lastLogin ? new Date(lastLogin).toLocaleString() : "N/A",
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
            title="Êtes-vous sûr de vouloir supprimer cet apprenant?"
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
            Gestion des Apprenants
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
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleAdd}
                style={{
                  backgroundColor: "#1E3A8A",
                  borderColor: "#1E3A8A",
                }}
              >
                Ajouter un apprenant
              </Button>
            </Box>
          </Box>

          <Table
            columns={columns}
            dataSource={filteredApprenants}
            rowKey="_id"
          />
        </Box>

        <Modal
          title={isEdit ? "Modifier l'Apprenant" : "Ajouter un Apprenant"}
          visible={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={null}
        >
          <Form form={form} layout="vertical" onFinish={handleFinish}>
            <Form.Item
              name="name"
              label="Nom"
              initialValue={selectedApprenant?.name}
              rules={[{ required: true, message: "Veuillez entrer le nom" }]}
            >
              <Input placeholder="Nom" />
            </Form.Item>
            <Form.Item
              name="email"
              label="Email"
              initialValue={selectedApprenant?.email}
              rules={[{ required: true, message: "Veuillez entrer l'email" }]}
            >
              <Input placeholder="Email" />
            </Form.Item>
            <Form.Item
              name="phoneNumber"
              label="Téléphone"
              initialValue={selectedApprenant?.phoneNumber}
            >
              <Input placeholder="Téléphone" />
            </Form.Item>
            <Form.Item
              name={["address", "street"]}
              label="Rue"
              initialValue={selectedApprenant?.address?.street}
            >
              <Input placeholder="Rue" />
            </Form.Item>
            <Form.Item
              name={["address", "city"]}
              label="Ville"
              initialValue={selectedApprenant?.address?.city}
            >
              <Input placeholder="Ville" />
            </Form.Item>
            <Form.Item
              name={["address", "state"]}
              label="État"
              initialValue={selectedApprenant?.address?.state}
            >
              <Input placeholder="État" />
            </Form.Item>
            <Form.Item
              name={["address", "zipCode"]}
              label="Code Postal"
              initialValue={selectedApprenant?.address?.zipCode}
            >
              <Input placeholder="Code Postal" />
            </Form.Item>
            <Form.Item
              name={["address", "country"]}
              label="Pays"
              initialValue={selectedApprenant?.address?.country}
            >
              <Input placeholder="Pays" />
            </Form.Item>
            <Form.Item
              name="bio"
              label="Biographie"
              initialValue={selectedApprenant?.bio}
            >
              <Input.TextArea placeholder="Biographie" />
            </Form.Item>
            <Form.Item
              name="socialLinks"
              label="Liens sociaux"
              initialValue={selectedApprenant?.socialLinks}
            >
              <Input.TextArea placeholder="Liens sociaux (e.g., Facebook, LinkedIn)" />
            </Form.Item>
            <Form.Item name="photoProfil" label="Photo de Profil">
              <Upload
                listType="picture"
                beforeUpload={() => false} // Prevent automatic upload
              >
                <Button icon={<UploadOutlined />}>Télécharger une image</Button>
              </Upload>
            </Form.Item>
            {!isEdit && (
              <Form.Item
                name="password"
                label="Mot de passe"
                rules={[
                  {
                    required: true,
                    message: "Veuillez entrer le mot de passe",
                  },
                ]}
              >
                <Input.Password placeholder="Mot de passe" />
              </Form.Item>
            )}
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

export default ManageApprenants;
