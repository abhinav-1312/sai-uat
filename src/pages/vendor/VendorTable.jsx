// VendorTable.js
import React from 'react';
import { Table, Space, Button } from 'antd';

const VendorTable = ({ vendors, onEdit, onDelete }) => {
  const columns = [
    { title: 'VENDOR ID', dataIndex: 'id', key: 'vendorId', fixed: 'left', },
    { title: 'VENDOR NAME', dataIndex: 'vendorName', key: 'vendorName', fixed: 'left', },
    { title: 'CONTACT PERSON', dataIndex: 'contactPerson', key: 'contactPerson' },
    { title: 'ADDRESS', dataIndex: 'address', key: 'address' },
    { title: 'CONTACT NO.', dataIndex: 'contactNo', key: 'contactNo' },
    { title: 'ZIP CODE', dataIndex: 'zipcode', key: 'zipCode' },
    { title: 'VENDOR EMAIL', dataIndex: 'email', key: 'vendorEmail' },
    { title: 'PAN NO.', dataIndex: 'pan', key: 'panNo' },
    { title: 'GSTIN NO.', dataIndex: 'gstin', key: 'gstinNo' },
    { title: 'TYPE', dataIndex: 'type', key: 'type' },
    { title: 'APPROVAL', dataIndex: 'approval', key: 'approval' },
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

  return <Table dataSource={vendors} columns={columns} scroll={{ x: 'max-content' }} />;
};

export default VendorTable;
