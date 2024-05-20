import React, { useState } from 'react'
import OrgSearchFilter from '../../components/OrgSearchFilter'
import Ohq from '../ohq/ohq'
import { ConfigProvider, Radio } from 'antd'
import 'antd/dist/reset.css'; 

const HqOhq = () => {
  const [orgId, setOrgId] = useState(null)
  const [radioValue, setRadioValue] = useState(null)

    const handleChange = (orgId) => {
        setOrgId(orgId)
    }
    const handleRadioChange = (value) => {
      console.log("Selected value: ", value)
      if(value === "2"){
        setOrgId(null)
      }
      setRadioValue(value)
    }

    const handleRadioClick = () => {

    }
  return (
    <div>
      <Radio.Group onChange = {(e) => handleRadioChange(e.target.value)} value={radioValue} style={{display: "flex",gap: "4rem", padding: "2rem 0"}}>
      <Radio value="1" checked={radioValue === "1"}>
        <h3>
          Check OHQ Organization Wise
        </h3>
      </Radio>
      <Radio value="2" checked={radioValue === "2"}>
        <h3>
          Check OHQ For An Item In All
        </h3>
        </Radio>
      </Radio.Group>

      {
        radioValue === "1" &&
        <OrgSearchFilter handleChange={handleChange} />
      }

      {
        radioValue === "1" && orgId && <Ohq orgId = {orgId} />
      }

      {
        radioValue === "2" && <Ohq organization="headquarter" orgId = {null} />
      }
    </div>
  )
}

export default HqOhq
