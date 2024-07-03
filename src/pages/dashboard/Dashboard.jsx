import { Button, message } from "antd";
import React, { useCallback, useEffect, useState } from "react";
import ItemSlab from "./ItemSlab";
import TransactionSlab from "./TransactionSlab";
import InvValSlab from "./InvValSlab";
import PurchaseSummarySlab from "./PurchaseSummarySlab";
import { apiCall, convertToCurrency, sortAlphabetically } from "../../utils/Functions";
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
    const [itemSlabFilteredData, setItemSlabFilteredData] = useState(null)
    const [itemSlabDescDropdown, setItemSlabDescDropdown] = useState(null)
    const [itemSlabSubcatDropdown, setItemSlabSubcatDropdown] = useState(null)

    const [txnSlabData, setTxnSlabData] = useState({
      count: null,
      allData: null
    })

    const [invSlabData, setInvSlabData] = useState({
      count: null,
      allData: null
    })
    const [invItemDescDropdown, setInvItemDescDropdown] = useState(null)
    const [invItemSubcatDropdown, setInvItemSubcatDropdown] = useState(null)

    const [invFilteredData, setInvFilteredData] = useState(null)

    const fnsCategory = useCallback(async () => {
      const url = "/getFNSCategory"
      try{
        const {responseData:itemData} = await apiCall("POST", url, token, {orgId: orgId ? orgId:null})
        setItemSlabData(prev => {
          return {
            ...prev,
            allData: [...itemData],
          }
        })
        const filterDropdownArr = []
        const subcatDropdownArr = []
        itemData.forEach(item=> {
          filterDropdownArr.push(
            {

              text: item.itemDescription,
              value: item.itemDescription+"-"+item.itemCode
            }
          )
          subcatDropdownArr.push(
            {
              text: item.subCategoryDesc,
              value: item.subCategoryDesc
            }
          )

          
        })

        setItemSlabDescDropdown([...sortAlphabetically(filterDropdownArr)])
        setItemSlabSubcatDropdown([...subcatDropdownArr])
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
            subcategory: obj.qtyList[0].subcategoryDesc,
            value: convertToCurrency(totVal), 
            quantity: totQuantity
          }
        })

        const itemDescDrop = []
        const subcatDescDrop = []
        modData.forEach(data=> {
          itemDescDrop.push(
            {
              text: data.itemName,
              value: data.itemName
            }
          )
          subcatDescDrop.push(
            {
              text: data.subcategory,
              value: data.subcategory
            }
          )
          setInvItemDescDropdown([...sortAlphabetically(itemDescDrop)])
          setInvItemSubcatDropdown([...subcatDescDrop])
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
        const itemTotalCount = responseData.length
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

    const [summaryData, setSummaryData] = useState(
      {
        allData: null,
        count: null
      }
    )

    const [summaryDataFilters, setSummaryDataFilters] = useState({
      subcategory: null,
      usageCategory: null, 
      itemCode: null,
      startDate: null,
      endDate: null
    })

    const populateSummaryData = async () => {
      const {responseData: summaryData} = await apiCall("POST", "/txns/getTxnSummary", token, {  txnType: "PO", orgId: orgId ? orgId : null})
    }

    useEffect(()=>{
      fnsCategory()
      getOhqDtls()
      populateTxnData()
      populateInvData()
    },[fnsCategory, dispatch, orgId, populateTxnData, getOhqDtls, populateInvData])
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
          <span className="tab-value">123456</span>
        </Button>
      </div>

      {
        activeTab === "tab1" && (
          <ItemSlab count = {itemSlabData.count} allData = {itemSlabData.allData} filteredData={itemSlabFilteredData} setFilteredData={setItemSlabFilteredData} descFilterDropdown = {itemSlabDescDropdown} subcatDropdown={itemSlabSubcatDropdown} />
        )
      }
      {
        activeTab === "tab2" && (
            <TransactionSlab allData = {txnSlabData.allData} txnFilters={txnFilters} setTxnFilters={setTxnFilters} orgId={orgId} populateTxnData={populateTxnData} setTxnSlabData={setTxnSlabData}/>
        )
      }
      {
        activeTab === "tab3" && (
            <InvValSlab data={invSlabData.allData} filteredData={invFilteredData} setFilteredData={setInvFilteredData} itemDescDropdown={invItemDescDropdown} subcatDropdown={invItemSubcatDropdown}/>
        )
      }
      {
        activeTab === "tab4" && (
            <PurchaseSummarySlab filters = {summaryDataFilters} setFilers = {setSummaryDataFilters} />
        )
      }
    </div>
  );
};

export default Dashboard;
