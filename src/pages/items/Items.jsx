// ItemsPage.js
import React, { useState, useEffect, useCallback } from "react";
import { Button, Modal, Input, message } from "antd";
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
import Loader from "../../components/Loader";

const ItemsPage = () => {
  const dispatch = useDispatch()

  const {token} = useSelector(state=> state.auth)
  const {data: itemData} = useSelector(state => state.item)
  const {data: vendorData} = useSelector(state => state.vendors)
  const {data: locationData} = useSelector(state => state.locations)
  const {data: locatorData} = useSelector(state => state.locators)
  const {data: uomData} = useSelector(state => state.uoms)
  const {vendorObj} = useSelector(state => state.vendors)
  const {uomObj} = useSelector(state => state.uoms)
  const [itemDepVar, setItemDepVar] = useState(null)



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
  const [validateDepVar, setValidateDepVar] = useState({
    validateCategory: false,
    validateSubCategory: false,
    validateType: false,
    validateDiscipline: false,
    validateUom: false,
    validateUsageCategory: false
  })

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

    if(itemDepVar){
      if(itemDepVar.categoryVal === tempItem.category && 
        itemDepVar.subCategoryVal === tempItem.subCategory &&
        itemDepVar.typeVal === tempItem.type &&
        itemDepVar.disciplineVal === tempItem.disciplines &&
        Number(itemDepVar.uomVal) === tempItem.uomId &&
        itemDepVar.usageCatgeoryVal === tempItem.usageCategory
      ) {
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
      }
      else{
        message.error("Please put the correct values.")
        setValidateDepVar({
          validateCategory: itemDepVar.categoryVal !== tempItem.category ? true : false,
          validateSubCategory: itemDepVar.subCategoryVal !== tempItem.subCategory ? true : false,
          validateType: itemDepVar.typeVal !== tempItem.type ? true : false,
          validateDiscipline: itemDepVar.disciplineVal !== tempItem.disciplines ? true : false,
          validateUom: Number(itemDepVar.uomVal) !== tempItem.uomId ? true : false,
          validateUsageCategory: itemDepVar.usageCategoryVal !== tempItem.usageCategory ? true : false
        })
      }
    }else{
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
    }


    dispatch(fetchItemData())


    // setVisible(false);
  };

  // console.log("Itemdepvar: ", itemDepVar)
  // console.log("Validate: ", validateDepVar)

  const fetchTypes = async (selectedCategory, selectedSubCategory) => {
    try {
      const {responseData} = await apiCall("POST",
        "/genparam/getAllItemTypeByDtls",
        token,
        {
          categoryCode: selectedCategory,
          subCategoryCode: selectedSubCategory,
        },
      );
      // const data = response?.data?.responseData || [];
      return responseData || [];
    } catch (error) {
      console.error("Error fetching types:", error);
    }
  };

  const fetchDisciplines = async (selectedCategory, selectedSubCategory, selectedType) => {
    try {
      const {responseData} = await apiCall("POST",
        "/genparam/getAllDisciplineByDtls",
        token,
        {
          categoryCode: selectedCategory,
          subCategoryCode: selectedSubCategory,
          typeCode: selectedType,
        },
      );
      return responseData || [];
    } catch (error) {
      console.error("Error fetching disciplines:", error);
    }
  };

  const fetchSubCategories = async (selectedCategory) => {
    try {
      const {responseData} = await apiCall("POST",
        "/genparam/getAllSubCategoriesByDtls",
        token,
        {
          categoryCode: selectedCategory,
        },
      );
      // const data = responseData || [];
      // Assuming the response contains an array of subcategory options
      // const subcategoryOptions = data.map((subcategory) => ({
      //   key: subcategory.subCategoryCode,
      //   value: subcategory.subCategoryDesc,
      // }));
      // setSubCategoryOptions(subcategoryOptions);
      return responseData || [];
    } catch (error) {
      console.error("Error fetching subcategories:", error);
    }
  };

  const setItemDependentValues = async (data, formValues)=> {
    // console.log("data: ", data, formValues)
    const {uomId, category, subCategory, type, disciplines, usageCategory} = data
    const [subCategoryOptions, typeOptions, disciplineOptions] = await Promise.all([fetchSubCategories(category), fetchTypes(category, subCategory), fetchDisciplines(category, subCategory, type)])
    const uomDesc = uomObj[parseInt(uomId)]
    const categoryDesc = categories.find(record => record.paramVal === category)?.paramDesc
    const subCategoryDesc = subCategoryOptions?.find(record => record.subCategoryCode === subCategory)?.subCategoryDesc
    const typeDesc = typeOptions?.find(record => record.typeCode === type)?.typeDesc
    const disciplineDesc = disciplineOptions?.find(record => record.disciplineCode === disciplines)?.disciplineName
    const usageCategoryDesc = usageCategories?.find(record => record.paramVal === usageCategory)?.paramDesc

    if(category !== formValues.category || 
      subCategory !== formValues.subCategory ||
      type !== formValues.type ||
      disciplines !== formValues.disciplines ||
      Number(itemDepVar.uomVal) !== Number(formValues.uomId) ||
      usageCategory !== formValues.usageCategory
    ) {
      message.error("Variables input for the item name doesnt match. Please correct and submit again.")
      setItemDepVar({
        uomVal:  uomId,
        categoryVal: category,
        subCategoryVal : subCategory,
        typeVal: type,
        disciplineVal: disciplines,
        usageCatgeoryVal: usageCategory,
        uomDesc,
        categoryDesc,
        subCategoryDesc,
        typeDesc,
        disciplineDesc,
        usageCategoryDesc
      })
    }


  }

  if(!itemData || !vendorData || !locationData || !locatorData || !uomData || !vendorObj || !uomObj){
    return <Loader />
  }

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
        open={visible}
        onCancel={() => {
          setEditingItem(null);
          setVisible(false);
        }}
        footer={null}
        width={1200}
      >
        <div className="modal-wrapper">
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
          setItemDependentValues = {setItemDependentValues}
          validateDepVar = {validateDepVar}
        />
        {
          itemDepVar &&
          <div style={{width: "50%", padding: '1rem', border: '1px solid #bbbbbb', height: 'fit-content'}}>
            <h2 style={{color: "red", fontWeight: "bold"}}>Correct values for given Item Name</h2>
            <br /> <br />
            <div style={{display: "flex", gap: "0.5rem"}}>
              <h3 style={{fontWeight: "700"}}>Category: </h3>
              <h3 style={{fontWeight: "400"}}>{itemDepVar.categoryDesc}</h3>
            </div>
            <br />
            <div style={{display: "flex", gap: "0.5rem"}}>
              <h3 style={{fontWeight: "700"}}>Sub Category: </h3>
              <h3 style={{fontWeight: "400"}}>{itemDepVar.subCategoryDesc}</h3>
            </div>
            <br />
            <div style={{display: "flex", gap: "0.5rem"}}>
              <h3 style={{fontWeight: "700"}}>Type: </h3>
              <h3 style={{fontWeight: "400"}}>{itemDepVar.typeDesc}</h3>
            </div>
            <br />
            <div style={{display: "flex", gap: "0.5rem"}}>
              <h3 style={{fontWeight: "700"}}>Discipline: </h3>
              <h3 style={{fontWeight: "400"}}>{itemDepVar.disciplineDesc}</h3>
            </div>
            <br />
            <div style={{display: "flex", gap: "0.5rem"}}>
              <h3 style={{fontWeight: "700"}}>UOM: </h3>
              <h3 style={{fontWeight: "400"}}>{itemDepVar.uomDesc}</h3>
            </div>
            <div style={{display: "flex", gap: "0.5rem"}}>
              <h3 style={{fontWeight: "700"}}>Usage Category: </h3>
              <h3 style={{fontWeight: "400"}}>{itemDepVar.usageCategoryDesc}</h3>
            </div>
          </div>
        }
        </div>
      </Modal>

    </div>
  );
};

export default ItemsPage;
