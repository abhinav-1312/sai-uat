// UserForm.js
import React from "react";
import { Form, Input, Button, Select, Row, Col } from "antd";

const { Option } = Select;

const UserForm = ({ onSubmit, initialValues }) => {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    onSubmit(values);
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
        <Col span={8}>
          <Form.Item
            name="employeeId"
            label="EMPLOYEE ID"
            rules={[{ required: true, message: "Please enter EMPLOYEE ID" }]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="userCd"
            label="User Code"
            rules={[{ required: true, message: "Please enter User ID" }]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="firstName"
            label="User First Name"
            rules={[
              { required: true, message: "Please enter User First Name" },
            ]}
          >
            <Input />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={8}>
          <Form.Item
            name="lastName"
            label="User Last Name"
            rules={[{ required: true, message: "Please enter User Last Name" }]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="organizationId"
            label="Organization ID"
            rules={[
              { required: true, message: "Please enter Organization ID" },
            ]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: "Please enter Password" }]}
          >
            <Input.Password />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={8}>
          <Form.Item
            name="department"
            label="Department"
            rules={[{ required: true, message: "Please enter Department" }]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="email"
            label="Email ID"
            rules={[{ required: true, message: "Please enter Email ID" }]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={8}>
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
        <Col span={8}>
          <Form.Item
            name="userType"
            label="User Type"
            rules={[{ required: true, message: "Please enter User Type" }]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="userStatus"
            label="User Status"
            rules={[{ required: true, message: "Please enter User Status" }]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="privileges"
            label="Privileges"
            rules={[{ required: true, message: "Please enter Privileges" }]}
          >
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

export default UserForm;
