// ItemsForm.js
import React, { useState } from "react";
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
  subCategories,
  usageCategories,
  types,
  disciplines,
}) => {
  const [form] = Form.useForm();
  // const [itemDescVal, setItemDescVal] = useState("");

  // const handleSelectChange = (value) => {
  //   console.log("Handle select change: ", value);
  //   setItemDescVal(value);
  // };

  const onFinish = (values) => {
    values = { ...values, itemMasterDesc: values.itemMasterDesc[0] };
    // console.log("Values: ", values);
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
            {/* <Select>
              {Object.entries(itemNames).map(([key, value]) => {
                return (
                  <Option key={key} value={key}>
                    {value}
                  </Option>
                );
              })}
            </Select> */}

            {/* <Select
              showSearch
              style={{ width: 200 }}
              placeholder="Select or type"
              optionFilterProp="children"
              value={itemDescVal}
              onChange={handleSelectChange}
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            > */}
            {/* {options.map(option => (
          <Option key={option} value={option}>{option}</Option>
        ))} */}

            {/* {Object.entries(itemNames).map(([key, value]) => {
                return (
                  <Option key={key} value={key}>
                    {value}
                  </Option>
                );
              })}
            </Select> */}

            <Select
              // showSearch
              // value={itemDescVal}
              // onChange={(e)=>handleSelectChange(e.target.val)}
              // style={{ width: '100%' }}
              // placeholder="Select or type"
              // optionFilterProp="children"
              showSearch
              mode="tags"
              style={{ width: "100%" }}
              placeholder="Select or type"
            >
              {/* <Option value="option1">Option 1</Option>
          <Option value="option2">Option 2</Option>
          <Option value="option3">Option 3</Option> */}

              {Object.entries(itemNames).map(([key, value]) => {
                return (
                  <Option key={key} value={key}>
                    {value}
                  </Option>
                );
              })}
            </Select>
            {/* <Input
          value={itemDescVal}
          onChange={(e) => handleInputChange(e.target.val)}
          style={{ marginTop: '10px' }}
          placeholder="Or type your own"
        /> */}
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
            <Select>
              {Object.entries(categories).map(([key, value]) => {
                return (
                  <Option key={key} value={key}>
                    {value}
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
            <Select>
              {Object.entries(subCategories).map(([key, value]) => {
                return (
                  <Option key={key} value={key}>
                    {value}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="type"
            label=" Type"
            rules={[{ required: true, message: "Please enter Item Type" }]}
          >
            <Select>
              {Object.entries(types).map(([key, value]) => {
                return (
                  <Option key={key} value={key}>
                    {value}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="disciplines"
            label="Disciplines"
            rules={[{ required: true, message: "Please enter Disciplines" }]}
          >
            <Select>
              {Object.entries(disciplines).map(([key, value]) => {
                return (
                  <Option key={key} value={key}>
                    {value}
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
