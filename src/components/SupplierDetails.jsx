import React from "react";
import FormInputItem from "./FormInputItem";

const SupplierDetails = ({
  handleChange,
  supplierCodeName,
  readOnly,
}) => {
  return (
    <>
      <div className="consignor-container">
        <h3 className="consignor-consignee-heading">Consignor Details</h3>
        <FormInputItem
          label="Supplier Code"
          name={supplierCodeName ? supplierCodeName : "supplierCode" }
          readOnly={readOnly ? true : false}
          onChange={handleChange}
        />
        <FormInputItem
          label="Supplier Name"
          name="supplierName"
          readOnly={true}
        />
        <FormInputItem label="Address" name="crAddress" readOnly={true} />
      </div>
    </>
  );
};

export default SupplierDetails;
