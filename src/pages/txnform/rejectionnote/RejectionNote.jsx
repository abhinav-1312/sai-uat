// RejectionNote.js
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
import dayjs from "dayjs";
import axios from "axios";
import { apiHeader } from "../../../utils/Functions";
import FormInputItem from "../../../components/FormInputItem";
import { convertArrayToObject, convertEpochToDateString, fetchUomLocatorMaster, printOrSaveAsPDF } from "../../../utils/Functions";
const dateFormat = "DD/MM/YYYY";
const { Option } = Select;
const { Title } = Typography;

const RejectionNote = () => {
  const [buttonVisible, setButtonVisible] = useState(false)
  const formRef = useRef()
  const [Type, setType] = useState("2");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [itemData, setItemData] = useState([]);
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
    inspectionRptNo: "",
    acptRejNoteNo: "",
    acptRejNodeDT: "",
    dateOfDelivery: "",
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
    note: "",
    conditionOfGoods: "",
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
    userId: "",
    supplierName: "",
    supplierCd: "",
    address: "",
    noaDate: "",
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
        // uom: "string",
        // conditionOfGoods: "string", // Hard-coded data
        // budgetHeadProcurement: "string", // Hard-coded data
        // locatorId: "string", // Hard-coded data
      };
      return {
        ...prevValues,
        items: updatedItems,
      };
    });
  };
  useEffect(() => {
    fetchUomLocatorMaster(setUomMaster, setLocatorMaster);
    fetchItemData();
    fetchUserDetails();
  }, []);

  const token = localStorage.getItem("token")

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
        ceRegionalCenterCd: organizationDetails.id,
        ceRegionalCenterName: organizationDetails.organizationName,
        ceAddress: organizationDetails.locationAddr,
        ceZipcode: locationDetails.zipcode,
        genName: userDetails.firstName,
        userId: "string",
        genDate: currentDate.format(dateFormat),
        issueDate: currentDate.format(dateFormat),
        approvedDate: currentDate.format(dateFormat),
        acptRejNodeDT: currentDate.format(dateFormat),
        acptRejNoteNo: "string",
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleInspectionNOChange = async (value) => {
    try {
      const apiUrl =
        "https://uat-sai-app.azurewebsites.net/sai-inv-mgmt/getSubProcessDtls";
      const response = await axios.post(apiUrl, {
        processId: value,
        processStage: "IRN",
      }, apiHeader("POST", token));
      const responseData = response.data.responseData;
      const { processData, itemList } = responseData;
      console.log("API Response:", response.data);
      setFormData((prevFormData) => ({
        ...prevFormData,

        issueName: processData?.issueName,
        approvedName: processData?.approvedName,
        processId: processData?.processId,

        ceRegionalCenterCd: processData?.ceRegionalCenterCd,
        ceRegionalCenterName: processData?.ceRegionalCenterName,
        ceAddress: processData?.ceAddress,
        ceZipcode: processData?.ceZipcode,

        crRegionalCenterCd: processData?.crRegionalCenterCd,
        crRegionalCenterName: processData?.crRegionalCenterName,
        crAddress: processData?.crAddress,
        crZipcode: processData?.crZipcode,

        consumerName: processData?.consumerName,
        contactNo: processData?.contactNo,

        supplierCd: processData?.supplierCd,
        supplierName: processData?.supplierName,
        crAddress: processData?.crAddress,

        noaDate:processData?.noaDate ? convertEpochToDateString(processData.noaDate) : "",
        noa: processData?.noa ? processData.noa : "",
        dateOfDelivery: processData?.dateOfDelivery,

        items: itemList.map((item) => ({
          srNo: item.sNo,
          itemCode: item.itemCode,
          itemDesc: item.itemDesc,
          uom: item?.uom,
          quantity: item.rejectedQuantity,
          noOfDays: item.requiredDays,
          remarks: item.remarks,
          conditionOfGoods: item.conditionOfGoods,
          budgetHeadProcurement: item.budgetHeadProcurement,
          locatorId: item.locatorId,
          rejectedQuantity: item.rejectedQuantity
        })),
      }));
      // Handle response data as needed
    } catch (error) {
      console.error("Error fetching sub process details:", error);
      // Handle error
    }
  };
  const onFinish = async () => {
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
        "inspectionRptNo",
        "acptRejNoteNo",
        "acptRejNodeDT",
        "dateOfDelivery",
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
        "note",
        "conditionOfGoods",
        "supplierName",
        "supplierCd",
        "address",
        "noaDate",
        "userId",
      ];

      allFields.forEach((field) => {
        if (!(field in formDataCopy)) {
          formDataCopy[field] = "";
        }
      });

      const apiUrl =
        "https://uat-sai-app.azurewebsites.net/sai-inv-mgmt/saveRejectionNote";
      const response = await axios.post(apiUrl, formDataCopy, apiHeader("POST", token));
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
          return{
            ...prev,
            acptRejNoteNo: processId,
          }
        });

        setButtonVisible(true)
        setSuccessMessage(
          `Rejection note saved successfully! Issue Note No : ${processId}, Process Type: ${processType}, Sub Process ID: ${subProcessId}`
        );
        showModal();
        message.success(
          `Rejection note saved successfully! Process ID: ${processId}, Process Type: ${processType}, Sub Process ID: ${subProcessId}`
        );
      } else {
        // Display a generic success message if specific data is not available
        message.error("Failed to save Rejection note. Please try again later.");
      }
    } catch (error) {
      console.error("Error saving Rejection note:", error);
      message.error("Failed to submit Rejection note. ");
    }
  };

  const handleValuesChange = (_, allValues) => {
    setType(allValues.type);
  };

  const removeItem = (index) => {
    setFormData((prevValues) => {
      const updatedItems = prevValues.items;
      updatedItems.splice(index, 1);

      const updatedItems1 = updatedItems.map((item, key) => {
        return { ...item, srNo: key + 1 };
      });

      return {
        ...prevValues,
        items: updatedItems1,
      };
    });
  };


  return (
    <div className="goods-receive-note-form-container" ref={formRef}>
      <h1>Sports Authority of India - Rejection Note</h1>

      <Form
        onFinish={onFinish}
        className="goods-receive-note-form"
        onValuesChange={handleValuesChange}
        layout="vertical"
      >
        <Row>
          <Col span={6} offset={18}>
            <Form.Item label="DATE" name="acptRejNodeDT">
              <DatePicker
                defaultValue={dayjs()}
                format={dateFormat}
                style={{ width: "100%" }}
                name="acptRejNodeDT"
                onChange={(date, dateString) =>
                  handleChange("acptRejNodeDT", dateString)
                }
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="TYPE" name="type">
              <Select onChange={(value) => handleChange("type", value)}>
                <Option value="PO"> Purchase Order</Option>
                <Option value="IOP"> Inter-Org Transaction</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={6} offset={12}>
            {/* <Form.Item label="REJECTION NOTE NO ." name="acptRejNoteNo">
              <Input
                disabled
                onChange={(e) => handleChange("acptRejNoteNo", e.target.value)}
              />
            </Form.Item> */}

            <FormInputItem label="REJECTION NOTE NO." value={formData.acptRejNoteNo === "string" ? "not defined" : formData.acptRejNoteNo} />
          </Col>
        </Row>

        <Row gutter={24}>
          <Col span={8}>
            <Title strong level={2} underline type="danger">

              {Type === "IOP" ? "CONSIGNOR DETAIL :-" : "CONSIGNEE DETAIL :-"} 
            </Title>

            {
              Type === "IOP" && 
              <>
                <FormInputItem label="REGIONAL CENTER CODE" value={formData.crRegionalCenterCd} />
                <FormInputItem label="REGIONAL CENTER NAME" value={formData.crRegionalCenterName} />
                <FormInputItem label="ADDRESS" value={formData.crAddress} />
                <FormInputItem label="ZIPCODE" value={formData.crZipcode} />
              </>
            }

            {
              Type === "PO" &&
              <>
                <FormInputItem label="REGIONAL CENTER CODE" value={formData.ceRegionalCenterCd} />
                <FormInputItem label="REGIONAL CENTER NAME" value={formData.ceRegionalCenterName} />
                <FormInputItem label="ADDRESS" value={formData.ceAddress} />
                <FormInputItem label="ZIPCODE" value={formData.ceZipcode} />
              </>

            }

            {/* <Form.Item label="REGIONAL CENTER CODE" name="ceRegionalCenterCd">
              <Input value={formData.ceRegionalCenterCd} />
              <div style={{ display: "none" }}>
                {formData.ceRegionalCenterCd}
              </div>
            </Form.Item>
            <Form.Item
              label="REGIONAL CENTER NAME "
              name="ceRegionalCenterName"
            >
              <Input value={formData.ceRegionalCenterName} />
              <div style={{ display: "none" }}>
                {formData.ceRegionalCenterCd}
              </div>
            </Form.Item>
            <Form.Item label="ADDRESS :" name="ceAddress">
              <Input value={formData.ceAddress} />
              <div style={{ display: "none" }}>
                {formData.ceRegionalCenterCd}
              </div>
            </Form.Item>
            <Form.Item label="ZIP CODE :" name="ceZipcode">
              <Input value={formData.ceZipcode} />
              <div style={{ display: "none" }}>
                {formData.ceZipcode}
              </div>
            </Form.Item> */}
          </Col>

          <Col span={8}>
          <Title strong underline level={2} type="danger">
            {Type === "IOP" ? "CONSIGNEE DETAIL :-" : "CONSIGNOR DETAIL :-"}
            </Title>

            {Type === "PO" && (
              <>
                <FormInputItem
                  label="SUPPLIER CODE :"
                  value={formData.supplierCd}
                />
                <FormInputItem
                  label="SUPPLIER NAME :"
                  value={formData.supplierName}
                />
                <FormInputItem
                  label="ADDRESS :"
                  value={formData.crAddress || "Not defined"}
                />
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
                 <FormInputItem label="REGIONAL CENTER CODE" value={formData.ceRegionalCenterCd} />
                <FormInputItem label="REGIONAL CENTER NAME" value={formData.ceRegionalCenterName} />
                <FormInputItem label="ADDRESS" value={formData.ceAddress} />
                <FormInputItem label="ZIPCODE" value={formData.ceZipcode} />
              </>
            )}
          </Col>

          <Col span={8}>
            <Form.Item></Form.Item>
            <Form.Item
              label={
                Type !== "PO"
                  ? "INSPECTION REPORT NO. :"
                  : "INSPECTION NOTE NO. :"
              }
              name="inspectionreportno"
            >
              <Input
                onChange={(e) => handleInspectionNOChange(e.target.value)}
              />
            </Form.Item>
            {/* <Form.Item label="NOA NO." name="noaNo">
              <Input onChange={(e) => handleChange("noaNo", e.target.value)} />
            </Form.Item> */}
            {/* <Form.Item label="NOA DATE" name="noaDate">
              <DatePicker
                format={dateFormat}
                style={{ width: "100%" }}
                onChange={(date, dateString) =>
                  handleChange("noaDate", dateString)
                }
              />
            </Form.Item> */}
            {
              Type === "PO" &&
              <>
                <FormInputItem label="NOA :" value={formData.noa} />
                <FormInputItem label="NOA DATE :" value={formData.noaDate} />
                <FormInputItem label="DATE OF DELIVERY :" value={formData.dateOfDelivery} />
              </>
            }
          </Col>
        </Row>

        {/* Item Details */}
        <h2>ITEM DETAILS</h2>

        <Form.List name="itemDetails" initialValue={formData.items || [{}]}>
          {(fields, { add, remove }) => (
            // <>
            //   <Form.Item style={{ textAlign: "right" }}>
            //     <Button
            //       type="dashed"
            //       onClick={() => add()}
            //       style={{ marginBottom: 8 }}
            //       icon={<PlusOutlined />}
            //     >
            //       ADD ITEM
            //     </Button>
            //   </Form.Item>
            //   {fields.map(({ key, name, ...restField }, index) => (
            //     <div
            //       key={key}
            //       style={{
            //         marginBottom: 16,
            //         border: "1px solid #d9d9d9",
            //         padding: 16,
            //         borderRadius: 4,
            //       }}
            //     >
            //       <Row gutter={24}>
            //         <Col span={6}>
            //           <Form.Item
            //             {...restField}
            //             label="S.NO."
            //             name={[name, "sNo"]}
            //           >
            //             <Input value={index + 1} />
            //             <span style={{ display: "none" }}>{index + 1}</span>
            //           </Form.Item>
            //         </Col>
            //         <Col span={6}>
            //           <Form.Item
            //             {...restField}
            //             label="ITEM CODE"
            //             name={[name, "itemCode"]}
            //           >
            //             <AutoComplete
            //               style={{ width: "100%" }}
            //               options={itemData.map((item) => ({
            //                 value: item.itemMasterCd,
            //               }))}
            //               placeholder="Enter item code"
            //               filterOption={(inputValue, option) =>
            //                 option.value
            //                   .toUpperCase()
            //                   .indexOf(inputValue.toUpperCase()) !== -1
            //               }
            //             />
            //           </Form.Item>
            //         </Col>
            //         <Col span={6}>
            //           <Form.Item
            //             {...restField}
            //             label="ITEM DESCRIPTION"
            //             name={[name, "itemDescription"]}
            //           >
            //             <AutoComplete
            //               style={{ width: "100%" }}
            //               options={itemData.map((item) => ({
            //                 value: item.itemMasterDesc,
            //               }))}
            //               placeholder="Enter item description"
            //               filterOption={(inputValue, option) =>
            //                 option.value
            //                   .toUpperCase()
            //                   .indexOf(inputValue.toUpperCase()) !== -1
            //               }
            //             />
            //           </Form.Item>
            //         </Col>
            //         <Col span={5}>
            //           <Form.Item
            //             {...restField}
            //             label="UOM"
            //             name={[name, "uom"]}
            //           >
            //             <AutoComplete
            //               style={{ width: "100%" }}
            //               options={itemData.map((item) => ({
            //                 value: item.uom,
            //               }))}
            //               placeholder="Enter UOM"
            //               filterOption={(inputValue, option) =>
            //                 option.value
            //                   .toUpperCase()
            //                   .indexOf(inputValue.toUpperCase()) !== -1
            //               }
            //             />
            //           </Form.Item>
            //         </Col>
            //         {Type !== "PO" && (
            //           <Col span={6}>
            //             <Form.Item
            //               {...restField}
            //               label="INSPECTED QUANTITY "
            //               name={[name, "inspectionquantity"]}
            //             >
            //               <Input
            //                 value={formData.items?.[index]?.quantity}
            //                 onChange={(e) =>
            //                   itemHandleChange(
            //                     `inspectionquantity`,
            //                     e.target.value,
            //                     index
            //                   )
            //                 }
            //               />
            //               <span style={{ display: "none" }}>{index + 1}</span>
            //             </Form.Item>
            //           </Col>
            //         )}
            //         <Col span={6}>
            //           <Form.Item
            //             {...restField}
            //             label="REJECTED QUANTITY "
            //             name={[name, "quantity"]}
            //           >
            //             <Input
            //               onChange={(e) =>
            //                 itemHandleChange(`quantity`, e.target.value, index)
            //               }
            //             />
            //           </Form.Item>
            //         </Col>

            //         <Col span={5}>
            //           <Form.Item
            //             {...restField}
            //             label="REMARK"
            //             name={[name, "remarks"]}
            //           >
            //             <Input
            //               onChange={(e) =>
            //                 itemHandleChange(`remarks`, e.target.value, index)
            //               }
            //             />
            //           </Form.Item>
            //         </Col>
            //         <Col span={1}>
            //           <MinusCircleOutlined
            //             onClick={() => remove(name)}
            //             style={{ marginTop: 8 }}
            //           />
            //         </Col>
            //       </Row>
            //     </div>
            //   ))}
            // </>
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

                        <Form.Item label="REJECTED QUANTITY">
                          <Input value={item.rejectedQuantity} onChange={(e)=>itemHandleChange("quantity", e.target.value, key)} />
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
        {Type !== "PO" && (
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
            <div className="goods-receive-note-signature">GENERATED BY</div>
            {Type === "PO" && (
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
            )}
            {Type !== "PO" && (
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
            )}
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
          {Type !== "PO" && (
            <div>
              <div className="goods-receive-note-signature">APPROVED BY</div>
              <div className="goods-receive-note-signature">
                NAME & SIGNATURE :
                <Form>
                  <Input
                    value={formData.approvedName}
                    name="approvedName"
                    onChange={(e) =>
                      handleChange("approvedName", e.target.value)
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
                  name="approvedDate"
                  onChange={(date, dateString) =>
                    handleChange("approvedDate", dateString)
                  }
                />
              </div>
            </div>
          )}
          {Type !== "PO" && (
            <div>
              <div className="goods-receive-note-signature">RECEIVED BY</div>
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
          title="Rejection Note saved successfully"
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

export default RejectionNote;
