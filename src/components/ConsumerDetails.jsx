import React from 'react'
import FormInputItem from './FormInputItem'

const ConsumerDetails = ({ handleChange, readOnly}) => {
  return (
    <>
    <div className="consignor-container">
            <h3 className="consignor-consignee-heading">
            "Consignee Details"
              </h3>
              
        <FormInputItem
          label="Consumer Name"
          name="consumerName"
          onChange={handleChange}
          readOnly={readOnly ? true : false}
        />
        <FormInputItem
          label="Contact No."
          name="contactNo"
          onChange={handleChange}
          readOnly={readOnly ? true : false}
        />

</div>
    </>
  )
}

export default ConsumerDetails
