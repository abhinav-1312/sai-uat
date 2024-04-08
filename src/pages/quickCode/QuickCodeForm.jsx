// QuickCodeForm.js
import React, { useState } from 'react';
import { Form, Input, Select, Button, Space, List, Row, Col, Tooltip } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons'; // Import the MinusCircleOutlined and PlusOutlined icons

const { Option } = Select;

const QuickCodeForm = () => {
  const [configDtoList, setConfigDtoList] = useState([
    { configCode: '', configDesc: '', configId: 0, configStatus: true }
  ]);
  const [configType, setConfigType] = useState('Transaction Type');

  const handleConfigTypeChange = (value) => {
    setConfigType(value);
  };

  const handleAddRow = () => {
    setConfigDtoList([
      ...configDtoList,
      { configCode: '', configDesc: '', configId: 0, configStatus: true }
    ]);
  };

  const handleRemoveRow = (index) => {
    const updatedList = [...configDtoList];
    updatedList.splice(index, 1);
    setConfigDtoList(updatedList);
  };

  const handleInputChange = (index, field, value) => {
    const updatedList = [...configDtoList];
    updatedList[index][field] = value;
    setConfigDtoList(updatedList);
  };

  const handleSubmit = () => {
    // Perform your submission logic here
    console.log({ configDtoList, configType });
  };

  return (
    <Form onFinish={handleSubmit} layout="vertical">
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            label="Config Type"
            name="configType"
            rules={[{ required: true, message: 'Please select a Config Type' }]}
          >
            <Select value={configType} onChange={handleConfigTypeChange}>
              <Option value="Transaction Type">Transaction Type</Option>
              {/* Add other configType options as needed */}
            </Select>
          </Form.Item>
        </Col>
        <Col span={12} style={{ textAlign: 'right' }}>
          <Form.Item>
            <Tooltip title="Add Row">
              <Button type="primary" onClick={handleAddRow} icon={<PlusOutlined />} > Add Row</Button>
            </Tooltip>
          </Form.Item>
        </Col>
      </Row>

      <List
        dataSource={configDtoList}
        renderItem={(item, index) => (
          <List.Item style={{ display: 'flex', marginBottom: '16px' }}>
            <Space>
              <Form.Item
                label="Config Code"
                style={{ flex: 1, marginRight: '8px' }}
                rules={[{ required: true, message: 'Please enter Config Code' }]}
              >
                <Input
                  value={item.configCode}
                  onChange={(e) => handleInputChange(index, 'configCode', e.target.value)}
                />
              </Form.Item>
              <Form.Item
                label="Config Description"
                style={{ flex: 1, marginRight: '8px' }}
                rules={[{ required: true, message: 'Please enter Config Description' }]}
              >
                <Input
                  value={item.configDesc}
                  onChange={(e) => handleInputChange(index, 'configDesc', e.target.value)}
                />
              </Form.Item>
              <Form.Item label="Config Status" style={{ flex: 1, marginRight: '8px' }}>
                <Select
                  value={item.configStatus}
                  onChange={(value) => handleInputChange(index, 'configStatus', value)}
                >
                  <Option value={true}>True</Option>
                  <Option value={false}>False</Option>
                </Select>
              </Form.Item>
              <Tooltip title="Remove Row">
                <Button type="danger" icon={<MinusCircleOutlined />} onClick={() => handleRemoveRow(index)} />
              </Tooltip>
            </Space>
          </List.Item>
        )}
      />

      <Row justify="end" style={{ marginTop: '16px' }}>
        <Col>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default QuickCodeForm;
