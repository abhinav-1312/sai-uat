import React, { useEffect, useState } from "react";
import { Form, Input, DatePicker, Select, Table, Button, message } from "antd";
import {
  processTypeList,
  trnTypeList,
  trnSummaryColumn,
} from "./trnSummaryData";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { apiHeader } from "../../utils/Functions";

const { Option } = Select;
const dateFormat = "DD/MM/YYYY";

const TransactionSummary = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const txnType = {
    RN: "Return Note",
    ISN: "Issue Note",
    OGP: "Outward Gate Pass",
    IGP: "Inward Gate Pass",
    GRN: "Goods Receieved Note",
    IR: "Inspection Report",
    IRN: "Inspection Report New",
    REJ: "Rejection Note",
    ACT: "Acceptance Note",
  };
  const [writingItemCd, setWritingItemCd] = useState(true);
  const [writingTxnType, setWritingTxnType] = useState(true);

  const [formData, setFormData] = useState({
    startDate: null,
    endDate: null,
    txnType: null,
    itemCode: null,
  });

  const [showTxn, setShowTxn] = useState({
    RN: true,
    ISN: true,
    OGP: true,
    IGP: true,
    GRN: true,
    IR: true,
    IRN: true,
    REJ: true,
    ACT: true,
  });

  const handleViewClick = (trnNo) => {
    const arr = [];
    arr.push(trnNo);
    for (const [key, value] of Object.entries(showTxn)) {
      if (value === true) {
        arr.push(key);
      }
    }
    const url = arr.join("_");
    // console.log("URL: ", url)
    navigate(`/trnsummary/${url}`);
  };

  const handlePrintClick = (trnNo) => {
    console.log("View button called: ", trnNo);
  };

  const trnSumColumn = trnSummaryColumn(handleViewClick, handlePrintClick);

  const handleFormValueChange = (field, value) => {
    // if(field === 'transactionType' || field === "processType"){
    //   setFormData(prevValues => {
    //     return {
    //       ...prevValues,
    //       [field]: value.value
    //     }
    //   })
    //   return
    // }
    setFormData((prevValues) => {
      return {
        ...prevValues,
        [field]: value,
      };
    });
    if (field === "txnType") {
      setShowTxn((prevState) => ({
        ...Object.keys(prevState).reduce((acc, key) => {
          acc[key] = key === value; // Set "field" key to true, rest to false
          return acc;
        }, {}),
      }));
    }
  };

  console.log("Show txn: ", showTxn);

  const [itemData, setItemData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  const populateData = async () => {
    try {
      const { data } = await axios.post(
        "https://uat-sai-app.azurewebsites.net/sai-inv-mgmt/txns/getTxnSummary",
        { startDate: null, endDate: null, itemCode: null, txnType: null },
        apiHeader("POST", token)
      );
      const { responseData } = data;
      setFilteredData([...responseData]);
    } catch (error) {
      message.error("Error occured while fetching data. Please try again.");
      console.log("Populate data error.", error);
    }
  };

  useEffect(() => {
    populateData();
  }, []);

  const handleSearch = async () => {
    try {
      const formDataCopy = { ...formData };
      if (writingItemCd) {
        delete formDataCopy.txnType;
      }
      if (writingTxnType) {
        delete formDataCopy.itemCode;
      }
      console.log("Form data copy: ", formDataCopy);

      const { data } = await axios.post(
        "https://uat-sai-app.azurewebsites.net/sai-inv-mgmt/txns/getTxnSummary",
        formDataCopy,
        apiHeader("POST", token)
      );
      const { responseData } = data;
      console.log("resposnedata: ", responseData);
      setFilteredData([...responseData]);
    } catch (error) {
      message.error("Some error occured. Please try again.");
      console.log("Some error orrcured.", error);
    }
  };

  const handleReset = () => {
    setFormData({
      itemCode: null,
      startDate: null,
      endDate: null,
      txnType: null,
    });
    setShowTxn((prevState) => ({
      ...Object.keys(prevState).reduce((acc, key) => {
        acc[key] = true; // Set "field" key to true, rest to false
        return acc;
      }, {}),
    }));
  };

  const handleTxnTypeClick = () => {
    setFormData((prevValues) => {
      return {
        ...prevValues,
        itemCode: null,
      };
    });
    setWritingItemCd(false);
    setWritingTxnType(true);
  };
  const handleItemCdClick = () => {
    setFormData((prevValues) => {
      return {
        ...prevValues,
        txnType: null,
      };
    });
    setWritingItemCd(true);
    setWritingTxnType(false);
    setShowTxn((prevState) => ({
      ...Object.keys(prevState).reduce((acc, key) => {
        acc[key] = true; // Set "field" key to true, rest to false
        return acc;
      }, {}),
    }));
  };

  return (
    <>
      {/* <Button type="primary"> Button primary</Button>
    <Button type="success" style={{backgroundColor: "#3fb950", border: "#3fb950", color: "#ffffff"}}> Button primary</Button> */}
      <h1 style={{ textAlign: "center" }}>Transaction Summary</h1>
      <div
        style={{
          margin: "1rem",
          border: "1px solid rgb(87, 202, 195)",
          padding: "1rem",
          borderRadius: "1%",
        }}
      >
        <Form
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "1rem",
          }}
        >
          <div onClick={() => handleItemCdClick()}>
            <Form.Item label="Item Code" name="itemCode">
              <Input
                value={formData.itemCode}
                onChange={(e) =>
                  handleFormValueChange("itemCode", e.target.value)
                }
                disabled={!writingItemCd}
              />
            </Form.Item>
          </div>

          <div onClick={() => handleTxnTypeClick()}>
            <Form.Item label="Transaction Type">
              <Select
                disabled={!writingTxnType}
                value={formData.txnType}
                onChange={(value) => handleFormValueChange("txnType", value)}
              >
                {Object.entries(txnType).map(([key, value]) => (
                  <Option key={key} value={key}>
                    {value}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </div>

          <Form.Item label="From Date" name="startDate">
            <DatePicker
              format={dateFormat}
              style={{ width: "100%" }}
              onChange={(date, dateString) =>
                handleFormValueChange("startDate", dateString)
              }
            />
          </Form.Item>

          <Form.Item label="To Date" name="endDate">
            <DatePicker
              format={dateFormat}
              style={{ width: "100%" }}
              onChange={(date, dateString) =>
                handleFormValueChange("endDate", dateString)
              }
            />
          </Form.Item>
          <Button type="primary" onClick={() => handleSearch()}>
            Search
          </Button>
          <Button onClick={() => handleReset()}>Reset</Button>
        </Form>
      </div>

      <Table
        dataSource={filteredData}
        columns={trnSumColumn}
        scroll={{ x: "max-content" }}
      />
    </>
  );
};

export default TransactionSummary;
