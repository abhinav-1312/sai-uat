// UserForm.js
import React from 'react';
import { Form, Input, Button, Row, Col } from 'antd';


const DepartmentForm = ({ onSubmit, initialValues }) => {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    const formattedValues = {
      ...values,
      userId: '123457',
    };
    onSubmit(formattedValues);
    form.resetFields();
  };

  return (
    <Form form={form} onFinish={onFinish} initialValues={initialValues} layout="vertical">
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item name="id" label="Department ID" rules={[{ required: true, message: 'Please enter Department ID' }]}>
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="departmentName" label="Department Name" rules={[{ required: true, message: 'Please enter Department Name' }]}>
            <Input />
          </Form.Item>
        </Col>

      </Row>


      <Row gutter={16}>
        <Col span={12}>
          <Form.Item name="location" label="Location" rules={[{ required: true, message: 'Please enter  Location' }]}>
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="status" label="Status" rules={[{ required: true, message: 'Please enter Status' }]}>
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

export default DepartmentForm;
