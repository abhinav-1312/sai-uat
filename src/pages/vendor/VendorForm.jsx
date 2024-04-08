// VendorForm.js
import React from 'react';
import { Form, Input, Button, Select, Row, Col } from 'antd';

const { Option } = Select;

const VendorForm = ({ onSubmit, initialValues }) => {
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
        <Col span={8}>
          <Form.Item name="id" label="Vendor ID" >
            <Input disabled={true} />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="vendorName" label="Vendor Name" rules={[{ required: true, message: 'Please enter Vendor Name' }]}>
            <Input />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="contactPerson" label="Contact Person" rules={[{ required: true, message: 'Please enter Contact Person' }]}>
            <Input />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={8}>
          <Form.Item name="address" label="Address" rules={[{ required: true, message: 'Please enter Address' }]}>
            <Input />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="contactNo" label="Contact No." rules={[{ required: true, message: 'Please enter Contact No.' }]}>
            <Input />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="zipcode" label="Zip Code" rules={[{ required: true, message: 'Please enter Zip Code' }]}>
            <Input />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={8}>
          <Form.Item name="email" label="Vendor Email" rules={[{ required: true, message: 'Please enter Vendor Email' }]}>
            <Input />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="pan" label="PAN No." rules={[{ required: true, message: 'Please enter PAN No.' }]}>
            <Input />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="gstin" label="GSTIN No." rules={[{ required: true, message: 'Please enter GSTIN No.' }]}>
            <Input />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={8}>
          <Form.Item name="type" label="Type" rules={[{ required: true, message: 'Please enter Type' }]}>
            <Input />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="approval" label="Approval" rules={[{ required: true, message: 'Please enter Approval' }]}>
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

export default VendorForm;
