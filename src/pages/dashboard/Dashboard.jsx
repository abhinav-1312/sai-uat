import { Button, message } from "antd";
import React, { useCallback, useEffect, useState } from "react";
import ItemSlab from "./ItemSlab";
import TransactionSlab from "./TransactionSlab";
import InvValSlab from "./InvValSlab";
import PurchaseSummarySlab from "./PurchaseSummarySlab";
import { apiCall, convertToCurrency } from "../../utils/Functions";
import { useDispatch, useSelector } from "react-redux";
import { fetchOhq } from "../../redux/slice/ohqSlice";
import axios from "axios";

const Dashboard = ({orgId}) => {
    const [activeTab, setActiveTab] = useState("tab1")

    const [txnFilters, setTxnFilters] = useState({
      txnType: null,
      startDate: null,
      endDate: null,
      issueNoteType: null,
    });

    const {token, userCd} = useSelector(state => state.auth)
    const dispatch = useDispatch()

    const [itemSlabData, setItemSlabData] = useState({
      count: null,
      allData: null,
    })

    console.log("Item slab data: ", itemSlabData)

    const [itemSlabFilteredData, setItemSlabFilteredData] = useState(null)

    const [txnSlabData, setTxnSlabData] = useState({
      count: null,
      allData: null
    })

    const [invSlabData, setInvSlabData] = useState({
      count: null,
      allData: null
    })

    const [invFilteredData, setInvFilteredData] = useState(null)

    const fnsCategory = useCallback(async () => {
      const url = "/getFNSCategory"
      try{
        const {responseData:itemData} = await apiCall("POST", url, token, {orgId: orgId ? orgId:null})
        setItemSlabData(prev => {
          return {
            ...prev,
            allData: [...itemData]
          }
        })
        setItemSlabFilteredData([...itemData])
      }
      catch(error){
        console.log("Error fetching data", error)
      }
    }, [orgId, token])

    const populateTxnData = useCallback( async () => {
      try {
        const { responseData } = await apiCall("POST", "/txns/getTxnSummary", token, { startDate: null, endDate: null, itemCode: null, txnType: null, orgId: orgId ? orgId : null }) 
        setTxnSlabData({count: responseData.length, allData: [...responseData].reverse()})
      } catch (error) {
        message.error("Error occured while fetching data. Please try again.");
        console.log("Populate data error.", error);
      }
    }, [orgId, token]);

    const populateInvData = useCallback( async () => {
      try{
        const {responseData} = await apiCall("POST", "/master/getOHQ", token, {itemCode: null, userId: userCd, orgId: orgId ? orgId : null})
        let allVal = 0;
        const modData = responseData.map(obj => {
          let totVal = 0;
          let totQuantity = 0;
          obj.qtyList.forEach(qty => {
            totVal = totVal + qty.totalValues
            totQuantity = totQuantity + qty.quantity
          })

          allVal = allVal + totVal
  
          return {
            itemCode: obj.itemCode,
            itemName: obj.itemName,
            subcategory: "N/A",
            value: convertToCurrency(totVal), 
            quantity: totQuantity
          }
        })
        setInvFilteredData([...modData])
        setInvSlabData({count: convertToCurrency(allVal), allData: [...modData]})
        // setData([...modData])
      }catch(error){
        console.log("Error in inv slab: ", error)
        message.error("Error occured fetching inventory details.")
      }
    }, [orgId, token, userCd])

    const getOhqDtls = useCallback( async () => {
      try{
        const {responseData} = await apiCall("POST", '/master/getOHQ', token, {orgId: orgId?orgId:null})
        let itemTotalCount = 0
        responseData?.forEach(obj => {
          obj.qtyList.forEach(qty => {
            itemTotalCount = itemTotalCount + qty.quantity
            console.log("itemtotcount: ", itemTotalCount)
          })
        })
        setItemSlabData(prev=> {
          return {
            ...prev,
            count: itemTotalCount
          }
        })
      }catch(error){
        message.error("Error occured fetching ohq.")
        console.log("Error on fetching ohq dtls.", error)
      }
    }, [token, orgId])

    console.log("Inv slab: ", invSlabData)

    useEffect(()=>{
      fnsCategory()
      getOhqDtls()
      populateTxnData()
      populateInvData()
    },[fnsCategory, dispatch, orgId, populateTxnData, getOhqDtls, populateInvData])

    // console.log(itemSlabData.count, txnSlabData.count, itemSlabData.allData, txnSlabData.allData)

    // if(!itemSlabData.count || !itemSlabData.allData || !txnSlabData.count || !txnSlabData.allData){
    //   return (
    //     <h3>Loading. Please wait...</h3>
    //   )
    // }
  return (
    <div style={{display: "flex", flexDirection: "column", gap: "4rem"}}>
      <div className="dashboard-tabs">
        <Button className={`each-tab ${activeTab === "tab1" ? "active-slab" : ""}`} id="tab1" onClick={() => setActiveTab("tab1")}>
          <span className="tab-fieldName">Item</span>
          <span className="tab-value">{itemSlabData.count} <span style={{fontSize: "0.8rem", fontWeight: "normal"}}>total count</span> </span>
        </Button>
        <Button className={`each-tab ${activeTab === "tab2" ? "active-slab" : ""}`} id="tab2" onClick={() => setActiveTab("tab2")}>
          <span className="tab-fieldName">Transaction</span>
          <span className="tab-value">{txnSlabData.count} <span style={{fontSize: "0.8rem", fontWeight: "normal"}}>total transactions</span> </span>
        </Button>
        <Button className={`each-tab ${activeTab === "tab3" ? "active-slab" : ""}`} id="tab3" onClick={() => setActiveTab("tab3")}>
          <span className="tab-fieldName">Inventory And Value</span>
          <span className="tab-value">{invSlabData.count} <span style={{fontSize: "0.8rem", fontWeight: "normal"}}>total value</span></span>
        </Button>
        <Button className={`each-tab ${activeTab === "tab4" ? "active-slab" : ""}`} id="tab4" onClick={() => setActiveTab("tab4")}>
          <span className="tab-fieldName">Purchasing Summary</span>
          <span className="tab-value">123456</span>
        </Button>
      </div>

      {
        activeTab === "tab1" && (
          <ItemSlab count = {itemSlabData.count} allData = {itemSlabData.allData} filteredData={itemSlabFilteredData} setFilteredData={setItemSlabFilteredData} />
        )
      }
      {
        activeTab === "tab2" && (
            <TransactionSlab allData = {txnSlabData.allData} txnFilters={txnFilters} setTxnFilters={setTxnFilters} orgId={orgId} populateTxnData={populateTxnData} setTxnSlabData={setTxnSlabData}/>
        )
      }
      {
        activeTab === "tab3" && (
            <InvValSlab data={invSlabData.allData} filteredData={invFilteredData} setFilteredData={setInvFilteredData}/>
        )
      }
      {
        activeTab === "tab4" && (
            <PurchaseSummarySlab />
        )
      }
    </div>
  );
};

export default Dashboard;
