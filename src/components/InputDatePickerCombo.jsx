import React from "react";
import FormInputItem from "./FormInputItem";
import FormDatePickerItem from "./FormDatePickerItem";

const InputDatePickerCombo = ({inputLabel, inputName, inputValue, onChange, dateLabel, dateName, dateValue, required, readOnly}) => {
  return (
    <div className="other-details-2cols">
      <FormInputItem
        label={inputLabel}
        name={inputName}
        onChange={onChange}
        required={required ? true : false}
        readOnly={readOnly}
      />
      <FormDatePickerItem 
        defaultValue={dateValue}
        label={dateLabel}
        name={dateName}
        onChange={onChange}
        readOnly={readOnly}
        required={required ? true : false}
      />
    </div>
  );
};

export default InputDatePickerCombo;
