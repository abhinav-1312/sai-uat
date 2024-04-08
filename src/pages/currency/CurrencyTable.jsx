// CurrencyTable.js
import React from 'react';
import { Table, Space, Button } from 'antd';

const CurrencyTable = ({ currencies, onEdit, onDelete }) => {
  const columns = [
    { title: 'CURRENCY CODE', dataIndex: 'currencyCode', key: 'currencyCode', fixed: 'left',  },
    { title: 'CURRENCY NAME', dataIndex: 'currencyName', key: 'currencyName' },
    { title: 'SYMBOL', dataIndex: 'symbol', key: 'symbol' },
    { title: 'COUNTRY', dataIndex: 'country', key: 'country' },
    { title: 'EXCHANGE RATE', dataIndex: 'exchangeRate', key: 'exchangeRate' },
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

  return <Table dataSource={currencies} columns={columns} scroll={{ x: 'max-content' }} />;
};

export default CurrencyTable;
