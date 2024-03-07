// ItemsTable.js
import React from "react";
import { Table, Space, Button, Popconfirm, message } from "antd";

const ItemsTable = ({ items, onEdit, onDelete }) => {
  const confirm = (e) => {
    message.success("Item Deleted");
  };

  const cancel = (e) => {
    message.error("Deletion Cancelled");
  };

  const columns = [
    { title: "S NO.", dataIndex: "id", key: "id", fixed: "left", width: 80 },
    {
      title: "ITEM CODE",
      dataIndex: "itemCode",
      key: "itemCode",
      fixed: "left",
    },
    {
      title: "ITEM DESCRIPTION",
      dataIndex: "itemDescription",
      key: "itemDescription",
      fixed: "left",
    },
    { title: "UOM", dataIndex: "uom", key: "uom" },
    {
      title: "QUANTITY ON HAND",
      dataIndex: "quantityOnHand",
      key: "quantityOnHand",
    },
    { title: "LOCATION", dataIndex: "location", key: "location" },
    {
      title: "LOCATOR CODE",
      dataIndex: "locatorCode",
      key: "locatorCode",
    },
    { title: "PRICE", dataIndex: "price", key: "price" },
    { title: "VENDOR DETAIL", dataIndex: "vendorDetail", key: "vendorDetail" },
    { title: "CATEGORY", dataIndex: "category", key: "category" },

    { title: "SUB-CATEGORY", dataIndex: "subcategory", key: "subcategory" },
    { title: "Type", dataIndex: "type", key: "type" },
    { title: "Disciplines", dataIndex: "disciplines", key: "disciplines" },
    { title: "Brand", dataIndex: "brand", key: "brand" },
    { title: "Size", dataIndex: "size", key: "size" },
    { title: "Colour", dataIndex: "colour", key: "colour" },
    {
      title: "Usage Category",
      dataIndex: "usageCategory",
      key: "usageCategory ",
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
    { title: "END DATE", dataIndex: "endDate", key: "endDate" },
    {
      title: "Actions",
      key: "actions",
      fixed: "right",
      render: (_, record) => (
        <Space>
          {/* <Button
            type="primary"
            className="saitheme-btn"
            onClick={() => onEdit(record)}
            disabled
          >
            Edit
          </Button> */}
          <Popconfirm
            title="Delete the item"
            description="Are you sure to delete this item?"
            onConfirm={(e) => {
              onDelete(record.id);
              confirm(e);
            }}
            onCancel={cancel}
            okText="Yes"
            cancelText="No"
          >
            <Button danger>Delete</Button>
          </Popconfirm>
          {/* { () => {onDelete(record.id)}} */}
        </Space>
      ),
    },
  ];

  return (
    <Table dataSource={items} columns={columns} scroll={{ x: "max-content" }} />
  );
};

export default ItemsTable;
