// IssueNote.js
import React, { useState, useEffect, useRef, useMemo } from "react";
import { Form, Input, Select, Button, message, Tooltip, Modal } from "antd";
import {
  DeleteOutlined,
  PrinterOutlined,
  SaveOutlined,
  UndoOutlined,
  CloudDownloadOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import axios from "axios";

import {
  apiHeader,
  mergeItemMasterAndOhq,
  removeItem,
} from "../../../utils/Functions";
import FormInputItem from "../../../components/FormInputItem";
import { useDispatch, useSelector } from "react-redux";
import FormDatePickerItem from "../../../components/FormDatePickerItem";
import useHandlePrint from "../../../components/useHandlePrint";
import { fetchOhq } from "../../../redux/slice/ohqSlice";
import ItemSearch from "./ItemSearch";
const dateFormat = "DD/MM/YYYY";
const { Option } = Select;
const { TextArea } = Input;

const IssueNote = () => {
  const issueNote = JSON.parse(localStorage.getItem("issueNote"));

  console.log("Issue note: ", issueNote)

  const [form] = Form.useForm()
  const dispatch = useDispatch();

  const { data: itemData } = useSelector((state) => state.item);
  const { data: ohqData } = useSelector((state) => state.ohq);
  const data = useMemo(
    () => mergeItemMasterAndOhq(itemData, ohqData),
    [itemData, ohqData]
  );

  const formRef = useRef();
  const handlePrint = useHandlePrint(formRef);

  const [printBtnEnabled, setPrintBtnEnabled] = useState(false);
  const [submitBtnEnabled, setSubmitBtnEnabled] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const [formData, setFormData] = useState({
    genDate: "",
    genName: "",
    issueDate: "",
    issueName: "",
    approvedDate: "",
    approvedName: "",
    demandNoteNo: "",
    issueNoteNo: "",
    issueNoteDt: "",
    type: issueNote?.processType || "IRP",
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
    termsCondition: "",
    note: "",
    demandNoteDt: "",
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
    userId: "string",
    processType: issueNote?.processType || "IRP",
    processTypeDesc : (issueNote?.processType === "IRP" ? "Returnable" : (issueNote?.processType === "NIRP" ? "Non Returnable" : "Inter Org Transfer")),
    interRdDemandNote: "",
  });

  const handleFormReset = () => {
    window.location.reload();
    localStorage.removeItem("issueNote");
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

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
    }
    if (fieldName === "processType") {
      setFormData((prevValues) => {
        return {
          ...prevValues,
          processType: value,
          type: value,
          processTypeDesc: (value === "IRP" ? "Returnable" : (value === "NIRP" ? "Non Returnable" : "Inter Org Transfer"))
        };
      });
    }
    setFormData((prevValues) => ({
      ...prevValues,
      [fieldName]: value === "" ? null : value,
    }));
  };

  const itemHandleChange = (fieldName, value, index) => {
    // quantity logic to be applied

    setFormData((prevValues) => {
      const updatedItems = prevValues.items;
      updatedItems[index] = {
        ...updatedItems[index],
        [fieldName]: value,
      };
      return {
        ...prevValues,
        items: updatedItems,
      };
    });
  };



  const { organizationDetails, locationDetails, userDetails, token, userCd } =
    useSelector((state) => state.auth);

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

  useEffect(() => {
    dispatch(fetchOhq());
    const issueNoteData = localStorage.getItem("issueNote")
    if (issueNoteData) {
      setFormData({ ...JSON.parse(issueNoteData) });
      return;
    }
    const fetchUserDetails = () => {
      const currentDate = dayjs();
      setFormData((prev) => {
        return {
          ...prev,
          crRegionalCenterCd: organizationDetails.id,
          crRegionalCenterName: organizationDetails.organizationName,
          crAddress: organizationDetails.locationAddr,
          crZipcode: locationDetails.zipcode,
          genName: userDetails.firstName + " " + userDetails.lastName,
          userId: userCd,
          issueNoteNo: "not defined",
          genDate: currentDate.format(dateFormat),
          issueDate: currentDate.format(dateFormat),
          approvedDate: currentDate.format(dateFormat),
          issueNoteDt: currentDate.format(dateFormat),
          demandNoteDt: currentDate.format(dateFormat),
        };
      });
    };
    fetchUserDetails();
  }, [
    organizationDetails.id,
    organizationDetails.organizationName,
    locationDetails.zipcode,
    organizationDetails.locationAddr,
    userCd,
    userDetails.firstName,
    userDetails.lastName,
    dispatch,
  ]);

  console.log(formData.processType)

  const handleCeRccChange = async (_, value) => {
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
        setPrintBtnEnabled(true);
        setSuccessMessage(
          `Issue note saved successfully! Issue Note No : ${processId}, Process Type: ${processType}, Sub Process ID: ${subProcessId}`
        );
        showModal();
        message.success(
          `Issue note saved successfully! Process ID: ${processId}, Process Type: ${processType}, Sub Process ID: ${subProcessId}`
        );
        // fetchUserDetails()
      } else if (response.data.responseStatus.message === "Failed") {
        message.error(
          response.data.responseStatus.errorType || "Failed to save issue note."
        );
        setSubmitBtnEnabled(true);
        localStorage.removeItem("issueNote");
      }
    } catch (error) {
      console.error("Error saving issue note:", error);
      message.error("Failed to submit issue note. ");
    }
  };

  const saveDraft = () => {
    localStorage.setItem("issueNote", JSON.stringify(formData));
  };

  const processTypeClick = () => {
    setFormData(prev => {
      return {
        ...prev,
        type: null, processType: null, processTypeDesc: null
      }
    })
  }

  return (
    <>
      <div className="a4-container" ref={formRef}>
        <div className="heading-container">
          <h4>
            Issue Note No. : <br /> {formData.issueNoteNo}
          </h4>
          <h2 className="a4-heading">Sports Authority Of India - Issue Note</h2>
          <h4>
            Issue Note Date. : <br /> {formData.issueNoteDt}
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
          defaultValue={formData}
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
              <h3 className="consignor-consignee-heading">Consignor Details</h3>
              <FormInputItem
                label="Regional Center Code"
                value={formData.crRegionalCenterCd}
              />
              <FormInputItem
                label="Regional Center Name"
                value={formData.crRegionalCenterName}
              />
              <FormInputItem label="Address" value={formData.crAddress} />
              <FormInputItem label="Zipcode" value={formData.crZipcode} />
            </div>

            <div className="consignee-container">
              <h3 className="consignor-consignee-heading">Consignee Details</h3>

              {formData.processType === "IRP" ||
              formData.processType === "NIRP" ? (
                <>
                  <FormInputItem
                    label="Consumer Name"
                    name="consumerName"
                    value={formData.consumerName}
                    onChange={handleChange}
                  />
                  <FormInputItem
                    label="Contact No."
                    name="contactNo"
                    value={formData.contactNo}
                    onChange={handleChange}
                  />
                </>
              ) : (
                <>
                  <FormInputItem
                    label="Regional Center Code"
                    name="ceRegionalCenterCd"
                    value={formData.ceRegionalCenterCd}
                    onChange={handleCeRccChange}
                  />
                  <FormInputItem
                    label="Regional Center Name"
                    name="ceRegionalCenterName"
                    value={formData.ceRegionalCenterName}
                  />
                  <FormInputItem
                    label="Address"
                    value={formData.ceAddress}
                    name="ceAddress"
                  />
                  <FormInputItem
                    label="Zipcode"
                    value={formData.ceZipcode}
                    name="ceZipcode"
                  />
                </>
              )}
            </div>

            <div className="other-container">
              <h3 className="consignor-consignee-heading">Other Details</h3>

              <Form.Item label="Type" name="processTypeDesc" onClick = {processTypeClick}>
                <Select
                  // value={
                  //   formData.processTypeDesc
                  // }
                  onChange={(value) => handleChange("processType", value)}
                >
                  {
                    !formData.processType &&
                    <>
                    <Option value="IRP">1. RETURNABLE</Option>
                    <Option value="NIRP">2. NON RETURNABLE</Option>
                    <Option value="IOP">3. INTER - ORG. TRANSFER</Option>
                    </>
                  
                  }
                </Select>
              </Form.Item>

              <FormInputItem
                label="Demand Note No."
                name={
                  formData.processType === "IOP"
                    ? "interRdDemandNote"
                    : "demandNoteNo"
                }
                onChange={handleChange}
              />
              <FormDatePickerItem
                label="Demand Note Date"
                defaultValue={dayjs()}
                name="demandNoteDt"
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="item-details-container">
            <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
              <h3>Item Details</h3>
              <ItemSearch itemArray={data} updateFormData={updateFormData} />
            </div>

            {formData?.items?.length > 0 &&
              formData.items.map((item, key) => {
                return (
                  <div className="each-item-detail-container">
                    <div className="each-item-detail-container-grid">
                      <FormInputItem label="S. No." value={item.srNo} />
                      <FormInputItem label="Item Code" value={item.itemCode} />
                      <FormInputItem
                        label="Item Description"
                        className="item-desc-cell"
                        value={item.itemDesc}
                      />
                      <FormInputItem
                        label="Unit of Measurement"
                        value={item.uomDesc}
                      />
                      <Form.Item label="Required Quantity">
                        <Input
                          value={item.quantity}
                          onChange={(e) =>
                            itemHandleChange("quantity", e.target.value, key)
                          }
                        />
                      </Form.Item>
                      <Form.Item label="Req. For No. Of Days">
                        <Input
                          value={item.noOfDays}
                          onChange={(e) =>
                            itemHandleChange("noOfDays", e.target.value, key)
                          }
                        />
                      </Form.Item>

                      <Form.Item label="Remarks">
                        <Input
                          value={item.remarks}
                          onChange={(e) =>
                            itemHandleChange("remarks", e.target.value, key)
                          }
                        />
                      </Form.Item>

                      <Button
                        icon={<DeleteOutlined />}
                        className="delete-button"
                        onClick={() => removeItem(key, setFormData)}
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
                rows={4}
                value={formData.termsCondition}
                onChange={(e) => handleChange("termsCondition", e.target.value)}
              />
            </div>
            <div>
              <h3>Note</h3>
              <TextArea
                rows={4}
                value={formData.note}
                onChange={(e) => handleChange("note", e.target.value)}
              />
            </div>
          </div>

          <div className="designations-container">
            <div className="each-desg">
              <h4> Generated By </h4>
              <FormInputItem
                placeholder="Name and Designation"
                name="genName"
                onChange={handleChange}
              />
              <FormDatePickerItem
                defaultValue={dayjs()}
                name="genDate"
                onChange={handleChange}
              />
            </div>
            <div className="each-desg">
              <h4> Approved By </h4>
              <FormInputItem
                placeholder="Name and Designation"
                name="approvedName"
                onChange={handleChange}
              />
              <FormDatePickerItem
                defaultValue={dayjs()}
                name="approvedDate"
                onChange={handleChange}
              />
            </div>
            <div className="each-desg">
              <h4> Received By </h4>
              <FormInputItem
                placeholder="Name and Signature"
                name="issueName"
                onChange={handleChange}
              />
              <FormDatePickerItem
                defaultValue={dayjs()}
                name="issueDate"
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="button-container">
            <Tooltip title="Clear form">
              <Button
                type="primary"
                danger
                // style={{ width: "200px" }}
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
                  // width: "200px",
                }}
                icon={<SaveOutlined />}
                disabled={!submitBtnEnabled}
              >
                Submit
              </Button>
            </Tooltip>

            <Tooltip title={"Save the form as draft."}>
              <Button
                onClick={saveDraft}
                type="primary"
                style={{
                  // width: "200px"
                  backgroundColor: "#eed202",
                }}
                icon={<CloudDownloadOutlined />}
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
                disabled={!printBtnEnabled}
              >
                Print
              </Button>
            </Tooltip>
          </div>
        </Form>
      </div>
      <Modal
        title="Issue note saved successfully"
        visible={isModalOpen}
        onOk={handleOk}
      >
        {successMessage && <p>{successMessage}</p>}
      </Modal>
    </>
  );
};

export default IssueNote;
