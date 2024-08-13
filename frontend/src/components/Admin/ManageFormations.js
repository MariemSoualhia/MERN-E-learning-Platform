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
  Tag,
  DatePicker,
  InputNumber,
  Upload,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { Container, Box, Typography } from "@mui/material";
import axios from "axios";
import Sidebar from "../navbar/Sidebar";
import moment from "moment";

const { Option } = Select;
const { RangePicker } = DatePicker;

const ManageFormations = () => {
  const [formations, setFormations] = useState([]);
  const [filteredFormations, setFilteredFormations] = useState([]);
  const [formateurs, setFormateurs] = useState([]); // List of formateurs
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedFormation, setSelectedFormation] = useState(null);
  const [filters, setFilters] = useState({ status: "", specialty: "" });
  const [file, setFile] = useState(null); // State to handle the image file

  const [form] = Form.useForm();

  useEffect(() => {
    fetchFormations();
    fetchFormateurs(); // Fetch the list of formateurs
  }, []);

  const fetchFormations = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get("http://localhost:5000/api/formations", {
        headers: {
          "x-auth-token": token,
        },
      });
      setFormations(response.data);
      setFilteredFormations(response.data);
    } catch (error) {
      message.error("Erreur lors de la récupération des formations");
      console.error(error);
    }
  };

  const fetchFormateurs = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(
        "http://localhost:5000/api/users/formateurs",
        {
          headers: {
            "x-auth-token": token,
          },
        }
      );
      setFormateurs(response.data);
    } catch (error) {
      message.error("Erreur lors de la récupération des formateurs");
      console.error(error);
    }
  };

  const handleFilterChange = (changedFilters) => {
    setFilters((prevFilters) => ({ ...prevFilters, ...changedFilters }));

    const newFilteredFormations = formations.filter((formation) => {
      return (
        (!changedFilters.status ||
          formation.status === changedFilters.status) &&
        (!changedFilters.specialty ||
          formation.specialty === changedFilters.specialty)
      );
    });

    setFilteredFormations(newFilteredFormations);
  };

  const handleFileChange = ({ file }) => {
    setFile(file);
  };

  const handleAdd = () => {
    setSelectedFormation(null);
    setIsEdit(false);
    setIsModalVisible(true);
  };

  const handleEdit = (formation) => {
    setSelectedFormation(formation);
    setIsEdit(true);
    setIsModalVisible(true);
    form.setFieldsValue({
      title: formation.title,
      description: formation.description,
      specialty: formation.specialty,
      formateur: formation.formateur._id,
      status: formation.status,
      dateRange: [moment(formation.dateDebut), moment(formation.dateFin)],
      duree: formation.duree,
      prix: formation.prix,
    });
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`http://localhost:5000/api/formations/${id}`, {
        headers: {
          "x-auth-token": token,
        },
      });
      setFormations(formations.filter((formation) => formation._id !== id));
      setFilteredFormations(
        filteredFormations.filter((formation) => formation._id !== id)
      );
      message.success("Formation supprimée avec succès");
    } catch (error) {
      message.error("Erreur lors de la suppression de la formation");
      console.error(error);
    }
  };

  const handleFinish = async (values) => {
    const token = localStorage.getItem("token");
    const { dateRange, ...rest } = values;
    const [dateDebut, dateFin] = dateRange;

    const formData = new FormData();
    formData.append("title", rest.title);
    formData.append("description", rest.description);
    formData.append("dateDebut", dateDebut);
    formData.append("dateFin", dateFin);
    formData.append("duree", rest.duree);
    formData.append("prix", rest.prix);
    formData.append("specialty", rest.specialty);
    formData.append("status", rest.status);
    formData.append("formateur", rest.formateur);
    if (file) {
      formData.append("image", file);
    }

    const url = isEdit
      ? `http://localhost:5000/api/formations/${selectedFormation._id}`
      : "http://localhost:5000/api/formations/add";
    const method = isEdit ? "put" : "post";

    try {
      await axios[method](url, formData, {
        headers: {
          "x-auth-token": token,
          "Content-Type": "multipart/form-data",
        },
      });
      message.success(
        isEdit
          ? "Formation mise à jour avec succès"
          : "Formation ajoutée avec succès"
      );
      fetchFormations();
      setIsModalVisible(false);
    } catch (error) {
      message.error("Erreur lors de l'ajout/mise à jour de la formation");
      console.error(error);
    }
  };

  const columns = [
    {
      title: "Titre",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Spécialité",
      dataIndex: "specialty",
      key: "specialty",
    },
    {
      title: "Formateur",
      dataIndex: ["formateur", "name"], // Assuming formateur has a name field
      key: "formateur",
    },
    {
      title: "Statut",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "active" ? "green" : "red"}>{status}</Tag>
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
            title="Êtes-vous sûr de vouloir supprimer cette formation?"
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
            Gestion des Formations
          </Typography>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 2,
            }}
          >
            <Box>
              <Form layout="inline" form={form}>
                <Form.Item name="status" label="Filtrer par statut">
                  <Select
                    placeholder="Sélectionnez le statut"
                    onChange={(value) => handleFilterChange({ status: value })}
                    allowClear
                  >
                    <Option value="active">Active</Option>
                    <Option value="pending">Pending</Option>
                    <Option value="rejected">Rejected</Option>
                  </Select>
                </Form.Item>
                <Form.Item name="specialty" label="Filtrer par spécialité">
                  <Select
                    placeholder="Sélectionnez la spécialité"
                    onChange={(value) =>
                      handleFilterChange({ specialty: value })
                    }
                    allowClear
                  >
                    <Option value="dev">Dev</Option>
                    <Option value="réseau">Réseau</Option>
                    <Option value="gestion de projets">
                      Gestion de projets
                    </Option>
                  </Select>
                </Form.Item>
              </Form>
            </Box>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAdd}
              style={{
                backgroundColor: "#1E3A8A",
                borderColor: "#1E3A8A",
              }}
            >
              Ajouter une formation
            </Button>
          </Box>

          <Table
            columns={columns}
            dataSource={filteredFormations}
            rowKey="_id"
          />
        </Box>

        <Modal
          title={isEdit ? "Modifier la Formation" : "Ajouter une Formation"}
          visible={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={null}
        >
          <Form form={form} layout="vertical" onFinish={handleFinish}>
            <Form.Item
              name="title"
              label="Titre"
              initialValue={selectedFormation?.title}
              rules={[{ required: true, message: "Veuillez entrer le titre" }]}
            >
              <Input placeholder="Titre" />
            </Form.Item>
            <Form.Item
              name="description"
              label="Description"
              initialValue={selectedFormation?.description}
              rules={[
                { required: true, message: "Veuillez entrer la description" },
              ]}
            >
              <Input.TextArea placeholder="Description" />
            </Form.Item>
            <Form.Item
              name="specialty"
              label="Spécialité"
              initialValue={selectedFormation?.specialty}
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
            <Form.Item
              name="formateur"
              label="Formateur"
              initialValue={selectedFormation?.formateur?._id} // Assuming formateur has an _id
              rules={[
                {
                  required: true,
                  message: "Veuillez sélectionner le formateur",
                },
              ]}
            >
              <Select placeholder="Sélectionnez le formateur">
                {formateurs.map((formateur) => (
                  <Option key={formateur._id} value={formateur._id}>
                    {formateur.name} {/* Assuming formateur has a name */}
                  </Option>
                ))}
              </Select>
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
            <Form.Item
              name="status"
              label="Statut"
              initialValue={selectedFormation?.status}
              rules={[
                { required: true, message: "Veuillez sélectionner le statut" },
              ]}
            >
              <Select placeholder="Sélectionnez le statut">
                <Option value="active">Active</Option>
                <Option value="pending">Pending</Option>
                <Option value="rejected">Rejected</Option>
              </Select>
            </Form.Item>
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

export default ManageFormations;
