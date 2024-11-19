// IssueNote.js
import React, { useState, useEffect, useRef, useMemo } from "react";
import { Button, message, Modal } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import axios from "axios";

import {
  apiHeader,
  removeItem,
  mergeItemMasterAndOhq,
  itemHandleChange,
} from "../../../utils/Functions";
import FormInputItem from "../../../components/FormInputItem";
import { useDispatch, useSelector } from "react-redux";
import FormDatePickerItem from "../../../components/FormDatePickerItem";
import useHandlePrint from "../../../components/useHandlePrint";
import { fetchOhq } from "../../../redux/slice/ohqSlice";
import { useLocation } from "react-router-dom";
import Loader from "../../../components/Loader";
import FormContainer from "../../../components/FormContainer";
import FormHeading from "../../../components/FormHeading";
import FormBody from "../../../components/FormBody";
import CrCeDtlContainer from "../../../components/CrCeDtlContainer";
import RegionalCenterDetails from "../../../components/RegionalCenterDetails";
import ConsumerDetails from "../../../components/ConsumerDetails";
import OtherDetails from "../../../components/OtherDetails";
import FormSelectItem from "../../../components/FormSelectItem";
import { processTypeIsnOptionList } from "../../../utils/KeyValueMapping";
import ItemDetailsContainer from "../../../components/ItemDetailsContainer";
import TermsConditionContainer from "../../../components/TermsConditionContainer";
import DesignationContainer from "../../../components/DesignationContainer";
import ButtonContainer from "../../../components/ButtonContainer";
const dateFormat = "DD/MM/YYYY";

const currentDate = dayjs();

const IssueNote = () => {
  const { uomObj } = useSelector((state) => state.uoms);
  const { data: itemData } = useSelector((state) => state.item);
  const { data: ohqData } = useSelector((state) => state.ohq);
  const { data: orgMaster } = useSelector((state) => state.organizations);
  const { organizationDetails, locationDetails, userDetails, token, userCd } =
    useSelector((state) => state.auth);

  const formRef = useRef();
  const handlePrint = useHandlePrint(formRef);
  const formBodyRef = useRef();
  const dispatch = useDispatch();
  const location = useLocation();

  const data = useMemo(
    () => mergeItemMasterAndOhq(itemData, ohqData),
    [itemData, ohqData]
  );

  const [printBtnEnabled, setPrintBtnEnabled] = useState(false);
  const [submitBtnEnabled, setSubmitBtnEnabled] = useState(true);
  const [draftBtnEnabled, setDraftBtnEnabled] = useState(true);
  const [isTxnData, setIsTxnData] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const [formData, setFormData] = useState({
    genName: userDetails.firstName + " " + userDetails.lastName,
    genDate: currentDate.format(dateFormat),
    issueName: "",
    issueDate: currentDate.format(dateFormat),
    approvedName: "",
    approvedDate: currentDate.format(dateFormat),
    demandNoteNo: "",
    demandNoteDt: currentDate.format(dateFormat),
    issueNoteNo: "string",
    issueNoteDt: currentDate.format(dateFormat),
    crRegionalCenterCd: organizationDetails?.id,
    crRegionalCenterName: organizationDetails?.organizationName,
    crAddress: organizationDetails.locationAddr,
    crZipcode: locationDetails.zipcode,
    userId: userCd,
    processType: "IRP",
    processTypeDesc: "Returnable",
    interRdDemandNote: "",
    type: "IRP",
    ceRegionalCenterCd: "",
    ceRegionalCenterName: "",
    ceAddress: "",
    ceZipcode: "",
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
      //   locatorId: ""
      // }
    ],
  });

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleChange = (fieldName, value) => {
    if (fieldName === "interRdDemandNote") {
      setFormData((prevValues) => {
        return {
          ...prevValues,
          interRdDemandNote: value,
          demandNoteNo: value,
        };
      });
      return;
    }
    if (fieldName === "processType") {
      setFormData((prevValues) => {
        return {
          ...prevValues,
          processType: value,
          type: value,
          processTypeDesc:
            value === "IRP"
              ? "Returnable"
              : value === "NIRP"
              ? "Non Returnable"
              : "Inter Org Transfer",
        };
      });
      return;
    }
    setFormData((prevValues) => ({
      ...prevValues,
      [fieldName]: value === "" ? null : value,
    }));
  };

  useEffect(() => {
    dispatch(fetchOhq());
  }, [dispatch]);

  const handleCeRccChange = async (_, value) => {
    setFormData((prev) => {
      return {
        ...prev,
        ceRegionalCenterCd: value,
      };
    });
    const url = "/master/getOrgMasterById";
    const { data } = await axios.post(
      url,
      { id: value, userId: userCd },
      apiHeader("POST", token)
    );

    const { responseStatus, responseData } = data;

    if (
      responseStatus.message === "Success" &&
      responseStatus.statusCode === 200
    ) {
      setFormData((prev) => {
        return {
          ...prev,
          ceRegionalCenterCd: responseData.id,
          ceRegionalCenterName: responseData.organizationName,
          ceAddress: responseData.locationAddr,
          ceZipcode: responseData.locationDetails.zipcode,
        };
      });
    }
  };

  const onFinish = async () => {
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
        "demandNoteNo",
        "issueNoteNo",
        "issueNoteDt",
        "type",
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
        "termsCondition",
        "note",
        "demandNoteDt",
        "userId",
        "processType",
        "interRdDemandNote",
      ];

      allFields.forEach((field) => {
        if (!(field in formDataCopy)) {
          formDataCopy[field] = "";
        }
      });

      const apiUrl = "/saveIssueNote";
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
            issueNoteNo: processId,
          };
        });
        setSuccessMessage(
          `Issue note saved successfully! Issue Note No : ${processId}, Process Type: ${processType}, Sub Process ID: ${subProcessId}`
        );
        setIsModalOpen(true)
        setPrintBtnEnabled(true);
        setDraftBtnEnabled(false);
        localStorage.removeItem("isnDraft")
      } else if (response.data.responseStatus.message === "Failed") {
        message.error(
          response.data.responseStatus.errorType || "Failed to save issue note."
        );
        setSubmitBtnEnabled(true);
      }
    } catch (error) {
      message.error("Failed to submit issue note. ");
      setPrintBtnEnabled(true);
    }
  };

    // when form is loaded and it is redirect by pressing print option on txn summary
    useEffect(() => {
      const txnData = location.state;
  
      if (txnData && txnData.data && txnData.itemList) {
        setFormData({
          ...txnData?.data,
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
          items: txnData?.itemList,
        });
  
        setDraftBtnEnabled(false);
        setSubmitBtnEnabled(false);
        setPrintBtnEnabled(true);
        setIsTxnData(true);
      }
    }, [location.state]);

    const handleIsnQuantityChange = (fieldName, value, index) => {
      const {itemCode} = formData.items[index];
      const price = data?.find(item => item.itemMasterCd === itemCode)?.qtyList[0]?.price;

      setFormData(prev => {
        const updatedItems = prev.items;
        updatedItems[index].quantity = value;
        updatedItems[index].totalValue = (value*price).toFixed(2)
        return {
          ...prev,
          items: updatedItems
        }
      })
    }
  
    // when form is loaded and a form is saved as draft
    useEffect(() => {
      const formData = localStorage.getItem("isnDraft");
      if (formData) {
        setFormData(JSON.parse(formData));
        message.success("Form data loaded from draft.");
      }
    }, []);

  useEffect(() => {
    if (formBodyRef.current) formBodyRef.current.updateField(formData);
  }, [formData]);

  if (!orgMaster) {
    return <Loader />;
  }
  return (
    <>
      <FormContainer ref={formRef}>
        <FormHeading
          formTitle="Issue Note"
          date={formData.issueNoteDt}
          txnNo={formData.issueNoteNo}
          txnType="ISN"
        />
        <FormBody formData={formData} ref={formBodyRef}>
          <CrCeDtlContainer>
            <RegionalCenterDetails
              heading="Consignor Details"
              cdName="crRegionalCenterCd"
              rcName="crRegionalCenterName"
              adrName="crAddress"
              zipName="crZipcode"
              readOnly
            />

            {formData.type === "IRP" || formData.type === "NIRP" ? (
              <ConsumerDetails
                handleChange={handleChange}
                readOnly={isTxnData}
              />
            ) : (
              <RegionalCenterDetails
                heading="Consignee Details"
                cdName="ceRegionalCenterCd"
                rcName="ceRegionalCenterName"
                adrName="ceAddress"
                zipName="ceZipcode"
                readOnly={isTxnData}
                handleChange={handleCeRccChange}
              />
            )}

            <OtherDetails>
              <FormSelectItem
                name="processTypeDesc"
                label="Type"
                onChange={handleChange}
                optionArray={processTypeIsnOptionList}
                formField="processType"
                readOnly={isTxnData}
              />
              <FormInputItem
                label="Demand Note No."
                name="demandNoteNo"
                onChange={handleChange}
                readOnly={isTxnData}
              />
              <FormDatePickerItem
                label="Demand Note Date"
                name="demandNoteDt"
                defaultValue={formData.demandNoteDt}
                onChange={handleChange}
                readOnly={isTxnData}
              />
            </OtherDetails>
          </CrCeDtlContainer>

          <ItemDetailsContainer
            itemSearch
            itemArray={data}
            setFormData = {setFormData}
          >
            {formData?.items?.map((item, key) => (
              <div className="each-item-detail-container">
                <div className="each-item-detail-container-grid">
                  <FormInputItem
                    label="S. No."
                    name={
                      item.srNo ? ["items", key, "srNo"] : ["items", key, "sNo"]
                    }
                    readOnly={isTxnData}
                  />
                  <FormInputItem
                    label="Item Code"
                    name={["items", key, "itemCode"]}
                    readOnly={isTxnData}
                  />
                  <FormInputItem
                    label="Item Description"
                    className="item-desc-cell"
                    name={["items", key, "itemDesc"]}
                    readOnly={isTxnData}
                  />
                  <FormInputItem
                    label="Unit of Measurement"
                    value={
                      item.uomDesc || (uomObj && uomObj[parseInt(item?.uom)])
                    }
                    readOnly={isTxnData}
                    name={["items", key, "uomDesc"]}
                  />

                  <FormInputItem
                    label={"Required Quantity"}
                    value={item.quantity}
                    name={["items", key, "quantity"]}
                    onChange={(fieldName, value) => handleIsnQuantityChange(fieldName, value, key)}
                    readOnly={isTxnData}
                  />
                  <FormInputItem
                    label={"Total Value"}
                    value={item.totalValue}
                    name={["items", key, "totalValue"]}
                    // onChange={(fieldName, value) => handleIsnQuantityChange(fieldName, value, key)}
                    readOnly={isTxnData}
                  />
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
                    readOnly={isTxnData}
                  />
                  <FormInputItem
                    label="Remarks"
                    value={item.remarks}
                    name={["items", key, "remarks"]}
                    onChange={(fieldName, value) =>
                      itemHandleChange(fieldName, value, key, setFormData)
                    }
                    readOnly={isTxnData}
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
            issueVisible
            genDateValue={formData.genDate} 
            issueDateValue={formData.issueDate}
            approvedDateValue={formData.approvedDate}
            processType={formData.processType}
            handleChange={handleChange}
            readOnly={isTxnData}
          />
          <ButtonContainer
            handlePrint={handlePrint}
            onFinish={onFinish}
            submitBtnEnabled={submitBtnEnabled}
            printBtnEnabled={printBtnEnabled}
            draftDataName="isnDraft"
            formData={formData}
            draftBtnEnabled={draftBtnEnabled}
            disabled={isTxnData}
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

export default IssueNote;
