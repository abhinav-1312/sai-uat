// InwardGatePass.js
import React, { useState, useEffect, useRef, useMemo } from "react";
import { Button, message, Modal } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import axios from "axios";
import {
  apiCall,
  apiHeader,
  itemHandleChange,
  mergeItemMasterAndOhq,
  removeItem,
} from "../../../utils/Functions";
import FormInputItem from "../../../components/FormInputItem";
import { useDispatch, useSelector } from "react-redux";
import useHandlePrint from "../../../components/useHandlePrint";
import { useLocation } from "react-router-dom";
import { fetchOhq } from "../../../redux/slice/ohqSlice";
import FormBody from "../../../components/FormBody";
import FormHeading from "../../../components/FormHeading";
import ConsumerDetails from "../../../components/ConsumerDetails";
import OtherDetails from "../../../components/OtherDetails";
import RegionalCenterDetails from "../../../components/RegionalCenterDetails";
import FormSelectItem from "../../../components/FormSelectItem";
import SupplierDetails from "../../../components/SupplierDetails";
import FormSearchItem from "../../../components/FormSearchItem";
import InputDatePickerCombo from "../../../components/InputDatePickerCombo";
import ItemDetailsContainer from "../../../components/ItemDetailsContainer";
import CrCeDtlContainer from "../../../components/CrCeDtlContainer";
import FormContainer from "../../../components/FormContainer";
import TermsConditionContainer from "../../../components/TermsConditionContainer";
import DesignationContainer from "../../../components/DesignationContainer";
import ButtonContainer from "../../../components/ButtonContainer";
import {
  processTypeGrnOptionList,
} from "../../../utils/KeyValueMapping";

const currentDate = dayjs();
const dateFormat = "DD/MM/YYYY";

const iopTypeOptionList = [
  {
      value: "Accepted Items",
      desc: "Issued Items"
  },
  {
      value: "Rejected Items",
      desc: "Rejected Items"
  }
]

const InwardGatePass = () => {
  const location = useLocation();
  const dispatch = useDispatch();

  const formRef = useRef();
  const formBodyRef = useRef();
  const handlePrint = useHandlePrint(formRef);

  const { organizationDetails, locationDetails, userDetails, token, userCd } =
    useSelector((state) => state.auth);
  const { uomObj } = useSelector((state) => state.uoms);
  const { locatorObj } = useSelector((state) => state.locators);
  const { data: itemData } = useSelector((state) => state.item);
  const { data: ohqData } = useSelector((state) => state.ohq);

  const data = useMemo(
    () => mergeItemMasterAndOhq(itemData, ohqData, "IGP"),
    [itemData, ohqData]
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const [printBtnEnabled, setPrintBtnEnabled] = useState(false);
  const [submitBtnEnabled, setSubmitBtnEnabled] = useState(true);
  const [draftBtnEnabled, setDraftBtnEnabled] = useState(true);
  const [isTxnData, setIsTxnData] = useState(false);

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
      message.error("Error fetching vendor.")
    }
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
    if (fieldName === "supplierCode") {
      searchVendor(value);
      return;
    }

    setFormData((prevValues) => ({
      ...prevValues,
      [fieldName]: value === "" ? null : value,
    }));
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
          `Inward gate pass saved successfully! \n Process ID : ${processId}, \n Process Type: ${processType}, \n Sub Process ID: ${subProcessId}`
        );
        setIsModalOpen(true);
        setPrintBtnEnabled(true);
        setIsModalOpen(true);
        setDraftBtnEnabled(false);
        localStorage.removeItem("igpDraft");
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

  const handleInwardDataSearch = async (value, rejectProcess = false) => {
    const payloadObj = {
      processId: value,
      processStage: "OGP",
      rejectProcess: rejectProcess ? true : false,
    };

    const data = await apiCall("POST", "/getSubProcessDtls", token, payloadObj);
    const { responseStatus, responseData } = data;
    const { processData, itemList } = responseData;
    if (data && responseStatus && responseStatus.message === "Success") {
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
        processType: processData?.type,
        processTypeDesc:
          processData?.type === "IRP"
            ? "Issue Return Process"
            : processData?.type === "PO"
            ? "Purchase Order"
            : "Inter Org Transfer",

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
    } else {
      message.error(responseStatus.errorType);
    }
  };

  useEffect(() => {
    if (formBodyRef.current) formBodyRef.current.updateField(formData);
  }, [formData]);

  // when form is loaded and a form is saved as draft
  useEffect(() => {
    const formData = localStorage.getItem("igpDraft");
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
        gatePassNo: txnData.data.processId,
        outwardGatePass: txnData.data.processId,
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

  useEffect(() => {
    dispatch(fetchOhq());
  }, [dispatch]);

  if (!locatorObj || !ohqData || !itemData || !uomObj) {
    return <h2> Loading please wait...</h2>;
  }

  console.log("Data: ", data)

  return (
    <FormContainer onFinish={onFinish} ref={formRef}>
      <FormHeading
        formTitle="Inward Gate Pass"
        txnType="IGP"
        date={formData.gatePassDate}
        txnNo={formData.gatePassNo === "string" ? "" : formData.gatePassNo}
      />
      <FormBody formData={formData} ref={formBodyRef}>
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

          {formData.type === "PO" && (
            <SupplierDetails handleChange={handleChange} readOnly={isTxnData} />
          )}

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
                label="Outward Gate Pass No."
                name="outwardGatePass"
                onSearch={(value) => handleInwardDataSearch(value)}
                onChange={handleChange}
                readOnly={isTxnData}
              />
            )}

            {formData.type === "PO" && (
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
                  inputLabel="Delivery Mode"
                  inputName="modeOfDelivery"
                  onChange={handleChange}
                  dateLabel="Delivery Date"
                  dateName="dateOfDelivery"
                  dateValue={formData.dateOfDelivery}
                  readOnly={isTxnData}
                />
              </>
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
                  onSearch={(value) => handleInwardDataSearch(value)}
                  onChange={handleChange}
                  readOnly={isTxnData}
                />
              )}
            {formData.processType === "IOP" &&
              formData.noteType !== "Accepted Items" && (
                <FormSearchItem
                  label="Outward Gate Pass No."
                  name="outwardGatePass"
                  onSearch={(value) => handleInwardDataSearch(value, true)}
                  onChange={handleChange}
                  readOnly={isTxnData}
                />
              )}
          </OtherDetails>
        </CrCeDtlContainer>
        <ItemDetailsContainer
          itemSearch={(formData.type === "PO" && !isTxnData) ? true : false}
          itemArray={data}
          setFormData={setFormData}
        >
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

                  {formData.type !== "IOP" && (
                    <FormInputItem
                      label="Locator Description"
                      name={["items", key, "locatorDesc"]}
                      readOnly={true}
                    />
                  )}

                  <FormInputItem
                    label="Quantity"
                    name={["items", key, "quantity"]}
                    onChange={(fieldName, value) =>
                      itemHandleChange(fieldName, value, key, setFormData)
                    }
                    readOnly={isTxnData}
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
                  style={{ display: isTxnData ? "none" : "block" }}
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
        />
        <ButtonContainer
          handlePrint={handlePrint}
          onFinish={onFinish}
          submitBtnEnabled={submitBtnEnabled}
          printBtnEnabled={printBtnEnabled}
          draftDataName="igpDraft"
          formData={formData}
          draftBtnEnabled={draftBtnEnabled}
          disabled={isTxnData}
        />
      </FormBody>

      <Modal
        title="Inward Gate Pass saved successfully"
        open={isModalOpen}
        onOk={handleOk}
      >
        {successMessage && <p>{successMessage}</p>}
      </Modal>
    </FormContainer>
  );
};

export default InwardGatePass;
