import React from 'react'
import {Form, DatePicker} from "antd"
const dateFormat = "DD/MM/YYYY";

const FormDatePickerItem = ({label, name, defaultValue, format, onChange}) => {
  return (
    <Form.Item label={label} name={name}>
      <DatePicker style={{width: "100%"}} defaultValue={defaultValue} format={dateFormat} onChange={(date, dateString) =>onChange(name, dateString)}/>
    </Form.Item>
  )
}

export default FormDatePickerItem
