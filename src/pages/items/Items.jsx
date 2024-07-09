// ItemsPage.js
import React, { useState, useEffect, useCallback } from "react";
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
import { apiCall, convertEpochToDateString } from "../../utils/Functions";
import { useDispatch, useSelector } from "react-redux";
import { fetchItemData } from "../../redux/slice/itemSlice";



const ItemsPage = () => {
  const dispatch = useDispatch()

  const {token} = useSelector(state=> state.auth)
  const {data: itemData} = useSelector(state => state.item)
  const {data: vendorData} = useSelector(state => state.vendors)
  const {data: locationData} = useSelector(state => state.locations)
  const {data: locatorData} = useSelector(state => state.locators)
  const {data: uomData} = useSelector(state => state.uoms)
  const {vendorObj} = useSelector(state => state.vendors)

  const itemList = itemData?.map(item=>{
    return{
      key: item.id,
        id: item.id,
        itemCode: item.itemMasterCd,
        itemDescription: item.itemMasterDesc,
        uom: item.uomDtls.uomName,
        price: item.price,
        vendorDetail: vendorObj[parseInt(item.vendorId)],
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
        endDate: convertEpochToDateString(item.endDate)
    }
  })

  const [visible, setVisible] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [brands, setBrands] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [sizes, setSizes] = useState([]);
  const [colors, setColors] = useState([]);
  const [usageCategories, setUsageCategories] = useState([]);
  const [categories, setCategories] = useState([]);

  const getBrands = useCallback(async () => {
    const brandsResponse = await apiCall(
      "GET",
      "/genparam/getAllBrands",
      token
    );

    setBrands(brandsResponse?.responseData || []);
  }, [token]);

  const getSizes = useCallback(async () => {
    const sizesResponse = await apiCall(
      "GET",
      "/genparam/getAllSizes",
      token
    );

    setSizes(sizesResponse?.responseData || []);
  }, [token]);

  const getColors = useCallback(async () => {
    const colorsResponse = await apiCall(
      "GET",
      "/genparam/getAllColors",
      token
    );

    setColors(colorsResponse?.responseData || []);
  }, [token]);


  const getUsageCategories = useCallback(async () => {
    const usageCategoriesRespone = await apiCall(
      "GET",
      "/genparam/getAllUsageCategories",
      token
    );

    setUsageCategories(usageCategoriesRespone?.responseData || []);
  }, [token]);

  const getCategories = useCallback(async () => {
    const categoriesRespone = await apiCall(
      "GET",
      "/genparam/getAllCategories",
      token
    );

    setCategories(categoriesRespone?.responseData || []);
  }, [token]);


  useEffect(() => {
    getBrands()
    getSizes()
    getColors()
    getUsageCategories()
    getCategories()
  }, [getBrands, getSizes, getColors, getUsageCategories, getCategories]);


  const getItem = async (id) => {
    const itemResponse = await apiCall(
      "POST",
      "/master/getItemMasterById",
      token,
      {
        id: id,
        userId: userCd,
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

  const {userCd} = useSelector(state => state.auth)
  const handleDelete = async (itemId) => {
    // Implement delete logic here
    await apiCall(
      "POST",
      "/master/deleteItemMaster",
      token,
      {
        id: itemId,
        userId: userCd,
      }
    );
    dispatch(fetchItemData())
  };


  const handleFormSubmit = async (values) => {
    setEditingItem(null);
    const tempItem = {
      ...values,

      uomId: Number(values.uomId),
      createUserId: userCd,
      endDate: values.endDate.format("DD/MM/YYYY"),
    };

    if (!tempItem.itemMasterCd) {
      delete tempItem.itemMasterCd;
    }

    if (editingItem) {
      if (selectedId) {
        tempItem["itemMasterId"] = selectedId;
      }

      await apiCall(
        "POST",
        "/master/updateItemMaster",
        token,
        tempItem
      );
    } else {
      // Implement create logic here
      await apiCall(
        "POST",
        "/master/saveItemMaster",
        token,
        tempItem
      );
    }

    dispatch(fetchItemData())
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
    
        items={itemList?.filter((item) =>
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
          uoms={uomData}
          locations={locationData}
          locators={locatorData}
          vendors={vendorData}
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
