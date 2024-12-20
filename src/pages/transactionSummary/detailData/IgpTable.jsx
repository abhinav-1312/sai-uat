import React, { useEffect, useState } from "react";
import {
  apiHeader,
  convertArrayToObject,
  generateCsvData,
} from "../../../utils/Functions";
import axios from "axios";
import DetailData from "./DetailData";
import { useSelector } from "react-redux";

const orgConsignorDetails = [
  {
    title: "Consignor Regional Center Code",
    dataIndex: "crRegionalCenterCd",
  },
  {
    title: "Consignor Regional Center Name",
    dataIndex: "crRegionalCenterName",
  },
  {
    title: "Consignor Address",
    dataIndex: "crAddress",
  },
  {
    title: "Consignor Zipcode",
    dataIndex: "crZipcode",
  },
];
const orgConsigneeDetails = [
  {
    title: "Consignee Regional Center Code",
    dataIndex: "ceRegionalCenterCd",
  },
  {
    title: "Consignee Regional Center Name",
    dataIndex: "ceRegionalCenterName",
  },
  {
    title: "Consignee Address",
    dataIndex: "ceAddress",
  },
  {
    title: "Consignee Zipcode",
    dataIndex: "ceZipcode",
  },
];
const irpItemListExtra = [
  {
    title: "Locator Description",
    dataIndex: "locatorId",
    // render: (id) => locatorObj[parseInt(id)]
  },
  {
    title: "Required For No Of Days",
    dataIndex: "requiredDays",
  },
];

const consumerDetails = [
  {
    title: "Consumer Name",
    dataIndex: "consumerName",
  },
  {
    title: "Contact No.",
    dataIndex: "contactNo",
  },
];

const itemDetails = [
  {
    title: "Item Code",
    dataIndex: "itemCode",
  },
  {
    title: "Item Description",
    dataIndex: "itemDesc",
  },
  {
    title: "Uom Description",
    dataIndex: "uomDesc",
    // render: (uom) => uomObj[parseInt(uom)]
  },
];

const supplierDetails = [
  {
    title: "Supplier Code",
    dataIndex: "supplierCd",
    render: (text, record) => record.supplierCd || record.supplierCode,
  },
  {
    title: "Supplier Name",
    dataIndex: "supplierName",
  },
  {
    title: "Supplier Address",
    dataIndex: "crAddress",
  },
];
const poExtraColumns = [
  {
    title: "Noa No",
    dataIndex: "noaNo",
  },
  {
    title: "Noa Date",
    dataIndex: "noaDate",
  },
  {
    title: "Date of Delivery",
    dataIndex: "dateOfDelivery",
  },
  {
    title: "Mode Of Delivery",
    dataIndex: "modeOfDelivery",
  },
  {
    title: "Challan / Invoice No.",
    dataIndex: "challanNo",
  },
  ...orgConsigneeDetails,
  ...supplierDetails,
];

const irpExtraColumn = [
  {
    title: "Outward Gate Pass No.",
    dataIndex: "processId",
  },
  {
    title: "Received By",
    dataIndex: "issueName",
  },
  {
    title: "Receiving Date",
    dataIndex: "issueDate",
  },
  ...orgConsignorDetails,
  ...consumerDetails,
];

const interOrgExtraColumn = [
  {
    title: "Rejection Note No.",
    dataIndex: "processId",
  },
  {
    title: "Acceptance Note No.",
    dataIndex: "processId",
  },
  {
    title: "Acceptance Note Date",
    dataIndex: "issueDate",
  },
  ...orgConsignorDetails,
  ...orgConsigneeDetails,
];
const dataColumn = [
  {
    title: "Inward Gate Pass No.",
    dataIndex: "processId",
  },
  {
    title: "Inward Gate Pass Date",
    dataIndex: "gatePassDate",
  },
  {
    title: "Process Type",
    dataIndex: "type",
  },
  {
    title: "Generated By",
    dataIndex: "genName",
  },
  {
    title: "Generation Date",
    dataIndex: "genDate",
  },
  {
    title: "Terms and Condition",
    dataIndex: "termsCondition",
  },
  {
    title: "Note",
    dataIndex: "note",
  },
];

const itemListColumn = [
  ...itemDetails,
  {
    title: "Quantity",
    dataIndex: "quantity",
  },
  {
    title: "Remarks",
    dataIndex: "remarks",
  },
  {
    title: "Locator Description",
    dataIndex: "locatorDesc",
    // render : (id) => locatorObj[parseInt(id)]
  },
];

export const irpIgpDataColumns = [...dataColumn, ...irpExtraColumn];
export const poIgpDataColumns = [...dataColumn, ...poExtraColumns];
export const iopIgpDataColumns = [...dataColumn, ...interOrgExtraColumn];
export const poIopIgpItemListColumns = itemListColumn;
export const irpIgpItemListColumns = [...itemListColumn, ...irpItemListExtra];

const IgpTable = ({ type, data, itemList, setCsv }) => {
  useEffect(() => {
    const csvData = generateCsvData(
      "Inward Gate Pass",
      dataColumnsUpdated,
      data,
      itemListColumnUpdated,
      itemList
    );
    setCsv(csvData);
  }, []);

  const dataColumnsUpdated =
    type === "PO"
      ? [...dataColumn, ...poExtraColumns]
      : type === "IOP"
      ? [...dataColumn, ...interOrgExtraColumn]
      : [...dataColumn, ...irpExtraColumn];
  const itemListColumnUpdated =
    type === "PO"
      ? itemListColumn
      : type === "IOP"
      ? itemListColumn
      : [...itemListColumn, ...irpItemListExtra];

  return (
    <DetailData
      dataColumn={dataColumnsUpdated}
      itemListColumn={itemListColumnUpdated}
      data={data}
      itemList={itemList}
    />
  );
};

export default IgpTable;
