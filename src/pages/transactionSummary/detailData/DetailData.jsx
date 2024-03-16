import React, { useState } from "react";
import { Form, Input, Table, Button } from "antd";
import { columnName } from "./ColumnNameKeyVal";

const itemListColumns = [
  {
    title: "Item Code",
    dataIndex: "itemCode",
    fixed: "left",
  },
  {
    title: "Item Description",
    dataIndex: "itemDesc",
    fixed: "left",
  },
  {
    title: "UOM",
    dataIndex: "uom",
  },
  {
    title: "Quantity",
    dataIndex: "quantity",
  },
  {
    title: "Locator Description ",
    dataIndex: "locatorId",
  },
  {
    title: "Process Stage",
    dataIndex: "processStage",
  },
  {
    title: "Process Type",
    dataIndex: "processType",
  },
  {
    title: "Accepted Quantity",
    dataIndex: "acceptedQuantity",
  },
  {
    title: "Rejected Quantity",
    dataIndex: "rejectedQuantity",
  },
  {
    title: "Inspected Quantity",
    dataIndex: "inspectedQuantity",
  },
  {
    title: "Required no. of days",
    dataIndex: "requiredDays",
  },
  {
    title: "Budget Head Procurement",
    dataIndex: "budgetHeadProcurement",
  },
  {
    title: "Condition of Goods",
    dataIndex: "conditionOfGoods",
  },
  {
    title: "Remarks",
    dataIndex: "remarks",
  },
];
const DetailData = ({
  data,
  itemList,
}) => {
  const [showItems, setShowItems] = useState(false)

  if (!data) return null;
  const dataColumns = Object.entries(data).map(([key, value]) => {
    return { title: columnName[key] || key, dataIndex: key };
  });


  return (
    <div style={{display:"flex", flexDirection: "column", gap: "1rem"}}>
      <Table
        dataSource={[data]}
        columns={dataColumns}
        scroll={{ x: "max-content" }}
        pagination={false}
      />

      <div>
        <Button type="primary" danger={showItems} onClick={()=>setShowItems(!showItems)}>
          {
            showItems ? "Hide Item List" : "Show Item List"
          }
        </Button>
      </div>
      <div style={{display: showItems?"block":"none"}}>
        <h4>ITEM LIST</h4>
        <Table
          dataSource={itemList}
          columns={itemListColumns}
          scroll={{ x: "max-content" }}
          pagination={false}
        />
      </div>
    </div>
  );
};

export default DetailData;
