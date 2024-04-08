// ItemsPage.js
import React, { useState, useEffect } from "react";
import { Button, Modal, Input } from "antd";
import ItemsTable from "./ItemsTable";
import ItemsForm from "./ItemsForm";
import dayjs from "dayjs";
import {
  itemNames,
  types,
  allDisciplines,
  subCategories,
} from "./KeyValueMapping";
import { apiHeader } from "../../utils/Functions";

const apiRequest = async (url, method, requestData) => {
  const token = localStorage.getItem("token");
  const options = {
    method: method,
    headers: {
      "Content-Type": "application/json",
      'Authorization': `Bearer ${token}`,
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
  const [brands, setBrands] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [uoms, setUoms] = useState([]);
  const [locations, setLocations] = useState([]);
  const [locators, setLocators] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [colors, setColors] = useState([]);
  const [usageCategories, setUsageCategories] = useState([]);
  const [categories, setCategories] = useState([]);

  const getUoms = async () => {
    const uomResponse = await apiRequest(
      "https://uat-sai-app.azurewebsites.net/sai-inv-mgmt/master/getUOMMaster",
      "GET"
    );

    setUoms(uomResponse);
  };
  const getBrands = async () => {
    const brandsResponse = await apiRequest(
      "https://uat-sai-app.azurewebsites.net/sai-inv-mgmt/genparam/getAllBrands",
      "GET"
    );

    setBrands(brandsResponse);
  };
  const getSizes = async () => {
    const sizesResponse = await apiRequest(
      "https://uat-sai-app.azurewebsites.net/sai-inv-mgmt/genparam/getAllSizes",
      "GET"
    );

    setSizes(sizesResponse);
  };
  const getColors = async () => {
    const colorsResponse = await apiRequest(
      "https://uat-sai-app.azurewebsites.net/sai-inv-mgmt/genparam/getAllColors",
      "GET"
    );

    setColors(colorsResponse);
  };
  const getUsageCategories = async () => {
    const usageCategoriesRespone = await apiRequest(
      "https://uat-sai-app.azurewebsites.net/sai-inv-mgmt/genparam/getAllUsageCategories",
      "GET"
    );

    setUsageCategories(usageCategoriesRespone);
  };
  const getCategories = async () => {
    const categoriesRespone = await apiRequest(
      "https://uat-sai-app.azurewebsites.net/sai-inv-mgmt/genparam/getAllCategories",
      "GET"
    );

    setCategories(categoriesRespone);
  };

  const getLocations = async () => {
    const locationsResponse = await apiRequest(
      "https://uat-sai-app.azurewebsites.net/sai-inv-mgmt/master/getLocationMaster",
      "GET"
    );
    setLocations(locationsResponse);
  };

  const getLocators = async () => {
    const locatorsResponse = await apiRequest(
      "https://uat-sai-app.azurewebsites.net/sai-inv-mgmt/master/getLocatorMaster",
      "GET"
    );
    setLocators(locatorsResponse);
  };

  const getVendors = async () => {
    const vendorsResponse = await apiRequest(
      "https://uat-sai-app.azurewebsites.net/sai-inv-mgmt/master/getVendorMaster",
      "GET"
    );
    setVendors(vendorsResponse);
  };

  const token = localStorage.getItem("token")

  const getItems = async () => {
    try {
      const response = await fetch(
        "https://uat-sai-app.azurewebsites.net/sai-inv-mgmt/master/getItemMaster", apiHeader("GET", token)
      );

      const { responseData } = await response.json();

      const itemList = await Promise.all(
        responseData.map(async (item) => {
          // const uomResponse = await apiRequest(
          //   "https://uat-sai-app.azurewebsites.net/sai-inv-mgmt/master/getUOMMasterById",
          //   "POST",
          //   {
          //     id: item.uomId,
          //     userId: "string",
          //   }
          // );

          // const locationResponse = await apiRequest(
          //   "https://uat-sai-app.azurewebsites.net/sai-inv-mgmt/master/getLocationMasterById",
          //   "POST",
          //   {
          //     locationId: item.locationId,
          //     userId: "string",
          //   }
          // );

          // const locatorResponse = await apiRequest(
          //   "https://uat-sai-app.azurewebsites.net/sai-inv-mgmt/master/getLocatorMasterById",
          //   "POST",
          //   {
          //     id: item.locatorId,
          //     userId: "string",
          //   }
          // );

          const vendorResponse = await apiRequest(
            "https://uat-sai-app.azurewebsites.net/sai-inv-mgmt/master/getVendorMasterById",
            "POST",
            {
              id: item.vendorId,
              userId: "string",
            }
          );

          return {
            key: item.id,
            id: item.id,
            itemCode: item.itemMasterCd,
            itemDescription: item.itemMasterDesc,
            // uom: uomResponse?.uomName || "default UOM",
            uom: item.uomDtls.uomName,
            // quantityOnHand: item.quantity,
            // location: locationResponse?.locationName,
            // locatorCode: locatorResponse?.locatorCd,
            // locatorDesc: locatorResponse?.locatorDesc,
            price: item.price,
            vendorDetail: vendorResponse.vendorName,
            category: item.categoryDesc,
            subcategory: item.subCategoryDesc,
            type: item.typeDesc,
            disciplines: item.disciplinesDesc,
            brand: item.brandDesc,
            colour: item.colorDesc,
            size: item.sizeDesc,
            usageCategory: item.usageCategoryDesc,
            reOrderPoint: item.reOrderPoint ? item.reOrderPoint : "null",
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
    getBrands();
    getSizes();
    getColors();
    getUsageCategories();
    getCategories();
  };

  useEffect(() => {
    init();
  }, []);

  const getItem = async (id) => {
    const itemResponse = await apiRequest(
      "https://uat-sai-app.azurewebsites.net/sai-inv-mgmt/master/getItemMasterById",
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
      "https://uat-sai-app.azurewebsites.net/sai-inv-mgmt/master/deleteItemMaster",
      "POST",
      {
        id: itemId,
        userId: "12345",
      }
    );
    getItems();
  };

  const generate3DigitRandString = () => {
    // Generate a random number between 0 and 999 (inclusive)
    const randomNumber = Math.floor(Math.random() * 1000);

    // Convert the random number to a string
    let randomNumberString = randomNumber.toString();

    // Pad the string with leading zeros if necessary
    if (randomNumberString.length < 3) {
      randomNumberString = randomNumberString.padStart(3, "0");
    }

    return randomNumberString;
  };

  const handleFormSubmit = async (values) => {
    setEditingItem(null);
    const tempItem = {
      ...values,

      uomId: Number(values.uomId),
      createUserId: "12345",
      endDate: values.endDate.format("DD/MM/YYYY"),
      itemName: itemNames[values.itemMasterDesc]
        ? values.itemMasterDesc
        : generate3DigitRandString(),
      itemMasterDesc: itemNames[values.itemMasterDesc] || values.itemMasterDesc,
    };

    if (!tempItem.itemMasterCd) {
      delete tempItem.itemMasterCd;
    }

    if (editingItem) {
      if (selectedId) {
        tempItem["itemMasterId"] = selectedId;
      }

      const data = await apiRequest(
        "https://uat-sai-app.azurewebsites.net/sai-inv-mgmt/master/updateItemMaster",
        "POST",
        tempItem
      );
    } else {
      // Implement create logic here
      const data = await apiRequest(
        "https://uat-sai-app.azurewebsites.net/sai-inv-mgmt/master/saveItemMaster",
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
          disciplines={allDisciplines}
        />
      </Modal>
    </div>
  );
};

export default ItemsPage;
