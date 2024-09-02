import React from "react";
import { CaretRightOutlined } from "@ant-design/icons";

const ItemMasterMgmt = () => {
  return (
    <>
      <section className="section">
        <h2 className="section-title">Item Master Management</h2>
        <h3 className="subsection-title">
          <CaretRightOutlined /> Objective
        </h3>
        <p className="section-text">
          To outline the steps required to create and manage items in the
          Inventory Management System effectively.
        </p>
        <h3 className="subsection-title">
          <CaretRightOutlined /> Step-by-Step Procedure
        </h3>

        <div className="subsection">
          <h4 className="subsection-title">1. Access Item Master</h4>
          <p className="section-text">
            <strong>Action:</strong> Click on the "Item Master" section.
            <br />
            <strong>Outcome:</strong> You will see the complete list of items
            available in the system.
          </p>
        </div>

        <div className="subsection">
          <h4 className="subsection-title">2. Search for an Item</h4>
          <p className="section-text">
            <strong>Action:</strong> Use the search option and enter the item's
            name.
            <br />
            <strong>Outcome:</strong> The system will display the item's
            complete details, including:
          </p>
          <ul className="detail-list">
            <li>Item Code (17-digit)</li>
            <li>Unit of Measurement (UOM)</li>
            <li>Average Price</li>
            <li>Purchasing Vendor Name</li>
            <li>Category</li>
            <li>Subcategory</li>
            <li>Type</li>
            <li>Discipline</li>
            <li>Item Name</li>
            <li>Brand</li>
            <li>Size</li>
            <li>Colour</li>
            <li>Usage Category</li>
            <li>Item Creation Date</li>
          </ul>
          <p className="section-text note-text">
            <strong>Note:</strong> The item code is generated based on the
            item's category, subcategory, type, discipline, item name, brand,
            size, colour, and usage category.
          </p>
        </div>

        <div className="subsection">
          <h4 className="subsection-title">3. Handling Missing Items</h4>
          <p className="section-text">
            <strong>Action:</strong> If the item is not found in the search and
            needs to be added in bulk quantity:
            <ul>
              <li>
                If numbers of Items are in bulk, then provide complete item
                details in the format provided to the agency.
              </li>
            </ul>
            <strong>Outcome:</strong> Agency generates items code and loads it
            into your system.
          </p>
        </div>

        <div className="subsection">
          <h4 className="subsection-title">4. Load Previous Year Items</h4>
          <p className="section-text">
            <strong>Action:</strong> The list of items from the previous year,
            along with their on-hand quantity, has been loaded into the
            software.
            <br />
            <strong>Outcome:</strong> Verify that all previous items and their
            quantities are correctly entered.
          </p>
        </div>

        <div className="subsection">
          <h4 className="subsection-title">5. New Purchasing Procedure</h4>
          <p className="section-text">
            <strong>Action:</strong> For new bulk purchases:
            <ul>
              <li>
                Provide the items details in the format given by the agency.
              </li>
            </ul>
            <strong>Outcome:</strong> The agency will load these items into the
            system within 2-3 working days.
          </p>
        </div>

        <div className="subsection">
          <h4 className="subsection-title">6. Generate On-Hand Quantity</h4>
          <p className="section-text">
            <strong>Action:</strong> Inventory Manager must generate on-hand
            quantities through the Purchase Order process.
            <br />
            <strong>Process:</strong>
            <ol className="process-list">
              <li>Inward Gate Pass</li>
              <li>Goods Receipt Note (GRN) with inspection</li>
            </ol>
            <strong>Outcome:</strong> Accurate on-hand quantities are reflected
            in the system (OHQ).
          </p>
        </div>

        <div className="subsection">
          <h4 className="subsection-title">7. Create Item Code</h4>
          <p className="section-text">
            <strong>Action:</strong> Use the "Add Item" functionality to create
            a new item code.
            <br />
            <strong>Steps:</strong>
            <ol className="process-list">
              <li>
                Select the item's category, subcategory, type, and discipline.
              </li>
              <li>Enter the item name (search in List of Values (LOV)).</li>
              <li>
                If the item appears in LOV, select it.
                <br />
                If not, create a new item name.
                <br />
                <strong>NOTE:</strong> Do not create a new item if the item is
                available in List of Values otherwise a duplicate item will be
                created.
              </li>
              <li>Select UOM (Unit of Measurement).</li>
              <li>
                Enter on-hand quantity as 0 (to be generated through the full
                process later).
              </li>
              <li>Enter location and locator description.</li>
              <li>Enter the unit price in the price field.</li>
              <li>Select the supplier from LOV.</li>
              <li>
                Enter brand, size, colour, minimum stock level, maximum stock
                level, reorder point, usage category, status (active), and item
                creation date.
              </li>
              <li>Click "Submit."</li>
            </ol>
          </p>
        </div>

        <div className="subsection">
          <h4 className="subsection-title">8. Refresh and Verify Item</h4>
          <p className="section-text">
            <strong>Action:</strong> After submission, refresh the page and
            search for the item in the search box in the Item Master.
            <br />
            <strong>Outcome:</strong> The item code is generated and displayed.
          </p>
        </div>

        <div className="subsection">
          <h4 className="subsection-title">9. Post-Purchase Procedure</h4>
          <p className="section-text">
            <strong>Action:</strong> After purchasing items, create an inward
            gate pass and update the system accordingly.
            <br />
            <strong>Outcome:</strong> The system is updated with accurate and
            current item information.
          </p>
        </div>
      </section>
    </>
  );
};

export default ItemMasterMgmt;
