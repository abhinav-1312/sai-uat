import React from 'react'
import {Form, Input} from "antd"

const FormInputItem = ({label, name, value, onChange, readOnly, disabled, className, placeholder, rules }) => {

  console.log("BOOL: ", name === "genName" || name === "approvedName" || name === "issueName")
  const handleChange = (e) => {
    if(onChange)
      onChange(name, e.target.value)
  }
  return (
    <Form.Item label={label} className={className}
      rules = {rules}
    >
      <Input value={value} onChange={handleChange} readOnly={readOnly} disabled={disabled} placeholder={placeholder}/>
    </Form.Item>
  )
}

export default FormInputItem
