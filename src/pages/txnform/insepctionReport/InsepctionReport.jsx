// InsepctionReport.js
import React, { useState, useEffect, useRef } from "react";
import {
  Form,
  Input,
  Select,
  DatePicker,
  Button,
  Row,
  Col,
  Typography,
  AutoComplete,
  Modal,
  message,
} from "antd";
import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import axios from "axios";
import { apiHeader, fetchUomLocatorMaster } from "../../../utils/Functions";
import { convertArrayToObject, printOrSaveAsPDF } from "../../../utils/Functions";
import FormInputItem from "../../../components/FormInputItem";
import FormDatePickerItem from "../../../components/FormDatePickerItem";
import FormDropdownItem from "../../../components/FormDropdownItem";
const dateFormat = "DD/MM/YYYY";
const { Option } = Select;
const { Title } = Typography;

const typeArray = [
  {
    valueField: "PO",
    visibleField: "1. Purchase Order"
  },
  {
    valueField: "IOP",
    visibleField: "2. Inter-Org Transaction"
  }
]

const InsepctionReport = () => {
  const [buttonVisible, setButtonVisible] = useState(false)
  const formRef = useRef()
  const [Type, setType] = useState("PO");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [uomMaster, setUomMaster] = useState({})
  const [locatorMaster, setLocatorMaster] = useState({})
  const [formData, setFormData] = useState({
    genDate: "",
    genName: "",
    issueDate: "",
    issueName: "",
    approvedDate: "",
    approvedName: "",
    processId: 0,
    type: "",
    typeOfInspection: "",
    inspectionRptNo: "",
    inspectionRptDate: "",
    invoiceNo: "",
    inwardGatePass: "",
    ceRegionalCenterCd: "",
    ceRegionalCenterName: "",
    ceAddress: "",
    ceZipcode: "",
    crRegionalCenterCd: "",
    crRegionalCenterName: "",
    crAddress: "",
    crZipcode: "",
    consumerName: "",
    supplierName: "",
    supplierCd: "",
    address: "",
    contactNo: "",
    dateOfDeliveryDate: "",
    dateOfInspectionDate: "20/12/2026",
    note: "",
    conditionOfGoods: "",
    userId: "",
    items: [
      {
        srNo: 0,
        itemCode: "",
        itemDesc: "",
        uom: "",
        quantity: 0,
        noOfDays: 0,
        remarks: "",
        conditionOfGoods: "",
        budgetHeadProcurement: "",
        locatorId: "",
      },
    ],
  });

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleChange = (fieldName, value) => {
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

  const token = localStorage.getItem("token")

  useEffect(() => {
    fetchItemData();
    fetchUserDetails();
    fetchUomLocatorMaster(setUomMaster, setLocatorMaster)
  }, []);

  const fetchItemData = async () => {
    try {
      const apiUrl =
        "https://uat-sai-app.azurewebsites.net/sai-inv-mgmt/master/getItemMaster";
      const response = await axios.get(apiUrl, apiHeader("GET", token));
      const { responseData } = response.data;
      // setItemData(responseData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const fetchUserDetails = async () => {
    try {
      const userCd = localStorage.getItem("userCd")
      const password = localStorage.getItem("password")
      const apiUrl =
        "https://uat-sai-app.azurewebsites.net/sai-inv-mgmt/login/authenticate";
      const response = await axios.post(apiUrl, {
        userCd,
        password,
      });

      const { responseData } = response.data;
      const { organizationDetails } = responseData;
      const { userDetails } = responseData;
      const {locationDetails} = responseData
      const currentDate = dayjs();
      // Update form data with fetched values
      setFormData({
        ceRegionalCenterCd: organizationDetails.location,
        ceRegionalCenterName: organizationDetails.organizationName,
        ceAddress: organizationDetails.locationAddr,
        ceZipcode: locationDetails.zipcode,
        genName: userDetails.firstName,
        userId: "string",
        genDate: currentDate.format(dateFormat),
        issueDate: currentDate.format(dateFormat),
        approvedDate: currentDate.format(dateFormat),
        inspectionRptDate: currentDate.format(dateFormat),
        inspectionRptNo: "string",
        dateOfInspectionDate: "20/12/2026" // bogus data since field is not required in this form, and form not getting submitted with it being empty
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleInwardGatePassChange = async (_, value) => {
    console.log("VALUE: ", value)
    try {
      const apiUrl =
        "https://uat-sai-app.azurewebsites.net/sai-inv-mgmt/getSubProcessDtls";
      const response = await axios.post(apiUrl, {
        processId: value,
        processStage: "IGP",
      }, apiHeader("POST", token));
      const responseData = response.data.responseData;
      const { processData, itemList } = responseData;
      console.log("API Response:", response.data);
      setFormData((prevFormData) => ({
        ...prevFormData,

        issueName: processData?.issueName,
        approvedName: processData?.approvedName,
        processId: processData?.processId,
        inwardGatePass: processData?.processId,

        crRegionalCenterCd: processData?.crRegionalCenterCd,
        crRegionalCenterName: processData?.crRegionalCenterName,
        crAddress: processData?.crAddress,
        crZipcode: processData?.crZipcode,

        consumerName: processData?.consumerName,
        contactNo: processData?.contactNo,

        supplierCd: processData?.supplierCode,
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
      // Handle error
    }

  };
  console.log("FOrmdata item: ", formData.items)

  const onFinish = async (values) => {
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

      const apiUrl =
        "https://uat-sai-app.azurewebsites.net/sai-inv-mgmt/saveInspectionReport";
      const response = await axios.post(apiUrl, formDataCopy, apiHeader("POST", token));
      console.log("Received values:", values);
      if (
        response.status === 200 &&
        response.data &&
        response.data.responseStatus &&
        response.data.responseStatus.message === "Success"
      ) {
        // Access the specific success message data if available
        const { processId, processType, subProcessId } =
          response.data.responseData;
        setFormData(prev=>{
          return {
            ...prev,
            inspectionRptNo: processId,
          }
        });
        setButtonVisible(true)
        setSuccessMessage(
          `MIS : ${processId}, Process Type: ${processType}, Sub Process ID: ${subProcessId}`
        );
        showModal();
        message.success(
          `MIS Submitted Successfully! Process ID: ${processId}, Process Type: ${processType}, Sub Process ID: ${subProcessId}`
        );
      } else {
        // Display a generic success message if specific data is not available
        message.error("Failed to submit MIS . Please try again later.");
      }
    } catch (error) {
      console.error("Error saving MIS :", error);
      message.error("Failed to submit MIS . Please try again later.");

      // Handle error response here
    }
  };

  const handleValuesChange = (_, allValues) => {
    setType(allValues.type);
  };

  const removeItem = (index) => {
    setFormData(prevValues=>{
      const updatedItems = prevValues.items
      updatedItems.splice(index, 1)
      
      const updatedItems1 = updatedItems.map((item, key)=>{
        return {...item, srNo: key+1}
      })

      return {...prevValues, items: updatedItems1}
    })
  }

  console.log("Form data: ", formData)

  return (
    <div className="goods-receive-note-form-container" ref={formRef}> 
      {Type === "PO" && (
        <h1>Sports Authority of India - Material Inward Slip</h1>
      )}
      {Type !== "PO" && <h1>Sports Authority of India - Inspection Report</h1>}
      <Form
        onFinish={onFinish}
        className="goods-receive-note-form"
        onValuesChange={handleValuesChange}
        layout="vertical"
        initialValues={formData || [{}]}
      >

        <Row>
          <Col span={6} offset={18}>
            <FormInputItem label="DATE :" value={formData.inspectionRptDate} />
          </Col>
          <Col span={6}>
            <FormDropdownItem label="TYPE" name="type" onChange={handleChange} dropdownArray={typeArray} valueField="valueField" visibleField="visibleField" />
          </Col>
          <Col span={6} offset={12}>
            <FormInputItem label={Type !== "PO" ? "INSEPCTION REPORT NO." : "MIS NO"}  value={formData.inspectionRptNo !== "string" ? formData.inspectionRptNo : "not defined"} readOnly={true} />
          </Col>
        </Row>

        <Row gutter={24}>
          <Col span={8}>
            <Title strong level={2} underline type="danger">
              CONSIGNEE DETAIL :-
            </Title>

            <FormInputItem label = "REGIONAL CENTER CODE :" value={formData.ceRegionalCenterCd} readOnly={true} />
            <FormInputItem label = "REGIONAL CENTER NAME :" value={formData.ceRegionalCenterName} readOnly={true} />
            <FormInputItem label = "ADDRESS :" value={formData.ceAddress} readOnly={true} />
            <FormInputItem label = "ZIP CODE :" value={formData.ceZipcode} readOnly={true} />

          </Col>
          <Col span={8}>
            <Title strong underline level={2} type="danger">
              CONSIGNOR DETAIL :-
            </Title>

            {Type === "PO" && (
              <> 
                <FormInputItem label="SUPPLIER CODE :" value={formData.supplierCd} />
                <FormInputItem label="SUPPLIER NAME :" value={formData.supplierName} />
                <FormInputItem label="ADDRESS :" value={formData.crAddress || "Not defined"} />
              </>
            )}

            {Type === "IOP" && (
              <>
                <FormInputItem label="REGIONAL CENTER CODE :" value={formData.crRegionalCenterCd} readOnly={true} />
                <FormInputItem label="REGIONAL CENTER NAME :" value={formData.crRegionalCenterName} readOnly={true} />
                <FormInputItem label="ADDRESS :" value={formData.crAddress || "Not defined"} readOnly={true} />
                <FormInputItem label="ZIP CODE :" value={formData.crZipcode || "Not defined"} readOnly={true} />
              </>
            )}
          </Col>
          <Col span={8}>
            <Form.Item></Form.Item>

            <FormInputItem label="INWARD GATE PASS No. :" name="inwardGatePass" onChange={handleInwardGatePassChange} />
            <FormInputItem label = "CHALLAN / INVOICE NO. :" value={formData.challanNo} readOnly={true} />
            <FormInputItem label = "MODE OF DELIVERY :" value={formData.modeOfDelivery} readOnly={true} />
            <FormInputItem label = "DATE OF DELIVERY :" value={formData.dateOfDeliveryDate} readOnly={true} />
            {/* <FormDatePickerItem label="DATE OF INSPECTION :" name="dateOfInspectionDate" onChange={handleChange} />
            <FormInputItem label="TYPE OF INSPECTION :" name="typeOfInspection" onChange={handleChange} /> */}
          </Col>
        </Row>



        {/* Item Details */}
        <h2>ITEM DETAILS</h2>

        <Form.List name="itemDetails" initialValue={formData.items || [{}]}>
          {(fields, { add, remove }) => (
            <>
              {formData?.items?.length > 0 &&
                formData.items.map((item, key) => {
                  return (

                    <div key={key} style={{ marginBottom: 16, border: '1px solid #d9d9d9', padding: 16, borderRadius: 4, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',gap:'20px' }}>
                      
                      <FormInputItem label="Serial No. :" value={item.srNo} readOnly={true}/>
                      <FormInputItem label="ITEM CODE :" value={item.itemCode} readOnly={true}/>
                      <FormInputItem label="ITEM DESCRIPTION :" value={item.itemDesc} readOnly={true}/>
                      <FormInputItem label="UOM :" value={uomMaster[item.uom]} readOnly={true}/>
                      {/* <FormInputItem label="RECIEVED QUANTITY :" name="quantity" value={formData.items[key].quantity} onChange={(fieldName, value) => itemHandleChange("quantity", value, key)} />
                      <FormInputItem label="BUDGET HEAD PROCUREMENT :" name="budgetHeadProcurement" value={item.budgetHeadProcurement} onChange={(fieldName, value) => itemHandleChange("budgetHeadProcurement", value, key)}/> */}

{/* 
                        <Form.Item label="Serial No.">
                          <Input value={item.srNo} readOnly />
                        </Form.Item>
                      
                        <Form.Item label="ITEM CODE">
                          <Input value={item.itemCode} readOnly />
                        </Form.Item>
                        
                        <Form.Item label="ITEM DESCRIPTION">
                          <Input value={item.itemDesc} readOnly />
                        </Form.Item>

                        <Form.Item label="UOM">
                          <Input value={uomMaster[item.uom]} />
                        </Form.Item> */}

                        <Form.Item label="RECEIVED QUANTITY">
                          <Input value={item.quantity} onChange={(e)=>itemHandleChange("quantity", e.target.value, key)} />
                        </Form.Item>

                        {/* <Form.Item label="BUDGET HEAD PROCUREMENT">
                          <Input value={item.budgetHeadProcurement} onChange={(e)=>itemHandleChange("budgetHeadProcurement", e.target.value, key)} />
                        </Form.Item>  */}

                        {
                          Type !== "PO" && 
                          // <Form.Item label="LOCATOR DESCRIPTION">
                          //   <Input value={locatorMaster[item.locatorId]} />
                          // </Form.Item>
                          <FormInputItem label="LOCATOR DESCRPTION" value={locatorMaster[item.locatorId]} />
                        }

                        {/* <FormInputItem label="REMARK" name="remarks" value={item.remarks} onChange={(fieldName, value) => itemHandleChange("remarks", value, key)} /> */}

                        <Form.Item label="REMARK">
                          <Input value={item.remarks} onChange={(e)=>itemHandleChange("remarks", e.target.value, key)} />
                        </Form.Item>

                        <Col span={1}>
                          <MinusCircleOutlined onClick={() => removeItem(key)} style={{ marginTop: 8 }} />
                        </Col>
                    </div>
                  );
                })}
            </>

          )}
        </Form.List>

        {/* Condition of Goods */}

        <Row gutter={24}>
          <Col span={12}>
            <Form.Item label="CONDITION OF GOODS" name="conditionOfGoods">
              <Input.TextArea
                onChange={(e) =>
                  handleChange("conditionOfGoods", e.target.value)
                }
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="NOTE" name="note">
              <Input.TextArea
                onChange={(e) => handleChange("note", e.target.value)}
              />
            </Form.Item>
          </Col>
        </Row>

        {/* Note and Signature */}

        <div
          style={{
            display: "flex",
            width: "100%",
            justifyContent: "space-between",
          }}
        >
          {Type === "PO" && (
            <div>
              <div className="goods-receive-note-signature">GENERATED BY</div>
              <div className="goods-receive-note-signature">
                NAME & DESIGNATION :
                <Form>
                  <Input
                    value={formData.genName}
                    name="genName"
                    onChange={(e) => handleChange("genName", e.target.value)}
                  />
                </Form>
              </div>
              <div className="goods-receive-note-signature">
                DATE & TIME :
                <DatePicker
                  defaultValue={dayjs()}
                  format={dateFormat}
                  style={{ width: "58%" }}
                  name="genDate"
                  onChange={(date, dateString) =>
                    handleChange("genDate", dateString)
                  }
                />
              </div>
            </div>
          )}
          {Type !== "PO" && (
            <div>
              <div className="goods-receive-note-signature">GENERATED BY</div>
              <div className="goods-receive-note-signature">
                NAME & SIGNATURE :
                <Form>
                  <Input
                    value={formData.genName}
                    name="genName"
                    onChange={(e) => handleChange("genName", e.target.value)}
                  />
                </Form>
              </div>
              <div className="goods-receive-note-signature">
                DATE & TIME :
                <DatePicker
                  defaultValue={dayjs()}
                  format={dateFormat}
                  style={{ width: "58%" }}
                  name="genDate"
                  onChange={(date, dateString) =>
                    handleChange("genDate", dateString)
                  }
                />
              </div>
            </div>
          )}

          {Type === "PO" && (
            <>
              <div>
                <div className="goods-receive-note-signature">APPROVED BY</div>
                <div className="goods-receive-note-signature">
                  NAME & SIGNATURE :
                  <Form>
                    <Input
                      name="issueName"
                      onChange={(e) =>
                        handleChange("issueName", e.target.value)
                      }
                    />
                  </Form>
                </div>
                <div className="goods-receive-note-signature">
                  DATE & TIME :
                  <DatePicker
                    defaultValue={dayjs()}
                    format={dateFormat}
                    style={{ width: "58%" }}
                    name="issueDate"
                    onChange={(date, dateString) =>
                      handleChange("issueDate", dateString)
                    }
                  />
                </div>
              </div>
            </>
          )}

          {Type !== "PO" && (
            <>
              <div>
                <div className="goods-receive-note-signature">RECEIVED BY</div>
                <div className="goods-receive-note-signature">
                  NAME & SIGNATURE :
                  <Form>
                    <Input
                      name="issueName"
                      onChange={(e) =>
                        handleChange("issueName", e.target.value)
                      }
                    />
                  </Form>
                </div>
                <div className="goods-receive-note-signature">
                  DATE & TIME :
                  <DatePicker
                    defaultValue={dayjs()}
                    format={dateFormat}
                    style={{ width: "58%" }}
                    name="issueDate"
                    onChange={(date, dateString) =>
                      handleChange("issueDate", dateString)
                    }
                  />
                </div>
              </div>
            </>
          )}
        </div>
        {/* Submit Button */}
        <div className="goods-receive-note-button-container">
          <Form.Item>
            <Button
              type="primary"
              htmlType="save"
              style={{ width: "200px", margin: 16 }}
            >
              SAVE
            </Button>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              style={{
                backgroundColor: "#4CAF50",
                borderColor: "#4CAF50",
                width: "200px",
                margin: 16,
              }}
            >
              SUBMIT
            </Button>
          </Form.Item>
          <Form.Item>
          <Button disabled={!buttonVisible} onClick={()=> printOrSaveAsPDF(formRef)} type="primary" danger style={{ width: '200px', margin: 16, alignContent: 'end' }}>
              PRINT
            </Button>
          </Form.Item>
        </div>
        <Modal
          title="MIS saved successfully."
          open={isModalOpen}
          onOk={handleOk}
        >
          {successMessage && <p>{successMessage}</p>}
          {errorMessage && <p>{errorMessage}</p>}
        </Modal>
      </Form>
    </div>
  );
};

export default InsepctionReport;
