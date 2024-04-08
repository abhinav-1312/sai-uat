// EmployeeForm.js
import React from 'react';
import { Form, Input, Button, Select, DatePicker, Row, Col } from 'antd';
import moment from 'moment';

const { Option } = Select;

const EmployeeForm = ({ onSubmit, initialValues }) => {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    const formattedValues = {
      ...values,
      organizationId: 0,
      departmentId:0,
      endDate: values.endDate ? moment(values.endDate).format('DD/MM/YYYY') : null,
      userId: '123457',
    };
    onSubmit(formattedValues);
    form.resetFields();
  };

  return (
    <Form form={form} onFinish={onFinish} initialValues={initialValues} layout="vertical">
      <Row gutter={16}>
        <Col span={8}>
          <Form.Item name="employeeId" label="Employee Id" rules={[{ required: true, message: 'Please enter Employee Id' }]}>
            <Input />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="firstName" label="First Name" rules={[{ required: true, message: 'Please enter First Name' }]}>
            <Input />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="lastName" label="Last Name" rules={[{ required: true, message: 'Please enter Last Name' }]}>
            <Input />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={8}>
          <Form.Item name="contactNo" label="Contact No." rules={[{ required: true, message: 'Please enter Contact No.' }]}>
            <Input />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="email" label="Email" rules={[{ required: true, message: 'Please enter Email' }]}>
            <Input />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="departmentName" label="Department" rules={[{ required: true, message: 'Please enter Department' }]}>
            <Input />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={8}>
          <Form.Item name="endDate" label="Joining Date" rules={[{ required: true, message: 'Please select Joining Date' }]}>
            <DatePicker />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="salary" label="Salary Information" rules={[{ required: true, message: 'Please enter Salary Information' }]}>
            <Input />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="status" label="Status" rules={[{ required: true, message: 'Please select Status' }]}>
            <Select>
              <Option value="Active">Active</Option>
              <Option value="Inactive">Inactive</Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={8}>
          <Form.Item name="organizationName" label="Sub-Organization " rules={[{ required: true, message: 'Please enter Sub-Organization ' }]}>
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

export default EmployeeForm;
