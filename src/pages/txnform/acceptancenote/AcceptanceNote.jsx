// AcceptanceNote.js
import React, { useState, useEffect, useRef } from "react";
import {
  message,
  Modal,
} from "antd";
import dayjs from "dayjs";
import {
  apiCall,
  convertEpochToDateString,
  itemHandleChange,
} from "../../../utils/Functions";
import FormInputItem from "../../../components/FormInputItem";
import { useSelector } from "react-redux";
import Loader from "../../../components/Loader";
import FormContainer from "../../../components/FormContainer";
import FormHeading from "../../../components/FormHeading";
import FormBody from "../../../components/FormBody";
import CrCeDtlContainer from "../../../components/CrCeDtlContainer";
import RegionalCenterDetails from "../../../components/RegionalCenterDetails";
import SupplierDetails from "../../../components/SupplierDetails";
import OtherDetails from "../../../components/OtherDetails";
import FormSearchItem from "../../../components/FormSearchItem";
import FormSelectItem from "../../../components/FormSelectItem";
import { processTypeAcptOptionList } from "../../../utils/KeyValueMapping";
import ItemDetailsContainer from "../../../components/ItemDetailsContainer";
import TermsConditionContainer from "../../../components/TermsConditionContainer";
import DesignationContainer from "../../../components/DesignationContainer";
import ButtonContainer from "../../../components/ButtonContainer";
import useHandlePrint from "../../../components/useHandlePrint";
import { useLocation } from "react-router-dom";
import InputDatePickerCombo from "../../../components/InputDatePickerCombo";
const dateFormat = "DD/MM/YYYY";

const currentDate = dayjs();

const AcceptanceNote = () => {

  const location = useLocation();

  const formRef = useRef();
  const formBodyRef = useRef();
  const handlePrint = useHandlePrint(formRef);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const [printBtnEnabled, setPrintBtnEnabled] = useState(false);
  const [submitBtnEnabled, setSubmitBtnEnabled] = useState(true);
  const [draftBtnEnabled, setDraftBtnEnabled] = useState(true);
  const [isTxnData, setIsTxnData] = useState(false);

  const { organizationDetails, locationDetails, userDetails, token, userCd } =
    useSelector((state) => state.auth);

  const { uomObj } = useSelector((state) => state.uoms);

  const [formData, setFormData] = useState({
    ceRegionalCenterCd: organizationDetails.id,
    ceRegionalCenterName: organizationDetails.organizationName,
    ceAddress: organizationDetails.locationAddr,
    ceZipcode: locationDetails.zipcode,
    genName: userDetails.firstName + " " + userDetails.lastName,
    userId: userCd,
    genDate: currentDate.format(dateFormat),
    issueDate: currentDate.format(dateFormat),
    acptRejNodeDT: currentDate.format(dateFormat),
    acptRejNoteNo: "string",
    issueName: "",
    approvedDate: currentDate.format(dateFormat),
    approvedName: "",
    processId: 0,
    type: "PO",
    processType: "PO",
    processTypeDesc: "Purchase Order",
    inspectionRptNo: "",
    dateOfDelivery: "",
    crRegionalCenterCd: "",
    crRegionalCenterName: "",
    crAddress: "",
    crZipcode: "",
    consumerName: "",
    contactNo: "",
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
    supplierName: "",
    supplierCd: "",
    address: "",
    noaDate: "",
  });

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleChange = (fieldName, value) => {
    setFormData((prev) => {
      const newData = { ...prev, [fieldName]: value };

      if (fieldName === "processType") {
        newData.type = value;
        newData.processTypeDesc =
          value === "IRP"
            ? "Issue Return Process"
            : value === "PO"
            ? "Purchase Order"
            : "Inter Org Process";
      }

      return newData;
    });
  };

  const onFinish = async (values) => {
    setPrintBtnEnabled(false)
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
        "inspectionRptNo",
        "acptRejNoteNo",
        "acptRejNodeDT",
        "dateOfDelivery",
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
        "note",
        "conditionOfGoods",
        "userId",
        "supplierName",
        "supplierCd",
        "address",
        "noaDate",
      ];

      allFields.forEach((field) => {
        if (!(field in formDataCopy)) {
          formDataCopy[field] = "";
        }
      });
      const data = await apiCall(
        "POST",
        `/saveAcceptanceNote`,
        token,
        formDataCopy
      );
      const { responseData } = data;
      if (data.responseStatus && data.responseStatus.message === "Success") {
        // Access the specific success message data if available
        const { processId, processType, subProcessId } = responseData;
        setFormData((prev) => {
          return {
            ...prev,
            acptRejNoteNo: processId,
          };
        });
        setSuccessMessage(
          `Acceptance Note : ${processId}, Process Type: ${processType}, Sub Process ID: ${subProcessId}`
        );

        setPrintBtnEnabled(true);
        setIsModalOpen(true)
        setDraftBtnEnabled(false)
        localStorage.removeItem("acptDraft")

      } else {
        message.error(data.responseStatus.errorType);
        setSubmitBtnEnabled(true)
      }
    } catch (error) {
      message.error("Failed to submit Acceptance Note . Please try again later.");
      setSubmitBtnEnabled(true)
    }
  };


  useEffect(() => {
    if (formBodyRef.current) formBodyRef.current.updateField(formData);
  }, [formData]);

   // when form is loaded and a form is saved as draft
   useEffect(() => {
    const formData = localStorage.getItem("acptDraft");
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
        supplierCode: txnData?.data?.supplierCd,
        acptRejNoteNo: txnData?.data?.processId,
        acptRejNodeDT: txnData?.data?.acptRejNoteDT,
        processType: txnData?.data?.type,
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

  const handleInspectionDataSearch = async (value) => {
    try {
      const data = await apiCall("POST", `/getSubProcessDtls`, token, {
        processId: value,
        processStage: "IRN",
      });
      const { responseData } = data;
      const { processData, itemList } = responseData;
      setFormData((prevFormData) => ({
        ...prevFormData,

        issueName: processData?.issueName,
        approvedName: processData?.approvedName,
        processId: processData?.processId,

        ceRegionalCenterCd: processData?.ceRegionalCenterCd,
        ceRegionalCenterName: processData?.ceRegionalCenterName,
        ceAddress: processData?.ceAddress,
        ceZipcode: processData?.ceZipcode,

        consumerName: processData?.consumerName,
        contactNo: processData?.contactNo,

        supplierCd: processData?.supplierCd,
        supplierCode: processData?.supplierCd,
        supplierName: processData?.supplierName,
        crAddress: processData?.crAddress,
        crRegionalCenterCd: processData?.crRegionalCenterCd,
        crRegionalCenterName: processData?.crRegionalCenterName,
        crZipcode: processData?.crZipcode,

        dateOfDelivery: processData?.dateOfDelivery,
        noaDate: processData?.noaDate
          ? convertEpochToDateString(processData.noaDate)
          : "",
        noa: processData?.noa ? processData.noa : "",

        items: itemList.map((item) => ({
          srNo: item.sNo,
          itemCode: item.itemCode,
          itemDesc: item.itemDesc,
          uom: item?.uom,
          uomDesc: uomObj[parseInt(item.uom)],
          quantity: item.acceptedQuantity,
          inspectedQuantity: item.inspectedQuantity,
          noOfDays: item.requiredDays,
          remarks: item.remarks,
          conditionOfGoods: item.conditionOfGoods,
          budgetHeadProcurement: item.budgetHeadProcurement,
          locatorId: item.locatorId,
          acceptedQuantity: item.acceptedQuantity || item.rejectedQuantity,
        })),
      }));
      // Handle response data as needed
    } catch (error) {
      message.error("Error fetching sub process details:");
      // Handle error
    }
  };

  return (
    <>
      <FormContainer ref={formRef}>
        <FormHeading
          formTitle="Acceptance Note"
          date={formData.acptRejNodeDT}
          txnType="ACT"
          txnNo={formData.acptRejNoteNo === "string" ? "" : formData.acptRejNoteNo}
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
            {formData.processType === "PO" ? (
              <SupplierDetails readOnly />
            ) : (
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
                label="Inspection Note No."
                name="inspectionRptNo"
                onSearch={handleInspectionDataSearch}
                onChange={handleChange}
                readOnly={isTxnData}
              />
              {formData.processType === "PO" && (
                <>
                  <InputDatePickerCombo
                    inputLabel="NOA No."
                    inputName="noa"
                    dateLabel="NOA Date"
                    dateName="noaDate"
                    dateValue={formData.noaDate}
                    onChange={handleChange}
                    readOnly
                  />

                  <FormInputItem
                    label="Date Of Delivery"
                    name="dateOfDelivery"
                    readOnly
                  />
                </>
              )}
            </OtherDetails>
          </CrCeDtlContainer>

          <ItemDetailsContainer>
            {formData.items?.map((item, key) => (
              <div className="each-item-detail-container">
                <div className="each-item-detail-container-grid">
                  <FormInputItem
                    label="Serial No."
                    name={
                      item.srNo ? ["items", key, "srNo"] : ["items", key, "sNo"]
                    }
                    readOnly
                  />
                  <FormInputItem
                    label="Item Code"
                    name={["items", key, "itemCode"]}
                    readOnly
                  />
                  <FormInputItem
                    label="Item Description"
                    name={["items", key, "itemDesc"]}
                    readOnly
                    className="item-desc-cell"
                  />
                  <FormInputItem
                    label="Unit of Measurement"
                    name={["items", key, "uomDesc"]}
                    readOnly
                  />
                  <FormInputItem
                    label="Accepted Quantity"
                    name={["items", key, "acceptedQuantity"]}
                    readOnly
                  />
                  <FormInputItem
                    label="Remarks"
                    name={["items", key, "remarks"]}
                    onChange={(name, value) =>
                      itemHandleChange(name, value, key, setFormData)
                    }
                    readOnly={isTxnData}
                  />
                  {/* <Button
                    icon={<DeleteOutlined />}
                    className="delete-button"
                    onClick={() => removeItem(key, setFormData)}
                    style={
                      isTxnData ? { display: "none" } : { display: "block" }
                    }
                  /> */}
                </div>
              </div>
            ))}
          </ItemDetailsContainer>
          <TermsConditionContainer
            conditionOfGoodsVisible={
              formData.processType === "PO" ? false : true
            }
            noteVisible
            handleChange={handleChange}
            readOnly={isTxnData}
          />
          <DesignationContainer
            genByVisible
            genDateValue={formData.genDate}
            handleChange={handleChange}
            readOnly={isTxnData}
          />
          <ButtonContainer
            handlePrint={handlePrint}
            onFinish={onFinish}
            submitBtnEnabled={submitBtnEnabled}
            printBtnEnabled={printBtnEnabled}
            draftDataName="acptDraft"
            formData={formData}
            draftBtnEnabled={draftBtnEnabled}
            disabled={isTxnData}
          />
        </FormBody>
        <Modal
          title="Acceptance Note saved successfully"
          open={isModalOpen}
          onOk={handleOk}
        >
          {successMessage && <p>{successMessage}</p>}
        </Modal>
      </FormContainer>
    </>
  );
};

export default AcceptanceNote;