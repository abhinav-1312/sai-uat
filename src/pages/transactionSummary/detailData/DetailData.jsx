import React, { useState } from "react";
import { Table, Button } from "antd";

const DetailData = ({ dataColumn, itemListColumn,
  data,
  itemList,
  processType
}) => {
  const [showItems, setShowItems] = useState(false)
  if (!data) return null;
  return (
    <div style={{display:"flex", flexDirection: "column", gap: "1rem"}}>
      <Table
        dataSource={[data]}
        columns={dataColumn}
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
          columns={itemListColumn}
          scroll={{ x: "max-content" }}
          pagination={false}
        />
      </div>
    </div>
  );
};

export default DetailData;
