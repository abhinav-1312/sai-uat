// TransactionTable.js
import React from 'react';
import { Table, Space, Button } from 'antd';

const TransactionTable = ({ transactions, onEdit, onDelete }) => {



  const columns = [
    { title: 'S NO.', dataIndex: 'id', key: 'id', fixed: 'left', width: 80 },
    { title: 'TRANSACTION NO.', dataIndex: 'transactionNo', fixed: 'left', key: 'transactionNo' },
    { title: 'TRANSACTION DATE', dataIndex: 'transactionDate', key: 'transactionDate' },
    { title: 'ISSUE NOTE NO.', dataIndex: 'issueNoteNo', key: 'issueNoteNo' },
    { title: 'REQUESTED BY', dataIndex: 'requestedBy', key: 'requestedBy' },
    { title: 'REQUISITION NO.', dataIndex: 'requisitionNo', key: 'requisitionNo' },
    { title: 'NOTE', dataIndex: 'note', key: 'note' },
    { title: 'FROM ORGANIZATION', dataIndex: 'fromOrganization', key: 'fromOrganization' },
    { title: 'TO ORGANIZATION', dataIndex: 'toOrganization', key: 'toOrganization' },
    { title: 'TRANSACTION TYPE', dataIndex: 'transactionType', key: 'transactionType' },
    { title: 'ISSUE TYPE', dataIndex: 'issueType', key: 'issueType' },
    { title: 'RECEIVING TYPE', dataIndex: 'receivingType', key: 'receivingType' },
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

  return <Table dataSource={transactions} columns={columns} scroll={{ x: 'max-content' }} />;
};

export default TransactionTable;
