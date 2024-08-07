import React from "react";
import FormInputItem from "./FormInputItem";

const SupplerDetails = ({supplierCode, txnType, handleChange, supplierName, address}) => {
  return (
    <>
      <FormInputItem
        label="Supplier Code"
        name="supplierCode"
        value={supplierCode}
        readOnly={txnType==='IGP' ? false : true}
        onChange={handleChange}
      />
      <FormInputItem
        label="Supplier Name"
        value={supplierName}
        readOnly={true}
      />
      <FormInputItem
        label="Address"
        value={address}
        readOnly={true}
      />
    </>
  );
};

export default SupplerDetails;
