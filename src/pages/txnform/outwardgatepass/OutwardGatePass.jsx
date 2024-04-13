// OutwardGatePass.js
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
  message,
  Modal,
} from "antd";
import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";
import {
  itemNames,
  types,
  allDisciplines,
  subCategories,
  categories,
  sizes,
  usageCategories,
  brands,
  colors,
} from "../../items/KeyValueMapping";
import dayjs from "dayjs";
import axios from "axios";
import moment from "moment";
import { apiHeader } from "../../../utils/Functions";
import FormInputItem from "../../../components/FormInputItem";
import { printOrSaveAsPDF } from "../../../utils/Functions";
const dateFormat = "DD/MM/YYYY";
const { Option } = Select;
const { Text, Title } = Typography;

const convertEpochToDateString = (epochTime) => {
  // Convert epoch time to milliseconds
  let date = new Date(epochTime);

  // Extract the day, month, and year from the Date object
  let day = date.getDate();
  let month = date.getMonth() + 1; // Month starts from 0
  let year = date.getFullYear();

  // Add leading zeros if needed
  if (day < 10) {
    day = '0' + day;
  }
  if (month < 10) {
    month = '0' + month;
  }

  // Return the date string in DD/MM/YYYY format
  return `${day}/${month}/${year}`;
}


const OutwardGatePass = () => {
  const [buttonVisible, setButtonVisible] = useState(false)
  const formRef = useRef()
  const [Type, setType] = useState("IRP");
  const [selectedOption, setSelectedOption] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [itemData, setItemData] = useState([]);
  const [uomMaster, setUomMaster] = useState([]);
  const [locatorMaster, setLocatorMaster] = useState([]);
  const [locationMaster, setLocationMaster] = useState([]);
  const [vendorMaster, setVendorMaster] = useState([]);
  const [formData, setFormData] = useState({
    genDate: "",
    genName: "",
    issueDate: "",
    issueName: "",
    approvedDate: "",
    approvedName: "",
    processId: "",
    type: "",
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
    termsCondition: "12345",
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
  const userCd = localStorage.getItem("userCd")

  const populateItemData = async () => {
    const itemMasterUrl =
      "https://uat-sai-app.azurewebsites.net/sai-inv-mgmt/master/getItemMaster";
    const locatorMasterUrl =
      "https://uat-sai-app.azurewebsites.net/sai-inv-mgmt/master/getLocatorMaster";
    const uomMasterUrl =
      "https://uat-sai-app.azurewebsites.net/sai-inv-mgmt/master/getUOMMaster";
    const vendorMasteUrl =
      "https://uat-sai-app.azurewebsites.net/sai-inv-mgmt/master/getVendorMaster";
    const locationMasterUrl =
      "https://uat-sai-app.azurewebsites.net/sai-inv-mgmt/master/getLocationMaster";
    try {
      const [
        itemMaster,
        locatorMaster,
        uomMaster,
        vendorMaster,
        locationMaster,
      ] = await Promise.all([
        axios.get(itemMasterUrl, apiHeader("GET", token)),
        axios.get(locatorMasterUrl, apiHeader("GET", token)),
        axios.get(uomMasterUrl, apiHeader("GET", token)),
        axios.get(vendorMasteUrl, apiHeader("GET", token)),
        axios.get(locationMasterUrl, apiHeader("GET", token)),
      ]);

      const { responseData: itemMasterData } = itemMaster.data;
      const { responseData: locatorMasterData } = locatorMaster.data;
      const { responseData: uomMasterData } = uomMaster.data;
      const { responseData: vendorMasterData } = vendorMaster.data;
      const { responseData: locationMasterData } = locationMaster.data;

      setItemData([...itemMasterData]);
      setUomMaster([...uomMasterData]);
      setLocatorMaster([...locatorMasterData]);
      setVendorMaster([...vendorMasterData]);
      setLocationMaster([...locationMasterData]);
    } catch (error) {
      console.log("Populate item data error: ", error);
    }
  };

  useEffect(() => {
    populateItemData();
    // fetchItemData()
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
      }, apiHeader("POST", token));

      const { responseData } = response.data;
      console.log("Response data: ", responseData);
      const { organizationDetails, userDetails, locationDetails } = responseData;
      const currentDate = dayjs();
      // Update form data with fetched values
      setFormData({
        // crRegionalCenterCd: organizationDetails.crRegionalCenterCd,
        // crRegionalCenterName: organizationDetails.location,
        // crAddress: organizationDetails.locationAddr,
        // crZipcode: "131021",
        genName: userDetails.firstName,
        userId: "string",
        genDate: currentDate.format(dateFormat),
        issueDate: currentDate.format(dateFormat),
        approvedDate: currentDate.format(dateFormat),
        gatePassDate: currentDate.format(dateFormat),
        gatePassNo: "string",
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const handleIssueNoteNoChange = async (value) => {
    try {
      const apiUrl =
        "https://uat-sai-app.azurewebsites.net/sai-inv-mgmt/getSubProcessDtls";
      const response = await axios.post(apiUrl, {
        processId: value,
        processStage: "ISN",
      }, apiHeader("POST", token));
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
          // itemName: item?.itemName,
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

      const apiUrl =
        "https://uat-sai-app.azurewebsites.net/sai-inv-mgmt/saveOutwardGatePass";
      const response = await axios.post(apiUrl, formDataCopy, apiHeader("POST", token));
      console.log("API Response:", response.data);
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

        setButtonVisible(true)
        setSuccessMessage(
          `outward gate pass successfully! outward gate pass : ${processId}, Process Type: ${processType}, Sub Process ID: ${subProcessId}`
        );
        showModal();
        message.success(
          `outward gate pass successfully! Process ID: ${processId}, Process Type: ${processType}, Sub Process ID: ${subProcessId}`
        );
      } else {
        // Display a generic success message if specific data is not available
        message.error("Failed to outward gate pass. Please try again later.");
      }

      // Handle success response here
    } catch (error) {
      console.error("Error saving outward gate pass:", error);
      message.error("Failed to outward gate pass. Please try again later.");

      // Handle error response here
    }
  };

  const handleValuesChange = (_, allValues) => {
    setType(allValues.type);
  };

  const handleSelectChange = (value) => {
    setSelectedOption(value);
  };

  const handleReturnNoteNoChange = async (value) => {
    console.log("VALUEEE: ", value)
    try{
      const apiUrl =
        "https://uat-sai-app.azurewebsites.net/sai-inv-mgmt/getSubProcessDtls";
      const response = await axios.post(apiUrl, {
        processId: value,
        processStage: "REJ",
      }, apiHeader("POST", token));
      const {responseData} = response.data;
      const { processData, itemList } = responseData;

      console.log("PRocess dataaa: ", responseData)

      if(responseData !== null){
        setFormData(prev=>{
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
            noaDate:processData?.noaDate ? convertEpochToDateString(processData.noaDate) : "",
            noa: processData?.noa ? processData.noa : "",
            conditionOfGoods: processData?.conditionOfGoods,
            challanNo: processData?.challanNo,
            modeOfDelivery: processData?.modeOfDelivery,
  
            items: itemList.map(item=>(
              {
                id: item?.id,
                itemId: item?.id,
                srNo: item?.sNo,
                itemCode: item?.itemCode,
                itemDesc: item?.itemDesc,
                uom: item?.uom,
                quantity: item?.quantity,
                noOfDays: 12,
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
              }
            ))
          }
        })
      }

    }catch (error) {
      console.error("Error fetching sub process details:", error);
    }
  }

  const findColumnValue = (id, dataSource, sourceName) => {
    const foundObject = dataSource.find((obj) => obj.id === parseInt(id));

    if (sourceName === "locationMaster")
      return foundObject ? foundObject["locationName"] : "Undefined";
    if (sourceName === "locatorMaster")
      return foundObject ? foundObject["locatorDesc"] : "Undefined";
    if (sourceName === "vendorMaster")
      return foundObject ? foundObject["vendorName"] : "Undefined";
    if (sourceName === "uomMaster")
      return foundObject ? foundObject["uomName"] : "Undefined";
  };

  const removeItem = (index) => {
    setFormData((prevValues) => {
      const updatedItems = prevValues.items;
      updatedItems.splice(index, 1);

      const updatedItems1 = updatedItems.map((item, key) => {
        return { ...item, srNo: key };
      });

      return {
        ...prevValues,
        items: updatedItems1,
      };
    });
  };

  return (
    <div className="goods-receive-note-form-container" ref={formRef}>
      <h1>Sports Authority of India - Outward Gate Pass</h1>

      <Form
        onFinish={onFinish}
        className="goods-receive-note-form"
        onValuesChange={handleValuesChange}
        layout="vertical"
      >
        <Row>
          <Col span={6} offset={18}>
            <Form.Item label="DATE" name="gatePassDate">
              <DatePicker
                defaultValue={dayjs()}
                format={dateFormat}
                style={{ width: "100%" }}
                name="gatePassDate"
                onChange={(date, dateString) =>
                  handleChange("gatePassDate", dateString)
                }
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="TYPE" name="type">
              <Select onChange={(value) => handleChange("type", value)}>
                <Option value="IRP">1. Issue/Return</Option>
                <Option value="PO">2. Purchase Order</Option>
                <Option value="IOP">3. Inter-Org Transaction</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={6} offset={12}>
            {/* <Form.Item label="OUTER GATE PASS NO." name="gatePassNo">
              <Input
                disabled
                onChange={(e) => handleChange("gatePassNo", e.target.value)}
              />
            </Form.Item> */}
            <FormInputItem label="OUTER GATE PASS NO." value={formData.gatePassNo==="string" ? "not defined" : formData.gatePassNo} />
          </Col>
        </Row>

        <Row gutter={24}>
          <Col span={8}>
            <Title strong underline level={2} type="danger">
              {
                Type === "IRP" ?
                "CONSIGNOR DETAIL ;-" : "CONSIGNEE DETAIL :-"
              }
            </Title>
            <Form.Item label="REGIONAL CENTER CODE" name="crRegionalCenterCd">
              <Input value={formData.crRegionalCenterCd} readOnly />
              <div style={{ display: "none" }}>
                {formData.crRegionalCenterCd}
              </div>
            </Form.Item>
            <Form.Item
              label="REGIONAL CENTER NAME "
              name="crRegionalCenterName"
            >
              <Input value={formData.crRegionalCenterName} />
              <div style={{ display: "none" }}>
                {formData.crRegionalCenterCd}
              </div>
            </Form.Item>
            <Form.Item label="ADDRESS :" name="crAddress">
              <Input value={formData.crAddress} />
              <div style={{ display: "none" }}>
                {formData.crRegionalCenterCd}
              </div>
            </Form.Item>
            <Form.Item label="ZIP CODE :" name="crZipcode">
              <Input value={formData.crZipcode} />
              <div style={{ display: "none" }}>{formData.crZipcode}</div>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Title strong level={2} underline type="danger">
            {
                Type === "IRP" ?
                "CONSIGNEE DETAIL ;-" : "CONSIGNOR DETAIL :-"
              }
            </Title>

            {Type === "PO" && (
              <>
                <FormInputItem label="SUPPLIER CODE :" value={formData.supplierCd} readOnly={true}/>
                <FormInputItem label="SUPPLIER NAME :" value={formData.supplierName} readOnly={true}/>
                <FormInputItem label="ADDRESS :" value={formData.ceAddress} readOnly={true}/>
              </>
            )}

            {Type === "IRP" && (
              <>
                <Form.Item
                  label="CONSUMER NAME :"
                  name="consumerName"
                  initialValue={formData.consumerName}
                >
                  <Input
                    value={formData.consumerName}
                    onChange={(e) =>
                      handleChange("consumerName", e.target.value)
                    }
                  />
                  <div style={{ display: "none" }}>{formData.crZipcode}</div>
                </Form.Item>
                <Form.Item
                  label="CONTACT NO. :"
                  name="contactNo"
                  initialValue={formData.contactNo}
                >
                  <Input
                    value={formData.contactNo}
                    onChange={(e) => handleChange("contactNo", e.target.value)}
                  />
                  <div style={{ display: "none" }}>{formData.crZipcode}</div>
                </Form.Item>
              </>
            )}

            {Type === "IOP" && (
              <>
                <Form.Item
                  label="REGIONAL CENTER CODE :"
                  name="ceRegionalCenterCd"
                >
                  <Input
                    value={formData.ceRegionalCenterCd}
                    onChange={(e) =>
                      handleChange("ceRegionalCenterCd", e.target.value)
                    }
                  />
                  <div style={{ display: "none" }}>
                    {formData.ceRegionalCenterCd}
                  </div>
                </Form.Item>
                <Form.Item
                  label="REGIONAL CENTER NAME  :"
                  name="ceRegionalCenterName"
                >
                  <Input
                    value={formData.ceRegionalCenterName}
                    onChange={(e) =>
                      handleChange("ceRegionalCenterName", e.target.value)
                    }
                  />
                  <div style={{ display: "none" }}>
                    {formData.ceRegionalCenterCd}
                  </div>
                </Form.Item>
                <Form.Item label="ADDRESS :" name="ceAddress">
                  <Input
                    value={formData.ceAddress}
                    onChange={(e) => handleChange("ceAddress", e.target.value)}
                  />
                  <div style={{ display: "none" }}>
                    {formData.ceRegionalCenterCd}
                  </div>
                </Form.Item>
                <Form.Item label="ZIP CODE :" name="ceZipcode">
                  <Input
                    value={formData.ceZipcode}
                    onChange={(e) => handleChange("ceZipcode", e.target.value)}
                  />
                  <div style={{ display: "none" }}>
                    {formData.ceRegionalCenterCd}
                  </div>
                </Form.Item>
              </>
            )}
          </Col>
          <Col span={8}>
            <Form.Item></Form.Item>
            {Type === "IRP" && (
              <Form.Item label="ISSUE NOTE NO. :" name="issuenoteno">
                <Input
                  onChange={(e) => handleIssueNoteNoChange(e.target.value)}
                />
              </Form.Item>
            )}
            {Type === "PO" && (
              <Form.Item label="REJECTION NOTE NO.  :" name="rejectionNoteNo">
                <Input
                  onChange={(e) =>
                    handleReturnNoteNoChange(e.target.value)
                  }
                />
              </Form.Item>
            )}
            {Type === "IOP" && (
              <>
                <Form.Item label="SELECT NOTE TYPE" name="noteType">
                  <Select onChange={handleSelectChange}>
                    <Option value="ISSUE">ISSUE NOTE NO.</Option>
                    <Option value="REJECTION">REJECTION NOTE NO.</Option>
                  </Select>
                </Form.Item>
                {selectedOption === "ISSUE" ? (
                  <Form.Item label="ISSUE NOTE NO. :" name="issuenoteno">
                    <Input
                      onChange={(e) => handleIssueNoteNoChange(e.target.value)}
                    />
                  </Form.Item>
                ) : (
                  <Form.Item
                    label="REJECTION NOTE NO.  :"
                    name="rejectionNoteNo"
                  >
                    <Input
                      onChange={(e) =>
                        handleIssueNoteNoChange("rejectionNoteNo", e.target.value)
                      }
                    />
                  </Form.Item>
                )}
              </>
            )}
            {(Type === "IOP" || Type === "PO") && (
              <>
                  <FormInputItem label="NOA NO :" value={formData.noa} />
                  <FormInputItem label="NOA DATE :" value={formData.noaDate} />
                  <FormInputItem label="DATE OF DELIVERY :" value={formData.dateOfDelivery} />
              </>
            )}
          </Col>
        </Row>
        {(Type === "IOP" || Type === "PO") && (
          <Row gutter={24}>
            <Col span={8}>
            <FormInputItem label="CHALLAN / INVOICE NO. :" value={formData.challanNo} />
            </Col>
            <Col span={8}>
              <FormInputItem label="MODE OF DELIVERY :" value={formData.modeOfDelivery} />
            </Col>
          </Row>
        )}
        {/* Item Details */}
        <h2>ITEM DETAILS</h2>

        <Form.List name="items" initialValue={formData.items || [{}]}>
          {(fields, { add, remove }) => (
            <>
              {formData.items?.length > 0 &&
                formData.items.map((item, key) => {
                  return (
                    // <div className="xyz" style={{font:"150px", zIndex: "100"}}>xyz</div>

                    <div
                      key={key}
                      style={{
                        marginBottom: 16,
                        border: "1px solid #d9d9d9",
                        padding: 16,
                        borderRadius: 4,
                        display: "grid",
                        gridTemplateColumns:
                          "repeat(auto-fit, minmax(200px, 1fr))",
                        gap: "20px",
                      }}
                    >
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
                        <Input
                          value={findColumnValue(
                            item.uom,
                            uomMaster,
                            "uomMaster"
                          )}
                        />
                      </Form.Item>

                      {
                        Type === "IRP" &&
                        
                        <Form.Item label="LOCATOR DESCRIPITON">
                        <Input
                          value={findColumnValue(
                            item.locatorId,
                            locatorMaster,
                            "locatorMaster"
                            )}
                            readOnly
                            />
                      </Form.Item>
                          }
                    

                      <Form.Item label={Type === "IRP" ? "REQUIRED QUANTITY" : "QUANTITY"}>
                        <Input
                          value={item.quantity}
                          onChange={(e) =>
                            itemHandleChange("quantity", e.target.value, key)
                          }
                        />
                      </Form.Item>

                      {

                        (Type === "IRP" || Type === "IOP" ) && 
                        <Form.Item label="REQUIRED FOR NO. OF DAYS">
                        <Input
                          value={item.noOfDays}
                          onChange={(e) =>
                            itemHandleChange("noOfDays", e.target.value, key)
                          }
                          />
                      </Form.Item>
                      }

                      <Form.Item label="REMARK">
                        <Input
                          value={item.remarks}
                          onChange={(e) =>
                            itemHandleChange("remarks", e.target.value, key)
                          }
                        />
                      </Form.Item>

                      <Col span={1}>
                        <MinusCircleOutlined
                          onClick={() => removeItem(key)}
                          style={{ marginTop: 8 }}
                        />
                      </Col>
                    </div>
                  );
                })}
            </>
          )}
        </Form.List>

        {/* Condition of Goods 
        <h2>CONDITION OF GOODS</h2>*/}
        {Type !== "PO" && (
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item label="TERMS AND CONDITION :" name="conditionOfGoods">
                <Input.TextArea
                  value={formData.termsCondition}
                  autoSize={{ minRows: 3, maxRows: 6 }}
                  readonly
                />
                <Input style={{ display: "none" }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="NOTE" name="note">
                <Input.TextArea
                  value={formData.note}
                  autoSize={{ minRows: 3, maxRows: 6 }}
                  onChange={(e) => handleChange("note", e.target.value)}
                />
                <Input style={{ display: "none" }} />
              </Form.Item>
            </Col>
          </Row>
        )}

        {/* Note and Signature */}

        <div
          style={{
            display: "flex",
            width: "100%",
            justifyContent: "space-between",
          }}
        >
          <div>
            <div className="goods-receive-note-signature">GENERATED BY :</div>
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
          {Type === "PO" && (
            <div>
              <div className="goods-receive-note-signature">VERIFIED BY :</div>
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
          )}
          {Type !== "PO" && (
            <div>
              <div className="goods-receive-note-signature">RECEIVED BY :</div>
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
              Save
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
              Submit
            </Button>
          </Form.Item>
          <Form.Item>
          <Button disabled={!buttonVisible} onClick={()=> printOrSaveAsPDF(formRef)} type="primary" danger style={{ width: '200px', margin: 16, alignContent: 'end' }}>
              PRINT
            </Button>
          </Form.Item>
        </div>
        <Modal
          title="outward gate pass saved successfully"
          visible={isModalOpen}
          onOk={handleOk}
        >
          {successMessage && <p>{successMessage}</p>}
          {errorMessage && <p>{errorMessage}</p>}
        </Modal>
      </Form>
    </div>
  );
};

export default OutwardGatePass;
