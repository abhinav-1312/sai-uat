import React, { useEffect, useState } from 'react'
import { Table, Input, message } from "antd";
import { apiCall, convertToCurrency, handleSearch } from "../../utils/Functions";
import { useSelector } from 'react-redux';

const { Search } = Input;

const sampleData = [
    {
        itemCode: 1233,
        itemDesc: "Sample hardcoded desc",
        subcategory: "Sample",
        ohq: 12,
        value: 12334
      },
    {
        itemCode: 1233,
        itemDesc: "Sample hardcoded desc",
        subcategory: "Sample",
        ohq: 12,
        value: 12334
      },
    {
        itemCode: 1233,
        itemDesc: "Sample hardcoded desc",
        subcategory: "Sample",
        ohq: 12,
        value: 12334
      },
    {
        itemCode: 1233,
        itemDesc: "Sample hardcoded desc",
        subcategory: "Sample",
        ohq: 12,
        value: 12334
      },
]

const columns = [
    {
        title: "Item Code",
        dataIndex: "itemCode"
    },
    {
        title: "Item Description",
        dataIndex: "itemName"
    },
    {
        title: "Subcategory",
        dataIndex: "subcategory"
    },
    {
        title: "OHQ",
        dataIndex: "quantity"
    },
    {
        title: "Value",
        dataIndex: "value"
    },
]

const InvValSlab = ({data, filteredData, setFilteredData}) => {
    const [searchText, setSearchText] = useState("");
    // const [data, setData] = useState(null)
  // const [filteredData, setFilteredData] = useState();
  const {token, userCd} = useSelector(state => state.auth)

  // const populateData = async () => {
  //   try{
  //     const {responseData} = await apiCall("POST", "/master/getOHQ", token, {itemCode: null, userId: userCd, orgId: orgId ? orgId : null})

  //     const modData = responseData.map(obj => {
  //       let totVal = 0;
  //       let totQuantity = 0;
  //       obj.qtyList.forEach(qty => {
  //         totVal = totVal + qty.totalValues
  //         totQuantity = totQuantity + qty.quantity
  //       })

  //       return {
  //         itemCode: obj.itemCode,
  //         itemName: obj.itemName,
  //         subcategory: "N/A",
  //         value: convertToCurrency(totVal), 
  //         quantity: totQuantity
  //       }
  //     })
  //     setFilteredData([...modData])
  //     setData([...modData])
  //   }catch(error){
  //     console.log("Error in inv slab: ", error)
  //     message.error("Error occured fetching inventory details.")
  //   }
  // }

  // useEffect(()=> {
  //   populateData()
  // }, [])

  return (
    <div>

    <div style={{ marginBottom: "1rem" }}>
      <Search
        placeholder="Search items"
        onChange={(e) =>
          handleSearch(
            e.target?.value || "",
            data,
            setFilteredData,
            setSearchText
          )
        }
        value={searchText}
        style={{ width: 200 }}
      />
    </div>
    <Table
      dataSource={filteredData}
      columns={columns}
      pagination={{ pageSize: 10 }}
    />
  </div>
  )
}

export default InvValSlab;
