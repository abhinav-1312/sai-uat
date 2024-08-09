import React, { useCallback, useEffect, useState } from "react";
import { Form, Input, DatePicker, Select, Table, Button, message } from "antd";
import {
  trnSummaryColumn,
} from "./trnSummaryData";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { apiCall, apiHeader } from "../../utils/Functions";
import { useSelector } from "react-redux";

const { Option } = Select;
const dateFormat = "DD/MM/YYYY";

const TransactionSummary = ({orgId}) => {
  const txnName = [

    {
      text: "Return Note",
      value: "RN"
    },
    {
      text: "Issue Note",
      value: "ISN"
    },
    {
      text: "Outward Gate Pass",
      value: "OGP"
    },
    {
      text: "Inward Gate Pass",
      value: "IGP"
    },
    {
      text: "Material Inward Slip",
      value: "IR"
    },
    {
      text: "Inspection Note",
      value: "IRN"
    },
    {
      text: "Rejection Note",
      value: "REJ"
    },
    {
      text: "Acceptance Note",
      value: "ACT"
    },
      {
        text: "Goods Receive Note",
        value: "GRN"
      },
    ]
  const [processStageFilter, setProcessStageFilter] = useState([...txnName])
  const navigate = useNavigate();
  const {token} = useSelector(state => state.auth);
  const txnType = {
    RN: "Return Note",
    ISN: "Issue Note",
    OGP: "Outward Gate Pass",
    IGP: "Inward Gate Pass",
    GRN: "Goods Receieved Note",
    IR: "Material Inward Slip",
    IRN: "Inspection Note",
    REJ: "Rejection Note",
    ACT: "Acceptance Note",
  };

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
  };

  const handlePrintClick = (trnNo) => {
  };

  const trnSumColumn = trnSummaryColumn(handleViewClick, handlePrintClick, processStageFilter);

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

  const [filteredData, setFilteredData] = useState([]);

  const populateData = useCallback(async () => {
    try {
      const { responseData } = await apiCall('POST', '/txns/getTxnSummary', token, { startDate: null, endDate: null, itemCode: null, txnType: null, orgId: orgId ? orgId : null })
      setFilteredData([...responseData || []].reverse());
    } catch (error) {
      message.error("Error occured while fetching data. Please try again.");
      console.log("Populate data error.", error);
    }
  }, [orgId, token]);

  // const populateHqData = async (orgId) => {
  //   try {
  //     const { responseData } = apiCall('POST', '/txns/getTxnSummary', token, { startDate: null, endDate: null, itemCode: null, txnType: null, orgId })
  //     setFilteredData([...responseData || []].reverse());
  //   } catch (error) {
  //     message.error("Error occured while fetching data. Please try again.");
  //     console.log("Populate data error.", error);
  //   }
  // }

  useEffect(() => {
      populateData();
  }, [populateData]);

  const handleSearch = async () => {
    try {
      const formDataCopy = { ...formData };
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

  const handleTableChange = (_, filters) => {
    console.log("_: ", _)
    console.log("filters: ", filters)

    if(!filters['processType']){
      setProcessStageFilter([...txnName])
    }
    else{
      const tempFilter = []
      filters['processType'].forEach(filter => {
        if(filter === 'IRP'){
          if(!tempFilter.some(item => item.value === 'ISN'))
            tempFilter.push({text: 'Issue Note', value: 'ISN'})

          if(!tempFilter.some(item => item.value === 'OGP'))
            tempFilter.push({text: 'Outward Gate Pass', value: 'OGP'})

          if(!tempFilter.some(item => item.value === 'IGP'))
            tempFilter.push({text: 'Inward Gate Pass', value: 'IGP'})

          if(!tempFilter.some(item => item.value === 'RN'))
            tempFilter.push({text: 'Return Note', value: 'RN'})

          if(!tempFilter.some(item => item.value === 'GRN'))
            tempFilter.push({text: 'Goods Receive Note', value: 'GRN'})
        }
        else if(filter === "PO"){
          if(!tempFilter.some(item => item.value === 'IGP'))
            tempFilter.push({text: 'Inward Gate Pass', value: 'IGP'})

          if(!tempFilter.some(item => item.value === 'IR'))
            tempFilter.push({text: 'Material Inward Slip', value: 'IR'})

          if(!tempFilter.some(item => item.value === 'IRN'))
            tempFilter.push({text: 'Inspection Note', value: 'IRN'})

          if(!tempFilter.some(item => item.value === 'ACT'))
            tempFilter.push({text: 'Acceptance Note', value: 'ACT'})

          if(!tempFilter.some(item => item.value === 'GRN'))
            tempFilter.push({text: 'Goods Receive Note', value: 'GRN'})

          if(!tempFilter.some(item => item.value === 'REJ'))
            tempFilter.push({text: 'Rejection Note', value: 'REJ'})

          if(!tempFilter.some(item => item.value === 'OGP'))
            tempFilter.push({text: 'Outward Gate Pass', value: 'OGP'})
        }
        else if(filter === 'IOP'){
          if(!tempFilter.some(item => item.value === 'ISN'))
            tempFilter.push({text: 'Issue Note', value: 'ISN'})

          if(!tempFilter.some(item => item.value === 'OGP'))
            tempFilter.push({text: 'Outward Gate Pass', value: 'OGP'})
          
          if(!tempFilter.some(item => item.value === 'IGP'))
            tempFilter.push({text: 'Inward Gate Pass', value: 'IGP'})

          if(!tempFilter.some(item => item.value === 'IR'))
            tempFilter.push({text: 'Material Inward Slip', value: 'IR'})
          
          if(!tempFilter.some(item => item.value === 'IRN'))
            tempFilter.push({text: 'Inspection Note', value: 'IRN'})

          if(!tempFilter.some(item => item.value === 'ACT'))
            tempFilter.push({text: 'Acceptance Note', value: 'ACT'})
          
          if(!tempFilter.some(item => item.value === 'GRN'))
            tempFilter.push({text: 'Goods Receive Note', value: 'GRN'})
          
          if(!tempFilter.some(item => item.value === 'REJ'))
            tempFilter.push({text: 'Rejection Note', value: 'REJ'})
        }
      })
      setProcessStageFilter([...tempFilter])
    }
  }

  return (
    <>
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
          <div>
            <Form.Item label="Item Code">
              <Input
                value={formData.itemCode}
                onChange={(e) =>
                  handleFormValueChange("itemCode", e.target.value)
                }
              />
            </Form.Item>
          </div>

          <div>
            <Form.Item label="Transaction Type">
              <Select
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
        onChange={handleTableChange}
      />
    </>
  );
};

export default TransactionSummary;
