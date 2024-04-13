// InspectionNote.js
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
import { apiHeader } from "../../../utils/Functions";

import FormInputItem from "../../../components/FormInputItem";
import FormDatePickerItem from "../../../components/FormDatePickerItem";
import { convertArrayToObject, printOrSaveAsPDF } from "../../../utils/Functions";

const dateFormat = "DD/MM/YYYY";
const { Option } = Select;
const { Title } = Typography;

const InspectionNote = () => {
  const formRef = useRef()
  const [buttonVisible, setButtonVisible] = useState(false)
  const token = localStorage.getItem("token")
  const [Type, setType] = useState("PO");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [uomMaster, setUomMaster] = useState({})
  const [locatorMaster, setLocatorMaster] = useState({})
  const [itemData, setItemData] = useState([]);
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
    dateOfInspectionDate: "",
    note: "",
    conditionOfGoods: "",
    userId: "",
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
      //   inspectedQuantity: 0,
      //   acceptedQuantity: 0,
      //   rejectedQuantity: 0,
      // },
    ],
  });

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleChange = (fieldName, value) => {
    console.log("HandleChange called: ", fieldName, value)
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

  useEffect(() => {
    // fetchItemData();
    fetchUomLocatorMaster()
    fetchUserDetails();
  }, []);

  const fetchItemData = async () => {
    try {
      const apiUrl =
        "https://uat-sai-app.azurewebsites.net/sai-inv-mgmt/master/getItemMaster";
      const response = await axios.get(apiUrl, apiHeader("GET", token));
      const { responseData } = response.data;
      setItemData(responseData);
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
      const { organizationDetails, locationDetails } = responseData;
      const { userDetails } = responseData;
      console.log("Fetched data:", organizationDetails);
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
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  
  const handleInwardGatePassChange = async (_fieldName, value) => {
    try {
      const apiUrl =
        "https://uat-sai-app.azurewebsites.net/sai-inv-mgmt/getSubProcessDtls";
      const response = await axios.post(apiUrl, {
        processId: value,
        processStage: "IGP",
      },  apiHeader("POST", token));
      const {responseData} = response.data;
      const { processData, itemList } = responseData;
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

        ceRegionalCenterCd: processData?.ceRegionalCenterCd,
        ceRegionalCenterName: processData?.ceRegionalCenterName,
        ceAddress: processData?.ceAddress,
        ceZipcode: processData?.ceZipcode,

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
          // quantity: item?.quantity,
          noOfDays: item?.requiredDays,
          remarks: item?.remarks,
          conditionOfGoods: item?.conditionOfGoods,
          budgetHeadProcurement: item?.budgetHeadProcurement,
          locatorId: item?.locatorId,
          inspectedQuantity: item?.quantity,
          acceptedQuantity: 0,
          rejectedQuantity: 0
        })),
      }));
      // Handle response data as needed
    } catch (error) {
      console.error("Error fetching sub process details:", error);
      // Handle error
    }
  };

  console.log("FOrmDataaaaaa: ", formData)

  const fetchUomLocatorMaster = async () => {
    try {
      const uomMasterUrl =
        "https://uat-sai-app.azurewebsites.net/sai-inv-mgmt/master/getUOMMaster";
      const locatorMasterUrl =
        "https://uat-sai-app.azurewebsites.net/sai-inv-mgmt/master/getLocatorMaster";
      const [uomMaster, locatorMaster] = await Promise.all([axios.get(uomMasterUrl, apiHeader("GET", token)), axios.get(locatorMasterUrl, apiHeader("GET", token))]);
      const { responseData: uomMasterData } = uomMaster.data;
      const { responseData: locatorMasterData } = locatorMaster.data;
      const uomObject = convertArrayToObject(uomMasterData, "id", "uomName" )
      const locatorObj = convertArrayToObject(locatorMasterData, "id", "locatorDesc")
      setUomMaster({...uomObject});
      setLocatorMaster({...locatorObj})
    } catch (error) {
      console.log("Error fetching Uom master details.", error);
    }
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
        "https://uat-sai-app.azurewebsites.net/sai-inv-mgmt/saveNewInspectionReport";
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
        setFormData((prevValues) => {
          return {
            ...prevValues,
            inspectionRptNo: processId,
          }
        });
        setButtonVisible(true)
        setSuccessMessage(
          `Inspection Note : ${processId}, Process Type: ${processType}, Sub Process ID: ${subProcessId}`
        );
        showModal();
        message.success(
          `Inspection Note  successfully! Process ID: ${processId}, Process Type: ${processType}, Sub Process ID: ${subProcessId}`
        );
      } else {
        // Display a generic success message if specific data is not available
        message.error("Failed to Inspection Note . Please try again later.");
      }
    } catch (error) {
      console.error("Error saving Inspection Note :", error);
      message.error("Failed to Inspection Note . Please try again later.");
    }
  };

  console.log("FROMDATAA: ", formData.dateOfInspectionDate)

  // ... (other JSX and return statement)
  const handleValuesChange = (_, allValues) => {
    setType(allValues.type);
  };

  return (
    <div className="goods-receive-note-form-container" ref={formRef}>
      <h1>Sports Authority of India - Inspection Note</h1>
      <Form
        onFinish={onFinish}
        className="goods-recieve-note-form"
        onValuesChange={handleValuesChange}
        layout="vertical"
      >
        <Row>
          <Col span={6} offset={18}>
            <Form.Item label="DATE" name="inspectionNoteDate">
              <DatePicker
                defaultValue={dayjs()}
                format={dateFormat}
                style={{ width: "100%" }}
                name="inspectionNoteDate"
                onChange={(date, dateString) =>
                  handleChange("inspectionNoteDate", dateString)
                }
              ></DatePicker>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="TYPE" name="type">
              <Select onChange={(value) => handleChange("type", value)}>
                <Option value="PO">1. Purchase Order</Option>
                <Option value="IOP">2. Intern-Org Transaction</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={6} offset={12}>
            <FormInputItem label = "Inspection Note No." value={formData.inspectionRptNo === "string" ? "not defined" : formData.inspectionRptNo} />
          </Col>
        </Row>

        <Row gutter={24}>
          <Col span={8}>
            <Title strong level={2} underline type="danger">
              {Type === "PO" ? "CONSIGNEE DETAIL :-" : "CONSIGNOR DETAIL :-" }
            </Title>

            <FormInputItem label = "REGIONAL CENTER CODE :" value={Type==="PO" ? formData.ceRegionalCenterCd : formData.crRegionalCenterCd} readOnly={true} />
            <FormInputItem label = "REGIONAL CENTER NAME :" value={Type==="PO" ? formData.ceRegionalCenterName : formData.crRegionalCenterName} readOnly={true} />
            <FormInputItem label = "ADDRESS :" value={Type==="PO" ? formData.ceAddress : formData.crAddress} readOnly={true} />
            <FormInputItem label = "ZIP CODE :" value={Type==="PO" ? formData.ceZipcode: formData.crZipcode} readOnly={true} />

          </Col>
          <Col span={8}>
            <Title strong underline level={2} type="danger">
            {Type === "PO" ? "CONSIGNOR DETAIL :-" : "CONSIGNEE DETAIL :-" }
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
                <FormInputItem label="REGIONAL CENTER CODE:" value={formData.ceRegionalCenterCd} readOnly={true} />
                <FormInputItem label="REGIONAL CENTER NAME :" value={formData.ceRegionalCenterName} readOnly={true} />
                <FormInputItem label="ADDRESS :" value={formData.ceAddress || "Not defined"} readOnly={true} />
                <FormInputItem label="ZIP CODE :" value={formData.ceZipcode || "Not defined"} readOnly={true} />
              </>
            )}
          </Col>
          <Col span={8}>
            <Form.Item></Form.Item>


            <FormInputItem label={Type === "PO" ? "MIS NO. :" : "Inward Gate Pass No. :"} name="inwardGatePass" onChange={handleInwardGatePassChange} />
            <FormInputItem label = "CHALLAN / INVOICE NO. :" value={formData.challanNo} readOnly={true} />
            <FormInputItem label = "MODE OF DELIVERY :" value={formData.modeOfDelivery} readOnly={true} />
            <FormInputItem label = "DATE OF DELIVERY :" value={formData.dateOfDeliveryDate} readOnly={true} />
            <FormDatePickerItem label="DATE OF INSPECTION :" name="dateOfInspectionDate" onChange={handleChange} />
            <FormInputItem label="TYPE OF INSPECTION :" name="typeOfInspection" onChange={handleChange} />
          </Col>
        </Row>

        {/*Item Details*/}
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
                        <Form.Item label="INSPECTED QUANTITY">
                          <Input value={item.inspectedQuantity} onChange={(e)=>itemHandleChange("inspectedQuantity", e.target.value, key)} />
                        </Form.Item>
                        <Form.Item label="ACCEPTED QUANTITY">
                          <Input value={item.acceptedQuantity} onChange={(e)=>itemHandleChange("acceptedQuantity", e.target.value, key)} />
                        </Form.Item>
                        <Form.Item label="REJECTED QUANTITY">
                          <Input value={item.rejectedQuantity} onChange={(e)=>itemHandleChange("rejectedQuantity", e.target.value, key)} />
                        </Form.Item>

                        {
                          Type !== "PO" && 
                          <FormInputItem label="LOCATOR DESCRPTION" value={locatorMaster[item.locatorId]} />
                        }

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

        {/* Note and Signature */}
        <div
          style={{
            display: "flex",
            width: "100%",
            justifyContent: "space-between",
          }}
        >
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

          <div>
            <div className="goods-receive-note-signature">APPROVED BY</div>
            <div className="goods-receive-note-signature">
              NAME & SIGNATURE :
              <Form>
                <Input
                  name="issueName"
                  onChange={(e) => handleChange("issueName", e.target.value)}
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
          title="Insepction Report  saved successfully"
          visible={isModalOpen}
          onOk={handleOk}
        >
          {successMessage && <p>{successMessage}</p>}
          {errorMessage && <p>{errorMessage}</p>}
        </Modal>
      </Form>
      {/* ... (rest of the form structure) */}
    </div>
  );
};

export default InspectionNote;
