import React from "react";
import FormInputItem from "./FormInputItem";

const SupplierDetails = ({
  heading,
  supplierCode,
  onChange,
  supplierName,
  address,
}) => {
  return (
    <>
      <div className="consignor-container">
        <h3 className="consignor-consignee-heading">{heading}</h3>
        <FormInputItem
          label="Supplier Code"
          name="supplierCode"
          value={supplierCode}
          onChange={onChange}
        />

        <FormInputItem
          label="Supplier Name"
          value={supplierName}
          readOnly={true}
        />
        <FormInputItem label="Address" value={address} readOnly={true} />
      </div>
    </>
  );
};

export default SupplierDetails;
