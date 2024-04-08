// TransactionForm.js
import React, { useState } from 'react';
import { Form, Input, Button, Select, DatePicker, Row, Col } from 'antd';

const { Option } = Select;

const TransactionForm = ({ onSubmit, initialValues }) => {
  const [form] = Form.useForm();
  const [transactionType, setTransactionType] = useState('');

  const onFinish = (values) => {
    onSubmit(values);
    form.resetFields();
  };

  const issueOptions = [
    'DISPATCH TO CONSUMER',
    'DISPATCH TO SUPPLIER (ON RETURN)',
    'DISPATCH TO OTHER ORGANIZATION (ON REQUISITION)',
    'DISPATCH TO OTHER ORGANIZATION (ON RETURN)',
    'STOCK ADJUSTMENT',
  ];

  const receivingOptions = [
    'RECEIVE FROM CONSUMER',
    'RECEIVE FROM SUPPLIER',
    'RECEIVE FROM OTHER ORGANIZATION (ON REQUISITION)',
    'RECEIVE FROM OTHER ORGANIZATION (ON RETURN)',
    'STOCK ADJUSTMENT',
  ];

  const handleValuesChange = (_, allValues) => {
    setTransactionType(allValues.transactionType);
  };

  return (
    <Form
      form={form}
      onFinish={onFinish}
      initialValues={initialValues}
      layout="vertical"
      onValuesChange={handleValuesChange}
    >
      <Row gutter={16}>
        {/* Column 1 */}
        <Col span={8}>
          <Form.Item name="transactionNo" label="Transaction No.">
            <Input />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="transactionDate" label="Transaction Date">
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="issueNoteNo" label="Issue Note No.">
            <Input />
          </Form.Item>
        </Col>

      </Row>



      <Row gutter={16}>
        {/* Column 3 */}
        <Col span={8}>
          <Form.Item name="requestedBy" label="Requested By">
            <Input />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="requisitionNo" label="Requisition No.">
            <Input />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="note" label="Note">
            <Input />
          </Form.Item>
        </Col>

      </Row>

      {/* Additional Fields */}
      <Row gutter={16}>
        <Col span={8}>
          <Form.Item name="fromOrganization" label="From Organization">
            <Input />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="toOrganization" label="To Organization">
            <Input />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="transactionType" label="Transaction Type">
            <Select>
              <Option value="issue">Issue</Option>
              <Option value="receiving">Receiving</Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>

      {transactionType === 'issue' && (
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item name="issueType" label="Issue Type">
              <Select>
                {issueOptions.map((option, index) => (
                  <Option key={index} value={option}>
                    {option}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
      )}

      {transactionType === 'receiving' && (
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item name="receivingType" label="Receiving Type">
              <Select>
                {receivingOptions.map((option, index) => (
                  <Option key={index} value={option}>
                    {option}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
      )}
      <Row gutter={16}>
        {/* Column 2 */}
        <Col span={8}>
          <Form.Item name="serialNo" label="S. NO.">
            <Input />
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item name="itemCode" label="ITEM CODE">
            <Input />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="itemDescription" label="ITEM DESCRIPTION">
            <Input />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={8}>
          <Form.Item name="UOM" label="UOM">
            <Input />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="quantity" label="QUANTITY">
            <Input />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="receiveQuantity" label="RECEIVE QUANTITY">
            <Input />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={8}>
          <Form.Item name="balanceQuantity" label="BALANCE QUANTITY">
            <Input />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="lot" label="LOT">
            <Input />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="remark" label="REAMRK">
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

export default TransactionForm;
