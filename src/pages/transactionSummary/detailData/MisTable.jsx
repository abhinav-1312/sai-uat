import React, { useEffect, useState } from 'react'
import { apiHeader, convertArrayToObject, fetchUomLocatorMaster } from '../../../utils/Functions';
import axios from 'axios';
import DetailData from './DetailData';

const MisTable = ({type, data, itemList}) => {
    const [uomObj, setUomObj] = useState({});
    const [locatorObj, setLocatorObj] = useState({});
    useEffect(() => {
    //   fetchUom();
    fetchUomLocatorMaster(setUomObj, setLocatorObj)
    }, []);
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
  
    const consumerDetails = [
      {
        title: "Consumer Name",
        dataIndex: "consumerName",
      },
      {
        title: "Contact No",
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
        dataIndex: "uom",
        render: (uom) => uomObj[parseInt(uom)],
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
      ...supplierDetails,
      ...orgConsigneeDetails
    ];
  
    const irpExtraColumn = [
      {
        title: "Outward Gate Pass No.",
        dataIndex: "processId",
      },
      ...orgConsignorDetails,
      ...consumerDetails,
    ];
  
    const interOrgExtraColumn = [
      {
        title: "Rejection Note No.",
        dataIndex: "processId",
      },
      ...orgConsignorDetails,
      ...orgConsigneeDetails,
    ];
    const dataColumn = [
      {
        title: "Mis Date",
        dataIndex: "inspectionRptDt",
      },
      {
        title: "Mis No.",
        dataIndex: "processId",
      },
      {
        title: "Process Type",
        dataIndex: "type",
      },
      {
        title: "Inward Gate Pass No",
        dataIndex: "processId",
      },
      {
        title: "Challan / invoice No.",
        dataIndex: "challanNo",
      },
      {
        title: "Mode Of Delivery",
        dataIndex: "modeOfDelivery",
      },
      {
        title: "Date Of Delivery",
        dataIndex: "dateOfDelivery",
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
        title: "Approved By",
        dataIndex: "issueName",
      },
      {
        title: "Approval Date",
        dataIndex: "issueDate",
      },
      {
        title: "Condition Of Goods",
        dataIndex: "conditionOfGoods",
      },
      {
        title: "Note",
        dataIndex: "note",
      },
    ];
  
    const itemListColumn = [
      ...itemDetails,
      {
        title: "Received Quantity",
        dataIndex: "quantity",
      },
      {
        title: "Remarks",
        dataIndex: "remarks",
      },
    ];
  
    return(
      <DetailData dataColumn={type === "PO" ? [...dataColumn, ...poExtraColumns] :(type === "IRP" ? [...dataColumn, irpExtraColumn] : [...dataColumn, ...interOrgExtraColumn] )} itemListColumn={itemListColumn} data={data} itemList={itemList}/>
    )
}

export default MisTable