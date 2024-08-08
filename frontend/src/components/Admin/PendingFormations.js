import React, { useEffect, useState } from "react";
import { Table, Button, message } from "antd";
import axios from "axios";

const PendingFormations = () => {
  const [formations, setFormations] = useState([]);

  useEffect(() => {
    const fetchFormations = async () => {
      const token = localStorage.getItem("token");

      try {
        const response = await axios.get(
          "http://localhost:5000/api/formations/pending",
          {
            headers: {
              "x-auth-token": token,
            },
          }
        );
        setFormations(response.data);
      } catch (error) {
        message.error("Erreur lors de la récupération des formations");
        console.error(error);
      }
    };

    fetchFormations();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/formations/update/${id}`,
        { status },
        {
          headers: {
            "x-auth-token": token,
          },
        }
      );
      setFormations(formations.filter((formation) => formation._id !== id));
      message.success("Formation mise à jour avec succès");
    } catch (error) {
      message.error("Erreur lors de la mise à jour de la formation");
    }
  };

  const columns = [
    {
      title: "Titre",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Spécialité",
      dataIndex: "specialty",
      key: "specialty",
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <>
          <Button
            type="primary"
            onClick={() => handleUpdateStatus(record._id, "active")}
          >
            Approuver
          </Button>
          <Button
            type="danger"
            onClick={() => handleUpdateStatus(record._id, "rejetée")}
            style={{ marginLeft: 8 }}
          >
            Rejeter
          </Button>
        </>
      ),
    },
  ];

  return <Table columns={columns} dataSource={formations} rowKey="_id" />;
};

export default PendingFormations;
