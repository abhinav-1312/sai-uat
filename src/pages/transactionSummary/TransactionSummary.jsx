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

const { Option } = Select;
const dateFormat = "DD/MM/YYYY";

const TransactionSummary = ({ orgId }) => {
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
      navigate(`/hqTxnSummary/${url}`);
    } else {
      navigate(`/trnsummary/${url}`);
    }
  };

  const handlePrintClick = (trnNo) => {};

  const trnSumColumn = trnSummaryColumn(
    handleViewClick,
    handlePrintClick,
    processStageFilter
  );

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
  const [finalCsvData, setFinalCsvData] = useState([]);

  const populateData = useCallback(async () => {
    try {
      const { responseData } = await apiCall(
        "POST",
        "/txns/getTxnSummary",
        token,
        {
          startDate: null,
          endDate: null,
          itemCode: null,
          txnType: null,
          orgId: orgId ? orgId : null,
        }
      );
      setFilteredData([...(responseData || [])].reverse());
      // const txnDtlsData = await Promise.all(
      //   responseData.map(async (record) => {
      //     const { responseData } = await apiCall(
      //       "POST",
      //       "/txns/getTxnDtls",
      //       token,
      //       { processId: Number(record.id) }
      //     );
      //     return responseData;
      //   })
      // );

      // generateCsvForTxnDtls(txnDtlsData);
    } catch (error) {
      message.error("Error occured while fetching data. Please try again.");
      console.log("error: ", error)
    }
  }, [orgId, token]);

  useEffect(() => {
    populateData();
  }, [populateData]);

  const handleSearch = async () => {
    try {
      const formDataCopy = { ...formData };
      if (orgId) {
        const { data } = await axios.post(
          "/txns/getTxnSummary",
          { ...formDataCopy, orgId },
          apiHeader("POST", token)
        );
        const { responseData } = data;
        setFilteredData([...(responseData || [])].reverse());
        const txnDtlsData = await Promise.all(
          responseData.map(async (record) => {
            const { responseData } = await apiCall(
              "POST",
              "/txns/getTxnDtls",
              token,
              { processId: Number(record.id) }
            );
            return responseData;
          })
        );
  
        generateCsvForTxnDtls(txnDtlsData);
      } else {
        const { data } = await axios.post(
          "/txns/getTxnSummary",
          formDataCopy,
          apiHeader("POST", token)
        );
        const { responseData } = data;
        setFilteredData([...(responseData || [])].reverse());
        // const txnDtlsData = await Promise.all(
        //   responseData.map(async (record) => {
        //     const { responseData } = await apiCall(
        //       "POST",
        //       "/txns/getTxnDtls",
        //       token,
        //       { processId: Number(record.id) }
        //     );
        //     return responseData;
        //   })
        // );
  
        // generateCsvForTxnDtls(txnDtlsData);
      }
    } catch (error) {
      message.error("Some error occured. Please try again.");
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

    window.location.reload();
  };

  const generateCsvForTxnDtls = (txnDtlsData) => {
    let finalCsvData = [];
    txnDtlsData.forEach((record) => {
      Object.keys(record).forEach((key) => {
        if (key === "isndata" && record[key].data) {
          if (
            record[key].data.type === "IRP" ||
            record[key].data.type === "NIRP"
          ) {
            const csvData = generateCsvData(
              "Issue Note",
              irpIsnDataColumns,
              record[key].data,
              irpIopItemListColumns,
              record[key].itemList
            );
            finalCsvData = [...finalCsvData, ...csvData];
          } else {
            const csvData = generateCsvData(
              "Issue Note",
              iopIsnDataColumns,
              record[key].data,
              irpIopItemListColumns,
              record[key].itemList
            );
            finalCsvData = [...finalCsvData, ...csvData];
          }
        } else if (key === "ogpdata" && record[key].data) {
          if (
            record[key].data.type === "IRP" ||
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
        } else if (key === "igpdata" && record[key].data) {
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
        } else if (key === "rndata" && record[key].data) {
          const csvData = generateCsvData(
            "Return Note",
            irpPoIopRnDataColumns,
            record[key].data,
            irpPoIopRnItemListColumns,
            record[key].itemList
          );
          finalCsvData = [...finalCsvData, ...csvData];
        } else if (key === "grndata" && record[key].data) {
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
        } else if (key === "acceptData" && record[key].data) {
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
          } else if (record[key].data.type === "IOP") {
            const csvData = generateCsvData(
              "Acceptance Note",
              irpIopAcptDataColumns,
              record[key].data,
              irpPoIopAcptItemListColumns,
              record[key].itemList
            );
            finalCsvData = [...finalCsvData, ...csvData];
          }
        } else if (key === "rejectData" && record[key].data) {
          if (record[key].data.type === "PO") {
            const csvData = generateCsvData(
              "Rejection Note",
              poRejDataColumns,
              record[key].data,
              poIopRejItemListColumns,
              record[key].itemList
            );
            finalCsvData = [...finalCsvData, ...csvData];
          } else if (record[key].data.type === "IOP") {
            const csvData = generateCsvData(
              "Rejection Note",
              iopRejDataColumns,
              record[key].data,
              poIopRejItemListColumns,
              record[key].itemList
            );
            finalCsvData = [...finalCsvData, ...csvData];
          }
        } else if (key === "inspectionRptData" && record[key].data) {
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
        } else if (key === "inspectionNewRptData" && record[key].data) {
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

  const {organizationDetails} = useSelector(state => state.auth)

  return (
    <>
      <div style={{ textAlign: "center", position: "relative" }}>
        <h1>
        Transaction Summary
        </h1>

        {finalCsvData.length > 0 ? (
        <CSVLink
          data={finalCsvData}
          filename={`transaction_detail_${organizationDetails?.organizationName}.csv` }
          style={{
            marginBottom: 16,
            border: "1px solid",
            width: "max-content",
            padding: "1rem",
            position: "absolute",
            right: 0,
            top: "-0.5rem"
          }}
          className="ant-btn ant-btn-primary"
          >
          Export to csv
        </CSVLink>
      )
      : (
        <Button type="primary" loading style={{ top: "-0.5rem", right: "0", position: "absolute"}}>
            Generating CSV Data
          </Button>

      )
      }


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
