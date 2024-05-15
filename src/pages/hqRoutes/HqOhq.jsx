import React, { useState } from 'react'
import OrgSearchFilter from '../../components/OrgSearchFilter'
import Ohq from '../ohq/ohq'

const HqOhq = () => {
  const [orgId, setOrgId] = useState(null)

    const handleChange = (orgId) => {
      console.log("HandleChange called ohq")
        setOrgId(orgId)
    }

    console.log("ORGGG ID: ", orgId)
  return (
    <div>
      <OrgSearchFilter handleChange={handleChange} />

      {
        orgId && <Ohq orgId = {orgId} />
      }
    </div>
  )
}

export default HqOhq
