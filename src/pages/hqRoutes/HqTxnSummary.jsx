import React, { useState } from 'react'
import {Form} from "antd"
import FormInputItem from '../../components/FormInputItem'
import OrgSearchFilter from '../../components/OrgSearchFilter'
import TransactionSummary from '../transactionSummary/TransactionSummary'
import Loader from '../../components/Loader'
import { useSelector } from 'react-redux'
import { apiCall } from '../../utils/Functions'

const HqTxnSummary = () => {
    const [orgId, setOrgId] = useState(null)

    const handleChange = (orgId) => {
        setOrgId(orgId)
    }

    let activeUsers = {}
    let allTxns = []

    const [allTxn, setAllTxn] = useState([])
    const {data: orgMaster} = useSelector(state => state.organizations)
    const {token} = useSelector(state => state.auth)
    const fetchActiveUser = async () => {
    orgMaster?.forEach(async org => {
      // activeUsers[org.organizationName] = []
      if(org.id !== 38){

          try{
              
              const {responseData: txnSummaryOrgwWise} = await apiCall('POST', '/txns/getTxnSummary', token, {orgId: org.id, endDate: null, startDate: null, itemCode: null, txnType: null})
              // console.log('txn sum org wise: ',  txnSummaryOrgwWise)
              // setAllTxn(prev=> {
              //   return [...prev, ...txnSummaryOrgwWise]
              // })
              // console.log('txnsumorgwise: ', txnSummaryOrgwWise)
              const genNameSet = new Set()
              txnSummaryOrgwWise.forEach(txn => {
                genNameSet.add(txn.id)
                allTxns.push(txn.id)
              })
              activeUsers[org.organizationName] = Array.from(genNameSet)
              // console.log('Alltxns: ', allTxns)
              setAllTxn(prev => {
                return [...prev, ...allTxns]
              })
              // allTxns.push(genNameSet)
              // txnSummaryOrgwWise.forEach( async txn => {
              //   const {responseData: txnDtlsTxnWise} = await apiCall('POST', '/txns/getTxnDtls', token, {processId: txn.id})
              //   Object.keys(txnDtlsTxnWise).forEach(key => {
              //     if(key !== 'processId'){
              //       if(key.data){
              //         genNameSet.add(key.data.genName)
              //       }
              //     }
              //   })
              // })

              // activeUsers[org.organizationName] = Array.from(genNameSet)
              // console.log("Activr userer: ", activeUsers)
            }
            catch(error){
                console.log("error for ", org.id, error)
            }
        }
    })
    // console.log("Active users : ", activeUsers)
  }

  console.log("All txnss: ", allTxn)
  
  // console.log('activeUsers: ', allTxn)
  fetchActiveUser()
  if(!orgMaster){
    return <Loader />
  }
  return (
    <>
        <div>
            <OrgSearchFilter handleChange={handleChange} />
            {
                orgId && 
                <TransactionSummary orgId = {orgId} />
            }
        </div>
    </>
  )
}

export default HqTxnSummary
