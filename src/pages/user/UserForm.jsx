// UserForm.js
import React, { useEffect, useState } from "react";
import { Form, Input, Button, Select, Row, Col, DatePicker } from "antd";
import moment from "moment";
import axios from "axios";
import { apiHeader } from "../../utils/Functions";

const token = localStorage.getItem("token");
const { Option } = Select;

const UserForm = ({ onSubmit, initialValues }) => {
  const [form] = Form.useForm();
  const [departments, setDepartments] = useState([]);
  const [employeeId, setEmployeeId] = useState([]);
  const token = localStorage.getItem("token")

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get(
          "https://uat-sai-app.azurewebsites.net/sai-inv-mgmt/master/getDeptMaster", apiHeader("GET", token)
        );
        const data = response.data.responseData;
        setDepartments(data);
      } catch (error) {
        console.error("Error fetching departments", error);
      }
    };
    fetchDepartments();
  }, [token]);

  useEffect(() => {
    const fetchEmployeeId = async () => {
      try {
        const response = await axios.get(
          "https://uat-sai-app.azurewebsites.net/sai-inv-mgmt/master/getEmpMaster", apiHeader("GET", token)
        );
        const data = response.data.responseData;
        setEmployeeId(data);
      } catch (error) {
        console.error("Error fetching empyloyeeID", error);
      }
    };
    fetchEmployeeId();
  }, [token]);
  const onFinish = (values) => {
    values.endDate = moment(values.endDate).format("DD/MM/YYYY");
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
            <Select>
              {employeeId &&
                employeeId.map((emp) => (
                  <Option key={emp.id} value={emp.employeeId}>
                    {emp.employeeId}
                  </Option>
                ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="userCd"
            label="User ID"
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
            label="Organization"
            rules={[
              { required: true, message: "Please enter Organization ID" },
            ]}
          >
            <Select>
              <Option value="5">SAI SONEPAT</Option>
              <Option value="6">SAI BHOPAL</Option>
              <Option value="9">SAI GANDHINAGAR</Option>
              <Option value="10">SAI BANGALORE</Option>
              <Option value="26">SAI ZIRAKPUR</Option>
              <Option value="27">SAI GUWAHATI</Option>
              <Option value="28">SAI IMPHAL</Option>
              <Option value="29">SAI KOLKATA</Option>
              <Option value="30">SAI LUCKNOW</Option>
              <Option value="31">SAI TRIVANDRUM</Option>
              <Option value="32">SAI MUMBAI</Option>
              <Option value="33">SAI PATIALA</Option>
            </Select>
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
            <Select>
              {departments &&
                departments.map((department) => (
                  <Option key={department.id} value={department.departmentName}>
                    {department.departmentName}
                  </Option>
                ))}
            </Select>
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
            label="User Role"
            rules={[{ required: true, message: "Please enter User Type" }]}
          >
            <Select>
              <Option value="99">Super Admin</Option>
              <Option value="11">Admin</Option>
              <Option value="12">Inventory Manager</Option>
              <Option value="13">Quality Manager</Option>
              <Option value="14">Item Admin</Option>
              <Option value="15">Vendor Admin</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="endDate"
            label="End Date"
            rules={[{ required: true, message: "Please select End date" }]}
          >
            <DatePicker format="DD/MM/YYYY" showTime={false} />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="createUserId"
            label="Create User Id"
            rules={[{ required: true, message: "Please enter Create User Id" }]}
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
