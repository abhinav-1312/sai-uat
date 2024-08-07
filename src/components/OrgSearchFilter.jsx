import { Form, Select, Input } from "antd";
import React from "react";
import { useSelector } from "react-redux";
import Loader from "./Loader";

const { Option } = Select;

const OrgSearchFilter = ({handleChange}) => {
  // const {token} = useSelector(state => state.auth)
  const {data: orgData} = useSelector(state => state.orgMaster)
    // const [orgData, setOrgData] = useState(null)
    // const getOrgMaster = async () => {
    //     const orgIdUrl = "/master/getOrgMaster"
    //     try{
    //         const {data} = await axios.get(orgIdUrl, apiHeader("GET", token))
    //         const {responseData} = data
    //         const modRes = responseData?.map(item=>{
    //             return {id: item.id, name: item.organizationName}
    //         })
    //         setOrgData([...modRes])
    //     }catch(error){
    //         console.log("Error", error)
    //         message.error("Error occured while fetching organization details. Please try again.")
    //     }

    // }

    // useEffect(()=>{
    //     getOrgMaster()
    // }, [])

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
