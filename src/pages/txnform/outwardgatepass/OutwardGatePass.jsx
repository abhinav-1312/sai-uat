// OutwardGatePass.js
import React, { useState, useEffect, useRef } from "react";
import { Button, message, Modal } from "antd";
import { DeleteOutlined } from "@ant-design/icons";

import dayjs from "dayjs";
import axios from "axios";
import {
  apiHeader,
  convertEpochToDateString,
  itemHandleChange,
  removeItem,
} from "../../../utils/Functions";
import FormInputItem from "../../../components/FormInputItem";
import { useSelector } from "react-redux";
import useHandlePrint from "../../../components/useHandlePrint";
import { useLocation } from "react-router-dom";
import FormContainer from "../../../components/FormContainer";
import FormHeading from "../../../components/FormHeading";
import FormBody from "../../../components/FormBody";
import CrCeDtlContainer from "../../../components/CrCeDtlContainer";
import RegionalCenterDetails from "../../../components/RegionalCenterDetails";
import OtherDetails from "../../../components/OtherDetails";
import ConsumerDetails from "../../../components/ConsumerDetails";
import SupplierDetails from "../../../components/SupplierDetails";
import FormSelectItem from "../../../components/FormSelectItem";
import {
  iopTypeOptionList,
  processTypeGrnOptionList,
} from "../../../utils/KeyValueMapping";
import FormSearchItem from "../../../components/FormSearchItem";
import InputDatePickerCombo from "../../../components/InputDatePickerCombo";
import ItemDetailsContainer from "../../../components/ItemDetailsContainer";
import TermsConditionContainer from "../../../components/TermsConditionContainer";
import ButtonContainer from "../../../components/ButtonContainer";
import DesignationContainer from "../../../components/DesignationContainer";
const dateFormat = "DD/MM/YYYY";

const currentDate = dayjs();

const OutwardGatePass = () => {
  const [printBtnEnabled, setPrintBtnEnabled] = useState(false);
  const [submitBtnEnabled, setSubmitBtnEnabled] = useState(true);
  const [draftBtnEnabled, setDraftBtnEnabled] = useState(true);
  const [isTxnData, setIsTxnData] = useState(false);
  const location = useLocation();

  const formRef = useRef();
  const formBodyRef = useRef();
  const handlePrint = useHandlePrint(formRef);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const { organizationDetails, locationDetails, userDetails, token, userCd } =
    useSelector((state) => state.auth);
  const { uomObj } = useSelector((state) => state.uoms);
  const { locatorObj } = useSelector((state) => state.locators);

  const [formData, setFormData] = useState({
    genDate: currentDate.format(dateFormat),
    genName: userDetails?.firstName + " " + userDetails.lastName,
    issueDate: currentDate.format(dateFormat),
    issueName: "",
    approvedDate: currentDate.format(dateFormat),
    approvedName: "",
    processId: "string",
    type: "IRP",
    processTypeDesc: "Issue/Return ",
    gatePassDate: currentDate.format(dateFormat),
    processType: "IRP",
    gatePassNo: "string",
    ceRegionalCenterCd: "",
    ceRegionalCenterName: "",
    ceAddress: "",
    ceZipcode: "",
    crRegionalCenterCd: organizationDetails?.id,
    crRegionalCenterName: organizationDetails?.organizationName,
    crAddress: organizationDetails?.locationAddr,
    crZipcode: locationDetails?.zipcode,
    consumerName: "",
    contactNo: "",
    noaNo: "",
    noaDate: currentDate.format(dateFormat),
    dateOfDelivery: currentDate.format(dateFormat),
    modeOfDelivery: "",
    challanNo: "",
    supplierCode: "",
    supplierName: "",
    noteType: "Accepted Items",
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
    userId: userCd,
    termsCondition: "",
    note: "",
  });

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const populateRcDtls = (value) => {
    if (
      value === "PO" ||
      (value === "IOP" && formData.noteType === "Accepted Items")
    ) {
      setFormData((prev) => {
        return {
          ...prev,
          ceRegionalCenterCd: organizationDetails?.id,
          ceRegionalCenterName: organizationDetails?.organizationName,
          ceAddress: organizationDetails?.locationAddr,
          ceZipcode: locationDetails?.zipcode,
          type: value,
          processType: value,
          processTypeDesc:
            value === "PO" ? "Purchase Order" : "Inter Org Transfer",
          crRegionalCenterCd: "",
          crRegionalCenterName: "",
          crAddress: "",
          crZipcode: "",
          consumerName: "",
          contactNo: "",
          items: [],
        };
      });
    } else {
      setFormData((prev) => {
        return {
          ...prev,
          crRegionalCenterCd: organizationDetails?.id,
          crRegionalCenterName: organizationDetails?.organizationName,
          crAddress: organizationDetails?.locationAddr,
          crZipcode: locationDetails?.zipcode,
          type: value,
          processType: value,
          processTypeDesc:
            value === "IRP" ? "Issue Return Process" : "Inter Org Transfer",
          ceRegionalCenterCd: "",
          ceRegionalCenterName: "",
          ceAddress: "",
          ceZipcode: "",
          consumerName: "",
          contactNo: "",
          items: [],
        };
      });
    }
  };

  const handleChange = (fieldName, value) => {
    if (fieldName === "processType") {
      populateRcDtls(value);
      return;
    }
    setFormData((prevValues) => ({
      ...prevValues,
      [fieldName]: value === "" ? null : value,
    }));
  };

  const handleIssueDataSearch = async (value) => {
    try {
      const apiUrl = "/getSubProcessDtls";
      const response = await axios.post(
        apiUrl,
        {
          processId: value,
          processStage: "ISN",
        },
        apiHeader("POST", token)
      );
      const responseData = response.data.responseData;
      const { processData, itemList } = responseData;
      setFormData((prevFormData) => ({
        ...prevFormData,

        crRegionalCenterCd: processData?.crRegionalCenterCd,
        crRegionalCenterName: processData?.crRegionalCenterName,
        crAddress: processData?.crAddress,
        crZipcode: processData?.crZipcode,

        issueName: processData?.issueName,
        approvedName: processData?.approvedName,
        issueNoteNo: processData?.processId,

        ceRegionalCenterCd: processData?.ceRegionalCenterCd,
        ceRegionalCenterName: processData?.ceRegionalCenterName,
        ceAddress: processData?.ceAddress,
        ceZipcode: processData?.ceZipcode,
        consumerName: processData?.consumerName,

        rejectionNoteNo: value,

        processId: processData?.processId,
        termsCondition: processData?.termsCondition,
        note: processData?.note,

        contactNo: processData?.contactNo,

        items: itemList.map((item) => ({
          srNo: item?.sNo,
          itemId: item?.itemId,
          itemCode: item?.itemCode,
          itemDesc: item?.itemDesc,
          uom: parseInt(item?.uom),
          uomDesc: uomObj[parseInt(item?.uom)],
          quantity: item?.quantity,
          noOfDays: item?.requiredDays,
          remarks: item?.remarks,
          conditionOfGoods: item?.conditionOfGoods,
          budgetHeadProcurement: item?.budgetHeadProcurement,
          locatorId: parseInt(item?.locatorId),
          locatorDesc: locatorObj[parseInt(item?.locatorId)],
        })),
      }));
      // Handle response data as needed
    } catch (error) {
      console.error("Error fetching sub process details:", error);
      // Handle error
    }
  };

  const onFinish = async (values) => {
    if (!formData.issueName || !formData.genName) {
      message.error("Please fill all the fields.");
      return;
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
        "termsCondition",
        "note",
        "userId",
      ];

      allFields.forEach((field) => {
        if (!(field in formDataCopy)) {
          formDataCopy[field] = "";
        }
      });

      const apiUrl = "/saveOutwardGatePass";
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
            gatePassNo: processId,
          };
        });
        setSuccessMessage(
          `Outward gate pass saved successfully! \n Process ID : ${processId}, \n Process Type: ${processType}, \n Sub Process ID: ${subProcessId}`
        );
        setIsModalOpen(true);
        setPrintBtnEnabled(true);
        setIsModalOpen(true);
        setDraftBtnEnabled(false);
        localStorage.removeItem("ogpDraft");
      } else {
        // Display a generic success message if specific data is not available
        message.error(
          response.data.responseStatus.errorType ||
            "Failed to submit outward gate pass. Please try again later."
        );
        setSubmitBtnEnabled(true);
      }

      // Handle success response here
    } catch (error) {
      message.error(
        "Failed to submit outward gate pass. Please try again later."
      );
      setSubmitBtnEnabled(true);
      // Handle error response here
    }
  };

  const handlePoIopReturnDataSearch = async (value, rejectProcess = false) => {
    try {
      const apiUrl = "/getSubProcessDtls";
      const response = await axios.post(
        apiUrl,
        {
          processId: value,
          processStage: "REJ",
          rejectProcess: rejectProcess,
        },
        apiHeader("POST", token)
      );
      const { responseData } = response.data;
      const { processData, itemList } = responseData;

      if (responseData !== null && processData !== null) {
        setFormData((prev) => {
          return {
            ...prev,
            genName: processData?.genName,
            genDate: processData?.genDate,
            issueDate: processData?.issueDate,
            issueName: processData?.issueName,
            approvedDate: processData?.approvedDate,
            approvedName: processData?.approvedName,
            processId: processData?.processId,
            type: processData?.type,
            typeOfNote: processData?.typeOfNote,

            inspectionRptNo: processData?.inspectionRptNo,
            acptRejNoteNo: processData?.acptRejNoteNo,
            acptRejNoteDT: processData?.acptRejNoteDT,
            dateOfDelivery: processData?.dateOfDelivery,
            ceRegionalCenterCd: processData?.ceRegionalCenterCd,
            ceRegionalCenterName: processData?.ceRegionalCenterName,
            ceAddress: processData?.ceAddress,
            ceZipcode: processData?.ceZipcode,
            crRegionalCenterCd: processData?.crRegionalCenterCd,
            crRegionalCenterName: processData?.crRegionalCenterName,
            crAddress: processData?.crAddress,
            crZipcode: processData?.crZipcode,
            consumerName: processData?.consumerName,
            supplierName: processData?.supplierName,
            supplierCode: processData?.supplierCd || processData?.supplierCode,
            address: processData?.address,
            contactNo: processData?.contactNo,
            note: processData?.note,
            noaDate: processData?.noaDate
              ? convertEpochToDateString(processData.noaDate)
              : "",
            noaNo: processData?.noa ? processData.noa : "",
            conditionOfGoods: processData?.conditionOfGoods,
            challanNo: processData?.challanNo,
            modeOfDelivery: processData?.modeOfDelivery,

            items: itemList.map((item) => ({
              id: item?.id,
              itemId: item?.id,
              srNo: item?.sNo,
              itemCode: item?.itemCode,
              itemDesc: item?.itemDesc,
              uom: item?.uom,
              uomDesc: uomObj[parseInt(item?.uom)],
              quantity: item?.quantity,
              noOfDays: 1,
              inspectedQuantity: item?.inspectedQuantity,
              acceptedQuantity: item?.acceptedQuantity,
              rejectedQuantity: item?.rejectedQuantity,
              requiredDays: item?.requiredDays,
              remarks: item?.remarks,
              processId: item?.processId,
              processType: item?.processType,
              processStage: item?.processStage,
              conditionOfGoods: item?.conditionOfGoods,
              budgetHeadProcurement: item?.budgetHeadProcurement,
              locatorId: item?.locatorId,
              locatorDesc: locatorObj[parseInt(item?.locatorId)],
            })),
          };
        });
      }
    } catch (error) {
      console.error("Error fetching sub process details:", error);
    }
  };

  useEffect(() => {
    if (formBodyRef.current) formBodyRef.current.updateField(formData);
  }, [formData]);

  // when form is loaded and a form is saved as draft
  useEffect(() => {
    const formData = localStorage.getItem("ogpDraft");
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
        issueNoteNo: txnData.data.processId,
        gatePassNo: txnData.data.processId,
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

  console.log("FormData: ", formData)

  return (
    <>
      <FormContainer ref={formRef}>
        <FormHeading
          formTitle="Outward Gate Pass"
          txnType="OGP"
          date={formData.gatePassDate}
          txnNo={formData.gatePassNo}
        />
        <FormBody ref={formBodyRef} formData={formData} onFinish={onFinish}>
          <CrCeDtlContainer>
            <RegionalCenterDetails
              heading={
                formData.processType === "IRP"
                  ? "Consignor Details"
                  : "Consignee Details"
              }
              cdName={
                formData.type === "IRP"
                  ? "crRegionalCenterCd"
                  : "ceRegionalCenterCd"
              }
              rcName={
                formData.type === "IRP"
                  ? "crRegionalCenterName"
                  : "ceRegionalCenterName"
              }
              adrName={formData.type === "IRP" ? "crAddress" : "ceAddress"}
              zipName={formData.type === "IRP" ? "crZipcode" : "ceZipcode"}
              readOnly
            />

            {formData.type === "PO" && <SupplierDetails readOnly />}

            {formData.type === "IRP" && (
              <ConsumerDetails
                heading="Consignee Details"
                consumerName={formData.consumerName}
                contactNo={formData.contactNo}
                readOnly
              />
            )}

            {formData.type === "IOP" && (
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
                label="Type"
                value={formData.processTypeDesc}
                name="processTypeDesc"
                optionArray={processTypeGrnOptionList}
                formField="processType"
                onChange={handleChange}
                readOnly={isTxnData}
              />

              {formData.type === "IRP" && (
                <FormSearchItem
                  label="Issue Note No."
                  name="issueNoteNo"
                  onSearch={handleIssueDataSearch}
                  onChange={handleChange}
                  readOnly={isTxnData}
                />
              )}
              {formData.type === "PO" && (
                <FormSearchItem
                  label="Rejection Note No"
                  name="rejectionNoteNo"
                  onSearch={(value) => handlePoIopReturnDataSearch(value)}
                  onChange={handleChange}
                  readOnly={isTxnData}
                />
              )}

              {formData.type === "IOP" && (
                <>
                  <FormSelectItem
                    label="Select Note Type"
                    name="noteType"
                    onChange={handleChange}
                    optionArray={iopTypeOptionList}
                    formField="noteType"
                    readOnly={isTxnData}
                  />
                </>
              )}

              {formData.processType === "IOP" &&
                formData.noteType === "Accepted Items" && (
                  <FormSearchItem
                    label="Outward Gate Pass No."
                    name="outwardGatePass"
                    onSearch={(value) => handleIssueDataSearch(value)}
                    onChange={handleChange}
                    readOnly={isTxnData}
                  />
                )}
              {formData.processType === "IOP" &&
                formData.noteType !== "Accepted Items" && (
                  <FormSearchItem
                    label="Rejection Note No."
                    name="outwardGatePass"
                    onSearch={(value) =>
                      handlePoIopReturnDataSearch(value, true)
                    }
                    onChange={handleChange}
                    readOnly={isTxnData}
                  />
                )}
              {formData.processType !== "IRP" && (
                <>
                  <FormInputItem
                    label="Challan / Invoice No."
                    name="challanNo"
                    onChange={handleChange}
                    readOnly={isTxnData}
                  />
                  <InputDatePickerCombo
                    inputLabel="NOA No."
                    inputName="noaNo"
                    onChange={handleChange}
                    dateLabel="NOA Date"
                    dateName="noaDate"
                    dateValue={formData.noaDate}
                    readOnly={isTxnData}
                  />
                  <InputDatePickerCombo
                    inputLabel="Mode Of Delivery"
                    inputName="modeOfDelivery"
                    onChange={handleChange}
                    dateLabel="Date Of Delivery"
                    dateName="dateOfDelivery"
                    dateValue={formData.dateOfDelivery}
                    readOnly={isTxnData}
                  />
                </>
              )}
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
                      label="Quantity"
                      name={["items", key, "quantity"]}
                      onChange={(fieldName, value) =>
                        itemHandleChange(fieldName, value, key, setFormData)
                      }
                      readOnly
                    />

                    {(formData.type === "IRP" || formData.type === "IOP") && (
                      <FormInputItem
                        label="Req. For No. Of Days"
                        name={
                          item.noOfDays
                            ? ["items", key, "noOfDays"]
                            : ["items", key, "requiredDays"]
                        }
                        onChange={(fieldName, value) =>
                          itemHandleChange(fieldName, value, key, setFormData)
                        }
                        readOnly
                      />
                    )}

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
                    className="delete-button exclude-print"
                    onClick={() => removeItem(key, setFormData)}
                    style={{display: isTxnData ? "none" : "block"}}
                  />
                </div>
              );
            })}
          </ItemDetailsContainer>
          <TermsConditionContainer
            termsConditionVisible
            noteVisible
            handleChange={handleChange}
            readOnly={isTxnData}
          />
          <DesignationContainer
            genByVisible
            issueVisible
            genDateValue={formData.genDate}
            issueDateValue={formData.issueDate}
            readOnly={isTxnData}
            handleChange={handleChange}
            processType={formData.processType}
          />
          <ButtonContainer
            handlePrint={handlePrint}
            onFinish={onFinish}
            submitBtnEnabled={submitBtnEnabled}
            printBtnEnabled={printBtnEnabled}
            draftDataName="ogpDraft"
            formData={formData}
            draftBtnEnabled={draftBtnEnabled}
            disabled={isTxnData}
          />
        </FormBody>
        <Modal
          title="Outward Gate Pass saved successfully"
          open={isModalOpen}
          onOk={handleOk}
        >
          {successMessage && <p>{successMessage}</p>}
        </Modal>
      </FormContainer>
    </>
  );
};

export default OutwardGatePass;
