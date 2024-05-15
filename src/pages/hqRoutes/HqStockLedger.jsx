import React, {useState} from 'react'
import OrgSearchFilter from '../../components/OrgSearchFilter'
import StockLedger from '../stockLedger/StockLedger'

const HqStockLedger = () => {
  const [orgId, setOrgId] = useState(null)

    const handleChange = (orgId) => {
        setOrgId(orgId)
    }
  return (
    <div>
      <OrgSearchFilter handleChange = {handleChange} />

      {
        orgId && <StockLedger orgId = {orgId} />
      }
    </div>
  )
}

export default HqStockLedger
