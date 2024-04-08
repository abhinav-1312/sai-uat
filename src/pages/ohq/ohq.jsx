import React, { useEffect, useState } from "react";
import { Input, Table } from "antd";
import axios from "axios";
import { apiHeader, handleSearch, renderLocatorOHQ } from "../../utils/Functions";

const Ohq = () => {
  const [itemData, setItemData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const token = localStorage.getItem("token");

  const userId = localStorage.getItem("userCd")
  // const [itemMasterData, setItemMasterData] = useState([])

  const populateItemData = async () => {
    const { data } = await axios.post(
      "https://uat-sai-app.azurewebsites.net/sai-inv-mgmt/master/getOHQ",
      { itemCode: null, userId },
      apiHeader("POST", token)
    ); // sending itemCode 'null' gives all available data
    const { responseData } = data;
    setItemData([...responseData]);
    setFilteredData([...responseData]);
  };

  useEffect(() => {
    populateItemData();
  }, []);

  // const renderLocator = (obj) => {
  //   return (
  //     <Table
  //       dataSource={obj}
  //       pagination={false}
  //       columns={[
  //         {
  //           title: "LOCATOR DESCRIPTION",
  //           dataIndex: "locatorDesc",
  //           key: "locatorDesc"
  //         },
  //         {
  //           title: "QUANTITY",
  //           dataIndex: "quantity",
  //           key: "quantity"
  //         }
  //       ]}
  //     />
  //   )
  // }

  const columns = [
    {
      title: "ITEM CODE",
      dataIndex: "itemCode",
      key: "itemCode",
    },

    {
      title: "ITEM NAME",
      dataIndex: "itemName",
      key: "itemName",
    },

    {
      title: "LOCATION",
      dataIndex: "locationName",
      key: "locationName",
    },

    {
      title: "UOM",
      dataIndex: "uomDesc",
      key: "uomDesc",
    },

    {
      title: "LOCATOR QUANTITY DETAILS",
      dataIndex: "qtyList",
      key: "locatorId",
      render: (locatorQuantity) => renderLocatorOHQ(locatorQuantity),
    },
  ];

  return (
    <>
      <h1 style={{ textAlign: "center" }}> On Hand Quantity for Items </h1>

      <Input.Search
        placeholder="Search item"
        allowClear
        enterButton="Search"
        size="large"
        onSearch={(e) =>
          handleSearch(e.target.value, itemData, setFilteredData)
        }
        onChange={(e) =>
          handleSearch(e.target.value, itemData, setFilteredData)
        }
        style={{ width: "30%", margin: "1rem 0" }}
      />

      <Table dataSource={filteredData} columns={columns} />
    </>
  );
};

export default Ohq;
