import React, { useEffect, useState } from "react";
import { Form, Input, Table, Button } from "antd";
import { columnName } from "./ColumnNameKeyVal";
import { convertEpochToDateString, fetchUomLocatorMaster } from "../../../utils/Functions";

const DetailData = ({
  data,
  itemList,
  processType
}) => {
  const [showItems, setShowItems] = useState(false)
  const [uomMaster, setUomMaster] = useState({})
  const [locatorMaster, setLocatorMaster] = useState({})

  const itemListColumns = [
    {
      title: "Item Code",
      dataIndex: "itemCode",
      fixed: "left",
    },
    {
      title: "Item Description",
      dataIndex: "itemDesc",
      fixed: "left",
    },
    {
      title: "UOM Description",
      dataIndex: "uom",
      render: (uom) => uomMaster[parseInt(uom)] || "not defined"
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
    },
    {
      title: "Locator Description ",
      dataIndex: "locatorId",
      render: (locatorId) => locatorMaster[parseInt(locatorId)] || "not defined"
    },
    {
      title: "Process Stage",
      dataIndex: "processStage",
    },
    {
      title: "Process Type",
      dataIndex: "processType",
    },
    {
      title: "Accepted Quantity",
      dataIndex: "acceptedQuantity",
    },
    {
      title: "Rejected Quantity",
      dataIndex: "rejectedQuantity",
    },
    {
      title: "Inspected Quantity",
      dataIndex: "inspectedQuantity",
    },
    (processType === "igp" || processType==='act' || processType === 'grn' || processType === "rej") ? {} : {title: "Required for no. of days", dataIndex: "requiredDays",},
    // {title: "Required no. of days", dataIndex: "requiredDays",
      // render: (text, record) => (processType === "igp" || processType==='act' || processType === 'grn' || processType === "rej") ? null : record
    // },
    {
      title: "Budget Head Procurement",
      dataIndex: "budgetHeadProcurement",
    },
    {
      title: "Condition of Goods",
      dataIndex: "conditionOfGoods",
    },
    {
      title: "Remarks",
      dataIndex: "remarks",
    },
  ];

  useEffect(()=>{
    fetchUomLocatorMaster(setUomMaster, setLocatorMaster)
  }, [])

  if (!data) return null;
  const dataColumns = Object.entries(data).map(([key, value]) => {
    if(processType === 'ogp' && (key === 'noaNo' || key === 'dateOfDelivery' || key === "noaDate")){
      return {}
    }
    else if(processType === 'igp' && (key === 'ceRegionalCenterCd' || key === 'ceRegionalCenterName'  || key === 'ceAddress' || key === 'ceZipcode' || key==="approvedDate")){
      return {}
    }
    else if(processType === "ir" && (key === "issueName" || key === 'crAddress' || key === "approvedName")){
      return {}
    }
    else if(processType === 'act' && (key === 'issueName' || key === 'issueDate' || key === "crAddress")){
      return {}
    }
    else if(processType === 'grn' && (key === "issueName" || key === 'crAddress')){
      return {}
    }
    else if(processType === "rej" && (key === "issueName" || key === "crAddress")){
      return {}
    }
    else if(processType === "act" && key === "acptRejNoteNo"){
      return { title: "Acceptance Note No.", dataIndex: "processId" };
    }
    else if(processType === "rej" && key === "acptRejNoteNo"){
      return { title: "Rejection Note No.", dataIndex: "processId" };
    }
    else if(processType === "act" && key === "acptRejNoteDate"){
      return { title: "Acceptance Note Date", dataIndex: key };
    }
    else if(processType === "rej" && key === "acptRejNoteDate"){
      return { title: "Rejection Note Date", dataIndex: key };
    }
    else{

      if(key === "issueNoteNo"){
        return { title: columnName[key] || key, dataIndex: "processId" };
      }
      if(key === 'gatePassNo'){
        return { title: columnName[key] || key, dataIndex: "processId" };
      }
      if(key === 'inspectionRptNo'){
        return {title: columnName[key] || key, dataIndex: "processId"}
      }
      if(key === 'grnNo'){
        return { title: columnName[key] || key, dataIndex: "processId" };
      }
      if(key === 'acptRejNoteNo'){
        return { title: columnName[key] || key, dataIndex: "processId" };
      }
      if(key === 'address'){
        return { title: columnName[key] || key, dataIndex: "crAddress" };
      }
      if(key === "noaDate"){
        return { title: columnName[key] || key, dataIndex: "noaDate", render: date => convertEpochToDateString(date) };
      }

      return { title: columnName[key] || key, dataIndex: key };
    }
    });


  return (
    <div style={{display:"flex", flexDirection: "column", gap: "1rem"}}>
      <Table
        dataSource={[data]}
        columns={dataColumns}
        scroll={{ x: "max-content" }}
        pagination={false}
      />

      <div>
        <Button type="primary" danger={showItems} onClick={()=>setShowItems(!showItems)}>
          {
            showItems ? "Hide Item List" : "Show Item List"
          }
        </Button>
      </div>
      <div style={{display: showItems?"block":"none"}}>
        <h4>ITEM LIST</h4>
        <Table
          dataSource={itemList}
          columns={itemListColumns}
          scroll={{ x: "max-content" }}
          pagination={false}
        />
      </div>
    </div>
  );
};

export default DetailData;
