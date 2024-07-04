import { Table, Input, Button, Popover, Select } from "antd";
import React, { useState } from "react";
import { handleSearch } from "../../utils/Functions";
import { useSelector } from "react-redux";
import {CaretUpOutlined} from '@ant-design/icons'

const { Search } = Input;
const { Option } = Select;

const ItemSlab = ({allData, filteredData, setFilteredData, descFilterDropdown, subcatDropdown}) => {
  const [searchText, setSearchText] = useState("");
  const [descPopoverOpen, setDescPopoverOpen] = useState(false)
  const [descFilterVal, setDescFilterVal] = useState(null)

  console.log("filtered", filteredData)

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


  console.log("Descfilterv: ", descFilterVal)

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
      key: "subcategoryDesc",
        filters: [...subcatDropdown || []],
        onFilter: (value, record) => record?.subcategoryDesc?.indexOf(value) === 0,
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

  if(!allData){
    return (
      <h3>Loading</h3>
    )
  }
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
      <Table
        dataSource={filteredData}
        columns={columns}
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default ItemSlab;
