import React, { useState } from 'react'
import IndependentVariableForm from '../../components/IndependentVariableForm'
import { apiCall } from '../../utils/Functions'
import { message } from 'antd'
import Loader from '../../components/Loader'
import { useSelector } from 'react-redux'

const SaveIndependentVariables = () => {
    // const saveSize = async (valueObj) => {
        
    // }
    // const saveBrand = async (valueObj) => {

    // }
    // const saveColor = async (valueObj) => {

    // }

    const [isLoading, setLoading] = useState(false)
    const {token} = useSelector(state => state.auth)

    const handleFinish = async (url, payload) => {
      setLoading(true)
      try{
        const {responseStatus, responseData} = await apiCall("POST", url, token, payload)
        console.log("Response status: ", responseStatus, responseData)
        message.success("Independent variable added successfully")
      }catch(error){
        console.log(error)
        message.error("Error adding the independent variable.")
      }finally{
        setLoading(false)
      }
    }

    if(isLoading){
      return <Loader />
    }
  return (
    <>
    <h1>
      Add new independent variables
    </h1>

    <IndependentVariableForm heading="Save Size" url="/genparam/saveSize" onFinish = {handleFinish}  />
    <IndependentVariableForm heading="Save Brand" url="/genparam/saveBrand" onFinish = {handleFinish} />
    <IndependentVariableForm heading="Save Color" url="genparam/saveColor" onFinish = {handleFinish} />
    <IndependentVariableForm heading="Save Usage" url="genparam/saveColor" onFinish = {handleFinish} />
    </>
  )
}

export default SaveIndependentVariables
