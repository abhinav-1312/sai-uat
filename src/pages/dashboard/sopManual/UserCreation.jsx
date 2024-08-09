import React from 'react'
import {CaretRightOutlined, MinusSquareFilled} from '@ant-design/icons'

const UserCreation = () => {
  return (
    <>
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
    </>
  )
}

export default UserCreation
