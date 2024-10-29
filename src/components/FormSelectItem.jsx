import { Form, Select } from "antd";
import React from "react";
import FormInputItem from "./FormInputItem";

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

  if(readOnly){
    return <FormInputItem label={label} name={name} readOnly />
  }
  return (
    <>
      <Form.Item label={label} name={name} required={required} style={style}>
        <Select onChange={(value) => onChange(formField, value)} placeholder={placeholder}>
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
