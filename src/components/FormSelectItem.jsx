import { Form, Select } from "antd";
import React from "react";

const { Option } = Select;
const FormSelectItem = ({
  label,
  onChange,
  optionArray,
  formField,
  required,
  name,
  readOnly
}) => {
  return (
    <>
      <Form.Item label={label} name={name} required={required}>
        <Select onChange={(value) => onChange(formField, value)} disabled={readOnly ? true : false}>
          {optionArray.map((option) => {
            return (
              <Option key={option.value} value={option.value}>
                {" "}
                {option.desc}{" "}
              </Option>
            );
          })}
        </Select>
      </Form.Item>
    </>
  );
};

export default FormSelectItem;
