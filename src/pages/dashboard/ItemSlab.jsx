import { Table, Input } from "antd";
import React, { useState } from "react";
import { handleSearch } from "../../utils/Functions";
import { useSelector } from "react-redux";

const { Search } = Input;

const ItemSlab = ({allData, filteredData, setFilteredData}) => {

  console.log("Alldata: ", allData)

  console.log("Rendered")
  
  const [searchText, setSearchText] = useState("");
  // const [filteredData, setFilteredData] = useState(allData ? [...allData] : []);
  console.log("FilteredData: ", filteredData)
  const columns = [
    {
      title: "Item Code",
      dataIndex: "itemCode",
    },
    {
      title: "Item Description",
      dataIndex: "itemDescription",
    },
    {
      title: "Subcategory",
      dataIndex: "subCategory",
    },
    {
      title: "FNS Category",
      dataIndex: "fnsCategory",
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
