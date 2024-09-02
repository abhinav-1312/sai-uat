import React, { useState } from "react";
import { Table, Input } from "antd";
import { convertToCurrency, handleSearch } from "../../utils/Functions";
import { RightOutlined } from "@ant-design/icons";
import _ from "lodash";
import BarGraph from "./graphs/BarGraph";

const { Search } = Input;

const InvValSlab = ({
  data,
  itemDescDropdownList,
  subCategoryDropdownList,
  orgId,
  countOrgWise
}) => {
  const [searchText, setSearchText] = useState("");
  const [filteredData, setFilteredData] = useState([...data])

  const columns = [
    {
      title: "Item Code",
      dataIndex: "itemCode",
    },
    {
      title: "Item Description",
      dataIndex: "itemName",
      key: "itemName",
      filters: [...(itemDescDropdownList || [])],
      onFilter: (value, record) => record?.itemName?.indexOf(value) === 0,
    },
    {
      title: "Subcategory",
      dataIndex: "subcategory",
      key: "subcategory",
      filters: [...(subCategoryDropdownList || [])],
      onFilter: (value, record) => record?.subcategory?.indexOf(value) === 0,
    },
    {
      title: "OHQ",
      dataIndex: "quantity",
    },
    {
      title: "Value",
      dataIndex: "value",
      filters: [{ text: "Zero", value: "0" }],
      onFilter: (value, record) =>
        parseFloat(record.value.replace(/[^\d.-]/g, "")) === parseFloat(value),
    },
    {
      title: "Organization Name",
      dataIndex: "locationName",
    },
  ];

  const [filteredInfo, setFilteredInfo] = useState({});
  // Calculate number of rows matching filters
  const modData = filteredData?.filter((record) => {
    return Object.keys(filteredInfo).every((key) => {
      const filterValues = filteredInfo[key];
      if (filterValues && filterValues.length > 0) {
        return filterValues.includes(_.trim(record[key]));
      }
      return true; // If no filter applied for this column, return true
    });
  });

  let filteredVal = 0;
  modData?.forEach((item, index) => {
    filteredVal = filteredVal + parseInt(item.value.replace(/[^\d.-]/g, ""));
  });

  const renderAppliedFilters = () => {
    return (
      <div>
        <ul>
          {Object.keys(filteredInfo).map((key) => {
            const filterValues = filteredInfo[key];
            if (filterValues && filterValues.length > 0) {
              const column = columns.find((col) => col.dataIndex === key);
              return (
                <div>
                  <RightOutlined />
                  {column.title}:{" "}
                  <span style={{ fontWeight: "normal" }}>
                    {" "}
                    {filterValues.join(", ")}{" "}
                  </span>
                </div>
              );
            }
            return null;
          })}
        </ul>
      </div>
    );
  };

  const handleTableChange = (_, filters) => {
    // _ -> pagination
    setFilteredInfo(filters); // Update filteredInfo state with applied filters
  };

  return (
    <div>
      {
        !orgId &&
        <BarGraph labels = {Object.keys(countOrgWise)} values = {Object.values(countOrgWise)} legend="Inventory Value (in Rupess)" slab="invSlab"/>
      }
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
        <div
          className="sec-slab"
          style={{ backgroundColor: "#3498DB", color: "white" }}
        >
          <div>Total value of items for: </div>
          <div>{renderAppliedFilters()}</div>
          <div
            style={{
              fontSize: "2rem",
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            {convertToCurrency(filteredVal)}
          </div>
        </div>
      )}

      <Table
        dataSource={filteredData}
        columns={columns}
        onChange={handleTableChange}
        pagination={{ pageSize: 10 }}
      />
      
    </div>
  );
};

export default InvValSlab;
