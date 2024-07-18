import React, { useEffect, useState } from "react";
import { Button } from "antd";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { apiHeader } from "../../utils/Functions";
import AcceptanceNoteTable from "./detailData/AcceptanceNoteTable";
import GrnTable from "./detailData/GrnTable";
import IgpTable from "./detailData/IgpTable";
import InspectionNoteTable from "./detailData/InspectionNoteTable";
import RejNoteTable from "./detailData/RejNoteTable";
import OgpTable from "./detailData/OgpTable";
import IsnTable from "./detailData/IsnTable";
import ReturnTable from "./detailData/ReturnTable";
import MisTable from "./detailData/MisTable";
import { useSelector } from "react-redux";

const TransactionDetail = () => {
  const navigate = useNavigate();
  const { trnno: url } = useParams();
  const urlArr = url.split("_");
  const trnOrgIdCombined = urlArr[0].split("-")
  const orgId = trnOrgIdCombined.length === 2 ? trnOrgIdCombined[1] : null
  const trnNo = trnOrgIdCombined[0];

  const arrayToConvert = urlArr.slice(1);
  const objectFromArr = arrayToConvert.reduce((acc, key) => {
    acc[key] = true;
    return acc;
  }, {});

  const [acceptData, setAcceptData] = useState(null);
  const [returnData, setReturnData] = useState(null);
  const [igpData, setIgpData] = useState(null);
  const [misData, setMisData] = useState(null);
  const [inspectionNoteData, setInspectionNoteData] = useState(null);
  const [isnData, setIsnData] = useState(null);
  const [grnData, setGrnData] = useState(null);
  const [ogpData, setOgpData] = useState(null);
  const [rejectData, setRejectData] = useState(null);
  const {token} = useSelector(state => state.auth);

  const populateHqData = async (orgId)=> {
    const trnDetailUrl =
      "/txns/getTxnDtls";
    const { data } = await axios.post(
      trnDetailUrl,
      { processId: trnNo, orgId },
      apiHeader("POST", token)
    );
    const { responseData } = data;
    const {
      acceptData,
      grndata,
      igpdata,
      inspectionRptData,
      isndata,
      ogpdata,
      rejectData,
      rndata,
      inspectionNewRptData,
    } = responseData;
    setAcceptData(acceptData);
    setReturnData(rndata);
    setIgpData(igpdata);
    setMisData(inspectionRptData);
    setIsnData(isndata);
    setOgpData(ogpdata);
    setGrnData(grndata);
    setRejectData(rejectData);
    setInspectionNoteData(inspectionNewRptData);
  }

  const handleNavigate = () => {
      navigate(-1)
  }

  const populateData = async () => {
    const trnDetailUrl =
      "/txns/getTxnDtls";
    const { data } = await axios.post(
      trnDetailUrl,
      { processId: trnNo },
      apiHeader("POST", token)
    );
    const { responseData } = data;
    const {
      acceptData,
      grndata,
      igpdata,
      inspectionRptData,
      isndata,
      ogpdata,
      rejectData,
      rndata,
      inspectionNewRptData,
    } = responseData;
    setAcceptData(acceptData);
    setReturnData(rndata);
    setIgpData(igpdata);
    setMisData(inspectionRptData);
    setIsnData(isndata);
    setOgpData(ogpdata);
    setGrnData(grndata);
    setRejectData(rejectData);
    setInspectionNoteData(inspectionNewRptData);
  };

  const handleIsnPrint = () => {
    navigate('/trans/issue', {
      state: { isnData: isnData.data, itemList: isnData.itemList }, // Pass data as state
    });
  }

  const handleOgpPrint = () => {
    navigate('/trans/outward', {
      state: {ogpData: ogpData.data, itemList: ogpData.itemList}
    })
  }

  useEffect(() => {
    if(orgId){
      populateHqData(orgId)
    }
    else{
      populateData();
    }
  }, []);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <Button type="primary" onClick={() => handleNavigate()}>
            Back
          </Button>
        </div>
        <h1>Transaction Detail</h1>
        <h1>Transaction No: {trnNo}</h1>
      </div>

      {objectFromArr["ISN"] && (
        <div>
          <div style={{display: "flex", gap: "1rem", marginBottom: "0.5rem"}}>
          <h2>Issue Note</h2>
          {
            isnData?.data &&
            <Button danger onClick = {handleIsnPrint}> Print </Button>
          }
          </div>
          {isnData?.data ? (
            <IsnTable
              type={isnData?.data?.type}
              processType="isn"
              data={isnData?.data}
              itemList={isnData?.itemList}
            />
          ) : (
            "No data available."
          )}
        </div>
      )}

      {objectFromArr["OGP"] && (
        <div>
          <div style={{display: "flex", gap: "1rem", marginBottom: "0.5rem"}}>
          <h2>Outward Gate Pass</h2>
          {
            ogpData?.data &&
            <Button danger onClick = {handleOgpPrint}> Print </Button>
          }
          </div>
          {ogpData?.data ? (
            <OgpTable
              type={ogpData?.data?.type}
              processType="ogp"
              data={ogpData?.data}
              itemList={ogpData?.itemList}
            />
          ) : (
            "No data available."
          )}
        </div>
      )}

      {objectFromArr["IGP"] && (
        <div>
          <h2>Inward Gate Pass</h2>
          {igpData?.data ? (
            <IgpTable
              type={igpData?.data.type}
              processType="igp"
              data={igpData?.data}
              itemList={igpData?.itemList}
            />
          ) : (
            "No data available."
          )}
        </div>
      )}

      {objectFromArr["RN"] && (
        <div>
          <h2>Return Note</h2>
          {returnData?.data ? (
            <ReturnTable
              type={returnData?.data?.type}
              processType="rn"
              data={returnData?.data}
              itemList={returnData?.itemList}
            />
          ) : (
            "No data available."
          )}
        </div>
      )}

      {/* {objectFromArr["GRN"] && (
        <div>
          <h2>Goods Receive Note</h2>
          {grnData?.data ? (
            <GrnTable
              type={grnData?.data?.type}
              processType="grn"
              data={grnData?.data}
              itemList={grnData?.itemList}
            />
          ) : (
            "No data available."
          )}
        </div>
      )} */}

      {/* {objectFromArr["ACT"] && (
        <div>
          <h2>Acceptance Note</h2>
          {acceptData?.data ? (
            <AcceptanceNoteTable
              type={acceptData?.data?.type}
              processType="act"
              data={acceptData?.data}
              itemList={acceptData?.itemList}
            />
          ) : (
            "No data available."
          )}
        </div>
      )} */}

      {/* {objectFromArr["IR"] && (
        <div>
          <h2>Material Inward Slip</h2>
          {misData?.data ? (
            <MisTable
              type={misData?.data?.type}
              processType="ir"
              data={misData?.data}
              itemList={misData?.itemList}
            />
          ) : (
            "No data available."
          )}
        </div>
      )} */}

      {/* {objectFromArr["IRN"] && (
        <div>
          <h2>Inspection Note</h2>
          {inspectionNoteData?.data ? (
            <InspectionNoteTable
              type={inspectionNoteData?.data?.type}
              processType="irn"
              data={inspectionNoteData?.data}
              itemList={inspectionNoteData?.itemList}
            />
          ) : (
            "No data available."
          )}
        </div>
      )} */}

      {/* {objectFromArr["REJ"] && (
        <div>
          <h2>Rejection Note</h2>
          {rejectData?.data ? (
            <RejNoteTable
              type={rejectData?.data?.type}
              processType="rej"
              data={rejectData?.data}
              itemList={rejectData?.itemList}
            />
          ) : (
            "No data available."
          )}
        </div>
      )} */}
    </div>
  );
};

export default TransactionDetail;
