// CurrencyForm.js
import React from 'react';
import { Form, Input, Button, Select, Row, Col } from 'antd';

const { Option } = Select;

const CurrencyForm = ({ onSubmit, initialValues }) => {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    onSubmit(values);
    form.resetFields();
  };

  return (
    <Form form={form} onFinish={onFinish} initialValues={initialValues} layout="vertical">
      <Row gutter={16}>
        <Col span={8}>
          <Form.Item name="currencyCode" label="Currency Code" rules={[{ required: true, message: 'Please enter Currency Code' }]}>
            <Input />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="currencyName" label="Currency Name" rules={[{ required: true, message: 'Please enter Currency Name' }]}>
            <Input />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="symbol" label="Symbol" rules={[{ required: true, message: 'Please enter Symbol' }]}>
            <Input />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={8}>
          <Form.Item name="country" label="Country" rules={[{ required: true, message: 'Please enter Country' }]}>
            <Input />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="exchangeRate" label="Exchange Rate" rules={[{ type: 'number', min: 0, message: 'Please enter a valid Exchange Rate' }]}>
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

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default CurrencyForm;
