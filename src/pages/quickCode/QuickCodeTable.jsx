import React, { useState, useEffect } from 'react';
import { Table, Space, Modal, Form, Input, Button, Popconfirm, Select } from 'antd';
import axios from 'axios';

const QuickCodeTable = () => {
  const [data, setData] = useState([]);
  const [expandedRowKey, setExpandedRowKey] = useState(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editedConfig, setEditedConfig] = useState({});

  useEffect(() => {
    // Fetch data from the API
    axios
      .get('https://asset-management-service.azurewebsites.net/asset-management/getAllConfig')
      .then((response) => {
        setData(response.data.responseData);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const { Option } = Select;

  const nestedColumns = [
    { title: 'Config Id', dataIndex: 'configId', key: 'configId' },
    { title: 'Config Code', dataIndex: 'configCode', key: 'configCode' },
    { title: 'Config Description', dataIndex: 'configDesc', key: 'configDesc' },
    { title: 'Config Status', dataIndex: 'configStatus', key: 'configStatus', render: status => status.toString() },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button type="primary" onClick={() => handleEdit(record)}>Edit</Button>
          <Popconfirm
            title="Are you sure to delete this config?"
            onConfirm={() => handleDelete(record)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger >Delete</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleRowExpand = (record) => {
    if (record.configDtoList && record.configDtoList.length > 0) {
      setExpandedRowKey(record.key === expandedRowKey ? null : record.key);
    }
  };

  const handleEdit = (record) => {
    setEditedConfig(record);
    setEditModalVisible(true);
  };

  const handleDelete = (record) => {
    // Add your delete logic here
    console.log('Delete config:', record);
  };

  const handleEditModalOk = () => {
    // Add your edit logic here
    console.log('Edited config:', editedConfig);
    setEditModalVisible(false);
  };

  const handleEditModalCancel = () => {
    setEditModalVisible(false);
  };

  return (
    <>
      <Table
        dataSource={data.map((record, index) => ({ ...record, key: index }))}
        columns={[
          { title: 'Config Type', dataIndex: 'configType', key: 'configType' },
        ]}
        expandable={{
          expandedRowRender: (record) => (
            <Table
              dataSource={record.configDtoList}
              columns={nestedColumns}
              pagination={false}
            />
          ),
          rowExpandable: (record) => record.configDtoList && record.configDtoList.length > 0,
          expandedRowKeys: [expandedRowKey],
          onExpand: (_, record) => handleRowExpand(record),
        }}
      />

      <Modal
        title="Edit Config"
        visible={editModalVisible}
        onOk={handleEditModalOk}
        onCancel={handleEditModalCancel}
      >
        <Form>
          <Form.Item label="Config Code">
            <Input value={editedConfig.configCode} />
          </Form.Item>
          <Form.Item label="Config Description">
            <Input value={editedConfig.configDesc} />
          </Form.Item>
          <Form.Item label="Config Status">
            <Select value={editedConfig.configStatus} style={{ width: '100%' }}>
              <Option value={true}>True</Option>
              <Option value={false}>False</Option>
            </Select>
          </Form.Item>
          {/* Add other form fields as needed */}
        </Form>
      </Modal>
    </>
  );
};

export default QuickCodeTable;
