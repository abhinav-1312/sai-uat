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
          // value={supplierCode}
          onChange={onChange}
          required
        />

        <FormInputItem
          label="Supplier Name"
          // value={supplierName}
          // readOnly={true}
          name='supplierName'
          required
        />
        <FormInputItem label="Address" value={address} readOnly={true} required name='crAddress' />
      </div>
    </>
  );
};

export default SupplierDetails;
