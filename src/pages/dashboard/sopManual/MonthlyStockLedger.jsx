import React from 'react'
import { CaretRightOutlined } from "@ant-design/icons";

const MonthlyStockLedger = () => {
  return (
    <section className="section">
  <h2 className="section-title">Standard Operating Procedure (SOP) for Checking Monthly Stock Ledger</h2>
  
  <h3 className="subsection-title">
    <CaretRightOutlined /> Usage
  </h3>
  <p className="section-text">
    This SOP applies to all users who need to access and review the stock ledger in the Inventory Management System.
  </p>

  <h3 className="subsection-title">
    <CaretRightOutlined /> Procedure
  </h3>
  
  <div className="subsection">
    <ol className="process-list">
      <li>
        <strong>Access the Master Panel:</strong>
        <ul>
          <li>Log in to the Inventory Management System.</li>
          <li>Navigate to the Master Panel.</li>
          <li>Click on Stock Ledger to proceed.</li>
        </ul>
      </li>
      <li>
        <strong>Choose the Item:</strong>
        <ul>
          <li>In the Item Description field, click to open the LOV (List of Values).</li>
          <li>All available items will be displayed.</li>
          <li>Select or search for the desired item by typing the item name.</li>
        </ul>
      </li>
      <li>
        <strong>Select the Date Range:</strong>
        <ul>
          <li>Specify the desired Date Range for the ledger you wish to review.</li>
          <li>Enter the start and end dates as needed.</li>
        </ul>
      </li>
      <li>
        <strong>Search the Ledger:</strong>
        <ul>
          <li>After selecting the item and the date range, click on Search.</li>
        </ul>
      </li>
      <li>
        <strong>Review the Ledger Details:</strong>
        <ul>
          <li>The system will display the Opening Stock and Closing Stock within the selected date range.</li>
          <li>The Item Creation Date will also be shown.</li>
          <li>Details of transactions that occurred within the selected date range will be reflected, including:
            <ul>
              <li>Post Quantity and Previous Quantity of the item.</li>
              <li>Type of Process related to each transaction.</li>
            </ul>
          </li>
        </ul>
      </li>
      <li>
        <strong>Obtain More Information:</strong>
        <ul>
          <li>For further details, note the Transaction Number from the stock ledger.</li>
          <li>Use this transaction number to access the Transaction Summary for a detailed breakdown of the transaction.</li>
        </ul>
      </li>
    </ol>
  </div>

  
  <div className="subsection note-text">
    <strong>Note: </strong> This SOP is designed to help users efficiently access and review stock ledger information.
  </div>
</section>

  )
}

export default MonthlyStockLedger
