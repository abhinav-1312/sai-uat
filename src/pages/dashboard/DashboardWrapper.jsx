import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import OrgSearchFilter from "../../components/OrgSearchFilter"
import Dashboard from './Dashboard'

const DashboardWrapper = () => {
    const {userRole} = useSelector(state => state.auth)
    const [orgId, setOrgId] = useState(null)

    const handleChange = (value) => {
        setOrgId(value)
    }

    console.log("ORGID: ", orgId)
  return (
    <div>
        {
            userRole === "ssadmin" && (
                <OrgSearchFilter handleChange={handleChange}/>
            )
        }
        {
            orgId && (
                <Dashboard orgId={orgId} />
            )
        }
        {
            userRole !== "ssadmin" && (
                <Dashboard orgId={null} />
            )
        }


    </div>
  )
}

export default DashboardWrapper
