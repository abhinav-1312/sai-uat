import React, { useEffect, useState } from "react";
import { Input, Table } from "antd";
import SampleData from "./SampleData";

const Ohq = () => {
  const [itemData, setItemData] = useState([])
  const [filteredData, setFilteredData] = useState([])

  const populateItemData = () => {
    const {items} = SampleData
     setItemData([...items])
     setFilteredData([...items])
  }

  const handleSearch = (searchText) => {
    const filtered = itemData.filter((parentObject) =>
      recursiveSearch(parentObject, searchText)
    );
    setFilteredData([...filtered]);
  };

  const recursiveSearch = (object, searchText) => {
    for (let key in object) {
      const value = object[key];
      if (typeof value === 'object') {
        if (Array.isArray(value)) {
          for (let item of value) {
            if (recursiveSearch(item, searchText)) {
              return true;
            }
          }
        } else {
          if (recursiveSearch(value, searchText)) {
            return true;
          }
        }
      } else if (
        value &&
        value.toString().toLowerCase().includes(searchText.toLowerCase())
      ) {
        return true;
      }
    }
    return false;
  };

  useEffect(()=>{
    populateItemData()
  }, [])

  const renderLocator = (obj) => {
    return (
      <Table 
        dataSource={obj}
        pagination={false}
        columns={[
          {
            title: "LOCATOR DESCRIPTION",
            dataIndex: "locatorId",
            key: "locatorId"
          },
          {
            title: "QUANTITY",
            dataIndex: "quantity",
            key: "quantity"
          }
        ]}
      />
    )
  }

  const columns = [
    {
      title: "ITEM CODE",
      dataIndex: "itemCd",
      key: "itemCd"
    },

    {
      title: "ITEM NAME",
      dataIndex: "itemMasterDesc",
      key: "itemMasterDesc"
    },

    {
      title: "LOCATION",
      dataIndex: "locationId",
      key: "locationId"
    },

    {
      title: "UOM",
      dataIndex: "uomId",
      key: "uomId"
    },

    {
      title: "LOCATOR QUANTITY DETAILS",
      dataIndex: "locatorQuantity",
      key: "locatorId",
      render: (locatorQuantity) => renderLocator(locatorQuantity)
    },
  ]

  return (
    <>
      <h1 style={{textAlign: "center"}}> On Hand Quantity for Items </h1>
    
      <Input.Search
        placeholder="Search item"
        allowClear
        enterButton="Search"
        size="large"
        onSearch={(e) => handleSearch(e.target.value)}
        onChange={(e) => handleSearch(e.target.value)}
        style = {{width: "30%", margin: "1rem 0"}}
      />

      <Table 
        dataSource={filteredData}
        columns={columns}
      />
    </>
  );
};

export default Ohq;
