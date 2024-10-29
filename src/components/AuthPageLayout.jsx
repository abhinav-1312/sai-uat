import React from 'react'
import SAI_Logo from '../assets/images/SAI_logo.svg'

const AuthPageLayout = ({children}) => {
  return (
    <div className="login-container">
      <div className="logo-container">
        <img src={SAI_Logo} alt="SAI LOGO" className="logo" />
      </div>
      <div className='form-container'>
        {children}
      </div>
    </div>
  )
}

export default AuthPageLayout
