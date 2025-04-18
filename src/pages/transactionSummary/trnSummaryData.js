import { Button } from "antd";
import { processStage, processType } from "../../utils/KeyValueMapping";


const txnName = [

  {
    text: "Return Note",
    value: "RN"
  },
  {
    text: "Issue Note",
    value: "ISN"
  },
  {
    text: "Outward Gate Pass",
    value: "OGP"
  },
  {
    text: "Inward Gate Pass",
    value: "IGP"
  },
  {
    text: "Material Inward Slip",
    value: "IR"
  },
  {
    text: "Inspection Note",
    value: "IRN"
  },
  {
    text: "Rejection Note",
    value: "REJ"
  },
  {
    text: "Acceptance Note",
    value: "ACT"
  },
    {
      text: "Goods Receive Note",
      value: "GRN"
    },
  ]

export const trnSummaryColumn = (handleViewClick, handlePrintClick, processStageFilter) => {
    return [
        {
            title: "Transaction No",
            fixed: "left",
            key: "id",
            dataIndex: "id"
        },
        {
            title: "Process Type",
            key: "processType",
            dataIndex: "processType",
            filters: [
              {
                text: "Issue Return Process",
                value: "IRP"
              },
              {
                text: "Purchase Order",
                value: "PO"
              },
              {
                text: "Inter Org Transfer",
                value: "IOP"
              },
              {
                text: "Correction Process",
                value: "CRN"
              },
              {
                text: "Non Returnable Issue Return Process",
                value: "NIRP"
              },
            ],
            onFilter: (value, record) => record.processType.indexOf(value) === 0,
            render: (value) => processType[value]
        },
        {
            title: "Process Stage",
            key: "processStage",
            dataIndex: "processStage",
            filters: [...processStageFilter],
            onFilter: (value, record) => {
              return record?.processStage === value
             },
            render: (value) => processStage[value]
        },
        {
            title: "Status",
            key: "status",
            dataIndex: "status"
        },
        {
            title: "View",
            id: "view",
            fixed: "right",
            render: (_, record) => <Button type={"primary"} onClick={()=>handleViewClick(record.id)}> View </Button>,
        },
        {
            title: "Print",
            fixed: "right",
            id: "print",
            render: (_, record) => <Button danger onClick={()=>handlePrintClick(record.id)}> Print </Button>
        },

    ]
}

export const trnTypeList = [
  {
    id: 1,
    desc: "All",
  },
  {
    id: 2,
    desc: "Issue Note",
  },
  {
    id: 3,
    desc: "OGP",
  },
  {
    id: 4,
    desc: "IGP",
  },
  {
    id: 5,
    desc: "Return Note",
  },
  {
    id: 6,
    desc: "GRN",
  },
  {
    id: 7,
    desc: "MIS",
  },
  {
    id: 8,
    desc: "Inspection Note",
  },
  {
    id: 9,
    desc: "Acceptance Note",
  },
  {
    id: 10,
    desc: "Rejection Note",
  },
];

export const processTypeList = [
  {
    id: "PO",
    desc: "Purchase Order",
  },
  {
    id: "IRP",
    desc: "Returnable Issue/Return",
  },
  {
    id: "NIRP",
    desc: "Non Returnable Issue/Return",
  },
  {
    id: "IOP",
    desc: "Inter Org Transaction",
  },
];

