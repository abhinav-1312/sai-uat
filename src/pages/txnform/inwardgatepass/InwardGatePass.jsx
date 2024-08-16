// InwardGatePass.js
import React, { useState, useEffect, useRef, useMemo } from "react";
import { Form, Input, Select, Button, message, Modal, Tooltip } from "antd";
import {
  DeleteOutlined,
  UndoOutlined,
  SaveOutlined,
  CloudDownloadOutlined,
  PrinterOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import axios from "axios";
import {
  apiCall,
  apiHeader,
  mergeItemMasterAndOhq,
  removeItem,
} from "../../../utils/Functions";
import FormInputItem from "../../../components/FormInputItem";
import { useDispatch, useSelector } from "react-redux";
import useHandlePrint from "../../../components/useHandlePrint";
import { useLocation, useNavigate } from "react-router-dom";
import FormDatePickerItem from "../../../components/FormDatePickerItem";
import ItemSearch from "../issuenote/ItemSearch";
import { fetchOhq } from "../../../redux/slice/ohqSlice";
import FormBody from "../../../components/FormBody";
import FormHeading from "../../../components/FormHeading";
import ConsumerDetails from "../../../components/ConsumerDetails";
import OtherDetails from "../../../components/OtherDetails";
import RegionalCenterDetails from "../../../components/RegionalCenterDetails";
import FormSelectItem from "../../../components/FormSelectItem";
import SupplierDetails from "../../../components/SupplierDetails";
import Loader from "../../../components/Loader";
import FormSearchItem from "../../../components/FormSearchItem";
import InputDatePickerCombo from "../../../components/InputDatePickerCombo";
const dateFormat = "DD/MM/YYYY";
const { Option } = Select;

const { TextArea, Search } = Input;

const InwardGatePass = () => {
  const formRef = useRef();
  const [form] = Form.useForm();
  const handlePrint = useHandlePrint(formRef);
  const location = useLocation();
  const { igpData, itemList } = location.state
    ? location.state
    : { igpData: null, itemList: null };
  const inwardData = JSON.parse(localStorage.getItem("inwardData"));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [printBtnEnabled, setPrintBtnEnabled] = useState(false);
  const [submitBtnEnabled, setSubmitBtnEnabled] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");

  const { locatorObj: locatorMaster } = useSelector((state) => state.locators);
  const [formData, setFormData] = useState({
    genDate: "",
    genName: "",
    issueDate: "",
    issueName: "",
    approvedDate: "",
    approvedName: "",
    processId: "string",
    type: "IRP",
    processTypeDesc: "Issue/Return ",
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
    processType: "IRP",
  });

  const navigate = useNavigate();

  const saveDraft = () => {
    localStorage.setItem("inwardData", JSON.stringify(formData));
    message.success("IGP data saved as draft successfully.");
  };

  const handleFormReset = () => {
    message.success("IGP data reset successfully.");
    navigate("/trans/inward", { state: { igpData: null, itemList: null } });
    window.location.reload();
    localStorage.removeItem("inwardData");
  };

  const { data: itemData } = useSelector((state) => state.item);
  const { data: ohqData } = useSelector((state) => state.ohq);

  const data = useMemo(
    () => mergeItemMasterAndOhq(itemData, ohqData, "IGP"),
    [itemData, ohqData]
  );

  const updateFormData = (newItem) => {
    setFormData((prevValues) => {
      const updatedItems = [
        ...(prevValues.items || []),
        {
          ...newItem,
          srNo: prevValues.items?.length ? prevValues.items.length + 1 : 1,
        },
      ];
      return { ...prevValues, items: updatedItems };
    });
  };

  const { uomObj } = useSelector((state) => state.uoms);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };
  const { organizationDetails, locationDetails, userDetails, token, userCd } =
    useSelector((state) => state.auth);

  const searchVendor = async (value) => {
    const vendorByIdUrl = "/master/getVendorMasterById";
    try {
      const response = await axios.post(
        vendorByIdUrl,
        { userId: userCd, id: value },
        apiHeader("POST", token)
      );
      const { responseStatus, responseData } = response.data;
      const { message, statusCode } = responseStatus;

      if (
        message === "Success" &&
        statusCode === 200 &&
        responseData !== null
      ) {
        setFormData((prev) => {
          return {
            ...prev,
            supplierName: responseData.vendorName,
            crAddress: responseData.address,
            supplierCode: value,
          };
        });
      }
    } catch (error) {
      console.log("Not getting vendor", error);
    }
  };

  const handleChange = (fieldName, value) => {
    console.log("Fdlname val: ", fieldName, value)
    if (fieldName === "processType") {
      fetchUserDetails(value);
      return;
    }
    if (fieldName === "supplierCode") {
      searchVendor(value);
      return;
    }

    setFormData((prevValues) => ({
      ...prevValues,
      [fieldName]: value === "" ? null : value,
    }));
  };

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

  const dispatch = useDispatch();

  const populateUserDetails = () => {
    setFormData({
      type: "IRP",
      processType: "IRP",
      processTypeDesc: "Issue/Return",
      crRegionalCenterCd: organizationDetails?.id,
      crRegionalCenterName: organizationDetails?.location,
      crAddress: organizationDetails?.locationAddr,
      crZipcode: locationDetails?.zipcode,
      genName: userDetails.firstName + " " + userDetails.lastName,
      userId: userCd,
    });
  };

  useEffect(() => {
    // const awaitDispatchUtil = async () => {
    //   await dispatch(fetchOhq()).unwrap();
    // };

    // awaitDispatchUtil();

    // if (igpData !== null) {
    //   setFormData({
    //     ...igpData,
    //     processTypeDesc:
    //       igpData?.type === "IRP"
    //         ? "Issue / Return"
    //         : igpData?.type === "PO"
    //         ? "Purchase Order"
    //         : "Inter Org Transfer",
    //     items: itemList,
    //   });
    //   return;
    // }

    // if (inwardData) {
    //   setFormData({ ...inwardData });
    //   return;
    // }

    // fetchUserDetails();

    populateUserDetails();
    dispatch(fetchOhq());
  }, []);

  const fetchUserDetails = async (processType = null) => {
    const currentDate = dayjs();
    // Update form data with fetched values
    if (processType === "IRP" || processType === "IOP") {
      setFormData({
        crRegionalCenterCd: organizationDetails.id,
        crRegionalCenterName: organizationDetails.location,
        crAddress: organizationDetails.locationAddr,
        crZipcode: locationDetails.zipcode,
        genName: userDetails.firstName + " " + userDetails.lastName,
        userId: userCd,
        genDate: currentDate.format(dateFormat),
        issueDate: currentDate.format(dateFormat),
        approvedDate: currentDate.format(dateFormat),
        gatePassDate: currentDate.format(dateFormat),
        gatePassNo: "Not defined",
        processType: processType,
        processTypeDesc:
          processType === "IRP" ? "Issue/Return" : "Inter Org Transfer",
        type: processType,
        processId: "string",
      });
    } else {
      setFormData({
        ceRegionalCenterCd: organizationDetails.id,
        ceRegionalCenterName: organizationDetails.location,
        ceAddress: organizationDetails.locationAddr,
        ceZipcode: locationDetails.zipcode,
        genName: userDetails.firstName + " " + userDetails.lastName,
        // noaDate: currentDate.format(dateFormat),
        // dateOfDelivery: currentDate.format(dateFormat),
        userId: userCd,
        genDate: currentDate.format(dateFormat),
        issueDate: currentDate.format(dateFormat),
        approvedDate: currentDate.format(dateFormat),
        gatePassDate: currentDate.format(dateFormat),
        gatePassNo: "Not defined",
        processType: "PO",
        type: "PO",
        processTypeDesc: "Purchase Order",
        processId: "string",
      });
    }
  };

  const handleInwardGatePassChange = async (_, value) => {
    setFormData((prev) => {
      return {
        ...prev,
        inwardGatePass: value,
      };
    });
    try {
      const apiUrl = "/getSubProcessDtls";
      const response = await axios.post(
        apiUrl,
        {
          processId: value,
          processStage: "OGP",
          rejectProcess: true,
        },
        apiHeader("POST", token)
      );
      const responseData = response.data.responseData;
      const { processData, itemList } = responseData;

      if (processData === null) {
        return;
      }
      setFormData((prevFormData) => ({
        ...prevFormData,

        issueName: processData?.issueName,
        approvedName: processData?.approvedName,
        processId: processData?.processId,
        outwardGatePass: value,
        crRegionalCenterCd: processData?.crRegionalCenterCd,
        crRegionalCenterName: processData?.crRegionalCenterName,
        crAddress: processData?.crAddress,
        crZipcode: processData?.crZipcode,
        ceRegionalCenterCd: processData?.ceRegionalCenterCd,
        ceRegionalCenterName: processData?.ceRegionalCenterName,
        ceAddress: processData?.ceAddress,
        ceZipcode: processData?.ceZipcode,
        inwardGatePass: value,

        consumerName: processData?.consumerName,
        contactNo: processData?.contactNo,

        termsCondition: processData?.termsCondition,
        note: processData?.note,
        type: processData?.type,
        processTypeDesc:
          processData?.type === "IRP"
            ? "Issue/Return"
            : processData?.type === "PO"
            ? "Purchase Order"
            : "Inter Org Transfer",

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
    if (formData.processType === "IOP") {
      if (!formData.issueName || !formData.genName) {
        message.error("Please fill all the fields.");
        return;
      }
    } else {
      if (!formData.genName) {
        message.error("Please fill all the fields.");
        return;
      }
    }
    setSubmitBtnEnabled(false);

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
      const aprName =
        formDataCopy.approvedName === "" ? "NA" : formDataCopy.approvedName;

      const apiUrl = "/saveInwardGatePass";
      const response = await axios.post(
        apiUrl,
        { ...formDataCopy, approvedName: aprName },
        apiHeader("POST", token)
      );
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

        setSuccessMessage(
          `Inward gate pass successfully! Inward gate pass : ${processId}, Process Type: ${processType}, Sub Process ID: ${subProcessId}`
        );
        showModal();
        message.success(
          `Inward gate pass successfully! Process ID: ${processId}, Process Type: ${processType}, Sub Process ID: ${subProcessId}`
        );
        setPrintBtnEnabled(true);
      } else {
        // Display a generic success message if specific data is not available
        message.error(
          response.data.responseStatus.errorType ||
            "Failed to inward gate pass. Please try again later."
        );
        setSubmitBtnEnabled(true);
      }
    } catch (error) {
      console.error("Error saving Inward gate pass:", error);
      message.error("Failed to Inward gate pass. Please try again later.");
      setSubmitBtnEnabled(true);
    }
  };

  const handleSelectChange = (value) => {
    setFormData((prev) => {
      return {
        ...prev,
        noteType: value,
      };
    });
  };

  const handleIssueNoteNoChange = async (value) => {
    const apiUrl = "/getSubProcessDtls";
    try {
      const { data } = await axios.post(
        apiUrl,
        {
          processId: value,
          processStage: "OGP",
        },
        apiHeader("POST", token)
      );

      const { responseData, responseStatus } = data;
      const { processData, itemList } = responseData;

      if (
        responseStatus.message === "Success" &&
        responseStatus.statusCode === 200
      ) {
        setFormData((prev) => {
          return {
            ...prev,
            ...processData,
            inwardGatePass: value,
            items: itemList.map((item) => ({
              ...item,
              noOfDays: item.requiredDays,
              srNo: item.sNo,
            })),
          };
        });
      }
    } catch (error) {
      console.log("Error occured while fetching data");
    }
  };

  const processTypeOptions = [
    {
      value: "IRP",
      desc: "Issue/Return",
    },
    {
      value: "PO",
      desc: "Purchase Order",
    },
    {
      value: "IOP",
      desc: "Inter Org Transfer",
    },
  ];

  // if (!locatorMaster || !ohqData || !itemData || !uomObj) {
  //   return <h2> Loading please wait...</h2>;
  // }

  // return (
  //   <>
  //     <div className="a4-container" ref={formRef}>
  //       <div className="heading-container">
  //         <h4>
  //           IGP No. : <br />
  //           {igpData ? formData.processId : formData.gatePassNo}
  //         </h4>
  //         <h2 className="a4-heading">
  //           Sports Authority Of India - Inward Gate Pass
  //         </h2>
  //         <h4>
  //           IGP Date. : <br /> {formData.gatePassDate}
  //         </h4>
  //       </div>

  //       <Form
  //         form={form}
  //         layout="vertical"
  //         style={{
  //           display: "flex",
  //           flexDirection: "column",
  //           gap: "1rem",
  //           margin: "0.5rem 0",
  //         }}
  //         initialValues={formData}
  //       >
  //         <div
  //           style={{
  //             display: "grid",
  //             gridTemplateColumns: "repeat(auto-fit, minmax(10rem, 1fr))",
  //             gap: "1rem",
  //             marginTop: "1rem",
  //           }}
  //         >
  //           <div className="consignor-container">
  //             <h3 className="consignor-consignee-heading">
  //               {formData.type === "IRP" || formData.type === "IOP"
  //                 ? "Consignor Details"
  //                 : "Consignee Details"}
  //             </h3>

  //             <FormInputItem
  //               label="Regional Center Code"
  //               value={
  //                 formData.type === "IRP" || formData.type === "IOP"
  //                   ? formData.crRegionalCenterCd
  //                   : formData.ceRegionalCenterCd
  //               }
  //               readOnly={true}
  //             />
  //             <FormInputItem
  //               label="Regional Center Name"
  //               value={
  //                 formData.type === "IRP" || formData.type === "IOP"
  //                   ? formData.crRegionalCenterName
  //                   : formData.ceRegionalCenterName
  //               }
  //               readOnly={true}
  //             />
  //             <FormInputItem
  //               label="Address"
  //               value={
  //                 formData.type === "IRP" || formData.type === "IOP"
  //                   ? formData.crAddress
  //                   : formData.ceAddress
  //               }
  //               readOnly={true}
  //             />
  //             <FormInputItem
  //               label="Zipcode"
  //               value={
  //                 formData.type === "IRP" || formData.type === "IOP"
  //                   ? formData.crZipcode
  //                   : formData.ceZipcode
  //               }
  //               readOnly={true}
  //             />
  //           </div>

  //           <div className="consignor-container">
  //             <h3 className="consignor-consignee-heading">
  //               {formData.type === "IRP" || formData.type === "IOP"
  //                 ? "Consignee Details"
  //                 : "Consignor Details"}
  //             </h3>

  //             {formData.type === "PO" && (
  //               <>
  //                 <FormInputItem
  //                   label="Supplier Code"
  //                   name="supplierCode"
  //                   value={formData.supplierCode}
  //                   onChange={handleChange}
  //                 />
  //                 <FormInputItem
  //                   label="Supplier Name"
  //                   value={formData.supplierName}
  //                   readOnly={true}
  //                 />
  //                 <FormInputItem
  //                   label="Address"
  //                   value={formData.crAddress}
  //                   readOnly={true}
  //                 />
  //               </>
  //             )}

  //             {formData.type === "IRP" && (
  //               <>
  //                 <FormInputItem
  //                   label="Consumer Name"
  //                   name="consumerName"
  //                   value={formData.consumerName}
  //                   readOnly={true}
  //                 />
  //                 <FormInputItem
  //                   label="Contact No."
  //                   name="contactNo"
  //                   value={formData.contactNo}
  //                   readOnly={true}
  //                 />
  //               </>
  //             )}

  //             {formData.type === "IOP" && (
  //               <>
  //                 <FormInputItem
  //                   label="Regional Center Code"
  //                   name="ceRegionalCenterCd"
  //                   value={formData.ceRegionalCenterCd}
  //                   readOnly={true}
  //                 />
  //                 <FormInputItem
  //                   label="Regional Center Name"
  //                   name="ceRegionalCenterName"
  //                   value={formData.ceRegionalCenterName}
  //                   readOnly={true}
  //                 />
  //                 <FormInputItem
  //                   label="Address"
  //                   name="ceAddress"
  //                   value={formData.ceAddress}
  //                   readOnly={true}
  //                 />
  //                 <FormInputItem
  //                   label="Pincode"
  //                   name="ceZipcode"
  //                   value={formData.ceZipcode}
  //                   readOnly={true}
  //                 />
  //               </>
  //             )}
  //           </div>

  //           <div className="other-container">
  //             <h3 className="consignor-consignee-heading">Other Details</h3>

  //             <Form.Item label="Type" name="processTypeDesc">
  //               <Select
  //                 onChange={(value) => handleChange("processType", value)}
  //                 value={formData.type}
  //               >
  //                 <Option value="IRP">Issue/Return</Option>
  //                 <Option value="PO">Purchase Order</Option>
  //                 <Option value="IOP">Inter-Org Transaction</Option>
  //               </Select>
  //             </Form.Item>

  //             {formData.type === "IRP" && (
  //               <FormInputItem
  //                 label="Outward Gate Pass No."
  //                 name="outwardGatePass"
  //                 value={formData.outwardGatePass}
  //                 onChange={handleInwardGatePassChange}
  //               />
  //             )}

  //             {formData.type === "IOP" && (
  //               <>
  //                 <Form.Item label="Select Note Type" name="noteType">
  //                   <Select onChange={handleSelectChange}>
  //                     <Option value="Issue Note No.">Issue Note No.</Option>
  //                     <Option value="Rejection Note No.">
  //                       Rejection Note No.
  //                     </Option>
  //                   </Select>
  //                 </Form.Item>

  //                 <Search
  //                 name="inwardGatePass"
  //                 label={formData.noteType}
  //                 onSearch={handleIssueNoteNoChange}
  //                 enterButton
  //                 value={formData.inwardGatePass}
  //                 onChange={(e)=> handleChange(e.target.name, e.target.value)}
  //                 />

  //                 {/* <FormInputItem
  //                   label={formData.noteType}
  //                   name="inwardGatePass"
  //                   onChange={
  //                     formData.noteType === "Issue Note No."
  //                       ? handleIssueNoteNoChange
  //                       : handleInwardGatePassChange
  //                   }
  //                   value={formData.inwardGatePass}
  //                 /> */}
  //               </>
  //             )}

  //             {formData.type === "PO" && (
  //               <>
  //                 <FormInputItem
  //                   label="Challan / Invoice No."
  //                   name="challanNo"
  //                   value={formData.challanNo}
  //                   onChange={handleChange}
  //                 />
  //                 <div className="other-details-2cols">
  //                   <FormInputItem
  //                     label="Noa No."
  //                     name="noaNo"
  //                     value={formData.noaNo}
  //                     onChange={handleChange}
  //                   />
  //                   <FormDatePickerItem
  //                     label="Noa Date"
  //                     name="noaDate"
  //                     value={formData.noaDate}
  //                     onChange={handleChange}
  //                   />
  //                 </div>
  //                 <div className="other-details-2cols">
  //                   <FormInputItem
  //                     label="Delivery Mode"
  //                     name="modeOfDelivery"
  //                     value={formData.modeOfDelivery}
  //                     onChange={handleChange}
  //                   />
  //                   <FormDatePickerItem
  //                     label="Date of Delivery"
  //                     name="dateOfDelivery"
  //                     value={formData.dateOfDelivery}
  //                     onChange={handleChange}
  //                   />
  //                 </div>
  //               </>
  //             )}
  //           </div>
  //         </div>

  //         <div className="item-details-container">
  //           <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
  //             <h3>Item Details</h3>
  //             {formData.type === "PO" && (
  //               <ItemSearch itemArray={data} updateFormData={updateFormData} />
  //             )}
  //           </div>

  //           {formData?.items?.length > 0 &&
  //             formData.items.map((item, key) => {
  //               return (
  //                 <div className="each-item-detail-container">
  //                   <div className="each-item-detail-container-grid">
  //                     <FormInputItem
  //                       label="S. No."
  //                       value={item.srNo || item?.sNo}
  //                       readOnly={true}
  //                     />
  //                     <FormInputItem
  //                       label="Item Code"
  //                       value={item.itemCode}
  //                       readOnly={true}
  //                     />
  //                     <FormInputItem
  //                       label="Item Description"
  //                       className="item-desc-cell"
  //                       value={item.itemDesc}
  //                       readOnly={true}
  //                     />
  //                     <FormInputItem
  //                       label="Unit of Measurement"
  //                       value={
  //                         item.uomDesc ||
  //                         (uomObj && uomObj[parseInt(item?.uom)])
  //                       }
  //                       readOnly={true}
  //                     />

  //                     {formData.type !== "IOP" && (
  //                       <FormInputItem
  //                         label="Locator Description"
  //                         value={
  //                           item.locatorDesc || locatorMaster[item.locatorId]
  //                         }
  //                         readOnly={true}
  //                       />
  //                     )}

  //                     <FormInputItem
  //                       name="quantity"
  //                       label="Quantity"
  //                       value={item.quantity}
  //                       onChange={(fieldName, value) =>
  //                         itemHandleChange(fieldName, value, key)
  //                       }
  //                     />

  //                     {(formData.type === "IRP" || formData.type === "IOP") && (
  //                       <FormInputItem
  //                         name="noOfDays"
  //                         label="Req. For No. Of Days"
  //                         value={item.noOfDays || item.requiredDays}
  //                         onChange={(fieldName, value) =>
  //                           itemHandleChange(fieldName, value, key)
  //                         }
  //                         readOnly={true}
  //                       />
  //                     )}

  //                     <FormInputItem
  //                       name="remarks"
  //                       label="Remarks"
  //                       value={item.remarks}
  //                       onChange={(fieldName, value) =>
  //                         itemHandleChange(fieldName, value, key)
  //                       }
  //                     />
  //                   </div>
  //                   <Button
  //                     icon={<DeleteOutlined />}
  //                     className="delete-button"
  //                     onClick={() => removeItem(key, setFormData)}
  //                     disabled={igpData !== null}
  //                   />
  //                 </div>
  //               );
  //             })}
  //         </div>
  //         <div className="terms-condition-container">
  //           <div>
  //             <h3>Terms And Conditions</h3>
  //             <TextArea
  //               autoSize={{ minRows: 4, maxRows: 16 }}
  //               value={formData.termsCondition}
  //               onChange={(e) => handleChange("termsCondition", e.target.value)}
  //               readOnly={igpData !== null}
  //             />
  //           </div>
  //           <div>
  //             <h3>Note</h3>
  //             <TextArea
  //               autoSize={{ minRows: 4, maxRows: 16 }}
  //               value={formData.note}
  //               onChange={(e) => handleChange("note", e.target.value)}
  //               readOnly={igpData !== null}
  //             />
  //           </div>
  //         </div>

  //         <div className="designations-container">
  //           <div className="each-desg">
  //             <h4> Generated By </h4>
  //             <FormInputItem
  //               placeholder="Name and Designation"
  //               name="genName"
  //               value={formData.genName}
  //               readOnly={igpData !== null}
  //             />
  //             {igpData !== null ? (
  //               <FormInputItem
  //                 value={formData.genDate}
  //                 readOnly={igpData !== null}
  //               />
  //             ) : (
  //               <FormDatePickerItem
  //                 defaultValue={dayjs()}
  //                 name="genDate"
  //                 onChange={handleChange}
  //                 value={formData.genDate}
  //                 readOnly={igpData !== null}
  //               />
  //             )}
  //           </div>

  //           {formData.type !== "PO" && (
  //             <div className="each-desg">
  //               <h4>
  //                 {formData.type === "PO" ? "Received By" : "Verified By"}{" "}
  //               </h4>
  //               <FormInputItem
  //                 placeholder="Name and Signature"
  //                 name="issueName"
  //                 value={formData.issueName}
  //                 onChange={handleChange}
  //                 readOnly={igpData !== null}
  //               />

  //               {igpData !== null ? (
  //                 <FormInputItem
  //                   value={formData.issueDate}
  //                   readOnly={igpData !== null}
  //                 />
  //               ) : (
  //                 <FormDatePickerItem
  //                   defaultValue={dayjs()}
  //                   name="issueDate"
  //                   onChange={handleChange}
  //                   value={formData.issueDate}
  //                   // readOnly={ogpData !== null}
  //                 />
  //               )}
  //             </div>
  //           )}
  //         </div>
  //         <div className="button-container">
  //           <Tooltip title="Clear form">
  //             <Button
  //               type="primary"
  //               danger
  //               icon={<UndoOutlined />}
  //               onClick={handleFormReset}
  //             >
  //               Reset
  //             </Button>
  //           </Tooltip>

  //           <Tooltip
  //             title={
  //               submitBtnEnabled
  //                 ? "Submit form"
  //                 : "Press reset button to enable submit."
  //             }
  //           >
  //             <Button
  //               onClick={onFinish}
  //               type="primary"
  //               style={{
  //                 backgroundColor: "#4CAF50",
  //               }}
  //               icon={<SaveOutlined />}
  //               disabled={igpData ? true : !submitBtnEnabled}
  //               // disabled={true}
  //             >
  //               Submit
  //             </Button>
  //           </Tooltip>

  //           <Tooltip title={"Save the form as draft."}>
  //             <Button
  //               onClick={saveDraft}
  //               type="primary"
  //               style={{
  //                 backgroundColor: "#eed202",
  //               }}
  //               icon={<CloudDownloadOutlined />}
  //               // disabled={ogpData !== null}
  //             >
  //               Save draft
  //             </Button>
  //           </Tooltip>

  //           <Tooltip
  //             title={
  //               printBtnEnabled
  //                 ? "Print form"
  //                 : "Submit the form to enable print."
  //             }
  //           >
  //             <Button
  //               onClick={handlePrint}
  //               type="primary"
  //               icon={<PrinterOutlined />}
  //               disabled={igpData ? false : !printBtnEnabled}
  //             >
  //               Print
  //             </Button>
  //           </Tooltip>
  //         </div>
  //       </Form>
  //     </div>
  //     <Modal
  //       title="Issue note saved successfully."
  //       open={isModalOpen}
  //       onOk={handleOk}
  //     >
  //       {successMessage && <p>{successMessage}</p>}
  //     </Modal>
  //   </>
  // );

  const noteTypeOptions = [
    {
      value: 'Issue Note No.',
      desc: 'Issue Note No.'
    },
    {
      value: 'Rejection Note No.',
      desc: 'Rejection Note No.'
    }
  ]

  const handleIsnSearch = async (value, rejectProcess=null) => {
    console.log('Value reject process: ', value, rejectProcess)
    const payloadObj = {
      processId: value,
      processStage: "OGP",
      rejectProcess: rejectProcess ? true : false
    };

    // const data = await apiCall("POST", "/getSubProcessDtls", token, payloadObj);
    // const { responseStatus, responseData } = data;
    // console.log("data: ", data);
    // const { processData, itemList } = responseData;
    // if (data && responseStatus && responseStatus.message === "Success") {
    //   setFormData((prevFormData) => ({
    //     ...prevFormData,

    //     issueName: processData?.issueName,
    //     approvedName: processData?.approvedName,
    //     processId: processData?.processId,
    //     outwardGatePass: value,
    //     crRegionalCenterCd: processData?.crRegionalCenterCd,
    //     crRegionalCenterName: processData?.crRegionalCenterName,
    //     crAddress: processData?.crAddress,
    //     crZipcode: processData?.crZipcode,
    //     ceRegionalCenterCd: processData?.ceRegionalCenterCd,
    //     ceRegionalCenterName: processData?.ceRegionalCenterName,
    //     ceAddress: processData?.ceAddress,
    //     ceZipcode: processData?.ceZipcode,
    //     inwardGatePass: value,

    //     consumerName: processData?.consumerName,
    //     contactNo: processData?.contactNo,

    //     termsCondition: processData?.termsCondition,
    //     note: processData?.note,
    //     type: processData?.type,
    //     processTypeDesc:
    //       processData?.type === "IRP"
    //         ? "Issue/Return"
    //         : processData?.type === "PO"
    //         ? "Purchase Order"
    //         : "Inter Org Transfer",

    //     items: itemList.map((item) => ({
    //       srNo: item?.sNo,
    //       itemId: item?.itemId,
    //       itemCode: item?.itemCode,
    //       itemDesc: item?.itemDesc,
    //       uom: parseInt(item?.uom),
    //       quantity: item?.quantity,
    //       noOfDays: item?.requiredDays,
    //       remarks: item?.remarks,
    //       conditionOfGoods: item?.conditionOfGoods,
    //       budgetHeadProcurement: item?.budgetHeadProcurement,
    //       locatorId: parseInt(item?.locatorId),
    //     })),
    //   }));
    // } else {
    //   message.error(responseStatus.errorType);
    // }
  };

  if (!itemData || !ohqData) return <Loader />;

  return (
    <div className="a4-container">
      <FormHeading
        formTitle="Inward Gate Pass"
        txnType="IGP"
        date={formData.gatePassDate}
        txnNo={formData.gatePassNo}
      />
      <FormBody formData={formData}>
        <RegionalCenterDetails
          heading={
            formData.type === "IRP" || formData.type === "IOP"
              ? "Consignor Details"
              : "Consignee Details"
          }
          regionalCenterCd={
            formData.type === "IRP" || formData.type === "IOP"
              ? formData.crRegionalCenterCd
              : formData.ceRegionalCenterCd
          }
          regionalCenterName={
            formData.type === "IRP" || formData.type === "IOP"
              ? formData.crRegionalCenterName
              : formData.ceRegionalCenterName
          }
          address={
            formData.type === "IRP" || formData.type === "IOP"
              ? formData.crAddress
              : formData.ceAddress
          }
          zipcode={
            formData.type === "IRP" || formData.type === "IOP"
              ? formData.crZipcode
              : formData.ceZipcode
          }
        />

        {formData.type === "PO" && (
          <SupplierDetails
            heading="ConsignorDetails"
            supplierCode={formData.supplierCode}
            supplierName={formData.supplierName}
            address={formData.crAddress}
            onChange={handleChange}
          />
        )}

        {formData.type === "IRP" && (
          <ConsumerDetails
            heading="Consignee Details"
            consumerName={formData.consumerName}
            contactNo={formData.contactNo}
          />
        )}

        {formData.type === "IOP" && (
          <RegionalCenterDetails
            heading="Consignee Details"
            regionalCenterCd={formData.ceRegionalCenterCd}
            regionalCenterName={formData.ceRegionalCenterName}
            address={formData.ceAddress}
            zipcode={formData.ceZipcode}
          />
        )}

        <OtherDetails>
          <FormSelectItem
            label="Type"
            value={formData.processTypeDesc}
            name="processTypeDesc"
            optionArray={[...processTypeOptions]}
            formField="processType"
            onChange={handleChange}
          />

          {formData.type === "IRP" && (
            <FormSearchItem
              label="Outward Gate Pass No."
              onSearch={handleIsnSearch}
              value={formData.outwardGatePass}
              onChange={handleChange}
            />
          )}

          {formData.type === "PO" && (
            <>
              <FormInputItem
                label="Challan / Invoice No."
                name="challanNo"
                value={formData.challanNo}
                onChange={handleChange}
              />

              <InputDatePickerCombo
                inputLabel="NOA No."
                inputName="noaNo"
                inputValue={formData.noaNo}
                onChange={handleChange}
                dateLabel="NOA Date"
                dateName="noaDate"
                dateValue={formData.noaDate}
              />
              <InputDatePickerCombo
                inputLabel="Delivery Mode"
                inputName="modeOfDelivery"
                inputValue={formData.modeOfDelivery}
                onChange={handleChange}
                dateLabel="Delivery Date"
                dateName="dateOfDelivery"
                dateValue={formData.dateOfDelivery}
              />
            </>
          )}

          {
            formData.type === 'IOP' && (
              <>
                <FormSelectItem label='Select Note Type' name='noteType' onChange={handleChange} optionArray={noteTypeOptions} formField='noteType' />
                <FormSearchItem label={formData.noteType} name='inwardGatePass' value={formData.inwardGatePass} onChange={handleChange} onSearch={formData.noteType === "Issue Note No." ? handleIsnSearch : (value) => handleIsnSearch(value, true) } />
              </>
            )
          }
        </OtherDetails>
      </FormBody>
    </div>
  );
};

export default InwardGatePass;
