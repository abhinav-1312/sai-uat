// LocatorForm.js
import React from 'react';
import { Form, Input, Button, Select, Row, Col } from 'antd';

const { Option } = Select;

const LocatorForm = ({ onSubmit, initialValues }) => {
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
          <Form.Item name="locatorCd" label="Locator Code" rules={[{ required: true, message: 'Please enter Locator Code' }]}>
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="locatorDesc" label="Description" rules={[{ required: true, message: 'Please enter Description' }]}>
            <Input />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item name="location" label="Location" rules={[{ required: true, message: 'Please enter Location' }]}>
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="capacity" label="Capacity" rules={[{ required: true, message: 'Please enter Capacity' }]}>
            <Input />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item name="type" label="Type" rules={[{ required: true, message: 'Please enter Type' }]}>
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="status" label="Status" rules={[{ required: true, message: 'Please select Status' }]}>
            <Select>
              <Option value="Active">Active</Option>
              <Option value="Inactive">Inactive</Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item name="ownership" label="Owner/Responsible Party" rules={[{ required: true, message: 'Please enter Owner/Responsible Party' }]}>
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

export default LocatorForm;
