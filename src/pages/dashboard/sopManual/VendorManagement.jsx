import React from "react";
import {CaretRightOutlined} from '@ant-design/icons'

const VendorManagement = () => {
  return (
    <>
      <section className="section">
        <h2 className="section-title">Vendor Management</h2>
        <h3 className="subsection-title"> <CaretRightOutlined /> Objective</h3>
        <p className="section-text">
          To provide a clear procedure for managing vendors in the Inventory
          Management System, ensuring that all vendor details are accurately
          recorded and maintained. This applies to all users involved in
          purchasing items from vendors.
        </p>

        <div className="subsection">
          <h4 className="subsection-title"> <CaretRightOutlined /> Searching for a Vendor</h4>
          <p className="section-text">
            After purchasing an item from a vendor, the user must first search
            for the vendor in the Vendor Master.
            <br />
            <strong>To search for a vendor:</strong>
            <ol className="process-list">
              <li>Navigate to the Vendor Master section in the system.</li>
              <li>
                Enter the vendor’s name or other identifying details in the
                search bar.
              </li>
              <li>
                Review the search results to determine if the vendor is already
                listed.
              </li>
            </ol>
          </p>
        </div>

        <div className="subsection">
          <h4 className="subsection-title"> <CaretRightOutlined /> Adding a New Vendor</h4>
          <p className="section-text">
            If the vendor is not available in the Vendor Master, the user must
            add the vendor.
            <br />
            <strong>To add a new vendor:</strong>
            <ol className="process-list">
              <li>Navigate to the Add Vendor option in the system.</li>
              <li>
                Fill in all the required fields with the vendor’s details.
                Required fields typically include:
              </li>
              <ul className="detail-list">
                <li>Vendor Name</li>
                <li>Contact Information</li>
                <li>Address</li>
                <li>Other relevant details</li>
              </ul>
              <li>
                If any required data is not available at the time of creation,
                the user may mention NA in those fields.
              </li>
              <li>
                Once the required data is obtained, the user must return to the
                Vendor Master to edit and complete the vendor’s details.
              </li>
            </ol>
          </p>
        </div>

        <div className="subsection">
          <h4 className="subsection-title"> <CaretRightOutlined /> Editing Vendor Details</h4>
          <p className="section-text">
            To update vendor details:
            <br />
            <strong>Navigate to the Vendor Master.</strong>
            <br />
            <strong>
              Search for the vendor whose details need to be updated:
            </strong>
            <ol className="process-list">
              <li>Select the vendor and click on the Edit option.</li>
              <li>
                Fill in or update the necessary fields with the correct
                information.
              </li>
              <li>
                Save the changes to ensure the vendor’s details are up to date.
              </li>
            </ol>
          </p>
        </div>

        <h3 className="subsection-title"> <CaretRightOutlined /> Responsibilities</h3>
        <ul className="responsibility-list">
          <li>
            User: Responsible for searching for vendors, adding new vendors if
            necessary, and updating vendor details when more information becomes
            available.
          </li>
        </ul>

        <h3 className="subsection-title note-text">Notes</h3>
        <ul className="note-list note-text">
          <li>
            Ensure that all vendor details are accurate and up to date to
            facilitate smooth purchasing and transaction processes.
          </li>
          <li>
            If a user encounters any issues while adding or editing vendor
            details, they should contact the system administrator for
            assistance.
          </li>
        </ul>
      </section>
    </>
  );
};

export default VendorManagement;
