import React from 'react'
import FormInputItem from './FormInputItem'

const ConsumerDetails = ({consumerName, contactNo, txnType, handleChange, heading}) => {
  return (
    <>
    <div className="consignor-container">
            <h3 className="consignor-consignee-heading">
            "Consignee Details"
              </h3>
              
        <FormInputItem
          label="Consumer Name"
          name="consumerName"
          // value={consumerName}
          onChange={handleChange}
          // readOnly={txnType === 'ISN' ? false : true}
        />
        <FormInputItem
          label="Contact No."
          name="contactNo"
          // value={contactNo}
          onChange={handleChange}
          // readOnly={txnType === 'ISN' ? false : true}
        />

</div>
    </>
  )
}

export default ConsumerDetails
