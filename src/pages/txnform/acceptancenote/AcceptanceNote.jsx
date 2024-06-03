// AcceptanceNote.js
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
  message,
  Modal,
} from "antd";
import { MinusCircleOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import axios from "axios";
import { apiCall, apiHeader, convertEpochToDateString, fetchUomLocatorMaster, printOrSaveAsPDF } from "../../../utils/Functions";
import FormInputItem from "../../../components/FormInputItem";
import { useSelector } from "react-redux";
import { BASE_URL } from "../../../utils/BaseUrl";
const dateFormat = "DD/MM/YYYY";
const { Option } = Select;
const { Title } = Typography;

const AcceptanceNote = () => {
  const [buttonVisible, setButtonVisible] = useState(false)
  const formRef = useRef()
  const [Type, setType] = useState("PO");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [itemData, setItemData] = useState([]);
  const [uomMaster, setUomMaster] = useState({});
  const [locatorMaster, setLocatorMaster] = useState({});
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
      };
      return {
        ...prevValues,
        items: updatedItems,
      };
    });
  };

  useEffect(() => {
    fetchUomLocatorMaster(setUomMaster, setLocatorMaster)
    fetchUserDetails();
  }, []);

  const { organizationDetails, locationDetails, userDetails, token, userCd } = useSelector(state => state.auth)

  const fetchUserDetails = async () => {
    // try {
      // const userCd = localStorage.getItem("userCd")
      // const password = localStorage.getItem("password")
      // const apiUrl =
      //   "/login/authenticate";
      // const response = await axios.post(apiUrl, {
      //   userCd,
      //   password,
      // });

      const currentDate = dayjs();
      // Update form data with fetched values
      setFormData({
        ceRegionalCenterCd: organizationDetails.id,
        ceRegionalCenterName: organizationDetails.organizationName,
        ceAddress: organizationDetails.locationAddr,
        ceZipcode: locationDetails.zipcode,
        genName: userDetails.firstName + " " + userDetails.lastName,
        userId: userCd,
        genDate: currentDate.format(dateFormat),
        issueDate: currentDate.format(dateFormat),
        approvedDate: currentDate.format(dateFormat),
        acptRejNodeDT: currentDate.format(dateFormat),
        acptRejNoteNo: "string",
      });
    // } catch (error) {
    //   console.error("Error fetching data:", error);
    // }
  };

  const handleInspectionNOChange = async (value) => {
    try {
      // const apiUrl =
      //   "/getSubProcessDtls";
      // const response = await axios.post(apiUrl, {
      //   processId: value,
      //   processStage: "IRN",
      // }, apiHeader("POST", token));

      const data = await apiCall("POST", `/getSubProcessDtls`, token, {processId: value, processStage: "IRN"})
      const {responseData} = data;
      const { processData, itemList } = responseData;
      setFormData((prevFormData) => ({
        ...prevFormData,

        issueName: processData?.issueName,
        approvedName: processData?.approvedName,
        processId: processData?.processId,

        ceRegionalCenterCd: processData?.ceRegionalCenterCd,
        ceRegionalCenterName: processData?.ceRegionalCenterName,
        ceAddress: processData?.ceAddress,
        ceZipcode: processData?.ceZipcode,

        consumerName: processData?.consumerName,
        contactNo: processData?.contactNo,

        supplierCd: processData?.supplierCd,
        supplierName: processData?.supplierName,
        crAddress: processData?.crAddress,
        crRegionalCenterCd: processData?.crRegionalCenterCd,
        crRegionalCenterName: processData?.crRegionalCenterName,
        crZipcode: processData?.crZipcode,

        dateOfDelivery: processData?.dateOfDelivery,
        noaDate:processData?.noaDate ? convertEpochToDateString(processData.noaDate) : "",
        noa: processData?.noa ? processData.noa : "",

        items: itemList.map((item) => ({
          srNo: item.sNo,
          itemCode: item.itemCode,
          itemDesc: item.itemDesc,
          uom: item?.uom,
          quantity: item.acceptedQuantity,
          inspectedQuantity: item.inspectedQuantity,
          noOfDays: item.requiredDays,
          remarks: item.remarks,
          conditionOfGoods: item.conditionOfGoods,
          budgetHeadProcurement: item.budgetHeadProcurement,
          locatorId: item.locatorId,
          acceptedQuantity: item.acceptedQuantity,
        })),
      }));
      // Handle response data as needed
    } catch (error) {
      console.error("Error fetching sub process details:", error);
      // Handle error
    }
  };

  console.log("FOrmdata: ", formData)

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
        "userId",
        "supplierName",
        "supplierCd",
        "address",
        "noaDate",
      ];

      allFields.forEach((field) => {
        if (!(field in formDataCopy)) {
          formDataCopy[field] = "";
        }
      });

      const apiUrl =
      "/saveAcceptanceNote";
      // const response = await axios.post(apiUrl, formDataCopy, apiHeader("POST", token));
      const data = await apiCall("POST", `/saveAcceptanceNote`, token, formDataCopy)
      const {responseData} = data
      if (
        data.responseStatus &&
        data.responseStatus.message === "Success"
      ) {
        // Access the specific success message data if available
        const { processId, processType, subProcessId } =
          responseData;
        setFormData((prev) => {
          return {
            ...prev,
            acptRejNoteNo: processId,
          };
        });
        setButtonVisible(true)
        setSuccessMessage(
          `Acceptance Note : ${processId}, Process Type: ${processType}, Sub Process ID: ${subProcessId}`
        );
        showModal();
        message.success(
          `Acceptance Note  successfully! Process ID: ${processId}, Process Type: ${processType}, Sub Process ID: ${subProcessId}`
        );
      } else {
        // Display a generic success message if specific data is not available
        message.error("Failed to Acceptance Note . Please try again later.");
      }
    } catch (error) {
      console.error("Error saving Acceptance Note :", error);
      message.error("Failed to Acceptance Note . Please try again later.");

      // Handle error response here
    }
  };

  const handleValuesChange = (_, allValues) => {
    setType(allValues.type);
  };

  return (
    <div className="goods-receive-note-form-container" ref={formRef}>
      <h1>Sports Authority of India - Acceptance Note</h1>

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
            <FormInputItem label="ACCEPTANCE NOTE NO." value={formData.acptRejNoteNo === "string" ? "not defined" : formData.acptRejNoteNo} />
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
                {formData.ceRegionalCenterCd}
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
                Type !== "PO" ? "INSPECTION REPORT NO.:" : "INSPECTION NOTE NO."
              }
              name="inspectionreportno"
            >
              <Input
                onChange={(e) => handleInspectionNOChange(e.target.value)}
              />
            </Form.Item>
            
            {
              Type === "PO" &&
              <>
                <FormInputItem label="NOA NO. :" value={formData.noa} />
                <FormInputItem label="NOA DATE :" value={formData.noaDate} />
                <FormInputItem label="DATE OF DELIVERY" value={formData.dateOfDelivery} />
              </>
            }
          </Col>
        </Row>

        {/* Item Details */}
        <h2>ITEM DETAILS</h2>

        <Form.List name="itemDetails" initialValue={formData.items || [{}]}>
          {(fields, { add, remove }) => (
            <>
              {formData?.items?.length > 0 &&
                formData.items.map((item, key) => (
                  <div style={{
                    marginBottom: 16,
                    border: "1px solid #d9d9d9",
                    padding: 16,
                    borderRadius: 4,
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                    gap: "20px",
                  }}>
                    <FormInputItem
                      label="Serial No. :"
                      key={key}
                      value={item.srNo}
                    />
                    <FormInputItem
                      label="Item Code :"
                      key={key}
                      value={item.itemCode}
                    />
                    <FormInputItem
                      label="Item Description :"
                      key={key}
                      value={item.itemDesc}
                    />
                    <FormInputItem
                      label="UOM :"
                      key={key}
                      value={uomMaster[item.uom]}
                    />

                    {Type !== "PO" && Type !== "IOP" && (
                      <>
                        <FormInputItem label="INSPECTED QUANTITY" value = {item.inspectedQuantity} />
                      </>
                    )}

                    <FormInputItem label="ACCEPTED QUANTITY" value={item.acceptedQuantity} />
                    <Form.Item label="REMARK">
                      <Input
                        value={item.remarks}
                        onChange={(e) =>
                          itemHandleChange(
                            "remarks",
                            e.target.value,
                            key
                          )
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
                ))}
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
          {Type !== "PO" && Type !== "IOP" && (
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
          {Type !== "PO" && Type !== "IOP" && (
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
          title="Acceptance Note saved successfully"
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

export default AcceptanceNote;
