import { Form, Select, Input } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { apiHeader } from "../utils/Functions";
import { useSelector } from "react-redux";

const { Option } = Select;

const OrgSearchFilter = ({handleChange}) => {
  const {token} = useSelector(state => state.auth)
    const [orgData, setOrgData] = useState(null)
    const getOrgMaster = async () => {
        const orgIdUrl = "/master/getOrgMaster"
        try{
            const {data} = await axios.get(orgIdUrl, apiHeader("GET", token))
            const {responseData} = data
            const modRes = responseData.map(item=>{
                return {id: item.id, name: item.organizationName}
            })

            setOrgData([...modRes])
        }catch(error){
            console.log("Error", error)
            alert("Error occured while fetching organization details. Please try again.")
        }

    }

    useEffect(()=>{
        getOrgMaster()

    }, [])
  return (
    <>
      <Form style={{marginBottom: "1rem"}}>
        <Form.Item>
          <Select placeholder="Please select an organization."
            style={{ width: 200 }}
            onChange={(value) =>
                handleChange(value)
            }
            allowClear
          >
            {orgData ? (
              orgData.map((option, index) => (
                <Option key={option.id} value={option.id}>
                  {option.name}
                </Option>
              ))
            ) : (
              <Input />
            )}
          </Select>
        </Form.Item>
      </Form>
    </>
  );
};

export default OrgSearchFilter;
