import React from 'react'
import {Form, Input} from "antd"
const { TextArea } = Input;
const FormInputItem = ({label, name, value, onChange, readOnly, disabled, className, placeholder }) => {
  const handleChange = (e) => {
    if(onChange)
      onChange(name, e.target.value)
  }
  return (
    <Form.Item label={label} name={name} className={className}>
      <TextArea value={value} onChange={handleChange} readOnly={readOnly} disabled={disabled} placeholder={placeholder}/>
    </Form.Item>
  )
}

export default FormInputItem
