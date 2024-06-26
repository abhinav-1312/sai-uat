import { Button, Form, Select, Table } from "antd";
import React, { useState } from "react";
import FormDatePickerItem from "../../components/FormDatePickerItem";

const { Option } = Select;

const txnType = {
null: "All",
  RN: "Return Note",
  ISN: "Issue Note",
  OGP: "Outward Gate Pass",
  IGP: "Inward Gate Pass",
  GRN: "Goods Receieved Note",
  IR: "Inspection Report",
  IRN: "Inspection Report New",
  REJ: "Rejection Note",
  ACT: "Acceptance Note",
};

const sampleData = [
    {
        txnDate: "11/12/2023",
        txnNo: 603,
        processType: "IOP",
        txnName: "IGP",
        genName: "Generated By"
    },
    {
        txnDate: "11/12/2023",
        txnNo: 603,
        processType: "IOP",
        txnName: "IGP",
        genName: "Generated By"
    },
    {
        txnDate: "11/12/2023",
        txnNo: 603,
        processType: "IOP",
        txnName: "IGP",
        genName: "Generated By"
    },
]

const columns = [
    {
        title: "Transaction Date",
        dataIndex: "txnDate"
    },
    {
        title: "Transaction No.",
        dataIndex: "txnNo"
    },
    {
        title: "Process Type",
        dataIndex: "processType"
    },
    {
        title: "Transaction Name",
        dataIndex: "txnName"
    },
    {
        title: "Generated By",
        dataIndex: "genName"
    },
]

const TransactionSlab = () => {
  const [filters, setFilters] = useState({
    txnType: null,
    fromDate: null,
    toDate: null,
    issueNoteType: null,
    isnFromDate: null,
    isnToDate: null
  });

  const handleFilterChange = (fieldName, value) => {
    setFilters(prev => {
        return {
            ...prev,
            [fieldName]: value
        }
    })
  }

  const handleReset = () => {

  }

  const handleSearch = () => {

  }

  const handleIsnSearch = () => {

  }

  const handleIsnReset = () => {

  }

  return (
    <div className="slab-content">
      <div className="filter-container">
          <Form.Item label="Transaction Type">
            <Select
              value={filters.txnType}
              onChange={(value) => handleFilterChange("txnType", value)}
            >
              {Object.entries(txnType).map(([key, value]) => (
                <Option key={key} value={key}>
                  {value}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <FormDatePickerItem label="From Date" name="fromDate" value={filters.fromDate} onChange={handleFilterChange} />
          <FormDatePickerItem label="To Date" name="toDate" value={filters.toDate} onChange={handleFilterChange} />
          <Button primary style={{backgroundColor: "#ff8a00", fontWeight: "bold"}} onClick={handleSearch}> Search </Button>
          <Button primary style={{fontWeight: "bold"}} onClick={handleReset}> Reset </Button>
      </div>

      {
        filters.txnType === "ISN" && (
            <div className="filter-container">
                 <Form.Item label="Transaction Type">
            <Select
              value={filters.issueNoteType}
              onChange={(value) => handleFilterChange("issueNoteType", value)}
            >
              {/* {Object.entries(txnType).map(([key, value]) => ( */}
                <Option key={'returnable'} value={"returnable"}>
                  {"Returnable"}
                </Option>
                <Option key={'nonReturnable'} value={"nonReturnable"}>
                  {"Non Returnable"}
                </Option>
                <Option key={'pendingReturnable'} value={"pendingReturnable"}>
                  {"Pending Returnable"}
                </Option>
              {/* ))} */}
            </Select>
          </Form.Item>

          <FormDatePickerItem label="From Date" name="isnFromDate" value={filters.isnFromDate} onChange={handleFilterChange} />
          <FormDatePickerItem label="To Date" name="isnToDate" value={filters.isnToDate} onChange={handleFilterChange} />
          <Button primary style={{backgroundColor: "#ff8a00", fontWeight: "bold"}} onClick={handleIsnSearch}> Search </Button>
          <Button primary style={{fontWeight: "bold"}} onClick={handleIsnReset}> Reset </Button>
            </div>
        )
      }
      <Table dataSource={sampleData} columns={columns} pagination={{pageSize: 10}} />
    </div>
  );
};

export default TransactionSlab;