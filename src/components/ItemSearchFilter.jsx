import React, { useState, useEffect } from 'react';
import { Input, Button, Table, Popover } from 'antd';
// import 'antd/dist/antd.css';

const { Search } = Input;

const ItemSearchFilter = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchValue, setSearchValue] = useState('');

  useEffect(() => {
    // Fetch data from the API
    fetch('https://sai-services.azurewebsites.net/sai-inv-mgmt/master/getItemMaster')
      .then(response => response.json())
      .then(data => {
        setData(data.responseData);
        setFilteredData(data.responseData); // Initially set filtered data to all data
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);


  const handleSearch = (value) => {
    setSearchValue(value);
    // Filter data based on any field
    const filtered = data.filter(item => {
      // Check if any field includes the search value
      return Object.values(item).some(field => {
        if (typeof field === 'string') {
          return field.toLowerCase().includes(value.toLowerCase());
        }
        return false;
      });
    });
    setFilteredData(filtered);
  };


  const columns = [
    { title: "S NO.", dataIndex: "id", key: "id", fixed: "left", width: 80 },
    {
      title: "ITEM CODE",
      dataIndex: "itemMasterCd",
      key: "itemCode",

    },
    {
      title: "ITEM DESCRIPTION",
      dataIndex: "itemMasterDesc",
      key: "itemMasterDesc",

    },
    { title: "UOM", dataIndex: "uom", key: "uom" },
    {
      title: "QUANTITY ON HAND",
      dataIndex: "quantity",
      key: "quantity",
    },
    { title: "LOCATION", dataIndex: "locationId", key: "location" },
    {
      title: "LOCATOR CODE",
      dataIndex: "locatorId",
      key: "locatorCode",
    },
    { title: "PRICE", dataIndex: "price", key: "price" },
    { title: "VENDOR DETAIL", dataIndex: "vendorId", key: "vendorDetail" },
    { title: "CATEGORY", dataIndex: "category", key: "category" },

    { title: "SUB-CATEGORY", dataIndex: "subCategory", key: "subCategory" },
    { title: "Type", dataIndex: "type", key: "type" },
    { title: "Disciplines", dataIndex: "disciplines", key: "disciplines" },
    { title: "Brand", dataIndex: "brandId", key: "brand" },
    { title: "Size", dataIndex: "size", key: "size" },
    { title: "Colour", dataIndex: "colorId", key: "colour" },
    {
      title: "Usage Category",
      dataIndex: "usageCategory",
      key: "usageCategory ",
    },

    {
      title: "MINIMUM STOCK LEVEL",
      dataIndex: "minStockLevel",
      key: "minStockLevel",
    },
    {
      title: "MAXIMUM STOCK LEVEL",
      dataIndex: "maxStockLevel",
      key: "maxStockLevel",
    },
    { title: "RE ORDER POINT", dataIndex: "reOrderPoint", key: "reOrderPoint" },
    { title: "STATUS", dataIndex: "status", key: "status" },
    { title: "END DATE", dataIndex: "endDate", key: "endDate" },
    {
      title: "Actions",
      key: "actions",
      fixed: "right",
      render: (_, record) => (
        <Button type="primary" danger>Select</Button>
      ),
    },
  ];

  return (
    <div style={{ width: '300px' }}>


      {/* Popover */}
      <Popover
        content={
          <Table
            dataSource={filteredData}
            columns={columns}
            pagination={false}
            scroll={{ x: "max-content" }}
            style={{ width: '1000px' }}
          />
        }
        title="Filtered Item Data"
        trigger="click"
        visible={searchValue !== '' && filteredData.length > 0}
        style={{ width: '200px' }}
        placement="right"
      >

        <Search
          placeholder="Search Item Data"
          allowClear
          enterButton="Search"
          size="large"
          onSearch={handleSearch}
        />

      </Popover>

    </div>
  );
};

export default ItemSearchFilter;
