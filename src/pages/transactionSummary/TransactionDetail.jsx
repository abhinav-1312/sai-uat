// import React, { useEffect, useRef, useState } from "react";
// import { Button } from "antd";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "axios";
// import { apiHeader } from "../../utils/Functions";
// import AcceptanceNoteTable from "./detailData/AcceptanceNoteTable";
// import GrnTable from "./detailData/GrnTable";
// import IgpTable from "./detailData/IgpTable";
// import InspectionNoteTable from "./detailData/InspectionNoteTable";
// import RejNoteTable from "./detailData/RejNoteTable";
// import OgpTable from "./detailData/OgpTable";
// import IsnTable from "./detailData/IsnTable";
// import ReturnTable from "./detailData/ReturnTable";
// import MisTable from "./detailData/MisTable";
// import { useSelector } from "react-redux";
// import { CSVLink } from "react-csv";

// const style = {display: "flex", gap: "1rem", marginBottom: "0.5rem", alignItems: "center"}

// const TransactionDetail = () => {
//   const navigate = useNavigate();
//   const { trnno: url } = useParams();
//   const urlArr = url.split("_");
//   const trnOrgIdCombined = urlArr[0].split("-")
//   const orgId = trnOrgIdCombined.length === 2 ? trnOrgIdCombined[1] : null
//   const trnNo = trnOrgIdCombined[0];

//   const txnRef = useRef()

//   const arrayToConvert = urlArr.slice(1);
//   const objectFromArr = arrayToConvert.reduce((acc, key) => {
//     acc[key] = true;
//     return acc;
//   }, {});

//   const {organizationDetails} = useSelector(state => state.auth)

//   const [acceptData, setAcceptData] = useState(null);
//   const [returnData, setReturnData] = useState(null);
//   const [igpData, setIgpData] = useState(null);
//   const [misData, setMisData] = useState(null);
//   const [inspectionNoteData, setInspectionNoteData] = useState(null);
//   const [isnData, setIsnData] = useState(null);
//   const [grnData, setGrnData] = useState(null);
//   const [ogpData, setOgpData] = useState(null);
//   const [rejectData, setRejectData] = useState(null);
//   const [isnCsv, setIsnCsv] = useState(null);
//   const [ogpCsv, setOgpCsv] = useState(null);
//   const [igpCsv, setIgpCsv] = useState(null);
//   const [rnCsv, setRnCsv] = useState(null);
//   const [grnCsv, setGrnCsv] = useState(null);
//   const [inspCsv, setInspCsv] = useState(null);
//   const [misCsv, setMisCsv] = useState(null);
//   const [acptCsv, setAcptCsv] = useState(null);
//   const [rejCsv, setRejCsv] = useState(null);
//   const {token} = useSelector(state => state.auth);

//   const populateHqData = async (orgId)=> {
//     const trnDetailUrl =
//       "/txns/getTxnDtls";
//     const { data } = await axios.post(
//       trnDetailUrl,
//       { processId: trnNo, orgId },
//       apiHeader("POST", token)
//     );
//     const { responseData } = data;
//     const {
//       acceptData,
//       grndata,
//       igpdata,
//       inspectionRptData,
//       isndata,
//       ogpdata,
//       rejectData,
//       rndata,
//       inspectionNewRptData,
//     } = responseData;
//     setAcceptData(acceptData);
//     setIgpData(igpdata);
//     setMisData(inspectionRptData);
//     setIsnData(isndata);
//     setOgpData(ogpdata);
//     setGrnData(grndata);
//     setRejectData(rejectData);
//     setInspectionNoteData(inspectionNewRptData);
//     setReturnData({
//       data: rndata.data,
//       itemList: rndata.itemList ? rndata.itemList.map((item) => {
//         const issueNoteDt = rndata.data ? rndata.data.issueNoteDt : null;
//         const genDate = rndata.data ? rndata.data.genDate : null;

//         return {
//           ...item,
//           issueNoteDt,
//           genDate,
//         };
//       }) : [] // Return an empty array instead of null for itemList
//     });
//   }

//   const handleNavigate = () => {
//       navigate(-1)
//   }

//   const populateData = async () => {
//     const trnDetailUrl =
//       "/txns/getTxnDtls";
//     const { data } = await axios.post(
//       trnDetailUrl,
//       { processId: trnNo },
//       apiHeader("POST", token)
//     );
//     const { responseData } = data;
//     const {
//       acceptData,
//       grndata,
//       igpdata,
//       inspectionRptData,
//       isndata,
//       ogpdata,
//       rejectData,
//       rndata,
//       inspectionNewRptData,
//     } = responseData;
//     setAcceptData(acceptData);
//     setIgpData(igpdata);
//     setMisData(inspectionRptData);
//     setIsnData(isndata);
//     setOgpData(ogpdata);
//     setGrnData(grndata);
//     setRejectData(rejectData);
//     setInspectionNoteData(inspectionNewRptData);
//     setReturnData({
//       data: rndata.data,
//       itemList: rndata.itemList ? rndata.itemList.map((item) => {
//         const issueNoteDt = rndata.data ? rndata.data.issueNoteDt : null;
//         const genDate = rndata.data ? rndata.data.genDate : null;

//         return {
//           ...item,
//           issueNoteDt,
//           genDate,
//         };
//       }) : [] // Return an empty array instead of null for itemList
//     });

//   };

//   const handleIsnPrint = () => {
//     navigate('/trans/issue', {
//       state: { data: isnData.data, itemList: isnData.itemList }, // Pass data as state
//     });
//   }

//   const handleOgpPrint = () => {
//     navigate('/trans/outward', {
//       state: {data: ogpData.data, itemList: ogpData.itemList}
//     })
//   }

//   const handleRnPrint = () => {
//     navigate("/trans/return", {
//       state: {
//         data: returnData.data,
//         itemList: returnData.itemList
//       }
//     })
//   }

//   const handleIgpPrint = () => {
//     navigate("/trans/inward", {
//       state: {
//         data: returnData.data,
//         itemList: returnData.itemList
//       }
//     })
//   }

//   let finalCsvData = [];
//   if(isnCsv) finalCsvData = [...finalCsvData, ...isnCsv]
//   if(ogpCsv) finalCsvData = [...finalCsvData, ...ogpCsv]
//   if(igpCsv) finalCsvData = [...finalCsvData, ...igpCsv]
//   if(rnCsv) finalCsvData = [...finalCsvData, ...rnCsv]
//   if(grnCsv) finalCsvData = [...finalCsvData, ...grnCsv]
//   if(misCsv) finalCsvData = [...finalCsvData, ...misCsv]
//   if(inspCsv) finalCsvData = [...finalCsvData, ...inspCsv]
//   if(acptCsv) finalCsvData = [...finalCsvData, ...acptCsv]
//   if(rejCsv) finalCsvData = [...finalCsvData, ...rejCsv]

//   useEffect(() => {
//     if(orgId){
//       populateHqData(orgId)
//     }
//     else{
//       populateData();
//     }
//   }, []);
//   return (
//     <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }} ref={txnRef}>
//       {
//         finalCsvData.length > 0 && (
//           <>
//           <CSVLink
//         data={finalCsvData}
//         filename={`transaction_detail_${organizationDetails?.organizationName}.csv` }
//         style={{ marginBottom: 16, border: "1px solid", width: "max-content", padding: "1rem" }}
//         className="ant-btn ant-btn-primary"
//         >
//         Export to CSV
//       </CSVLink>
//         </>
//         )
//       }
//       <div
//         style={{
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center",
//         }}
//       >
//         <div>
//           <Button type="primary" onClick={() => handleNavigate()}>
//             Back
//           </Button>
//         </div>
//         <h1>Transaction Detail</h1>
//         <h1>Transaction No: {trnNo}</h1>
//       </div>

//       {objectFromArr["ISN"] && (
//         <div>
//           <div style={style}>
//           <h2>Issue Note</h2>
//           {
//             isnData?.data &&
//             <Button danger onClick = {handleIsnPrint}> Print </Button>
//           }
//           </div>
//           {isnData?.data ? (
//             <IsnTable
//               type={isnData?.data?.type}
//               processType="isn"
//               data={isnData?.data}
//               itemList={isnData?.itemList}
//               csv = {isnCsv} // data converted to csv format
//               setCsv = {setIsnCsv}
//             />
//           ) : (
//             "No data available."
//           )}
//         </div>
//       )}

//       {objectFromArr["OGP"] && (
//         <div>
//           <div style={style}>
//           <h2>Outward Gate Pass</h2>
//           {
//             ogpData?.data &&
//             <Button danger onClick = {handleOgpPrint}> Print </Button>
//           }
//           </div>
//           {ogpData?.data ? (
//             <OgpTable
//               type={ogpData?.data?.type}
//               processType="ogp"
//               data={ogpData?.data}
//               itemList={ogpData?.itemList}
//               setCsv = {setOgpCsv}
//             />
//           ) : (
//             "No data available."
//           )}
//         </div>
//       )}

//       {objectFromArr["IGP"] && (
//         <div>
//           div
//           <h2>Inward Gate Pass</h2>
//           {igpData?.data ? (
//             <IgpTable
//               type={igpData?.data.type}
//               processType="igp"
//               data={igpData?.data}
//               itemList={igpData?.itemList}
//               setCsv = {setIgpCsv}
//             />
//           ) : (
//             "No data available."
//           )}
//         </div>
//       )}

//       {objectFromArr["RN"] && (
//         <div>
//           <div style={style}>

//           <h2>Return Note</h2>
//           {
//             returnData?.data &&
//             <Button danger onClick = {handleRnPrint}> Print </Button>
//           }
//           </div>
//           {returnData?.data ? (
//             <ReturnTable
//               type={returnData?.data?.type}
//               processType="rn"
//               data={returnData?.data}
//               itemList={returnData?.itemList}
//               setCsv = {setRnCsv}
//             />
//           ) : (
//             "No data available."
//           )}
//         </div>
//       )}

//       {objectFromArr["GRN"] && (
//         <div>
//           <h2>Goods Receive Note</h2>
//           {grnData?.data ? (
//             <GrnTable
//               type={grnData?.data?.type}
//               processType="grn"
//               data={grnData?.data}
//               itemList={grnData?.itemList}
//               setCsv = {setGrnCsv}
//             />
//           ) : (
//             "No data available."
//           )}
//         </div>
//       )}

//       {objectFromArr["ACT"] && (
//         <div>
//           <h2>Acceptance Note</h2>
//           {acceptData?.data ? (
//             <AcceptanceNoteTable
//               type={acceptData?.data?.type}
//               processType="act"
//               data={acceptData?.data}
//               itemList={acceptData?.itemList}
//               setCsv = {setAcptCsv}
//             />
//           ) : (
//             "No data available."
//           )}
//         </div>
//       )}

//       {objectFromArr["IR"] && (
//         <div>
//           <h2>Material Inward Slip</h2>
//           {misData?.data ? (
//             <MisTable
//               type={misData?.data?.type}
//               processType="ir"
//               data={misData?.data}
//               itemList={misData?.itemList}
//               setCsv = {setMisCsv}
//             />
//           ) : (
//             "No data available."
//           )}
//         </div>
//       )}

//       {objectFromArr["IRN"] && (
//         <div>
//           <h2>Inspection Note</h2>
//           {inspectionNoteData?.data ? (
//             <InspectionNoteTable
//               type={inspectionNoteData?.data?.type}
//               processType="irn"
//               data={inspectionNoteData?.data}
//               itemList={inspectionNoteData?.itemList}
//               setCsv = {setInspCsv}
//             />
//           ) : (
//             "No data available."
//           )}
//         </div>
//       )}

//       {objectFromArr["REJ"] && (
//         <div>
//           <h2>Rejection Note</h2>
//           {rejectData?.data ? (
//             <RejNoteTable
//               type={rejectData?.data?.type}
//               processType="rej"
//               data={rejectData?.data}
//               itemList={rejectData?.itemList}
//               setCsv = {setRejCsv}
//             />
//           ) : (
//             "No data available."
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default TransactionDetail;

import React, { useEffect, useRef, useState } from "react";
import { Button } from "antd";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { apiHeader } from "../../utils/Functions";
import { useSelector } from "react-redux";
import { CSVLink } from "react-csv";
import AcceptanceNoteTable from "./detailData/AcceptanceNoteTable";
import GrnTable from "./detailData/GrnTable";
import IgpTable from "./detailData/IgpTable";
import InspectionNoteTable from "./detailData/InspectionNoteTable";
import RejNoteTable from "./detailData/RejNoteTable";
import OgpTable from "./detailData/OgpTable";
import IsnTable from "./detailData/IsnTable";
import ReturnTable from "./detailData/ReturnTable";
import MisTable from "./detailData/MisTable";

const style = {
  display: "flex",
  gap: "1rem",
  marginBottom: "0.5rem",
  alignItems: "center",
};

const TransactionDetail = () => {
  const navigate = useNavigate();
  const { trnno: url } = useParams();
  const urlArr = url.split("_");
  const trnOrgIdCombined = urlArr[0].split("-");
  const orgId = trnOrgIdCombined.length === 2 ? trnOrgIdCombined[1] : null;
  const trnNo = trnOrgIdCombined[0];

  const txnRef = useRef();
  const { organizationDetails } = useSelector((state) => state.auth);
  const { token } = useSelector((state) => state.auth);

  const [dataState, setDataState] = useState({
    acceptData: null,
    returnData: null,
    igpData: null,
    misData: null,
    inspectionNoteData: null,
    isnData: null,
    grnData: null,
    ogpData: null,
    rejectData: null,
  });

  const [csvData, setCsvData] = useState({
    isnCsv: null,
    ogpCsv: null,
    igpCsv: null,
    rnCsv: null,
    grnCsv: null,
    inspCsv: null,
    misCsv: null,
    acptCsv: null,
    rejCsv: null,
  });

  const populateData = async (orgId) => {
    const { data } = await axios.post(
      "/txns/getTxnDtls",
      { processId: trnNo, orgId },
      apiHeader("POST", token)
    );
    const responseData = data.responseData;
    setDataState((prevState) => ({
      ...prevState,
      acceptData: responseData.acceptData,
      igpData: responseData.igpdata,
      misData: responseData.inspectionRptData,
      isnData: responseData.isndata,
      ogpData: responseData.ogpdata,
      grnData: responseData.grndata,
      rejectData: responseData.rejectData,
      inspectionNoteData: responseData.inspectionNewRptData,
      returnData: {
        data: responseData.rndata.data,
        itemList:
          responseData.rndata.itemList?.map((item) => ({
            ...item,
            issueNoteDt: responseData.rndata.data?.issueNoteDt,
            genDate: responseData.rndata.data?.genDate,
          })) || [],
      },
    }));
  };

  useEffect(() => {
    populateData(orgId);
  }, [orgId]);

  const handleNavigate = () => navigate(-1);

  const renderTableSection = (
    title,
    data,
    itemList,
    TableComponent,
    route,
    setCsv
  ) => (
    <div>
      <div style={style}>
        <h2>{title}</h2>
        {data?.data && (
          <Button
            danger
            onClick={() =>
              navigate(route, { state: { data: data.data, itemList } })
            }
          >
            Print
          </Button>
        )}
      </div>
      {data?.data ? (
        <TableComponent
          type={data.data.type}
          processType={title.toLowerCase().replace(" ", "_")}
          data={data.data}
          itemList={itemList}
          setCsv={setCsv}
        />
      ) : (
        "No data available."
      )}
    </div>
  );

  const finalCsvData = Object.values(csvData).filter(Boolean).flat();

  return (
    <div
      style={{ display: "flex", flexDirection: "column", gap: "2rem" }}
      ref={txnRef}
    >
      {finalCsvData.length > 0 && (
        <CSVLink
          data={finalCsvData}
          filename={`transaction_detail_${organizationDetails?.organizationName}.csv`}
          style={{
            marginBottom: 16,
            border: "1px solid",
            width: "max-content",
            padding: "1rem",
          }}
          className="ant-btn ant-btn-primary"
        >
          Export to CSV
        </CSVLink>
      )}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Button type="primary" onClick={handleNavigate}>
          Back
        </Button>
        <h1>Transaction Detail</h1>
        <h1>Transaction No: {trnNo}</h1>
      </div>

      {renderTableSection(
        "Issue Note",
        dataState.isnData,
        dataState.isnData?.itemList,
        IsnTable,
        "/trans/issue",
        (data) => setCsvData((prev) => ({ ...prev, isnCsv: data }))
      )}
      {renderTableSection(
        "Outward Gate Pass",
        dataState.ogpData,
        dataState.ogpData?.itemList,
        OgpTable,
        "/trans/outward",
        (data) => setCsvData((prev) => ({ ...prev, ogpCsv: data }))
      )}
      {renderTableSection(
        "Inward Gate Pass",
        dataState.igpData,
        dataState.igpData?.itemList,
        IgpTable,
        "/trans/inward",
        (data) => setCsvData((prev) => ({ ...prev, igpCsv: data }))
      )}
      {renderTableSection(
        "Return Note",
        dataState.returnData,
        dataState.returnData?.itemList,
        ReturnTable,
        "/trans/return",
        (data) => setCsvData((prev) => ({ ...prev, rnCsv: data }))
      )}
      {renderTableSection(
        "Goods Receive Note",
        dataState.grnData,
        dataState.grnData?.itemList,
        GrnTable,
        "/trans/grn",
        (data) => setCsvData((prev) => ({ ...prev, grnCsv: data }))
      )}
      {renderTableSection(
        "Acceptance Note",
        dataState.acceptData,
        dataState.acceptData?.itemList,
        AcceptanceNoteTable,
        "/trans/acceptance",
        (data) => setCsvData((prev) => ({ ...prev, acptCsv: data }))
      )}
      {renderTableSection(
        "Material Inward Slip",
        dataState.misData,
        dataState.misData?.itemList,
        MisTable,
        "/trans/inspection",
        (data) => setCsvData((prev) => ({ ...prev, misCsv: data }))
      )}
      {renderTableSection(
        "Inspection Note",
        dataState.inspectionNoteData,
        dataState.inspectionNoteData?.itemList,
        InspectionNoteTable,
        "/trans/inspectionNote",
        (data) => setCsvData((prev) => ({ ...prev, inspCsv: data }))
      )}
      {renderTableSection(
        "Rejection Note",
        dataState.rejectData,
        dataState.rejectData?.itemList,
        RejNoteTable,
        "/trans/rejection",
        (data) => setCsvData((prev) => ({ ...prev, rejCsv: data }))
      )}
    </div>
  );
};

export default TransactionDetail;
