import React from 'react'

const CrCeDtlContainer = ({children, formData}) => {
  return (
    <div 
        style={{
          display: 'grid',
          gridTemplateColumns: "repeat(auto-fit, minmax(10rem, 1fr))",
          gap: "1rem",
        }}
    >
      {children}
    </div>
  )
}

export default CrCeDtlContainer
