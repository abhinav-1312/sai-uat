import React from "react";
import FormInputItem from "./FormInputItem";

const RegionalCenterDetails = ({
  regionalCenterCd,
  regionalCenterName,
  address,
  zipcode,
  txnType,
  handleChange,
  heading,
  cdName,
  rcName,
  adrName,
  zipName,
}) => {
  return (
    <>
      <div className="consignor-container">
        <h3 className="consignor-consignee-heading">{heading}</h3>

        <FormInputItem
          label="Regional Center Code"
          // value={regionalCenterCd}
          readOnly={txnType === "ISN" ? false : true}
          onChange={handleChange}
          name={cdName}
          required
        />
        <FormInputItem
          label="Regional Center Name"
          // value={regionalCenterName}
          readOnly={true}
          name={rcName}
          required
        />
        <FormInputItem
          label="Address"
          // value={address}
          readOnly={true}
          name={adrName}
          required
        />
        <FormInputItem
          label="Zipcode"
          // value={zipcode}
          readOnly={true}
          name={zipName}
          required
        />
      </div>
    </>
  );
};

export default RegionalCenterDetails;
