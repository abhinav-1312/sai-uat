import React, { useEffect } from 'react'
import { apiCall } from '../../utils/Functions'
import { useSelector } from 'react-redux'

const PurchaseSummarySlab = ({orgId}) => {
    const {token} = useSelector(state => state.auth)
    const populateData = async () => {
        const {responseData} = await apiCall("POST", "/txns/getTxnSummary", token, {  txnType: "PO", orgId: orgId ? orgId : null})
    }
    useEffect(()=>{
        populateData()
    }, [])
  return (
    <h1>
      Page Under Development
    </h1>
  )
}

export default PurchaseSummarySlab
