
// LocatorTable.js
import React from 'react';
import { Table, Space, Button } from 'antd';

const LocatorTable = ({ locators, onEdit, onDelete }) => {
  const columns = [

    { title: 'Id', dataIndex: 'id', key: 'id', },
    { title: 'LOCATOR CODE', dataIndex: 'locatorCd', key: 'locatorCode', },
    { title: 'DESCRIPTION', dataIndex: 'locatorDesc', key: 'description', width: 120 },
    { title: 'LOCATION', dataIndex: 'location', key: 'location' },
    { title: 'CAPACITY', dataIndex: 'capacity', key: 'capacity' },
    { title: 'TYPE', dataIndex: 'type', key: 'type' },
    { title: 'STATUS', dataIndex: 'status', key: 'status' },
    { title: 'OWNER/RESPONSIBLE PARTY', dataIndex: 'ownership', key: 'owner' },
    {
      title: 'Actions',
      key: 'actions',
      fixed: 'right',
      render: (_, record) => (
        <Space>
          <Button type="primary" style={{ backgroundColor: '#ff8a00' }} onClick={() => onEdit(record)}>
            Edit
          </Button>
          <Button danger onClick={() => onDelete(record.id)}>
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return <Table dataSource={locators} columns={columns} scroll={{ x: 'max-content' }} />;
};

export default LocatorTable;
