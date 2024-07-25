import React, { useEffect, useState } from 'react'
import { Table, Input, message } from "antd";
import { apiCall, convertToCurrency, handleSearch } from "../../utils/Functions";
import {SearchOutlined, RightOutlined} from '@ant-design/icons'
import { useSelector } from 'react-redux';
import _ from 'lodash'

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






const InvValSlab = ({data, filteredData, setFilteredData, itemDescDropdown, subcatDropdown}) => {
    const [searchText, setSearchText] = useState("");
    // const [data, setData] = useState(null)
  // const [filteredData, setFilteredData] = useState();
  const {token, userCd} = useSelector(state => state.auth)

  const columns = [
    {
        title: "Item Code",
        dataIndex: "itemCode"
    },
    {
        title: "Item Description",
        dataIndex: "itemName",
        key: 'itemName',
      filters: [...itemDescDropdown || []],
      onFilter: (value, record) => record?.itemName?.indexOf(value) === 0,
    },
    {
        title: "Subcategory",
        dataIndex: "subcategory",
        key: "subcategory",
        filters: [...subcatDropdown || []],
        onFilter: (value, record) => record?.subcategory?.indexOf(value) === 0,
    },
    {
        title: "OHQ",
        dataIndex: "quantity"
    },
    {
        title: "Value",
        dataIndex: "value",
        filters: [
          { text: 'Zero', value: '0' },
        ],
        onFilter: (value, record) => parseFloat(record.value.replace(/[^\d.-]/g, '')) === parseFloat(value),

    },
]

const [filteredInfo, setFilteredInfo] = useState({})
// Calculate number of rows matching filters
const modData = filteredData?.filter(record => {
  return Object.keys(filteredInfo).every(key => {
    const filterValues = filteredInfo[key];
    if (filterValues && filterValues.length > 0) {
      return filterValues.includes(_.trim(record[key]));
    }
    return true; // If no filter applied for this column, return true
  });
});

let filteredVal = 0;
modData?.forEach((item,index)=>{
    filteredVal = filteredVal +  parseInt((item.value).replace(/[^\d.-]/g, ''))
})

const renderAppliedFilters = () => {
  return (
    <div>
      {/* <p>Applied filters:</p> */}
      <ul>
        {Object.keys(filteredInfo).map(key => {
          const filterValues = filteredInfo[key];
          if (filterValues && filterValues.length > 0) {
            const column = columns.find(col => col.dataIndex === key);
            return (
              // <li key={key}>
              <div>
                <RightOutlined />
                {column.title}:  <span style={{fontWeight: "normal"}}> {filterValues.join(', ')} </span>
              </div>
              // </li>
            );
          }
          return null;
        })}
      </ul>
    </div>
  );
};

const handleTableChange = (pagination, filters) => {
  console.log('Filters changed:', filters);
  setFilteredInfo(filters); // Update filteredInfo state with applied filters
};

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

    {Object.keys(filteredInfo).length > 0 && (
        <div className="sec-slab" style={{backgroundColor: "#3498DB", color: "white"}}>
        <div>Total value of items for: </div>
        <div>{renderAppliedFilters()}</div>
        <div style={{fontSize: "2rem", fontWeight: "bold", textAlign: "center"}}>{convertToCurrency(filteredVal)}</div>
      </div>

      )}


    <Table
      dataSource={filteredData}
      columns={columns}
      onChange={handleTableChange}
      pagination={{ pageSize: 10 }}
    />
  </div>
  )
}

export default InvValSlab;
