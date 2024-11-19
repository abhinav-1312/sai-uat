import React, { useEffect, useState } from "react";
import { Button, Input, message, Select, Table } from "antd";
import axios from "axios";
import {
  apiHeader,
  convertToCurrency,
  renderLocatorOHQ,
} from "../../utils/Functions";
import { useSelector } from "react-redux";
import FormSelectItem from "../../components/FormSelectItem";
import { CSVLink } from "react-csv";
const { Option } = Select;

const Ohq = ({ orgId, organization }) => {
  const [itemData, setItemData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [totVal, setTotVal] = useState(0);
  const { token, userCd: userId } = useSelector((state) => state.auth);
  const [locatorOptionArray, setLocatorOptionArray] = useState([]);
  const [subCategoryOptionArray, setSubCategoryOptionArray] = useState([]);
  const [uomOptionArray, setUomOptionArray] = useState([]);
  const [itemNameOptionArray, setItemNameOptionArray] = useState([]);

  const [filters, setFilters] = useState({
    locator: null,
    uom: null,
    subCategory: null,
    itemName: null,
  });

  const populateItemData = async () => {
    try {
      const { data } = await axios.post(
        "/master/getOHQ",
        { itemCode: null, userId },
        apiHeader("POST", token)
      ); // sending itemCode 'null' gives all available data
      const { responseData } = data;
      setItemData([...responseData] || []);
      setFilteredData([...responseData] || []);

      let sum = 0; // total value

      const itemNameSet = new Set();
      const subCategorySet = new Set();
      const uomSet = new Set();
      const locatorSet = new Set();

      const locatorOptionArray = [];
      const itemNameOptionArray = [];
      const subCategoryOptionArray = [];
      const uomOptionArray = [];

      responseData?.forEach((item) => {
        itemNameSet.add(item.itemName);
        subCategorySet.add(item.qtyList?.[0].subcategoryDesc);
        uomSet.add(item.uomDesc);
        item.qtyList.forEach((loc) => {
          locatorSet.add(loc.locatorDesc);
          sum = sum + loc.totalValues;
        });
      });

      itemNameSet.forEach((item) => {
        itemNameOptionArray.push({ desc: item, value: item });
      });
      subCategorySet.forEach((sc) => {
        subCategoryOptionArray.push({ value: sc, desc: sc });
      });
      uomSet.forEach((uom) => {
        uomOptionArray.push({ value: uom, desc: uom });
      });
      locatorSet.forEach((loc) => {
        locatorOptionArray.push({ value: loc, desc: loc });
      });

      setLocatorOptionArray(locatorOptionArray);
      setUomOptionArray(uomOptionArray);
      setSubCategoryOptionArray(subCategoryOptionArray);
      setItemNameOptionArray(itemNameOptionArray);
      setTotVal(convertToCurrency(sum));
    } catch (error) {
      message.error("Error occured while fetching data. Please try again.");
    }
  };

  const populateItemDataHq = async (orgId) => {
    try {
      const { data } = await axios.post(
        "/master/getOHQ",
        { itemCode: null, userId, orgId }, // sending itemCode 'null' gives all available data
        apiHeader("POST", token)
      );
      const { responseData } = data;
      setItemData([...responseData] || []);
      setFilteredData([...responseData] || []);

      // calculate total value
      let sum = 0;
      responseData?.forEach((item) => {
        item.qtyList.forEach((loc) => {
          sum = sum + loc.totalValues;
        });
      });

      setTotVal(convertToCurrency(sum));
    } catch (error) {
      message.error("Error occured while fetching data. Please try again.");
    }
  };

  const populateAllOHQ = async () => {
    try {
      const { data } = await axios.post(
        "/master/getAllOHQ",
        { itemCode: null, userId, orgId: null, itemDesc: null },
        apiHeader("POST", token)
      ); // sending itemCode 'null' gives all available data
      const { responseData } = data;
      const newArray = [];

      responseData?.forEach((item) => {
        item.qtyList.forEach((obj) => {
          const objFound = newArray.find(
            (tempItem) =>
              tempItem.locationId === obj.locationId &&
              tempItem.itemCode === item.itemCode
          );

          if (objFound) {
            const qtyListObj = {
              locatorId: obj.locatorId,
              quantity: obj.quantity,
              locatorDesc: obj.locatorDesc,
            };
            objFound.qtyList.push(qtyListObj);
          } else {
            const newItemObj = {
              itemCode: item.itemCode,
              itemName: item.itemName,
              locationId: obj.locationId,
              locationName: obj.locationName,
              uomDesc: item.uomDesc,
              qtyList: [
                {
                  locatorId: obj.locatorId,
                  quantity: obj.quantity,
                  locatorDesc: obj.locatorDesc,
                  totalValues: obj.totalValues,
                },
              ],
            };

            newArray.push(newItemObj);
          }
        });
      });
      setItemData([...newArray]);
      setFilteredData([...newArray]);

      // calculate total value
      let sum = 0;
      responseData?.forEach((item) => {
        item.qtyList.forEach((loc) => {
          sum = sum + loc.totalValues;
        });
      });

      setTotVal(convertToCurrency(sum));
    } catch (error) {
      message.error("Error occured while fetching data. Please try again.");
    }
  };

  useEffect(() => {
    if (orgId) {
      populateItemDataHq(orgId);
    } else if (organization === "headquarter") {
      populateAllOHQ();
    } else {
      populateItemData();
    }
  }, [orgId]);

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

  // Function to convert array of objects to CSV format
  const convertArrayToCSV = (items) => {
    if (!items || items.length <= 0) return null;
    const selectedLoc = ["Selected Locator", filters.locator || "NA"];
    const selectedUom = ["Selected UOM", filters.uom || "NA"];
    const selectedSubcategory = [
      "Selected Sub Category",
      filters.subCategory || "NA",
    ];
    const selectedItemName = ["Selected Item Name", filters.itemName || "NA"];

    const header = [
      "Item Code",
      "Item Description",
      "Location",
      "UOM Description",
      "Locator Description",
      "Quantity",
      "Total Value (in Rupees)",
    ];

    const rows = items.flatMap((item) =>
      item.qtyList.map((qty) => [
        item.itemCode,
        item.itemName,
        item.locationName,
        item.uomDesc,
        qty.locatorDesc,
        qty.quantity,
        qty.totalValues,
      ])
    );

    // Combine header and rows into CSV format
    const csvContent = [
      selectedLoc.join(","),
      selectedUom.join(","),
      selectedSubcategory.join(","),
      selectedItemName.join(","),
      header.join(","), // Join header with commas
      ...rows.map((row) => row.join(",")), // Join each row with commas
    ].join("\n"); // Join header and rows with new lines

    return csvContent;
  };
  const csvData = convertArrayToCSV(filteredData);
  const { organizationDetails } = useSelector((state) => state.auth);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const applyFilter = () => {
    let filtered = [...itemData]; // Start with all itemData

    // Apply filters
    if (filters.locator) {
      const tempData = filtered.map((record) => {
        return {
          ...record,
          qtyList: record.qtyList.filter(
            (subRecord) => subRecord.locatorDesc === filters.locator
          ),
        };
      });

      filtered = tempData.filter((record) => record.qtyList.length > 0);
    }

    if (filters.uom) {
      filtered = filtered.filter((item) => item.uomDesc === filters.uom);
    }

    if (filters.subCategory) {
      const tempData = filtered.map((record) => {
        return {
          ...record,
          qtyList: record.qtyList.filter(
            (subRecord) => subRecord.subcategoryDesc === filters.subCategory
          ),
        };
      });

      filtered = tempData.filter((record) => record.qtyList.length > 0);
    }

    if (filters.itemName) {
      filtered = filtered.filter((item) => item.itemName === filters.itemName);
    }

    // Update filteredData state with the filtered results
    setFilteredData(filtered);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <h1 style={{ textAlign: "center" }}>
        {" "}
        <strong>On Hand Quantity for Items</strong>
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(10rem, 1fr))",
          gap: "0 1rem",
          border: "1px solid #dcdcdc",
          background: "#8080800f",
          padding: "2rem 1rem",
          borderRadius: "5px",
        }}
      >
        <Select
          onChange={(value) => handleFilterChange("itemName", value[0])}
          placeholder="Select Item Name"
          showSearch
          mode="tags"
          optionFilterProp="children"
          filterOption={(input, option) =>
            option.children.toLowerCase().includes(input.toLowerCase())
          }
          filterSort={(optionA, optionB) =>
            optionA.children
              .toLowerCase()
              .localeCompare(optionB.children.toLowerCase())
          }
        >
          {itemNameOptionArray?.map((item) => (
            <Option key={item.key} value={item.value}>
              {item.desc}
            </Option>
          ))}
        </Select>

        <FormSelectItem
          formField="subCategory"
          onChange={handleFilterChange}
          optionArray={subCategoryOptionArray}
          placeholder="Select Sub-Category"
        />
        <FormSelectItem
          formField="locator"
          onChange={handleFilterChange}
          optionArray={locatorOptionArray}
          placeholder="Select Locator"
        />
        <FormSelectItem
          formField="uom"
          onChange={handleFilterChange}
          optionArray={uomOptionArray}
          placeholder="Select UOM"
        />

        <Button onClick={applyFilter} type="primary">
          Submit
        </Button>

        <Button onClick={() => window.location.reload()} type="primary" danger>
          Reset
        </Button>

        <div></div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <h2>
          <strong> Total value for all items: </strong> {totVal}{" "}
        </h2>
        {csvData ? (
          <CSVLink
            data={csvData}
            filename={`ohq_${organizationDetails?.organizationName}.csv`}
            style={{
              display: "flex",
              alignItems: "center",
              border: "1px solid",
              padding: "1rem",
            }}
            className="ant-btn ant-btn-primary"
          >
            Export To CSV
          </CSVLink>
        ) : (
          <Button type="primary" loading>
            Generating CSV Data
          </Button>
        )}
      </div>
      <Table dataSource={filteredData} columns={columns} />
    </div>
  );
};

export default Ohq;
