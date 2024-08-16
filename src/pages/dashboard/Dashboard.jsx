import { Button, message } from "antd";
import React, { useCallback, useEffect, useState } from "react";
import ItemSlab from "./ItemSlab";
import TransactionSlab from "./TransactionSlab";
import InvValSlab from "./InvValSlab";
import PurchaseSummarySlab from "./PurchaseSummarySlab";
import { apiCall, convertToCurrency, sortAlphabetically } from "../../utils/Functions";
import Loader from '../../components/Loader'
import _ from "lodash"
import { useSelector } from "react-redux";
import Faq from "./Faq";
import SopManual from "./sopManual/SopManual";

const currentDate = new Date(); 
const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);

const Dashboard = (props) => {
    const {organizationDetails, token, userCd} = useSelector(state => state.auth)
    const orgId = props.orgId === 'null' ? null : ( (props.orgId && props.orgId !== 'null') ? props.orgId : organizationDetails?.id)
    const [activeTab, setActiveTab] = useState("tab1")
    const [itemSlabLoading, setItemSlabLoading] = useState(false)
    const [txnSlabLoading, setTxnSlabLoading] = useState(false)
    const [invValLoading, setInvValLoading] = useState(false)
    const [purSumLoading, setPurSumLoading] = useState(false)

    const [txnFilters, setTxnFilters] = useState({
      txnType: null,
      startDate: null,
      endDate: null,
      issueNoteType: null,
    });

    const [itemSlabData, setItemSlabData] = useState({
      count: null,
      allData: null,
      countOrgWise: null
    })
    const [txnSlabData, setTxnSlabData] = useState({
      count: null,
      allData: null
    })
    const [invSlabData, setInvSlabData] = useState({
      count: null,
      allData: null
    })
    const [itemSlabFilteredData, setItemSlabFilteredData] = useState(null)
    const [itemSlabDescDropdown, setItemSlabDescDropdown] = useState(null)
    const [itemSlabSubcatDropdown, setItemSlabSubcatDropdown] = useState(null)
    const [invFilteredData, setInvFilteredData] = useState(null)

    const [invItemDescDropdown, setInvItemDescDropdown] = useState(null)
    const [invItemSubcatDropdown, setInvItemSubcatDropdown] = useState(null)

    const fnsCategory = useCallback(async () => {
      setItemSlabLoading(true)
      const url = "/getFNSCategory"
      try{
        const {responseData:itemData} = await apiCall("POST", url, token, {orgId: orgId ? orgId:null})
        const uniqueItemCount = new Set(itemData.map(item => item.itemCode)); // unique item in all data we got

        console.log("itemdata: ", itemData)

        let orgWiseUniqueItemCnt = {}

        itemData.forEach(record => {
          if(!(record.orgId in orgWiseUniqueItemCnt)){
            orgWiseUniqueItemCnt[record.orgId] = new Set()
          }
          orgWiseUniqueItemCnt[record.orgId].add(record.itemCode)
        })
        // count unique items org wise
        const orgIdItemCodeMap = itemData.reduce((acc, item) => {
          if (!acc[item.orgId]) {
              acc[item.orgId] = new Set();
          }
          acc[item.orgId].add(item.itemCode);
          return acc;
      }, {});
      
      // Count unique itemCodes for each orgId
      const orgIdUniqueItemCodeCounts = Object.fromEntries(
          Object.entries(orgIdItemCodeMap).map(([orgId, itemCodes]) => [orgId, itemCodes.size])
      );
      const orgIdUniqueItemCodeCounts2 = Object.fromEntries(
          Object.entries(orgWiseUniqueItemCnt).map(([orgId, itemCodes]) => [orgId, itemCodes.size])
      );

      console.log("Org 1: ", orgWiseUniqueItemCnt)
      console.log("Org 2: ", orgIdUniqueItemCodeCounts2)

        setItemSlabData({
            allData: [...itemData],
            count: uniqueItemCount.size,
            countOrgWise: orgIdUniqueItemCodeCounts
          })
        const filterDropdownArr = new Set() // dropdown table for item description filter
        const subcatDropdownArr = new Set() // dropdown table for subcategory filter
        itemData.forEach(item=> {
          const trimmedObj1 = 
          {

            text: _.trim(item.itemDescription),
            value: _.trim(item.itemDescription)
          }
          const trimmedString1 = JSON.stringify(trimmedObj1);
          filterDropdownArr.add(trimmedString1)

          const trimmedObj2 = 
          {
            text: _.trim(item.subCategoryDesc),
            value: _.trim(item.subCategoryDesc)
          }
          const trimmedString2 = JSON.stringify(trimmedObj2);
          subcatDropdownArr.add(trimmedString2)
          
        })

        setItemSlabDescDropdown([...sortAlphabetically(Array.from(filterDropdownArr).map(str => JSON.parse(str)))])
        setItemSlabSubcatDropdown([...Array.from(subcatDropdownArr).map(str=> JSON.parse(str))])
        setItemSlabFilteredData([...itemData])
      }
      catch(error){
        console.log("Error fetching data", error)
      }
      finally{
        setItemSlabLoading(false)
      }
    }, [orgId, token])

    const populateTxnData = useCallback( async () => {
      setTxnSlabLoading(true)
      try {
        const { responseData } = await apiCall("POST", "/txns/getTxnSummary", token, { startDate: null, endDate: null, itemCode: null, txnType: null, orgId }) 
        setTxnSlabData({count: responseData?.length, allData: [...responseData || []].reverse()})
      } catch (error) {
        message.error("Error occured while fetching data. Please try again.");
        console.log("Populate data error.", error);
      }
      finally{
        setTxnSlabLoading(false)
      }
    }, [orgId, token]);

    const populateInvData = useCallback( async () => {
      setInvValLoading(true)
      try{
        const {responseData} = await apiCall("POST", "/master/getOHQ", token, {itemCode: null, userId: userCd, orgId: orgId})
        let allVal = 0;
        const modData = responseData?.map(obj => {
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
            quantity: totQuantity,
            locationName: obj.locationName
          }
        })

        const itemDescDrop = new Set()
        const subcatDescDrop = new Set()
        modData.forEach(data=> {
          const trimmedObj1 = {
            text: _.trim(data.itemName),
            value: _.trim(data.itemName)
          }

          const trimmedString1 = JSON.stringify(trimmedObj1);

          itemDescDrop.add(trimmedString1)

          const trimmedObj2 = {
            text: _.trim(data.subcategory),
            value: _.trim(data.subcategory)
          }
          const trimmedString2 = JSON.stringify(trimmedObj2);
          subcatDescDrop.add(trimmedString2)
          setInvItemDescDropdown([...sortAlphabetically(Array.from(itemDescDrop).map(str => JSON.parse(str)))])
          setInvItemSubcatDropdown([...Array.from(subcatDescDrop).map(str => JSON.parse(str))])
        })
        setInvFilteredData([...modData])
        setInvSlabData({count: convertToCurrency(allVal), allData: [...modData]})
      }catch(error){
        console.log("Error in inv slab: ", error)
        message.error("Error occured fetching inventory details.")
      }
      finally{
        setInvValLoading(false)
      }
    }, [orgId, token, userCd])

    const [summaryData, setSummaryData] = useState(
      {
        allData: null,
        count: null
      }
    )

    const [summaryDataFilters, setSummaryDataFilters] = useState({
      subCategoryCode: null,
      categoryCode: null,
      // usageCategory: null, 
      itemCode: null,
      startDate: `${startDate.getDate().toString().padStart(2, '0')}/${(startDate.getMonth() + 1).toString().padStart(2, '0')}/${startDate.getFullYear()}`,
      endDate: `${endDate.getDate().toString().padStart(2, '0')}/${(endDate.getMonth() + 1).toString().padStart(2, '0')}/${endDate.getFullYear()}`
    })

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

    useEffect(()=>{
      fnsCategory()
      populateTxnData()
      populateInvData()
      handlePurchaseSearch()
    },[fnsCategory, populateTxnData, populateInvData, handlePurchaseSearch])


    // if(itemSlabLoading ||
    //   txnSlabLoading ||
    //   invValLoading ||
    //   purSumLoading
    //   ){
    //     return (
    //       <Loader />
    //     )
    //   }


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
          {/* <span className="tab-value">{summaryData.count} <span style={{fontSize: "0.8rem", fontWeight: "normal"}}>for selected dates</span></span> */}
        </Button>
        <Button className={`each-tab ${activeTab === "tab6" ? "active-slab" : ""}`} id="tab6" onClick={() => setActiveTab("tab6")}>
          <span className="tab-fieldName">FAQ</span>
          {/* <span className="tab-value">{summaryData.count} <span style={{fontSize: "0.8rem", fontWeight: "normal"}}>for selected dates</span></span> */}
        </Button>
      </div>

      {
        activeTab === "tab1" && (
          <ItemSlab countOrgWise={itemSlabData.countOrgWise} count = {itemSlabData.count} allData = {itemSlabData.allData} filteredData={itemSlabFilteredData} setFilteredData={setItemSlabFilteredData} descFilterDropdown = {itemSlabDescDropdown} subcatDropdown={itemSlabSubcatDropdown} orgId={orgId} />
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
            <PurchaseSummarySlab filters = {summaryDataFilters} setFilters = {setSummaryDataFilters} handleSumSearch={handlePurchaseSearch} allData={summaryData.allData} orgId={orgId} isHeadquarter={props.orgId === 'null' ? true : false} />
        )
      }
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





// import React, { useCallback, useEffect, useState, Suspense, lazy } from "react";
// import { Button, message } from "antd";
// import { useSelector } from "react-redux";
// import { apiCall, convertToCurrency, sortAlphabetically } from "../../utils/Functions";
// import Loader from '../../components/Loader';
// import _ from "lodash";

// // Lazy load components
// const ItemSlab = lazy(() => import("./ItemSlab"));
// const TransactionSlab = lazy(() => import("./TransactionSlab"));
// const InvValSlab = lazy(() => import("./InvValSlab"));
// const PurchaseSummarySlab = lazy(() => import("./PurchaseSummarySlab"));
// const SopManual = lazy(() => import("./sopManual/SopManual"));
// const Faq = lazy(() => import("./Faq"));

// const Dashboard = (props) => {
//     const { organizationDetails, token, userCd } = useSelector(state => state.auth);
//     const orgId = props.orgId === 'null' ? null : (props.orgId && props.orgId !== 'null') ? props.orgId : organizationDetails?.id;

//     const [activeTab, setActiveTab] = useState("tab1");
//     const [loading, setLoading] = useState({ items: false, transactions: false, inventory: false, purchaseSummary: false });
//     const [itemSlabData, setItemSlabData] = useState({ count: null, allData: null, countOrgWise: null });
//     const [txnSlabData, setTxnSlabData] = useState({ count: null, allData: null });
//     const [invSlabData, setInvSlabData] = useState({ count: null, allData: null });
//     const [summaryData, setSummaryData] = useState({ allData: null, count: null });
    
//     // Initialize dates for summary filters
//     const startDate = new Date();
//     const endDate = new Date();
//     endDate.setDate(startDate.getDate() + 30); // Example: 30 days from startDate

//     const [filters, setFilters] = useState({
//         item: { filteredData: null, descDropdown: null, subcatDropdown: null },
//         inventory: { filteredData: null, itemDescDropdown: null, itemSubcatDropdown: null },
//         txn: { txnFilters: { txnType: null, startDate: null, endDate: null, issueNoteType: null } },
//         summary: {
//             startDate: `${startDate.getDate().toString().padStart(2, '0')}/${(startDate.getMonth() + 1).toString().padStart(2, '0')}/${startDate.getFullYear()}`,
//             endDate: `${endDate.getDate().toString().padStart(2, '0')}/${(endDate.getMonth() + 1).toString().padStart(2, '0')}/${endDate.getFullYear()}`
//         }
//     });

//     const fetchData = useCallback(async () => {
//         setLoading({ items: true, transactions: true, inventory: true, purchaseSummary: true });

//         try {
//             // Fetch item slab data
//             const { responseData: itemData } = await apiCall("POST", "/getFNSCategory", token, { orgId: orgId ? orgId : null });
//             const uniqueItemCount = new Set(itemData.map(item => item.itemCode));

//             let orgWiseUniqueItemCnt = {};
//             itemData.forEach(record => {
//                 if (!orgWiseUniqueItemCnt[record.orgId]) {
//                     orgWiseUniqueItemCnt[record.orgId] = new Set();
//                 }
//                 orgWiseUniqueItemCnt[record.orgId].add(record.itemCode);
//             });

//             const orgIdItemCodeMap = itemData.reduce((acc, item) => {
//                 if (!acc[item.orgId]) acc[item.orgId] = new Set();
//                 acc[item.orgId].add(item.itemCode);
//                 return acc;
//             }, {});

//             const orgIdUniqueItemCodeCounts = Object.fromEntries(
//                 Object.entries(orgIdItemCodeMap).map(([orgId, itemCodes]) => [orgId, itemCodes.size])
//             );

//             const filterDropdownArr = new Set();
//             const subcatDropdownArr = new Set();
//             itemData.forEach(item => {
//                 filterDropdownArr.add(JSON.stringify({ text: _.trim(item.itemDescription), value: _.trim(item.itemDescription) }));
//                 subcatDropdownArr.add(JSON.stringify({ text: _.trim(item.subCategoryDesc), value: _.trim(item.subCategoryDesc) }));
//             });

//             setItemSlabData({ allData: [...itemData], count: uniqueItemCount.size, countOrgWise: orgIdUniqueItemCodeCounts });
//             setFilters(prev => ({
//                 ...prev,
//                 item: {
//                     ...prev.item,
//                     descDropdown: [...sortAlphabetically(Array.from(filterDropdownArr).map(str => JSON.parse(str)))],
//                     subcatDropdown: [...Array.from(subcatDropdownArr).map(str => JSON.parse(str))]
//                 }
//             }));

//             // Fetch transaction slab data
//             const { responseData: txnData } = await apiCall("POST", "/txns/getTxnSummary", token, { startDate: null, endDate: null, itemCode: null, txnType: null, orgId });
//             setTxnSlabData({ count: txnData?.length, allData: [...txnData || []].reverse() });

//             // Fetch inventory slab data
//             const { responseData: invData } = await apiCall("POST", "/master/getOHQ", token, { itemCode: null, userId: userCd, orgId });
//             let allVal = 0;
//             const modData = invData?.map(obj => {
//                 let totVal = 0;
//                 let totQuantity = 0;
//                 obj.qtyList.forEach(qty => {
//                     totVal += qty.totalValues;
//                     totQuantity += qty.quantity;
//                 });

//                 allVal += totVal;

//                 return {
//                     itemCode: obj.itemCode,
//                     itemName: obj.itemName,
//                     subcategory: obj.qtyList[0].subcategoryDesc,
//                     value: convertToCurrency(totVal),
//                     quantity: totQuantity,
//                     locationName: obj.locationName
//                 };
//             });

//             const itemDescDrop = new Set();
//             const subcatDescDrop = new Set();
//             modData.forEach(data => {
//                 itemDescDrop.add(JSON.stringify({ text: _.trim(data.itemName), value: _.trim(data.itemName) }));
//                 subcatDescDrop.add(JSON.stringify({ text: _.trim(data.subcategory), value: _.trim(data.subcategory) }));
//             });
//             setFilters(prev => ({
//                 ...prev,
//                 inventory: {
//                     ...prev.inventory,
//                     itemDescDropdown: [...sortAlphabetically(Array.from(itemDescDrop).map(str => JSON.parse(str)))],
//                     itemSubcatDropdown: [...Array.from(subcatDescDrop).map(str => JSON.parse(str))]
//                 }
//             }));

//             setInvSlabData({ count: convertToCurrency(allVal), allData: [...modData] });

//             // Fetch purchase summary data
//             const { responseData: purSumData } = await apiCall("POST", "/getPurchaseSummary", token, { ...filters.summary, orgId: orgId ? orgId : null });
//             let totalValue = purSumData.reduce((acc, data) => acc + data.totalValue, 0);
//             setSummaryData({ allData: [...purSumData || []], count: convertToCurrency(totalValue) });

//         } catch (error) {
//             console.log("Error fetching data", error);
//             message.error("Error occurred while fetching data. Please try again.");
//         } finally {
//             setLoading({ items: false, transactions: false, inventory: false, purchaseSummary: false });
//         }
//     }, [orgId, token, userCd, filters.summary]);

//     useEffect(() => {
//         fetchData();
//     }, [fetchData]);

//     const renderTabContent = () => {
//         switch (activeTab) {
//             case "tab1":
//                 return <ItemSlab 
//                             countOrgWise={itemSlabData.countOrgWise} 
//                             count={itemSlabData.count} 
//                             allData={itemSlabData.allData} 
//                             filteredData={filters.item.filteredData} 
//                             setFilteredData={(data) => setFilters(prev => ({ ...prev, item: { ...prev.item, filteredData: data } }))}
//                             descFilterDropdown={filters.item.descDropdown} 
//                             subcatDropdown={filters.item.subcatDropdown} 
//                             orgId={orgId} 
//                         />;
//             case "tab2":
//                 return <TransactionSlab 
//                             allData={txnSlabData.allData} 
//                             txnFilters={filters.txn.txnFilters} 
//                             setTxnFilters={(filters) => setFilters(prev => ({ ...prev, txn: { ...prev.txn, txnFilters: filters } }))}
//                             orgId={orgId} 
//                             populateTxnData={fetchData}
//                             setTxnSlabData={setTxnSlabData}
//                         />;
//             case "tab3":
//                 return <InvValSlab 
//                             data={invSlabData.allData} 
//                             filteredData={filters.inventory.filteredData} 
//                             setFilteredData={(data) => setFilters(prev => ({ ...prev, inventory: { ...prev.inventory, filteredData: data } }))}
//                             itemDescDropdown={filters.inventory.itemDescDropdown}
//                             itemSubcatDropdown={filters.inventory.itemSubcatDropdown}
//                         />;
//             case "tab4":
//                 return <PurchaseSummarySlab 
//                             summaryData={summaryData.allData} 
//                             count={summaryData.count}
//                             summaryFilters={filters.summary} 
//                             setSummaryFilters={(filters) => setFilters(prev => ({ ...prev, summary: filters }))}
//                         />;
//             case "tab5":
//                 return <SopManual />;
//             case "tab6":
//                 return <Faq />;
//             default:
//                 return null;
//         }
//     };

//     return (
//         <div style={{ display: "flex", flexDirection: "column", gap: "4rem" }}>
//             <div className="dashboard-tabs">
//                 <Button className={`each-tab ${activeTab === "tab1" ? "active-slab" : ""}`} onClick={() => setActiveTab("tab1")}>
//                     <span className="tab-fieldName">Item</span>
//                     <span className="tab-value">{itemSlabData.count} <span style={{ fontSize: "0.8rem", fontWeight: "normal" }}>unique items</span></span>
//                 </Button>
//                 <Button className={`each-tab ${activeTab === "tab2" ? "active-slab" : ""}`} onClick={() => setActiveTab("tab2")}>
//                     <span className="tab-fieldName">Transactions</span>
//                     <span className="tab-value">{txnSlabData.count} <span style={{ fontSize: "0.8rem", fontWeight: "normal" }}>records</span></span>
//                 </Button>
//                 <Button className={`each-tab ${activeTab === "tab3" ? "active-slab" : ""}`} onClick={() => setActiveTab("tab3")}>
//                     <span className="tab-fieldName">Inventory</span>
//                     <span className="tab-value">{invSlabData.count} <span style={{ fontSize: "0.8rem", fontWeight: "normal" }}>value</span></span>
//                 </Button>
//                 <Button className={`each-tab ${activeTab === "tab4" ? "active-slab" : ""}`} onClick={() => setActiveTab("tab4")}>
//                     <span className="tab-fieldName">Purchase Summary</span>
//                     <span className="tab-value">{summaryData.count} <span style={{ fontSize: "0.8rem", fontWeight: "normal" }}>total value</span></span>
//                 </Button>
//                 <Button className={`each-tab ${activeTab === "tab5" ? "active-slab" : ""}`} onClick={() => setActiveTab("tab5")}>
//                     <span className="tab-fieldName">SOP Manual</span>
//                 </Button>
//                 <Button className={`each-tab ${activeTab === "tab6" ? "active-slab" : ""}`} onClick={() => setActiveTab("tab6")}>
//                     <span className="tab-fieldName">FAQ</span>
//                 </Button>
//             </div>

            //  <Suspense fallback={<Loader />}>
            //     {renderTabContent()}
            // </Suspense> 
        // </div>
    // );
// };

// export default Dashboard;
