import React from 'react'
import {Form, Input} from "antd"

const FormInputItem = ({label, name, value, onChange, readOnly, disabled, className, placeholder, rules, required }) => {
  const handleChange = (e) => {

    if(onChange)
      if(typeof name === 'string')
        onChange(name, e.target.value)
      else
        onChange(name[2], e.target.value)
  }
  return (
    <Form.Item label={label} className={className}
      name={name}
      rules={[{ required: required ? true : false, message: 'Please input the value!' }]}
    >
      <Input onChange={handleChange} readOnly={readOnly} disabled={disabled} placeholder={placeholder}/>
    </Form.Item>
  )
}

export default FormInputItem
