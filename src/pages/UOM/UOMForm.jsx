// UOMForm.js
import React from 'react';
import { Form, Input, Button, Row, Col, DatePicker } from 'antd';
import moment from 'moment';

const UOMForm = ({ onSubmit, initialValues }) => {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    const formattedValues = {
      ...values,
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
          <Form.Item name="uomCode" label="UOM Code" rules={[{ required: true, message: 'Please enter UOM Code' }]}>
            <Input />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="uomName" label="UOM Name" rules={[{ required: true, message: 'Please enter UOM Name' }]}>
            <Input />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="uomDesc" label="UOM Description" rules={[{ required: true, message: 'Please enter UOM Description' }]}>
            <Input />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={8}>
          <Form.Item name="className" label="Class Name" rules={[{ required: true, message: 'Please enter Class Name' }]}>
            <Input />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="baseUom" label="Base UOM Name" rules={[{ required: true, message: 'Please enter Base UOM Name' }]}>
            <Input />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="endDate" label="End Date">
            <DatePicker />
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

export default UOMForm;
