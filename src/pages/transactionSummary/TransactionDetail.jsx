import React, { useEffect, useState } from "react";
import { Button, Form, Input } from "antd";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import AcceptData from "./detailData/AcceptData";

const TransactionDetail = () => {
  const navigate = useNavigate();
  const { trnno: trnNo } = useParams();
  const [acceptData, setAcceptData] = useState(null)
  const [returnData, setReturnData] = useState(null)
  const [igpData, setIgpData] = useState(null)
  const [inspectionReportData, setInspectionReportData] = useState(null)
  const [isnData, setIsnData] = useState(null)
  const [grnData, setGrnData] = useState(null)
  const [ogpData, setOgpData] = useState(null)
  const [rejectData, setRejectData] = useState(null)
  console.log("Return data: ", igpData)
  const populateData = async () => {
    const trnDetailUrl =
      "https://sai-services.azurewebsites.net/sai-inv-mgmt/txns/getTxnDtls";
    const { data } = await axios.post(trnDetailUrl, { processId: trnNo });
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
    } = responseData;
    setAcceptData(acceptData)
    setReturnData(rndata)
    setIgpData(igpdata)
    setInspectionReportData(inspectionRptData)
    setIsnData(isndata)
    setOgpData(ogpdata)
    setGrnData(grndata)
    setRejectData(rejectData)
  };
  useEffect(() => {
    populateData();
  }, []);
  return (
    <div style={{display: "flex", flexDirection: "column", gap: "2rem"}}>
      <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
        <div>
            <Button type="primary" onClick={() => navigate("/trnsummary")}>
              Back
            </Button>
        </div>
        <h1>Transaction Detail</h1>
        <h1>Transaction No: {trnNo}</h1>
      </div>
      <div>
        <h2>Accept Note</h2>
        {
          acceptData ? 
          <AcceptData data = {acceptData?.data} itemList = {acceptData?.itemList} />
          :
          "No data available."
        }
      </div>
      <div>
        <h2>Goods Receive Note</h2>
        {
          grnData ?
          <AcceptData data = {grnData?.data} itemList = {grnData?.itemList} />
          :
          "No data available."
        }
      </div>
      <div>
        <h2>Inward Gate Pass</h2>
        {
          igpData ?
          <AcceptData data={igpData?.data} itemList={igpData?.itemList} /> 
          :
          "No data available."
        }
      </div>
      <div>
        <h2>Inspection Report Data</h2>
        {
          inspectionReportData ?
          <AcceptData data={inspectionReportData?.data} itemList={inspectionReportData?.itemList} /> 
          :
          "No data available."
        }
      </div>
      <div>
        <h2>Issue Note</h2>
        {
          isnData ?
          <AcceptData data={isnData?.data} itemList={isnData?.itemList} /> 
          :
          "No data available."
        }
      </div>
      <div>
        <h2>Outward Gate Pass</h2>
        {
          ogpData ?
          <AcceptData data={ogpData?.data} itemList={ogpData?.itemList} /> 
          :
          "No data available."
        }
      </div>
      <div>
        <h2>Reject Data</h2>
        {
          rejectData ?
          <AcceptData data={rejectData?.data} itemList={rejectData?.itemList} /> 
          :
          "No data available."
        }
      </div>
      <div>
        <h2>Return Note</h2>
        {
          returnData ? 
          <AcceptData data={returnData?.data} itemList={returnData?.itemList} />
          : 
          "No data available."
        }
      </div>
    </div>
  );
};

export default TransactionDetail;
