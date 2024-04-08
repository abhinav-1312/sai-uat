import React from 'react'
import {Form, Select} from "antd"

const { Option } = Select;

const FormDropdownItem = ({label, name, onChange, dropdownArray, valueField, visibleField}) => {
  return (
    <Form.Item label={label} name={name}>
      <Select onChange={(value)=>onChange(name, value)}>
        {
            dropdownArray.map((item, key)=>(
                <Option key={key} value={item[valueField]}> {item[visibleField]} </Option>
            ))
        }
      </Select>
    </Form.Item>
  )
}

export default FormDropdownItem
