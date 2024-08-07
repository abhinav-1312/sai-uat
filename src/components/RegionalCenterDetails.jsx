import React from "react";
import FormInputItem from "./FormInputItem";

const RegionalCenterDetails = ({regionalCenterCd, regionalCenterName, address, zipcode, txnType, handleChange}) => {
  return (
    <>
      <FormInputItem
        label="Regional Center Code"
        value={regionalCenterCd}
        readOnly={txnType === 'ISN' ? false : true}
        onChange={handleChange}

      />
      <FormInputItem
        label="Regional Center Name"
        value={regionalCenterName}
        readOnly={true}
      />
      <FormInputItem
        label="Address"
        value={address}
        readOnly={true}
      />
      <FormInputItem
        label="Zipcode"
        value={zipcode}
        readOnly={true}
      />
    </>
  );
};

export default RegionalCenterDetails;
