import { Form, Select } from "antd";
import React from "react";

const { Option } = Select;
const FormSelectItem = ({
  label,
  onChange,
  optionArray,
  formField,
  value,
  name,
}) => {
  return (
    <>
      <Form.Item label={label} name={name}>
        <Select onChange={(value) => onChange(formField, value)} value={value}>
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
