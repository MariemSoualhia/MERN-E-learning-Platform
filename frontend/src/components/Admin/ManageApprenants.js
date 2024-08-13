import React, { useEffect, useState } from "react";
import { Table, Button, message, Modal, Form, Input, Popconfirm } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Container, Box, Typography } from "@mui/material";
import axios from "axios";
import Sidebar from "../navbar/Sidebar";

const ManageApprenants = () => {
  const [apprenants, setApprenants] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedApprenant, setSelectedApprenant] = useState(null);
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

    try {
      await axios[method](url, values, {
        headers: {
          "x-auth-token": token,
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

          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAdd}
            style={{
              backgroundColor: "#1E3A8A",
              borderColor: "#1E3A8A",
              marginBottom: 20,
            }}
          >
            Ajouter un apprenant
          </Button>

          <Table columns={columns} dataSource={apprenants} rowKey="_id" />
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
