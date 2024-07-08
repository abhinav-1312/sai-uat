import React, { useEffect, useRef, useState } from 'react'
import { apiCall, convertToCurrency } from '../../utils/Functions'
import { useSelector } from 'react-redux'
import TransactionSummary from '../transactionSummary/TransactionSummary'
import FormInputItem from '../../components/FormInputItem'
import FormDatePickerItem from '../../components/FormDatePickerItem'
import { Button, Input, Space, Table } from 'antd'
import {SearchOutlined} from '@ant-design/icons'
import Highlighter from 'react-highlight-words';



const PurchaseSummarySlab = ({filters, setFilters, populateSummaryData, allData, handleSumSearch}) => {
    const {token} = useSelector(state => state.auth)
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
    const handleSearch = (selectedKeys, confirm, dataIndex) => {
      confirm();
      setSearchText(selectedKeys[0]);
      setSearchedColumn(dataIndex);
    };
    const handleReset = (clearFilters) => {
      clearFilters();
      setSearchText('');
    };
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

    const handleReset1 = () =>{
    }

    const getColumnSearchProps = (dataIndex) => ({
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
        <div
          style={{
            padding: 8,
          }}
          onKeyDown={(e) => e.stopPropagation()}
        >
          <Input
            ref={searchInput}
            placeholder={`Search ${dataIndex}`}
            value={selectedKeys[0]}
            onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
            style={{
              marginBottom: 8,
              display: 'block',
            }}
          />
          <Space>
            <Button
              type="primary"
              onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
              icon={<SearchOutlined />}
              size="small"
              style={{
                width: 90,
              }}
            >
              Search
            </Button>
            <Button
              onClick={() => clearFilters && handleReset(clearFilters)}
              size="small"
              style={{
                width: 90,
              }}
            >
              Reset
            </Button>
            <Button
              type="link"
              size="small"
              onClick={() => {
                confirm({
                  closeDropdown: false,
                });
                setSearchText(selectedKeys[0]);
                setSearchedColumn(dataIndex);
              }}
            >
              Filter
            </Button>
            <Button
              type="link"
              size="small"
              onClick={() => {
                close();
              }}
            >
              close
            </Button>
          </Space>
        </div>
      ),
      filterIcon: (filtered) => (
        <SearchOutlined
          style={{
            color: filtered ? '#1677ff' : undefined,
          }}
        />
      ),
      onFilter: (value, record) =>
        record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
      onFilterDropdownOpenChange: (visible) => {
        if (visible) {
          setTimeout(() => searchInput.current?.select(), 100);
        }
      },
      render: (text) =>
        searchedColumn === dataIndex ? (
          <Highlighter
            highlightStyle={{
              backgroundColor: '#ffc069',
              padding: 0,
            }}
            searchWords={[searchText]}
            autoEscape
            textToHighlight={text ? text.toString() : ''}
          />
        ) : (
          text
        ),
    });

    const columns = [
      {
        title: "Transaction Date",
        dataIndex: "txnDate"
      },
      {
        title: "Transaction No.",
        dataIndex: "id",
        ...getColumnSearchProps('id'),
        sorter: (a, b) => parseInt(a.id) - parseInt(b.id),
      // sortOrder: sortedInfo.columnKey === 'name' ? sortedInfo.order : null,
      ellipsis: true,
      },
      {
        title: "Process Type",
        dataIndex: "processType"
      },
      {
        title: "Transaction Name",
        dataIndex: "processStage"
      },
      {
        title: "Transaction Value",
        dataIndex: "totalValue",
        render: (val) => convertToCurrency(val)
      },
    ]

    // return(
    //   <h3>Page under development.</h3>
    // )
  return (
    <>
      <div className="slab-content">
        <div className='pur-sum'>
          <FormDatePickerItem label="Start Date" name="startDate" value={filters.startDate} onChange={handleChange} />
          <FormDatePickerItem label="End Date" name="endDate" value={filters.endDate} onChange={handleChange} />
          <FormInputItem label="Item Code" name="itemCode" value={filters.itemCode} onChange={handleChange} />
          <FormInputItem label="Category Code" name="categoryCode" value={filters.categoryCode} onChange={handleChange} />
          <FormInputItem label="Subcategory Code" name="subCategoryCode" value={filters.subCategoryCode} onChange={handleChange} />
          {/* <FormInputItem label="Usage Category Description" name="subcategory" value={filters.usageCategory} onChange={handleChange} /> */}
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
