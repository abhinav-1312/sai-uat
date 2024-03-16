import React, { useEffect, useState } from 'react'
import {Form, Input, DatePicker, Select, Table, Button, message} from "antd"
import { processTypeList, trnTypeList, trnSummaryColumn } from './trnSummaryData';
import {useNavigate} from 'react-router-dom'
import axios from "axios"

const { Option } = Select;
const dateFormat = "DD/MM/YYYY";


const TransactionSummary = () => {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    trnNo: null,
    orgName: "",
    fromDate: null,
    toDate: null,
    transactionType: null,
    processType: null,
    itemCd: null,
    itemName: ""
  })

  const handleViewClick = (trnNo) => {
    navigate(`/trnsummary/${trnNo}`)
  }

  const handlePrintClick = (trnNo) => {
    console.log("View button called: ", trnNo)
  }

  const trnSumColumn = trnSummaryColumn(handleViewClick, handlePrintClick)

  const handleFormValueChange = (field, value) => {
    if(field === 'transactionType' || field === "processType"){
      setFormData(prevValues => {
        return {
          ...prevValues,
          [field]: value.value
        }
      })
      return
    }
    setFormData(prevValues=>{
      return {
        ...prevValues,
        [field]: value
      }
    })
  }

  const [itemData, setItemData] = useState([])
  const [filteredData, setFilteredData] = useState([])

  const populateData = async () => {
    try{
      const {data} = await axios.post("https://sai-services.azurewebsites.net/sai-inv-mgmt/txns/getTxnSummary", {startDate: null, endDate: null, itemCode: null})
      const {responseData} = data
      setFilteredData([...responseData])
    }catch(error){
      message.error("Error occured while fetching data. Please try again.")
      console.log("Populate data error.", error)
    }
  }

  useEffect(() => {
    populateData()
  }, [])

  const handleSearch = async () => {
    try{
      console.log("Handle search called")
      console.log("StartDate: ", formData.fromDate)
      console.log("End date: ", formData.toDate)
      console.log("Id: ", formData.itemCd)
      const {data} = await axios.post("https://sai-services.azurewebsites.net/sai-inv-mgmt/txns/getTxnSummary", {startDate: formData.fromDate, endDate: formData.toDate, itemCode: formData.itemCd})
      const {responseData} = data
      console.log("resposnedata: ", responseData)
      setFilteredData([...responseData])
    }catch(error){
      message.error("Some error occured. Please try again.");
      console.log("Some error orrcured.", error)
    }
  } 

  const handleReset = () => {
    setFormData({itemCd: null, fromDate: null, toDate: null})
  }

  return (
    <>
    {/* <Button type="primary"> Button primary</Button>
    <Button type="success" style={{backgroundColor: "#3fb950", border: "#3fb950", color: "#ffffff"}}> Button primary</Button> */}
      <h1 style={{textAlign: "center"}}> Transaction Summary</h1>
      <div style={{margin: "1rem", border: "1px solid rgb(87, 202, 195)", padding: "1rem", borderRadius: "1%"}}>
        <Form style={{display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1rem"}}>

          <Form.Item label="Item Code" name="itemCode" style={{gridColumn: "1 / span 2"}}>
            <Input value={formData.itemCd} onChange={(e) => handleFormValueChange("itemCd", e.target.value)}/>
          </Form.Item>

          <Form.Item label="From Date" name="fromDate">
            <DatePicker
              format={dateFormat}
              style={{ width: "100%" }}
              onChange={(date, dateString) =>
                handleFormValueChange("fromDate", dateString)
              }
            />
          </Form.Item>


          <Form.Item label="To Date" name="toDate">
            <DatePicker
              format={dateFormat}
              style={{ width: "100%" }}
              onChange={(date, dateString) =>
                handleFormValueChange("toDate", dateString)
              }
            />
          </Form.Item>
          <Button type="primary" onClick={()=>handleSearch()}>Search</Button>
          <Button onClick={()=>handleReset()}>Reset</Button>
          
        </Form>

      </div>

      <Table dataSource={filteredData} columns={trnSumColumn} scroll={{ x: "max-content" }} />

    </>
  )
}

export default TransactionSummary
