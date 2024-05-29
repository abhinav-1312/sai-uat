import React, { useEffect, useState } from "react";
import { Input, Table } from "antd";
import axios from "axios";
import { apiHeader, convertToCurrency, handleSearch, renderLocatorOHQ } from "../../utils/Functions";
import { useSelector } from "react-redux";

const Ohq = ({orgId, organization}) => {
  const [itemData, setItemData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [totVal, setTotVal] = useState(0)
  // const token = localStorage.getItem("token");

  // const userId = localStorage.getItem("userCd")

  const {token, userCd:userId} = useSelector(state=>state.auth)
  // const [itemMasterData, setItemMasterData] = useState([])

  const populateItemData = async () => {
    try{
      const { data } = await axios.post(
        "https://uat-sai-app.azurewebsites.net/sai-inv-mgmt/master/getOHQ",
        { itemCode: null, userId },
        apiHeader("POST", token)
      ); // sending itemCode 'null' gives all available data
      const { responseData } = data;
      setItemData([...responseData]);
      setFilteredData([...responseData]);

      // calculate total value
      let sum = 0
      responseData.forEach(item => {
        item.qtyList.forEach(loc => {
          sum = sum + loc.totalValues
        })
      })

      setTotVal(convertToCurrency(sum))
    }catch(error){
      console.log("Error", error)
      alert("Error occured while fetching data. Please try again.")
    }
  };

  const populateItemDataHq = async (orgId) => {
    try{

      const { data } = await axios.post(
        "https://uat-sai-app.azurewebsites.net/sai-inv-mgmt/master/getOHQ",
        { itemCode: null, userId, orgId },
        apiHeader("POST", token)
      ); // sending itemCode 'null' gives all available data
      const { responseData } = data;
      setItemData([...responseData]);
      setFilteredData([...responseData]);

      // calculate total value
      let sum = 0
      responseData.forEach(item => {
        item.qtyList.forEach(loc => {
          sum = sum + loc.totalValues
        })
      })

      setTotVal(convertToCurrency(sum))
    }
    catch(error){
      console.log("Error", error)
      alert("Error occured while fetching data. Please try again.")
    }
  };

  const populateAllOHQ = async () => {
    console.log("all ohq called")
    try{

      const { data } = await axios.post(
        "https://uat-sai-app.azurewebsites.net/sai-inv-mgmt/master/getAllOHQ",
        { itemCode: null, userId, orgId:null, itemDesc: null },
        apiHeader("POST", token)
      ); // sending itemCode 'null' gives all available data
      const { responseData } = data;
      const newArray = []

      // const modData = []
      responseData.map(item=>{
        item.qtyList.map(obj=>{
          const objFound = newArray.find(tempItem => tempItem.locationId === obj.locationId && tempItem.itemCode === item.itemCode)

          if(objFound){
            const qtyListObj = {locatorId: obj.locatorId, quantity: obj.quantity, locatorDesc: obj.locatorDesc}
            objFound.qtyList.push(qtyListObj)
          }
          else{
            const newItemObj = {
              itemCode: item.itemCode,
              itemName: item.itemName,
              locationId: obj.locationId,
              locationName: obj.locationName,
              uomDesc: item.uomDesc,
              qtyList: [
                {locatorId: obj.locatorId, quantity: obj.quantity, locatorDesc: obj.locatorDesc, totalValues: obj.totalValues}
              ]
            }

            newArray.push(newItemObj)
          }
        })
      })
      setItemData([...newArray]);
      setFilteredData([...newArray]);

      // calculate total value
      let sum = 0
      responseData.forEach(item => {
        item.qtyList.forEach(loc => {
          sum = sum + loc.totalValues
        })
      })

      setTotVal(convertToCurrency(sum))
    }
    catch(error){
      console.log("Error", error)
      alert("Error occured while fetching data. Please try again.")
    }
  }

  useEffect(() => {

    if(orgId){
      populateItemDataHq(orgId);  
    }
    else if(organization==="headquarter"){
      populateAllOHQ()
    }
    else{
      populateItemData();
    }
  }, [orgId]);

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

      <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>

      <Input.Search
        placeholder="Search item"
        allowClear
        enterButton="Search"
        size="large"
        onSearch={(e) =>
          handleSearch(e.target?.value || null, itemData, setFilteredData)
        }
        onChange={(e) =>
          handleSearch(e.target?.value || null, itemData, setFilteredData)
        }
        style={{ width: "30%", margin: "1rem 0" }}
        />
      <h2 style={{border: "2px solid black", padding: "1rem", borderRadius: "5px"}}>
        Total value for all items: {totVal}
      </h2>
        </div>

      <Table dataSource={filteredData} columns={columns} />
    </>
  );
};

export default Ohq;
