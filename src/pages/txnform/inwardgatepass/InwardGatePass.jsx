// // InwardGatePass.js
// import React, { useState, useEffect, useRef } from "react";
// import {
//   Form,
//   Input,
//   Select,
//   DatePicker,
//   Button,
//   Row,
//   Col,
//   Typography,
//   AutoComplete,
//   message,
//   Modal,
//   Popover,
//   Table
// } from "antd";
// import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";
// import dayjs from "dayjs";
// import axios from "axios";
// import moment from "moment";
// import ItemSearchFilter from "../../../components/ItemSearchFilter";
// import { apiHeader } from "../../../utils/Functions";

// // import { MinusCircleOutlined } from "@ant-design/icons";
// // import dayjs from "dayjs";
// // import axios from "axios";
// import { fetchUomLocatorMaster, handleSearch, printOrSaveAsPDF } from "../../../utils/Functions";
// import FormInputItem from "../../../components/FormInputItem";
// const dateFormat = "DD/MM/YYYY";
// const { Option } = Select;
// const { Text, Title } = Typography;

// const InwardGatePass = () => {
//   const formRef = useRef()
//   const [buttonVisible, setButtonVisible] = useState(false)
//   const token = localStorage.getItem("token")
//   const [Type, setType] = useState("IRP");
//   const [selectedOption, setSelectedOption] = useState(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [successMessage, setSuccessMessage] = useState("");
//   const [errorMessage, setErrorMessage] = useState("");
//   const [itemData, setItemData] = useState([]);
//   const [searchValue, setSearchValue] = useState("")
//   const [data, setData] = useState([])
//   const [uomMaster, setUomMaster] = useState([]);
//   const [filteredData, setFilteredData] = useState([])
//   const [tableOpen, setTableOpen] = useState(false)
//   const [locatorMaster, setLocatorMaster] = useState([]);
//   const [selectedItems, setSelectedItems] = useState([])
//   const [locationMaster, setLocationMaster] = useState([])
//   const [vendorMaster, setVendorMaster] = useState([])
//   const [formData, setFormData] = useState({
//     genDate: "",
//     genName: "",
//     issueDate: "",
//     issueName: "",
//     approvedDate: "",
//     approvedName: "",
//     processId: "string",
//     type: "",
//     gatePassDate: "",
//     gatePassNo: "",
//     ceRegionalCenterCd: "",
//     ceRegionalCenterName: "",
//     ceAddress: "",
//     ceZipcode: "",
//     crRegionalCenterCd: "",
//     crRegionalCenterName: "",
//     crAddress: "",
//     crZipcode: "",
//     consumerName: "",
//     contactNo: "",
//     noaNo: "",
//     noaDate: "",
//     dateOfDelivery: "",
//     modeOfDelivery: "",
//     challanNo: "",
//     supplierCode: "",
//     supplierName: "",
//     noteType: "",
//     rejectionNoteNo: "",
//     items: [
//       // {
//       //   srNo: 0,
//       //   itemCode: "",
//       //   itemDesc: "",
//       //   uom: "",
//       //   quantity: 0,
//       //   noOfDays: 0,
//       //   remarks: "",
//       //   conditionOfGoods: "",
//       //   budgetHeadProcurement: "",
//       //   locatorId: "",
//       // },
//     ],
//     userId: "",
//     termsCondition: "",
//     note: "",
//     processType: "",
//   });

//   const showModal = () => {
//     setIsModalOpen(true);
//   };

//   const handleOk = () => {
//     setIsModalOpen(false);
//   };

//   const userCd = localStorage.getItem("userCd")

//   const searchVendor = async (value) => {
//     const vendorByIdUrl = "https://uat-sai-app.azurewebsites.net/sai-inv-mgmt/master/getVendorMasterById"
//     try{
//       const response = await axios.post(vendorByIdUrl, {userId: userCd, id: value}, apiHeader("POST", token))
//       const {responseStatus, responseData} = response.data
//       const {message, statusCode} = responseStatus

//       if(message === "Success" && statusCode === 200 && responseData !== null){
//         setFormData(prev=>{
//           return{
//             ...prev,
//             supplierName: responseData.vendorName,
//             crAddress: responseData.address,
//             supplierCode: value
//           }
//         })
//       }

//     }catch(error){
//       console.log("Not getting vendor", error)
//     }

//   }



//   const handleChange = (fieldName, value) => {
//     if(fieldName === "processType"){
//       console.log(fieldName, value)
//       fetchUserDetails(value)
//       return;
//     }
//     if(fieldName === "supplierCode"){
//       searchVendor(value)
//       return
//     }

//     setFormData((prevValues) => ({
//       ...prevValues,
//       [fieldName]: value === "" ? null : value,
//     }));
//   };

//   const handleSelectItem = (record, subRecord) => {
//     setTableOpen(false);

//     const recordCopy = record // delete qtyList array from record

//     // Check if the item is already selected
//     const index = selectedItems.findIndex((item) => item.id === record.id && item.locatorId === subRecord.locatorId);
//     if (index === -1) {
//       setSelectedItems((prevItems) => [...prevItems, {...recordCopy, locatorId: subRecord.locatorId}]); // Update selected items state
//     //   // add data to formData hook
//     //   // setItemDetail((prevData) => {
//     //   //   const newItem = {
//     //   //     srNo: prevData.length ? prevData.length + 1 : 1,
//     //   //     itemCode: record.itemMasterCd,
//     //   //     itemId: record.id,
//     //   //     itemDesc: record.itemMasterDesc,
//     //   //     uom: record.uomId,
//     //   //     uomDesc : record.uomDtls.baseUom,
//     //   //     quantity: 1,
//     //   //     noOfDays: 1,
//     //   //     remarks: "",
//     //   //     conditionOfGoods: "",
//     //   //     budgetHeadProcurement: "",
//     //   //     qtyList: record.qtyList
//     //   //   };
//     //   //   const updatedItems = [...(prevData || []), newItem];
//     //   //   return [...updatedItems]
//     //   // });

//       setFormData(prevValues=>{
//         const newItem = {
//           srNo: prevValues.items?.length ? prevValues.items.length + 1 : 1,
//           itemCode: record.itemMasterCd,
//           itemId: record.id,
//           itemDesc: record.itemMasterDesc,
//           uom: record.uomId,
//           uomDesc: record.uomDtls.baseUom,
//           quantity: 1,
//           noOfDays: 1,
//           conditionOfGoods: "",
//           budgetHeadProcurement: "",
//           locatorId: subRecord.locatorId,
//           locatorDesc: subRecord.locatorDesc,
//           remarks: "",
//           // qtyList: record.qtyList
//         }

//         const updatedItems = [...(prevValues.items || []), newItem]
//         return {...prevValues, items: updatedItems}
//       })
//     } 
//     else {
//       // If item is already selected, deselect it
//       const updatedItems = [...selectedItems];
//       updatedItems.splice(index, 1);
//       setSelectedItems(updatedItems);
//     }
//   };

//   const renderLocatorISN = (obj, rowRecord) => {
//     return (
//       <Table 
//         dataSource={obj}
//         pagination={false}
//         columns={[
//           {
//             title: "LOCATOR DESCRIPTION",
//             dataIndex: "locatorDesc",
//             key: "locatorDesc"
//           },
//           {
//             title: "QUANTITY",
//             dataIndex: "quantity",
//             key: "quantity"
//           },
//           {
//             title: "ACTION",
//             fixed: "right",
//             render: (_, record) => (
//               <Button
//                     onClick={() => handleSelectItem(rowRecord, record)}
//                     type= {selectedItems?.some((item) => item.locatorId === record.locatorId && item.id === rowRecord.id) ? "default" : "primary"}
//                   >
//                     {
//                       selectedItems?.some((item) => item.locatorId === record.locatorId && item.id === rowRecord.id)
//                       ? "Deselect"
//                       : "Select"
//                     }
                    
//                   </Button>
//             )
//           }
//         ]}
//       />
//     )
//   }

//   const tableColumns =  [
//     { title: "S NO.", dataIndex: "id", key: "id", fixed: "left", width: 80 },
//     {
//       title: "ITEM DESCRIPTION",
//       dataIndex: "itemMasterDesc",
//       key: "itemMasterDesc",
//       fixed: "left"
//       // render: (itemName) => itemNames[itemName],
//     },
//     {
//       title: "ITEM CODE",
//       dataIndex: "itemMasterCd",
//       key: "itemCode",
//     },
//     {
//       title: "UOM",
//       dataIndex: "uomDtls",
//       key: "uomDtls",
//       render: (uomDtls) => uomDtls.baseUom
//     },
//     {
//       title: "LOCATION",
//       dataIndex: "locationDesc",
//       key: "location"
//     },
//     // {
//     //   title: "LOCATOR CODE",
//     //   dataIndex: "locatorId",
//     //   key: "locatorCode",
//     // },
//     { title: "PRICE", dataIndex: "price", key: "price" },
//     // {
//     //   title: "VENDOR DETAIL",
//     //   dataIndex: "vendorId",
//     //   key: "vendorDetail",
//     //   render: (vendorId) => vendorMaster[vendorId],
//     //   // render: (vendorId) => findColumnValue(vendorId, vendorMaster, "vendorMaster")
//     // },
//     {
//       title: "CATEGORY",
//       dataIndex: "categoryDesc",
//       key: "category",
//       // render: (category) => categories[category],
//     },
//     {
//       title: "SUB-CATEGORY",
//       dataIndex: "subCategoryDesc",
//       key: "subCategory",
//       // render: (subCategory) => subCategories[subCategory],
//     },
//     {
//       title: "Type",
//       dataIndex: "typeDesc",
//       key: "type",
//       // render: (type) => types[type],
//     },
//     {
//       title: "Disciplines",
//       dataIndex: "disciplinesDesc",
//       key: "disciplines",
//       // render: (disciplines) => allDisciplines[disciplines],
//     },
//     {
//       title: "Brand",
//       dataIndex: "brandDesc",
//       key: "brand",
//       // render: (brandId) => brands[brandId],
//     },
//     {
//       title: "Size",
//       dataIndex: "sizeDesc",
//       key: "size",
//       // render: (size) => sizes[size],
//     },
//     {
//       title: "Colour",
//       dataIndex: "colorDesc",
//       key: "colour",
//       // render: (colorId) => colors[colorId],
//     },
//     {
//       title: "Usage Category",
//       dataIndex: "usageCategoryDesc",
//       key: "usageCategory",
//       // render: (usageCategory) => usageCategories[usageCategory],
//     },
//     {
//       title: "MINIMUM STOCK LEVEL",
//       dataIndex: "minStockLevel",
//       key: "minStockLevel",
//     },
//     {
//       title: "MAXIMUM STOCK LEVEL",
//       dataIndex: "maxStockLevel",
//       key: "maxStockLevel",
//     },
//     { title: "RE ORDER POINT", dataIndex: "reOrderPoint", key: "reOrderPoint" },
//     { title: "STATUS", dataIndex: "status", key: "status" },
//     { title: "CREATE DATE", dataIndex: "endDate", key: "endDate" },
//     {
//         title: "LOCATOR QUANTITY DETAILS",
//         dataIndex: "qtyList",
//         key: "qtyList",
//         render: (locatorQuantity, rowRecord) => renderLocatorISN(locatorQuantity, rowRecord)
//     },
//   ];

//   const itemHandleChange = (fieldName, value, index) => {
//     setFormData((prevValues) => {
//       const updatedItems = [...(prevValues.items || [])];
//       updatedItems[index] = {
//         ...updatedItems[index],
//         [fieldName]: value === "" ? null : value,
//       };
//       return {
//         ...prevValues,
//         items: updatedItems,
//       };
//     });
//   };

//   const populateItemData = async () => {
//     const itemMasterUrl =
//       "https://uat-sai-app.azurewebsites.net/sai-inv-mgmt/master/getItemMaster";
//     const locatorMasterUrl =
//       "https://uat-sai-app.azurewebsites.net/sai-inv-mgmt/master/getLocatorMaster";
//     const uomMasterUrl =
//       "https://uat-sai-app.azurewebsites.net/sai-inv-mgmt/master/getUOMMaster";
//     try {
//       const [itemMaster, locatorMaster, uomMaster] = await Promise.all([
//         axios.get(itemMasterUrl, apiHeader("GET", token)),
//         axios.get(locatorMasterUrl, apiHeader("GET", token)),
//         axios.get(uomMasterUrl, apiHeader("GET", token)),
//       ]);

//       const { responseData: itemMasterData } = itemMaster.data;
//       const { responseData: locatorMasterData } = locatorMaster.data;
//       const { responseData: uomMasterData } = uomMaster.data;

//       console.log("ITEMMASTERDATAA: ", itemMasterData)

//       setItemData([...itemMasterData]);
//       setUomMaster([...uomMasterData]);
//       setLocatorMaster([...locatorMasterData]);
//     } catch (error) {
//       console.log("Populate item data error: ", error);
//     }
//   };

//   useEffect(() => {
//     populateItemData();
//     // fetchItemData()
//     fetchUserDetails();
//   }, []);

//   const fetchItemData = async () => {
//     try {
//       const apiUrl =
//         "https://uat-sai-app.azurewebsites.net/sai-inv-mgmt/master/getItemMaster";
//       const response = await axios.get(apiUrl, apiHeader("GET", token));
//       const { responseData } = response.data;
//       setItemData(responseData);
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     }
//   };
//   // const fetchUserDetails = async () => {
//     // try {
//       // const userCd = localStorage.getItem("userCd")
//       // const password = localStorage.getItem("password")
//       // const apiUrl =
//       //   "https://uat-sai-app.azurewebsites.net/sai-inv-mgmt/login/authenticate";
//   const fetchUserDetails = async (processType=null) => {
//     console.log("ProcessTypee: ", processType)
//     const userCd = localStorage.getItem('userCd');
//     const password = localStorage.getItem('password');
//     try {
//       const apiUrl =
//       "https://uat-sai-app.azurewebsites.net/sai-inv-mgmt/login/authenticate";
//       const response = await axios.post(apiUrl, {
//         userCd,
//         password,
//       });

//       const { responseData } = response.data;
//       const { organizationDetails } = responseData;
//       const { userDetails } = responseData;
//       const {locationDetails} = responseData
//       const currentDate = dayjs();
//       // Update form data with fetched values
//       if(processType === "IRP"){
//         setFormData({
//           crRegionalCenterCd: organizationDetails.id,
//           crRegionalCenterName: organizationDetails.location,
//           crAddress: organizationDetails.locationAddr,
//           crZipcode: locationDetails.zipcode,
//           genName: userDetails.firstName,
//           // noaDate: currentDate.format(dateFormat),
//           // dateOfDelivery: currentDate.format(dateFormat),
//           userId: "string",
//           genDate: currentDate.format(dateFormat),
//           issueDate: currentDate.format(dateFormat),
//           approvedDate: currentDate.format(dateFormat),
//           gatePassDate: currentDate.format(dateFormat),
//           gatePassNo: "Not defined",
//           processType: processType,
//           type: processType,
//           processId: "string"
//         });
//       }
//       else{
//         setFormData({
//           ceRegionalCenterCd: organizationDetails.id,
//           ceRegionalCenterName: organizationDetails.location,
//           ceAddress: organizationDetails.locationAddr,
//           ceZipcode: locationDetails.zipcode,
//           genName: userDetails.firstName,
//           noaDate: currentDate.format(dateFormat),
//           dateOfDelivery: currentDate.format(dateFormat),
//           userId: "string",
//           genDate: currentDate.format(dateFormat),
//           issueDate: currentDate.format(dateFormat),
//           approvedDate: currentDate.format(dateFormat),
//           gatePassDate: currentDate.format(dateFormat),
//           gatePassNo: "Not defined",
//           processType: processType,
//           type: processType,
//           processId: "string"
//         });
//       }
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     }
//   };

//   const handleInwardGatePassChange = async (value) => {
//     try {
//       const apiUrl =
//         "https://uat-sai-app.azurewebsites.net/sai-inv-mgmt/getSubProcessDtls";
//       const response = await axios.post(apiUrl, {
//         processId: value,
//         processStage: "OGP",
//       }, apiHeader("POST", token));
//       const responseData = response.data.responseData;
//       const { processData, itemList } = responseData;
//       // console.log("API Response:", response.data);
//       //   "https://sai-services.azurewebsites.net/sai-inv-mgmt/getSubProcessDtls";
//       // const response = await axios.post(apiUrl, {
//       //   processId: value,
//       //   processStage: "OGP",
//       // });
//       // const responseData = response.data.responseData;
//       // const { processData, itemList } = responseData;
//       setFormData((prevFormData) => ({
//         ...prevFormData,

//         issueName: processData?.issueName,
//         approvedName: processData?.approvedName,
//         processId: processData?.processId,

//         crRegionalCenterCd: processData?.id,
//         crRegionalCenterName: processData?.crRegionalCenterName,
//         crAddress: processData?.crAddress,
//         crZipcode: processData?.crZipcode,

//         consumerName: processData?.consumerName,
//         contactNo: processData?.contactNo,

//         termsCondition: processData?.termsCondition,
//         note: processData?.note,
//         type: processData?.type,

//         items: itemList.map((item) => ({
//           srNo: item?.sNo,
//           itemId: item?.itemId,
//           itemCode: item?.itemCode,
//           itemDesc: item?.itemDesc,
//           uom: parseInt(item?.uom),
//           quantity: item?.quantity,
//           noOfDays: item?.requiredDays,
//           remarks: item?.remarks,
//           conditionOfGoods: item?.conditionOfGoods,
//           budgetHeadProcurement: item?.budgetHeadProcurement,
//           locatorId: parseInt(item?.locatorId),
//         })),
//       }));
//       // Handle response data as needed
//     } catch (error) {
//       console.error("Error fetching sub process details:", error);
//       // Handle error
//     }
//   };

//   const onFinish = async (values) => {
//     try {
//       const formDataCopy = { ...formData };

//       // Ensure all fields are present
//       const allFields = [
//         "genDate",
//         "genName",
//         "issueDate",
//         "issueName",
//         "approvedDate",
//         "approvedName",
//         "processId",
//         "type",
//         "gatePassDate",
//         "gatePassNo",
//         "ceRegionalCenterCd",
//         "ceRegionalCenterName",
//         "ceAddress",
//         "ceZipcode",
//         "crRegionalCenterCd",
//         "crRegionalCenterName",
//         "crAddress",
//         "crZipcode",
//         "consumerName",
//         "contactNo",
//         "noaNo",
//         "noaDate",
//         "dateOfDelivery",
//         "modeOfDelivery",
//         "challanNo",
//         "supplierCode",
//         "supplierName",
//         "noteType",
//         "rejectionNoteNo",
//         "userId",
//         "termsCondition",
//         "note",
//       ];

//       allFields.forEach((field) => {
//         if (!(field in formDataCopy)) {
//           formDataCopy[field] = "";
//         }
//       });

//       // const apiUrl =
//       //   "https://uat-sai-app.azurewebsites.net/sai-inv-mgmt/saveInwardGatePass";
//         // console.log("API Response:", response.data);
//         // in processType PO, we need to pass "NA" in approved name
//         const aprName = formDataCopy.approvedName === "" ? "NA" : formDataCopy.approvedName 
        
//         const apiUrl =
//         "https://uat-sai-app.azurewebsites.net/sai-inv-mgmt/saveInwardGatePass";
//         // const response = await axios.post(apiUrl, formDataCopy, apiHeader("POST", token) );
//       const response = await axios.post(apiUrl, {...formDataCopy, approvedName: aprName}, apiHeader("POST", token));
//       if (
//         response.status === 200 &&
//         response.data &&
//         response.data.responseStatus &&
//         response.data.responseStatus.message === "Success"
//       ) {
//         // Access the specific success message data if available
//         const { processId, processType, subProcessId } =
//           response.data.responseData;
//         setFormData((prevValues) => {
//           return {
//             ...prevValues,
//             gatePassNo: processId,
//           };
//         });

//         setButtonVisible(true)
//         setSuccessMessage(
//           `Inward gate pass successfully! Inward gate pass : ${processId}, Process Type: ${processType}, Sub Process ID: ${subProcessId}`
//         );
//         showModal();
//         message.success(
//           `Inward gate pass successfully! Process ID: ${processId}, Process Type: ${processType}, Sub Process ID: ${subProcessId}`
//         );
//       } else {
//         // Display a generic success message if specific data is not available
//         message.error("Failed to Inward gate pass. Please try again later.");
//       }

//       // Handle success response here
//     } catch (error) {
//       console.error("Error saving Inward gate pass:", error);
//       message.error("Failed to Inward gate pass. Please try again later.");

//       // Handle error response here
//     }
//   };

//   const handleValuesChange = (_, allValues) => {
//     setType(allValues.type);
//   };

//   const handleSelectChange = (value) => {
//     setSelectedOption(value);
//   };

//   const removeItem = (index) => {
//     setFormData((prevValues) => {
//       const updatedItems = prevValues.items;
//       updatedItems.splice(index, 1);

//       const updatedItems1 = updatedItems.map((item, key) => {
//         return { ...item, srNo: key+1 };
//       });

//       return {
//         ...prevValues,
//         items: updatedItems1,
//       };
//     });
//   };

//   return (
//     <div className="goods-receive-note-form-container" ref={formRef}>
//       <h1>Sports Authority of India - Inward Gate Pass</h1>

//       <Form
//         onFinish={onFinish}
//         className="goods-receive-note-form"
//         onValuesChange={handleValuesChange}
//         layout="vertical"
//         initialValues={{fieldName: formData}}
//       >
//         <Row>
//           <Col span={6} offset={18}>
//             <Form.Item label="DATE" name="gatePassDate">
//               <DatePicker
//                 defaultValue={dayjs()}
//                 format={dateFormat}
//                 style={{ width: "100%" }}
//                 name="gatePassDate"
//                 onChange={(date, dateString) =>
//                   handleChange("gatePassDate", dateString)
//                 }
//               />
//             </Form.Item>
//           </Col>
//           <Col span={6}>
//             <Form.Item label="TYPE" name="type">
//               <Select onChange={(value) => handleChange("processType", value)}>
//                 <Option value="IRP">1. Issue/Return</Option>
//                 <Option value="PO">2. Purchase Order</Option>
//                 <Option value="IOP">3. Inter-Org Transaction</Option>
//               </Select>
//             </Form.Item>
//           </Col>
//           <Col span={6} offset={12}>
//             {/* <Form.Item label="INWARD GATE PASS NO." name="gatePassDate">
//               <Input
//                 disabled
//                 onChange={(e) => handleChange("gatePassNo", e.target.value)}
//               />
//             </Form.Item> */}

//             <FormInputItem label="INWARD GATE PASS NO." value={formData.gatePassNo ? formData.gatePassNo : ""} readOnly={true}/>
//           </Col>
//         </Row>

//         <Row gutter={24}>
//           <Col span={8}>
//             <Title strong level={2} underline type="danger">
//               {
//                 Type === "IRP" ?
//                 "CONSIGNOR DETAIL :-" : "CONSIGNEE DETAIL :-"
//               }
//             </Title>

//             {/* for purchase order */}

//             <FormInputItem label="REGIONAL CENTER CODE :" value={Type==="IRP" ? formData.crRegionalCenterCd : formData.ceRegionalCenterCd} readOnly={true}/>
//             <FormInputItem label="REGIONAL CENTER NAME :" value={Type==="IRP" ? formData.crRegionalCenterName :formData.ceRegionalCenterName} readOnly={true} />
//             <FormInputItem label="ADDRESS :" value={Type==="IRP" ? formData.crAddress : formData.ceAddress} readOnly={true} />
//             <FormInputItem label="ZIPCODE :" value={Type==="IRP" ? formData.crZipcode : formData.ceZipcode} readOnly={true} />
//           </Col>
//           <Col span={8}>
//             <Title strong underline level={2} type="danger">
//             {
//                 Type === "IRP" ?
//                 "CONSIGNEE DETAIL ;-" : "CONSIGNOR DETAIL :-"
//               }
//             </Title>

//             {Type === "PO" && (
//               <>
//                 <FormInputItem label="SUPPLIER CODE :" name="supplierCode" onChange={handleChange} />
//                 <FormInputItem label="SUPPLIER NAME :" value={formData.supplierName} />
//                 <FormInputItem label="ADDRESS :" value={formData.crAddress} readOnly={true} />
//               </>
//             )}

//             {Type === "IRP" && (
//               <>
//                 <Form.Item
//                   label="CONSUMER NAME :"
//                   name="consumerName"
//                   initialValue={formData.consumerName}
//                 >
//                   <Input
//                     value={formData.consumerName}
//                     onChange={(e) =>
//                       handleChange("consumerName", e.target.value)
//                     }
//                   />
//                   <div style={{ display: "none" }}>{formData.crZipcode}</div>
//                 </Form.Item>
//                 <Form.Item
//                   label="CONTACT NO. :"
//                   name="contactNo"
//                   initialValue={formData.contactNo}
//                 >
//                   <Input
//                     value={formData.contactNo}
//                     onChange={(e) => handleChange("contactNo", e.target.value)}
//                   />
//                   <div style={{ display: "none" }}>{formData.crZipcode}</div>
//                 </Form.Item>
//               </>
//             )}

//             {Type === "IOP" && (
//               <>
//                 <Form.Item
//                   label="REGIONAL CENTER CODE"
//                   name="ceRegionalCenterCd"
//                 >
//                   <Input
//                     onChange={(e) =>
//                       handleChange("crRegionalCenterCd", e.target.value)
//                     }
//                   />
//                 </Form.Item>

//                 <FormInputItem label="REGIONAL CENTER CODE :" value={formData.ceRegionalCenterCd} readOnly={true}/>
//                 <FormInputItem label="REGIONAL CENTER NAME :" value={formData.ceRegionalCenterName} readOnly={true} />
//                 <FormInputItem label="ADDRESS :" value={formData.ceAddress} readOnly={true} />
//                 <Form.Item label="ZIP CODE :" name="crZipcode">
//                   <Input value={1234}
//                     onChange={(e) => handleChange("crZipcode", e.target.value)}
//                   />
//                 </Form.Item>
//               </>
//             )}
//           </Col>

//           <Col span={8}>
//             <Form.Item></Form.Item>
//             {Type === "IRP" && (
//               <Form.Item label="OUTWARD GATE PASS." name="outwardgatepass">
//                 <Input
//                   onChange={(e) => handleInwardGatePassChange(e.target.value)}
//                 />
//               </Form.Item>
//             )}
//             {/*Type === 'PO' && (
//               <Form.Item label="PURCHASE ORDER NO." name="purchaseorderno">
//                 <Input />
//               </Form.Item>
//             )*/}
//             {Type === "IOP" && (
//               <>
//                 <Form.Item label="SELECT NOTE TYPE" name="noteType">
//                   <Select onChange={handleSelectChange}>
//                     <Option value="ISSUE">ISSUE NOTE NO.</Option>
//                     <Option value="REJECTION">REJECTION NOTE NO.</Option>
//                   </Select>
//                 </Form.Item>

//                 <Form.Item
//                   label={
//                     selectedOption === "ISSUE"
//                       ? "ISSUE NOTE NO."
//                       : "REJECTION NOTE NO."
//                   }
//                   name="inwardGatePass"
//                 >
//                   <Input />
//                 </Form.Item>
//               </>
//             )}
//             {(Type === "IOP" || Type === "PO") && (
//               <>
//                 <Form.Item label="NOA NO." name="noaNo">
//                   <Input
//                     onChange={(e) => handleChange("noaNo", e.target.value)}
//                   />
//                 </Form.Item>
//                 <Form.Item label="NOA DATE" name="noaDate">
//                   <DatePicker
//                     format={dateFormat}
//                     style={{ width: "100%" }}
//                     onChange={(date, dateString) =>
//                       handleChange("noaDate", dateString)
//                     }
//                   />
//                 </Form.Item>
//                 <Form.Item label="DATE OF DELIVERY" name="dateOfDelivery">
//                   <DatePicker
//                     format={dateFormat}
//                     style={{ width: "100%" }}
//                     onChange={(date, dateString) =>
//                       handleChange("dateOfDelivery", dateString)
//                     }
//                   />
//                 </Form.Item>
//               </>
//             )}
//           </Col>
//         </Row>
//         {(Type === "IOP" || Type === "PO") && (
//           <Row gutter={24}>
//             <Col span={8}>
//               <Form.Item label=" CHALLAN / INVOICE NO. :" name="challanNo">
//                 <Input
//                   onChange={(e) => handleChange("challanNo", e.target.value)}
//                 />
//               </Form.Item>
//             </Col>
//             <Col span={8}>
//               <Form.Item label="MODE OF DELIVERY  :" name="modeOfDelivery">
//                 <Input
//                   onChange={(e) =>
//                     handleChange("modeOfDelivery", e.target.value)
//                   }
//                 />
//               </Form.Item>
//             </Col>
//           </Row>
//         )}

//         {/* Item Details */}
//         <h2>ITEM DETAILS</h2>

//         {
//           Type === "PO" &&
//           <div style={{ width: "300px" }}>
//           <Popover
//             onClick={() => setTableOpen(true)}
//             content={
//               <Table pagination={{pageSize: 3}} dataSource={filteredData} columns={tableColumns} scroll={{ x: "max-content" }} style={{width: "600px", display: tableOpen? "block": "none"}}/>
//             }
//             title="Filtered Item Data"
//             trigger="click"
//             // open={true}
//             open={searchValue !== "" && filteredData.length > 0}
//             style={{ width: "200px" }}
//             placement="right"
//           >
//             <Input.Search
//               placeholder="Search Item Data"
//               allowClear
//               enterButton="Search"
//               size="large"
//               onSearch={(e)=>handleSearch(e.target?.value || "", itemData, setFilteredData, setSearchValue )}
//               onChange={(e)=>handleSearch(e.target?.value || "", itemData, setFilteredData, setSearchValue )}
//             />
//           </Popover>
//         </div>
//         }

//         <Form.List name="items" initialValue={formData.items || [{}]}>
//           {(fields, { add, remove }) => (
//             <>
//               {formData.items?.length > 0 &&
//                 formData.items.map((item, key) => {
//                   return (
//                     // <div className="xyz" style={{font:"150px", zIndex: "100"}}>xyz</div>

//                     <div
//                       key={key}
//                       style={{
//                         marginBottom: 16,
//                         border: "1px solid #d9d9d9",
//                         padding: 16,
//                         borderRadius: 4,
//                         display: "grid",
//                         gridTemplateColumns:
//                           "repeat(auto-fit, minmax(200px, 1fr))",
//                         gap: "20px",
//                       }}
//                     >
//                       <Form.Item label="Serial No.">
//                         <Input value={item.srNo} readOnly />
//                       </Form.Item>

//                       <Form.Item label="ITEM CODE">
//                         <Input value={item.itemCode} readOnly />
//                       </Form.Item>

//                       <Form.Item label="ITEM DESCRIPTION">
//                         <Input value={item.itemDesc} readOnly />
//                       </Form.Item>

//                       <Form.Item label="UOM">
//                         <Input
//                           value={item.uomDesc || uomMaster[item.uom]}
//                         />
//                       </Form.Item>

//                       <Form.Item label="LOCATOR DESCRIPITON">
//                         <Input
//                           value={item.locatorDesc || locatorMaster[item.locatorId]}
//                           readOnly
//                         />
//                       </Form.Item>

//                       <Form.Item label="QUANTITY">
//                         <Input
//                           value={item.quantity}
//                           onChange={(e) =>
//                             itemHandleChange("quantity", e.target.value, key)
//                           }
//                         />
//                       </Form.Item>
                    
//                     {
//                       Type === "IRP" &&
//                       <Form.Item label="REQUIRED FOR NO. OF DAYS">
//                         <Input
//                           value={item.noOfDays}
//                           onChange={(e) =>
//                             itemHandleChange("noOfDays", e.target.value, key)
//                           }
//                           />
//                       </Form.Item>
//                       }

//                       <Form.Item label="REMARK">
//                         <Input
//                           value={item.remarks}
//                           onChange={(e) =>
//                             itemHandleChange("remarks", e.target.value, key)
//                           }
//                         />
//                       </Form.Item>

//                       <Col span={1}>
//                         <MinusCircleOutlined
//                           onClick={() => removeItem(key)}
//                           style={{ marginTop: 8 }}
//                         />
//                       </Col>
//                     </div>
//                   );
//                 })}
//             </>
//           )}
//         </Form.List>

//         {/* Condition of Goods */}

//         <Row gutter={24}>
//           <Col span={12}>
//             <Form.Item label="TERMS AND CONDITION :" name="termsCondition">
//               <Input.TextArea
//                 value={formData.termsCondition}
//                 autoSize={{ minRows: 3, maxRows: 6 }}
//                 readOnly = {Type === "PO" ? false : true}
//                 onChange={(e) => handleChange("termsCondition", e.target.value)}
//               />
//               <Input style={{ display: "none" }} />
//             </Form.Item>
//           </Col>
//           <Col span={12}>
//             <Form.Item label="NOTE" name="note">
//               <Input.TextArea
//                 value={formData.note}
//                 autoSize={{ minRows: 3, maxRows: 6 }}
//                 onChange={(e) => handleChange("note", e.target.value)}
//               />
//               <Input style={{ display: "none" }} />
//             </Form.Item>
//           </Col>
//         </Row>

//         {/* Note and Signature */}

//         <div
//           style={{
//             display: "flex",
//             width: "100%",
//             justifyContent: "space-between",
//           }}
//         >
//           <div>
//             <div className="goods-receive-note-signature">GENERATED BY</div>
//             <div className="goods-receive-note-signature">
//               NAME & DESIGNATION :
//               <Form>
//                 <Input
//                   value={formData.genName}
//                   name="genName"
//                   onChange={(e) => handleChange("genName", e.target.value)}
//                 />
//               </Form>
//             </div>
//             <div className="goods-receive-note-signature">
//               DATE & TIME :
//               <DatePicker
//                 defaultValue={dayjs()}
//                 format={dateFormat}
//                 style={{ width: "58%" }}
//                 name="genDate"
//                 onChange={(date, dateString) =>
//                   handleChange("genDate", dateString)
//                 }
//               />
//             </div>
//           </div>
//           {Type !== "PO" && (
//             <div>
//               <div className="goods-receive-note-signature">RECEIVED BY</div>
//               <div className="goods-receive-note-signature">
//                 NAME & SIGNATURE :
//                 <Form>
//                   <Input
//                     name="issueName"
//                     onChange={(e) => handleChange("issueName", e.target.value)}
//                   />
//                 </Form>
//               </div>
//               <div className="goods-receive-note-signature">
//                 DATE & TIME :
//                 <DatePicker
//                   defaultValue={dayjs()}
//                   format={dateFormat}
//                   style={{ width: "58%" }}
//                   name="issueDate"
//                   onChange={(date, dateString) =>
//                     handleChange("issueDate", dateString)
//                   }
//                 />
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Submit Button */}
//         <div className="goods-receive-note-button-container">
//           <Form.Item>
//             <Button
//               type="primary"
//               htmlType="save"
//               style={{ width: "200px", margin: 16 }}
//             >
//               SAVE
//             </Button>
//           </Form.Item>

//           <Form.Item>
//             <Button
//               type="primary"
//               htmlType="submit"
//               style={{
//                 backgroundColor: "#4CAF50",
//                 borderColor: "#4CAF50",
//                 width: "200px",
//                 margin: 16,
//               }}
//             >
//               SUBMIT
//             </Button>
//           </Form.Item>
//           <Form.Item>
//           <Button disabled={!buttonVisible} onClick={()=> printOrSaveAsPDF(formRef)} type="primary" danger htmlType="save" style={{ width: '200px', margin: 16, alignContent: 'end' }}>
//               PRINT
//             </Button>
//           </Form.Item>
//         </div>
//         <Modal
//           title="Inward gate pass saved successfully"
//           visible={isModalOpen}
//           onOk={handleOk}
//         >
//           {successMessage && <p>{successMessage}</p>}
//           {errorMessage && <p>{errorMessage}</p>}
//         </Modal>
//       </Form>
//     </div>
//   );
// };

// export default InwardGatePass;


// InwardGatePass.js
import React, { useState, useEffect, useRef } from "react";
import {
  Form,
  Input,
  Select,
  DatePicker,
  Button,
  Row,
  Col,
  Typography,
  message,
  Modal,
  Popover,
  Table
} from "antd";
import { MinusCircleOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import axios from "axios";
import { apiHeader, fetchUomLocatorMaster, handleSearch, printOrSaveAsPDF } from "../../../utils/Functions";
import FormInputItem from "../../../components/FormInputItem";
const dateFormat = "DD/MM/YYYY";
const { Option } = Select;
const { Text, Title } = Typography;

const InwardGatePass = () => {
  const [buttonVisible, setButtonVisible] = useState(false)
  const formRef = useRef()
  const [Type, setType] = useState("IRP");
  const [selectedOption, setSelectedOption] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [itemData, setItemData] = useState([]);
  const [searchValue, setSearchValue] = useState("")
  const [data, setData] = useState([])
  const [uomMaster, setUomMaster] = useState([]);
  const [filteredData, setFilteredData] = useState([])
  const [tableOpen, setTableOpen] = useState(false)
  const [locatorMaster, setLocatorMaster] = useState([]);
  const [selectedItems, setSelectedItems] = useState([])
  const [locationMaster, setLocationMaster] = useState([])
  const [vendorMaster, setVendorMaster] = useState([])
  const [formData, setFormData] = useState({
    genDate: "",
    genName: "",
    issueDate: "",
    issueName: "",
    approvedDate: "",
    approvedName: "",
    processId: "string",
    type: "",
    gatePassDate: "",
    gatePassNo: "",
    ceRegionalCenterCd: "",
    ceRegionalCenterName: "",
    ceAddress: "",
    ceZipcode: "",
    crRegionalCenterCd: "",
    crRegionalCenterName: "",
    crAddress: "",
    crZipcode: "",
    consumerName: "",
    contactNo: "",
    noaNo: "",
    noaDate: "",
    dateOfDelivery: "",
    modeOfDelivery: "",
    challanNo: "",
    supplierCode: "",
    supplierName: "",
    noteType: "",
    rejectionNoteNo: "",
    items: [
      // {
      //   srNo: 0,
      //   itemCode: "",
      //   itemDesc: "",
      //   uom: "",
      //   quantity: 0,
      //   noOfDays: 0,
      //   remarks: "",
      //   conditionOfGoods: "",
      //   budgetHeadProcurement: "",
      //   locatorId: "",
      // },
    ],
    userId: "",
    termsCondition: "",
    note: "",
    processType: "",
  });

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const userCd = localStorage.getItem("userCd")
  const password = localStorage.getItem("password")
  const token = localStorage.getItem("token")

  const searchVendor = async (value) => {
    const vendorByIdUrl = "https://uat-sai-app.azurewebsites.net/sai-inv-mgmt/master/getVendorMasterById"
    try{
      const response = await axios.post(vendorByIdUrl, {userId: userCd, id: value}, apiHeader("POST", token))
      const {responseStatus, responseData} = response.data
      const {message, statusCode} = responseStatus

      if(message === "Success" && statusCode === 200 && responseData !== null){
        setFormData(prev=>{
          return{
            ...prev,
            supplierName: responseData.vendorName,
            crAddress: responseData.address,
            supplierCode: value
          }
        })
      }

    }catch(error){
      console.log("Not getting vendor", error)
    }

  }



  const handleChange = (fieldName, value) => {
    if(fieldName === "processType"){
      console.log(fieldName, value)
      fetchUserDetails(value)
      return;
    }
    if(fieldName === "supplierCode"){
      searchVendor(value)
      return
    }

    setFormData((prevValues) => ({
      ...prevValues,
      [fieldName]: value === "" ? null : value,
    }));
  };

  const handleSelectItem = (record, subRecord) => {
    setTableOpen(false);

    const recordCopy = record // delete qtyList array from record

    // Check if the item is already selected
    const index = selectedItems.findIndex((item) => item.id === record.id && item.locatorId === subRecord.locatorId);
    if (index === -1) {
      setSelectedItems((prevItems) => [...prevItems, {...recordCopy, locatorId: subRecord.locatorId}]); // Update selected items state
    //   // add data to formData hook
    //   // setItemDetail((prevData) => {
    //   //   const newItem = {
    //   //     srNo: prevData.length ? prevData.length + 1 : 1,
    //   //     itemCode: record.itemMasterCd,
    //   //     itemId: record.id,
    //   //     itemDesc: record.itemMasterDesc,
    //   //     uom: record.uomId,
    //   //     uomDesc : record.uomDtls.baseUom,
    //   //     quantity: 1,
    //   //     noOfDays: 1,
    //   //     remarks: "",
    //   //     conditionOfGoods: "",
    //   //     budgetHeadProcurement: "",
    //   //     qtyList: record.qtyList
    //   //   };
    //   //   const updatedItems = [...(prevData || []), newItem];
    //   //   return [...updatedItems]
    //   // });

      setFormData(prevValues=>{
        const newItem = {
          srNo: prevValues.items?.length ? prevValues.items.length + 1 : 1,
          itemCode: record.itemMasterCd,
          itemId: record.id,
          itemDesc: record.itemMasterDesc,
          uom: record.uomId,
          uomDesc: record.uomDtls.baseUom,
          quantity: 1,
          noOfDays: 1,
          conditionOfGoods: "",
          budgetHeadProcurement: "",
          locatorId: subRecord.locatorId,
          locatorDesc: subRecord.locatorDesc,
          remarks: "",
          // qtyList: record.qtyList
        }

        const updatedItems = [...(prevValues.items || []), newItem]
        return {...prevValues, items: updatedItems}
      })
    } 
    else {
      // If item is already selected, deselect it
      const updatedItems = [...selectedItems];
      updatedItems.splice(index, 1);
      setSelectedItems(updatedItems);
    }
  };

  const renderLocatorISN = (obj, rowRecord) => {
    return (
      <Table 
        dataSource={obj}
        pagination={false}
        columns={[
          {
            title: "LOCATOR DESCRIPTION",
            dataIndex: "locatorDesc",
            key: "locatorDesc"
          },
          {
            title: "QUANTITY",
            dataIndex: "quantity",
            key: "quantity"
          },
          {
            title: "ACTION",
            fixed: "right",
            render: (_, record) => (
              <Button
                    onClick={() => handleSelectItem(rowRecord, record)}
                    type= {selectedItems?.some((item) => item.locatorId === record.locatorId && item.id === rowRecord.id) ? "default" : "primary"}
                  >
                    {
                      selectedItems?.some((item) => item.locatorId === record.locatorId && item.id === rowRecord.id)
                      ? "Deselect"
                      : "Select"
                    }
                    
                  </Button>
            )
          }
        ]}
      />
    )
  }

  const tableColumns =  [
    { title: "S NO.", dataIndex: "id", key: "id", fixed: "left", width: 80 },
    {
      title: "ITEM DESCRIPTION",
      dataIndex: "itemMasterDesc",
      key: "itemMasterDesc",
      fixed: "left"
      // render: (itemName) => itemNames[itemName],
    },
    {
      title: "ITEM CODE",
      dataIndex: "itemMasterCd",
      key: "itemCode",
    },
    {
      title: "UOM",
      dataIndex: "uomDtls",
      key: "uomDtls",
      render: (uomDtls) => uomDtls.baseUom
    },
    {
      title: "LOCATION",
      dataIndex: "locationDesc",
      key: "location"
    },
    // {
    //   title: "LOCATOR CODE",
    //   dataIndex: "locatorId",
    //   key: "locatorCode",
    // },
    { title: "PRICE", dataIndex: "price", key: "price" },
    // {
    //   title: "VENDOR DETAIL",
    //   dataIndex: "vendorId",
    //   key: "vendorDetail",
    //   render: (vendorId) => vendorMaster[vendorId],
    //   // render: (vendorId) => findColumnValue(vendorId, vendorMaster, "vendorMaster")
    // },
    {
      title: "CATEGORY",
      dataIndex: "categoryDesc",
      key: "category",
      // render: (category) => categories[category],
    },
    {
      title: "SUB-CATEGORY",
      dataIndex: "subCategoryDesc",
      key: "subCategory",
      // render: (subCategory) => subCategories[subCategory],
    },
    {
      title: "Type",
      dataIndex: "typeDesc",
      key: "type",
      // render: (type) => types[type],
    },
    {
      title: "Disciplines",
      dataIndex: "disciplinesDesc",
      key: "disciplines",
      // render: (disciplines) => allDisciplines[disciplines],
    },
    {
      title: "Brand",
      dataIndex: "brandDesc",
      key: "brand",
      // render: (brandId) => brands[brandId],
    },
    {
      title: "Size",
      dataIndex: "sizeDesc",
      key: "size",
      // render: (size) => sizes[size],
    },
    {
      title: "Colour",
      dataIndex: "colorDesc",
      key: "colour",
      // render: (colorId) => colors[colorId],
    },
    {
      title: "Usage Category",
      dataIndex: "usageCategoryDesc",
      key: "usageCategory",
      // render: (usageCategory) => usageCategories[usageCategory],
    },
    {
      title: "MINIMUM STOCK LEVEL",
      dataIndex: "minStockLevel",
      key: "minStockLevel",
    },
    {
      title: "MAXIMUM STOCK LEVEL",
      dataIndex: "maxStockLevel",
      key: "maxStockLevel",
    },
    { title: "RE ORDER POINT", dataIndex: "reOrderPoint", key: "reOrderPoint" },
    { title: "STATUS", dataIndex: "status", key: "status" },
    { title: "CREATE DATE", dataIndex: "endDate", key: "endDate" },
    {
        title: "LOCATOR QUANTITY DETAILS",
        dataIndex: "qtyList",
        key: "qtyList",
        render: (locatorQuantity, rowRecord) => renderLocatorISN(locatorQuantity, rowRecord)
    },
  ];

  const itemHandleChange = (fieldName, value, index) => {
    setFormData((prevValues) => {
      const updatedItems = [...(prevValues.items || [])];
      updatedItems[index] = {
        ...updatedItems[index],
        [fieldName]: value === "" ? null : value,
      };
      return {
        ...prevValues,
        items: updatedItems,
      };
    });
  };

  const mergeItemMasterAndOhq = (itemMasterArr, ohqArr) => {
    return itemMasterArr.map(item=>{
      const itemCodeMatch = ohqArr.find(itemOhq=>itemOhq.itemCode === item.itemMasterCd)
      if(itemCodeMatch)
        return {...item, qtyList:itemCodeMatch.qtyList, locationId: itemCodeMatch.locationId, locationDesc: itemCodeMatch.locationName}
    })
  }

  const populateItemData = async() => {
    const itemMasterUrl = "https://uat-sai-app.azurewebsites.net/sai-inv-mgmt/master/getItemMaster"
    const ohqUrl = "https://uat-sai-app.azurewebsites.net/sai-inv-mgmt/master/getOHQ"
    const vendorMasteUrl = "https://uat-sai-app.azurewebsites.net/sai-inv-mgmt/master/getVendorMaster"
    const locationMasterUrl = "https://uat-sai-app.azurewebsites.net/sai-inv-mgmt/master/getLocationMaster"
    try{
      const [itemMaster, ohq, vendorMaster, locationMaster] = await Promise.all([
        axios.get(itemMasterUrl, apiHeader("GET", token)),
        axios.post(ohqUrl, {itemCode:null, user: "string"}, apiHeader("GET", token)),
        axios.get(vendorMasteUrl, apiHeader("GET",  token)),
        axios.get(locationMasterUrl, apiHeader("GET", token))
      ])

      
      const {responseData : itemMasterData} = itemMaster.data
      // const {responseData : locatorMasterData} = locatorMaster.data
      // const {responseData : uomMasterData} = uomMaster.data
      const {responseData: ohqData} = ohq.data
      const {responseData : vendorMasterData} = vendorMaster.data
      const {responseData : locationMasterData} = locationMaster.data

      const mergedItemMaster = mergeItemMasterAndOhq(itemMasterData, ohqData)

      setData([...mergedItemMaster])
      setFilteredData([...mergedItemMaster])

      const locationMasterObj = locationMasterData.reduce((acc, obj)=>{
        acc[obj.id] = obj.locationName
        return acc
      }, {})

      const vendorMasterObj = vendorMasterData.reduce((acc, obj)=>{
        acc[obj.id] = obj.vendorName
        return acc
      }, {})
      setVendorMaster({...vendorMasterObj})
      setLocationMaster({...locationMasterObj})

    }
    catch(error){
      console.log("Populate item data error: ", error)
    }
  }

  useEffect(() => {
    fetchUomLocatorMaster(setUomMaster, setLocatorMaster)
    populateItemData();
    // fetchItemData()
    fetchUserDetails();
  }, []);

  const fetchItemData = async () => {
    try {
      const apiUrl =
        "https://uat-sai-app.azurewebsites.net/sai-inv-mgmt/master/getItemMaster";
      const response = await axios.get(apiUrl, apiHeader("GET", token));
      const { responseData } = response.data;
      setItemData(responseData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const fetchUserDetails = async (processType=null) => {
    console.log("ProcessTypee: ", processType)
    const userCd = localStorage.getItem('userCd');
    const password = localStorage.getItem('password');
    try {
      const apiUrl =
        "https://uat-sai-app.azurewebsites.net/sai-inv-mgmt/login/authenticate";
      const response = await axios.post(apiUrl, {
        userCd,
        password,
      });

      const { responseData } = response.data;
      const { organizationDetails } = responseData;
      const { userDetails } = responseData;
      const {locationDetails} = responseData
      const currentDate = dayjs();
      // Update form data with fetched values
      if(processType === "IRP" || processType === "IOP"){
        console.log("IF ME")
        setFormData({
          crRegionalCenterCd: organizationDetails.id,
          crRegionalCenterName: organizationDetails.location,
          crAddress: organizationDetails.locationAddr,
          crZipcode: locationDetails.zipcode,
          genName: userDetails.firstName,
          // noaDate: currentDate.format(dateFormat),
          // dateOfDelivery: currentDate.format(dateFormat),
          userId: "string",
          genDate: currentDate.format(dateFormat),
          issueDate: currentDate.format(dateFormat),
          approvedDate: currentDate.format(dateFormat),
          gatePassDate: currentDate.format(dateFormat),
          gatePassNo: "Not defined",
          processType: processType,
          type: processType,
          processId: "string"
        });
      }
      else{
        console.log("ELKSE MNWW")
        setFormData({
          ceRegionalCenterCd: organizationDetails.id,
          ceRegionalCenterName: organizationDetails.location,
          ceAddress: organizationDetails.locationAddr,
          ceZipcode: locationDetails.zipcode,
          genName: userDetails.firstName,
          // noaDate: currentDate.format(dateFormat),
          // dateOfDelivery: currentDate.format(dateFormat),
          userId: "string",
          genDate: currentDate.format(dateFormat),
          issueDate: currentDate.format(dateFormat),
          approvedDate: currentDate.format(dateFormat),
          gatePassDate: currentDate.format(dateFormat),
          gatePassNo: "Not defined",
          processType: processType,
          type: processType,
          processId: "string"
        });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleInwardGatePassChange = async (value) => {
    try {
      const apiUrl =
        "https://uat-sai-app.azurewebsites.net/sai-inv-mgmt/getSubProcessDtls";
      const response = await axios.post(apiUrl, {
        processId: value,
        processStage: "OGP",
      },  apiHeader("POST", token));
      const responseData = response.data.responseData;
      const { processData, itemList } = responseData;
      setFormData((prevFormData) => ({
        ...prevFormData,

        issueName: processData?.issueName,
        approvedName: processData?.approvedName,
        processId: processData?.processId,

        crRegionalCenterCd: processData?.id,
        crRegionalCenterName: processData?.crRegionalCenterName,
        crAddress: processData?.crAddress,
        crZipcode: processData?.crZipcode,

        consumerName: processData?.consumerName,
        contactNo: processData?.contactNo,

        termsCondition: processData?.termsCondition,
        note: processData?.note,
        type: processData?.type,

        items: itemList.map((item) => ({
          srNo: item?.sNo,
          itemId: item?.itemId,
          itemCode: item?.itemCode,
          itemDesc: item?.itemDesc,
          uom: parseInt(item?.uom),
          quantity: item?.quantity,
          noOfDays: item?.requiredDays,
          remarks: item?.remarks,
          conditionOfGoods: item?.conditionOfGoods,
          budgetHeadProcurement: item?.budgetHeadProcurement,
          locatorId: parseInt(item?.locatorId),
        })),
      }));
      // Handle response data as needed
    } catch (error) {
      console.error("Error fetching sub process details:", error);
      // Handle error
    }
  };

  const onFinish = async (values) => {
    try {
      const formDataCopy = { ...formData };

      // Ensure all fields are present
      const allFields = [
        "genDate",
        "genName",
        "issueDate",
        "issueName",
        "approvedDate",
        "approvedName",
        "processId",
        "type",
        "gatePassDate",
        "gatePassNo",
        "ceRegionalCenterCd",
        "ceRegionalCenterName",
        "ceAddress",
        "ceZipcode",
        "crRegionalCenterCd",
        "crRegionalCenterName",
        "crAddress",
        "crZipcode",
        "consumerName",
        "contactNo",
        "noaNo",
        "noaDate",
        "dateOfDelivery",
        "modeOfDelivery",
        "challanNo",
        "supplierCode",
        "supplierName",
        "noteType",
        "rejectionNoteNo",
        "userId",
        "termsCondition",
        "note",
      ];

      allFields.forEach((field) => {
        if (!(field in formDataCopy)) {
          formDataCopy[field] = "";
        }
      });

      // in processType PO, we need to pass "NA" in approved name
      const aprName = formDataCopy.approvedName === "" ? "NA" : formDataCopy.approvedName 

      const apiUrl =
        "https://uat-sai-app.azurewebsites.net/sai-inv-mgmt/saveInwardGatePass";
      const response = await axios.post(apiUrl, {...formDataCopy, approvedName: aprName}, apiHeader("POST", token));
      if (
        response.status === 200 &&
        response.data &&
        response.data.responseStatus &&
        response.data.responseStatus.message === "Success"
      ) {
        // Access the specific success message data if available
        const { processId, processType, subProcessId } =
          response.data.responseData;
        setFormData((prevValues) => {
          return {
            ...prevValues,
            gatePassNo: processId,
          };
        });

        setButtonVisible(true)
        setSuccessMessage(
          `Inward gate pass successfully! Inward gate pass : ${processId}, Process Type: ${processType}, Sub Process ID: ${subProcessId}`
        );
        showModal();
        message.success(
          `Inward gate pass successfully! Process ID: ${processId}, Process Type: ${processType}, Sub Process ID: ${subProcessId}`
        );
      } else {
        // Display a generic success message if specific data is not available
        message.error("Failed to Inward gate pass. Please try again later.");
      }

      // Handle success response here
    } catch (error) {
      console.error("Error saving Inward gate pass:", error);
      message.error("Failed to Inward gate pass. Please try again later.");

      // Handle error response here
    }
  };

  const handleValuesChange = (_, allValues) => {
    setType(allValues.type);
  };

  const handleSelectChange = (value) => {
    setSelectedOption(value);
  };

  const removeItem = (index) => {
    setFormData((prevValues) => {
      const updatedItems = prevValues.items;
      updatedItems.splice(index, 1);

      const updatedItems1 = updatedItems.map((item, key) => {
        return { ...item, srNo: key+1 };
      });

      return {
        ...prevValues,
        items: updatedItems1,
      };
    });
  };

  const handleIssueNoteNoChange = async (_, value) => {
    const apiUrl =
        "https://uat-sai-app.azurewebsites.net/sai-inv-mgmt/getSubProcessDtls";
        try{
        const {data} = await axios.post(apiUrl, {
          processId: value,
          processStage: "OGP",
        },  apiHeader("POST", token));

        console.log("RESPONSE ISN: ", data)

        const {responseData, responseStatus} = data
        const {processData, itemList} = responseData

        if(responseStatus.message === "Success" && responseStatus.statusCode === 200){
          setFormData(prev=>{
            return {
              ...prev,
              ...processData,
              items: itemList.map(item=>({...item, noOfDays: item.requiredDays, srNo: item.sNo}))
            }
          })
        }
        
      }catch(error){
        console.log("Error occured while fetching data")
      }
  }

  console.log("FORM DaTA ISN: ", formData)

  const handleRejNoteNoChange = (_, value) => {
    console.log("REJ: ", value)
  }

  return (
    <div className="goods-receive-note-form-container" ref={formRef}>
      <h1>Sports Authority of India - Inward Gate Pass</h1>

      <Form
        onFinish={onFinish}
        className="goods-receive-note-form"
        onValuesChange={handleValuesChange}
        layout="vertical"
        initialValues={{fieldName: formData}}
      >
        <Row>
          <Col span={6} offset={18}>
            <Form.Item label="DATE" name="gatePassDate">
              <DatePicker
                defaultValue={dayjs()}
                format={dateFormat}
                style={{ width: "100%" }}
                name="gatePassDate"
                onChange={(date, dateString) =>
                  handleChange("gatePassDate", dateString)
                }
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="TYPE" name="type">
              <Select onChange={(value) => handleChange("processType", value)}>
                <Option value="IRP">1. Issue/Return</Option>
                <Option value="PO">2. Purchase Order</Option>
                <Option value="IOP">3. Inter-Org Transaction</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={6} offset={12}>
            {/* <Form.Item label="INWARD GATE PASS NO." name="gatePassDate">
              <Input
                disabled
                onChange={(e) => handleChange("gatePassNo", e.target.value)}
              />
            </Form.Item> */}

            <FormInputItem label="INWARD GATE PASS NO." value={formData.gatePassNo ? formData.gatePassNo : ""} readOnly={true}/>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col span={8}>
            <Title strong level={2} underline type="danger">
              {
                Type === "IRP" || Type === "IOP" ?
                "CONSIGNOR DETAIL :-" : "CONSIGNEE DETAIL :-"
              }
            </Title>

            {/* for purchase order */}

            <FormInputItem label="REGIONAL CENTER CODE :" value={Type==="IRP" || Type === "IOP" ? formData.crRegionalCenterCd : formData.ceRegionalCenterCd} readOnly={true}/>
            <FormInputItem label="REGIONAL CENTER NAME :" value={Type==="IRP" || Type === "IOP" ? formData.crRegionalCenterName :formData.ceRegionalCenterName} readOnly={true} />
            <FormInputItem label="ADDRESS :" value={Type==="IRP" || Type === "IOP" ? formData.crAddress : formData.ceAddress} readOnly={true} />
            <FormInputItem label="ZIPCODE :" value={Type==="IRP" || Type === "IOP" ? formData.crZipcode : formData.ceZipcode} readOnly={true} />
          </Col>
          <Col span={8}>
            <Title strong underline level={2} type="danger">
            {
                Type === "IRP" || Type === "IOP" ?
                "CONSIGNEE DETAIL ;-" : "CONSIGNOR DETAIL :-"
              }
            </Title>

            {Type === "PO" && (
              <>
                <FormInputItem label="SUPPLIER CODE :" name="supplierCode" onChange={handleChange} />
                <FormInputItem label="SUPPLIER NAME :" value={formData.supplierName} />
                <FormInputItem label="ADDRESS :" value={formData.crAddress} readOnly={true} />
              </>
            )}

            {Type === "IRP" && (
              <>
                <Form.Item
                  label="CONSUMER NAME :"
                  name="consumerName"
                  initialValue={formData.consumerName}
                >
                  <Input
                    value={formData.consumerName}
                    onChange={(e) =>
                      handleChange("consumerName", e.target.value)
                    }
                  />
                  <div style={{ display: "none" }}>{formData.crZipcode}</div>
                </Form.Item>
                <Form.Item
                  label="CONTACT NO. :"
                  name="contactNo"
                  initialValue={formData.contactNo}
                >
                  <Input
                    value={formData.contactNo}
                    onChange={(e) => handleChange("contactNo", e.target.value)}
                  />
                  <div style={{ display: "none" }}>{formData.crZipcode}</div>
                </Form.Item>
              </>
            )}

            {Type === "IOP" && (
              <>
                {/* <Form.Item
                  label="REGIONAL CENTER CODE"
                  name="ceRegionalCenterCd"
                >
                  <Input
                    onChange={(e) =>
                      handleChange("crRegionalCenterCd", e.target.value)
                    }
                  />
                </Form.Item> */}

                <FormInputItem label="REGIONAL CENTER CODE :" value={formData.ceRegionalCenterCd} readOnly={true}/>
                <FormInputItem label="REGIONAL CENTER NAME :" value={formData.ceRegionalCenterName} readOnly={true} />
                <FormInputItem label="ADDRESS :" value={formData.ceAddress} readOnly={true} />
                <Form.Item label="ZIP CODE :" name="crZipcode">
                  <Input value={1234}
                    onChange={(e) => handleChange("crZipcode", e.target.value)}
                  />
                </Form.Item>
              </>
            )}
          </Col>

          <Col span={8}>
            <Form.Item></Form.Item>
            {Type === "IRP" && (
              <Form.Item label="OUTWARD GATE PASS." name="outwardgatepass">
                <Input
                  onChange={(e) => handleInwardGatePassChange(e.target.value)}
                />
              </Form.Item>
            )}
            {/*Type === 'PO' && (
              <Form.Item label="PURCHASE ORDER NO." name="purchaseorderno">
                <Input />
              </Form.Item>
            )*/}
            {Type === "IOP" && (
              <>
                <Form.Item label="SELECT NOTE TYPE" name="noteType">
                  <Select onChange={handleSelectChange}>
                    <Option value="ISSUE">ISSUE NOTE NO.</Option>
                    <Option value="REJECTION">REJECTION NOTE NO.</Option>
                  </Select>
                </Form.Item>

                {/* <Form.Item
                  label={
                    selectedOption === "ISSUE"
                      ? "ISSUE NOTE NO."
                      : "REJECTION NOTE NO."
                  }
                  name="inwardGatePass"
                >
                  <Input value={1234} />
                </Form.Item> */}

                <FormInputItem label={selectedOption === "ISSUE" ? "ISSUE NOTE NO." : "REJECTION NOTE NO."} name="inwardGatePass" onChange={selectedOption==="ISSUE" ? handleIssueNoteNoChange : handleRejNoteNoChange} />
              </>
            )}
            {(Type === "IOP" || Type === "PO") && (
              <>
                <Form.Item label="NOA NO." name="noaNo">
                  <Input
                    onChange={(e) => handleChange("noaNo", e.target.value)}
                  />
                </Form.Item>
                <Form.Item label="NOA DATE" name="noaDate">
                  <DatePicker
                    format={dateFormat}
                    style={{ width: "100%" }}
                    onChange={(date, dateString) =>
                      handleChange("noaDate", dateString)
                    }
                  />
                </Form.Item>
                <Form.Item label="DATE OF DELIVERY" name="dateOfDelivery">
                  <DatePicker
                    format={dateFormat}
                    style={{ width: "100%" }}
                    onChange={(date, dateString) =>
                      handleChange("dateOfDelivery", dateString)
                    }
                  />
                </Form.Item>
              </>
            )}
          </Col>
        </Row>
        {(Type === "IOP" || Type === "PO") && (
          <Row gutter={24}>
            <Col span={8}>
              <Form.Item label=" CHALLAN / INVOICE NO. :" name="challanNo">
                <Input
                  onChange={(e) => handleChange("challanNo", e.target.value)}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="MODE OF DELIVERY  :" name="modeOfDelivery">
                <Input
                  onChange={(e) =>
                    handleChange("modeOfDelivery", e.target.value)
                  }
                />
              </Form.Item>
            </Col>
          </Row>
        )}

        {/* Item Details */}
        <h2>ITEM DETAILS</h2>

        {
          Type === "PO" &&
          <div style={{ width: "300px" }}>
          <Popover
            onClick={() => setTableOpen(true)}
            content={
              <Table pagination={{pageSize: 3}} dataSource={filteredData} columns={tableColumns} scroll={{ x: "max-content" }} style={{width: "600px", display: tableOpen? "block": "none"}}/>
            }
            title="Filtered Item Data"
            trigger="click"
            // open={true}
            open={searchValue !== "" && filteredData.length > 0}
            style={{ width: "200px" }}
            placement="right"
          >
            <Input.Search
              placeholder="Search Item Data"
              allowClear
              enterButton="Search"
              size="large"
              onSearch={(e)=>handleSearch(e.target?.value || "", data, setFilteredData, setSearchValue )}
              onChange={(e)=>handleSearch(e.target?.value || "", data, setFilteredData, setSearchValue )}
            />
          </Popover>
        </div>
        }

        <Form.List name="items" initialValue={formData.items || [{}]}>
          {(fields, { add, remove }) => (
            <>
              {formData.items?.length > 0 &&
                formData.items.map((item, key) => {
                  return (
                    // <div className="xyz" style={{font:"150px", zIndex: "100"}}>xyz</div>

                    <div
                      key={key}
                      style={{
                        marginBottom: 16,
                        border: "1px solid #d9d9d9",
                        padding: 16,
                        borderRadius: 4,
                        display: "grid",
                        gridTemplateColumns:
                          "repeat(auto-fit, minmax(200px, 1fr))",
                        gap: "20px",
                      }}
                    >
                      <Form.Item label="Serial No.">
                        <Input value={item.srNo ? item.srNo : item.sNo} readOnly />
                      </Form.Item>

                      <Form.Item label="ITEM CODE">
                        <Input value={item.itemCode} readOnly />
                      </Form.Item>

                      <Form.Item label="ITEM DESCRIPTION">
                        <Input value={item.itemDesc} readOnly />
                      </Form.Item>

                      <Form.Item label="UOM">
                        <Input
                          value={item.uomDesc || uomMaster[item.uom]}
                        />
                      </Form.Item>

                      <Form.Item label="LOCATOR DESCRIPITON">
                        <Input
                          value={item.locatorDesc || locatorMaster[item.locatorId]}
                          readOnly
                        />
                      </Form.Item>

                      <Form.Item label="QUANTITY">
                        <Input
                          value={item.quantity}
                          onChange={(e) =>
                            itemHandleChange("quantity", e.target.value, key)
                          }
                        />
                      </Form.Item>
                    
                    {
                      (Type === "IRP" || Type === "IOP") &&
                      <Form.Item label="REQUIRED FOR NO. OF DAYS">
                        <Input
                          value={item.noOfDays}
                          onChange={(e) =>
                            itemHandleChange("noOfDays", e.target.value, key)
                          }
                          />
                      </Form.Item>
                      }

                      <Form.Item label="REMARK">
                        <Input
                          value={item.remarks}
                          onChange={(e) =>
                            itemHandleChange("remarks", e.target.value, key)
                          }
                        />
                      </Form.Item>

                      <Col span={1}>
                        <MinusCircleOutlined
                          onClick={() => removeItem(key)}
                          style={{ marginTop: 8 }}
                        />
                      </Col>
                    </div>
                  );
                })}
            </>
          )}
        </Form.List>

        {/* Condition of Goods */}

        <Row gutter={24}>
          <Col span={12}>
            <Form.Item label="TERMS AND CONDITION :" name="termsCondition">
              <Input.TextArea
                value={formData.termsCondition}
                autoSize={{ minRows: 3, maxRows: 6 }}
                readOnly = {Type === "PO" ? false : true}
                onChange={(e) => handleChange("termsCondition", e.target.value)}
              />
              <Input style={{ display: "none" }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="NOTE" name="note">
              <Input.TextArea
                value={formData.note}
                autoSize={{ minRows: 3, maxRows: 6 }}
                onChange={(e) => handleChange("note", e.target.value)}
              />
              <Input style={{ display: "none" }} />
            </Form.Item>
          </Col>
        </Row>

        {/* Note and Signature */}

        <div
          style={{
            display: "flex",
            width: "100%",
            justifyContent: "space-between",
          }}
        >
          <div>
            <div className="goods-receive-note-signature">GENERATED BY</div>
            <div className="goods-receive-note-signature">
              NAME & DESIGNATION :
              <Form>
                <Input
                  value={formData.genName}
                  name="genName"
                  onChange={(e) => handleChange("genName", e.target.value)}
                />
              </Form>
            </div>
            <div className="goods-receive-note-signature">
              DATE & TIME :
              <DatePicker
                defaultValue={dayjs()}
                format={dateFormat}
                style={{ width: "58%" }}
                name="genDate"
                onChange={(date, dateString) =>
                  handleChange("genDate", dateString)
                }
              />
            </div>
          </div>
          {Type !== "PO" && (
            <div>
              <div className="goods-receive-note-signature">RECEIVED BY</div>
              <div className="goods-receive-note-signature">
                NAME & SIGNATURE :
                <Form>
                  <Input
                    name="issueName"
                    onChange={(e) => handleChange("issueName", e.target.value)}
                  />
                </Form>
              </div>
              <div className="goods-receive-note-signature">
                DATE & TIME :
                <DatePicker
                  defaultValue={dayjs()}
                  format={dateFormat}
                  style={{ width: "58%" }}
                  name="issueDate"
                  onChange={(date, dateString) =>
                    handleChange("issueDate", dateString)
                  }
                />
              </div>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="goods-receive-note-button-container">
          <Form.Item>
            <Button
              type="primary"
              htmlType="save"
              style={{ width: "200px", margin: 16 }}
            >
              SAVE
            </Button>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              style={{
                backgroundColor: "#4CAF50",
                borderColor: "#4CAF50",
                width: "200px",
                margin: 16,
              }}
            >
              SUBMIT
            </Button>
          </Form.Item>
          <Form.Item>
          <Button disabled={!buttonVisible} onClick={()=> printOrSaveAsPDF(formRef)} type="primary" danger style={{ width: '200px', margin: 16, alignContent: 'end' }}>
              PRINT
            </Button>
          </Form.Item>
        </div>
        <Modal
          title="Inward gate pass saved successfully"
          visible={isModalOpen}
          onOk={handleOk}
        >
          {successMessage && <p>{successMessage}</p>}
          {errorMessage && <p>{errorMessage}</p>}
        </Modal>
      </Form>
    </div>
  );
};

export default InwardGatePass;
