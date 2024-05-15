import React, { useState } from 'react'
import {Form} from "antd"
import FormInputItem from '../../components/FormInputItem'
import OrgSearchFilter from '../../components/OrgSearchFilter'
import TransactionSummary from '../transactionSummary/TransactionSummary'

const HqTxnSummary = () => {
    const [orgId, setOrgId] = useState(null)

    const handleChange = (orgId) => {
        setOrgId(orgId)
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
