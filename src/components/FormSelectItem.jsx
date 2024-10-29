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
  readOnly,
  placeholder,
  style
}) => {
  return (
    <>
      <Form.Item label={label} name={name} required={required} style={style}>
        <Select onChange={(value) => onChange(formField, value)} disabled={readOnly ? true : false} placeholder={placeholder}>
          {optionArray?.map((option) => {
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
