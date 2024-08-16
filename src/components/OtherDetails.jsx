import React from "react";

const OtherDetails = ({ children }) => {
  return (
    <>
      <div className="other-container">
        <h3 className="consignor-consignee-heading">Other Details</h3>
        {children}
      </div>
    </>
  );
};

export default OtherDetails;
