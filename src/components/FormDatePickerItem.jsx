import React from "react";
import { Form, DatePicker } from "antd";
import dayjs from "dayjs";
const dateFormat = "DD/MM/YYYY";

const FormDatePickerItem = ({
  label,
  name,
  defaultValue,
  onChange,
  value,
  readOnly,
  required,
}) => {
  const currentDate = dayjs();
  const defVal = defaultValue ? defaultValue : currentDate.format(dateFormat);
  const handleDateChange = (date, dateString) => {
    if (dateString === "") {
      onChange(name, null);
    } else {
      onChange(name, dateString);
    }
  };

  return (
    <Form.Item
      label={label}
      rules={[
        { required: required ? true : false, message: "Please input value!" },
      ]}
    >
      <DatePicker
        readOnly={readOnly}
        defaultValue={dayjs(defVal, dateFormat, true)}
        style={{ width: "100%" }}
        format={dateFormat}
        // value={value ? dayjs(value, dateFormat, true) : dayjs(defVal, dateFormat, true)}
        name={name}
        onChange={handleDateChange}
      />
    </Form.Item>
  );
};

export default FormDatePickerItem;
