import React from 'react'
import IndependentVariableForm from '../../components/IndependentVariableForm'

const SaveIndependentVariables = () => {
    const saveSize = async (valueObj) => {
        
    }
    const saveBrand = async (valueObj) => {

    }
    const saveColor = async (valueObj) => {

    }
  return (
    <>
    <h1>
      Add new independent variables
    </h1>

    <IndependentVariableForm heading="Save Size" onfinish = {saveSize}  />
    <IndependentVariableForm heading="Save Brand" onfinish = {saveBrand} />
    <IndependentVariableForm heading="Save Color" onfinish = {saveColor} />
    </>
  )
}

export default SaveIndependentVariables
