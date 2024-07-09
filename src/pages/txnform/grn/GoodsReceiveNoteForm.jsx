// GoodsReceiveNoteForm.js
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
  Modal,
  message,
} from "antd";
import { MinusCircleOutlined } from "@ant-design/icons";
import "./GoodsReceiveNoteForm.css";
import dayjs from "dayjs";
import axios from "axios";
import FormInputItem from "../../../components/FormInputItem";
import { apiCall, apiHeader, printOrSaveAsPDF } from "../../../utils/Functions";
import { useSelector } from "react-redux";
const dateFormat = "DD/MM/YYYY";
const { Option } = Select;
const { Title } = Typography;


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

const GoodsReceiveNoteForm = () => {
  const [buttonVisible, setButtonVisible] = useState(false)
  const [selectedOption, setSelectedOption] = useState("")
  const formRef = useRef()
  const [Type, setType] = useState("IRP");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const {data: locatorMaster} = useSelector(state => state.locators)
  const {data: uomMaster} = useSelector(state => state.uoms)
  const [formData, setFormData] = useState({
    genDate: "",
    genName: "",
    issueDate: "",
    issueName: "",
    approvedDate: "",
    approvedName: "",
    processId: "",
    type: "",
    grnDate: "",
    grnNo: "",
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
    acceptanceNoteNo: "",
    returnVoucher: "",
    challanNo: "",
    supplierCode: "",
    supplierName: "",
    noteType: "",
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
    userId: "",
    conditionOfGoods: "",
    note: "",
  });

  const { organizationDetails, locationDetails, userDetails, token, userCd } = useSelector(state => state.auth)

  const {data: itemData} = useSelector(state => state.item)

  const deepClone = (obj) => {
    if (obj === null || typeof obj !== 'object') {
      return obj;
    }
  
    let clone = Array.isArray(obj) ? [] : {};
  
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        clone[key] = deepClone(obj[key]);
      }
    }
  
    return clone;
  }
  

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleChange = (fieldName, value) => {
    if(fieldName === "processType"){
      fetchUserDetails(value)
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

  useEffect(() => {
    fetchUserDetails();
  }, []);

  const fetchUserDetails = async (processType=null) => {
      const currentDate = dayjs();
      // Update form data with fetched values
      if(processType === "IRP"){
        setFormData({
          crRegionalCenterCd: organizationDetails.id,
          crRegionalCenterName: organizationDetails.location,
          crAddress: organizationDetails.locationAddr,
          crZipcode: locationDetails.zipcode,
          genName: userDetails.firstName + " " + userDetails.lastName,
          userId: userCd,
          genDate: currentDate.format(dateFormat),
          issueDate: currentDate.format(dateFormat),
          approvedDate: currentDate.format(dateFormat),
          gatePassDate: currentDate.format(dateFormat),
          grnDate: currentDate.format(dateFormat),
          gatePassNo: "Not defined",
          processType: processType,
          type: processType,
          processId: "string",
        });
      }
      else{
        setFormData({
          ceRegionalCenterCd: organizationDetails.id,
          ceRegionalCenterName: organizationDetails.location,
          ceAddress: organizationDetails.locationAddr,
          ceZipcode: locationDetails.zipcode,
          genName: userDetails.firstName + " " + userDetails.lastName,
          noaDate: currentDate.format(dateFormat),
          dateOfDelivery: currentDate.format(dateFormat),
          userId: userCd,
          genDate: currentDate.format(dateFormat),
          issueDate: currentDate.format(dateFormat),
          approvedDate: currentDate.format(dateFormat),
          gatePassDate: currentDate.format(dateFormat),
          grnDate: currentDate.format(dateFormat),
          gatePassNo: "Not defined",
          processType: processType,
          type: processType,
          processId: "string"
        });
      }
    // } catch (error) {
    //   console.error("Error fetching data:", error);
    // }
  };


  const handleReturnNoteNoChange = async (value) => {
    try {
      const subProcessDtlUrl =
        "/getSubProcessDtls";

      const data = await apiCall("POST", subProcessDtlUrl, token, {processId: value, processStage: Type === "IRP" ? "RN" : "ACT"})

      const {responseData} = data
      const {processData, itemList} = responseData

      setFormData((prevFormData) => ({
        ...prevFormData,

        issueName: processData?.issueName,
        approvedName: processData?.approvedName,
        processId: processData?.processId,

        crRegionalCenterCd: processData?.crRegionalCenterCd || processData?.regionalCenterCd,
        crRegionalCenterName: processData?.crRegionalCenterName || processData?.regionalCenterName,
        crAddress: processData?.crAddress || processData?.address,
        crZipcode: processData?.crZipcode || processData?.zipcode,

        ceRegionalCenterCd: processData?.ceRegionalCenterCd,
        ceRegionalCenterName: processData?.ceRegionalCenterName,
        ceAddress: processData?.ceAddress,
        ceZipcode: processData?.ceZipcode,

        consumerName: processData?.consumerName,
        contactNo: processData?.contactNo,

        termsCondition: processData?.termsCondition,
        note: processData?.note,

        supplierCode: processData?.supplierCd,
        supplierName: processData?.supplierName,

        noaDate:processData?.noaDate ? convertEpochToDateString(processData.noaDate) : "",
        noa: processData?.noa ? processData.noa : "",
        dateOfDelivery: processData?.dateOfDelivery,

        items: itemList?.map((item) => ({
          srNo: item?.sNo,
          itemId: item?.itemId,
          itemCode: item?.itemCode,
          itemDesc: item?.itemDesc,
          uom: parseInt(item?.uom),
          quantity: item?.quantity,
          remQuantity:item?.quantity,
          noOfDays: item?.requiredDays,
          remarks: item?.remarks,
          conditionOfGoods: item?.conditionOfGoods,
          budgetHeadProcurement: item?.budgetHeadProcurement,
          locatorId: parseInt(item?.locatorId),
          unitPrice: itemData.find(obj => obj.itemMasterCd === item.itemCode)?.price || 0,
          qtyList: [
            {
              locatorId: parseInt(item?.locatorId),
              quantity: item?.quantity,
            },
          ],
        })),
      }));
      // Handle response data as needed
    } catch (error) {
      console.error("Error fetching sub process details:", error);
    }
  };

  console.log("Formdata: ", formData)

  const handleInwardGatePassNoChange = async (value) => {
    try {
      const subProcessDtlUrl =
        "/getSubProcessDtls";
      const ohqUrl =
        "/master/getOHQ";

      const subProcessRes = await apiCall("POST", subProcessDtlUrl, token, {processId: value, processStage: "IGP"})

      const { data: subProcess } = subProcessRes;
      const { responseData: subProcessData } = subProcess;
      const { processData, itemList } = subProcessData;

      setFormData((prevFormData) => ({
        ...prevFormData,

        issueName: processData?.issueName,
        approvedName: processData?.approvedName,
        processId: processData?.processId,

        crRegionalCenterCd: processData?.crRegionalCenterCd,
        crRegionalCenterName: processData?.crRegionalCenterName,
        crZipcode: processData?.crZipcode,

        ceRegionalCenterCd: processData?.ceRegionalCenterCd,
        ceRegionalCenterName: processData?.ceRegionalCenterName,
        ceAddress: processData?.ceAddress,
        ceZipcode: processData?.ceZipcode,



        consumerName: processData?.consumerName,
        contactNo: processData?.contactNo,

        termsCondition: processData?.termsCondition,
        note: processData?.note,

        supplierCode: processData?.supplierCd,
        supplierName: processData?.supplierName,
        crAddress: processData?.crAddress,
        noaDate:processData?.noaDate ? convertEpochToDateString(processData.noaDate) : "",
        noa: processData?.noa ? processData.noa : "",
        dateOfDelivery: processData?.dateOfDelivery,

        items: itemList?.map((item) => ({
          srNo: item?.sNo,
          itemId: item?.itemId,
          itemCode: item?.itemCode,
          itemDesc: item?.itemDesc,
          uom: parseInt(item?.uom),
          quantity: item?.quantity,
          remQuantity:item?.quantity,
          noOfDays: item?.requiredDays,
          remarks: item?.remarks,
          conditionOfGoods: item?.conditionOfGoods,
          budgetHeadProcurement: item?.budgetHeadProcurement,
          locatorId: parseInt(item?.locatorId),
          qtyList: [
            {
              locatorId: parseInt(item?.locatorId),
              quantity: item?.quantity,
            },
          ],
        })),
      }));
      // Handle response data as needed
    } catch (error) {
      console.error("Error fetching sub process details:", error);
      // Handle error
    }
  }

  const onFinish = async (values) => {
    let found = false
    const tempFormData = deepClone(formData)
    tempFormData.items?.forEach(item=>{
      const {quantity, remQuantity} = item;
      if(quantity-remQuantity > 0){
        message.error("Please locate a locator to all quantity")
        found = true;
        return
      }
    })

    if(found) return

    const updatedForm = deepClone(formData);
    const updatedItems = updatedForm.items?.map(item=>{
      const itemObj = item
      const {qtyList} = item
      delete itemObj.quantity
      delete itemObj.remQuantity
      delete itemObj.qtyList

      const insideArray = qtyList?.map(qtyObj=>{
        return {...itemObj, quantity: qtyObj.quantity, locatorId: qtyObj.locatorId}
      })

      return insideArray
    })
    
    const flatItemsArray = updatedItems?.flatMap(innerArray => innerArray);

    try {
      const formDataCopy = { ...formData, items: flatItemsArray };

      const allFields = [
        "genDate",
        "genName",
        "issueDate",
        "issueName",
        "approvedDate",
        "approvedName",
        "processId",
        "type",
        "grnDate",
        "grnNo",
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
        "acceptanceNoteNo",
        "returnVoucher",
        "challanNo",
        "supplierCode",
        "supplierName",
        "noteType",
        "userId",
        "conditionOfGoods",
        "note",
        "items",
        "unitPrice"
      ];

      allFields.forEach((field) => {
        if (!(field in formDataCopy)) {
          formDataCopy[field] = "";
        }
      });

      const apiUrl =
        "/saveGRN";
      const {responseStatus, responseData} = await apiCall("POST", apiUrl, token, formDataCopy)
      if (
        responseStatus.statusCode === 200 &&
        responseStatus.message === "Success"
      ) {
        // Access the specific success message data if available
        const { processId, processType, subProcessId } = responseData;
        setFormData((prevValues) => {
          return {
            ...prevValues,
            grnNo: processId,
          };
        });
        setButtonVisible(true)
        setSuccessMessage(
          ` Goods Receive Note NO : ${processId}, Process Type: ${processType}, Sub Process ID: ${subProcessId}`
        );
        showModal();
        message.success(
          `Goods Receive Note successfully! Process ID: ${processId}, Process Type: ${processType}, Sub Process ID: ${subProcessId}`
        );

      } else {
        // Display a generic success message if specific data is not available
        message.error("Failed to Goods Receive Note. Please try again later.");

      }
      // Handle success response here
    } catch (error) {
      console.log("Error saving Goods Receive Note:", error);
      message.error("Failed to Goods Receive Note. Please try again later.");
    }
  };


  const handleValuesChange = (_, allValues) => {
    setType(allValues.type);
  };

  const addLocator = (index) => {
    setFormData((prevValue) => {
      const itemsArray = prevValue.items;
      itemsArray[index].qtyList.push({ locatorId: "", quantity: 0 });
      const qtyList = prevValue.items[index].qtyList;
      const updatedQtyList = [...qtyList, { locatorId: "", quantity: 0 }];
      return {
        ...prevValue,
        items: itemsArray,
      };
    });
  };

  const findColumnValue = (id, dataSource, sourceName) => {
    const foundObject = dataSource.find((obj) => obj.id === id);

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

      const updatedItems1 = updatedItems?.map((item, key) => {
        return { ...item, srNo: key + 1 };
      });

      return {
        ...prevValues,
        items: updatedItems1,
      };
    });
  };

  const handleLocatorChange = (fieldName, itemIndex, qtyListIndex, value) => {
    // if(quantity-remQuantity-prevVal + val)
    if (fieldName === "quantity") {
      const { remQuantity, quantity, qtyList } = formData.items[itemIndex];
      const val = value === "" ? 0 : parseInt(value);
      const prevVal = qtyList[qtyListIndex].quantity;
      const calc = quantity - (remQuantity - prevVal + val);

      if (calc < 0) {
        message.error(
          "Please add items less than equal to remanining quantity."
        );
        return;
      } else {
        setFormData((prevValues) => {
          const itemArray = [...prevValues.items];
          const prevVal = itemArray[itemIndex].qtyList[qtyListIndex].quantity;
          itemArray[itemIndex].qtyList[qtyListIndex].quantity =
            value === "" ? 0 : parseInt(value);
          itemArray[itemIndex].remQuantity =
            itemArray[itemIndex].remQuantity +
            itemArray[itemIndex].qtyList[qtyListIndex][fieldName] -
            prevVal;
          return {
            ...prevValues,
            items: itemArray,
          };
        });
        return;
      }
    } else {
      setFormData((prevValues) => {
        const itemArray = [...prevValues.items];
        itemArray[itemIndex].qtyList[qtyListIndex].locatorId = parseInt(value);

        return {
          ...prevValues,
          items: itemArray,
        };
      });
    }
  };

  const handleSelectChange = (value) => {
    setSelectedOption(value);
    console.log("VSEECT VALUE: ", value)
  };

  if(!itemData) {
    return (
      <h2>Loading please wait ...</h2>
    )
  }

  return (
    <div className="goods-receive-note-form-container" ref={formRef}>
      <h1>Sports Authority of India - Goods Receive Note</h1>

      <Form
        onFinish={onFinish}
        className="goods-receive-note-form"
        onValuesChange={handleValuesChange}
        layout="vertical"
        initialValues={formData}
      >
        <Row>
          <Col span={6} offset={18}>
            <FormInputItem label="DATE :" value={formData.grnDate} />
          </Col>
          <Col span={6}>
            <Form.Item label="TYPE" name="type">
              <Select onChange={(value) => handleChange("processType", value)}>
                <Option value="IRP">1. Issue/Return</Option>
                <Option value="PO">2. Purchase Order</Option>
                <Option value="IOP">3. Inter-Org Transaction</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={6} offset={12}>
    

            <FormInputItem label="GRN No." value={formData.grnNo === "string" ? "not defined" : formData.grnNo} />
          </Col>
        </Row>

        <Row gutter={24}>
          <Col span={8}>
            <Title strong level={2} underline type="danger">
              {
                Type === "IRP" || Type === "IOP" ?
                "CONSIGNOR DETAIL ;-" : "CONSIGNEE DETAIL :-"
              }

            </Title>

            {/* for purchase order */}
            <FormInputItem label="REGIONAL CENTER CODE :" value={Type==="IRP" || Type==="IOP" ? formData.crRegionalCenterCd : formData.ceRegionalCenterCd} readOnly={true}/>
            <FormInputItem label="REGIONAL CENTER NAME :" value={Type==="IRP" || Type==="IOP" ? formData.crRegionalCenterName :formData.ceRegionalCenterName} readOnly={true} />
            <FormInputItem label="ADDRESS :" value={Type==="IRP" || Type==="IOP" ? formData.crAddress : formData.ceAddress} readOnly={true} />
            <FormInputItem label="ZIPCODE :" value={Type==="IRP" || Type==="IOP" ? formData.crZipcode : formData.ceZipcode} readOnly={true} />
          </Col>
          <Col span={8}>
            <Title strong underline level={2} type="danger">
            {
                Type === "IRP" || Type==="IOP" ?
                "CONSIGNEE DETAIL :-" : "CONSIGNOR DETAIL :-"
              }
            </Title>

            {Type === "PO" && (
              <> 
              <FormInputItem label="SUPPLIER CODE :" value={formData.supplierCode} />
              <FormInputItem label="SUPPLIER NAME :" value={formData.supplierName} />
              <FormInputItem label="ADDRESS :" value={formData.crAddress || "Not defined"} />
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
                {/* <Form.Item
                  label="REGIONAL CENTER CODE"
                  name="crRegionalCenterCd"
                >
                  <Input
                    onChange={(e) =>
                      handleChange("crRegionalCenterCd", e.target.value)
                    }
                  />
                </Form.Item>
                <Form.Item
                  label="REGIONAL CENTER NAME "
                  name="crRegionalCenterName"
                >
                  <Input
                    onChange={(e) =>
                      handleChange("crRegionalCenterName", e.target.value)
                    }
                  />
                </Form.Item>
                <Form.Item label="ADDRESS :" name="crAddress">
                  <Input
                    onChange={(e) => handleChange("crAddress", e.target.value)}
                  />
                </Form.Item>
                <Form.Item label="ZIP CODE :" name="crZipcode">
                  <Input
                    onChange={(e) => handleChange("crZipcode", e.target.value)}
                  />
                </Form.Item> */}

            <FormInputItem label="REGIONAL CENTER CODE :" value={formData.ceRegionalCenterCd} readOnly={true}/>
            <FormInputItem label="REGIONAL CENTER NAME :" value={formData.ceRegionalCenterName} readOnly={true} />
            <FormInputItem label="ADDRESS :" value={formData.ceAddress} readOnly={true} />
            <FormInputItem label="ZIPCODE :" value={formData.ceZipcode} readOnly={true} />
              </>
            )}
          </Col>
          <Col span={8}>
            <Form.Item></Form.Item>
            {Type === "IRP" && (
              <Form.Item label="RETURN NOTE NO" name="returnVoucherNo">
                <Input
                  onChange={(e) => handleReturnNoteNoChange(e.target.value)}
                />
              </Form.Item>
            )}
            {Type === "PO" && (
              <Form.Item label="ACCEPTANCE NOTE NO." name="acceptanceNoteNo">
                <Input onChange={(e) => handleReturnNoteNoChange(e.target.value)} />
              </Form.Item>
            )}
            {/* {Type === "IOP" && (
              // <Form.Item label="INWARD GATE PASS" name="inwardGatePass">
              //   <Input />
              // </Form.Item>
              <Form.Item label="ACCEPTANCE NOTE NO." name="acceptanceNoteNo">
                <Input onChange={(e) => handleReturnNoteNoChange(e.target.value)} />
              </Form.Item>
            )} */}

            {Type === "IOP" && (
              <>
                <Form.Item label="SELECT TYPE" name="noteType">
                  <Select onChange={handleSelectChange}>
                    <Option value="acceptedItems">ACCEPTED ITEMS</Option>
                    <Option value="rejectedItems">REJECTED ITEMS</Option>
                  </Select>
                </Form.Item>
                {selectedOption === "acceptedItems" ? (
                  <Form.Item label="ACCEPTANCE NOTE NO. :" name="acceptanceNoteNo">
                    <Input onChange={(e) => handleReturnNoteNoChange(e.target.value)} />
                  </Form.Item>
                ) : (
                  <Form.Item
                    label="INWARD GATE PASS NO.  :"
                    name="inwardGatePassNo"
                  >
                    <Input
                      onChange={(e) =>
                        handleInwardGatePassNoChange(e.target.value)
                      }
                    />
                  </Form.Item>
                )}
              </>
            )}  

            {(Type === "PO") && (
              <>
                <FormInputItem label="NOA NO. :" value={formData.noa} />
                <FormInputItem label="NOA DATE" value={formData.noaDate} />
                <FormInputItem label="DATE OF DELIVERY" value={formData.dateOfDelivery} />
              </>
            )}
          </Col>
        </Row>

        {/* Item Details */}
        <h2>ITEM DETAILS</h2>
        <Form.List name="items" initialValue={formData.items || [{}]}>
          {(fields, { add, remove }) => (
            <>
              {formData.items?.length > 0 &&
                formData.items.map((item, key) => {
                  return (

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
                        <Input value={item?.itemCode} readOnly />
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
                      
                        <Form.Item label="RECEIVED QUANTITY">
                        <Input value={item.quantity} readOnly />
                      </Form.Item>

                      {/* <Form.Item label="BUDGET HEAD PROCUREMENT">
                        <Input value={item.budgetHeadProcurement} readOnly />
                      </Form.Item> */}
                      {
                        formData.processType === "PO" && (
                          <FormInputItem label="Unit Price" name="unitPrice" value={item.unitPrice} onChange={(fieldName, value) => itemHandleChange(fieldName, parseInt(value), key)} />
                        )
                      }

                      <FormInputItem label="BUDGET HEAD PROCUREMENT" name="budgetHeadProcurement" value={item.budgetHeadProcurement} onChange={(name, value)=> itemHandleChange("budgetHeadProcurement", value, key)} />

                      <Form.Item
                        label="REMARK"
                        style={{ gridColumn: "span 2" }}
                      >
                        <Input
                          value={item.remarks}
                          onChange={(e) =>
                            itemHandleChange("remarks", e.target.value, key)
                          }
                        />
                      </Form.Item>

                      <div style={{gridColumn: "span 4", width: "50%"}}>
                      <h3>
                        ITEMS LEFT TO ASSIGN A LOCATOR:
                        {item.quantity - item.remQuantity}
                      </h3>

                      {item.qtyList?.length > 0 &&
                        item.qtyList.map((qtyObj, qtyKey) => {
                          return (
                            <div style={{display: "grid", gridTemplateColumns: 'auto auto', gap: '1rem'}}>
                              <Form.Item label="LOCATOR DESCRIPTION">
                                <Select
                                  style={{ width: 200 }}
                                  onChange={(value) =>
                                    handleLocatorChange(
                                      "locatorId",
                                      key,
                                      qtyKey,
                                      value
                                    )
                                  }
                                  defaultValue={Type !== "IOP" ? qtyObj.locatorId : ""}
                                >
                                  {locatorMaster ?
                                    locatorMaster.map(
                                      (option, index) => (
                                        <Option
                                          key={index}
                                          value={option.id}
                                        >
                                          {option.locatorDesc}
                                        </Option>
                                      )
                                    )
                                    :
                                    <Input />
                                  }
                                </Select>
                              </Form.Item>

                              <Form.Item label="No. of items kept">
                                <Input
                                  type="number"
                                  value={qtyObj.quantity}
                                  onChange={(e) =>
                                    handleLocatorChange(
                                      "quantity",
                                      key,
                                      qtyKey,
                                      e.target.value
                                    )
                                  }
                                />
                              </Form.Item>
                            </div>
                          );
                        })}
                      </div>

                      <Button onClick={() => addLocator(key)}>
                        Add more locator
                      </Button>

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

        {/* Condition of Goods */}
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item label="TERMS AND CONDITION" name="conditionOfGoods">
              <Input.TextArea
                value={formData.termsCondition}
                readOnly
                autoSize={{ minRows: 3, maxRows: 6 }}
              />
              <Input style={{ display: "none" }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="NOTE" name="note">
              <Input.TextArea
                onChange={(e) => handleChange("note", e.target.value)}
                autoSize={{ minRows: 3, maxRows: 6 }}
                value={formData.note}
              />
              <Input style={{ display: "none" }} />
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
            <div className="goods-receive-note-signature">VERIFIED BY</div>
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
          <Modal
            title="Goods Receive Note successfully"
            visible={isModalOpen}
            onOk={handleOk}
          >
            {successMessage && <p>{successMessage}</p>}
            {errorMessage && <p>{errorMessage}</p>}
          </Modal>
        </div>
      </Form>
    </div>
  );
};

export default GoodsReceiveNoteForm;
