import React from 'react'
import { CaretRightOutlined } from "@ant-design/icons";

const NewLocatorCreation = () => {
  return (
    <>
  <section className="section">
    <h2 className="section-title">Standard Operating Procedure (SOP) for Creating a New Locator</h2>

    <h3 className="subsection-title"> <CaretRightOutlined />Usage</h3>
    <p className="section-text">
      This SOP provides detailed instructions for users who need to create a new locator
      for storing items within the Inventory Management System. It applies to all users who are authorized to request the creation of new
      locators in the system.
    </p>

    <div className="subsection">
      <h4 className="subsection-title"> <CaretRightOutlined /> Procedure</h4>
      <ol className="process-list">
        <li>
          <strong>Contact the Admin:</strong>
          <ul className="detail-list">
            <li>If you need to create a new locator, you must first contact the system administrator at your location.</li>
          </ul>
        </li>
        <li>
          <strong>Access the Locator Master:</strong>
          <ul className="detail-list">
            <li>The admin will log in to the Inventory Management System.</li>
            <li>Navigate to the Master Panel and locate the Locator Master.</li>
          </ul>
        </li>
        <li>
          <strong>View Existing Locators:</strong>
          <ul className="detail-list">
            <li>Upon clicking on the Locator Master, the system will display all predefined locators currently available at your location.</li>
          </ul>
        </li>
        <li>
          <strong>Add a New Locator:</strong>
          <ul className="detail-list">
            <li>To create a new locator, click on the Add Locator option.</li>
            <li>The system will prompt you to fill in the following required details:
              <ul className="detail-list">
                <li><span>Locator Code:</span> A unique identifier for the locator.</li>
                <li><span>Locator Description:</span> A description of the locator.</li>
                <li><span>Location ID:</span> The location ID should match the one used for predefined locators.</li>
                <li><span>Capacity:</span> Specify the capacity of the locator (e.g., measurements like 20x20 for area).</li>
                <li><span>Type:</span> Select the type of locator (e.g., Area).</li>
                <li><span>Status:</span> Set the status to Active.</li>
                <li><span>Owner/Responsible Party:</span> Enter the name of the person responsible for maintaining this locator.</li>
              </ul>
            </li>
          </ul>
        </li>
        <li>
          <strong>Submit the New Locator:</strong>
          <ul className="detail-list">
            <li>After filling in the required details, click on Submit.</li>
            <li>The system will then reflect your new locator in the Locator Master.</li>
          </ul>
        </li>
        <li>
          <strong>Using the New Locator:</strong>
          <ul className="detail-list">
            <li>Once the new locator is created, it will be available in the Locator LOV (List of Values).</li>
            <li>You can select this new locator when creating a Goods Receipt Note (GRN) for any returns or new purchases from vendors.</li>
          </ul>
        </li>
      </ol>
    </div>

    <div className="subsection note-text">
      <strong>Note: </strong>
      This SOP is intended to guide the process of creating a new locator in the system.
    </div>
  </section>
</>

  )
}

export default NewLocatorCreation
