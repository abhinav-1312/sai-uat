import React from "react";
import FormInputItem from "./FormInputItem";

const RegionalCenterDetails = ({
  txnType,
  handleChange,
  heading,
  cdName,
  rcName,
  adrName,
  zipName,
  readOnly
}) => {
  return (
    <>
      <div className="consignor-container">
        <h3 className="consignor-consignee-heading">{heading}</h3>

        <FormInputItem
          label="Regional Center Code"
          readOnly={readOnly ? true : false}
          onChange={handleChange}
          name={cdName}
          required
        />
        <FormInputItem
          label="Regional Center Name"
          readOnly={true}
          name={rcName}
          required
        />
        <FormInputItem
          label="Address"
          readOnly={true}
          name={adrName}
          required
        />
        <FormInputItem
          label="Zipcode"
          readOnly={true}
          name={zipName}
          required
        />
      </div>
    </>
  );
};

export default RegionalCenterDetails;
