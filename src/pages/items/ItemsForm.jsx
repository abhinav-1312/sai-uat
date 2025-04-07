// ItemsForm.js
import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Button,
  Select,
  DatePicker,
  Row,
  Col,
  InputNumber,
  message,
} from "antd";
import axios from "axios";
import { apiCall, apiHeader } from "../../utils/Functions";
import { useSelector } from "react-redux";

const { Option } = Select;

const ItemsForm = ({
  onSubmit,
  initialValues,
  uoms,
  locations,
  locators,
  vendors,
  brands,
  colors,
  sizes,
  categories,
  usageCategories,
  validateDepVar,
  setValidateDepVar,
  setItemDepVar
}) => {
  const [form] = Form.useForm();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [selectedDiscipline, setSelectedDiscipline] = useState(null);
  const [subCategoryOptions, setSubCategoryOptions] = useState([]);
  const [typeOptions, setTypeOptions] = useState([]);
  const [disciplineOptions, setDisciplineOptions] = useState([]);
  const [disciplinesDisabled, setDisciplinesDisabled] = useState(true);
  const [itemDescriptionOptions, setItemDescriptionOptions] = useState([]);
  const [itemDescriptionDisabled, setItemDescriptionDisabled] = useState(true);

  const {token} = useSelector(state => state.auth)
  const {uomObj} = useSelector(state => state.uoms)

  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
    setSelectedSubCategory(null);
    setSelectedType(null);
    setSelectedDiscipline(null);
    setDisciplinesDisabled(true);
    setItemDescriptionDisabled(true);
  };

  const handleSubCategoryChange = (value) => {
    setSelectedSubCategory(value);
    setSelectedType(null);
    setSelectedDiscipline(null);
    setDisciplinesDisabled(true);
    setItemDescriptionDisabled(true);
  };

  const handleTypeChange = (value) => {
    setSelectedType(value);
    setSelectedDiscipline(null);
    setDisciplinesDisabled(false);
    setItemDescriptionDisabled(true);
  };

  const handleDisciplineChange = (value) => {
    setSelectedDiscipline(value);
    setItemDescriptionDisabled(true);
  };

  useEffect(() => {
    if (selectedCategory) {
      const fetchSubCategories = async () => {
        try {
          const response = await axios.post(
            "/genparam/getAllSubCategoriesByDtls",
            {
              categoryCode: selectedCategory,
            },
            apiHeader("POST", token)
          );
          const data = response?.data?.responseData || [];
          // Assuming the response contains an array of subcategory options
          const subcategoryOptions = data.map((subcategory) => ({
            key: subcategory.subCategoryCode,
            value: subcategory.subCategoryDesc,
          }));
          setSubCategoryOptions(subcategoryOptions);
        } catch (error) {
          console.error("Error fetching subcategories:", error);
        }
      };

      fetchSubCategories();
    }
  }, [selectedCategory, token]);

  useEffect(() => {
    if (selectedSubCategory) {
      const fetchTypes = async () => {
        try {
          const response = await axios.post(
            "/genparam/getAllItemTypeByDtls",
            {
              categoryCode: selectedCategory,
              subCategoryCode: selectedSubCategory,
            },
            apiHeader("POST", token)
          );
          const data = response?.data?.responseData || [];
          const typeOptions = data.map((type) => ({
            key: type.typeCode,
            value: type.typeDesc,
          }));
          setTypeOptions(typeOptions);
        } catch (error) {
          console.error("Error fetching types:", error);
        }
      };

      fetchTypes();
    }
  }, [selectedSubCategory, selectedCategory, token]);

  useEffect(() => {
    if (selectedType) {
      const fetchDisciplines = async () => {
        try {
          const response = await axios.post(
            "/genparam/getAllDisciplineByDtls",
            {
              categoryCode: selectedCategory,
              subCategoryCode: selectedSubCategory,
              typeCode: selectedType,
            },
            apiHeader("POST", token)
          );
          const data = response?.data?.responseData || [];
          const disciplineOptions = data.map((discipline) => ({
            key: discipline.disciplineCode,
            value: discipline.disciplineName,
          }));
          setDisciplineOptions(disciplineOptions);
          setDisciplinesDisabled(false);
        } catch (error) {
          console.error("Error fetching disciplines:", error);
        }
      };
      fetchDisciplines();
    }
  }, [selectedType, selectedSubCategory, selectedCategory, token]);

  useEffect(() => {
    if (selectedDiscipline) {
      const fetchItemDescriptions = async () => {
        try {
          const response = await axios.post(
            "/genparam/getAllItemNamesByDtls",
            {
              categoryCode: selectedCategory,
              subCategoryCode: selectedSubCategory,
              typeCode: selectedType,
              disciplineCode: selectedDiscipline,
            },
            apiHeader("POST", token)
          );
          const data = response?.data?.responseData || [];
          const itemDescriptionOptions = data.map((itemDescription) => ({
            value: itemDescription.itemName,
            key: itemDescription.itemNameCode,
          }));
          setItemDescriptionOptions(itemDescriptionOptions);
          setItemDescriptionDisabled(false);
        } catch (error) {
          console.error("Error fetching item descriptions:", error);
          message.error("Error fetching item descriptions")
        }
      };
      fetchItemDescriptions();
    }
  }, [
    selectedDiscipline,
    selectedType,
    selectedSubCategory,
    selectedCategory,
    token,
  ]);

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
      return responseData || [];
    } catch (error) {
      console.error("Error fetching subcategories:", error);
    }
  };

  const onFinish = async (values) => {
    const itemMasterDescCopy = values.itemMasterDesc[0]
    const combinedCodeAndDesc = itemMasterDescCopy.split("$#")

    try{
      const {responseData, responseStatus} = await apiCall("POST", '/master/validateDuplicateItemName', token, {itemName: combinedCodeAndDesc.length === 1 ? combinedCodeAndDesc[0] : combinedCodeAndDesc[1]});
      // item already exists in the organization
      if(responseStatus && responseStatus.errorType === "Item Code already exist"){
        message.error("Item code does not exist.")
        if(combinedCodeAndDesc.length === 1){
          values = { ...values, itemName: null, itemMasterDesc: itemMasterDescCopy };
          onSubmit(values)
        }
        else{
          const itemName= combinedCodeAndDesc[0];
          const itemMasterDesc = combinedCodeAndDesc[1];
          values = { ...values, itemName, itemMasterDesc };
          onSubmit(values)
        }
        return;
      }
      // item code does not exists anywhere i.e. item has not been created yet by any organization
      else if(responseStatus && responseStatus.errorType === "Item Code doest not exist."){
        onSubmit({...values, itemName: null, itemMasterDesc: combinedCodeAndDesc[0]})
        return;
      }
      // item code exists (item is created) but in other organization, so need to check values
      if(responseData){
        const {uomId, category, subCategory, type, disciplines, usageCategory} = responseData
        const [subCategoryOptions, typeOptions, disciplineOptions] = await Promise.all([fetchSubCategories(category), fetchTypes(category, subCategory), fetchDisciplines(category, subCategory, type)])
        const uomDesc = uomObj[parseInt(uomId)];
        const categoryDesc = categories.find(record => Number(record.paramVal) === Number(category))?.paramDesc
        const subCategoryDesc = subCategoryOptions?.find(record => Number(record.subCategoryCode) === Number(subCategory))?.subCategoryDesc
        const typeDesc = typeOptions?.find(record => Number(record.typeCode) === Number(values.type))?.typeDesc
        const disciplineDesc = disciplineOptions?.find(record => Number(record.disciplineCode) === Number(disciplines))?.disciplineName
        const usageCategoryDesc = usageCategories?.find(record => Number(record.paramVal) === Number(usageCategory))?.paramDesc

        if(category !== values.category || 
          subCategory !== values.subCategory ||
          type !== values.type ||
          disciplines !== values.disciplines ||
          // Number(uomId) !== Number(values.uomId) ||
          usageCategory !== values.usageCategory
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

          setValidateDepVar({
            validateCategory: category !== values.category ? true : false,
            validateSubCategory: subCategory !== values.subCategory ? true : false,
            validateType: type !== values.type ? true : false,
            validateDiscipline: disciplines !== values.disciplines ? true : false,
            // validateUom:  Number(uomId) !== Number(values.uomId) ? true : false,
            validateUsageCategory: usageCategory !== values.usageCategory ? true : false
          })
        }else{
          if(combinedCodeAndDesc.length === 1){
            values = { ...values, itemName: null, itemMasterDesc: itemMasterDescCopy };
            onSubmit(values)
          }
          else{
            const itemName= combinedCodeAndDesc[0];
            const itemMasterDesc = combinedCodeAndDesc[1];
            values = { ...values, itemName, itemMasterDesc };
            onSubmit(values)
          }
        }
      }
    }
    catch(error){
      console.log("inside errr")
    }
  };

  console.log("Validate dep var: ", validateDepVar)

  console.log("SELECED SUBCAT: ", !selectedSubCategory)

  return (
    <Form
      form={form}
      onFinish={onFinish}
      initialValues={initialValues}
      layout="vertical"
      style={{padding: '1rem', border: '1px solid #bbbbbb'}}
    >
      <Row gutter={16}>
        <Col span={8}>
          <Form.Item name="itemMasterCd" label="Item Code">
            <Input disabled />
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item
          validateStatus={validateDepVar.validateCategory ? 'error' : ''}
          help={validateDepVar.validateCategory ? 'Please enter correct value.' : ''}
  
            name="category"
            label="Category"
            rules={[{ required: true, message: "Please enter Category" }]}
          >
            <Select onChange={handleCategoryChange} showSearch
              optionFilterProp="children"
              filterOption={(input, option) =>
                option?.children?.toLowerCase().includes(input.toLowerCase())
              }
              style={{
                borderColor: validateDepVar.validateCategory ? 'red' : undefined,
              }}
            >
              {categories?.map((category, index) => {
                return (
                  <Option key={index} value={category.paramVal}>
                    {category.paramDesc}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item
            name="subCategory"
            label="Sub-Category"
            rules={[{ required: true, message: "Please enter SUB-CATEGORY" }]}
            validateStatus={validateDepVar.validateSubCategory ? 'error' : ''}
          help={validateDepVar.validateSubCategory ? 'Please enter correct value.' : ''}
          >
            <Select
            showSearch
            optionFilterProp="children"
              filterOption={(input, option) =>
                option?.children?.toLowerCase().includes(input.toLowerCase())
              }
              disabled={!selectedCategory}
              onChange={handleSubCategoryChange}
              style={{
                borderColor: validateDepVar.validateSubCategory ? 'red' : undefined,
              }}
            >
              {subCategoryOptions?.map((option) => (
                <Option key={option.key} value={option.key}>
                  {option.value}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item
            name="type"
            label=" Type"
            rules={[{ required: true, message: "Please enter Item Type" }]}
            validateStatus={validateDepVar.validateType ? 'error' : ''}
          help={validateDepVar.validateType ? 'Please enter correct value.' : ''}
          >
            <Select disabled={!selectedSubCategory} onChange={handleTypeChange} showSearch
            optionFilterProp="children"
            filterOption={(input, option) =>
              option?.children?.toLowerCase().includes(input.toLowerCase())
            }
              style={{
                borderColor: validateDepVar.validatType ? 'red' : undefined,
              }}
            >
              {typeOptions?.map((option) => (
                <Option key={option.key} value={option.key}>
                  {option.value}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item
            name="disciplines"
            label="Disciplines"
            rules={[{ required: true, message: "Please enter Disciplines" }]}
            validateStatus={validateDepVar.validateDiscipline ? 'error' : ''}
          help={validateDepVar.validateDiscipline ? 'Please enter correct value.' : ''}
          >
            <Select showSearch
            optionFilterProp="children"
            filterOption={(input, option) =>
              option?.children?.toLowerCase().includes(input.toLowerCase())
            }
              disabled={disciplinesDisabled}
              onChange={handleDisciplineChange}
              style={{
                borderColor: validateDepVar.validatDiscipline ? 'red' : undefined,
              }}
            >
              {disciplineOptions?.map((discipline) => (
                <Option key={discipline.key} value={discipline.key}>
                  {discipline.value}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>

        

        <Col span={8}>
          <Form.Item
            name="itemMasterDesc"
            label="Item Description"
            rules={[
              { required: true, message: "Please enter Item Description" },
            ]}
          >
            <Select disabled={itemDescriptionDisabled} mode="tags" showSearch optionFilterProp="children"
              filterOption={(input, option) =>
                option?.children?.toLowerCase().includes(input.toLowerCase())
              }>
              {itemDescriptionOptions?.map((item) => (
                <Option key={item.key} value={item.key+"$#"+item.value}>
                  {item.value}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
      <Col span={8}>
          <Form.Item
            name="uomId"
            label="UOM"
            rules={[{ required: true, message: "Please enter UOM" }]}
            // validateStatus={validateDepVar.validateUom ? 'error' : ''}
            // help={validateDepVar.validateUom ? 'Please enter correct value.' : ''}
          >
            <Select showSearch
            optionFilterProp="children"
            filterOption={(input, option) =>
              option?.children?.toLowerCase().includes(input.toLowerCase())
            }
              style={{
                borderColor: validateDepVar.validateUom ? 'red' : undefined,
              }}
            >
              {uoms?.map((uom, index) => {
                return (
                  <Option key={index} value={uom.id}>
                    {uom.uomName}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="quantity"
            label="Quantity on Hand"
            rules={[
              { required: true, message: "Please enter Quantity on Hand" },
            ]}
          >
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="locationId"
            label="Location"
            rules={[{ required: true, message: "Please enter Location" }]}
          >
            <Select showSearch optionFilterProp="children"
              filterOption={(input, option) =>
                option?.children?.toLowerCase().includes(input.toLowerCase())
              }>
              {locations?.map((location, index) => {
                return (
                  <Option key={index} value={location.id}>
                    {location.locationName}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>

      <Col span={8}>
          <Form.Item
            name="locatorId"
            label="Locator Desc."
            rules={[{ required: true, message: "Please enter Locator Code" }]}
          >
            <Select showSearch optionFilterProp="children"
              filterOption={(input, option) =>
                option?.children?.toLowerCase().includes(input.toLowerCase())
              }>
              {locators?.map((locator, index) => {
                return (
                  <Option key={index} value={locator.id}>
                    {locator.locatorDesc}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="price"
            label="Price"
            rules={[{ required: true, message: "Please enter Price" }]}
          >
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="vendorId"
            label="Supplier Detail"
            rules={[
              { required: true, message: "Please enter Supplier Detail" },
            ]}
          >
            <Select showSearch optionFilterProp="children"
              filterOption={(input, option) =>
                option?.children?.toLowerCase().includes(input.toLowerCase())
              }>
              {vendors?.map((vendor, index) => {
                return (
                  <Option key={index} value={vendor.id}>
                    {vendor.vendorName}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
      </Row>

      <Row gutter={16}>
        <Col span={8}>
          <Form.Item
            name="brandId"
            label="Brand"
            rules={[{ required: true, message: "Please enter Brand " }]}
          >
            <Select showSearch optionFilterProp="children"
              filterOption={(input, option) =>
                option?.children?.toLowerCase().includes(input.toLowerCase())
              }>
              {brands?.map((brand, index) => {
                return (
                  <Option key={index} value={brand.paramVal}>
                    {brand.paramDesc}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="size"
            label="Size "
            rules={[{ required: true, message: "Please enter Size" }]}
          >
            <Select showSearch
              optionFilterProp="children"
              filterOption={(input, option) =>
                option?.children?.toLowerCase().includes(input.toLowerCase())
              }
            >
              {sizes?.map((size, index) => {
                return (
                  <Option key={index} value={size.paramVal}>
                    {size.paramDesc}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="colorId"
            label="Colour"
            rules={[{ required: true, message: "Please enter Colour" }]}
          >
            <Select showSearch
              optionFilterProp="children"
              filterOption={(input, option) =>
                option?.children?.toLowerCase().includes(input.toLowerCase())
              }
            >
              {colors?.map((color, index) => {
                return (
                  <Option key={index} value={color.paramVal}>
                    {color.paramDesc}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={8}>
          <Form.Item
            name="minStockLevel"
            label="Min. Stock Level"
            rules={[
              { required: true, message: "Please enter Minimum Stock Level" },
            ]}
          >
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="maxStockLevel"
            label="Max. Stock Level"
            rules={[
              { required: true, message: "Please enter Maximum Stock Level" },
            ]}
          >
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="reOrderPoint"
            label="Reorder Point"
            rules={[{ required: true, message: "Please enter Reorder Point" }]}
          >
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={8}>
          <Form.Item
            name="usageCategory"
            label="Usage Category"
            rules={[{ required: true, message: "Please enter Category" }]}
            validateStatus={validateDepVar.validateUsageCategory ? 'error' : ''}
            help={validateDepVar.validateUsageCategory ? 'Please enter correct value.' : ''}
          >
            <Select showSearch
            optionFilterProp="children"
            filterOption={(input, option) =>
              option?.children?.toLowerCase().includes(input.toLowerCase())
            }
              style={{
                borderColor: validateDepVar.validateUsageCategory ? 'red' : undefined,
              }}
            >
              {usageCategories?.map((usageCategory, index) => {
                return (
                  <Option key={index} value={usageCategory.paramVal}>
                    {usageCategory.paramDesc}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: "Please select Status" }]}
          >
            <Select showSearch>
              <Option value="A">Active</Option>
              <Option value="IA">Inactive</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="endDate"
            label="Create Date"
            rules={[{ required: true, message: "Please select Create date" }]}
          >
            <DatePicker />
          </Form.Item>
        </Col>
      </Row>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default ItemsForm;
