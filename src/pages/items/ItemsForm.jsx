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
} from "antd";
import axios from "axios";
import { apiHeader } from "../../utils/Functions";

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
  itemNames,
  sizes,
  categories,
  usageCategories,
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

  const token = localStorage.getItem("token");

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
    setDisciplinesDisabled(true);
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
            "https://uat-sai-app.azurewebsites.net/sai-inv-mgmt/genparam/getAllSubCategoriesByDtls",
            {
              categoryCode: selectedCategory,
            },
            apiHeader("POST", token)
          );
          const data = response.data.responseData;
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
            "https://uat-sai-app.azurewebsites.net/sai-inv-mgmt/genparam/getAllItemTypeByDtls",
            {
              categoryCode: selectedCategory,
              subCategoryCode: selectedSubCategory,
            },
            apiHeader("POST", token)
          );
          const data = response.data.responseData;
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
            "https://uat-sai-app.azurewebsites.net/sai-inv-mgmt/genparam/getAllDisciplineByDtls",
            {
              categoryCode: selectedCategory,
              subCategoryCode: selectedSubCategory,
              typeCode: selectedType,
            },
            apiHeader("POST", token)
          );
          const data = response.data.responseData;
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
            "https://uat-sai-app.azurewebsites.net/sai-inv-mgmt/genparam/getAllItemNamesByDtls",
            {
              categoryCode: selectedCategory,
              subCategoryCode: selectedSubCategory,
              typeCode: selectedType,
              disciplineCode: selectedDiscipline,
            },
            apiHeader("POST", token)
          );
          const data = response.data.responseData;
          const itemDescriptionOptions = data.map((itemDescription) => ({
            key: itemDescription.itemName,
            value: itemDescription.itemNameCode,
          }));
          setItemDescriptionOptions(itemDescriptionOptions);
          setItemDescriptionDisabled(false);
        } catch (error) {
          console.error("Error fetching item descriptions:", error);
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

  const onFinish = (values) => {
    values = { ...values, itemMasterDesc: values.itemMasterDesc[0] };
    console.log("Values: ", values);
    onSubmit(values);
    form.resetFields();
  };

  // const handleInputChange = (value) => {
  //   setItemDescVal(value)
  // }
  const onChange = (value) => {
    console.log(`selected ${value}`);
  };
  const onSearch = (value) => {
    console.log("search:", value);
  };

  const filterOption = (input, option) =>
    (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

  return (
    <Form
      form={form}
      onFinish={onFinish}
      initialValues={initialValues}
      layout="vertical"
    >
      <Row gutter={16}>
        <Col span={8}>
          <Form.Item name="itemMasterCd" label="Item Code">
            <Input disabled />
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
            <Select disabled={itemDescriptionDisabled}>
              {itemDescriptionOptions.map((item) => (
                <Option key={item.key} value={item.key}>
                  {item.value}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="uomId"
            label="UOM"
            rules={[{ required: true, message: "Please enter UOM" }]}
          >
            <Select>
              {uoms.map((uom, index) => {
                return (
                  <Option key={index} value={uom.id}>
                    {uom.uomName}
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
            <Select>
              {locations.map((location, index) => {
                return (
                  <Option key={index} value={location.id}>
                    {location.locationName}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="locatorId"
            label="Locator Description"
            rules={[{ required: true, message: "Please enter Locator Code" }]}
          >
            <Select>
              {locators.map((locator, index) => {
                return (
                  <Option key={index} value={locator.id}>
                    {locator.locatorDesc}
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
            <Select>
              {vendors.map((vendor, index) => {
                return (
                  <Option key={index} value={vendor.id}>
                    {vendor.vendorName}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="category"
            label="Category"
            rules={[{ required: true, message: "Please enter Category" }]}
          >
            <Select onChange={handleCategoryChange}>
              {categories.map((category, index) => {
                return (
                  <Option key={index} value={category.paramVal}>
                    {category.paramDesc}
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
            name="subCategory"
            label="SUB-CATEGORY"
            rules={[{ required: true, message: "Please enter SUB-CATEGORY" }]}
          >
            <Select
              disabled={!selectedCategory}
              onChange={handleSubCategoryChange}
            >
              {subCategoryOptions.map((option) => (
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
          >
            <Select disabled={!selectedSubCategory} onChange={handleTypeChange}>
              {typeOptions.map((option) => (
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
          >
            <Select
              disabled={disciplinesDisabled}
              onChange={handleDisciplineChange}
            >
              {disciplineOptions.map((discipline) => (
                <Option key={discipline.key} value={discipline.key}>
                  {discipline.value}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={8}>
          <Form.Item
            name="brandId"
            label="Brand"
            rules={[{ required: true, message: "Please enter Brand " }]}
          >
            <Select>
              {brands.map((brand, index) => {
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
            <Select>
              {sizes.map((size, index) => {
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
            <Select>
              {colors.map((color, index) => {
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
            label="Minimum Stock Level"
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
            label="Maximum Stock Level"
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
          >
            <Select>
              {usageCategories.map((usageCategory, index) => {
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
            <Select>
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
