// UserTable.js
import React from 'react';
import { Table, Space, Button } from 'antd';

const DepartmentTable = ({ departments, onEdit, onDelete }) => {
  const columns = [
    { title: 'Department ID', dataIndex: 'id', key: 'departmentId', fixed: 'left', },
    { title: 'Department NAME', dataIndex: 'departmentName', key: 'departmentName' },
    { title: 'Location ', dataIndex: 'location', key: 'location' },
    { title: 'STATUS', dataIndex: 'status', key: 'status' },
    {
      title: 'Actions',
      key: 'actions',
      fixed: 'right',
      render: (_, record) => (
        <Space>
          <Button type="primary" className='saitheme-btn' onClick={() => onEdit(record)}>
            Edit
          </Button>
          <Button danger onClick={() => onDelete(record.id)}>
          Delete
          </Button>
        </Space>
      ),
    },
  ];

  return <Table dataSource={departments} columns={columns} scroll={{ x: 'max-content' }} />;
};

export default DepartmentTable;
