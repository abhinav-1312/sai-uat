import React from 'react'
import {CaretRightOutlined} from '@ant-design/icons'

const LoginPasswordChange = () => {
  return (
    <>
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
    </>
  )
}

export default LoginPasswordChange
