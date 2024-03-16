import React, { useEffect, useState } from "react";
import { Input, Table } from "antd";
import axios from "axios";

const Ohq = () => {
  const [itemData, setItemData] = useState([])
  const [filteredData, setFilteredData] = useState([])
  // const [itemMasterData, setItemMasterData] = useState([])

  const populateItemData = async () => {
    const {data} = await axios.post('https://sai-services.azurewebsites.net/sai-inv-mgmt/master/getOHQ', {itemCode: null, userId: "string"}) // sending itemCode 'null' gives all available data
    const {responseData} = data
     setItemData([...responseData])
     setFilteredData([...responseData])
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
    console.log("Obj: ", obj)
    return (
      <Table 
        dataSource={obj}
        pagination={false}
        columns={[
          {
            title: "LOCATOR DESCRIPTION",
            dataIndex: "locatorDesc",
            key: "locatorDesc"
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
      dataIndex: "itemCode",
      key: "itemCode"
    },

    {
      title: "ITEM NAME",
      dataIndex: "itemName",
      key: "itemName"
    },

    {
      title: "LOCATION",
      dataIndex: "locationName",
      key: "locationName"
    },

    {
      title: "UOM",
      dataIndex: "uomDesc",
      key: "uomDesc"
    },

    {
      title: "LOCATOR QUANTITY DETAILS",
      dataIndex: "qtyList",
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
