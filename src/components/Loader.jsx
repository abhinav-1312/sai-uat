import { Spin } from 'antd'
import React from 'react'

const Loader = () => {
  return (
    <div className="loader-overlay">
    <Spin size="large" />
    <h4>Please wait...</h4>
  </div>

  )
}

export default Loader
