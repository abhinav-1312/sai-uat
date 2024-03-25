import React from 'react'
import {Form, Input} from "antd"

const FormInputItem = ({label, name, value, onChange, readOnly }) => {
  const handleChange = (e) => {
    if(onChange)
      onChange(name, e.target.value)
  }
  return (
    <Form.Item label={label} name={name}>
      <Input value={value} onChange={handleChange} readOnly={readOnly} />
    </Form.Item>
  )
}

export default FormInputItem
