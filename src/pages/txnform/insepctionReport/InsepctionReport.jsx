// InsepctionReport.js
import React, { useState, useEffect, useRef } from "react";
import { Modal, message } from "antd";
import dayjs from "dayjs";
import axios from "axios";
import { apiHeader, itemHandleChange } from "../../../utils/Functions";
import FormInputItem from "../../../components/FormInputItem";
import { useSelector } from "react-redux";
import Loader from "../../../components/Loader";
import useHandlePrint from "../../../components/useHandlePrint";
import FormContainer from "../../../components/FormContainer";
import FormHeading from "../../../components/FormHeading";
import FormBody from "../../../components/FormBody";
import CrCeDtlContainer from "../../../components/CrCeDtlContainer";
import RegionalCenterDetails from "../../../components/RegionalCenterDetails";
import SupplierDetails from "../../../components/SupplierDetails";
import OtherDetails from "../../../components/OtherDetails";
import FormSearchItem from "../../../components/FormSearchItem";
import InputDatePickerCombo from "../../../components/InputDatePickerCombo";
import ItemDetailsContainer from "../../../components/ItemDetailsContainer";
import TermsConditionContainer from "../../../components/TermsConditionContainer";
import DesignationContainer from "../../../components/DesignationContainer";
import ButtonContainer from "../../../components/ButtonContainer";
import { useLocation } from "react-router-dom";

const dateFormat = "DD/MM/YYYY";
const currentDate = dayjs();

const InsepctionReport = () => {
  const location = useLocation();

  const formRef = useRef();
  const formBodyRef = useRef();
  const handlePrint = useHandlePrint(formRef);

  const { uomObj } = useSelector((state) => state.uoms);
  const { organizationDetails, locationDetails, userDetails, token } =
    useSelector((state) => state.auth);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const [printBtnEnabled, setPrintBtnEnabled] = useState(false);
  const [submitBtnEnabled, setSubmitBtnEnabled] = useState(true);
  const [draftBtnEnabled, setDraftBtnEnabled] = useState(true);
  const [isTxnData, setIsTxnData] = useState(false);

  const [formData, setFormData] = useState({
    ceRegionalCenterCd: organizationDetails.id,
    ceRegionalCenterName: organizationDetails.organizationName,
    ceAddress: organizationDetails.locationAddr,
    ceZipcode: locationDetails.zipcode,
    genName: userDetails.firstName + " " + userDetails.lastName,
    userId: "string",
    genDate: currentDate.format(dateFormat),
    issueDate: currentDate.format(dateFormat),
    approvedDate: currentDate.format(dateFormat),
    inspectionRptDate: currentDate.format(dateFormat),
    inspectionRptNo: "string",
    dateOfInspectionDate: currentDate.format(dateFormat),
    issueName: "",
    approvedName: "",
    processId: 0,
    type: "PO",
    processType: "PO",
    processTypeDesc: "Purchase Order",
    typeOfInspection: "",
    invoiceNo: "",
    inwardGatePass: "",
    crRegionalCenterCd: "",
    crRegionalCenterName: "",
    crAddress: "",
    crZipcode: "",
    consumerName: "",
    supplierName: "",
    supplierCd: "",
    address: "",
    contactNo: "",
    dateOfDeliveryDate: "",
    note: "",
    conditionOfGoods: "",
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
  });

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleChange = (fieldName, value) => {
    setFormData((prevValues) => ({
      ...prevValues,
      [fieldName]: value === "" ? null : value,
    }));
  };

  const handleIgpDataSearch = async (value) => {
    try {
      const apiUrl = "/getSubProcessDtls";
      const response = await axios.post(
        apiUrl,
        {
          processId: value,
          processStage: "IGP",
        },
        apiHeader("POST", token)
      );
      const responseData = response?.data?.responseData || {};
      const { processData, itemList } = responseData;
      setFormData((prevFormData) => ({
        ...prevFormData,

        issueName: processData?.issueName,
        processId: processData?.processId,
        inwardGatePass: processData?.processId,

        crRegionalCenterCd: processData?.crRegionalCenterCd,
        crRegionalCenterName: processData?.crRegionalCenterName,
        crAddress: processData?.crAddress,
        crZipcode: processData?.crZipcode,

        consumerName: processData?.consumerName,
        contactNo: processData?.contactNo,

        supplierCd: processData?.supplierCode,
        supplierName: processData?.supplierName,
        address: processData?.crAddress,

        modeOfDelivery: processData?.modeOfDelivery,
        invoiceNo: processData?.challanNo,
        dateOfDeliveryDate: processData?.dateOfDelivery,
        note: processData?.note,
        termsCondition: processData?.termsCondition,

        items: itemList?.map((item) => ({
          srNo: item?.sNo,
          itemCode: item?.itemCode,
          itemDesc: item?.itemDesc,
          uom: parseInt(item?.uom),
          uomDesc: uomObj[parseInt(item?.uom)],
          quantity: item?.quantity,
          noOfDays: item?.requiredDays,
          remarks: item?.remarks,
          conditionOfGoods: item?.conditionOfGoods,
          budgetHeadProcurement: item?.budgetHeadProcurement,
          locatorId: item?.locatorId,
          locatorDesc: uomObj[parseInt(item?.locatorId)],
        })),
      }));
      // Handle response data as needed
    } catch (error) {
      console.error("Error fetching sub process details:", error);
      // Handle error
    }
  };

  const onFinish = async (values) => {
    if (formData.processType === "PO" || formData.type === "PO") {
      if (!formData.genName || !formData.approvedName) {
        message.error("Please fill all the fields.");
        return;
      }
    } else {
      if (!formData.issueName || !formData.genName) {
        message.error("Please fill all the fields.");
        return;
      }
    }
    try {
      const formDataCopy = { ...formData };

      const allFields = [
        "genDate",
        "genName",
        "issueDate",
        "issueName",
        "approvedDate",
        "approvedName",
        "processId",
        "type",
        "typeOfInspection",
        "inspectionRptNo",
        "inspectionRptDate",
        "invoiceNo",
        "inwardGatePass",
        "ceRegionalCenterCd",
        "ceRegionalCenterName",
        "ceAddress",
        "ceZipcode",
        "crRegionalCenterCd",
        "crRegionalCenterName",
        "crAddress",
        "crZipcode",
        "consumerName",
        "supplierName",
        "supplierCd",
        "address",
        "contactNo",
        "dateOfDeliveryDate",
        "dateOfInspectionDate",
        "note",
        "conditionOfGoods",
        "userId",
      ];

      allFields.forEach((field) => {
        if (!(field in formDataCopy)) {
          formDataCopy[field] = "";
        }
      });

      const apiUrl = "/saveInspectionReport";
      const response = await axios.post(
        apiUrl,
        formDataCopy,
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
        setFormData((prev) => {
          return {
            ...prev,
            inspectionRptNo: processId,
          };
        });
        setSuccessMessage(
          `MIS : ${processId}, Process Type: ${processType}, Sub Process ID: ${subProcessId}`
        );
        setIsModalOpen(true);
        setPrintBtnEnabled(true);
        setIsModalOpen(true);
        setDraftBtnEnabled(false);
        localStorage.removeItem("inspDraft");
      } else {
        // Display a generic success message if specific data is not available
        message.error(
          response.data.responseStatus.errorType ||
            "Failed to submit MIS . Please try again later."
        );
        setPrintBtnEnabled(true);
      }
    } catch (error) {
      setSubmitBtnEnabled(true);
      message.error("Failed to submit MIS . Please try again later.");

      // Handle error response here
    }
  };

  useEffect(() => {
    if (formBodyRef.current) formBodyRef.current.updateField(formData);
  }, [formData]);

  // when form is loaded and a form is saved as draft
  useEffect(() => {
    const formData = localStorage.getItem("misDraft");
    if (formData) {
      setFormData(JSON.parse(formData));
      message.success("Form data loaded from draft.");
    }
  }, []);

  // when form is loaded and it is redirect by pressing print option on txn summary
  useEffect(() => {
    const txnData = location.state;

    if (txnData && txnData.data && txnData.itemList) {
      setFormData({
        ...txnData?.data,
        inspectionRptNo: txnData?.data?.processId,
        inspectionRptDate: txnData?.data?.inspectionRptDt,
        inwardGatepass: txnData?.data?.processId,
        processType: txnData?.data?.type,
        dateOfDeliveryDate: txnData?.data?.dateOfDelivery,
        invoiceNo: txnData?.data?.challanNo,
        processTypeDesc:
          txnData?.data?.type === "IRP"
            ? "Issue Return Process"
            : txnData?.data?.type === "NIRP"
            ? "Non Returnable"
            : txnData?.data?.type === "PO"
            ? "Purchase Order"
            : "Inter Org Transfer",
        items: txnData?.itemList,
      });

      setDraftBtnEnabled(false);
      setSubmitBtnEnabled(false);
      setPrintBtnEnabled(true);
      setIsTxnData(true);
    }
  }, [location.state]);

  if (!uomObj) {
    return <Loader />;
  }

  return (
    <FormContainer ref={formRef}>
      <FormHeading
        formTitle="Material Inward Slip"
        txnType="MIS"
        date={formData.inspectionRptDate}
        txnNo={
          formData.inspectionRptNo === "string" ? "" : formData.inspectionRptNo
        }
      />
      <FormBody formData={formData} ref={formBodyRef} onFinish={onFinish}>
        <CrCeDtlContainer>
          <RegionalCenterDetails
            heading="Consignee Details"
            cdName="ceRegionalCenterCd"
            rcName="ceRegionalCenterName"
            adrName="ceAddress"
            zipName="ceZipcode"
            readOnly
          />

          {formData.processType === "PO" && (
            <SupplierDetails supplierCodeName="supplierCd" readOnly />
          )}

          {formData.processType === "IOP" && (
            <RegionalCenterDetails
              heading="Consignor Details"
              cdName="crRegionalCenterCd"
              rcName="crRegionalCenterName"
              adrName="crAddress"
              zipName="crZipcode"
              readOnly
            />
          )}
          <OtherDetails>
            <FormSearchItem
              label="Inward Gate Pass No."
              name="inwardGatepass"
              onSearch={handleIgpDataSearch}
              onChange={handleChange}
              readOnly={isTxnData}
            />

            <FormInputItem
              label="Challan / Invoice No."
              name="invoiceNo"
              readonly
            />
            <InputDatePickerCombo
              inputLabel="Delivery Mode"
              inputName="modeOfDelivery"
              onChange={handleChange}
              dateValue={formData.dateOfDeliveryDate}
              dateLabel="Delivery Date"
              dateName="dateOfDeliveryDate"
              readOnly
            />
          </OtherDetails>
        </CrCeDtlContainer>
        <ItemDetailsContainer>
          {formData?.items?.map((item, key) => {
            return (
              <div className="each-item-detail-container">
                <div className="each-item-detail-container-grid">
                  <FormInputItem
                    label="S. No."
                    name={
                      item.srNo ? ["items", key, "srNo"] : ["items", key, "sNo"]
                    }
                    readOnly={true}
                  />
                  <FormInputItem
                    label="Item Code"
                    name={["items", key, "itemCode"]}
                    readOnly={true}
                  />
                  <FormInputItem
                    label="Item Description"
                    className="item-desc-cell"
                    name={["items", key, "itemDesc"]}
                    readOnly={true}
                  />
                  <FormInputItem
                    label="Unit of Measurement"
                    name={["items", key, "uomDesc"]}
                    readOnly={true}
                  />

                  <FormInputItem
                    label="Received Quantity"
                    name={["items", key, "quantity"]}
                    readOnly
                  />
                  <FormInputItem
                    label="Budget Head Procurement"
                    name={["items", key, "budgetHeadProcurement"]}
                    onChange={(fieldName, value) =>
                      itemHandleChange(fieldName, value, key, setFormData)
                    }
                    readOnly={isTxnData}
                  />

                  <FormInputItem
                    name={["items", key, "remarks"]}
                    label="Remarks"
                    onChange={(fieldName, value) =>
                      itemHandleChange(fieldName, value, key, setFormData)
                    }
                    readOnly={isTxnData}
                  />
                </div>
              </div>
            );
          })}
        </ItemDetailsContainer>
        <TermsConditionContainer
          handleChange={handleChange}
          conditionOfGoodsVisible
          noteVisible
          readOnly={isTxnData}
        />
        <DesignationContainer
          handleChange={handleChange}
          genByVisible
          approvedVisible
          genDateValue={formData.genDate} 
          approvedDateValue={formData.approvedDate}
          readOnly={isTxnData}
        />
        <ButtonContainer
          handlePrint={handlePrint}
          onFinish={onFinish}
          submitBtnEnabled={submitBtnEnabled}
          printBtnEnabled={printBtnEnabled}
          draftDataName="misDraft"
          formData={formData}
          draftBtnEnabled={draftBtnEnabled}
          disabled={isTxnData}
        />
      </FormBody>
      <Modal
        title="Insoection Note saved successfully."
        open={isModalOpen}
        onOk={handleOk}
      >
        {successMessage && <p>{successMessage}</p>}
      </Modal>
    </FormContainer>
  );
};

export default InsepctionReport;

//     <div className="goods-receive-note-form-container" ref={formRef}>
//       {Type === "PO" && (
//         <h1>Sports Authority of India - Material Inward Slip</h1>
//       )}
//       {Type !== "PO" && <h1>Sports Authority of India - Inspection Report</h1>}
//       <Form
//         onFinish={onFinish}
//         className="goods-receive-note-form"
//         onValuesChange={handleValuesChange}
//         layout="vertical"
//         initialValues={formData || [{}]}
//       >

//         <Row>
//           <Col span={6} offset={18}>
//             <FormInputItem label="DATE :" value={formData.inspectionRptDate} />
//           </Col>
//           <Col span={6}>
//             <FormDropdownItem label="TYPE" name="type" onChange={handleChange} dropdownArray={typeArray} valueField="valueField" visibleField="visibleField" />
//           </Col>
//           <Col span={6} offset={12}>
//             <FormInputItem label={Type !== "PO" ? "INSEPCTION REPORT NO." : "MIS NO"}  value={formData.inspectionRptNo !== "string" ? formData.inspectionRptNo : "not defined"} readOnly={true} />
//           </Col>
//         </Row>

//         <Row gutter={24}>
//           <Col span={8}>
//             <Title strong level={2} underline type="danger">
//               CONSIGNEE DETAIL :-
//             </Title>

//             <FormInputItem label = "REGIONAL CENTER CODE :" value={formData.ceRegionalCenterCd} readOnly={true} />
//             <FormInputItem label = "REGIONAL CENTER NAME :" value={formData.ceRegionalCenterName} readOnly={true} />
//             <FormInputItem label = "ADDRESS :" value={formData.ceAddress} readOnly={true} />
//             <FormInputItem label = "ZIP CODE :" value={formData.ceZipcode} readOnly={true} />

//           </Col>
//           <Col span={8}>
//             <Title strong underline level={2} type="danger">
//               CONSIGNOR DETAIL :-
//             </Title>

//             {Type === "PO" && (
//               <>
//                 <FormInputItem label="SUPPLIER CODE :" value={formData.supplierCd} />
//                 <FormInputItem label="SUPPLIER NAME :" value={formData.supplierName} />
//                 <FormInputItem label="ADDRESS :" value={formData.crAddress || "Not defined"} />
//               </>
//             )}

//             {Type === "IOP" && (
//               <>
//                 <FormInputItem label="REGIONAL CENTER CODE :" value={formData.crRegionalCenterCd} readOnly={true} />
//                 <FormInputItem label="REGIONAL CENTER NAME :" value={formData.crRegionalCenterName} readOnly={true} />
//                 <FormInputItem label="ADDRESS :" value={formData.crAddress || "Not defined"} readOnly={true} />
//                 <FormInputItem label="ZIP CODE :" value={formData.crZipcode || "Not defined"} readOnly={true} />
//               </>
//             )}
//           </Col>
//           <Col span={8}>
//             <Form.Item></Form.Item>

//             <FormInputItem label="INWARD GATE PASS No. :" name="inwardGatePass" onChange={handleInwardGatePassChange} />
//             <FormInputItem label = "CHALLAN / INVOICE NO. :" value={formData.challanNo} readOnly={true} />
//             <FormInputItem label = "MODE OF DELIVERY :" value={formData.modeOfDelivery} readOnly={true} />
//             <FormInputItem label = "DATE OF DELIVERY :" value={formData.dateOfDeliveryDate} readOnly={true} />
//             {/* <FormDatePickerItem label="DATE OF INSPECTION :" name="dateOfInspectionDate" onChange={handleChange} />
//             <FormInputItem label="TYPE OF INSPECTION :" name="typeOfInspection" onChange={handleChange} /> */}
//           </Col>
//         </Row>

//         {/* Item Details */}
//         <h2>ITEM DETAILS</h2>

//         <Form.List name="itemDetails" initialValue={formData.items || [{}]}>
//           {(fields, { add, remove }) => (
//             <>
//               {formData?.items?.length > 0 &&
//                 formData.items.map((item, key) => {
//                   return (

//                     <div key={key} style={{ marginBottom: 16, border: '1px solid #d9d9d9', padding: 16, borderRadius: 4, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',gap:'20px' }}>

//                       <FormInputItem label="Serial No. :" value={item.srNo} readOnly={true}/>
//                       <FormInputItem label="ITEM CODE :" value={item.itemCode} readOnly={true}/>
//                       <FormInputItem label="ITEM DESCRIPTION :" value={item.itemDesc} readOnly={true}/>
//                       <FormInputItem label="UOM :" value={uomObj[parseInt(item.uom)]} readOnly={true}/>
//                       {/* <FormInputItem label="RECIEVED QUANTITY :" name="quantity" value={formData.items[key].quantity} onChange={(fieldName, value) => itemHandleChange("quantity", value, key)} />
//                       <FormInputItem label="BUDGET HEAD PROCUREMENT :" name="budgetHeadProcurement" value={item.budgetHeadProcurement} onChange={(fieldName, value) => itemHandleChange("budgetHeadProcurement", value, key)}/> */}

// {/*
//                         <Form.Item label="Serial No.">
//                           <Input value={item.srNo} readOnly />
//                         </Form.Item>

//                         <Form.Item label="ITEM CODE">
//                           <Input value={item.itemCode} readOnly />
//                         </Form.Item>

//                         <Form.Item label="ITEM DESCRIPTION">
//                           <Input value={item.itemDesc} readOnly />
//                         </Form.Item>

//                         <Form.Item label="UOM">
//                           <Input value={uomMaster[item.uom]} />
//                         </Form.Item> */}

//                         <Form.Item label="RECEIVED QUANTITY">
//                           <Input value={item.quantity} onChange={(e)=>itemHandleChange("quantity", e.target.value, key)} readOnly/>
//                         </Form.Item>

//                         {/* <Form.Item label="BUDGET HEAD PROCUREMENT">
//                           <Input value={item.budgetHeadProcurement} onChange={(e)=>itemHandleChange("budgetHeadProcurement", e.target.value, key)} />
//                         </Form.Item>  */}

//                         {
//                           Type !== "PO" &&
//                           // <Form.Item label="LOCATOR DESCRIPTION">
//                           //   <Input value={locatorMaster[item.locatorId]} />
//                           // </Form.Item>
//                           <FormInputItem label="LOCATOR DESCRPTION" value={locatorMaster[item.locatorId]} />
//                         }

//                         {/* <FormInputItem label="REMARK" name="remarks" value={item.remarks} onChange={(fieldName, value) => itemHandleChange("remarks", value, key)} /> */}

//                         <Form.Item label="REMARK">
//                           <Input value={item.remarks} onChange={(e)=>itemHandleChange("remarks", e.target.value, key)} />
//                         </Form.Item>

//                         <Col span={1}>
//                           <MinusCircleOutlined onClick={() => removeItem(key)} style={{ marginTop: 8 }} />
//                         </Col>
//                     </div>
//                   );
//                 })}
//             </>

//           )}
//         </Form.List>

//         {/* Condition of Goods */}

//         <Row gutter={24}>
//           <Col span={12}>
//             <Form.Item label="CONDITION OF GOODS" name="conditionOfGoods">
//               <Input.TextArea
//                 onChange={(e) =>
//                   handleChange("conditionOfGoods", e.target.value)
//                 }
//               />
//             </Form.Item>
//           </Col>
//           <Col span={12}>
//             <Form.Item label="NOTE" name="note">
//             <Input.TextArea
//                   value={formData.note}
//                   autoSize={{ minRows: 3, maxRows: 6 }}
//                   onChange={(e) => handleChange("note", e.target.value)}
//                 />
//                 <Input style={{ display: "none" }} />
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
//           {Type === "PO" && (
//             <div>
//               <div className="goods-receive-note-signature">GENERATED BY</div>
//               <div className="goods-receive-note-signature">
//                 NAME & DESIGNATION :
//                 <Form>
//                   <Input
//                     value={formData.genName}
//                     name="genName"
//                     onChange={(e) => handleChange("genName", e.target.value)}
//                   />
//                 </Form>
//               </div>
//               <div className="goods-receive-note-signature">
//                 DATE & TIME :
//                 <DatePicker
//                   defaultValue={dayjs()}
//                   format={dateFormat}
//                   style={{ width: "58%" }}
//                   name="genDate"
//                   onChange={(date, dateString) =>
//                     handleChange("genDate", dateString)
//                   }
//                 />
//               </div>
//             </div>
//           )}
//           {Type !== "PO" && (
//             <div>
//               <div className="goods-receive-note-signature">GENERATED BY</div>
//               <div className="goods-receive-note-signature">
//                 NAME & SIGNATURE :
//                 <Form>
//                   <Input
//                     value={formData.genName}
//                     name="genName"
//                     onChange={(e) => handleChange("genName", e.target.value)}
//                   />
//                 </Form>
//               </div>
//               <div className="goods-receive-note-signature">
//                 DATE & TIME :
//                 <DatePicker
//                   defaultValue={dayjs()}
//                   format={dateFormat}
//                   style={{ width: "58%" }}
//                   name="genDate"
//                   onChange={(date, dateString) =>
//                     handleChange("genDate", dateString)
//                   }
//                 />
//               </div>
//             </div>
//           )}

//           {Type === "PO" && (
//             <>
//               <div>
//                 <div className="goods-receive-note-signature">APPROVED BY</div>
//                 <div className="goods-receive-note-signature">
//                   NAME & SIGNATURE :
//                   <Form>
//                     <Input
//                       name="approvedName"
//                       onChange={(e) =>
//                         handleChange("approvedName", e.target.value)
//                       }
//                     />
//                   </Form>
//                 </div>
//                 <div className="goods-receive-note-signature">
//                   DATE & TIME :
//                   <DatePicker
//                     defaultValue={dayjs()}
//                     format={dateFormat}
//                     style={{ width: "58%" }}
//                     name="approvedDate"
//                     onChange={(date, dateString) =>
//                       handleChange("approvedDate", dateString)
//                     }
//                   />
//                 </div>
//               </div>
//             </>
//           )}

//           {Type !== "PO" && (
//             <>
//               <div>
//                 <div className="goods-receive-note-signature">RECEIVED BY</div>
//                 <div className="goods-receive-note-signature">
//                   NAME & SIGNATURE :
//                   <Form>
//                     <Input
//                       name="issueName"
//                       onChange={(e) =>
//                         handleChange("issueName", e.target.value)
//                       }
//                     />
//                   </Form>
//                 </div>
//                 <div className="goods-receive-note-signature">
//                   DATE & TIME :
//                   <DatePicker
//                     defaultValue={dayjs()}
//                     format={dateFormat}
//                     style={{ width: "58%" }}
//                     name="issueDate"
//                     onChange={(date, dateString) =>
//                       handleChange("issueDate", dateString)
//                     }
//                   />
//                 </div>
//               </div>
//             </>
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
//           <Button disabled={!buttonVisible} onClick={()=> printOrSaveAsPDF(formRef)} type="primary" danger style={{ width: '200px', margin: 16, alignContent: 'end' }}>
//               PRINT
//             </Button>
//           </Form.Item>
//         </div>
//         <Modal
//           title="MIS saved successfully."
//           open={isModalOpen}
//           onOk={handleOk}
//         >
//           {successMessage && <p>{successMessage}</p>}
//           {errorMessage && <p>{errorMessage}</p>}
//         </Modal>
//       </Form>
//     </div>
