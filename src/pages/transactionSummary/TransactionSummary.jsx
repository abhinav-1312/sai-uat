import React, { useCallback, useEffect, useState } from "react";
import { Form, Input, DatePicker, Select, Table, Button, message } from "antd";
import { trnSummaryColumn } from "./trnSummaryData";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { apiCall, apiHeader, generateCsvData } from "../../utils/Functions";
import { useSelector } from "react-redux";

import {
  iopIsnDataColumns,
  irpIopItemListColumns,
  irpIsnDataColumns,
} from "./detailData/IsnTable";
import { CSVLink } from "react-csv";
import {
  iopOgpDataColumns,
  irpOgpDataColumns,
  irpPoIopOgpItemListColumns,
  poOgpDataColumns,
} from "./detailData/OgpTable";
import {
  iopIgpDataColumns,
  irpIgpDataColumns,
  irpIgpItemListColumns,
  poIgpDataColumns,
  poIopIgpItemListColumns,
} from "./detailData/IgpTable";
import {
  irpPoIopRnDataColumns,
  irpPoIopRnItemListColumns,
} from "./detailData/ReturnTable";
import {
  iopGrnDataColumns,
  irpGrnDataColumns,
  irpIopGrnItemListColumns,
  poGrnDataColumns,
  poGrnItemListColumns,
} from "./detailData/GrnTable";
import {
  irpIopAcptDataColumns,
  irpPoIopAcptItemListColumns,
  poAcptDataColumns,
} from "./detailData/AcceptanceNoteTable";
import {
  iopRejDataColumns,
  poIopRejItemListColumns,
  poRejDataColumns,
} from "./detailData/RejNoteTable";
import {
  iopMisDataColumns,
  poIopMisItemListColumns,
  poMisDataColumns,
} from "./detailData/MisTable";
import {
  iopInspDataColumns,
  poInspDataColumns,
  poIopInspItemListColumns,
} from "./detailData/InspectionNoteTable";
import dayjs from "dayjs";
import { processStage } from "../../utils/KeyValueMapping";

const { Option } = Select;
const dateFormat = "DD/MM/YYYY";
const currentDate = dayjs();
const currenDateString = currentDate.format(dateFormat);
const oneWeekBefore = currentDate.subtract(7, "day"); // One week before
const oneWeekBeforeString = oneWeekBefore.format(dateFormat);

const TransactionSummary = ({ orgId }) => {
  const [selectedTxnType, setSelectedTxnType] = useState(null);
  const [selectedItemCode, setSelectedItemCode] = useState(null);
  const [form] = Form.useForm();
  const txnName = [
    {
      text: "Return Note",
      value: "RN",
    },
    {
      text: "Issue Note",
      value: "ISN",
    },
    {
      text: "Outward Gate Pass",
      value: "OGP",
    },
    {
      text: "Inward Gate Pass",
      value: "IGP",
    },
    {
      text: "Material Inward Slip",
      value: "IR",
    },
    {
      text: "Inspection Note",
      value: "IRN",
    },
    {
      text: "Rejection Note",
      value: "REJ",
    },
    {
      text: "Acceptance Note",
      value: "ACT",
    },
    {
      text: "Goods Receive Note",
      value: "GRN",
    },
  ];
  const [processStageFilter, setProcessStageFilter] = useState([...txnName]);
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);
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

  // const [formData, setFormData] = useState({
  //   endDate: currentDateString,
  //   startDate: dateStringWeekBefore,
  //   txnType: null,
  //   itemCode: null,
  // });

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
    if (orgId) {
      const trnOrgCombined = trnNo + "-" + orgId;
      arr.push(trnOrgCombined);
    } else {
      arr.push(trnNo);
    }
    for (const [key, value] of Object.entries(showTxn)) {
      if (value === true) {
        arr.push(key);
      }
    }
    const url = arr.join("_");
    if (orgId) {
      navigate(`/hqTxnSummary/${url}`, { state: {orgId, prpcessStage: selectedTxnType, processId: trnNo, itemCode: selectedItemCode } } );
    } else {
      navigate(`/trnsummary/${url}`, { state: {orgId, processStage: selectedTxnType, processId: trnNo, itemCode: selectedItemCode } });
    }
  }; 
  
  console.log('SELECTED TXN TPE: ', selectedItemCode)

  const handlePrintClick = (trnNo) => {};

  const trnSumColumn = trnSummaryColumn(
    handleViewClick,
    handlePrintClick,
    processStageFilter
  );

  // const handleFormValueChange = (field, value) => {
  //   setFormData((prevValues) => {
  //     return {
  //       ...prevValues,
  //       [field]: value,
  //     };
  //   });
  //   if (field === "txnType") {
  //     setShowTxn((prevState) => ({
  //       ...Object.keys(prevState).reduce((acc, key) => {
  //         acc[key] = key === value; // Set "field" key to true, rest to false
  //         return acc;
  //       }, {}),
  //     }));
  //   }
  // };

  const resetForm = () => {
    localStorage.removeItem("txnSummaryFilter");
    window.location.reload();
  };

  const [filteredData, setFilteredData] = useState([]);
  const [finalCsvData, setFinalCsvData] = useState([]);

  const populateData = useCallback(async (startDate=null, endDate=null, itemCode=null, txnType=null) => {
    console.log("POPULATE DATA");
    try {
      const { responseData } = await apiCall(
        "POST",
        "/txns/getTxnSummary",
        token,
        {
          startDate: startDate || oneWeekBeforeString,
          endDate: endDate || currenDateString,
          itemCode: itemCode,
          txnType: txnType,
          orgId: orgId ? orgId : null,
        }
      );
      setFilteredData([...(responseData || [])].reverse());
      const txnDtlsData = await Promise.all(
        responseData.map(async (record) => {
          const { responseData } = await apiCall(
            "POST",
            "/txns/getTxnDtls",
            token,
            { processId: Number(record.id), itemCode, processStage: txnType, orgId }
          );
          return responseData;
        })
      );

      generateCsvForTxnDtls(txnDtlsData);
    } catch (error) {
      message.error("Error occured while fetching data. Please try again.");
      console.log("Error: ", error);
    }
  }, [orgId, token]);

  const handleSearch = async (values) => {

    try {
      const startDate = dayjs(values.startDate).format("DD/MM/YYYY");
      const endDate = dayjs(values.endDate).format("DD/MM/YYYY");
      const { txnType, itemCode } = values;

      setSelectedTxnType(txnType);
      setSelectedItemCode(itemCode);
      
      // Build the request body, including orgId if it exists.
      const requestBody = {
        startDate,
        endDate,
        txnType,
        itemCode,
        ...(orgId && { orgId })
      };
      
      // Make the summary API call
      const { data } = await axios.post(
        "/txns/getTxnSummary",
        requestBody,
        apiHeader("POST", token)
      );
      
      const { responseData } = data;
      const summaryData = responseData || [];
      // Reverse the data and update state
      setFilteredData([...summaryData].reverse());
      
      // Get transaction details for each record
      const txnDtlsData = await Promise.all(
        summaryData.map(async (record) => {
          const { responseData: txnDetails } = await apiCall(
            "POST",
            "/txns/getTxnDtls",
            token,
            { processId: Number(record.id), processStage: txnType, itemCode, orgId }
          );
          return txnDetails;
        })
      );
      
      // Generate CSV from the transaction details data
      generateCsvForTxnDtls(txnDtlsData);

      localStorage.setItem("txnSummaryFilter", JSON.stringify({itemCode, txnType, startDate, endDate}));
    } catch (error) {
      message.error("Some error occurred. Please try again.");
      console.log("Error: ", error);
    }
  };
  const generateCsvForTxnDtls = (txnDtlsData) => {
    let finalCsvData = [];
    txnDtlsData.forEach((record) => {
      Object.keys(record).forEach((key) => {
        if (key === "isndata" && record[key]) {
          if (
            record[key]?.data?.type === "IRP" ||
            record[key]?.data?.type === "NIRP"
          ) {
            const csvData = generateCsvData(
              "Issue Note",
              irpIsnDataColumns,
              record[key]?.data,
              irpIopItemListColumns,
              record[key]?.itemList
            );
            finalCsvData = [...finalCsvData, ...csvData];
          } else {
            const csvData = generateCsvData(
              "Issue Note",
              iopIsnDataColumns,
              record[key]?.data,
              irpIopItemListColumns,
              record[key].itemList
            );
            finalCsvData = [...finalCsvData, ...csvData];
          }
        } else if (key === "ogpdata" && record[key] && record[key]?.data) {
          if (
            record[key]?.data?.type === "IRP" ||
            record[key].data.type === "NIRP"
          ) {
            const csvData = generateCsvData(
              "Outward Gate Pass",
              irpOgpDataColumns,
              record[key].data,
              irpPoIopOgpItemListColumns,
              record[key].itemList
            );
            finalCsvData = [...finalCsvData, ...csvData];
          } else if (record[key].data.type === "PO") {
            const csvData = generateCsvData(
              "Outward gate Pass",
              poOgpDataColumns,
              record[key].data,
              irpPoIopOgpItemListColumns,
              record[key].itemList
            );
            finalCsvData = [...finalCsvData, ...csvData];
          } else if (record[key].data.type === "IOP") {
            const csvData = generateCsvData(
              "Outward gate Pass",
              iopOgpDataColumns,
              record[key].data,
              irpPoIopOgpItemListColumns,
              record[key].itemList
            );
            finalCsvData = [...finalCsvData, ...csvData];
          }
        } else if (key === "igpdata" && record[key] && record[key]?.data) {
          if (
            record[key].data.type === "IRP" ||
            record[key].data.type === "NIRP"
          ) {
            const csvData = generateCsvData(
              "Inward Gate Pass",
              irpIgpDataColumns,
              record[key].data,
              irpIgpItemListColumns,
              record[key].itemList
            );
            finalCsvData = [...finalCsvData, ...csvData];
          } else if (record[key].data.type === "PO") {
            const csvData = generateCsvData(
              "Inward Gate Pass",
              poIgpDataColumns,
              record[key].data,
              poIopIgpItemListColumns,
              record[key].itemList
            );
            finalCsvData = [...finalCsvData, ...csvData];
          } else if (record[key].data.type === "IOP") {
            const csvData = generateCsvData(
              "Inward Gate Pass",
              iopIgpDataColumns,
              record[key].data,
              poIopIgpItemListColumns,
              record[key].itemList
            );
            finalCsvData = [...finalCsvData, ...csvData];
          }
        } else if (key === "rndata" && record[key] && record[key]?.data) {
          const csvData = generateCsvData(
            "Return Note",
            irpPoIopRnDataColumns,
            record[key].data,
            irpPoIopRnItemListColumns,
            record[key].itemList
          );
          finalCsvData = [...finalCsvData, ...csvData];
        } else if (key === "grndata" && record[key] && record[key]?.data) {
          if (
            record[key].data.type === "IRP" ||
            record[key].data.type === "NIRP"
          ) {
            const csvData = generateCsvData(
              "Goods Receive Note",
              irpGrnDataColumns,
              record[key].data,
              irpIopGrnItemListColumns,
              record[key].itemList
            );
            finalCsvData = [...finalCsvData, ...csvData];
          } else if (record[key].data.type === "PO") {
            const csvData = generateCsvData(
              "Goods Receive Note",
              poGrnDataColumns,
              record[key].data,
              poGrnItemListColumns,
              record[key].itemList
            );
            finalCsvData = [...finalCsvData, ...csvData];
          } else if (record[key].data.type === "IOP") {
            const csvData = generateCsvData(
              "Goods Receive Note",
              iopGrnDataColumns,
              record[key].data,
              irpIopGrnItemListColumns,
              record[key].itemList
            );
            finalCsvData = [...finalCsvData, ...csvData];
          }
        } else if (key === "acceptData" && record[key] && record[key]?.data) {
          if (
            record[key].data.type === "IRP" ||
            record[key].data.type === "NIRP"
          ) {
            const csvData = generateCsvData(
              "Acceptance Note",
              irpIopAcptDataColumns,
              record[key].data,
              irpPoIopAcptItemListColumns,
              record[key].itemList
            );
            finalCsvData = [...finalCsvData, ...csvData];
          } else if (record[key].data.type === "PO") {
            const csvData = generateCsvData(
              "Acceptance Note",
              poAcptDataColumns,
              record[key].data,
              irpPoIopAcptItemListColumns,
              record[key].itemList
            );
            finalCsvData = [...finalCsvData, ...csvData];
          } else if (record[key]?.data?.type === "IOP") {
            const csvData = generateCsvData(
              "Acceptance Note",
              irpIopAcptDataColumns,
              record[key].data,
              irpPoIopAcptItemListColumns,
              record[key].itemList
            );
            finalCsvData = [...finalCsvData, ...csvData];
          }
        } else if (key === "rejectData" && record[key] && record[key]?.data) {
          if (record[key]?.data?.type === "PO") {
            const csvData = generateCsvData(
              "Rejection Note",
              poRejDataColumns,
              record[key].data,
              poIopRejItemListColumns,
              record[key].itemList
            );
            finalCsvData = [...finalCsvData, ...csvData];
          } else if (record[key]?.data?.type === "IOP") {
            const csvData = generateCsvData(
              "Rejection Note",
              iopRejDataColumns,
              record[key].data,
              poIopRejItemListColumns,
              record[key].itemList
            );
            finalCsvData = [...finalCsvData, ...csvData];
          }
        } else if (key === "inspectionRptData" && record[key] && record[key]?.data) {
          if (record[key].data.type === "PO") {
            const csvData = generateCsvData(
              "Material Inward Slip",
              poMisDataColumns,
              record[key].data,
              poIopMisItemListColumns,
              record[key].itemList
            );
            finalCsvData = [...finalCsvData, ...csvData];
          } else if (record[key].data.type === "IOP") {
            const csvData = generateCsvData(
              "Material Inward Slip",
              iopMisDataColumns,
              record[key].data,
              poIopMisItemListColumns,
              record[key].itemList
            );
            finalCsvData = [...finalCsvData, ...csvData];
          }
        } else if (key === "inspectionNewRptData" && record[key] && record[key]?.data) {
          if (record[key].data.type === "PO") {
            const csvData = generateCsvData(
              "Inspection Note",
              poInspDataColumns,
              record[key].data,
              poIopInspItemListColumns,
              record[key].itemList
            );
            finalCsvData = [...finalCsvData, ...csvData];
          } else if (record[key].data.type === "IOP") {
            const csvData = generateCsvData(
              "Inspection Note",
              iopInspDataColumns,
              record[key].data,
              poIopInspItemListColumns,
              record[key].itemList
            );
            finalCsvData = [...finalCsvData, ...csvData];
          }
        }
      });
    });

    setFinalCsvData(finalCsvData);
  };

  const handleTableChange = (_, filters) => {
    if (!filters["processType"]) {
      setProcessStageFilter([...txnName]);
    } else {
      const tempFilter = [];
      filters["processType"].forEach((filter) => {
        if (filter === "IRP") {
          if (!tempFilter.some((item) => item.value === "ISN"))
            tempFilter.push({ text: "Issue Note", value: "ISN" });

          if (!tempFilter.some((item) => item.value === "OGP"))
            tempFilter.push({ text: "Outward Gate Pass", value: "OGP" });

          if (!tempFilter.some((item) => item.value === "IGP"))
            tempFilter.push({ text: "Inward Gate Pass", value: "IGP" });

          if (!tempFilter.some((item) => item.value === "RN"))
            tempFilter.push({ text: "Return Note", value: "RN" });

          if (!tempFilter.some((item) => item.value === "GRN"))
            tempFilter.push({ text: "Goods Receive Note", value: "GRN" });
        } else if (filter === "PO") {
          if (!tempFilter.some((item) => item.value === "IGP"))
            tempFilter.push({ text: "Inward Gate Pass", value: "IGP" });

          if (!tempFilter.some((item) => item.value === "IR"))
            tempFilter.push({ text: "Material Inward Slip", value: "IR" });

          if (!tempFilter.some((item) => item.value === "IRN"))
            tempFilter.push({ text: "Inspection Note", value: "IRN" });

          if (!tempFilter.some((item) => item.value === "ACT"))
            tempFilter.push({ text: "Acceptance Note", value: "ACT" });

          if (!tempFilter.some((item) => item.value === "GRN"))
            tempFilter.push({ text: "Goods Receive Note", value: "GRN" });

          if (!tempFilter.some((item) => item.value === "REJ"))
            tempFilter.push({ text: "Rejection Note", value: "REJ" });

          if (!tempFilter.some((item) => item.value === "OGP"))
            tempFilter.push({ text: "Outward Gate Pass", value: "OGP" });
        } else if (filter === "IOP") {
          if (!tempFilter.some((item) => item.value === "ISN"))
            tempFilter.push({ text: "Issue Note", value: "ISN" });

          if (!tempFilter.some((item) => item.value === "OGP"))
            tempFilter.push({ text: "Outward Gate Pass", value: "OGP" });

          if (!tempFilter.some((item) => item.value === "IGP"))
            tempFilter.push({ text: "Inward Gate Pass", value: "IGP" });

          if (!tempFilter.some((item) => item.value === "IR"))
            tempFilter.push({ text: "Material Inward Slip", value: "IR" });

          if (!tempFilter.some((item) => item.value === "IRN"))
            tempFilter.push({ text: "Inspection Note", value: "IRN" });

          if (!tempFilter.some((item) => item.value === "ACT"))
            tempFilter.push({ text: "Acceptance Note", value: "ACT" });

          if (!tempFilter.some((item) => item.value === "GRN"))
            tempFilter.push({ text: "Goods Receive Note", value: "GRN" });

          if (!tempFilter.some((item) => item.value === "REJ"))
            tempFilter.push({ text: "Rejection Note", value: "REJ" });
        }
      });
      setProcessStageFilter([...tempFilter]);
    }
  };
  const { organizationDetails } = useSelector((state) => state.auth);

useEffect(() => {
  const filter = JSON.parse(localStorage.getItem("txnSummaryFilter"));
  const startDate = filter?.startDate
  const endDate = filter?.endDate
  console.log("Filter: ", filter);
  if (filter) {
    // Convert string dates to Day.js objects if they exist
    if (filter.startDate) {
      filter.startDate = dayjs(filter.startDate, "DD/MM/YYYY");
    }
    else{
      filter.startDate = oneWeekBefore;
    }
    if (filter.endDate) {
      filter.endDate = dayjs(filter.endDate, "DD/MM/YYYY");
    }
    else{
      filter.endDate = currentDate;
    }
  }
  populateData(startDate, endDate, filter?.itemCode, filter?.txnType);
  form.setFieldsValue(filter);
  setSelectedItemCode(filter?.itemCode);
  setSelectedTxnType(filter?.txnType);
  console.log("SET CALLED");
}, [form, populateData]);

  return (
    <>
      <div style={{ textAlign: "center", position: "relative" }}>
        <h1>Transaction Summary</h1>

        {finalCsvData.length > 0 ? (
          <CSVLink
            data={finalCsvData}
            filename={`transaction_detail_${organizationDetails?.organizationName}.csv`}
            style={{
              marginBottom: 16,
              border: "1px solid",
              width: "max-content",
              padding: "1rem",
              position: "absolute",
              right: 0,
              top: "-0.5rem",
            }}
            className="ant-btn ant-btn-primary"
          >
            Export to csv
          </CSVLink>
        ) : (
          <Button
            type="primary"
            loading
            style={{ top: "-0.5rem", right: "0", position: "absolute" }}
          >
            Generating CSV Data
          </Button>
        )}
      </div>
      <div
        style={{
          margin: "1rem",
          border: "1px solid rgb(87, 202, 195)",
          padding: "1rem",
          borderRadius: "1%",
        }}
      >
        <Form
        form={form}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "1rem",
          }}
          layout="vertical"
          onFinish={handleSearch}
          initialValues={{
            startDate: oneWeekBefore,
            endDate: currentDate,
            itemCode: null,
            txnType: null,
          }}
        >
          <Form.Item label="Start Date" name="startDate">
            <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" />
          </Form.Item>

          <Form.Item label="End Date" name="endDate">
            <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" />
          </Form.Item>

          <Form.Item label="Item Code" name="itemCode">
            <Input placeholder="Enter item code" />
          </Form.Item>

          <Form.Item label="Transaction Type" name="txnType">
            <Select placeholder="Select an option">
              {Object.entries(txnType).map(([key, value]) => (
                <Option key={key} value={key}>
                  {value}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" style={{width: "100%"}}>
              Submit
            </Button>
          </Form.Item>

          <Form.Item>
            <Button htmlType="button" onClick={resetForm} style={{width: "100%"}}>
              Reset
            </Button>
          </Form.Item>
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
