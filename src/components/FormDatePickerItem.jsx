import React from 'react'
import {Form, DatePicker} from "antd"
import dayjs from 'dayjs';
const dateFormat = "DD/MM/YYYY";

const FormDatePickerItem = ({label, name, defaultValue, onChange, value, readOnly}) => {
  const currentDate = dayjs();
  const defVal = defaultValue ? defaultValue : currentDate.format(dateFormat)
  const handleDateChange = (date, dateString) => {
    if (dateString === "") {
      onChange(name, null);
    } else {
      onChange(name, dateString);
    }
  };


  return (
    <Form.Item label = {label}>
      <DatePicker
      readOnly={readOnly}
      defaultValue={dayjs(defVal, dateFormat, true)}
      style={{ width: "100%" }}
      format={dateFormat}
      value={value ? dayjs(value, dateFormat, true) : dayjs(defVal, dateFormat, true)}
      onChange={handleDateChange}
    />

    </Form.Item>
  )
}

export default FormDatePickerItem
