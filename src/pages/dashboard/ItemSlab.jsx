import { Table, Input } from "antd";
import React, { useState } from "react";
import { handleSearch } from "../../utils/Functions";

const { Search } = Input;

const sampleData = [
  {
    itemCode: 1233,
    itemDesc: "Sample hardcoded desc",
    subcategory: "Sample",
    fnsCategory: "Slow Moving",
  },
  {
    itemCode: 1233,
    itemDesc: "Sample hardcoded desc",
    subcategory: "Sample",
    fnsCategory: "Slow Moving",
  },
  {
    itemCode: 1233,
    itemDesc: "Sample hardcoded desc",
    subcategory: "Sample",
    fnsCategory: "Fast Moving",
  },
];

const ItemSlab = () => {
  const [searchText, setSearchText] = useState("");
  const [filteredData, setFilteredData] = useState(sampleData);
  const columns = [
    {
      title: "Item Code",
      dataIndex: "itemCode",
    },
    {
      title: "Item Description",
      dataIndex: "itemDesc",
    },
    {
      title: "Subcategory",
      dataIndex: "itemDesc",
    },
    {
      title: "FNS Category",
      dataIndex: "fnsCategory",
    },
  ];
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
  );
};

export default ItemSlab;
