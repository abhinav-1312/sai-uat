import React, { useEffect, useState } from "react";
import { Button, Input, message, Table } from "antd";
import axios from "axios";
import {
  apiHeader,
  convertToCurrency,
  handleSearch,
  renderLocatorOHQ,
} from "../../utils/Functions";
import { useSelector } from "react-redux";
import FormSelectItem from "../../components/FormSelectItem";
import { CSVLink } from "react-csv";

const Ohq = ({ orgId, organization }) => {
  const [searchKeyword, setSearchKeyword] = useState(null)
  const [selectedLocator, setSelectedLocator] = useState(null)
  const [itemData, setItemData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [totVal, setTotVal] = useState(0);
  const { token, userCd: userId } = useSelector((state) => state.auth);
  const { data: locatorMaster } = useSelector((state) => state.locators);

  // const locatorOptionArray = [ {value: "All Locators", desc: "All Locators"}, ...locatorMaster?.map(locator => {
  let locatorOptionArray = locatorMaster?.map((locator) => {
    return {
      value: locator.locatorDesc,
      desc: locator.locatorDesc,
    };
  });

  // locatorOptionArray = [{value: "All Locators", desc: "All Locators"}, ...locatorOptionArray]

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

      // calculate total value
      let sum = 0;
      responseData?.forEach((item) => {
        item.qtyList.forEach((loc) => {
          sum = sum + loc.totalValues;
        });
      });

      setTotVal(convertToCurrency(sum));
    } catch (error) {
      console.log("Error", error);
      message.error("Error occured while fetching data. Please try again.");
    }
  };

  const populateItemDataHq = async (orgId) => {
    try {
      const { data } = await axios.post(
        "/master/getOHQ",
        { itemCode: null, userId, orgId },
        apiHeader("POST", token)
      ); // sending itemCode 'null' gives all available data
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

      // const modData = []
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

  const handleLocatorFilterChange = (_, value) => {
    setSelectedLocator(value)
    if (value === "All Locators") {
      // setFilteredData([...itemData])
      return;
    }
    const tempData = filteredData.map((record) => {
      return {
        ...record,
        qtyList: record.qtyList.filter(
          (subRecord) => subRecord.locatorDesc === value
        ),
      };
    });

    setFilteredData(tempData.filter((record) => record.qtyList.length > 0));
  };

  console.log("Fitlerdata: ", filteredData);

  // Function to convert array of objects to CSV format
  const convertArrayToCSV = (items) => {
    if (!items || items.length <= 0) return null;
    const searchKeyWord = ["Search Keyword", "N/A"]
    const selectedLoc = ["Selected Locator", "N/A"]
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
      searchKeyWord.join(","),
      selectedLoc.join(","),
      header.join(","), // Join header with commas
      ...rows.map((row) => row.join(",")), // Join each row with commas
    ].join("\n"); // Join header and rows with new lines

    return csvContent;
  }
  const csvData = convertArrayToCSV(filteredData);
  const { organizationDetails } = useSelector((state) => state.auth);

  return (
    <>
      <h1 style={{ textAlign: "center" }}> On Hand Quantity for Items </h1>

      <div
        style={{
          display: "flex",
          // gridTemplateColumns: "auto auto",
          alignItems: "center",
          justifyContent: "space-between"
        }}
      >
          <Input.Search
            placeholder="Search item"
            allowClear
            enterButton="Search"
            size="medium"
            onSearch={(e) =>
              handleSearch(e.target?.value || null, itemData, setFilteredData)
            }
            onChange={(e) => {
              setSearchKeyword(e.target?.value || null)
              return handleSearch(e.target?.value || null, itemData, setFilteredData)
            }
            }
            style={{ width: "30%", margin: "1rem 0" }}
          />

          <FormSelectItem
            style={{ width: "30%" }}
            onChange={handleLocatorFilterChange}
            optionArray={locatorOptionArray}
            placeholder="Select Locator"
          />

          <Button
            style={{ width: "max-content" }}
            onClick={() => window.location.reload()}
            type="primary"
            danger
          >
            Reset
          </Button>

          {csvData ? (
            <CSVLink
              data={csvData}
              filename={`ohq_${organizationDetails?.organizationName}.csv`}
              style={{
                display: "flex",
                alignItems: "center"
              }}
              className="ant-btn css-dev-only-do-not-override-1r287do ant-btn-primary ant-btn"
            >
              Export To CSV
            </CSVLink>
          ) : (
            <Button
              type="primary"
              loading
            >
              Generating CSV Data
            </Button>
          )}
        <div></div>
      </div>

      <div
        style={{
          textAlign: "right",
          margin: "1rem 0"
        }}
      >

        <div style={{}}>
          <h2> <strong>  Total value for all items: </strong> {totVal} </h2>
        </div>
      </div>
      <Table dataSource={filteredData} columns={columns} />
    </>
  );
};

export default Ohq;
