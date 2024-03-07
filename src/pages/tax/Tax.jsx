// TaxPage.js
import React, { useState } from 'react';
import { Button, Modal, Input } from 'antd';
import TaxTable from './TaxTable';
import TaxForm from './TaxForm';

const initialTaxes = [
  {
    id: 1,
    taxName: 'GST',
    taxRate: '18%',
    taxType: 'Percentage',
    taxDescription: 'Goods & Services Tax',
    effectiveDate: '01/07/2017',
    status: 'Active',
  },
  // Add more dummy data as needed
];

const TaxPage = () => {
  const [taxes, setTaxes] = useState(initialTaxes);
  const [visible, setVisible] = useState(false);
  const [editingTax, setEditingTax] = useState(null);
  const [searchText, setSearchText] = useState('');

  const handleEdit = (tax) => {
    setEditingTax(tax);
    setVisible(true);
  };

  const handleDelete = (taxId) => {
    // Implement delete logic here
  };

  const handleFormSubmit = (values) => {
    if (editingTax) {
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
          placeholder="Search taxes"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: '200px' }}
        />
        <Button type="primary" className='saitheme-btn' onClick={() => setVisible(true)}>
          Add Tax
        </Button>
      </div>
      <TaxTable
        taxes={taxes.filter((tax) =>
          tax.taxName.toLowerCase().includes(searchText.toLowerCase())
        )}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Modal
        title={editingTax ? 'Edit Tax' : 'Add Tax'}
        visible={visible}
        onCancel={() => {
          setEditingTax(null);
          setVisible(false);
        }}
        footer={null}
      >
        <TaxForm onSubmit={handleFormSubmit} initialValues={editingTax} />
      </Modal>
    </div>
  );
};

export default TaxPage;
