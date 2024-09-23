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
  apiCall,
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
import { useLocation, useNavigate } from "react-router-dom";
import { fetchUoms } from "../../../redux/slice/uomSlice";
import { fetchLocators } from "../../../redux/slice/locatorSlice";
import Loader from "../../../components/Loader";
const dateFormat = "DD/MM/YYYY";
const { Option } = Select;
const { TextArea } = Input;

const IssueNote = () => {

  const {uomObj} = useSelector(state => state.uoms)

  const issueNote = JSON.parse(localStorage.getItem("issueNote"));

  const location = useLocation()

  const {isnData, itemList} = location.state ? location.state : {isnData: null, itemList: null}


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
    processTypeDesc : issueNote ? (issueNote?.processType === "IRP" ? "Returnable" : (issueNote?.processType === "NIRP" ? "Non Returnable" : "Inter Org Transfer")) : "Returnable",
    interRdDemandNote: "",
  });

  const navigate = useNavigate()

  const handleFormReset = () => {
    message.success("Issue Note reset successfully.")

    navigate('/trans/issue', {state: { isnData: null, itemList: null }})

    window.location.reload()

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
      return
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
      return
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

console.log("FORMDATDA: ", formData)

  const { organizationDetails, locationDetails, userDetails, token, userCd } =
    useSelector((state) => state.auth);

  const updateFormData = (newItem) => {
    console.log("new item: ", newItem)
    setFormData((prevValues) => {
      const updatedItems = [
        ...(prevValues.items || []),
        {
          ...newItem,
          noOfDays: formData.processType === "NIRP" ? "0" : newItem.noOfDays,
          srNo: prevValues.items?.length ? prevValues.items.length + 1 : 1,
        },
      ];
      return { ...prevValues, items: updatedItems };
    });
  };

  useEffect(() => {
    const fetchUomLoc = async () => {
      await dispatch(fetchUoms()).unwrap()
      await dispatch(fetchLocators()).unwrap()
    }
    fetchUomLoc()
    dispatch(fetchOhq());
    const issueNoteData = localStorage.getItem("issueNote")
    
    if(isnData !== null){
      setFormData({...isnData, processTypeDesc: (isnData.type === "IRP" ? "Returnable" : (isnData.type === "NIRP" ? "Non Returnable" : "Inter Org Transfer")), items: [...itemList]})
      return
    }
    
    if (issueNoteData) {
      setFormData({ ...JSON.parse(issueNoteData) });
      return;
    }

    const fetchUserDetails = () => {
      const currentDate = dayjs();
      setFormData((prev) => {
        return {
          // ...prev,
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
          type: "IRP",
          processType: "IRP",
          processTypeDesc: "Returnable"
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
    isnData,
    itemList
  ]);

  const {data: orgMaster} = useSelector(state => state.organizations)

  const handleCeRccChange = async (_, value) => {
    setFormData(prev => {
      return {
        ...prev,
        ceRegionalCenterCd: value
      }
    })
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

  // let activeUsers = {}
  // const fetchActiveUser = async () => {
  //   orgMaster?.forEach(async org => {
  //     // activeUsers[org.organizationName] = []
  //     const {responseData: txnSummaryOrgwWise} = await apiCall('POST', '/txns/getTxnSummary', token, {orgId: org.id})
  //     console.log('txnsumorgwise: ', txnSummaryOrgwWise)
  //     activeUsers[org.organizationName] = txnSummaryOrgwWise
  //     // txnSummaryOrgwWise.forEach( async txn => {
  //     //   const {responseData: txnDtlsTxnWise} = await apiCall('POST', '/txns/getTxnDtls', token, {processId: txn.id})
  //     //   Object.keys(txnDtlsTxnWise).forEach(key => {
  //     //     if(key !== 'processId'){
  //     //       if(key.data){
  //     //         activeUsers['SAI SONEPAT'].push(key.data.genName)
  //     //       }
  //     //     }
  //     //   })
  //     // })
  //   })

  //   console.log("Active users : ", activeUsers)
  // }

  // fetchActiveUser()

  const onFinish = async () => {
    if(!formData.issueName || !formData.genName || !formData.approvedName){
      message.error("Please fill all the fields.")
      return
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
    message.success("Issue Note saved as draft successfully.")
  };

  if(!orgMaster){
    return <Loader />
  }

  return (
    <>
      <div className="a4-container" ref={formRef}>
        <div className="heading-container">
          <h4>
            Issue Note No. : <br /> {isnData ? formData.processId : formData.issueNoteNo}
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
          onFinish={onFinish}
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
              <FormInputItem readOnly={isnData === null}
                label="Regional Center Code"
                value={formData.crRegionalCenterCd}
                // readOnly={}
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

              {(formData.type === "IRP" ||
              formData.type === "NIRP") ? (
                <>
                  <FormInputItem
                    label="Consumer Name"
                    name="consumerName"
                    value={formData.consumerName}
                    onChange={handleChange}
                    readOnly={isnData !== null}
                  />
                  <FormInputItem
                    label="Contact No."
                    name="contactNo"
                    value={formData.contactNo}
                    onChange={handleChange}
                    readOnly={isnData !== null}
                  />
                </>
              ) : (
                <>
                  <FormInputItem
                    label="Regional Center Code"
                    name="ceRegionalCenterCd"
                    value={formData.ceRegionalCenterCd}
                    onChange={handleCeRccChange}
                    readOnly={isnData !== null}
                  />
                  <FormInputItem
                    label="Regional Center Name"
                    name="ceRegionalCenterName"
                    value={formData.ceRegionalCenterName}
                    readOnly={isnData !== null}
                  />
                  <FormInputItem
                    label="Address"
                    value={formData.ceAddress}
                    name="ceAddress"
                    readOnly={isnData !== null}
                  />
                  <FormInputItem
                    label="Zipcode"
                    value={formData.ceZipcode}
                    name="ceZipcode"
                    readOnly={isnData !== null}
                  />
                </>
              )}
            </div>

            <div className="other-container">
              <h3 className="consignor-consignee-heading">Other Details</h3>

              <Form.Item label="Type" name="processTypeDesc" >
                {
                  isnData !== null ?
                  <>
                  <Input value = {formData.processTypeDesc} readOnly={true} />
                  <Input value = {(isnData.type === "IRP" ? "Returnable" : (isnData.type === "NIRP" ? "Non Returnable" : "Inter Org Transfer"))} readOnly={true}  style={{display: "none"}}  />
                  </>
                  :
                  <Select
                    onChange={(value) => handleChange("processType", value)}
                    value={formData.processTypeDesc}
                  >
                    <Option value="IRP">Returnable</Option>
                    <Option value="NIRP">Non Returnable</Option>
                    <Option value="IOP">Inter Org Transfer</Option>
                  </Select>
                }
              </Form.Item>

              <FormInputItem
                label="Demand Note No."
                name={
                  formData.processType === "IOP"
                    ? "interRdDemandNote"
                    : "demandNoteNo"
                }
                value={formData.demandNoteNo}
                onChange={handleChange}
                readOnly={isnData !== null}
              />

              {
                isnData !== null ? 
                <FormInputItem label="Demand Note Date" value = {formData.demandNoteDt} readOnly={isnData !== null} />
                :
              <FormDatePickerItem
                label="Demand Note Date"
                defaultValue={dayjs()}
                name="demandNoteDt"
                onChange={handleChange}
                value={formData.demandNoteDt}
                />
              }
            </div>
          </div>

          <div className="item-details-container">
            <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
              <h3>Item Details</h3>
              {
                isnData === null &&
                <ItemSearch itemArray={data} updateFormData={updateFormData} />
              }
            </div>

            {formData?.items?.length > 0 &&
              formData.items.map((item, key) => {
                return (
                  <div className="each-item-detail-container">
                    <div className="each-item-detail-container-grid">
                      <FormInputItem label="S. No." value={item.srNo || item?.sNo} readOnly={isnData !== null} />
                      <FormInputItem label="Item Code" value={item.itemCode}  readOnly={isnData !== null}/>
                      <FormInputItem
                        label="Item Description"
                        className="item-desc-cell"
                        value={item.itemDesc}
                        readOnly={isnData !== null}
                      />
                      <FormInputItem
                        label="Unit of Measurement"
                        value={item.uomDesc || (uomObj 
                          && uomObj[parseInt(item?.uom)])}
                          readOnly={isnData !== null}
                      />

                      <FormInputItem name="quantity" label={"Required Quantity"} value={item.quantity} onChange={(fieldName, value) => itemHandleChange(fieldName, value, key)} readOnly={isnData !== null} />
                      <FormInputItem name="noOfDays" label="Req. For No. Of Days" value={item.noOfDays || item.requiredDays} onChange={(fieldName, value) => itemHandleChange(fieldName, value, key)} readOnly={isnData !== null} />
                      <FormInputItem name="remarks" label = "Remarks" value={item.remarks} onChange={(fieldName, value) => itemHandleChange(fieldName, value, key)} readOnly={isnData !== null} />
                      <Button
                        icon={<DeleteOutlined />}
                        className="delete-button"
                        onClick={() => removeItem(key, setFormData)}
                        disabled={isnData !== null}
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
                readOnly={isnData !== null}
              />
            </div>
            <div>
              <h3>Note</h3>
              <TextArea
                autoSize={{ minRows: 4, maxRows: 16 }}
                value={formData.note}
                onChange={(e) => handleChange("note", e.target.value)}
                readOnly={isnData !== null}
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
                readOnly={isnData !== null}

              />
              {
                isnData !== null ? 
                <FormInputItem value = {formData.genDate} readOnly={isnData !== null} />
                :
                <FormDatePickerItem
                  defaultValue={dayjs()}
                  name="genDate"
                  onChange={handleChange}
                  value={formData.genDate}
                  readOnly={isnData !== null}
                />

              }
            </div>
            <div className="each-desg">
              <h4> Approved By </h4>
              <FormInputItem
                placeholder="Name and Designation"
                name="approvedName"
                onChange={handleChange}
                value={formData.approvedName}
                readOnly={isnData !== null}
              />

              {
                isnData !== null ? 
                <FormInputItem value = {formData.approvedDate} readOnly={isnData !== null} />
                :
              <FormDatePickerItem
                defaultValue={dayjs()}
                name="approvedDate"
                onChange={handleChange}
                value={formData.approvedDate}
                readOnly={isnData !== null}
              />
              }

            </div>
            <div className="each-desg">
              <h4> Received By </h4>
              <FormInputItem
                placeholder="Name and Signature"
                name="issueName"
                value={formData.issueName}
                onChange={handleChange}
                readOnly={isnData !== null}
              />

              {
                isnData !== null ? 
                <FormInputItem value = {formData.issueDate} readOnly={isnData !== null} />
                :
                <FormDatePickerItem
                  defaultValue={dayjs()}
                  name="issueDate"
                  onChange={handleChange}
                  value={formData.issueDate}
                  readOnly={isnData !== null}
                />
              }
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
                }}
                icon={<SaveOutlined />}
                disabled={isnData ? true : !submitBtnEnabled}
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
                  // width: "200px"
                  backgroundColor: "#eed202",
                }}
                icon={<CloudDownloadOutlined />}
                disabled={isnData !== null}
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
                disabled={isnData ? false : !printBtnEnabled}
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
