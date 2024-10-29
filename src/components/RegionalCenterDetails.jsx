import React from "react";
import FormInputItem from "./FormInputItem";
import { Form } from "antd";
import TextArea from "antd/es/input/TextArea";

const RegionalCenterDetails = ({
  txnType,
  handleChange,
  heading,
  cdName,
  rcName,
  adrName,
  zipName,
  readOnly,
  formData
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
        <Form.Item label="Address" name={adrName} required>
          <TextArea autoSize={{ minRows: 1, maxRows: 3 }}  readOnly/>
        </Form.Item>
        {/* <FormInputItem
          label="Address"
          readOnly={true}
          name={adrName}
          required
        /> */}
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
