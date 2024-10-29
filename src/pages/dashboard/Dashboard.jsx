import { Button, message } from "antd";
import React, { useSelector } from "react-redux";
import Faq from "./faq/Faq";
import SopManual from "./sopManual/SopManual";
import { apiCall, convertToCurrency, populateInvSlabData, populateItemSlabData, populateTxnSlabData } from "../../utils/Functions";
import { useCallback, useEffect, useState } from "react";
import ItemSlab from './ItemSlab'
import TransactionSlab from './TransactionSlab'
import InvValSlab from './InvValSlab'
import PurchaseSummarySlab from './PurchaseSummarySlab'

const currentDate = new Date(); 
const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);

const Dashboard = (props) => {
    const {organizationDetails, token} = useSelector(state => state.auth)
    const orgId = props.orgId === 'null' ? null : ( (props.orgId && props.orgId !== 'null') ? props.orgId : organizationDetails?.id)
    console.log("orgId dashboard: ", orgId)
    const [activeTab, setActiveTab] = useState("tab1")
    const [purSumLoading, setPurSumLoading] = useState(false)

    const [itemSlabData, setItemSlabData] = useState({
      count: 0,
      allData: [],
      countOrgWise: {},
      itemDescDropdownList: [],
      subCategoryDropdownList: []
    })
    const [txnSlabData, setTxnSlabData] = useState({
      count: 0,
      allData: []
    })
    const [invSlabData, setInvSlabData] = useState({
      count: 0,
      allData: 0,
      countOrgWise: {},
      itemDescDropdownList: [],
      subCategoryDropdownList: []
    })

    const [summaryData, setSummaryData] = useState(
      {
        allData: null,
        count: null
      }
    )

    const [summaryDataFilters, setSummaryDataFilters] = useState({
      subCategoryCode: null,
      categoryCode: null,
      itemCode: null,
      startDate: `${startDate.getDate().toString().padStart(2, '0')}/${(startDate.getMonth() + 1).toString().padStart(2, '0')}/${startDate.getFullYear()}`,
      endDate: `${endDate.getDate().toString().padStart(2, '0')}/${(endDate.getMonth() + 1).toString().padStart(2, '0')}/${endDate.getFullYear()}`
    })

    const [loadings, setLoadings] = useState(false)

    const handlePurchaseSearch = useCallback( async () => {
      setPurSumLoading(true)
      if(!summaryDataFilters.startDate || !summaryDataFilters.endDate){
        message.error("Please enter start date and end date.")
        return
      }
      try{
        const {responseData} = await apiCall("POST", "/getPurchaseSummary", token, {...summaryDataFilters, orgId: orgId ? orgId : null})
        let totVal = 0;
        responseData?.forEach(data => {
          totVal = totVal + data.totalValue
        })
        setSummaryData({
          allData: [...responseData || []],
          count: convertToCurrency(totVal)
        })
      }catch(error){
        console.log("Error fetching purchase summary.", error)
      }
      finally{
        setPurSumLoading(false)
      }
    }, [orgId, token, summaryDataFilters])

    // const populateDashboard = useCallback(async () => {
    const populateDashboard = async () => {
      setLoadings(true)
      const [itemSlabData, txnSlabData, invSlabData] = await Promise.all([
        populateItemSlabData(orgId, token),
        populateTxnSlabData(null, null, null, null, orgId, token),
        populateInvSlabData(null, orgId, token)
      ]) 
      setItemSlabData({...itemSlabData})
      setTxnSlabData({...txnSlabData})
      setInvSlabData({...invSlabData})
      setLoadings(false)
    }


    useEffect(()=>{
      populateDashboard()
    },[orgId])

    if(loadings){
      return <h1>Loadings</h1>
    }

  return (
    <div style={{display: "flex", flexDirection: "column", gap: "4rem"}}>
      <div className="dashboard-tabs">
        <Button className={`each-tab ${activeTab === "tab1" ? "active-slab" : ""}`} id="tab1" onClick={() => setActiveTab("tab1")}>
          <span className="tab-fieldName">Item</span>
          <span className="tab-value">{itemSlabData.count} <span style={{fontSize: "0.8rem", fontWeight: "normal"}}>unique items</span> </span>
        </Button>
        <Button className={`each-tab ${activeTab === "tab2" ? "active-slab" : ""}`} id="tab2" onClick={() => setActiveTab("tab2")}>
          <span className="tab-fieldName">Transaction</span>
          <span className="tab-value">{txnSlabData.count} <span style={{fontSize: "0.8rem", fontWeight: "normal"}}>total transactions</span> </span>
        </Button>
        <Button className={`each-tab ${activeTab === "tab3" ? "active-slab" : ""}`} id="tab3" onClick={() => setActiveTab("tab3")}>
          <span className="tab-fieldName">Inventory Value</span>
          <span className="tab-value">{invSlabData.count} <span style={{fontSize: "0.8rem", fontWeight: "normal"}}>total value</span></span>
        </Button>
        <Button className={`each-tab ${activeTab === "tab4" ? "active-slab" : ""}`} id="tab4" onClick={() => setActiveTab("tab4")}>
          <span className="tab-fieldName">Purchasing Summary</span>
          <span className="tab-value">{summaryData.count} <span style={{fontSize: "0.8rem", fontWeight: "normal"}}>for selected dates</span></span>
        </Button>
        <Button className={`each-tab ${activeTab === "tab5" ? "active-slab" : ""}`} id="tab5" onClick={() => setActiveTab("tab5")}>
          <span className="tab-fieldName">SOP & Manual</span>
        </Button>
        <Button className={`each-tab ${activeTab === "tab6" ? "active-slab" : ""}`} id="tab6" onClick={() => setActiveTab("tab6")}>
          <span className="tab-fieldName">FAQ</span>
        </Button>
      </div>

      {
        activeTab === "tab1" && (
          <ItemSlab countOrgWise={itemSlabData?.countOrgWise} count = {itemSlabData?.count} allData = {itemSlabData?.allData} itemDescDropdownList={itemSlabData?.itemDescDropdownList} subCategoryDropdownList={itemSlabData?.subCategoryDropdownList || []} orgId={orgId} />
        )
      }
      {
        activeTab === "tab2" && (
            <TransactionSlab allData = {txnSlabData?.allData} orgId={orgId} setTxnSlabData={setTxnSlabData} countOrgWise={txnSlabData?.countOrgWise}/>
        )
      }
      {
        activeTab === "tab3" && (
          <InvValSlab data={invSlabData?.allData} itemDescDropdownList={itemSlabData?.itemDescDropdownList} subCategoryDropdownList={itemSlabData?.subCategoryDropdownList} countOrgWise={invSlabData?.countOrgWise} orgId={orgId}/>
        )
      }
      {/* {
        activeTab === "tab4" && (
            <PurchaseSummarySlab filters = {summaryDataFilters || []} setFilters = {setSummaryDataFilters || []} handleSumSearch={handlePurchaseSearch} allData={summaryData?.allData} orgId={orgId} isHeadquarter={props.orgId === 'null' ? true : false} />
        )
      } */}
      {
        activeTab === "tab5" && (
          <SopManual />
        )
      }
      {
        activeTab === "tab6" && (
          <Faq />
        )
      }
    </div>
  );
};

export default Dashboard;