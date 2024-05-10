import React, { useEffect, useState } from 'react'
import { apiHeader, convertArrayToObject } from '../../../utils/Functions';
import axios from 'axios';
import DetailData from './DetailData';

const IsnTable = ({type, data, itemList}) => {
    const token = localStorage.getItem("token")
    const [uomObj, setUomObj] = useState({})
    const [locatorObj, setLocatorObj] = useState({})

const fetchUomLocatorMaster = async (setUomHook, setLocatorHook) => {
    try {
      const uomMasterUrl =
        "https://uat-sai-app.azurewebsites.net/sai-inv-mgmt/master/getUOMMaster";
      const locatorMasterUrl =
        "https://uat-sai-app.azurewebsites.net/sai-inv-mgmt/master/getLocatorMaster";
      const [uomMaster, locatorMaster] = await Promise.all([axios.get(uomMasterUrl, apiHeader("GET", token)), axios.get(locatorMasterUrl, apiHeader("GET", token))]);
      const { responseData: uomMasterData } = uomMaster.data;
      const { responseData: locatorMasterData } = locatorMaster.data;
      const uomMod = convertArrayToObject(uomMasterData, "id", "uomName");
      const locatorMod = convertArrayToObject(locatorMasterData, "id", "locatorDesc")
      setUomObj({ ...uomMod });
      setLocatorObj({...locatorMod})
    } catch (error) {
      console.log("Error fetching Uom master details.", error);
    }
  };

// const uomObj = fetchUom()
console.log("UOM OBJ: ",uomObj)

useEffect(()=>{
    fetchUomLocatorMaster()
}, [])

 const orgConsignorDetails = [
    {
        title: "Consignor Regional Center Code",
        dataIndex: "crRegionalCenterCd"
    },
    {
        title: "Consignor Regional Center Name",
        dataIndex: "crRegionalCenterName"
    },
    {
        title: "Consignor Address",
        dataIndex: "crAddress"
    },
    {
        title: "Consignor Zipcode",
        dataIndex: "crZipcode"
    }
]
 const orgConsigneeDetails = [
    {
        title: "Consignee Regional Center Code",
        dataIndex: "ceRegionalCenterCd"
    },
    {
        title: "Consignee Regional Center Name",
        dataIndex: "ceRegionalCenterName"
    },
    {
        title: "Consignee Address",
        dataIndex: "ceAddress"
    },
    {
        title: "Consignee Zipcode",
        dataIndex: "ceZipcode"
    }
]

 const consumerDetails = [
    {
        title: "Consumer Name",
        dataIndex: "consumerName"
    },
    {
        title: "Contact No",
        dataIndex: "contactNo"
    }
]

const itemDetails = [
    {
        title: "Item Code",
        dataIndex: "itemCode"
    },
    {
        title: "Item Description",
        dataIndex: "itemDesc"
    },
    {
        title: "Uom Description",
        dataIndex: "uom",
        render: (uom) => uomObj[parseInt(uom)]
    },
]  

    const dataColumns = [
        {
            title: "Issue Note No.",
            dataIndex: "processId"
        },
        {
            title: "Issue Note Date",
            dataIndex: "issueNoteDt"
        },
        {
            title: "Process Type",
            dataIndex: "type"
        },
        {
            title: "Demand Note No.",
            dataIndex: "demandNoteNo"
        },
        {
            title: "Demand Note Date",
            dataIndex: "demandNoteDt"
        },
        {
            title: "Terms And Condition",
            dataIndex: "termsCondition"
        },
        {
            title: "Note",
            dataIndex: "note"
        },
        {
            title: "Generated By",
            dataIndex: "genName"
        },
        {
            title: "Generated Date",
            dataIndex: "genDate"
        },
        {
            title: "Approved by",
            dataIndex: "approvedName"
        },
        {
            title: "Approval Date",
            dataIndex: "approvedDate"
        },
        {
            title: "Reveived By",
            dataIndex: "issueName"
        },
        {
            title: "Receiving Date",
            dataIndex: "issueNoteDt"
        },
        ...orgConsignorDetails,
        ...consumerDetails
    ]

    const itemListColumns = [
        ...itemDetails,
        {
            title: "Required Quantity",
            dataIndex: "quantity",
        },
        {
            title: "Required For No. Of Days",
            dataIndex: "requiredDays",
        },
        {
            title: "Remarks",
            dataIndex: "remarks",
        },
        
    ]
  return (
    <DetailData dataColumn={dataColumns}  itemListColumn={itemListColumns} data={data} itemList={itemList}/>
  )
}

export default IsnTable