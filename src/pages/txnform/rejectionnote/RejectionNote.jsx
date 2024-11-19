// RejectionNote.js
import React, { useState, useRef, useEffect } from "react";
import { message, Modal } from "antd";
import dayjs from "dayjs";
import axios from "axios";
import { apiHeader } from "../../../utils/Functions";
import FormInputItem from "../../../components/FormInputItem";
import { convertEpochToDateString } from "../../../utils/Functions";
import { useSelector } from "react-redux";
import useHandlePrint from "../../../components/useHandlePrint";
import FormContainer from "../../../components/FormContainer";
import FormHeading from "../../../components/FormHeading";
import FormBody from "../../../components/FormBody";
import CrCeDtlContainer from "../../../components/CrCeDtlContainer";
import InputDatePickerCombo from "../../../components/InputDatePickerCombo";
import FormSearchItem from "../../../components/FormSearchItem";
import { processTypeAcptOptionList } from "../../../utils/KeyValueMapping";
import OtherDetails from "../../../components/OtherDetails";
import FormSelectItem from "../../../components/FormSelectItem";
import RegionalCenterDetails from "../../../components/RegionalCenterDetails";
import SupplierDetails from "../../../components/SupplierDetails";
import ItemDetailsContainer from "../../../components/ItemDetailsContainer";
import TermsConditionContainer from "../../../components/TermsConditionContainer";
import ButtonContainer from "../../../components/ButtonContainer";
import { useLocation } from "react-router-dom";
import DesignationContainer from "../../../components/DesignationContainer";

const dateFormat = "DD/MM/YYYY";
const currentDate = dayjs();

const RejectionNote = () => {
  const location = useLocation();

  const formRef = useRef();
  const formBodyRef = useRef();
  const handlePrint = useHandlePrint(formRef);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const { uomObj } = useSelector((state) => state.uoms);
  const { locatorObj } = useSelector((state) => state.locators);

  const [printBtnEnabled, setPrintBtnEnabled] = useState(false);
  const [submitBtnEnabled, setSubmitBtnEnabled] = useState(true);
  const [draftBtnEnabled, setDraftBtnEnabled] = useState(true);
  const [isTxnData, setIsTxnData] = useState(false);

  const { organizationDetails, locationDetails, userDetails, token, userCd } =
    useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    ceRegionalCenterCd: organizationDetails.id,
    ceRegionalCenterName: organizationDetails.organizationName,
    ceAddress: organizationDetails.locationAddr,
    ceZipcode: locationDetails.zipcode,
    genName: userDetails.firstName + " " + userDetails.lastName,
    userId: userCd,
    genDate: currentDate.format(dateFormat),
    issueDate: currentDate.format(dateFormat),
    approvedDate: currentDate.format(dateFormat),
    acptRejNodeDT: currentDate.format(dateFormat),
    acptRejNoteNo: "string",
    issueName: "",
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
            : "Inter Org Transfer";
      }

      return newData;
    });
  };

  const itemHandleChange = (fieldName, value, index) => {
    setFormData((prevValues) => {
      const updatedItems = [...(prevValues.items || [])];
      updatedItems[index] = {
        ...updatedItems[index],
        [fieldName]: value === "" ? null : value,
        // uom: "string",
        // conditionOfGoods: "string", // Hard-coded data
        // budgetHeadProcurement: "string", // Hard-coded data
        // locatorId: "string", // Hard-coded data
      };
      return {
        ...prevValues,
        items: updatedItems,
      };
    });
  };

  const handleInspectionDataSearch = async (value) => {
    try {
      const apiUrl = "/getSubProcessDtls";
      const response = await axios.post(
        apiUrl,
        {
          processId: value,
          processStage: "IRN",
        },
        apiHeader("POST", token)
      );
      const responseData = response.data.responseData;
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

        crRegionalCenterCd: processData?.crRegionalCenterCd,
        crRegionalCenterName: processData?.crRegionalCenterName,
        crAddress: processData?.crAddress,
        crZipcode: processData?.crZipcode,

        consumerName: processData?.consumerName,
        contactNo: processData?.contactNo,

        supplierCd: processData?.supplierCd,
        supplierName: processData?.supplierName,

        noaDate: processData?.noaDate
          ? convertEpochToDateString(processData.noaDate)
          : "",
        noa: processData?.noa ? processData.noa : "",
        dateOfDelivery: processData?.dateOfDelivery,

        items: itemList.map((item) => ({
          srNo: item.sNo,
          itemCode: item.itemCode,
          itemDesc: item.itemDesc,
          uom: item?.uom,
          uomDesc: uomObj[parseInt(item?.uom)],
          quantity: item.rejectedQuantity,
          noOfDays: item.requiredDays,
          remarks: item.remarks,
          conditionOfGoods: item.conditionOfGoods,
          budgetHeadProcurement: item.budgetHeadProcurement,
          locatorId: item.locatorId,
          locatorDesc: locatorObj[parseInt(item?.locatorId)],
          rejectedQuantity: item.rejectedQuantity,
        })),
      }));
      // Handle response data as needed
    } catch (error) {
      message.error("Error fetching sub process details:");
    }
  };
  const onFinish = async () => {
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
        "supplierName",
        "supplierCd",
        "address",
        "noaDate",
        "userId",
      ];

      allFields.forEach((field) => {
        if (!(field in formDataCopy)) {
          formDataCopy[field] = "";
        }
      });

      const apiUrl = "/saveRejectionNote";
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
            acptRejNoteNo: processId,
          };
        });
        setSuccessMessage(
          `Rejection note saved successfully! Issue Note No : ${processId}, Process Type: ${processType}, Sub Process ID: ${subProcessId}`
        );
        setPrintBtnEnabled(true);
        setIsModalOpen(true);
        setDraftBtnEnabled(false);
        localStorage.removeItem("rejDraft");
      } else {
        message.error(
          response.data.responseStatus.errorType ||
            "Failed to save Rejection note. Please try again later."
        );
        setSubmitBtnEnabled(true);
      }
    } catch (error) {
      message.error("Failed to submit Rejection note. ");
    }
  };

  useEffect(() => {
    if (formBodyRef.current) formBodyRef.current.updateField(formData);
  }, [formData]);

  // when form is loaded and a form is saved as draft
  useEffect(() => {
    const formData = localStorage.getItem("rejDraft");
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
        processType: txnData?.data?.type,
        noaDate: txnData?.data?.noaDateFormat,
        acptRejNoteNo: txnData?.data?.processId,
        acptRejNodeDT: txnData?.data?.acptRejNoteDT,
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

  if (!uomObj || !locatorObj) {
    return <h3>Loading. Please wait...</h3>;
  }

  return (
    <FormContainer ref={formRef}>
      <FormHeading
        formTitle="Rejection Note"
        date={formData.acptRejNodeDT}
        txnNo={formData.acptRejNoteNo}
        txnType="REJ"
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
            <SupplierDetails supplierCodeName="supplierCd" readOnly />
          ) : (
            <RegionalCenterDetails
              heading="Consignore Details"
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
                  label="Rejected Quantity"
                  name={["items", key, "rejectedQuantity"]}
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
          conditionOfGoodsVisible={formData.type !== "PO"}
          noteVisible
          handleChange={handleChange}
          readOnly={isTxnData}
        />

        <DesignationContainer
          genByVisible
          approvedVisible
          issueVisible
          genDateValue={formData.genDate} 
          issueDateValue={formData.issueDate}
          approvedDateValue={formData.approvedDate}
          handleChange={handleChange}
          readOnly={isTxnData}
        />

        <ButtonContainer
          handlePrint={handlePrint}
          onFinish={onFinish}
          submitBtnEnabled={submitBtnEnabled}
          printBtnEnabled={printBtnEnabled}
          draftDataName="rejDraft"
          formData={formData}
          draftBtnEnabled={draftBtnEnabled}
          disabled={isTxnData}
        />
      </FormBody>

      <Modal
        title="Rejection Note saved successfully"
        open={isModalOpen}
        onOk={handleOk}
      >
        {successMessage && <p>{successMessage}</p>}
      </Modal>
    </FormContainer>
  );
};

export default RejectionNote;
