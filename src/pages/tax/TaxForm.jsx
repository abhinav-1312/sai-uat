// TaxForm.js
import React from 'react';
import { Form, Input, Button, Select, DatePicker, Row, Col } from 'antd';

const { Option } = Select;

const TaxForm = ({ onSubmit, initialValues }) => {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    onSubmit(values);
    form.resetFields();
  };

  return (
    <Form form={form} onFinish={onFinish} initialValues={initialValues} layout="vertical">
      <Row gutter={16}>
        <Col span={8}>
          <Form.Item name="taxName" label="Tax Name" rules={[{ required: true, message: 'Please enter Tax Name' }]}>
            <Input />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="taxRate" label="Tax Rate" rules={[{ required: true, message: 'Please enter Tax Rate' }]}>
            <Input />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="taxType" label="Tax Type" rules={[{ required: true, message: 'Please enter Tax Type' }]}>
            <Input />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item name="taxDescription" label="Tax Description" rules={[{ required: true, message: 'Please enter Tax Description' }]}>
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="effectiveDate" label="Effective Date" rules={[{ required: true, message: 'Please select Effective Date' }]}>
            <DatePicker />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
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

export default TaxForm;
