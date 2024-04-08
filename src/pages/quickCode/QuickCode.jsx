// QuickCodePage.js
import React, { useState } from 'react';
import { Button, Modal, Input } from 'antd';
import QuickCodeTable from './QuickCodeTable';
import QuickCodeForm from './QuickCodeForm';

const initialQuickCodes = [
  // You can add initial data here if needed
];

const QuickCodePage = () => {
  const [quickCodes, setQuickCodes] = useState(initialQuickCodes);
  const [visible, setVisible] = useState(false);
  const [editingQuickCode, setEditingQuickCode] = useState(null);
  const [searchText, setSearchText] = useState('');

  const handleEdit = (quickCode) => {
    setEditingQuickCode(quickCode);
    setVisible(true);
  };

  const handleDelete = (quickCodeId) => {
    // Implement delete logic here
  };

  const handleFormSubmit = (values) => {
    if (editingQuickCode) {
      // Implement update logic here
    } else {
      // Implement create logic here
    }
    setVisible(false);
  };

  return (
    <div>
      <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between' }}>
        <Input
          placeholder="Search quick codes"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: '200px' }}
        />
        <Button type="primary" className='saitheme-btn' onClick={() => setVisible(true)}>
          Add Quick Code
        </Button>
      </div>
      <QuickCodeTable
        quickCodes={quickCodes.filter((quickCode) =>
          quickCode.configCode.toLowerCase().includes(searchText.toLowerCase())
        )}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Modal
        title={editingQuickCode ? 'Edit Quick Code' : 'Add Quick Code'}
        visible={visible}
        onCancel={() => {
          setEditingQuickCode(null);
          setVisible(false);
        }}
        footer={null}
        width={'40%'}
      >
        <QuickCodeForm onSubmit={handleFormSubmit} initialValues={editingQuickCode} />
      </Modal>
    </div>
  );
};

export default QuickCodePage;
