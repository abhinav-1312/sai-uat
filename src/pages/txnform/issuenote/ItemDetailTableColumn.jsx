// import { renderLocator } from "../../../utils/Functions";
// import { allDisciplines, brands, categories, colors, itemNames, sizes, subCategories, types, usageCategories } from "../../items/KeyValueMapping";
import {Button, Table} from "antd"
import { handleSelectItem } from "../../../utils/Functions";

export const primColumn = ({locationMaster, vendorMaster, selectedItems, setSelectedItems, setFormData}) => {
  return [
    { title: "S NO.", dataIndex: "id", key: "id", fixed: "left", width: 80 },
    {
      title: "ITEM CODE",
      dataIndex: "itemMasterCd",
      key: "itemCode",
    },
    {
      title: "ITEM DESCRIPTION",
      dataIndex: "itemMasterDesc",
      key: "itemMasterDesc",
      // render: (itemName) => itemNames[itemName],
    },
    {
      title: "UOM",
      dataIndex: "uomDtls",
      key: "uom",
      render: (uomDtls) => uomDtls.baseUom
    },
    {
      title: "QUANTITY ON HAND",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "LOCATION",
      dataIndex: "locationDesc",
      key: "location",
      // render: (locationId) => locationMaster[locationId],
      // render: (locationId) => locationMaster[locationId] findColumnValue(locationId, locationMaster, "locationMaster")
    },
    // {
    //   title: "LOCATOR CODE",
    //   dataIndex: "locatorId",
    //   key: "locatorCode",
    // },
    { title: "PRICE", dataIndex: "price", key: "price" },
    // {
    //   title: "VENDOR DETAIL",
    //   dataIndex: "vendorId",
    //   key: "vendorDetail",
    //   render: (vendorId) => vendorMaster[vendorId],
    //   // render: (vendorId) => findColumnValue(vendorId, vendorMaster, "vendorMaster")
    // },
    {
      title: "CATEGORY",
      dataIndex: "categoryDesc",
      key: "category",
      // render: (category) => categories[category],
    },
    {
      title: "SUB-CATEGORY",
      dataIndex: "subCategoryDesc",
      key: "subCategory",
      // render: (subCategory) => subCategories[subCategory],
    },
    {
      title: "Type",
      dataIndex: "typeDesc",
      key: "type",
      // render: (type) => types[type],
    },
    {
      title: "Disciplines",
      dataIndex: "disciplinesDesc",
      key: "disciplines",
      // render: (disciplines) => allDisciplines[disciplines],
    },
    {
      title: "Brand",
      dataIndex: "brandDesc",
      key: "brand",
      // render: (brandId) => brands[brandId],
    },
    {
      title: "Size",
      dataIndex: "sizeDesc",
      key: "size",
      // render: (size) => sizes[size],
    },
    {
      title: "Colour",
      dataIndex: "colorDesc",
      key: "colour",
      // render: (colorId) => colors[colorId],
    },
    {
      title: "Usage Category",
      dataIndex: "usageCategoryDesc",
      key: "usageCategory",
      // render: (usageCategory) => usageCategories[usageCategory],
    },
    {
      title: "MINIMUM STOCK LEVEL",
      dataIndex: "minStockLevel",
      key: "minStockLevel",
    },
    {
      title: "MAXIMUM STOCK LEVEL",
      dataIndex: "maxStockLevel",
      key: "maxStockLevel",
    },
    { title: "RE ORDER POINT", dataIndex: "reOrderPoint", key: "reOrderPoint" },
    { title: "STATUS", dataIndex: "status", key: "status" },
    { title: "CREATE DATE", dataIndex: "endDate", key: "endDate" },
    {
        title: "LOCATOR QUANTITY DETAILS",
        dataIndex: "qtyList",
        key: "qtyList",
        render: (locatorQuantity) => renderLocatorISN(locatorQuantity, selectedItems, setSelectedItems, setFormData)
    },
    // {
    //   title: "Actions",
    //   key: "actions",
    //   fixed: "right",
    //   render: (text, record) => (
    //     <Button
    //       type={
    //         selectedItems.some((item) => item.id === record.id)
    //           ? "warning"
    //           : "primary"
    //       }
    //       onClick={() => handleSelectItem(record, selectedItems, selectedItems, setFormData)}
    //     >
    //       {selectedItems.some((item) => item.id === record.id)
    //         ? "Deselect"
    //         : "Select"}
    //     </Button>
    //   ),
    // },
  ];
};

export const renderLocatorISN = (obj, selectedItems, setSelectedItems, setFormData) => {
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
        },
        {
          title: "ACTION",
          fixed: "right",
          render: (_, record) => (
            <Button
                  type={
                    selectedItems?.some((item) => item.id === record.id)
                      ? "warning"
                      : "primary"
                  }
                  onClick={() => handleSelectItem(record, selectedItems, setSelectedItems, setFormData)}
                >
                  {selectedItems?.some((item) => item.id === record.id)
                    ? "Deselect"
                    : "Select"}
                </Button>
          )
        }
      ]}
    />
  )
}
