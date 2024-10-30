// RetunNote.js
import React, { useState, useEffect, useRef } from "react";
import { Button, message, Modal } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import axios from "axios";
import {
  apiHeader,
  daysDifference,
  itemHandleChange,
  removeItem,
} from "../../../utils/Functions";
import FormContainer from "../../../components/FormContainer";
import FormInputItem from "../../../components/FormInputItem";
import { useSelector } from "react-redux";
import FormHeading from "../../../components/FormHeading";
import FormBody from "../../../components/FormBody";
import CrCeDtlContainer from "../../../components/CrCeDtlContainer";
import RegionalCenterDetails from "../../../components/RegionalCenterDetails";
import ConsumerDetails from "../../../components/ConsumerDetails";
import OtherDetails from "../../../components/OtherDetails";
import ItemDetailsContainer from "../../../components/ItemDetailsContainer";
import TermsConditionContainer from "../../../components/TermsConditionContainer";
import DesignationContainer from "../../../components/DesignationContainer";
import ButtonContainer from "../../../components/ButtonContainer";
import FormSearchItem from "../../../components/FormSearchItem";
import { useLocation } from "react-router-dom";

const currentDate = dayjs();
const dateFormat = "DD/MM/YYYY";

const RetunNote = () => {
  const formRef = useRef();
  const formBodyRef = useRef();
  const location = useLocation();
  const [isTxnData, setIsTxnData] = useState(false);
  const { uomObj } = useSelector((state) => state.uoms);
  const [submitBtnEnabled, setSubmitBtnEnabled] = useState(true);
  const [printBtnEnabled, setPrintBtnEnabled] = useState(false);
  const [draftBtnEnabled, setDraftBtnEnabled] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const { organizationDetails, locationDetails, userDetails, token, userCd } =
    useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    genDate: currentDate.format(dateFormat),
    genName: userDetails.firstName + " " + userDetails.lastName,
    issueDate: currentDate.format(dateFormat),
    issueName: "",
    approvedDate: currentDate.format(dateFormat),
    approvedName: "",
    returnNoteNo: "string",
    returnNoteDt: currentDate.format(dateFormat),
    processId: "",
    issueNoteNo: "",
    issueNoteDt: currentDate.format(dateFormat),
    type: "",
    regionalCenterCd: organizationDetails?.id,
    regionalCenterName: organizationDetails?.organizationName,
    address: organizationDetails.locationAddr,
    zipcode: locationDetails.zipcode,
    consumerName: "",
    contactNo: "",
    termsCondition: "",
    note: "",
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

  const handleIssueNoteNoChange = async (value) => {
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

          regionalCenterCd: processData?.crRegionalCenterCd,
          regionalCenterName: processData?.crRegionalCenterName,
          address: processData?.crAddress,
          zipcode: processData?.crZipcode,

          processId: processData?.processId,
          issueNoteDt: processData?.issueNoteDt || processData?.issueDate,
          consumerName: processData?.consumerName,
          contactNo: processData?.contactNo,

          termsCondition: processData?.termsCondition,
          note: processData?.note,

          items: itemList.map((item) => ({
            srNo: item?.sNo,
            id: item?.id || "Null",
            itemId: item?.itemId,
            itemCode: item?.itemCode,
            itemDesc: item?.itemDesc,
            uom: parseInt(item?.uom),
            uomDesc: uomObj[parseInt(item.uom)],
            returnedAfterDays: daysDifference(
              processData.issueNoteDt || processData?.issueDate,
              formData.returnNoteDt
            ),
            quantity: item?.quantity,
            noOfDays: item?.requiredDays,
            remarks: item?.remarks,
            conditionOfGoods: item?.conditionOfGoods,
            budgetHeadProcurement: item?.budgetHeadProcurement,
            locatorId: item?.locatorId,
          })),
        }));
      // Handle response data as needed
    } catch (error) {
      console.error("Error fetching sub process details:", error);
    }
  };

  const onFinish = async (values) => {
    setPrintBtnEnabled(false);
    if (!formData.genName || !formData.approvedName) {
      message.error("Please fill all the fields.");
      return;
    }
    try {
      const formDataCopy = { ...formData };

      // Ensure all fields are present
      const allFields = [
        "genDate",
        "genName",
        "issueDate",
        // "issueName",
        "approvedDate",
        "approvedName",
        "returnNoteNo",
        "returnNoteDt",
        "processId",
        "issueNoteNo",
        "issueNoteDt",
        "type",
        "regionalCenterCd",
        "regionalCenterName",
        "address",
        "zipcode",
        "consumerName",
        "contactNo",
        "termsCondition",
        "note",
        "items",
        "userId",
      ];

      allFields.forEach((field) => {
        if (!(field in formDataCopy)) {
          formDataCopy[field] = "";
        }
      });

      const apiUrl = "/saveReturnNote";
      const response = await axios.post(
        apiUrl,
        formDataCopy,
        apiHeader("POST", token)
      );
      // Handle success response here
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
            returnNoteNo: processId,
          };
        });
        setSuccessMessage(
          `Return Note successfully! Return Note : ${processId}, Process Type: ${processType}, Sub Process ID: ${subProcessId}`
        );
        setIsModalOpen(true);
        setDraftBtnEnabled(false);
        setPrintBtnEnabled(true);
        localStorage.removeItem("rnDraft");
      } else {
        // Display a generic success message if specific data is not available
        message.error("Failed to Return Note. Please try again later.");
        setSubmitBtnEnabled(true);
      }
    } catch (error) {
      message.error("Error saving Return Note:");
      setSubmitBtnEnabled(true);
      // Handle error response here
    }
  };

  useEffect(() => {
    if (formBodyRef.current) formBodyRef.current.updateField(formData);
  }, [formData]);

  // when form is loaded and it is redirect by pressing print option on txn summary
  useEffect(() => {
    const txnData = location.state;

    if (txnData && txnData.data && txnData.itemList) {
      setFormData({
        ...txnData?.data,
        returnNoteNo: txnData.data.processId,
        issueNoteNo: txnData.data.processId,
        processType: txnData?.data?.type,
        processTypeDesc:
          txnData?.data?.type === "IRP"
            ? "Issue Return Process"
            : txnData?.data?.type === "NIRP"
            ? "Non Returnable"
            : txnData?.data?.type === "PO"
            ? "Purchase Order"
            : "Inter Org Transfer",
        items: txnData.itemList.map((item) => {
          return {
            ...item,
            returnedAfterDays: daysDifference(
              txnData.data.issueNoteDt,
              txnData.data.genDate
            ),
          };
        }),
      });

      setDraftBtnEnabled(false);
      setSubmitBtnEnabled(false);
      setPrintBtnEnabled(true);
      setIsTxnData(true);
    }
  }, [location.state]);

  // when form is loaded and a form is saved as draft
  useEffect(() => {
    const formData = localStorage.getItem("rnDraft");
    if (formData) {
      setFormData(JSON.parse(formData));
      message.success("Form data loaded from draft.");
    }
  }, []);

  return (
    <>
      <FormContainer ref={formRef}>
        <FormHeading
          formTitle="Return Note"
          date={formData.returnNoteDt}
          txnNo={
            formData.returnNoteNo === "string" ? "" : formData.returnNoteNo
          }
          txnType="RN"
        />
        <FormBody formData={formData} ref={formBodyRef}>
          <CrCeDtlContainer>
            <RegionalCenterDetails
              heading="Consignor Details"
              cdName="regionalCenterCd"
              rcName="regionalCenterName"
              adrName="address"
              zipName="zipcode"
              readOnly
            />
            <ConsumerDetails handleChange={handleChange} readOnly={isTxnData} />
            <OtherDetails>
              <FormSearchItem
                label="Issue Note No."
                onSearch={handleIssueNoteNoChange}
                name="issueNoteNo"
                onChange={handleChange}
                readOnly={isTxnData}
              />
              <FormInputItem
                label="Issue Note Date"
                name="issueNoteDt"
                readOnly
              />
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
                    label="Return Quantity"
                    name={["items", key, "quantity"]}
                    onChange={(fName, value) =>
                      itemHandleChange(fName, value, key, setFormData)
                    }
                    readOnly={isTxnData}
                  />
                  <FormInputItem
                    label="Returned After Days"
                    name={["items", key, "returnedAfterDays"]}
                    readOnly
                  />
                  <FormInputItem
                    label="Condition Of Goods"
                    name={["items", key, "conditionOfGoods"]}
                    readOnly={isTxnData}
                    onChange={(fName, value) =>
                      itemHandleChange(fName, value, key, setFormData)
                    }
                  />
                  <FormInputItem
                    label="Remarks"
                    name={["items", key, "remarks"]}
                    readOnly={isTxnData}
                    onChange={(fName, value) =>
                      itemHandleChange(fName, value, key, setFormData)
                    }
                  />
                  <Button
                    icon={<DeleteOutlined />}
                    className="delete-button"
                    onClick={() => removeItem(key, setFormData)}
                    style={
                      isTxnData ? { display: "none" } : { display: "block" }
                    }
                  />
                </div>
              </div>
            ))}
          </ItemDetailsContainer>
          <TermsConditionContainer
            termsConditionVisible
            noteVisible
            handleChange={handleChange}
            readOnly={isTxnData}
          />
          <DesignationContainer
            genByVisible
            approvedVisible
            genDateValue={formData.genDate} 
            approvedDateValue={formData.approvedDate}
            formType="RN"
            handleChange={handleChange}
            readOnly={isTxnData}
          />
          <ButtonContainer
            onFinish={onFinish}
            submitBtnEnabled={submitBtnEnabled}
            printBtnEnabled={printBtnEnabled}
            draftBtnEnabled={draftBtnEnabled}
            draftDataName="rnDraft"
            formData={formData}
          />
        </FormBody>

        <Modal
          title="Issue note saved successfully"
          open={isModalOpen}
          onOk={handleOk}
        >
          {successMessage && <p>{successMessage}</p>}
        </Modal>
      </FormContainer>
    </>
  );
};

export default RetunNote;
