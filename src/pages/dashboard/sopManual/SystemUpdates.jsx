import React from "react";

const SystemUpdates = () => {
  return (
    <>
      <section class="section">
        <h3 class="section-title">System Maintenance and Updates</h3>
        <ul class="process-list">
          <li>
            <strong>System Upgrades:</strong> The system undergoes regular
            upgrades every Saturday and Sunday. New functionalities are added
            during these updates.
          </li>
          <li>
            <strong>Login After Update:</strong> All users are required to log
            in to the system every Monday following the weekend updates.
          </li>
          <li>
            <strong>Procedure for Logging in After System Update:</strong>
          </li>
          <ul>
            <li>
              <strong>Logout from the Old Session:</strong> Log out from your
              current session in the browser.
            </li>
            <li>
              <strong>Open a New Browser Tab:</strong> Open a new tab in your
              browser.
            </li>
            <li>
              <strong>Login to the Updated System:</strong> Use the provided URL
              along with your user ID and password to access the system. Ensure
              that you are using the updated system without any errors.
            </li>
          </ul>
        </ul>
      </section>
    </>
  );
};

export default SystemUpdates;
