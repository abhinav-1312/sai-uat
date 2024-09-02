import React, { useState } from "react";
import { Breadcrumb } from "antd";
import UserCreation from "./UserCreation";
import LoginPasswordChange from "./LoginPasswordChange";
import ItemMasterMgmt from "./ItemMasterMgmt";
import VendorManagement from "./VendorManagement";
import IndependentVarAddition from "./IndependentVarAddition";
import TransactionSummarySop from "./TransactionSummarySop";
import NewLocatorCreation from "./NewLocatorCreation";
import MonthlyStockLedger from "./MonthlyStockLedger";

const SopManual = () => {
  const [activeSop, setActiveSop] = useState(1); // Default active item

  // Define breadcrumb items
  const breadcrumbItems = [
    { title: "User Creation", id: 1 },
    { title: "Login And Password Management", id: 2 },
    { title: "Item Master Management", id: 3 },
    { title: "Vendor Management", id: 4 },
    { title: "Independent Variable Addition", id: 5 },
    { title: "Transaction Summary", id: 6 },
    { title: "New Locator Creation", id: 7 },
    { title: "Monthly Stock Ledger", id: 8 },
  ];

  // Render breadcrumb items with conditional styling
  const renderBreadcrumbItems = () =>
    breadcrumbItems.map((item) => (
      <Breadcrumb.Item key={item.id}>
        <div
          onClick={() => setActiveSop(item.id)}
          style={{
            cursor: "pointer",
            fontWeight: activeSop === item.id ? "bold" : "normal",
            color: activeSop === item.id ? "#007bff" : "black",
          }}
        >
          {item.title}
        </div>
      </Breadcrumb.Item>
    ));

  const renderComponent = () => {
    switch (activeSop) {
      case 1:
        return <UserCreation />;
      case 2:
        return <LoginPasswordChange />;
      case 3:
        return <ItemMasterMgmt />;
      case 4:
        return <VendorManagement />;
      case 5:
        return <IndependentVarAddition />;
      case 6:
        return <TransactionSummarySop />;
      case 7:
        return <NewLocatorCreation />;
      case 8:
        return <MonthlyStockLedger />;
      default:
        return null;
    }
  };

  return (
    <>
      <header class="header">
        <h1 class="header-title">Standard Operating Procedure (SOP)</h1>
      </header>

      <Breadcrumb>{renderBreadcrumbItems()}</Breadcrumb>
      <main class="main-content">
        <section class="section">
          <h2 class="section-title">Purpose</h2>
          <p class="section-text">
            The purpose of this Standard Operating Procedure (SOP) is to provide
            clear and consistent guidelines. This SOP aims to ensure that all
            employees follow a standardized approach, thereby maintaining
            efficiency, and safety while reducing the risk of errors and
            inconsistencies.
          </p>
        </section>
        <section class="section">
          <h2 class="section-title">Scope</h2>
          <p class="section-text">
            This SOP applies to all employees who are responsible for performing
            routine maintenance of Stores and Inventory within SPORTS AUTHORITY
            OF INDIA.
          </p>
        </section>
        {renderComponent()}
        <div className="subsection">
          <p className="note-text">
            <strong>Note:</strong> It is important to follow these steps to
            ensure uninterrupted access to the system, especially after updates.
            Please reach out to the support team if you encounter any issues.
          </p>
        </div>
      </main>
    </>
  );
};

export default SopManual;
