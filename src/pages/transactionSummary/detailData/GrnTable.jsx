import React, { useEffect, useState } from 'react'
// import { consumerDetails, itemDetails, orgConsignorDetails, supplierDetails } from './../CommonColumns'
import DetailData from './DetailData'
import { apiHeader, convertArrayToObject, convertEpochToDateString } from '../../../utils/Functions'
import axios from 'axios'
import { useSelector } from 'react-redux'

const GrnTable = ({type, data, itemList}) => {
    const {token} = useSelector(state => state.auth);
    const [uomObj, setUomObj] = useState({})
    const [locatorObj, setLocatorObj] = useState({})

    const fetchUom = async () => {
        // console.log("Fetch uom called")
        const uomMasterUrl = "/master/getUOMMaster";
        const locatorMasterUrl = "/master/getLocatorMaster";
    
        try{
            // const {data}= await axios.get(uomMasterUrl, apiHeader("GET", token))
            // const {responseData} = data
            // console.log("Response data: ", responseData)
            
            // const uomMod =  convertArrayToObject(responseData, "id", "uomName")

            // setUomObj({...uomMod})

            const [uomMaster, locatorMaster] = await Promise.all([axios.get(uomMasterUrl, apiHeader("GET", token)), axios.get(locatorMasterUrl, apiHeader("GET", token))]);
            const { responseData: uomMasterData } = uomMaster.data;
            const { responseData: locatorMasterData } = locatorMaster.data;
            const uomMod = convertArrayToObject(uomMasterData, "id", "uomName");
            const locatorMod = convertArrayToObject(locatorMasterData, "id", "locatorDesc")

            setUomObj({...uomMod})
            setLocatorObj({...locatorMod})
    
        }
        catch(error){
            console.log("Error")
        }
    }

    useEffect(()=>{
        fetchUom()
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
    
    const supplierDetails = [
        {
            title: "Supplier Code",
            dataIndex: "supplierCd",
            render: (text, record) => record.supplierCd || record.supplierCode, 
        },
        {
            title: "Supplier Name",
            dataIndex: "supplierName"
        },
        {
            title: "Supplier Address",
            dataIndex: "crAddress"
        }
    ]
    const poExtraColumns = [
        {
            title: "Acceptance Note No.",
            dataIndex: "processId"
        },
        {
            title: "Acceptance Note Date",
            dataIndex: "issueDate"

        },
        {
            title: "Noa No",
            dataIndex: "noaNo"
        },
        {
            title: "Noa Date",
            dataIndex: "noaDate",
            render: (date) => convertEpochToDateString(date)
        },
        {
            title: "Date of Delivery",
            dataIndex: "dateOfDelivery",
        },
        ...orgConsigneeDetails,
        ...supplierDetails
    ]

    const irpExtraColumn = [
        {
            title: "Return Note No.",
            dataIndex: "processId"
        }
    ]
    const dataColumn = [
        {
            title: "GRN Date",
            dataIndex: "grnDate"
        },
        {
            title: "GRN No.",
            dataIndex: "processId"
        },
        {
            title: "Process Type",
            dataIndex: "type"
        },
        {
            title: "Generated By",
            dataIndex: "genName"
        },
        {
            title: "Generation Date",
            dataIndex: "genDate"
        },
        {
            title: "Verified By",
            dataIndex: "issueName"
        },
        {
            title: 'Verification Date',
            dataIndex: "issueDate"
        },
        {
            title: "Terms and Condition",
            dataIndex: "termsCondition"
        },
        {
            title: "Note",
            dataIndex: "note"
        },
    ]

    const itemListColumn = [
        ...itemDetails,
        {
            title: "Received Quantity",
            dataIndex: "quantity"
        },
        {
            title: "Budget Head Procurement",
            dataIndex: "budgetHeadProcurement"
        },
        {
            title: "Remarks",
            dataIndex: "remarks"
        },
        {
            title: "Locator Description",
            dataIndex: "locatorId",
            render : (id) => locatorObj[parseInt(id)]
        }
    ]
  return (
    <DetailData dataColumn={type === "PO" ? [...dataColumn,...poExtraColumns, ] :(type === "IRP" ? [...dataColumn, ...consumerDetails, ...irpExtraColumn, ...orgConsignorDetails] : [...dataColumn, ...orgConsignorDetails, ...orgConsigneeDetails] )} itemListColumn={type === "PO" ? [...itemListColumn, {title: "Unit Price", dataIndex: "unitPrice"}] : {itemListColumn}} data={data} itemList={itemList}/>
  )
}

export default GrnTable
