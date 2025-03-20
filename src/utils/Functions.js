import {Table, message} from "antd"
import html2pdf from 'html2pdf.js';
import axios from 'axios'
import _ from 'lodash';

const sanitizeText = (text) => {
  // return text
  return text.toString().toLowerCase().replace(/\s+/g, '');
};


export const handleSearch = (searchText, itemData, setHook, setSearch=null) => {
  if(searchText !== null){
      const sanitizedText = sanitizeText(searchText);
      if(setSearch)
        setSearch(searchText)
      const filtered = itemData?.filter((parentObject) =>
        recursiveSearch(parentObject, sanitizedText)
    );
    setHook([...filtered]);
  }
  else{
    setHook([...itemData])
  }
};

export const apiHeader = (method, token) => {
  return {
    // method: method,
    headers: {
      "Content-Type": "application/json",
      'Authorization': `Bearer ${token}`
    }
  }
}

export const apiCall = async (method, url, token, payload=null) => {
  const header = {
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    }
  }
  if(method === "GET") {
    try{
      const {data} = await axios.get(url, header)
      return data
    }
    catch(error){
      message.error("Some error occured.")
      console.log("Error: ", error)
    }
  }
  else if(method === "POST"){
    try{
      const {data} = await axios.post(url, payload, header)
      return data
    }catch(error){
      message.error("Some error occured.")
      console.log("Error: ", error)
    }
  }
}

export const mergeItemMasterAndOhq = (itemMasterArr, ohqArr, form = null) => {
  console.log("CALLED, ", form)
  // Ensure input arrays are valid and handle cases where they are not provided
  if (!Array.isArray(itemMasterArr) || !Array.isArray(ohqArr)) {
    console.error("Invalid input arrays");
    return [];
  }

  return itemMasterArr.map((item) => {
    // console.log("ITem: ", item)
    if(item.itemMasterCd === "21299951139939991"){
      console.log("CORN: ", item)
    }
    const itemCodeMatch = ohqArr.find(
      (itemOhq) => itemOhq.itemCode === item.itemMasterCd
    );

    if (itemCodeMatch) {
      // Filter the quantity list to exclude quantities of 0
      const newQtyList = itemCodeMatch.qtyList.filter(
        (obj) =>{
          if(form === "IGP"){
            return obj.quantity >= 0
          }
          return obj.quantity !== 0

        } 
      );
      if (newQtyList.length > 0) {
        return {
          ...item,
          qtyList: newQtyList,
          locationId: itemCodeMatch.locationId,
          locationDesc: itemCodeMatch.locationName,
        };
      }
    }
  }).filter(item => item !== undefined);
};

const recursiveSearch = (object, searchText) => {
  for (let key in object) {
    const value = object[key];
    if (typeof value === "object") {
      if (Array.isArray(value)) {
        for (let item of value) {
          if (recursiveSearch(item, searchText)) {
            return true;
          }
        }
      } else {
        if (recursiveSearch(value, searchText)) {
          return true;
        }
      }
    } else if (
      value &&
      sanitizeText(value).includes(searchText)
    ) {
      return true;
    }
  }
  return false;
};

export const convertToCurrency = (amount) => {
  const formattedAmount = amount.toLocaleString('en-IN', {
    style: 'currency',
    currency: 'INR'
  });
  return formattedAmount
}


export const handleSelectItem = (
  valueObj,
  selectHook,
  setSelectHook,
  updateArrayHook,
) => {
  selectHook = selectHook || []
  const index = selectHook?.findIndex((item) => item.id === valueObj.id);
  if (index === -1) {
    setSelectHook((prevItems) => [...prevItems, valueObj]); // Update selected items state
    updateArrayHook((prevValues) => {
      const newItem = {
        srNo: prevValues.items?.length ? prevValues.items.length + 1 : 1,
        itemCode: valueObj.itemMasterCd,
        itemId: valueObj.id,
        itemDesc: valueObj.itemMasterDesc,
        uom: valueObj.uomId,
        uomDesc: valueObj.uomDtls.baseUom,
        locatorId: valueObj.locatorId,
        qtyList: valueObj.qtyList,
        quantity: 1,
        noOfDays: 1,
        conditionOfGoods: "",
        budgetHeadProcurement: "",
        remarks: "",
      };

      const updatedItems = [...(prevValues.items || []), newItem];
      return { ...prevValues, items: updatedItems };
    });
  } else {
    // If item is already selected, deselect it
    const updatedItems = [...selectHook];
    updatedItems.splice(index, 1);
    setSelectHook(updatedItems);
  }
};

export const renderLocatorOHQ = (obj) => {
    return (
      <Table 
        dataSource={obj}
        pagination={false}
        columns={[
          {
            title: "LOCATOR DESCRIPTION",
            dataIndex: "locatorDesc",
            key: "locatorDesc",
          },
          {
            title: "QUANTITY",
            dataIndex: "quantity",
            key: "quantity"
          },
          {
            title: "Total Value",
            dataIndex: "totalValues",
            key: "totalValue",
            render: (value) => convertToCurrency(value)
          },
        ]}
      />
    )
  }

export const convertArrayToObject = (array, _makeKey, valueKey ) => {
    return array?.reduce((acc, obj) => {
      acc[obj[_makeKey]] = obj[valueKey]
      return acc
    }, {})
  }


 export  const printOrSaveAsPDF = async (formRef) => {

  // window.print()
    const input = formRef.current;
    if (input === null) {
      return;
    }
    // Apply custom styles for Ant Design components to ensure proper rendering
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = `
      .ant-input {width: 100%;}`;
    document.head.appendChild(styleSheet);
    const options = {
      margin: [5, 5],
      filename: 'form.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    };
    // Apply temporary styles for PDF generation
    const originalStyles = window.getComputedStyle(input);
    input.style.transform = 'scaleY(0.7)'
    // input.style.transform = 'scaleY(0.7)'
    input.style.position = 'static';
    // input.style.transform = 'none';
    input.style.maxWidth = '100%';
    input.style.margin = '-14rem 0 0 0'; // Adjust the negative margin as needed to shift the content upward
    input.style.overflow = "hidden"

    html2pdf(input, options).then((pdf) => {
      input.style.cssText = originalStyles.cssText;
      const blob = pdf.output('bloburl');
      
      // Create a link element for downloading the PDF
      const link = document.createElement('a');
      link.href = blob;
      link.download = options.filename;

      // Trigger the download
      document.body.appendChild(link);
      link.click();

      // Reset the styles after generating the PDF
      input.style.cssText = originalStyles.cssText;
    });
  };

  const token = localStorage.getItem("token")
  export const fetchUomLocatorMaster = async (setUomHook, setLocatorHook) => {
    try {
      const uomMasterUrl =
        "/master/getUOMMaster";
      const locatorMasterUrl =
        "/master/getLocatorMaster";
      const [uomMaster, locatorMaster] = await Promise.all([axios.get(uomMasterUrl, apiHeader("GET", token)), axios.get(locatorMasterUrl, apiHeader("GET", token))]);
      const { responseData: uomMasterData } = uomMaster.data;
      const { responseData: locatorMasterData } = locatorMaster.data;
      const uomObject = convertArrayToObject(uomMasterData, "id", "uomName");
      const locatorObj = convertArrayToObject(locatorMasterData, "id", "locatorDesc")
      setUomHook({ ...uomObject });
      setLocatorHook({...locatorObj})
    } catch (error) {
    }
  };

  export const daysDifference = (issueDate, receivingDate) => {
    const issueDtparts = issueDate.split("/");
    const receivingDtparts = receivingDate.split("/");
    const issueDay = parseInt(issueDtparts[0], 10);
    const issueMonth = parseInt(issueDtparts[1], 10);
    const issueYear = parseInt(issueDtparts[2], 10);
    const receivingDay = parseInt(receivingDtparts[0], 10);
    const receivingMonth = parseInt(receivingDtparts[1], 10);
    const receivingYear = parseInt(receivingDtparts[2], 10);
    const issueDateMod = new Date(issueYear, issueMonth - 1, issueDay); // JavaScript months are 0-indexed
    const receivingDateMod = new Date(receivingYear, receivingMonth - 1, receivingDay); // JavaScript months are 0-indexed
    // constGet the current date
    // const currentDate = new Date();

    // constCalculate the difference in milliseconds
    const differenceMs = Math.abs(receivingDateMod.getTime() - issueDateMod.getTime());

    // constConvert the difference to days
    const differenceDays = Math.floor(differenceMs / (1000 * 60 * 60 * 24));
    // const difference_days = 1
    return differenceDays;
  };

  export const convertEpochToDateString = (epochTime) => {
    // Convert epoch time to milliseconds
    let date = new Date(epochTime);
  
    // Extract the day, month, and year from the Date object
    let day = date.getDate();
    let month = date.getMonth() + 1; // Month starts from 0
    let year = date.getFullYear();
  
    // Add leading zeros if needed
    if (day < 10) {
      day = '0' + day;
    }
    if (month < 10) {
      month = '0' + month;
    }
  
    // Return the date string in DD/MM/YYYY format
    return `${day}/${month}/${year}`;
  }

  
  export const generateColumn = (columnArray) => {
    return columnArray.map(column=>({
      title: column.title,
      dataIndex: column.dataIndex
    }))
  }

  export const searchedData = (item, searchText) => {
    if(item === undefined) return
    return Object.values(item).some(
      (value) =>
        typeof value === "string" &&
        value.toLowerCase().includes(searchText.toLowerCase())
    )
  }

export const removeItem = (index, setFormData) => {
  setFormData((prevValues) => {
    const updatedItems = prevValues.items;
    updatedItems.splice(index, 1);

    const updatedItems1 = updatedItems.map((item, key) => {
      return { ...item, srNo: key + 1 };
    });

    return { ...prevValues, items: updatedItems1 };
  });
};

export const sortAlphabetically = (arr) => {
  arr.sort(function(a, b) {
    // Compare the 'value' property of each object alphabetically
    return a.value.localeCompare(b.value);
  });

  return arr
}

export const populateTxnSlabData = async (startDate=null, endDate=null, itemCode=null, txnType=null, orgId = null, token) => {
  if(!orgId){
    let allTxn = []
    const countOrgWise = {} // count no. of txn happened org wise
    const data = await apiCall("POST", "/txns/getTxnSummaryForAllOrg", token, { startDate, endDate, itemCode, txnType, orgId }) 

    const responseData = data?.responseData

    responseData?.forEach(record => {
      allTxn = [...allTxn, ...record.respList]
      countOrgWise[record.orgId] = record.respList.length
    })
    return {count: allTxn.length, allData: allTxn, countOrgWise: countOrgWise}
  }
  else{
    const { responseData } = await apiCall("POST", "/txns/getTxnSummary", token, { startDate, endDate, itemCode, txnType, orgId }) 
    return {count: responseData.length, allData: responseData, countOrgWise: {orgId: responseData.length}}
  }
}

export const populateItemSlabData = async (orgId, token) => {
  const data = await apiCall("POST", "/getFNSCategory", token, {orgId: orgId})
  const responseData = data?.responseData;
  const uniqueItemListAllOrg = new Set() // unique list of items
  const itemDescDropdownList = new Set() // item description dropdown filter data
  const subCategoryDropdownList = new Set() // subcategory dropdown filter data
  const uniqueItemOrgWiseMapping = {} // org wise unique items present 
  
  responseData?.forEach(item => {
    itemDescDropdownList.add(JSON.stringify({ text: _.trim(item.itemDescription), value: _.trim(item.itemDescription)}))
    subCategoryDropdownList.add(JSON.stringify({text: _.trim(item.subCategoryDesc), value: _.trim(item.subCategoryDesc)}))
    uniqueItemListAllOrg.add(item.itemCode)
    if(!uniqueItemOrgWiseMapping[item.orgId]){
      uniqueItemOrgWiseMapping[item.orgId] = new Set()
    }
    uniqueItemOrgWiseMapping[item.orgId].add(item.itemCode)
  })

  const uniqueItemOrgWiseMappingCount = Object.fromEntries(
    Object.entries(uniqueItemOrgWiseMapping).map(([orgId, uniqueItemList]) => [orgId, uniqueItemList.size])
  )

  return {allData: responseData || [], count: uniqueItemListAllOrg.size, countOrgWise: uniqueItemOrgWiseMappingCount, itemDescDropdownList: sortAlphabetically(Array.from(itemDescDropdownList).map(str => JSON.parse(str))), subCategoryDropdownList: Array.from(subCategoryDropdownList).map(str=> JSON.parse(str))}
} 

export const populateInvSlabData = async (itemCode, orgId, token) => {
  const data1 = await apiCall("POST", "/master/getOHQ", token, {itemCode: itemCode, userId: "userCd", orgId: orgId})
  const responseData = data1?.responseData
  let totalValAllOrg = 0
  const data = []
  const countOrgWise = {} // location wise value
  const itemDescDropdownList = new Set() // item description dropdown filter data
  const subCategoryDropdownList = new Set() // subcategory dropdown filter data
  responseData?.forEach(record => {
    let tempVal = 0
    let tempQuantity = 0
    record.qtyList.forEach(subRecord => {
      tempVal = Math.round((tempVal + subRecord.totalValues)*100)/100
      tempQuantity = tempQuantity + subRecord.quantity
    })

    if(!countOrgWise[record.locationName]){
      countOrgWise[record.locationName] = 0
    }

    countOrgWise[record.locationName] = Math.round((countOrgWise[record.locationName] + tempVal)*100)/100

    totalValAllOrg = Math.round((totalValAllOrg + tempVal)*100)/100
    data.push({
      itemCode: record.itemCode,
      itemName: record.itemName,
      subcategory: record.qtyList[0].subcategoryDesc,
      value: convertToCurrency(tempVal),
      quantity: tempQuantity,
      locationName: record.locationName
    })

    itemDescDropdownList.add(JSON.stringify({text: _.trim(record.itemName), value: _.trim(record.itemName)}))
    subCategoryDropdownList.add(JSON.stringify({text: _.trim(record.qtyList[0].subcategoryDesc), value: _.trim(record.qtyList[0].subcategoryDesc)}))
  })

  return {allData: data, count: convertToCurrency(totalValAllOrg), countOrgWise: countOrgWise, itemDescDropdownList: sortAlphabetically(Array.from(itemDescDropdownList).map(str => JSON.parse(str))), subCategoryDropdownList: Array.from(subCategoryDropdownList).map(str=> JSON.parse(str))}
}

// export const generateCsvData = (heading, crCeDtlsCol, crCeDataObj, itemCol, itemData) => {
//   const crCeDataArray = [crCeDataObj]
//   return [
//     [heading.toUpperCase()],
//     crCeDtlsCol?.map(col => col.title),
//     ...crCeDataArray.map(row => {
//       const csvRows = {};
//       crCeDtlsCol?.forEach(col => {
//         csvRows[col.title] = row[col.dataIndex]
//       })
//       return Object.values(csvRows)
//     }), 
//     ["ITEM DETAILS"],
//     itemCol?.map(col => col.title),
//     ...itemData.map(row => {
//       const csvRows = {};
//       itemCol?.forEach(col => {
//         csvRows[col.title] = row[col.dataIndex]
//       })
//       return Object.values(csvRows)
//     })
//     , 
//     [] // leave a blank row below
//   ]
// }

export const generateCsvData = (heading, crCeDtlsCol, crCeDataObj, itemCol, itemData) => {
  // Ensure crCeDataArray is empty if crCeDataObj is null
  const crCeDataArray = crCeDataObj ? [crCeDataObj] : [];
  
  return [
    [heading.toUpperCase()],
    crCeDtlsCol?.map(col => col.title) || [],
    ...crCeDataArray.map(row => {
      const csvRows = {};
      crCeDtlsCol?.forEach(col => {
        // Check if row exists before trying to access its properties
        csvRows[col.title] = row ? row[col.dataIndex] : "";
      });
      return Object.values(csvRows);
    }),
    ["ITEM DETAILS"],
    itemCol?.map(col => col.title) || [],
    ...(itemData ? itemData.map(row => {
      const csvRows = {};
      itemCol?.forEach(col => {
        csvRows[col.title] = row ? row[col.dataIndex] : "";
      });
      return Object.values(csvRows);
    }) : []),
    [] // leave a blank row below
  ];
}


export const updateFormData = (newItem, setFormData) => {
  setFormData((prevValues) => {
    const updatedItems = [
      ...(prevValues.items || []),
      {
        ...newItem,
        noOfDays: prevValues.processType === "NIRP" ? "0" : (newItem.noOfDays ? newItem.noOfDays : "1"),
        srNo: prevValues.items?.length ? prevValues.items.length + 1 : 1,
      },
    ];
    return { ...prevValues, items: updatedItems };
  });
};

export const itemHandleChange = (fieldName, value, index, setFormData) => {
  setFormData((prevValues) => {
    const updatedItems = [...(prevValues.items || [])];
    
    if (fieldName === "unitPrice" && /^\d*\.?\d*$/.test(value)) {
      updatedItems[index] = {
        ...updatedItems[index],
        [fieldName]: value === "" ? 0 : value,
      };
    } else {
      updatedItems[index] = {
        ...updatedItems[index],
        [fieldName]: value,
      };
    }

    return {
      ...prevValues,
      items: updatedItems,
    };
  });
};

