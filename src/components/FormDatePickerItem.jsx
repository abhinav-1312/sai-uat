import React, { useState } from 'react'
import {Form, DatePicker} from "antd"
import moment from 'moment/moment';
import dayjs from 'dayjs';
const dateFormat = "DD/MM/YYYY";

const FormDatePickerItem = ({label, name, defaultValue, onChange, value, readOnly}) => {
  const currentDate = dayjs();
  const defVal = currentDate.format(dateFormat)
  // const [dateError, setDateError] = useState('');
  // const handleDateChange = (date, dateString) => {
  //   console.log("DATE, ", date)
  //   console.log("VALID: ", dayjs(date, "DD/MM/YYYY", true).isValid())
  //   if (date && dayjs(date, 'DD/MM/YYYY', true).isValid()) {
  //     console.log("IFFF")
  //     onChange(name, dateString)
  //     setDateError('');
  //   }else {
  //     setDateError('Please select a valid date');
  //   }
  // }

  // return (
  //   <Form.Item label={label} name={name} validateStatus={dateError ? 'error' : ''} help={dateError}>
  //     <DatePicker value={dayjs(value, dateFormat, true)} style={{width: "100%"}} value={value}  defaultValue={dayjs(defaultValue, dateFormat, true)} format={dateFormat} onChange={handleDateChange}/>
  //   </Form.Item>
  // )
  const handleDateChange = (date, dateString) => {
    if (dateString === "") {
      onChange(name, null);
    } else {
      onChange(name, dateString);
    }
  };


  return (
    <Form.Item label = {label}>
      {/* <DatePicker readOnly={readOnly} defaultValue={defaultValue} style={{width: "100%"}} format={dateFormat} value={dayjs(value, dateFormat, true)} onChange={(date, dateString) => onChange(name, dateString)}/> */}

      <DatePicker
      readOnly={readOnly}
      defaultValue={dayjs(defVal, dateFormat, true)}
      // defaultValue={dayjs(defaultValue, dateFormat, true)}
      style={{ width: "100%" }}
      format={dateFormat}
      value={value ? dayjs(value, dateFormat, true) : dayjs(defVal, dateFormat, true)}
      onChange={handleDateChange}
    />

    </Form.Item>
  )
}

export default FormDatePickerItem
