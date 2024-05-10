import axios from "axios";
import { apiHeader, convertArrayToObject } from "../../utils/Functions";

const token = localStorage.getItem("token")
let uomObj;

const fetchUom = async () => {
    // console.log("Fetch uom called")
    const uomMasterUrl =
        "https://uat-sai-app.azurewebsites.net/sai-inv-mgmt/master/getUOMMaster";

    try{
        const {data} = await axios.get(uomMasterUrl, apiHeader("GET", token))
        const {responseData} = data
        // console.log("Response data: ", responseData)
        
        uomObj =  convertArrayToObject(responseData, "id", "uomName")

    }
    catch(error){
        console.log("Error")
    }
}

fetchUom()

// const uomObj = fetchUom()
console.log("UOM OBJ: ",uomObj)

export const orgConsignorDetails = [
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
export const orgConsigneeDetails = [
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

export const consumerDetails = [
    {
        title: "Consumer Name",
        dataIndex: "consumerName"
    },
    {
        title: "Consumer Name",
        dataIndex: "address"
    }
]

export const itemDetails = [
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

export const supplierDetails = [
    {
        title: "Supplier Code",
        dataIndex: "supplierCd" || "supplierCode"
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