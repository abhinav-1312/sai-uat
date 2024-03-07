// LocationForm.js
import React from "react";
import { Form, Input, Button, Select, DatePicker, Row, Col } from "antd";
import moment from "moment";

const { Option } = Select;

const LocationForm = ({ onSubmit, initialValues }) => {
  const [form] = Form.useForm();
  const onFinish = (values) => {
    const formattedValues = {
      ...values,
      endDate: values.endDate
        ? moment(values.endDate).format("DD/MM/YYYY")
        : null,
      userId: "123457",
    };

    onSubmit(formattedValues);
    form.resetFields();
  };

  return (
    <Form
      form={form}
      onFinish={onFinish}
      initialValues={initialValues}
      layout="vertical"
    >
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="locationName"
            label="Location Name"
            rules={[{ required: true, message: "Please enter Location Name" }]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="locationAddr"
            label="Address"
            rules={[{ required: true, message: "Please enter Address" }]}
          >
            <Input />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="city"
            label="City"
            rules={[{ required: true, message: "Please enter City" }]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="zipcode"
            label="Zip Code"
            rules={[{ required: true, message: "Please enter Zip Code" }]}
          >
            <Input />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="state"
            label="State"
            rules={[{ required: true, message: "Please enter State" }]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="pan"
            label="PAN No."
            rules={[{ required: true, message: "Please enter PAN No." }]}
          >
            <Input />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="email"
            label="Email ID"
            rules={[{ required: true, message: "Please enter Email ID" }]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="contactNo"
            label="Contact No."
            rules={[{ required: true, message: "Please enter Contact No." }]}
          >
            <Input />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="gstin"
            label="GSTIN No."
            rules={[{ required: true, message: "Please enter GSTIN No." }]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: "Please select Status" }]}
          >
            <Select>
              <Option value="A">Active</Option>
              <Option value="IA">Inactive</Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item name="endDate" label="End Date">
            <DatePicker />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="latitude" label="Latitude">
            <Input />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item name="longitude" label="Longitude">
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="locationType" label="Location Type">
            <Input />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default LocationForm;
