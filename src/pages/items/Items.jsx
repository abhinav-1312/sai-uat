// ItemsPage.js
import React, { useState, useEffect } from "react";
import { Button, Modal, Input } from "antd";
import ItemsTable from "./ItemsTable";
import ItemsForm from "./ItemsForm";
import dayjs from "dayjs";

const apiRequest = async (url, method, requestData) => {
  const options = {
    method: method,
    headers: {
      "Content-Type": "application/json",
    },
  };

  if (method === "POST") {
    options["body"] = JSON.stringify(requestData);
  }

  try {
    const response = await fetch(url, options);
    const data = await response.json();
    return data.responseData;
  } catch (error) {
    console.error("Error: ", error);
  }
};

const ItemsPage = () => {
  const [items, setItems] = useState([]);
  const [visible, setVisible] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [searchText, setSearchText] = useState("");

  const [selectedId, setSelectedId] = useState(null);
  const [uoms, setUoms] = useState([]);
  const [locations, setLocations] = useState([]);
  const [locators, setLocators] = useState([]);
  const [vendors, setVendors] = useState([]);

  const itemNames = {
    "001": "Arrow Pullar",
    "002": "Arrow Liner",
    "003": "Arm Guard",
    "004": "Arrow Rest Plastic",
    "005": "Beiter Clicker",
    "006": "Bow Guage",

  };

  // const types = [{ id: "9", value: "NA" }];
  const types = {
    9: "NA",
    1: "Track",
    2: "Field",

  };
  // const disciplines = [
  //   { id: "01", value: "Archery" },
  //   { id: "11", value: "Common Use" },
  //   { id: "10", value: "Wrestling" },
  // ];
  const disciplines = {
    "01": "Archery",
    11: "Common Use",
    10: "Wrestling",
  };

  // const subCategories = [
  //   { id: "1", value: "Games" },
  //   { id: "2", value: "Athletics" },
  //   { id: "9", value: "NA" },
  // ];
  const subCategories = {
    2: "Games",
    1: "Athletics",
    9: "NA",
  };

  // const categories = [
  //   { id: "1", value: "FOP" },
  //   { id: "2", value: "NON FOP" },
  // ];
  const categories = {
    1: "FOP",
    2: "NON FOP",
  };

  // const sizes = [
  //   { id: "001", value: "Normal" },
  //   { id: "003", value: "Small" },
  // ];
  const sizes = {
    "001": "Normal",
    "002": "0",
    "003": "25",
  };

  // const usageCategories = [
  //   { id: "2", value: "Non consumable" },
  //   { id: "1", value: "Consumable" },
  // ];
  const usageCategories = {
    2: "Non consumable",
    1: "Consumable",
  };

  // const brands = [
  //   { id: "001", value: "Fivics" },
  //   { id: "002", value: "Beiter" },
  //   { id: "003", value: "Fivis" },
  //   { id: "004", value: "Hoyt" },
  //   { id: "005", value: "Indegeneous" },
  // ];

  const brands = {
    "001": "Fivics",
    "002": "Beiter",
    "003": "Fivis",
    "004": "Hoyt",
    "005": "Indegeneous",
  };

  // const colors = [
  //   { id: "01", value: "Black" },
  //   { id: "02", value: "Silver" },
  //   { id: "03", value: "Multicoloured" },
  //   { id: "04", value: "White" },
  // ];
  const colors = {
    "01": "Black",
    "02": "Silver",
    "03": "Multicoloured",
    "04": "White",
    "07": "Yellow",
  };

  const getUoms = async () => {
    const uomResponse = await apiRequest(
      "https://sai-services.azurewebsites.net/sai-inv-mgmt/master/getUOMMaster",
      "GET"
    );

    setUoms(uomResponse);
  };

  const getLocations = async () => {
    const locationsResponse = await apiRequest(
      "https://sai-services.azurewebsites.net/sai-inv-mgmt/master/getLocationMaster",
      "GET"
    );
    setLocations(locationsResponse);
  };

  const getLocators = async () => {
    const locatorsResponse = await apiRequest(
      "https://sai-services.azurewebsites.net/sai-inv-mgmt/master/getLocatorMaster",
      "GET"
    );
    setLocators(locatorsResponse);
  };

  const getVendors = async () => {
    const vendorsResponse = await apiRequest(
      "https://sai-services.azurewebsites.net/sai-inv-mgmt/master/getVendorMaster",
      "GET"
    );
    setVendors(vendorsResponse);
  };

  const getItems = async () => {
    try {
      const response = await fetch(
        "https://sai-services.azurewebsites.net/sai-inv-mgmt/master/getItemMaster"
      );

      const { responseData } = await response.json();

      const itemList = await Promise.all(
        responseData.map(async (item) => {
          const uomResponse = await apiRequest(
            "https://sai-services.azurewebsites.net/sai-inv-mgmt/master/getUOMMasterById",
            "POST",
            {
              id: item.uomId,
              userId: "string",
            }
          );

          const locationResponse = await apiRequest(
            "https://sai-services.azurewebsites.net/sai-inv-mgmt/master/getLocationMasterById",
            "POST",
            {
              locationId: item.locationId,
              userId: "string",
            }
          );

          const locatorResponse = await apiRequest(
            "https://sai-services.azurewebsites.net/sai-inv-mgmt/master/getLocatorMasterById",
            "POST",
            {
              id: item.locatorId,
              userId: "string",
            }
          );

          const vendorResponse = await apiRequest(
            "https://sai-services.azurewebsites.net/sai-inv-mgmt/master/getVendorMasterById",
            "POST",
            {
              id: item.vendorId + 1,
              userId: "string",
            }
          );

          return {
            key: item.id,
            id: item.id,
            itemCode: item.itemMasterCd,
            itemDescription: item.itemName
              ? itemNames[item.itemName]
              : "Default",
            uom: uomResponse?.uomName || "default UOM",
            quantityOnHand: item.quantity,
            location: locationResponse?.locationName,
            locatorCode: locatorResponse?.location,
            price: item.price,
            vendorDetail: vendorResponse?.vendorName,
            category: item.category ? categories[item.category] : "Default",
            subcategory: item.subCategory
              ? subCategories[item.subCategory]
              : "Default",
            type: item.type ? types[item.type] : "Default",
            disciplines: item.disciplines
              ? disciplines[item.disciplines]
              : "Default",
            brand: item.brandId ? brands[item.brandId] : "Default",
            colour: item.colorId ? colors[item.colorId] : "Default",
            size: item.size ? sizes[item.size] : "Default",
            usageCategory: item.usageCategory
              ? usageCategories[item.usageCategory]
              : "Default",
            reOrderPoint: 1,
            minStockLevel: item.minStockLevel,
            maxStockLevel: item.maxStockLevel,
            status: item.status === "A" ? "Active" : "InActive",
            endDate: new Date(item.endDate).toISOString().split("T")[0],
          };
        })
      );
      setItems(itemList);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const init = () => {
    getUoms();
    getLocations();
    getLocators();
    getVendors();
    getItems();
  };

  useEffect(() => {
    init();
  }, []);

  const getItem = async (id) => {
    const itemResponse = await apiRequest(
      "https://sai-services.azurewebsites.net/sai-inv-mgmt/master/getItemMasterById",
      "POST",
      {
        id: id,
        userId: "12345",
      }
    );
    return itemResponse;
  };

  const handleEdit = async ({ id }) => {
    setSelectedId(id);
    const item = await getItem(id);
    const dateObject = new Date(item.endDate);
    const year = dateObject.getFullYear();
    const month = dateObject.getMonth(); // Months are zero-based, so add 1
    const date = dateObject.getDate();
    const tempItem = {
      ...item,
      endDate: dayjs(new Date(year, month, date)),
      reOrderPoint: 1,
    };
    setEditingItem(tempItem);
    setVisible(true);
  };

  const handleDelete = async (itemId) => {
    // Implement delete logic here
    await apiRequest(
      "https://sai-services.azurewebsites.net/sai-inv-mgmt/master/deleteItemMaster",
      "POST",
      {
        id: itemId,
        userId: "12345",
      }
    );
    getItems();
  };

  const handleFormSubmit = async (values) => {
    setEditingItem(null);
    const tempItem = {
      ...values,
      
      uomId: Number(values.uomId),
      createUserId: "12345",
      endDate: values.endDate.format("DD/MM/YYYY"),
      itemName: values.itemMasterDesc,
    };

    if (!tempItem.itemMasterCd) {
      delete tempItem.itemMasterCd;
    }
    delete tempItem.reOrderPoint;

    if (editingItem) {
      if (selectedId) {
        tempItem["itemMasterId"] = selectedId;
      }
      // Implement update logic here
      await apiRequest(
        "https://sai-services.azurewebsites.net/sai-inv-mgmt/master/updateItemMaster",
        "POST",
        tempItem
      );
    } else {
      // Implement create logic here
      await apiRequest(
        "https://sai-services.azurewebsites.net/sai-inv-mgmt/master/saveItemMaster",
        "POST",
        tempItem
      );
    }
    getItems();
    setVisible(false);
  };

  return (
    <div>
      <div
        style={{
          marginBottom: "16px",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Input
          placeholder="Search items"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: "200px" }}
        />
        <Button
          type="primary"
          className="saitheme-btn"
          onClick={() => setVisible(true)}
        >
          Add Item
        </Button>
      </div>
      <ItemsTable
        // items={items.filter((item) =>
        //   item.itemDescription.toLowerCase().includes(searchText.toLowerCase()) ||
        //   item.itemCode.toLowerCase().includes(searchText.toLowerCase())
        // )}
        items={items.filter((item) =>
          Object.values(item).some(
            (value) =>
              typeof value === "string" &&
              value.toLowerCase().includes(searchText.toLowerCase())
          )
        )}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Modal
        title={editingItem ? "Edit Item" : "Add Item"}
        visible={visible}
        onCancel={() => {
          setEditingItem(null);
          setVisible(false);
        }}
        footer={null}
      >
        <ItemsForm
          key={editingItem ? `edit-${editingItem.id}` : "add"}
          onSubmit={handleFormSubmit}
          initialValues={editingItem}
          uoms={uoms}
          locations={locations}
          locators={locators}
          vendors={vendors}
          brands={brands}
          colors={colors}
          itemNames={itemNames}
          types={types}
          subCategories={subCategories}
          categories={categories}
          usageCategories={usageCategories}
          sizes={sizes}
          disciplines={disciplines}
        />
      </Modal>
    </div>
  );
};

export default ItemsPage;
