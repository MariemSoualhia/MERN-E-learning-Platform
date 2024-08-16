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
  Descriptions,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UploadOutlined,
  InfoCircleOutlined,
  ReloadOutlined, // Add Reload Icon
} from "@ant-design/icons";
import { Container, Box, Typography } from "@mui/material";
import axios from "axios";
import Sidebar from "../navbar/Sidebar";
import styled from "styled-components";
import moment from "moment";
import theme from "../../theme";
const { Option } = Select;
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

const ManageFormations = () => {
  const [formations, setFormations] = useState([]);
  const [filteredFormations, setFilteredFormations] = useState([]);
  const [formateurs, setFormateurs] = useState([]); // List of formateurs
  const [filteredFormateurs, setFilteredFormateurs] = useState([]); // List of formateurs filtered by specialty
  const [selectedFormation, setSelectedFormation] = useState(null);
  const [selectedFormateur, setSelectedFormateur] = useState(null); // State for selected formateur details
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isFormateurDetailsVisible, setIsFormateurDetailsVisible] =
    useState(false); // Modal visibility for formateur details
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
      const response = await axios.get("http://localhost:5000/api/users", {
        params: { role: "formateur" },
        headers: {
          "x-auth-token": token,
        },
      });
      setFormateurs(response.data);
    } catch (error) {
      message.error("Erreur lors de la récupération des formateurs");
      console.error(error);
    }
  };

  const fetchFormateurDetails = async (formateurId) => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(
        `http://localhost:5000/api/users/${formateurId}`,
        {
          headers: {
            "x-auth-token": token,
          },
        }
      );
      setSelectedFormateur(response.data);
      setIsFormateurDetailsVisible(true);
    } catch (error) {
      message.error("Erreur lors de la récupération des détails du formateur");
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

  const handleSpecialtyChange = (value) => {
    // Filter formateurs based on selected specialty
    const filtered = formateurs.filter(
      (formateur) => formateur.specialty === value
    );
    setFilteredFormateurs(filtered);

    // Reset the formateur field in the form if the specialty changes
    form.setFieldsValue({ formateur: null });
  };

  const handleFileChange = ({ file }) => {
    setFile(file);
  };

  const handleAdd = () => {
    setSelectedFormation(null);
    setIsEdit(false);
    setIsModalVisible(true);
    setFilteredFormateurs([]); // Clear filtered formateurs when adding a new formation
  };

  const handleEdit = (formation) => {
    setSelectedFormation(formation);
    setIsEdit(true);
    setIsModalVisible(true);
    handleSpecialtyChange(formation.specialty); // Filter formateurs based on the specialty of the selected formation
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
          "Content-Type": "multipart/form-data",
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

    // Check if file exists before appending
    if (file) {
      formData.append("image", file);
    }

    // Determine URL and method based on edit mode
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
      fetchFormations(); // Refresh formations list
      setIsModalVisible(false); // Close modal after success
    } catch (error) {
      if (error.response && error.response.status === 403) {
        message.error(
          "Vous n'avez pas les droits nécessaires pour effectuer cette action."
        );
      } else {
        message.error("Erreur lors de l'ajout/mise à jour de la formation");
      }
      console.error(error);
    }
  };

  const handleRefresh = () => {
    // Reset the filters state
    setFilters({ status: "", specialty: "" });

    // Reset the form values for the filter form
    form.resetFields();

    // Fetch the full list of formations again
    fetchFormations();
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
          <Button
            icon={<InfoCircleOutlined />}
            onClick={() => fetchFormateurDetails(record.formateur._id)}
            style={{
              backgroundColor: "#4CAF50",
              color: "#FFFFFF",
              marginLeft: 8,
            }}
          >
            Détails Formateur
          </Button>
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
                  onChange={(value) => {
                    handleSpecialtyChange(value);
                    handleFilterChange({ specialty: value });
                  }}
                  allowClear
                >
                  <Option value="dev">Dev</Option>
                  <Option value="réseau">Réseau</Option>
                  <Option value="gestion de projets">Gestion de projets</Option>
                </Select>
              </Form.Item>
            </Form>
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
                Ajouter une formation
              </Button>
            </Box>
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
          <StyledForm form={form} layout="vertical" onFinish={handleFinish}>
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
              <Select
                placeholder="Sélectionnez la spécialité"
                onChange={handleSpecialtyChange} // Filter formateurs based on selected specialty
              >
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
                {filteredFormateurs.map((formateur) => (
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
          </StyledForm>
        </Modal>

        <Modal
          title="Détails du Formateur"
          visible={isFormateurDetailsVisible}
          onCancel={() => setIsFormateurDetailsVisible(false)}
          footer={null}
          width={700} // Increase the width of the modal for better layout
        >
          {selectedFormateur ? (
            <Descriptions bordered column={2}>
              <Descriptions.Item label="Nom" span={1}>
                {selectedFormateur.name}
              </Descriptions.Item>
              <Descriptions.Item label="Email" span={1}>
                {selectedFormateur.email}
              </Descriptions.Item>
              <Descriptions.Item label="Spécialité" span={1}>
                {selectedFormateur.specialty}
              </Descriptions.Item>
              <Descriptions.Item label="Téléphone" span={1}>
                {selectedFormateur.phoneNumber || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Adresse" span={2}>
                {selectedFormateur.address
                  ? `${selectedFormateur.address.street}, ${selectedFormateur.address.city}, ${selectedFormateur.address.state}, ${selectedFormateur.address.zipCode}, ${selectedFormateur.address.country}`
                  : "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Biographie" span={2}>
                {selectedFormateur.bio || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Liens sociaux" span={2}>
                {selectedFormateur.socialLinks
                  ? Object.entries(selectedFormateur.socialLinks).map(
                      ([platform, link]) => (
                        <div key={platform}>
                          {platform}:{" "}
                          <a
                            href={link}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {link}
                          </a>
                        </div>
                      )
                    )
                  : "N/A"}
              </Descriptions.Item>
            </Descriptions>
          ) : (
            <p>Aucun détail disponible pour ce formateur.</p>
          )}
        </Modal>
      </Container>
    </Box>
  );
};

export default ManageFormations;
