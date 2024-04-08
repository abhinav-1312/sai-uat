import React from 'react'
import { primColumn } from './ItemDetailTableColumn'
import {Table} from "antd"
const ItemDetailTable = ({dataSource, locationMaster, vendorMaster, selectedItems, setSelectedItems, setFormData, handleSelectedItems}) => {
    const columns = primColumn(locationMaster, vendorMaster, selectedItems, setSelectedItems, setFormData)
  return (
    <Table columns={columns} dataSource={dataSource} />
  )
}

export default ItemDetailTable
