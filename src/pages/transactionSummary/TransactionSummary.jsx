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
import { useSelector } from "react-redux";

const { Option } = Select;
const dateFormat = "DD/MM/YYYY";

const TransactionSummary = ({orgId}) => {
  const navigate = useNavigate();
  const {token} = useSelector(state => state.auth);
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
    if(orgId){
      const trnOrgCombined = trnNo + "-" + orgId
      arr.push(trnOrgCombined)
    }
    else{
      arr.push(trnNo);
    }
    for (const [key, value] of Object.entries(showTxn)) {
      if (value === true) {
        arr.push(key);
      }
    }
    const url = arr.join("_");
    if(orgId){
      navigate(`/hqTxnSummary/${url}`);
    }
    else{
      navigate(`/trnsummary/${url}`);
    }
    // console.log("URL: ", url)
  };

  const handlePrintClick = (trnNo) => {
  };

  const trnSumColumn = trnSummaryColumn(handleViewClick, handlePrintClick);

  const handleFormValueChange = (field, value) => {
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


  const [itemData, setItemData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  const populateData = async () => {
    try {
      const { data } = await axios.post(
        "/txns/getTxnSummary",
        { startDate: null, endDate: null, itemCode: null, txnType: null },
        apiHeader("POST", token)
      );
      const { responseData } = data;
      setFilteredData([...responseData || []].reverse());
    } catch (error) {
      message.error("Error occured while fetching data. Please try again.");
      console.log("Populate data error.", error);
    }
  };

  const populateHqData = async (orgId) => {
    try {
      const { data } = await axios.post(
        "/txns/getTxnSummary",
        { startDate: null, endDate: null, itemCode: null, txnType: null, orgId },
        apiHeader("POST", token)
      );
      const { responseData } = data;
      setFilteredData([...responseData || []].reverse());
    } catch (error) {
      message.error("Error occured while fetching data. Please try again.");
      console.log("Populate data error.", error);
    }
  }

  useEffect(() => {
    console.log("Useffect called txn summary")
    if(orgId){
      populateHqData(orgId)
    }
    else{
      populateData();
    }
  }, [orgId]);

  const handleSearch = async () => {
    try {
      const formDataCopy = { ...formData };
      if (writingItemCd) {
        delete formDataCopy.txnType;
      }
      if (writingTxnType) {
        delete formDataCopy.itemCode;
      }
      if(orgId){
        const { data } = await axios.post(
          "/txns/getTxnSummary",
          {...formDataCopy, orgId},
          apiHeader("POST", token)
        );
        const { responseData } = data;
        setFilteredData([...responseData || []].reverse());
      }
      else{
        const { data } = await axios.post(
          "/txns/getTxnSummary",
          formDataCopy,
          apiHeader("POST", token)
        );
        const { responseData } = data;
        setFilteredData([...responseData || []].reverse());
      }
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

    window.location.reload()
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
            <Form.Item label="Item Code">
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

          <Form.Item label="From Date">
            <DatePicker
              format={dateFormat}
              style={{ width: "100%" }}
              onChange={(date, dateString) =>
                handleFormValueChange("startDate", dateString)
              }
            />
          </Form.Item>

          <Form.Item label="To Date">
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
