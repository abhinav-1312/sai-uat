// InspectionNote.js
import React, { useState, useEffect, useRef } from "react";
import {
  Button,
  Modal,
  message,
} from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import axios from "axios";
import { apiHeader, itemHandleChange, removeItem } from "../../../utils/Functions";
import FormInputItem from "../../../components/FormInputItem";
import { useSelector } from "react-redux";
import FormContainer from "../../../components/FormContainer";
import FormHeading from "../../../components/FormHeading";
import FormBody from "../../../components/FormBody";
import useHandlePrint from "../../../components/useHandlePrint";
import CrCeDtlContainer from "../../../components/CrCeDtlContainer";
import RegionalCenterDetails from "../../../components/RegionalCenterDetails";
import SupplierDetails from "../../../components/SupplierDetails";
import OtherDetails from "../../../components/OtherDetails";
import FormSearchItem from "../../../components/FormSearchItem";
import InputDatePickerCombo from "../../../components/InputDatePickerCombo";
import ItemDetailsContainer from "../../../components/ItemDetailsContainer";
import DesignationContainer from "../../../components/DesignationContainer";
import ButtonContainer from "../../../components/ButtonContainer";
import { processTypeAcptOptionList } from "../../../utils/KeyValueMapping";
import FormSelectItem from "../../../components/FormSelectItem";
import { useLocation } from "react-router-dom";

const dateFormat = "DD/MM/YYYY";
const currentDate = dayjs();

const InspectionNote = () => {

  const location = useLocation()

  const formRef = useRef();
  const formBodyRef = useRef();
  const handlePrint = useHandlePrint(formRef);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const { organizationDetails, locationDetails, userDetails, token, userCd } =
    useSelector((state) => state.auth);
  const {locatorObj} = useSelector(state => state.locators)
  const {uomObj} = useSelector(state => state.uoms)
  const [formData, setFormData] = useState({
    genDate: currentDate.format(dateFormat),
    genName: userDetails?.firstName + " " + userDetails?.lastName,
    issueDate: currentDate.format(dateFormat),
    issueName: "",
    approvedDate: currentDate.format(dateFormat),
    approvedName: "",
    processId: 0,
    type: "PO",
    processType: "PO",
    processTypeDesc: "Purchase Order",
    typeOfInspection: "",
    inspectionRptNo: "",
    inspectionRptDate: currentDate.format(dateFormat),
    invoiceNo: "",
    inwardGatePass: "",
    ceRegionalCenterCd: organizationDetails?.id,
    ceRegionalCenterName: organizationDetails?.organizationName,
    ceAddress: organizationDetails?.locationAddr,
    ceZipcode: locationDetails?.zipcode,
    crRegionalCenterCd: "",
    crRegionalCenterName: "",
    crAddress: "",
    crZipcode: "",
    consumerName: "",
    supplierName: "",
    supplierCd: "",
    address: "",
    contactNo: "",
    dateOfDeliveryDate: currentDate.format(dateFormat),
    dateOfInspectionDate: currentDate.format(dateFormat),
    note: "",
    conditionOfGoods: "",
    userId: userCd,
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
      //   inspectedQuantity: 0,
      //   acceptedQuantity: 0,
      //   rejectedQuantity: 0,
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
          processStage: formData.processType === "PO" ? "IR" : "IGP",
        },
        apiHeader("POST", token)
      );
      const { responseData } = response.data;
      const { processData, itemList } = responseData;
      setFormData((prevFormData) => ({
        ...prevFormData,

        issueName: processData?.issueName,
        // approvedName: processData?.approvedName,
        processId: processData?.processId,
        inwardGatePass: processData?.processId,

        crRegionalCenterCd: processData?.crRegionalCenterCd,
        crRegionalCenterName: processData?.crRegionalCenterName,
        crAddress: processData?.crAddress,
        crZipcode: processData?.crZipcode,

        ceRegionalCenterCd: processData?.ceRegionalCenterCd,
        ceRegionalCenterName: processData?.ceRegionalCenterName,
        ceAddress: processData?.ceAddress,
        ceZipcode: processData?.ceZipcode,

        consumerName: processData?.consumerName,
        contactNo: processData?.contactNo,

        supplierCd: processData?.supplierCd,
        supplierName: processData?.supplierName,
        address: processData?.crAddress,

        modeOfDelivery: processData?.modeOfDelivery,
        challanNo: processData?.challanNo,
        dateOfDeliveryDate: processData?.dateOfDelivery,

        items: itemList.map((item) => ({
          srNo: item?.sNo,
          itemCode: item?.itemCode,
          itemDesc: item?.itemDesc,
          uom: parseInt(item?.uom),
          uomDesc: uomObj[parseInt(item?.uom)],
          noOfDays: item?.requiredDays,
          remarks: item?.remarks,
          conditionOfGoods: item?.conditionOfGoods,
          budgetHeadProcurement: item?.budgetHeadProcurement,
          locatorId: item?.locatorId,
          locatorDesc: locatorObj[parseInt(item?.locatorId)],
          inspectedQuantity: item?.quantity,
          acceptedQuantity: 0,
          rejectedQuantity: 0,
        })),
      }));
      // Handle response data as needed
    } catch (error) {
      console.error("Error fetching sub process details:", error);
      // Handle error
    }
  };

  const [printBtnEnabled, setPrintBtnEnabled] = useState(false);
  const [submitBtnEnabled, setSubmitBtnEnabled] = useState(true);
  const [draftBtnEnabled, setDraftBtnEnabled] = useState(true);
  const [isTxnData, setIsTxnData] = useState(false);

  const onFinish = async (values) => {
    if (!formData.genName || !formData.approvedName) {
      message.error("Please fill all the fields.");
      return;
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

      const apiUrl = "/saveNewInspectionReport";
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
        setFormData((prevValues) => {
          return {
            ...prevValues,
            inspectionRptNo: processId,
          };
        });
        setSuccessMessage(
          `Inspection Note : ${processId}, Process Type: ${processType}, Sub Process ID: ${subProcessId}`
        );
        setIsModalOpen(true);
        setPrintBtnEnabled(true);
        setIsModalOpen(true);
        setDraftBtnEnabled(false);
        localStorage.removeItem("inspDraft");
      } else {
        // Display a generic success message if specific data is not available
        message.error(response.data.responseStatus.errorType || "Failed to Inspection Note . Please try again later.");
      }
    } catch (error) {
      message.error("Failed to Inspection Note . Please try again later.");
    }
  };

  useEffect(() => {
    if (formBodyRef.current) formBodyRef.current.updateField(formData);
  }, [formData]);

   // when form is loaded and a form is saved as draft
   useEffect(() => {
    const formData = localStorage.getItem("inspDraft");
    if (formData) {
      setFormData(JSON.parse(formData));
      message.success("Form data loaded from draft.")
    }
  }, []);

   // when form is loaded and it is redirect by pressing print option on txn summary
   useEffect(() => {
    const txnData = location.state;

    if (txnData && txnData.data && txnData.itemList) {
      setFormData({
        ...txnData?.data,
        processTypeDesc:
          txnData?.data?.type === "IRP"
            ? "Returnable"
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

  return (
    <>
      <FormContainer ref={formRef}>
        <FormHeading
          formTitle="Inspection Note"
          date={formData.dateOfInspectionDate}
          txnType="IR"
          txnNo={
            formData.inspectionRptNo === "string"
              ? ""
              : formData.inspectionRptNo
          }
        />
        <FormBody ref={formBodyRef} formData={formData} onFinish={onFinish}>
          <CrCeDtlContainer>
            <RegionalCenterDetails
              heading="Consignee Details"
              cdName="ceRegionalCenterCd"
              rcName="ceRegionalCenterName"
              adrName="ceAddress"
              zipName="ceZipcode"
              readOnly
            />

            {formData.processType === "PO" && <SupplierDetails supplierCodeName="supplierCd" readOnly />}

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
            <FormSelectItem
                name="processTypeDesc"
                label="Select Process Type"
                optionArray={processTypeAcptOptionList}
                formField="processType"
                onChange={handleChange}
                readOnly={isTxnData}
              />
              <FormSearchItem
                label={formData.processType === "PO" ? "MIS No." : "Inward Gate Pass No."} 
                name="acceptanceNoteNo"
                onSearch={handleIgpDataSearch}
                onChange={handleChange}
                readOnly={isTxnData}
              />
              <FormInputItem
                label="Challan / Invoice No."
                name="challanNo"
                readonly
              />
              <InputDatePickerCombo
                inputLabel="Mode Of Delivery"
                inputName="modeOfDelivery"
                onChange={handleChange}
                dateLabel="Date Of Delivery"
                dateValue={formData.dateOfDeliveryDate}
                dateName="dateOfDeliveryDate"
                readOnly
              />
              <InputDatePickerCombo
                inputLabel="Type Of Inspection"
                inputName="typeOfInspection"
                onChange={handleChange}
                dateLabel="Date Of Inspection"
                dateName="dateOfInspectionDate"
                dateValue={formData.dateOfInspectionDate}
                readOnly={isTxnData}
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
                        item.srNo
                          ? ["items", key, "srNo"]
                          : ["items", key, "sNo"]
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
                      label="Inspected Quantity"
                      name={["items", key, "inspectedQuantity"]}
                      readOnly
                    />
                    <FormInputItem
                      label="Accepted Quantity"
                      name={["items", key, "acceptedQuantity"]}
                      onChange={(fieldName, value) =>
                        itemHandleChange(fieldName, value, key, setFormData)
                      }
                      readOnly={isTxnData}
                    />
                    <FormInputItem
                      label="Rejected Quantity"
                      name={["items", key, "rejectedQuantity"]}
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

                  <Button
                    icon={<DeleteOutlined />}
                    className="delete-button"
                    onClick={() => removeItem(key, setFormData)}
                    disabled={isTxnData}
                  />
                </div>
              );
            })}
          </ItemDetailsContainer>
          <DesignationContainer
            genByVisible
            approvedVisible
            genDateValue={formData.genDate} 
            approvedDateValue={formData.approvedDate}
            handleChange={handleChange}
            readOnly={isTxnData}
          />
          <ButtonContainer
            handlePrint={handlePrint}
            onFinish={onFinish}
            submitBtnEnabled={submitBtnEnabled}
            printBtnEnabled={printBtnEnabled}
            draftDataName="inspDraft"
            formData={formData}
            draftBtnEnabled={draftBtnEnabled}
            disabled={isTxnData}
          />
        </FormBody>

        <Modal
          title="Inspection Note saved successfully."
          open={isModalOpen}
          onOk={handleOk}
        >
          {successMessage && <p>{successMessage}</p>}
        </Modal>
      </FormContainer>
    </>
  );
};

export default InspectionNote;
