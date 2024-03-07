import React from 'react';
import { Table, Space, Button } from 'antd';

const OrganizationTable = ({ organizations, onEdit, onDelete }) => {
  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'organizationId' },
    { title: 'Sub-Organization Name', dataIndex: 'organizationName', key: 'organizationName' },
    { title: 'Parent Org ID', dataIndex: 'parentOrgId', key: 'parentOrgId' },
    { title: 'Location', dataIndex: 'location', key: 'location' },
    { title: 'Location Address', dataIndex: 'locationAddr', key: 'locationAddr' },
    { title: 'Contact No.', dataIndex: 'contactNo', key: 'contactNo' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'GSTIN', dataIndex: 'gstin', key: 'gstin' },
    { title: 'Status', dataIndex: 'status', key: 'status' },
    {
      title: 'Actions',
      key: 'actions',
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

  return <Table dataSource={organizations} columns={columns} />;
};

export default OrganizationTable;
