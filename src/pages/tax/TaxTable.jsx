// TaxTable.js
import React from 'react';
import { Table, Space, Button } from 'antd';

const TaxTable = ({ taxes, onEdit, onDelete }) => {
  const columns = [
    { title: 'TAX NAME', dataIndex: 'taxName', key: 'taxName', fixed: 'left', width: 120 },
    { title: 'TAX RATE', dataIndex: 'taxRate', key: 'taxRate' },
    { title: 'TAX TYPE', dataIndex: 'taxType', key: 'taxType' },
    { title: 'TAX DESCRIPTION', dataIndex: 'taxDescription', key: 'taxDescription' },
    { title: 'EFFECTIVE DATE', dataIndex: 'effectiveDate', key: 'effectiveDate' },
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
          InActive
          </Button>
        </Space>
      ),
    },
  ];

  return <Table dataSource={taxes} columns={columns} scroll={{ x: 'max-content' }} />;
};

export default TaxTable;
