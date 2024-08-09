import React, { useState } from 'react'
import {CaretRightOutlined, MinusSquareFilled} from '@ant-design/icons'
import { Breadcrumb } from 'antd';
import UserCreation from './UserCreation';
import LoginPasswordChange from './LoginPasswordChange';
import ItemMasterMgmt from './ItemMasterMgmt';
import VendorManagement from './VendorManagement';




const SopManual = () => {
    const [activeSop, setActiveSop] = useState(1); // Default active item

  // Define breadcrumb items
  const breadcrumbItems = [
    { title: 'User Creation', id: 1 },
    { title: 'Login And Password Management', id: 2 },
    { title: 'Item Master Management', id: 3 },
    { title: 'Vendor Management', id: 4 },
  ];

  // Render breadcrumb items with conditional styling
  const renderBreadcrumbItems = () => 
    breadcrumbItems.map(item => (
      <Breadcrumb.Item key={item.id}>
        <div
          onClick={() => setActiveSop(item.id)}
          style={{
            cursor: 'pointer',
            fontWeight: activeSop === item.id ? 'bold' : 'normal',
            color: activeSop === item.id ? '#007bff' : 'black',
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
          default:
            return null;
        }
      };
    

  return (
    <>

    <header class="header">
        <h1 class="header-title">Standard Operating Procedure (SOP)</h1>
    </header>

    <Breadcrumb>
        {renderBreadcrumbItems()}
    </Breadcrumb>
    <main class="main-content">
        <section class="section">
            <h2 class="section-title">Purpose</h2>
            <p class="section-text">
                The purpose of this Standard Operating Procedure (SOP) is to provide clear and
                consistent guidelines. This SOP aims to ensure that all employees follow a
                standardized approach, thereby maintaining efficiency, and safety while reducing the
                risk of errors and inconsistencies.
            </p>
        </section>
        <section class="section">
            <h2 class="section-title">Scope</h2>
            <p class="section-text">
                This SOP applies to all employees who are responsible for performing routine
                maintenance of Stores and Inventory within SPORTS AUTHORITY OF INDIA.
            </p>
        </section>
        {renderComponent()}
        {/* <section class="section">
            <h2 class="section-title">User Creation</h2>
            <p class="section-text">
                If any organization needs to create a new user, they must approach the designated
                agency responsible for managing user accounts. The organization must provide the agency
                with the necessary details of the employee who needs access to the system. The required
                details include:
            </p>
            <ul class="detail-list">
                <li>Employee ID</li>
                <li>Name</li>
                <li>Contact Number</li>
                <li>Email Address</li>
                <li>Sub Organization</li>
                <li>Department</li>
                <li>Joining Date</li>
                <li>User Type</li>
            </ul>
            <p class="section-text">There are two user types:</p>
            <ol class="user-types">
                <li> <MinusSquareFilled />  Admin</li>
                <li> <MinusSquareFilled /> Inventory Manager</li>
            </ol>
            <div class="subsection">
                <h3 class="subsection-title"> <CaretRightOutlined /> Admin Responsibilities</h3>
                <ul class="responsibility-list">
                    <li>Create New Locator if required.</li>
                    <li>Monitor and command the transaction taking place within the Organization.</li>
                </ul>
            </div>
            <div class="subsection">
                <h3 class="subsection-title"> <CaretRightOutlined /> Inventory Manager Responsibilities</h3>
                <ul class="responsibility-list">
                    <li>Manage all Processes (Issue Return Process, PO Process, & Inter Organization Process).</li>
                    <li>Create New Items. If items are in bulk quantity, fill in the data format provided by the agency; the agency will generate its item code in the system.</li>
                    <li>Create New Vendor.</li>
                </ul>
            </div>
            <div class="subsection">
                <h3 class="subsection-title"> <CaretRightOutlined /> User Account Creation</h3>
                <p class="section-text">
                    Upon receiving the required details, the agency will create a new user account in the system.
                </p>
            </div>
            <div class="subsection">
                <h3 class="subsection-title"> <CaretRightOutlined /> Issuing Login Credentials</h3>
                <p class="section-text">
                    The agency will provide the new user with a link to the system, along with a login ID and a temporary password on the respective email ID.
                </p>
            </div>
            <div class="subsection">
                <h3 class="subsection-title"> <CaretRightOutlined /> Password Change</h3>
                <p class="section-text">
                    Upon first login, the user is required to change their password to ensure account security. Users should follow the password policy guidelines when creating a new password.
                </p>
            </div>
        </section> */}
        {/* <section class="section">
            <h2 class="section-title">Login and Change Password</h2>
            <div class="subsection">
                <h3 class="subsection-title"> <CaretRightOutlined /> Overview</h3>
                <p class="section-text">
                    Every user is provided with a unique login ID and password to access the Inventory
                    Management System. The following steps outline the procedure for logging in, changing
                    passwords, and ensuring smooth access after system updates.
                </p>
            </div>
            <div class="subsection">
                <h3 class="subsection-title"> <CaretRightOutlined /> Login Process</h3>
                <ul class="process-list">
                    <li><strong>Access the System URL:</strong> Open a web browser. Enter the URL provided by the Agency in the address bar and press "Enter".</li>
                    <li><strong>Login with Credentials:</strong> On the login page, enter your user ID and password in the respective fields. Click "Sign in" to access the system.</li>
                </ul>
            </div>
            <div class="subsection">
                <h3 class="subsection-title"> <CaretRightOutlined /> Password Change Process</h3>
                <ul class="process-list">
                    <li><span>Initiate Password Change:</span> After logging in, navigate to the "Change Password" option.</li>
                    <li><span>Create a New Password:</span> Enter your current password. Create a new password and re-enter it for confirmation.</li>
                    <li><span>Submit the Password Change:</span> Click "Change Password". A confirmation message will appear on the screen: "Your password has been changed successfully".</li>
                    <li><span>Update Password:</span> Click "Update Password" to finalize the change.</li>
                    <li><span>Access the System with New Password:</span> You can now log in using your new password.</li>
                </ul>
            </div>
          </section> */}
            {/* <section class="section">
                <h3 class="section-title">System Maintenance and Updates</h3>
                <ul class="process-list">
                    <li><strong>System Upgrades:</strong> The system undergoes regular upgrades every Saturday and Sunday. New functionalities are added during these updates.</li>
                    <li><strong>Login After Update:</strong> All users are required to log in to the system every Monday following the weekend updates.</li>
                    <li><strong>Procedure for Logging in After System Update:</strong></li>
                    <ul>
                        <li><strong>Logout from the Old Session:</strong> Log out from your current session in the browser.</li>
                        <li><strong>Open a New Browser Tab:</strong> Open a new tab in your browser.</li>
                        <li><strong>Login to the Updated System:</strong> Use the provided URL along with your user ID and password to access the system. Ensure that you are using the updated system without any errors.</li>
                    </ul>
                </ul>
            </section> */}

            <div className="subsection">
              <p className='note-text'><strong>Note:</strong> It is important to follow these steps to ensure uninterrupted access to the system, especially after updates. Please reach out to the support team if you encounter any issues.</p>
            </div>
        {/* </section> */}
        

        {/* <section className="section">
                <h2 className="section-title">Purpose</h2>
                <p className="section-text">
                    The purpose of this Standard Operating Procedure (SOP) is to provide clear and consistent guidelines. This SOP aims to ensure that all employees follow a standardized approach, thereby maintaining efficiency, and safety while reducing the risk of errors and inconsistencies.
                </p>
            </section>

            <section className="section">
                <h2 className="section-title">Scope</h2>
                <p className="section-text">
                    This SOP applies to all employees who are responsible for performing routine maintenance of Stores and Inventory within SPORTS AUTHORITY OF INDIA.
                </p>
            </section> */}

            {/* <section className="section">
                <h2 className="section-title">Item Master Management</h2>
                <h3 className="subsection-title">Objective</h3>
                <p className="section-text">
                    To outline the steps required to create and manage items in the Inventory Management System effectively.
                </p>
                <h3 className="subsection-title">Step-by-Step Procedure</h3>

                <div className="subsection">
                    <h4 className="subsection-title">1. Access Item Master</h4>
                    <p className="section-text">
                        <strong>Action:</strong> Click on the "Item Master" section.<br />
                        <strong>Outcome:</strong> You will see the complete list of items available in the system.
                    </p>
                </div>

                <div className="subsection">
                    <h4 className="subsection-title">2. Search for an Item</h4>
                    <p className="section-text">
                        <strong>Action:</strong> Use the search option and enter the item's name.<br />
                        <strong>Outcome:</strong> The system will display the item's complete details, including:
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
                    <p className="section-text">
                        <strong>Note:</strong> The item code is generated based on the item's category, subcategory, type, discipline, item name, brand, size, colour, and usage category.
                    </p>
                </div>

                <div className="subsection">
                    <h4 className="subsection-title">3. Handling Missing Items</h4>
                    <p className="section-text">
                        <strong>Action:</strong> If the item is not found in the search and needs to be added in bulk quantity:
                        <ul>
                            <li>If numbers of Items are in bulk, then provide complete item details in the format provided to the agency.</li>
                        </ul>
                        <strong>Outcome:</strong> Agency generates items code and loads it into your system.
                    </p>
                </div>

                <div className="subsection">
                    <h4 className="subsection-title">4. Load Previous Year Items</h4>
                    <p className="section-text">
                        <strong>Action:</strong> The list of items from the previous year, along with their on-hand quantity, has been loaded into the software.<br />
                        <strong>Outcome:</strong> Verify that all previous items and their quantities are correctly entered.
                    </p>
                </div>

                <div className="subsection">
                    <h4 className="subsection-title">5. New Purchasing Procedure</h4>
                    <p className="section-text">
                        <strong>Action:</strong> For new bulk purchases:
                        <ul>
                            <li>Provide the items details in the format given by the agency.</li>
                        </ul>
                        <strong>Outcome:</strong> The agency will load these items into the system within 2-3 working days.
                    </p>
                </div>

                <div className="subsection">
                    <h4 className="subsection-title">6. Generate On-Hand Quantity</h4>
                    <p className="section-text">
                        <strong>Action:</strong> Inventory Manager must generate on-hand quantities through the Purchase Order process.<br />
                        <strong>Process:</strong>
                        <ol className="process-list">
                            <li>Inward Gate Pass</li>
                            <li>Goods Receipt Note (GRN) with inspection</li>
                        </ol>
                        <strong>Outcome:</strong> Accurate on-hand quantities are reflected in the system (OHQ).
                    </p>
                </div>

                <div className="subsection">
                    <h4 className="subsection-title">7. Create Item Code</h4>
                    <p className="section-text">
                        <strong>Action:</strong> Use the "Add Item" functionality to create a new item code.<br />
                        <strong>Steps:</strong>
                        <ol className="process-list">
                            <li>Select the item's category, subcategory, type, and discipline.</li>
                            <li>Enter the item name (search in List of Values (LOV)).</li>
                            <li>If the item appears in LOV, select it.<br />
                            If not, create a new item name.<br />
                            <strong>NOTE:</strong> Do not create a new item if the item is available in List of Values otherwise a duplicate item will be created.</li>
                            <li>Select UOM (Unit of Measurement).</li>
                            <li>Enter on-hand quantity as 0 (to be generated through the full process later).</li>
                            <li>Enter location and locator description.</li>
                            <li>Enter the unit price in the price field.</li>
                            <li>Select the supplier from LOV.</li>
                            <li>Enter brand, size, colour, minimum stock level, maximum stock level, reorder point, usage category, status (active), and item creation date.</li>
                            <li>Click "Submit."</li>
                        </ol>
                    </p>
                </div>

                <div className="subsection">
                    <h4 className="subsection-title">8. Refresh and Verify Item</h4>
                    <p className="section-text">
                        <strong>Action:</strong> After submission, refresh the page and search for the item in the search box in the Item Master.<br />
                        <strong>Outcome:</strong> The item code is generated and displayed.
                    </p>
                </div>

                <div className="subsection">
                    <h4 className="subsection-title">9. Post-Purchase Procedure</h4>
                    <p className="section-text">
                        <strong>Action:</strong> After purchasing items, create an inward gate pass and update the system accordingly.<br />
                        <strong>Outcome:</strong> The system is updated with accurate and current item information.
                    </p>
                </div>
            </section> */}





    </main>
    </>
  )
}

export default SopManual
