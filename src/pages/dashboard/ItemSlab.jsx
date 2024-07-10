import { Table, Input, Button, Popover, Select } from "antd";
import React, { useState } from "react";
import { handleSearch } from "../../utils/Functions";
import { useSelector } from "react-redux";
import {CaretUpOutlined, RightOutlined} from '@ant-design/icons'
import _ from 'lodash'

const { Search } = Input;
const { Option } = Select;

const ItemSlab = ({allData, filteredData, setFilteredData, descFilterDropdown, subcatDropdown}) => {
  const [filteredInfo, setFilteredInfo] = useState({});
  const [searchText, setSearchText] = useState("");
  const [descPopoverOpen, setDescPopoverOpen] = useState(false)
  const [descFilterVal, setDescFilterVal] = useState(null)


  const handleDescSelect = (value) => {
    console.log("Value: ", value)
    setDescPopoverOpen(false)
  }

  const handleDescClick = () => {
    setDescPopoverOpen(!descPopoverOpen)
  }

//   const handleSearch = (columnKey, value) => {
//     // Perform search logic if needed
//     console.log(`Searching ${columnKey} for ${value}`);
//   };

//   return <Table dataSource={allData} columns={columns} />;
// };



  const columns = [
    {
      title: "Item Code",
      dataIndex: "itemCode",
    },
    {
      title: "Item Description",
      dataIndex: "itemDescription",
      key: 'itemDescription',
      filters:[...descFilterDropdown || []],
      onFilter: (value, record) => record?.itemDescription?.indexOf(value.split('-')[0]) === 0,
    },
    {
      title: "Subcategory",
      dataIndex: "subCategoryDesc",
      key: "subCategoryDesc",
        filters: [...subcatDropdown || []],
        onFilter: (value, record) => record?.subCategoryDesc?.indexOf(_.trim(value)) === 0,
    },
    {
      title: "FNS Category",
      dataIndex: "fnsCategory",
      key: 'fnsCategory',
      filters: [
        {
          text: "Fast Moving",
          value: "Fast Moving"
        },
        {
          text: "Slow Moving",
          value: "Slow Moving"
        },
        {
        text: "No Moving",
          value: "No Moving"
        },
      ],
      onFilter: (value, record) => record?.fnsCategory?.indexOf(value) === 0,
    },
  ];

   // Handle filters change
   const handleTableChange = (pagination, filters) => {
    console.log('Filters changed:', filters);
    setFilteredInfo(filters); // Update filteredInfo state with applied filters
  };

  if(!allData){
    return (
      <h3>Loading</h3>
    )
  }

  // Calculate number of rows matching filters
  const modData = allData?.filter(record => {
    // if(record.itemCode === "21299001999999991"){
    //   console.log("REcord: ", record)
    // }
    return Object.keys(filteredInfo).every(key => {
      const filterValues = filteredInfo[key];
      console.log("Filtervalues: ", filterValues)
      if (filterValues && filterValues.length > 0) {
        return filterValues.includes(_.trim(record[key]));
      }
      return true; // If no filter applied for this column, return true
    });
  });


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


 
  return (
    <div>
      <div style={{ marginBottom: "1rem" }}>
        <Search
          placeholder="Search items"
          onChange={(e) =>
            handleSearch(
              e.target?.value || "",
              allData,
              setFilteredData,
              setSearchText
            )
          }
          value={searchText}
          style={{ width: 200 }}
        />
      </div>

      {Object.keys(filteredInfo).length > 0 && (
        <>
        <div className="sec-slab" style={{color: "white", backgroundColor: "#1ABC9C"}}>
          <div>No. of items for : </div>
          <div>{renderAppliedFilters()}</div>
          <div style={{fontSize: "2rem", fontWeight: "bold", textAlign: "center"}}>{modData.length}</div>
        </div>
        </>
      )}


      <Table
        dataSource={filteredData}
        columns={columns}
        pagination={{ pageSize: 10 }}
        onChange={handleTableChange}
      />


{/* {Object.keys(filteredInfo).length > 0 && (
        <div>
          <p>Number of rows matching filters: {modData.length}</p>
          <p>Applied filters:</p>
          <ul>
            {Object.keys(filteredInfo).map(key => (
              <li key={key}>
                {columns.find(col => col.dataIndex === key)?.title}: {filteredInfo[key]?.join(', ')}
              </li>
            ))}
          </ul>
        </div>
      )} */}

    </div>
  );
};

export default ItemSlab;
