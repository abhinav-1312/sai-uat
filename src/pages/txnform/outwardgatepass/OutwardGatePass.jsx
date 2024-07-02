// OutwardGatePass.js
import React, { useState, useEffect, useRef } from "react";
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
import { apiHeader, removeItem } from "../../../utils/Functions";
import FormInputItem from "../../../components/FormInputItem";
import FormDatePickerItem from "../../../components/FormDatePickerItem";
import { useDispatch, useSelector } from "react-redux";
import useHandlePrint from "../../../components/useHandlePrint";
import { useLocation, useNavigate } from "react-router-dom";
import { fetchUoms } from "../../../redux/slice/uomSlice";
const dateFormat = "DD/MM/YYYY";
const { Option } = Select;
const { TextArea } = Input;

const convertEpochToDateString = (epochTime) => {
  // Convert epoch time to milliseconds
  let date = new Date(epochTime);

  // Extract the day, month, and year from the Date object
  let day = date.getDate();
  let month = date.getMonth() + 1; // Month starts from 0
  let year = date.getFullYear();

  // Add leading zeros if needed
  if (day < 10) {
    day = "0" + day;
  }
  if (month < 10) {
    month = "0" + month;
  }

  // Return the date string in DD/MM/YYYY format
  return `${day}/${month}/${year}`;
};

const OutwardGatePass = () => {
  const [printBtnEnabled, setPrintBtnEnabled] = useState(false);
  const [submitBtnEnabled, setSubmitBtnEnabled] = useState(true);
  const [form] = Form.useForm();

  const outwardData = JSON.parse(localStorage.getItem("outwardData"));

  const formRef = useRef();
  const handlePrint = useHandlePrint(formRef);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [formData, setFormData] = useState({
    genDate: "",
    genName: "",
    issueDate: "",
    issueName: "",
    approvedDate: "",
    approvedName: "",
    processId: "not defined",
    type: outwardData?.type || "IRP",
    processType: outwardData?.type || "IRP",
    processTypeDesc: outwardData
      ? outwardData?.type === "IRP"
        ? "Issue / Return"
        : outwardData?.type === "PO"
        ? "Purchase Order"
        : "Inter Org Transfer"
      : "Issue / Return",
    noteTypeDesc: outwardData?.noteType === "ISSUE" ? "Issue Note No." : "Rejection Note No.",
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
    supplierCd: "",
    supplierName: "",
    noteType: "",
    rejectionNoteNo: "",
    userId: "string",
    termsCondition: "",
    note: "",
    items: [
      // {
      //   "srNo": 0,
      //   "itemCode": "",
      //   "itemDesc": "",
      //   "uom": "",
      //   "quantity": 0,
      //   "noOfDays": 0,
      //   "remarks": "",
      //   "conditionOfGoods": "",
      //   "budgetHeadProcurement": "",
      //   "locatorId": ""
      // }
    ],
  });

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleChange = (fieldName, value) => {
    if (fieldName === "processType") {
      setFormData((prev) => {
        return {
          ...prev,
          processType: value,
          type: value,
        };
      });

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

  const { userDetails, token, userCd } = useSelector((state) => state.auth);

  const location = useLocation();

  const { ogpData, itemList } = location.state
    ? location.state
    : { ogpData: null, itemList: null };
  const { uomObj } = useSelector((state) => state.uoms);

  const dispatch = useDispatch();

  const [selectedOption, setSelectedOption] = useState(null)

  const handleSelectChange = (value) => {
    setFormData(prev => {
      return {
        ...prev,
        noteType: value
      }
    })
    setSelectedOption(value)
      // console.log("Select change: ", e)
  }

  useEffect(() => {
    if (ogpData !== null) {
      setFormData({
        ...ogpData,
        processTypeDesc:
          ogpData?.type === "IRP"
            ? "Issue / Return"
            : ogpData?.type === "PO"
            ? "Purchase Order"
            : "Inter Org Transfer",
        items: itemList,
      });
      return;
    }

    

    const outwardData = localStorage.getItem("outwardData");
    if (outwardData) {
      setFormData({ ...JSON.parse(outwardData) });
      return;
    }

    const fetchUom = async () => {
      await dispatch(fetchUoms()).unwrap();
    };
    fetchUom();

    const fetchUserDetails = () => {
      const currentDate = dayjs();
      setFormData({
        genName: userDetails.firstName + " " + userDetails.lastName,
        userId: userCd,
        genDate: currentDate.format(dateFormat),
        issueDate: currentDate.format(dateFormat),
        approvedDate: currentDate.format(dateFormat),
        gatePassDate: currentDate.format(dateFormat),
        gatePassNo: "not defined",
        noaDate: currentDate.format(dateFormat),
        dateOfDelivery: currentDate.format(dateFormat),
        type: "IRP",
        processType: "IRP",

      });
    };

    fetchUserDetails();
  }, [
    dispatch,
    userCd,
    userDetails.firstName,
    userDetails.lastName,
    itemList,
    ogpData,
  ]);

  const handleIssueNoteNoChange = async (_, value) => {
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
      console.log("API Response:", response.data);
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
          `outward gate pass successfully! outward gate pass : ${processId}, Process Type: ${processType}, Sub Process ID: ${subProcessId}`
        );
        showModal();
        message.success(
          `outward gate pass successfully! Process ID: ${processId}, Process Type: ${processType}, Sub Process ID: ${subProcessId}`
        );

        setPrintBtnEnabled(true);
      } else {
        // Display a generic success message if specific data is not available
        message.error(
          response.data.responseStatus.errorType ||
            "Failed to outward gate pass. Please try again later."
        );
        setSubmitBtnEnabled(true);
      }

      // Handle success response here
    } catch (error) {
      console.error("Error saving outward gate pass:", error);
      message.error("Failed to outward gate pass. Please try again later.");
      setSubmitBtnEnabled(true);
      // Handle error response here
    }
  };

  const navigate = useNavigate();

  const handleFormReset = () => {
    message.success("OGP data reset successfully.");

    navigate("/trans/outward", { state: { ogpData: null, itemList: null } });

    window.location.reload();

    localStorage.removeItem("outwardData");
  };

  const handleReturnNoteNoChange = async (_, value) => {
    try {
      const apiUrl = "/getSubProcessDtls";
      const response = await axios.post(
        apiUrl,
        {
          processId: value,
          processStage: "REJ",
        },
        apiHeader("POST", token)
      );
      const { responseData } = response.data;
      const { processData, itemList } = responseData;

      if (responseData !== null) {
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
            ceRegionalCenterCd: processData?.crRegionalCenterCd,
            ceRegionalCenterName: processData?.crRegionalCenterName,
            ceAddress: processData?.crAddress,
            ceZipcode: processData?.crZipcode,
            crRegionalCenterCd: processData?.ceRegionalCenterCd,
            crRegionalCenterName: processData?.ceRegionalCenterName,
            crAddress: processData?.ceAddress,
            crZipcode: processData?.ceZipcode,
            consumerName: processData?.consumerName,
            supplierName: processData?.supplierName,
            supplierCd: processData?.supplierCd,
            address: processData?.address,
            contactNo: processData?.contactNo,
            note: processData?.note,
            noaDate: processData?.noaDate
              ? convertEpochToDateString(processData.noaDate)
              : "",
            noa: processData?.noa ? processData.noa : "",
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
            })),
          };
        });
      }
    } catch (error) {
      console.error("Error fetching sub process details:", error);
    }
  };

  const saveDraft = () => {
    localStorage.setItem("outwardData", JSON.stringify(formData));
    message.success("OGP data saved as draft successfully.");
  };


  return (
    <>
      <div className="a4-container" ref={formRef}>
        <div className="heading-container">
          <h4>
            OGP No. : <br />{" "}
            {ogpData ? formData.processId : formData.gatePassNo}
          </h4>
          <h2 className="a4-heading">
            Sports Authority Of India - Outward Gate Pass
          </h2>
          <h4>
            OGP Date. : <br /> {formData.gatePassDate}
          </h4>
        </div>

        <Form
          form={form}
          layout="vertical"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            margin: "0.5rem 0",
          }}
          initialValues={formData}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(10rem, 1fr))",
              gap: "1rem",
              marginTop: "1rem",
            }}
          >
            <div className="consignor-container">
              <h3 className="consignor-consignee-heading">
                {formData.type === "IRP" || formData.type === "IOP"
                  ? "Consignor Detail"
                  : "Consignee Detail"}
              </h3>
              <FormInputItem
                readOnly={true}
                label="Regional Center Code"
                value={formData.crRegionalCenterCd}
              />
              <FormInputItem
                label="Regional Center Name"
                value={formData.crRegionalCenterName}
                readOnly={true}
              />
              <FormInputItem
                label="Address"
                value={formData.crAddress}
                readOnly={true}
              />
              <FormInputItem
                label="Zipcode"
                value={formData.crZipcode}
                readOnly={true}
              />
            </div>

            <div className="consignee-container">
              <h3 className="consignor-consignee-heading">
                {formData.type === "IRP" || formData.type === "IOP"
                  ? "Consignee Details"
                  : "Consignor Details"}
              </h3>

              {formData.type === "IRP" && (
                <>
                  <FormInputItem
                    label="Consumer Name"
                    name="consumerName"
                    value={formData.consumerName}
                    onChange={handleChange}
                    readOnly={true}
                  />
                  <FormInputItem
                    label="Contact No."
                    name="contactNo"
                    value={formData.contactNo}
                    onChange={handleChange}
                    readOnly={true}
                  />
                </>
              )}
              {formData.type === "IOP" && (
                <>
                  <FormInputItem
                    label="Regional Center Code"
                    name="ceRegionalCenterCd"
                    value={formData.ceRegionalCenterCd}
                    // onChange={handleCeRccChange}
                    readOnly={true}
                  />
                  <FormInputItem
                    label="Regional Center Name"
                    name="ceRegionalCenterName"
                    value={formData.ceRegionalCenterName}
                    readOnly={true}
                  />
                  <FormInputItem
                    label="Address"
                    value={formData.ceAddress}
                    name="ceAddress"
                    readOnly={true}
                  />
                  <FormInputItem
                    label="Zipcode"
                    value={formData.ceZipcode}
                    name="ceZipcode"
                    readOnly={true}
                  />
                </>
              )}

              {formData.type === "PO" && (
                <>
                  <FormInputItem
                    label="Supplier Code"
                    value={formData.supplierCd}
                    name="supplierCd"
                    readOnly={true}
                  />
                  <FormInputItem
                    label="Supplier Name"
                    value={formData.supplierName}
                    name="supplierName"
                    readOnly={true}
                  />
                  <FormInputItem
                    label="Address"
                    value={formData.ceAddress}
                    name="ceAddress"
                    readOnly={true}
                  />
                </>
              )}
            </div>

            <div className="other-container">
              <h3 className="consignor-consignee-heading">Other Details</h3>

              <Form.Item label="Type" name="processTypeDesc">
                {ogpData !== null ? (
                  <>
                    <Input value={formData.processTypeDesc} readOnly={true} />
                    <Input
                      value={
                        ogpData.type === "IRP"
                          ? "Issue/Return"
                          : ogpData.type === "PO"
                          ? "Purchase Order"
                          : "Inter Org Transfer"
                      }
                      readOnly={true}
                      style={{ display: "none" }}
                    />
                  </>
                ) : (
                  <Select
                    onChange={(value) => handleChange("processType", value)}
                    // value={formData.type}
                  >
                    <Option value="IRP">Issue/Return</Option>
                    <Option value="PO">Purchase Order</Option>
                    <Option value="IOP">Inter-Org Transaction</Option>
                  </Select>
                )}
              </Form.Item>

              {formData.type === "IRP" && (
                <FormInputItem
                  label="Issue Note No."
                  name="issueNoteNo"
                  value={formData.processId}
                  onChange={handleIssueNoteNoChange}
                  readOnly={ogpData !== null}
                />
              )}

              {formData.type === "PO" && (
                <FormInputItem
                  label="Rejection Note no."
                  name="rejectionNoteNo"
                  value={formData.rejectionNoteNo}
                  onChange={handleReturnNoteNoChange}
                />
              )}

              {formData.type === "IOP" && (
                <>
                  <Form.Item label="Select Note Type" name="noteTypeDesc">
                    {
                      ogpData !== null ?
                      <FormInputItem value={formData.noteTypeDesc} readOnly={true} />
                      :
                    <Select onChange={handleSelectChange} value={formData.noteType}>
                      <Option value="ISSUE">Issue Note No.</Option>
                      <Option value="REJECTION">Rejection Note No.</Option>
                    </Select>
                    }
                  </Form.Item>
                  {selectedOption === "ISSUE" && (
                    <FormInputItem
                  label="Issue Note No."
                  name="issueNoteNo"
                  value={formData.processId}
                  onChange={handleIssueNoteNoChange}
                  readOnly={ogpData !== null}
                />
                  )
                } {selectedOption === "REJECTION" &&
                  (
                    // <Form.Item
                    //   label="Rejection Note No"
                    //   name="rejectionNoteNo"
                    // >
                    //   <Input
                    //     onChange={(e) =>
                    //       handleReturnNoteNoChange(e.target.value)
                    //     }
                    //   />
                    // </Form.Item>

                    <FormInputItem label = "Rejection Note No." name = "rejectionNoteNo" onChange = {handleReturnNoteNoChange} />
                  )}
                </>
              )}

              {(formData.type === "PO" || formData.type === "IOP") && (
                <>
                  <FormInputItem
                    label="Noa No"
                    name="noaNo"
                    value={formData.noaNo}
                    onChange={handleChange}
                    readOnly={ogpData !== null}
                  />

                  {
                    ogpData !== null ? 
                    <FormInputItem label = "Noa Date" value = {formData.noaDate} readOnly={ogpData !== null} />
                    :
                  <FormDatePickerItem
                    label="Noa Date"
                    name="noaDate"
                    value={formData.noaDate}
                    onChange={handleChange}
                  />
                  }
                  <FormInputItem
                    label="Mode Of Delivery"
                    name="modeOfDelivery"
                    value={formData.modeOfDelivery}
                    onChange={handleChange}
                    readOnly={ogpData !== null}
                  />
                  {
                    ogpData !== null ?
                    <FormInputItem label = "Date Of Delivery" value = {formData.dateOfDelivery} readOnly={ogpData !== null} />
                    :
                  <FormDatePickerItem
                    label="Date Of Delivery"
                    name="dateOfDelivery"
                    value={formData.dateOfDelivery}
                    onChange={handleChange}
                  />
                  }
                  <FormInputItem
                    label="Challan / Invoice No."
                    name="challanNo"
                    value={formData.challanNo}
                    onChange={handleChange}
                    readOnly={ogpData !== null}
                  />
                </>
              )}
            </div>
          </div>

          <div className="item-details-container">
            <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
              <h3>Item Details</h3>
            </div>

            {formData?.items?.length > 0 &&
              formData.items.map((item, key) => {
                return (
                  <div className="each-item-detail-container">
                    <div className="each-item-detail-container-grid">
                      <FormInputItem
                        label="S. No."
                        value={item.srNo || item?.sNo}
                        readOnly={true}
                      />
                      <FormInputItem
                        label="Item Code"
                        value={item.itemCode}
                        readOnly={true}
                      />
                      <FormInputItem
                        label="Item Description"
                        className="item-desc-cell"
                        value={item.itemDesc}
                        readOnly={true}
                      />
                      <FormInputItem
                        label="Unit of Measurement"
                        value={
                          item.uomDesc ||
                          (uomObj && uomObj[parseInt(item?.uom)])
                        }
                        readOnly={true}
                      />

                      <FormInputItem
                        name="quantity"
                        label={
                          formData.type === "IRP"
                            ? "Required Quantity"
                            : "Quantity"
                        }
                        value={item.quantity}
                        readOnly={true}
                      />

                      {(formData.type === "IRP" || formData.type === "IOP") && (
                        <FormInputItem
                          name="noOfDays"
                          label="Req. For No. Of Days"
                          value={item.noOfDays || item.requiredDays}
                          onChange={(fieldName, value) =>
                            itemHandleChange(fieldName, value, key)
                          }
                          readOnly={true}
                        />
                      )}

                      <FormInputItem
                        name="remarks"
                        label="Remarks"
                        value={item.remarks}
                        onChange={(fieldName, value) =>
                          itemHandleChange(fieldName, value, key)
                        }
                        readOnly={ogpData !== null}
                      />
                      <Button
                        icon={<DeleteOutlined />}
                        className="delete-button"
                        onClick={() => removeItem(key, setFormData)}
                        disabled={ogpData !== null}
                      />
                    </div>
                  </div>
                );
              })}
          </div>

          <div className="terms-condition-container">
            <div>
              <h3>Terms And Conditions</h3>
              <TextArea
                autoSize={{ minRows: 4, maxRows: 16 }}
                value={formData.termsCondition}
                onChange={(e) => handleChange("termsCondition", e.target.value)}
                readOnly={ogpData !== null}
              />
            </div>
            <div>
              <h3>Note</h3>
              <TextArea
                autoSize={{ minRows: 4, maxRows: 16 }}
                value={formData.note}
                onChange={(e) => handleChange("note", e.target.value)}
                readOnly={ogpData !== null}
              />
            </div>
          </div>

          <div className="designations-container">
            <div className="each-desg">
              <h4> Generated By </h4>
              <FormInputItem
                placeholder="Name and Designation"
                name="genName"
                value={formData.genName}
                readOnly={ogpData !== null}
              />
              {ogpData !== null ? (
                <FormInputItem
                  value={formData.genDate}
                  readOnly={ogpData !== null}
                />
              ) : (
                <FormDatePickerItem
                  defaultValue={dayjs()}
                  name="genDate"
                  onChange={handleChange}
                  value={formData.genDate}
                  readOnly={ogpData !== null}
                />
              )}
            </div>
            <div className="each-desg">
              <h4>{formData.type === "PO" ? "Received By" : "Verified By"} </h4>
              <FormInputItem
                placeholder="Name and Signature"
                name="issueName"
                value={formData.issueName}
                onChange={handleChange}
                readOnly={ogpData !== null}
              />

              {ogpData !== null ? (
                <FormInputItem
                  value={formData.issueDate}
                  readOnly={ogpData !== null}
                />
              ) : (
                <FormDatePickerItem
                  defaultValue={dayjs()}
                  name="issueDate"
                  onChange={handleChange}
                  value={formData.issueDate}
                  readOnly={ogpData !== null}
                />
              )}
            </div>
          </div>
          <div className="button-container">
            <Tooltip title="Clear form">
              <Button
                type="primary"
                danger
                icon={<UndoOutlined />}
                onClick={handleFormReset}
              >
                Reset
              </Button>
            </Tooltip>

            <Tooltip
              title={
                submitBtnEnabled
                  ? "Submit form"
                  : "Press reset button to enable submit."
              }
            >
              <Button
                onClick={onFinish}
                type="primary"
                style={{
                  backgroundColor: "#4CAF50",
                }}
                icon={<SaveOutlined />}
                disabled={ogpData ? true : !submitBtnEnabled}
                // disabled={true}
              >
                Submit
              </Button>
            </Tooltip>

            <Tooltip title={"Save the form as draft."}>
              <Button
                onClick={saveDraft}
                type="primary"
                style={{
                  backgroundColor: "#eed202",
                }}
                icon={<CloudDownloadOutlined />}
                disabled={ogpData !== null}
              >
                Save draft
              </Button>
            </Tooltip>

            <Tooltip
              title={
                printBtnEnabled
                  ? "Print form"
                  : "Submit the form to enable print."
              }
            >
              <Button
                onClick={handlePrint}
                type="primary"
                icon={<PrinterOutlined />}
                disabled={ogpData ? false : !printBtnEnabled}
              >
                Print
              </Button>
            </Tooltip>
          </div>
        </Form>
      </div>
      <Modal
        title="Issue note saved successfully."
        open={isModalOpen}
        onOk={handleOk}
      >
        {successMessage && <p>{successMessage}</p>}
      </Modal>
    </>
  );

  // return (
  // <div className="goods-receive-note-form-container" ref={formRef}>
  //   <h1>Sports Authority of India - Outward Gate Pass</h1>

  //   <Form
  //     onFinish={onFinish}
  //     className="goods-receive-note-form"
  //     onValuesChange={handleValuesChange}
  //     layout="vertical"
  //   >
  //     <Row>
  //       <Col span={6} offset={18}>
  //         <Form.Item label="DATE" name="gatePassDate">
  //           <DatePicker
  //             defaultValue={dayjs()}
  //             format={dateFormat}
  //             style={{ width: "100%" }}
  //             name="gatePassDate"
  //             onChange={(date, dateString) =>
  //               handleChange("gatePassDate", dateString)
  //             }
  //           />
  //         </Form.Item>
  //       </Col>
  //       <Col span={6}>
  //         <Form.Item label="TYPE" name="type">
  //           <Select onChange={(value) => handleChange("type", value)}>
  //             <Option value="IRP">1. Issue/Return</Option>
  //             <Option value="PO">2. Purchase Order</Option>
  //             <Option value="IOP">3. Inter-Org Transaction</Option>
  //           </Select>
  //         </Form.Item>
  //       </Col>
  //       <Col span={6} offset={12}>
  //         {/* <Form.Item label="OUTER GATE PASS NO." name="gatePassNo">
  //           <Input
  //             disabled
  //             onChange={(e) => handleChange("gatePassNo", e.target.value)}
  //           />
  //         </Form.Item> */}
  //         <FormInputItem
  //           label="OUTER GATE PASS NO."
  //           value={
  //             formData.gatePassNo === "string"
  //               ? "not defined"
  //               : formData.gatePassNo
  //           }
  //         />
  //       </Col>
  //     </Row>

  //     <Row gutter={24}>
  //       <Col span={8}>
  //         <Title strong underline level={2} type="danger">
  //           {Type === "IRP" || Type === "IOP"
  //             ? "CONSIGNOR DETAIL :-"
  //             : "CONSIGNEE DETAIL :-"}
  //         </Title>
  //         <Form.Item label="REGIONAL CENTER CODE :" name="crRegionalCenterCd">
  //           <Input value={formData.crRegionalCenterCd} readOnly />
  //           <div style={{ display: "none" }}>
  //             {formData.crRegionalCenterCd}
  //           </div>
  //         </Form.Item>
  //         <Form.Item
  //           label="REGIONAL CENTER NAME :"
  //           name="crRegionalCenterName"
  //         >
  //           <Input value={formData.crRegionalCenterName} />
  //           <div style={{ display: "none" }}>
  //             {formData.crRegionalCenterCd}
  //           </div>
  //         </Form.Item>
  //         <Form.Item label="ADDRESS :" name="crAddress">
  //           <Input value={formData.crAddress} />
  //           <div style={{ display: "none" }}>
  //             {formData.crRegionalCenterCd}
  //           </div>
  //         </Form.Item>
  //         <Form.Item label="ZIP CODE :" name="crZipcode">
  //           <Input value={formData.crZipcode} />
  //           <div style={{ display: "none" }}>{formData.crZipcode}</div>
  //         </Form.Item>
  //       </Col>
  //       <Col span={8}>
  //         <Title strong level={2} underline type="danger">
  //           {Type === "IRP" || Type === "IOP"
  //             ? "CONSIGNEE DETAIL :-"
  //             : "CONSIGNOR DETAIL :-"}
  //         </Title>

  //         {Type === "PO" && (
  //           <>
  //             <FormInputItem
  //               label="SUPPLIER CODE :"
  //               value={formData.supplierCd}
  //               readOnly={true}
  //             />
  //             <FormInputItem
  //               label="SUPPLIER NAME :"
  //               value={formData.supplierName}
  //               readOnly={true}
  //             />
  //             <FormInputItem
  //               label="ADDRESS :"
  //               value={formData.ceAddress}
  //               readOnly={true}
  //             />
  //           </>
  //         )}

  //         {Type === "IRP" && (
  //           <>
  //             <Form.Item
  //               label="CONSUMER NAME :"
  //               name="consumerName"
  //               initialValue={formData.consumerName}
  //             >
  //               <Input
  //                 value={formData.consumerName}
  //                 onChange={(e) =>
  //                   handleChange("consumerName", e.target.value)
  //                 }
  //               />
  //               <div style={{ display: "none" }}>{formData.crZipcode}</div>
  //             </Form.Item>
  //             <Form.Item
  //               label="CONTACT NO. :"
  //               name="contactNo"
  //               initialValue={formData.contactNo}
  //             >
  //               <Input
  //                 value={formData.contactNo}
  //                 onChange={(e) => handleChange("contactNo", e.target.value)}
  //               />
  //               <div style={{ display: "none" }}>{formData.crZipcode}</div>
  //             </Form.Item>
  //           </>
  //         )}

  //         {Type === "IOP" && (
  //           <>
  //             <Form.Item
  //               label="REGIONAL CENTER CODE :"
  //               name="ceRegionalCenterCd"
  //             >
  //               <Input
  //                 value={formData.ceRegionalCenterCd}
  //                 onChange={(e) =>
  //                   handleChange("ceRegionalCenterCd", e.target.value)
  //                 }
  //               />
  //               <div style={{ display: "none" }}>
  //                 {formData.ceRegionalCenterCd}
  //               </div>
  //             </Form.Item>
  //             <Form.Item
  //               label="REGIONAL CENTER NAME :"
  //               name="ceRegionalCenterName"
  //             >
  //               <Input
  //                 value={formData.ceRegionalCenterName}
  //                 onChange={(e) =>
  //                   handleChange("ceRegionalCenterName", e.target.value)
  //                 }
  //               />
  //               <div style={{ display: "none" }}>
  //                 {formData.ceRegionalCenterCd}
  //               </div>
  //             </Form.Item>
  //             <Form.Item label="ADDRESS :" name="ceAddress">
  //               <Input
  //                 value={formData.ceAddress}
  //                 onChange={(e) => handleChange("ceAddress", e.target.value)}
  //               />
  //               <div style={{ display: "none" }}>
  //                 {formData.ceRegionalCenterCd}
  //               </div>
  //             </Form.Item>
  //             <Form.Item label="ZIP CODE :" name="ceZipcode">
  //               <Input
  //                 value={formData.ceZipcode}
  //                 onChange={(e) => handleChange("ceZipcode", e.target.value)}
  //               />
  //               <div style={{ display: "none" }}>
  //                 {formData.ceRegionalCenterCd}
  //               </div>
  //             </Form.Item>
  //           </>
  //         )}
  //       </Col>
  //       <Col span={8}>
  //         <Form.Item></Form.Item>
  //         {Type === "IRP" && (
  //           <Form.Item label="ISSUE NOTE NO. :" name="issuenoteno">
  //             <Input
  //               onChange={(e) => handleIssueNoteNoChange(e.target.value)}
  //             />
  //           </Form.Item>
  //         )}
  //         {Type === "PO" && (
  //           <Form.Item label="REJECTION NOTE NO. :" name="rejectionNoteNo">
  //             <Input
  //               onChange={(e) => handleReturnNoteNoChange(e.target.value)}
  //             />
  //           </Form.Item>
  //         )}
  //         {Type === "IOP" && (
  //           <>
  //             <Form.Item label="SELECT NOTE TYPE :" name="noteType">
  //               <Select onChange={handleSelectChange}>
  //                 <Option value="ISSUE">ISSUE NOTE NO.</Option>
  //                 <Option value="REJECTION">REJECTION NOTE NO.</Option>
  //               </Select>
  //             </Form.Item>
  //             {selectedOption === "ISSUE" ? (
  //               <Form.Item label="ISSUE NOTE NO. :" name="issuenoteno">
  //                 <Input
  //                   onChange={(e) => handleIssueNoteNoChange(e.target.value)}
  //                 />
  //               </Form.Item>
  //             ) : (
  //               <Form.Item
  //                 label="REJECTION NOTE NO.  :"
  //                 name="rejectionNoteNo"
  //               >
  //                 <Input
  //                   onChange={(e) => handleReturnNoteNoChange(e.target.value)}
  //                 />
  //               </Form.Item>
  //             )}
  //           </>
  //         )}
  //         {Type === "PO" && (
  //           <>
  //             <FormInputItem label="NOA NO :" value={formData.noa} />
  //             <FormInputItem label="NOA DATE :" value={formData.noaDate} />
  //             <FormInputItem
  //               label="DATE OF DELIVERY :"
  //               value={formData.dateOfDelivery}
  //             />
  //           </>
  //         )}

  //         {Type === "IOP" && (
  //           <>
  //             <FormInputItem
  //               label="NOA NO :"
  //               name="noaNo"
  //               onChange={handleChange}
  //             />
  //             <FormDatePickerItem
  //               label="NOA DATE :"
  //               name="noaDate"
  //               onChange={handleChange}
  //             />
  //             <FormInputItem
  //               label="MODE OF DELIVERY :"
  //               name="modeOfDelivery"
  //               onChange={handleChange}
  //             />
  //             <FormDatePickerItem
  //               label="DATE OF DELIVERY :"
  //               name="dateOfDelivery"
  //               onChange={handleChange}
  //             />
  //             <FormInputItem
  //               label="CHALLAN / INVOICE NO. :"
  //               name="challanNo"
  //               onChange={handleChange}
  //             />
  //           </>
  //         )}
  //       </Col>
  //     </Row>
  //     {Type === "PO" && (
  //       <Row gutter={24}>
  //         <Col span={8}>
  //           <FormInputItem
  //             label="CHALLAN / INVOICE NO. :"
  //             value={formData.challanNo}
  //           />
  //         </Col>
  //         <Col span={8}>
  //           <FormInputItem
  //             label="MODE OF DELIVERY :"
  //             value={formData.modeOfDelivery}
  //           />
  //         </Col>
  //       </Row>
  //     )}
  //     {/* {(Type === "IOP") && (
  //       <Row gutter={24}>
  //         <Col span={8}>
  //         <FormInputItem label="CHALLAN / INVOICE NO. :" name="challanNo" onChange={handleChange} />
  //         </Col>
  //         <Col span={8}>
  //           <FormInputItem label="MODE OF DELIVERY :" name="modeOfDelivery" onChange={handleChange} />
  //         </Col>
  //       </Row>
  //     )} */}
  //     {/* Item Details */}
  //     <h2>ITEM DETAILS</h2>

  //     <Form.List name="items" initialValue={formData.items || [{}]}>
  //       {(fields, { add, remove }) => (
  //         <>
  //           {formData.items?.length > 0 &&
  //             formData.items.map((item, key) => {
  //               return (
  //                 // <div className="xyz" style={{font:"150px", zIndex: "100"}}>xyz</div>

  //                 <div
  //                   key={key}
  //                   style={{
  //                     marginBottom: 16,
  //                     border: "1px solid #d9d9d9",
  //                     padding: 16,
  //                     borderRadius: 4,
  //                     display: "grid",
  //                     gridTemplateColumns:
  //                       "repeat(auto-fit, minmax(200px, 1fr))",
  //                     gap: "20px",
  //                   }}
  //                 >
  //                   <Form.Item label="Serial No.">
  //                     <Input value={item.srNo} readOnly />
  //                   </Form.Item>

  //                   <Form.Item label="ITEM CODE">
  //                     <Input value={item.itemCode} readOnly />
  //                   </Form.Item>

  //                   <Form.Item label="ITEM DESCRIPTION">
  //                     <Input value={item.itemDesc} readOnly />
  //                   </Form.Item>

  //                   <Form.Item label="UOM">
  //                     <Input
  //                       value={findColumnValue(
  //                         item.uom,
  //                         uomMaster,
  //                         "uomMaster"
  //                       )}
  //                     />
  //                   </Form.Item>

  //                   {Type === "IRP" && (
  //                     <Form.Item label="LOCATOR DESCRIPITON">
  //                       <Input
  //                         value={findColumnValue(
  //                           item.locatorId,
  //                           locatorMaster,
  //                           "locatorMaster"
  //                         )}
  //                         readOnly
  //                       />
  //                     </Form.Item>
  //                   )}

  //                   <Form.Item
  //                     label={
  //                       Type === "IRP" ? "REQUIRED QUANTITY" : "QUANTITY"
  //                     }
  //                   >
  //                     <Input
  //                       value={item.quantity}
  //                       onChange={(e) =>
  //                         itemHandleChange("quantity", e.target.value, key)
  //                       }
  //                     />
  //                   </Form.Item>

  //                   {(Type === "IRP" || Type === "IOP") && (
  //                     <Form.Item label="REQUIRED FOR NO. OF DAYS">
  //                       <Input
  //                         value={item.noOfDays}
  //                         onChange={(e) =>
  //                           itemHandleChange("noOfDays", e.target.value, key)
  //                         }
  //                       />
  //                     </Form.Item>
  //                   )}

  //                   <Form.Item label="REMARK">
  //                     <Input
  //                       value={item.remarks}
  //                       onChange={(e) =>
  //                         itemHandleChange("remarks", e.target.value, key)
  //                       }
  //                     />
  //                   </Form.Item>

  //                   <Col span={1}>
  //                     <MinusCircleOutlined
  //                       onClick={() => removeItem(key)}
  //                       style={{ marginTop: 8 }}
  //                     />
  //                   </Col>
  //                 </div>
  //               );
  //             })}
  //         </>
  //       )}
  //     </Form.List>

  //     {/* Condition of Goods
  //     <h2>CONDITION OF GOODS</h2>*/}
  //     {Type !== "PO" && (
  //       <Row gutter={24}>
  //         <Col span={12}>
  //           <Form.Item label="TERMS AND CONDITION :" name="conditionOfGoods">
  //             <Input.TextArea
  //               value={formData.termsCondition}
  //               autoSize={{ minRows: 3, maxRows: 6 }}
  //               readonly
  //             />
  //             <Input style={{ display: "none" }} />
  //           </Form.Item>
  //         </Col>
  //         <Col span={12}>
  //           <Form.Item label="NOTE :" name="note">
  //             <Input.TextArea
  //               value={formData.note}
  //               autoSize={{ minRows: 3, maxRows: 6 }}
  //               onChange={(e) => handleChange("note", e.target.value)}
  //             />
  //             <Input style={{ display: "none" }} />
  //           </Form.Item>
  //         </Col>
  //       </Row>
  //     )}

  //     {/* Note and Signature */}

  //     <div
  //       style={{
  //         display: "flex",
  //         width: "100%",
  //         justifyContent: "space-between",
  //       }}
  //     >
  //       <div>
  //         <div className="goods-receive-note-signature">GENERATED BY :</div>
  //         <div className="goods-receive-note-signature">
  //           NAME & DESIGNATION :
  //           <Form>
  //             <Input
  //               value={formData.genName}
  //               name="genName"
  //               onChange={(e) => handleChange("genName", e.target.value)}
  //             />
  //           </Form>
  //         </div>
  //         <div className="goods-receive-note-signature">
  //           DATE & TIME :
  //           <DatePicker
  //             defaultValue={dayjs()}
  //             format={dateFormat}
  //             style={{ width: "58%" }}
  //             name="genDate"
  //             onChange={(date, dateString) =>
  //               handleChange("genDate", dateString)
  //             }
  //           />
  //         </div>
  //       </div>
  //       {Type === "PO" && (
  //         <div>
  //           <div className="goods-receive-note-signature">VERIFIED BY :</div>
  //           <div className="goods-receive-note-signature">
  //             NAME & SIGNATURE :
  //             <Form>
  //               <Input
  //                 name="issueName"
  //                 onChange={(e) => handleChange("issueName", e.target.value)}
  //               />
  //             </Form>
  //           </div>
  //           <div className="goods-receive-note-signature">
  //             DATE & TIME :
  //             <DatePicker
  //               defaultValue={dayjs()}
  //               format={dateFormat}
  //               style={{ width: "58%" }}
  //               name="issueDate"
  //               onChange={(date, dateString) =>
  //                 handleChange("issueDate", dateString)
  //               }
  //             />
  //           </div>
  //         </div>
  //       )}
  //       {Type !== "PO" && (
  //         <div>
  //           <div className="goods-receive-note-signature">RECEIVED BY :</div>
  //           <div className="goods-receive-note-signature">
  //             NAME & SIGNATURE :
  //             <Form>
  //               <Input
  //                 name="issueName"
  //                 onChange={(e) => handleChange("issueName", e.target.value)}
  //               />
  //             </Form>
  //           </div>
  //           <div className="goods-receive-note-signature">
  //             DATE & TIME :
  //             <DatePicker
  //               defaultValue={dayjs()}
  //               format={dateFormat}
  //               style={{ width: "58%" }}
  //               name="issueDate"
  //               onChange={(date, dateString) =>
  //                 handleChange("issueDate", dateString)
  //               }
  //             />
  //           </div>
  //         </div>
  //       )}
  //     </div>

  //     {/* Submit Button */}
  //     <div className="goods-receive-note-button-container">
  //       <Form.Item>
  //         <Button
  //           type="primary"
  //           htmlType="save"
  //           style={{ width: "200px", margin: 16 }}
  //         >
  //           Save
  //         </Button>
  //       </Form.Item>

  //       <Form.Item>
  //         <Button
  //           type="primary"
  //           htmlType="submit"
  //           style={{
  //             backgroundColor: "#4CAF50",
  //             borderColor: "#4CAF50",
  //             width: "200px",
  //             margin: 16,
  //           }}
  //         >
  //           Submit
  //         </Button>
  //       </Form.Item>
  //       <Form.Item>
  //         <Button
  //           disabled={!buttonVisible}
  //           onClick={() => printOrSaveAsPDF(formRef)}
  //           type="primary"
  //           danger
  //           style={{ width: "200px", margin: 16, alignContent: "end" }}
  //         >
  //           PRINT
  //         </Button>
  //       </Form.Item>
  //     </div>
  //     <Modal
  //       title="outward gate pass saved successfully"
  //       visible={isModalOpen}
  //       onOk={handleOk}
  //     >
  //       {successMessage && <p>{successMessage}</p>}
  //       {errorMessage && <p>{errorMessage}</p>}
  //     </Modal>
  //   </Form>
  // </div>
  // );
};

export default OutwardGatePass;
