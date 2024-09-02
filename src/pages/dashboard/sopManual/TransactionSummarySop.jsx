import React from 'react'
import { CaretRightOutlined } from "@ant-design/icons";

const TransactionSummarySop = () => {
  return (
    <>
  <section className="section">
    <h2 className="section-title">Standard Operating Procedure (SOP) for Transaction</h2>
    <h3 className="subsection-title"> <CaretRightOutlined />Usage</h3>
    <p className="section-text">
      This SOP outlines the steps to access and utilize the Transaction Summary function
      within the Inventory Management System to review transaction details within your
      organization. This is applicable to all users who need to search, view, and analyze
      transaction details.
    </p>

    <div className="subsection">
      <h4 className="subsection-title"> <CaretRightOutlined /> Procedure</h4>
      <ol className="process-list">
        <li>
          <strong>Access the Transaction Summary Function:</strong>
          <ul className="detail-list">
            <li>Log in to the Inventory Management System.</li>
            <li>Navigate to the Transaction Summary function.</li>
          </ul>
        </li>
        <li>
          <strong>Search for Transactions:</strong>
          <ul className="detail-list">
            <li>In the Transaction Summary screen, you can search for transactions by the following criteria:
              <ul className="detail-list">
                <li> <span>Item Code:</span> Enter the specific item code to filter transactions related to that item.</li>
                <li><span>Transaction Type:</span> Select the type of transaction (e.g., Issue Note, Inwards Gate pass, GRN) from the available options.</li>
                <li><span>Date Range:</span> Specify the From Date and To Date to limit the search to transactions within a specific period.</li>
              </ul>
            </li>
            <li>Click on Search to retrieve the relevant transactions.</li>
          </ul>
        </li>
        <li>
          <strong>Review Transaction Details:</strong>
          <ul className="detail-list">
            <li>The system will display all transactions that match the search criteria. The details will include:
              <ul className="detail-list">
                <li>Transaction Number</li>
                <li>Process Type</li>
                <li>Process Stage</li>
              </ul>
            </li>
          </ul>
        </li>
        <li>
          <strong>View Complete Transaction Information:</strong>
          <ul className="detail-list">
            <li>For each transaction, there is a View option available next to the transaction number.</li>
            <li>Click on View to access the complete information related to that transaction.</li>
            <li>The system will display:
              <ul className="detail-list">
                <li>Date of Transaction</li>
                <li>Transaction Generator Details</li>
                <li>Approver Details</li>
                <li>Consumer Details</li>
                <li>Vendor Details</li>
                <li>Other relevant information related to the transaction process.</li>
              </ul>
            </li>
          </ul>
        </li>
        <li>
          <strong>View Item List:</strong>
          <ul className="detail-list">
            <li>To see detailed information about the items involved in the transaction, click on Show Item List.</li>
            <li>The system will display all items that are part of the transaction, including:
              <ul className="detail-list">
                <li>Item Code</li>
                <li>Item Description</li>
                <li>UOM (Unit of Measure)</li>
                <li>Quantity</li>
                <li>Other relevant item details.</li>
              </ul>
            </li>
          </ul>
        </li>
      </ol>
    </div>

    <div className="subsection note-text">
      <strong>Note</strong>
    <ul className="note-list">
      <li>This SOP ensures that users can effectively search for and review transaction details.</li>
      <li>If further assistance is required, users should contact the system administrator.</li>
    </ul>
    </div>
  </section>
</>

  )
}

export default TransactionSummarySop
