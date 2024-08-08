import React from 'react'
import {CaretRightOutlined, MinusSquareFilled} from '@ant-design/icons'




const SopManual = () => {
  return (
    <>
    <header class="header">
        <h1 class="header-title">Standard Operating Procedure (SOP)</h1>
    </header>
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
        <section class="section">
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
        </section>
        <section class="section">
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
          </section>
            <section class="section">
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
            </section>

            <div className="subsection">
              <p className='note-text'><strong>Note:</strong> It is important to follow these steps to ensure uninterrupted access to the system, especially after updates. Please reach out to the support team if you encounter any issues.</p>
            </div>
        {/* </section> */}
    </main>
    </>
  )
}

export default SopManual
