import React, { useState } from 'react'
import {Form, DatePicker} from "antd"
import moment from 'moment/moment';
import dayjs from 'dayjs';
const dateFormat = "DD/MM/YYYY";
const FormDatePickerItemNew = ({label, name, value, defaultValue, onChange}) => {
    const dayjsVal = dayjs(value, dateFormat, true)
    console.log(dayjsVal)
  return (
    <Form.Item label = {label}>
      <DatePicker format={dateFormat} value={dayjs(value, dateFormat, true)} onChange={(date, dateString) => onChange(name, dateString)}/>
    </Form.Item>
  )
}

export default FormDatePickerItemNew
