import { Form } from "antd";
import Input from "antd/es/input/Input";
import React from "react";

const { Search } = Input;
const FormSearchItem = ({ label, name, onChange, onSearch, value }) => {
  return (
    <>
      <Form.Item label={label} name={name}>
        <Search
          onSearch={onSearch}
          onChange={(e) => onChange(name, e.target.value)}
          value={value}
          enterButton
        />
      </Form.Item>
    </>
  );
};

export default FormSearchItem;
