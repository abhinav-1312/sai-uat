import {Table, Button} from "antd"
import html2pdf from 'html2pdf.js';
import axios from 'axios'

export const handleSearch = (searchText, itemData, setHook, setSearch=null) => {
  console.log("SEARCHTEXT: ", searchText)
  console.log("ITEMDATA: ", itemData)
  if(setSearch !== null)
    setSearch(searchText)
  const filtered = itemData.filter((parentObject) =>
    recursiveSearch(parentObject, searchText)
  );
  console.log("FILTEREDDDD: ", filtered)
  setHook([...filtered]);
};

export const apiHeader = (method, token) => {
  return {
    method: method,
    headers: {
      "Content-Type": "application/json",
      'Authorization': `Bearer ${token}`
    }
  }
}

// export const handleSearch = (searchText, itemData, setHook) => {
//   setSearch(searchText)
//   const filtered = itemData.filter((parentObject) =>
//     recursiveSearch(parentObject, searchText)
//   );
//   setHook([...filtered]);
// };

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
      value.toString().toLowerCase().includes(searchText.toLowerCase())
    ) {
      return true;
    }
  }
  return false;
};

export const handleSelectItem = (
  valueObj,
  selectHook,
  setSelectHook,
  updateArrayHook,
  // setTableHook
) => {
    // setTableHook(false);

  // Check if the item is already selected

  selectHook = selectHook || []
  const index = selectHook?.findIndex((item) => item.id === valueObj.id);
  if (index === -1) {
    setSelectHook((prevItems) => [...prevItems, valueObj]); // Update selected items state
    // add data to formData hook
    // setItemDetail((prevData) => {
    //   const newItem = {
    //     srNo: prevData.length ? prevData.length + 1 : 1,
    //     itemCode: record.itemMasterCd,
    //     itemId: record.id,
    //     itemDesc: record.itemMasterDesc,
    //     uom: record.uomId,
    //     uomDesc : record.uomDtls.baseUom,
    //     quantity: 1,
    //     noOfDays: 1,
    //     remarks: "",
    //     conditionOfGoods: "",
    //     budgetHeadProcurement: "",
    //     qtyList: record.qtyList
    //   };
    //   const updatedItems = [...(prevData || []), newItem];
    //   return [...updatedItems]
    // });

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
            key: "locatorDesc"
          },
          {
            title: "QUANTITY",
            dataIndex: "quantity",
            key: "quantity"
          }
        ]}
      />
    )
  }

export const convertArrayToObject = (array, _makeKey, valueKey ) => {
    return array.reduce((acc, obj) => {
      acc[obj[_makeKey]] = obj[valueKey]
      return acc
    }, {})
  }


 export  const printOrSaveAsPDF = async (formRef) => {

    const input = formRef.current;
    if (input === null) {
      return;
    }
    // Apply custom styles for Ant Design components to ensure proper rendering
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = `
      .ant-input {
        width: 100%;
      }
    `;
    document.head.appendChild(styleSheet);

    // const options = {
    //   margin: 5,
    //   filename: 'form.pdf',
    //   // html2canvas: { scale: 2},
    // };

    // const options = {
    //   margin: 5,
    //   filename: 'form.pdf',
    //   image: { type: 'jpeg', quality: 0.98 },
    //   html2canvas: { scale: 2 },
    //   jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    // };


    // // / Apply CSS transformation to scale down the content
    // input.style.transform = 'scale(0.75)'; // Adjust the scale factor as needed

    // html2pdf(input, options).then(() => {
    //   input.style.transform = 'scale(1)';
      // const blob = pdf.output('bloburl');
      
      // Create a link element for downloading the PDF
      // const link = document.createElement('a');
      // link.href = blob;
      // link.download = options.filename;

      // // Trigger the download
      // document.body.appendChild(link);
      // link.click();

      // Reset the scale after generating the PDF
    // });

    const options = {
      margin: [5, 5],
      filename: 'form.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    };

    // Apply temporary styles for PDF generation
    const originalStyles = window.getComputedStyle(input);
    input.style.transform = 'scale(0.8)'
    input.style.position = 'static';
    // input.style.transform = 'none';
    input.style.maxWidth = '100%';
    input.style.marginTop = '-7rem'; // Adjust the negative margin as needed to shift the content upward

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
        "https://uat-sai-app.azurewebsites.net/sai-inv-mgmt/master/getUOMMaster";
      const locatorMasterUrl =
        "https://uat-sai-app.azurewebsites.net/sai-inv-mgmt/master/getLocatorMaster";
      const [uomMaster, locatorMaster] = await Promise.all([axios.get(uomMasterUrl, apiHeader("GET", token)), axios.get(locatorMasterUrl, apiHeader("GET", token))]);
      const { responseData: uomMasterData } = uomMaster.data;
      const { responseData: locatorMasterData } = locatorMaster.data;
      const uomObject = convertArrayToObject(uomMasterData, "id", "uomName");
      const locatorObj = convertArrayToObject(locatorMasterData, "id", "locatorDesc")
      setUomHook({ ...uomObject });
      setLocatorHook({...locatorObj})
      // return {uomObject, locatorObj}
    } catch (error) {
      console.log("Error fetching Uom master details.", error);
    }
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
  
