// TransactionPage.js
import React, { useState } from 'react';
import { Button, Modal, Input } from 'antd';
import TransactionTable from './TransactionTable';
import TransactionForm from './TransactionForm';

const initialTransactions = [
  { id: 1, transactionNo: 'TN001', transactionDate: '2023-01-01', issueNoteNo: 'IN001', requestedBy: 'John Doe', requisitionNo: 'RQ001', note: 'Sample Note 1', fromOrganization: 'Org A', toOrganization: 'Org B', transactionType: 'Sale', issueType: 'Issue', receivingType: 'Direct' },
  { id: 2, transactionNo: 'TN002', transactionDate: '2023-01-02', issueNoteNo: 'IN002', requestedBy: 'Jane Smith', requisitionNo: 'RQ002', note: 'Sample Note 2', fromOrganization: 'Org B', toOrganization: 'Org C', transactionType: 'Purchase', issueType: 'Return', receivingType: 'Warehouse' },
  { id: 3, transactionNo: 'TN003', transactionDate: '2023-01-03', issueNoteNo: 'IN003', requestedBy: 'Bob Johnson', requisitionNo: 'RQ003', note: 'Sample Note 3', fromOrganization: 'Org C', toOrganization: 'Org A', transactionType: 'Transfer', issueType: 'Transfer', receivingType: 'Internal' },
  { id: 4, transactionNo: 'TN004', transactionDate: '2023-01-04', issueNoteNo: 'IN004', requestedBy: 'Alice Lee', requisitionNo: 'RQ004', note: 'Sample Note 4', fromOrganization: 'Org A', toOrganization: 'Org D', transactionType: 'Sale', issueType: 'Issue', receivingType: 'Direct' },
  { id: 5, transactionNo: 'TN005', transactionDate: '2023-01-05', issueNoteNo: 'IN005', requestedBy: 'Charlie Brown', requisitionNo: 'RQ005', note: 'Sample Note 5', fromOrganization: 'Org D', toOrganization: 'Org B', transactionType: 'Purchase', issueType: 'Return', receivingType: 'Warehouse' },
];
const TransactionPage = () => {
  const [transactions, setTransactions] = useState(initialTransactions);
  const [visible, setVisible] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    setVisible(true);
  };

  const handleDelete = (transactionId) => {
    // Implement delete logic here
  };

  const handleFormSubmit = (values) => {
    if (editingTransaction) {
      // Implement update logic here
    } else {
      // Implement create logic here
    }
    setVisible(false);
  };

  return (
    <div>
      <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between' }}>
        <Input placeholder="Search transactions" style={{ width: '200px' }} />
        <Button type="primary" className='saitheme-btn' onClick={() => setVisible(true)}>
          Add Transaction
        </Button>
      </div>
      <TransactionTable
        transactions={transactions}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Modal
        title={editingTransaction ? 'Edit Transaction' : 'Add Transaction'}
        open={visible}
        onCancel={() => {
          setEditingTransaction(null);
          setVisible(false);
        }}
        footer={null}
        width={'50%'}
      >
        <TransactionForm onSubmit={handleFormSubmit} initialValues={editingTransaction} />
      </Modal>
    </div>
  );
};

export default TransactionPage;
