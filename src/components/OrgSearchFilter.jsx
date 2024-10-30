import { Form, Select, Input } from "antd";
import React from "react";
import { useSelector } from "react-redux";
import Loader from "./Loader";

const { Option } = Select;

const OrgSearchFilter = ({handleChange}) => {
  const {data: orgData} = useSelector(state => state.orgMaster)

    if(!orgData){
      return <Loader />
    }
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
                  {option.organizationName}
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
