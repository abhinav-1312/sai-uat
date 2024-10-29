// import React from "react";
// import { Form, DatePicker } from "antd";
// import dayjs from "dayjs";
// const dateFormat = "DD/MM/YYYY";

// const FormDatePickerItem = ({
//   label,
//   name,
//   defaultValue,
//   onChange,
//   value,
//   readOnly,
//   required,
// }) => {
//   const currentDate = dayjs();
//   const defVal = defaultValue ? defaultValue : currentDate.format(dateFormat);
//   const handleDateChange = (date, dateString) => {
//     if (dateString === "") {
//       onChange(name, null);
//     } else {
//       onChange(name, dateString);
//     }
//   };

//   return (
//     <Form.Item
//       label={label}
//       rules={[
//         { required: required ? true : false, message: "Please input value!" },
//       ]}
//     >
//       <DatePicker
//         disabled={readOnly}
//         defaultValue={dayjs(defVal, dateFormat, true)}
//         style={{ width: "100%" }}
//         format={dateFormat}
//         // value={value ? dayjs(value, dateFormat, true) : dayjs(defVal, dateFormat, true)}
//         name={name}
//         onChange={handleDateChange}
//       />
//     </Form.Item>
//   );
// };

// export default FormDatePickerItem;


import React from "react";
import { Form, DatePicker } from "antd";
import dayjs from "dayjs";
import FormInputItem from "./FormInputItem";

const dateFormat = "DD/MM/YYYY";

const FormDatePickerItem = ({
  label,
  name,
  defaultValue,
  onChange,
  readOnly,
  required,
}) => {
  const initialValue = defaultValue ? dayjs(defaultValue, dateFormat) : null;

  const handleDateChange = (date) => {
    if (date) {
      if (dayjs.isDayjs(date)) {
        onChange(name, date.format(dateFormat));
      } else {
        onChange(name, null);
      }
    } else {
      onChange(name, null);
    }
  };

  if(readOnly){
    return <FormInputItem label={label} value={defaultValue} name={name} readOnly />
  }

  return (
    <Form.Item
      label={label}
      rules={[
        { required: required ?? false, message: "Please input value!" },
      ]}
      initialValue={initialValue} // Set initial value
    >
      <DatePicker
        style={{ width: "100%" }}
        format={dateFormat}
        onChange={handleDateChange}
        value={initialValue} // Control the value of DatePicker
      />
    </Form.Item>
  );
};

export default FormDatePickerItem;
