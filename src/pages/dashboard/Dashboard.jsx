import { Button } from "antd";
import React, { useState } from "react";
import ItemSlab from "./ItemSlab";
import TransactionSlab from "./TransactionSlab";
import InvValSlab from "./InvValSlab";

const Dashboard = () => {
    const [activeTab, setActiveTab] = useState("tab1")
  return (
    <div style={{display: "flex", flexDirection: "column", gap: "4rem"}}>
      <div className="dashboard-tabs">
        <Button className="each-tab" id="tab1" style={{backgroundColor: activeTab === "tab1" ? "#ff8a00" : ""}} onClick={() => setActiveTab("tab1")}>
          <span className="tab-fieldName">Item</span>
          <span className="tab-value">Rs. 123456</span>
        </Button>
        <Button className="each-tab" id="tab2" style={{backgroundColor: activeTab === "tab2" ? "#ff8a00" : ""}} onClick={() => setActiveTab("tab2")}>
          <span className="tab-fieldName">Transaction</span>
          <span className="tab-value">123456</span>
        </Button>
        <Button className="each-tab" id="tab3" style={{backgroundColor: activeTab === "tab3" ? "#ff8a00" : ""}} onClick={() => setActiveTab("tab3")}>
          <span className="tab-fieldName">Inventory And Value</span>
          <span className="tab-value">123456</span>
        </Button>
        <Button className="each-tab" id="tab4" style={{backgroundColor: activeTab === "tab4" ? "#ff8a00" : ""}} onClick={() => setActiveTab("tab4")}>
          <span className="tab-fieldName">Purchasing Summary</span>
          <span className="tab-value">123456</span>
        </Button>
      </div>

      {
        activeTab === "tab1" && (
            <ItemSlab />
        )
      }
      {
        activeTab === "tab2" && (
            <TransactionSlab />
        )
      }
      {
        activeTab === "tab3" && (
            <InvValSlab />
        )
      }
    </div>
  );
};

export default Dashboard;
