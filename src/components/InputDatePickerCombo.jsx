import React from "react";
import FormInputItem from "./FormInputItem";
import FormDatePickerItem from "./FormDatePickerItem";

const InputDatePickerCombo = ({inputLabel, inputName, inputValue, onChange, dateLabel, dateName, dateValue}) => {
  return (
    <div className="other-details-2cols">
      <FormInputItem
        label={inputLabel}
        name={inputName}
        value={inputValue}
        onChange={onChange}
      />
      <FormDatePickerItem 
        label={dateLabel}
        name={dateName}
        onChange={onChange}
        value={dateValue}
      />
    </div>
  );
};

export default InputDatePickerCombo;
