import React from 'react'
import { itemDetails, orgConsigneeDetails, orgConsignorDetails, supplierDetails } from '../CommonColumns'
import { convertEpochToDateString } from '../../../utils/Functions'
import DetailData from './DetailData'

const AcceptanceNoteTable = ({type, data, itemList}) => {
    const actDataTableColumns = [
        {
            title: "Acceptance Note No.",
            dataIndex: "acptRejNoteNo"
        },
        {
            title: "Acceptance Note Date",
            dataIndex: "acptRejNoteDT"
        },
        {
            title: "Generated Date",
            dataIndex: "genDate"
        },
        {
            title: "Generated By",
            dataIndex: "genName"
        },
        {
            title: "Detail ID",
            dataIndex: "id"
        },
        {
            title: "Process ID",
            dataIndex: "processId"
        },
        {
            title: "Process Type",
            dataIndex: "type"
        },
        {
            title: "Note Type",
            dataIndex: "typeOfNote"
        },

        ...orgConsigneeDetails,

        {
            title: "Noa No.",
            dataIndex: "noa"
        },
        {
            title: "Noa Date",
            dataIndex: "noaDate",
            render: (date) => convertEpochToDateString(date)
        },
        {
            title: "Date of Delivery",
            dataIndex: "dateOfDelivery"
        },
    ]

    const actItemTableColumn = [
        ...itemDetails,
        {
            title: "Accepted Quantity",
            dataIndex: "acceptedQuantity"
        },
        {
            title: "Remarks",
            dataIndex: "remarks"
        }
    ]

  return (
    <DetailData dataColumn={type === "PO" ? [...actDataTableColumns, ...supplierDetails] : [...actDataTableColumns, ...orgConsignorDetails]} itemListColumn={actItemTableColumn} data={data} itemList={itemList}/>
  )
}

export default AcceptanceNoteTable
