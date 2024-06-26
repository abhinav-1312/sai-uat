import React, { useState } from 'react'
import { Table, Input } from "antd";
import { handleSearch } from "../../utils/Functions";

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
        dataIndex: "itemDesc"
    },
    {
        title: "Subcategory",
        dataIndex: "subcategory"
    },
    {
        title: "OHQ",
        dataIndex: "ohq"
    },
    {
        title: "Value",
        dataIndex: "value"
    },
]

const InvValSlab = () => {
    const [searchText, setSearchText] = useState("");
  const [filteredData, setFilteredData] = useState(sampleData);
  return (
    <div>

    <div style={{ marginBottom: "1rem" }}>
      <Search
        placeholder="Search items"
        onChange={(e) =>
          handleSearch(
            e.target?.value || "",
            sampleData,
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

export default InvValSlab
