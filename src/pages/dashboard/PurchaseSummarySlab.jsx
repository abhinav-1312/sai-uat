import React, { useEffect } from 'react'
import { apiCall } from '../../utils/Functions'
import { useSelector } from 'react-redux'
import TransactionSummary from '../transactionSummary/TransactionSummary'
import FormInputItem from '../../components/FormInputItem'
import FormDatePickerItem from '../../components/FormDatePickerItem'
import { Button, Table } from 'antd'

const columns = [
  {
    title: "Transaction Date",
    dataIndex: ""
  },
  {
    title: "Transaction No.",
    dataIndex: ""
  },
  {
    title: "Process Type",
    dataIndex: ""
  },
  {
    title: "Transaction Name",
    dataIndex: ""
  },
  {
    title: "Transaction Value",
    dataIndex: ""
  },
]

const PurchaseSummarySlab = ({filters, setFilters, populateSummaryData, allData}) => {
    const {token} = useSelector(state => state.auth)
    // const populateSummaryData = async () => {
    //     const {responseData} = await apiCall("POST", "/txns/getTxnSummary", token, {  txnType: "PO", orgId: orgId ? orgId : null})
    // }
    // useEffect(()=>{
    //     populateData()
    // }, [])

    const handleChange = (fieldName, value) => {
      setFilters(prev=> {
        return {
          ...prev,
          [fieldName]: value
        }
      })
    }

    const handleSearch = async () => {

    }

    const handleReset = () =>{
    }

    return(
      <h3>Page under development.</h3>
    )
  return (
    <>
      <div className="slab-content">
        <div className="filter-container">
          <FormDatePickerItem label="Start Date" name="startDate" value={filters.startDate} onChange={handleChange} />
          <FormDatePickerItem label="End Date" name="endDate" value={filters.endDate} onChange={handleChange} />
          <FormInputItem label="Item Description" name="itemCode" value={filters.itemCode} onChange={handleChange} />
          <FormInputItem label="Subcategory Description" name="subcategory" value={filters.subcategory} onChange={handleChange} />
          <FormInputItem label="Usage Category Description" name="subcategory" value={filters.usageCategory} onChange={handleChange} />
          <Button primary style={{backgroundColor: "#ff8a00", fontWeight: "bold"}} onClick={handleSearch}> Search </Button>
          <Button primary style={{fontWeight: "bold"}} onClick={handleReset}> Reset </Button>
        </div>

        <Table
        dataSource={allData}
        columns={columns}
        pagination={{ pageSize: 10 }}
      />
      </div>
    </>
  )
}

export default PurchaseSummarySlab
