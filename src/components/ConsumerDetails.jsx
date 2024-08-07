import React from 'react'
import FormInputItem from './FormInputItem'

const ConsumerDetails = ({consumerName, contactNo, txnType, handleChange}) => {
  return (
    <>
        <FormInputItem
          label="Consumer Name"
          name="consumerName"
          value={consumerName}
          onChange={handleChange}
          readOnly={txnType === 'ISN' ? false : true}
        />
        <FormInputItem
          label="Contact No."
          name="contactNo"
          onChange={handleChange}
          readOnly={txnType === 'ISN' ? false : true}
        />
    </>
  )
}

export default ConsumerDetails
