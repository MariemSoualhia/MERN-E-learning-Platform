import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Select,
  Typography,
  message,
  Upload,
  DatePicker,
  InputNumber,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";
import dayjs from "dayjs";

const { Title } = Typography;
const { RangePicker } = DatePicker;

const EditFormationForm = ({ formation, onClose, onUpdate }) => {
  const [form] = Form.useForm();
  const [file, setFile] = useState(null);

  useEffect(() => {
    form.resetFields();
    setFile(null); // Clear the file input when formation changes
  }, [formation]);

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
    formData.append("specialty", rest.specialty);
    if (file) {
      formData.append("image", file);
    }

    try {
      const res = await axios.put(
        `http://localhost:5000/api/formations/update/${formation._id}`,
        formData,
        {
          headers: {
            "x-auth-token": localStorage.getItem("token"),
            "Content-Type": "multipart/form-data",
          },
        }
      );
      message.success("Formation updated successfully");
      onUpdate(res.data);
    } catch (error) {
      message.error("Failed to update formation");
    }
  };

  return (
    <div>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={{
          title: formation.title,
          description: formation.description,
          dateRange: [dayjs(formation.dateDebut), dayjs(formation.dateFin)],
          duree: formation.duree,
          prix: formation.prix,
          specialty: formation.specialty,
        }}
      >
        <Form.Item
          name="title"
          label="Title"
          rules={[{ required: true, message: "Please input the title!" }]}
        >
          <Input placeholder="Title" />
        </Form.Item>
        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: true, message: "Please input the description!" }]}
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
          name="specialty"
          label="Specialty"
          rules={[{ required: true, message: "Please select the specialty!" }]}
        >
          <Select placeholder="Select Specialty">
            <Select.Option value="dev">Dev</Select.Option>
            <Select.Option value="réseau">Réseau</Select.Option>
            <Select.Option value="gestion de projets">
              Gestion de projets
            </Select.Option>
          </Select>
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
            <Button icon={<UploadOutlined />}>Téléverser une image</Button>
          </Upload>
          {file && <span>{file.name}</span>}
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Update
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default EditFormationForm;
