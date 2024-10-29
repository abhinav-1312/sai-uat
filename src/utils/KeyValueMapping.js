export const processType = {
    "PO" : "Purchase Order",
    "IRP" : "Issue Return Process",
    "NIRP" : "Non Returnable Issue Return Process",
    "IOP" : "Inter Org Transfer",
    "CRN" : "Correction Process"
}

export const processStage = {
    'RN': "Return Note",
    'ISN': "Issue Note",
    'OGP': "Outward Gate Pass",
    'IGP': "Inward Gate Pass",
    'GRN': "Goods Receieved Note",
    'IR': "Material Inward Slip",
    'IRN': "Inspection Note",
    'REJ': "Rejection Note",
    'ACT': "Acceptance Note",
}

export const formDate = {
    'RN': 'returnNoteDt',
    'ISN': 'issueNoteDt',
    'OGP': 'gatePassDate',
    'IGP': 'gatePassDate',
    'GRN': 'grnDate',
    'IR': 'inspectionRptDate',
    'IRN': 'inspectionRptDate',
    'REJ': 'acptRejNodeDT',
    'ACT': 'acptRejNodeDT'
}
export const formNo = {
    'RN': 'returnNoteNo',
    'ISN': 'issueNoteNo',
    'OGP': 'gatePassNo',
    'IGP': 'gatePassNo',
    'GRN': 'grnNo',
    'IR': 'inspectionRptNo',
    'IRN': 'inspectionRptNo',
    'REJ': 'acptRejNoteNo',
    'ACT': 'acptRejNoteNo'
}

export const processTypeIsnOptionList= [
{
    value: "IRP",
    desc: "Issue Return Process"
},
{
    value: "NIRP",
    desc: "Non Returnable Issue Return"
},
{
    value:  "IOP",
    desc: "Inter Org Process"
}

]

export const processTypeGrnOptionList= [
{
    value: "IRP",
    desc: "Issue Return Process"
},
{
    value: "PO",
    desc: "Purchase Order"
},
{
    value:  "IOP",
    desc: "Inter Org Process"
}

]

export const iopTypeOptionList = [
    {
        value: "Accepted Items",
        desc: "Accepted Items"
    },
    {
        value: "Rejected Items",
        desc: "Rejected Items"
    }
]

export const processTypeAcptOptionList = [
    {
        value: "PO",
        desc: "Purchase Order"
    },
    {
        value: "IOP",
        desc: "Inter Org Transfer"
    }
]
