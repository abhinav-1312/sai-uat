// CurrencyPage.js
import React, { useState } from 'react';
import { Button, Modal, Input } from 'antd';
import CurrencyTable from './CurrencyTable';
import CurrencyForm from './CurrencyForm';

const initialCurrencies = [
  {
    id: 1,
    currencyCode: 'USD',
    currencyName: 'US Dollar',
    symbol: '$',
    country: 'United States',
    exchangeRate: 1.0,
    status: 'Active',
  },
  // Add more dummy data as needed
];

const CurrencyPage = () => {
  const [currencies, setCurrencies] = useState(initialCurrencies);
  const [visible, setVisible] = useState(false);
  const [editingCurrency, setEditingCurrency] = useState(null);
  const [searchText, setSearchText] = useState('');

  const handleEdit = (currency) => {
    setEditingCurrency(currency);
    setVisible(true);
  };

  const handleDelete = (currencyId) => {
    // Implement delete logic here
  };

  const handleFormSubmit = (values) => {
    if (editingCurrency) {
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
          placeholder="Search currencies"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: '200px' }}
        />
        <Button type="primary" className='saitheme-btn' onClick={() => setVisible(true)}>
          Add Currency
        </Button>
      </div>
      <CurrencyTable
        currencies={currencies.filter((currency) =>
          currency.currencyCode.toLowerCase().includes(searchText.toLowerCase())
        )}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Modal
        title={editingCurrency ? 'Edit Currency' : 'Add Currency'}
        visible={visible}
        onCancel={() => {
          setEditingCurrency(null);
          setVisible(false);
        }}
        footer={null}
      >
        <CurrencyForm onSubmit={handleFormSubmit} initialValues={editingCurrency} />
      </Modal>
    </div>
  );
};

export default CurrencyPage;
