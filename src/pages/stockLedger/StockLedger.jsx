import { Button, DatePicker, Form, Select, Table } from "antd";
import React, { useEffect, useState } from "react";
import { apiHeader } from "../../utils/Functions";
import { ExportOutlined } from "@ant-design/icons";
import axios from "axios";
import dayjs from "dayjs";
import { CSVLink } from 'react-csv';

const { Option } = Select;
const dateFormat = "DD/MM/YYYY";


const StockLedger = () => {
  const token = localStorage.getItem("token");

  const [filterOption, setFilterOption] = useState({
    fromData: null,
    toDate: null,
    itemCode: null,
  });

  const [itemData, setItemData] = useState([]);
  const [ledger, setLedger] = useState(null);
  const [csvData, setCsvData] = useState(null)
  const [locator, setLocator] = useState([])
  const [location, setLocation] = useState([])

  const populateItemData = async () => {
    const { data } = await axios.get(
      "https://uat-sai-app.azurewebsites.net/sai-inv-mgmt/master/getItemMaster",
      apiHeader("GET", token)
    );
    const { responseData } = data;

    const modData = responseData.map((item) => {
      return {
        itemMasterCd: item.itemMasterCd,
        itemMasterDesc: item.itemMasterDesc,
      };
    });

    setItemData([...modData]);
  };

  const fetchLocatorLocationDtls = async () => {
    const locatorUrl =
      "https://uat-sai-app.azurewebsites.net/sai-inv-mgmt/master/getLocatorMaster";
    const locationUrl =
      "https://uat-sai-app.azurewebsites.net/sai-inv-mgmt/master/getLocationMaster";

    const [locatorData, locationData] = await Promise.all([
      axios.get(locatorUrl, apiHeader("GET", token)),
      axios.get(locationUrl, apiHeader("GET", token)),
    ]);

    console.log("Locator Data: ", locatorData.data.responseData);
    console.log("Location Data: ", locationData.data.responseData);

    const locatorObj = locatorData.data.responseData.reduce((acc, curr) => {
      acc[curr.id] = curr.locatorDesc;
      return acc;
    }, {});
    const locationObj = locationData.data.responseData.reduce((acc, curr) => {
      acc[curr.id] = curr.locationName;
      return acc;
    }, {});

    setLocator({...locatorObj})
    setLocation({...locationObj})
  };

  const columns = [
    {
      title: "Transaction ID",
      dataIndex: "processId",
    },
    {
      title: "Item Code",
      dataIndex: "itemMasterCd",
    },
    {
      title: "Item Description",
      dataIndex: "itemMasterDesc",
    },
    {
      title: "Post Quantity",
      dataIndex: "postQuantity",
    },
    {
      title: "Previous Quantity",
      dataIndex: "preQuantity",
    },
    {
      title: "Process Stage",
      dataIndex: "processStage",
    },
    {
      title: "Location Description",
      dataIndex: "locationId",
      render: (id) => location[id]
    },
    {
      title: "Locator Description",
      dataIndex: "locatorId",
      render: (id) => locator[id]
    },
  ];
  

  useEffect(() => {
    populateItemData();
    fetchLocatorLocationDtls();
  }, []);

  const handleFormValueChange = (fieldName, value) => {
    setFilterOption((prev) => {
      return {
        ...prev,
        [fieldName]: value,
      };
    });
  };

  const handleReset = () => {
    setFilterOption({
      fromDate: null,
      toDate: null,
      itemCode: null,
    });
    setLedger(null)
  };

  const handleExportClick = () => {
    // const csvContent = "data:text/csv;charset=utf-8," 
    //   + ledger.txns.map(row => Object.values(row).join(",")).join("\n");
    // setCsvData(encodeURI(csvContent));
    const csvContent = [ ['Opening Stock', ledger.initQuantity],
    ['Closing Stock', ledger.finalQuantity],
      ['Transaction ID', 'Item Code', 'Item Description', "Previous Quantity", "Post Quantity", "Process Stage", "Location Description", "Locator Description"], // Header row
      ...ledger.txns.map(item => [item.processId, item.itemMasterCd, item.itemMasterDesc, item.preQuantity, item.postQuantity, item.processStage, location[item.locationId], locator[item.locatorId]]) // Data rows
    ];

    setCsvData(csvContent)
  }

  const handleSearch = async () => {
    const url =
      "https://uat-sai-app.azurewebsites.net/sai-inv-mgmt/txns/getStockLedger";
    const { data } = await axios.post(
      url,
      filterOption,
      apiHeader("POST", token)
    );
    const { responseData } = data;
    console.log("resposnedaata: ", responseData);
    setLedger(responseData);
  };

  console.log(";edger: ", ledger)

  return (
    <>
      <h1>Stock Ledger</h1>

      <div
        style={{
          border: "1px solid #003566",
          padding: "1rem",
          borderRadius: "1%",
          marginTop: "1rem",
        }}
      >
        <Form
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(6, 1fr)",
            gap: "0rem 1rem",
          }}
        >
          <Form.Item label="Item Description" style={{ gridColumn: "span 2" }}>
            <Select
              value={filterOption.itemCode}
              onChange={(value) => handleFormValueChange("itemCode", value)}
              showSearch
          optionFilterProp="children"
          filterOption={(input, option) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
            >
              {itemData.map((item) => {
                return (
                  <Option key={item.itemMasterCd} value={item.itemMasterCd}>
                    {item.itemMasterDesc}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>

          <Form.Item label="From Date" name="fromDate">
            <DatePicker
              format={dateFormat}
              style={{ width: "100%" }}
              onChange={(date, dateString) =>
                handleFormValueChange("fromDate", dateString)
              }
            />
          </Form.Item>

          <Form.Item label="To Date" name="toDate">
            <DatePicker
              value={
                filterOption.toDate !== null
                  ? dayjs(filterOption.toDate, dateFormat)
                  : null
              }
              format={dateFormat}
              style={{ width: "100%" }}
              onChange={(date, dateString) =>
                handleFormValueChange("toDate", dateString)
              }
            />
          </Form.Item>

          <Button type="primary" onClick={() => handleSearch()}>
            Search
          </Button>
          <Button onClick={() => handleReset()}>Reset</Button>
        </Form>
      </div>
      {ledger && ledger.txns.length > 0 && (
        <div
          style={{
            border: "2px solid #003566",
            marginTop: "1rem",
            padding: "1rem",
            borderRadius: "5px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div
              style={{
                margin: "1rem 0",
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                border: "1px solid #003566",
              }}
            >
              <div
                style={{
                  padding: ".5rem",
                  backgroundColor: "#003566",
                }}
              >
                <h3 style={{ color: "white" }}>Opening Stock</h3>
              </div>

              <h3
                style={{
                  padding: ".5rem",
                  textAlign: "center",
                  borderBottom: "1px solid #003566",
                }}
              >
                {ledger.initQuantity}
              </h3>
              <div
                style={{
                  padding: ".5rem",
                  backgroundColor: "#003566",
                }}
              >
                <h3 style={{ color: "white" }}>Closing Stock</h3>
              </div>
              <h3 style={{ padding: ".5rem", textAlign: "center" }}>{ledger.finalQuantity}</h3>
            </div>

            <div>
              <Button
                type="primary"
                style={{
                  padding: "1rem 2rem",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "1rem",
                }}
                onClick={handleExportClick}
              >
                <span>Export to CSV </span>
                <span>
                  <ExportOutlined />
                </span>
              </Button>
              {csvData && <CSVLink data={csvData} filename={"table-data.csv"}>Download CSV</CSVLink>}
            </div>
          </div>

          <div>
            <Table dataSource={ledger?.txns} columns={columns} />
          </div>
        </div>
      )}
    </>
  );
};

export default StockLedger;
