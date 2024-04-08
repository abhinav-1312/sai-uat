import {Table, Button} from "antd"
export const handleSearch = (searchText, itemData, setHook, setSearch=null) => {
  if(setSearch !== null)
    setSearch(searchText)
  const filtered = itemData.filter((parentObject) =>
    recursiveSearch(parentObject, searchText)
  );
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
  console.log("Sleect hook: ", selectHook)
  console.log("Valur obj: ", valueObj)
  selectHook = selectHook || []
  const index = selectHook?.findIndex((item) => item.id === valueObj.id);
  console.log("Index: ", index)
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