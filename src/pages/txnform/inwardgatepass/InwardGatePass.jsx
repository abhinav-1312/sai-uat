// InwardGatePass.js
import React, { useState, useEffect, useRef, useMemo } from "react";
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
import {
  apiHeader,
  mergeItemMasterAndOhq,
  removeItem,
} from "../../../utils/Functions";
import FormInputItem from "../../../components/FormInputItem";
import { useDispatch, useSelector } from "react-redux";
import useHandlePrint from "../../../components/useHandlePrint";
import { useLocation, useNavigate } from "react-router-dom";
import FormDatePickerItem from "../../../components/FormDatePickerItem";
import ItemSearch from "../issuenote/ItemSearch";
import { fetchOhq } from "../../../redux/slice/ohqSlice";
const dateFormat = "DD/MM/YYYY";
const { Option } = Select;

const { TextArea } = Input;

const InwardGatePass = () => {
  const formRef = useRef();
  const [form] = Form.useForm();
  const handlePrint = useHandlePrint(formRef);
  const location = useLocation();
  const { igpData, itemList } = location.state
    ? location.state
    : { igpData: null, itemList: null };
  const inwardData = JSON.parse(localStorage.getItem("inwardData"));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [printBtnEnabled, setPrintBtnEnabled] = useState(false);
  const [submitBtnEnabled, setSubmitBtnEnabled] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");

  const { locatorObj: locatorMaster } = useSelector((state) => state.locators);
  const [formData, setFormData] = useState({
    genDate: "",
    genName: "",
    issueDate: "",
    issueName: "",
    approvedDate: "",
    approvedName: "",
    processId: "string",
    type: "PO",
    processTypeDesc: "Purchase Order",
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
    supplierCode: "",
    supplierName: "",
    noteType: "",
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
    userId: "",
    termsCondition: "",
    note: "",
    processType: "PO",
  });

  const navigate = useNavigate();

  const saveDraft = () => {
    localStorage.setItem("inwardData", JSON.stringify(formData));
    message.success("IGP data saved as draft successfully.");
  };

  const handleFormReset = () => {
    message.success("IGP data reset successfully.");
    navigate("/trans/inward", { state: { igpData: null, itemList: null } });
    window.location.reload();
    localStorage.removeItem("inwardData");
  };

  const { data: itemData } = useSelector((state) => state.item);
  const { data: ohqData } = useSelector((state) => state.ohq);

  const data = useMemo(
    () => mergeItemMasterAndOhq(itemData, ohqData),
    [itemData, ohqData]
  );

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

  const { uomObj } = useSelector((state) => state.uoms);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };
  const { organizationDetails, locationDetails, userDetails, token, userCd } =
    useSelector((state) => state.auth);

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
      console.log("Not getting vendor", error);
    }
  };

  const handleChange = (fieldName, value) => {
    if (fieldName === "processType") {
      console.log(fieldName, value);
      fetchUserDetails(value);
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

  const dispatch = useDispatch();

  useEffect(() => {
    const awaitDispatchUtil = async () => {
      await dispatch(fetchOhq()).unwrap();
    };

    awaitDispatchUtil();

    if (igpData !== null) {
      setFormData({
        ...igpData,
        processTypeDesc:
          igpData?.type === "IRP"
            ? "Issue / Return"
            : igpData?.type === "PO"
            ? "Purchase Order"
            : "Inter Org Transfer",
        items: itemList,
      });
      return;
    }

    if (inwardData) {
      setFormData({ ...inwardData });
      return;
    }

    fetchUserDetails();
  }, []);

  const fetchUserDetails = async (processType = null) => {
    const currentDate = dayjs();
    // Update form data with fetched values
    if (processType === "IRP" || processType === "IOP") {
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
        gatePassNo: "Not defined",
        processType: processType,
        processTypeDesc:
          processType === "IRP" ? "Issue/Return" : "Inter Org Transfer",
        type: processType,
        processId: "string",
      });
    } else {
      setFormData({
        ceRegionalCenterCd: organizationDetails.id,
        ceRegionalCenterName: organizationDetails.location,
        ceAddress: organizationDetails.locationAddr,
        ceZipcode: locationDetails.zipcode,
        genName: userDetails.firstName + " " + userDetails.lastName,
        // noaDate: currentDate.format(dateFormat),
        // dateOfDelivery: currentDate.format(dateFormat),
        userId: userCd,
        genDate: currentDate.format(dateFormat),
        issueDate: currentDate.format(dateFormat),
        approvedDate: currentDate.format(dateFormat),
        gatePassDate: currentDate.format(dateFormat),
        gatePassNo: "Not defined",
        processType: "PO",
        type: "PO",
        processTypeDesc: "Purchase Order",
        processId: "string",
      });
    }
    // } catch (error) {
    //   console.error("Error fetching data:", error);
    // }
  };

  const handleInwardGatePassChange = async (_, value) => {
    console.log("VALUE: ", value, "Inward gate pass");
    try {
      const apiUrl = "/getSubProcessDtls";
      const response = await axios.post(
        apiUrl,
        {
          processId: value,
          processStage: "OGP",
        },
        apiHeader("POST", token)
      );
      const responseData = response.data.responseData;
      const { processData, itemList } = responseData;
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
        processTypeDesc:
          processData?.type === "IRP"
            ? "Issue/Return"
            : processData?.type === "PO"
            ? "Purchase Order"
            : "Inter Org Transfer",

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
          `Inward gate pass successfully! Inward gate pass : ${processId}, Process Type: ${processType}, Sub Process ID: ${subProcessId}`
        );
        showModal();
        message.success(
          `Inward gate pass successfully! Process ID: ${processId}, Process Type: ${processType}, Sub Process ID: ${subProcessId}`
        );
        setPrintBtnEnabled(true);
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

  const handleSelectChange = (value) => {
    setFormData((prev) => {
      return {
        ...prev,
        noteType: value,
      };
    });
  };

  const handleIssueNoteNoChange = async (_, value) => {
    const apiUrl = "/getSubProcessDtls";
    try {
      const { data } = await axios.post(
        apiUrl,
        {
          processId: value,
          processStage: "OGP",
        },
        apiHeader("POST", token)
      );

      const { responseData, responseStatus } = data;
      const { processData, itemList } = responseData;

      if (
        responseStatus.message === "Success" &&
        responseStatus.statusCode === 200
      ) {
        setFormData((prev) => {
          return {
            ...processData,
            ...prev,
            inwardGatePass: value,
            items: itemList.map((item) => ({
              ...item,
              noOfDays: item.requiredDays,
              srNo: item.sNo,
            })),
          };
        });
      }
    } catch (error) {
      console.log("Error occured while fetching data");
    }
  };

  if (!locatorMaster || !ohqData || !itemData) {
    return <h2> Loading please wait...</h2>;
  }

  return (
    <>
      <div className="a4-container" ref={formRef}>
        <div className="heading-container">
          <h4>
            IGP No. : <br />
            {igpData ? formData.processId : formData.gatePassNo}
          </h4>
          <h2 className="a4-heading">
            Sports Authority Of India - Inward Gate Pass
          </h2>
          <h4>
            IGP Date. : <br /> {formData.gatePassDate}
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
                  ? "Consignor Details"
                  : "Consignee Details"}
              </h3>

              <FormInputItem
                label="Regional Center Code"
                value={
                  formData.type === "IRP" || formData.type === "IOP"
                    ? formData.crRegionalCenterCd
                    : formData.ceRegionalCenterCd
                }
                readOnly={true}
              />
              <FormInputItem
                label="Regional Center Name"
                value={
                  formData.type === "IRP" || formData.type === "IOP"
                    ? formData.crRegionalCenterName
                    : formData.ceRegionalCenterName
                }
                readOnly={true}
              />
              <FormInputItem
                label="Address"
                value={
                  formData.type === "IRP" || formData.type === "IOP"
                    ? formData.crAddress
                    : formData.ceAddress
                }
                readOnly={true}
              />
              <FormInputItem
                label="Zipcode"
                value={
                  formData.type === "IRP" || formData.type === "IOP"
                    ? formData.crZipcode
                    : formData.ceZipcode
                }
                readOnly={true}
              />
            </div>

            <div className="consignor-container">
              <h3 className="consignor-consignee-heading">
                {formData.type === "IRP" || formData.type === "IOP"
                  ? "Consignee Details"
                  : "Consignor Details"}
              </h3>

              {formData.type === "PO" && (
                <>
                  <FormInputItem
                    label="Supplier Code"
                    name="supplierCode"
                    value={formData.supplierCode}
                    onChange={handleChange}
                  />
                  <FormInputItem
                    label="Supplier Name"
                    value={formData.supplierName}
                    readOnly={true}
                  />
                  <FormInputItem
                    label="Address"
                    value={formData.crAddress}
                    readOnly={true}
                  />
                </>
              )}

              {formData.type === "IRP" && (
                <>
                  <FormInputItem
                    label="Consumer Name"
                    name="consumerName"
                    value={formData.consumerName}
                    readOnly={true}
                  />
                  <FormInputItem
                    label="Contact No."
                    name="contactNo"
                    value={formData.contactNo}
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
                    name="ceAddress"
                    value={formData.ceAddress}
                    readOnly={true}
                  />
                  <FormInputItem
                    label="Pincode"
                    name="ceZipcode"
                    value={formData.ceZipcode}
                    readOnly={true}
                  />
                </>
              )}
            </div>

            <div className="other-container">
              <h3 className="consignor-consignee-heading">Other Details</h3>

              <Form.Item label="Type" name="processTypeDesc">
                <Select
                  onChange={(value) => handleChange("processType", value)}
                  value={formData.type}
                >
                  <Option value="IRP">Issue/Return</Option>
                  <Option value="PO">Purchase Order</Option>
                  <Option value="IOP">Inter-Org Transaction</Option>
                </Select>
              </Form.Item>

              {formData.type === "IRP" && (
                <FormInputItem
                  label="Outward Gate Pass No."
                  name="outwardGatePass"
                  value={formData.outwardGatePass}
                  onChange={handleInwardGatePassChange}
                />
              )}

              {formData.type === "IOP" && (
                <>
                  <Form.Item label="Select Note Type" name="noteType">
                    <Select onChange={handleSelectChange}>
                      <Option value="Issue Note No.">Issue Note No.</Option>
                      <Option value="Rejection Note No.">
                        Rejection Note No.
                      </Option>
                    </Select>
                  </Form.Item>

                  <FormInputItem
                    label={formData.noteType}
                    name="inwardGatePass"
                    onChange={
                      formData.noteType === "Issue Note No."
                        ? handleIssueNoteNoChange
                        : handleInwardGatePassChange
                    }
                    value={formData.inwardGatePass}
                  />
                </>
              )}

              {formData.type === "PO" && (
                <>
                  <FormInputItem
                    label="Challan / Invoice No."
                    name="challanNo"
                    value={formData.challanNo}
                    onChange={handleChange}
                  />
                  <div className="other-details-2cols">
                    <FormInputItem
                      label="Noa No."
                      name="noaNo"
                      value={formData.noaNo}
                      onChange={handleChange}
                    />
                    <FormDatePickerItem
                      label="Noa Date"
                      name="noaDate"
                      value={formData.noaDate}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="other-details-2cols">
                    <FormInputItem
                      label="Delivery Mode"
                      name="modeOfDelivery"
                      value={formData.modeOfDelivery}
                      onChange={handleChange}
                    />
                    <FormDatePickerItem
                      label="Date of Delivery"
                      name="dateOfDelivery"
                      value={formData.dateOfDelivery}
                      onChange={handleChange}
                    />
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="item-details-container">
            <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
              <h3>Item Details</h3>
              {formData.type === "PO" && (
                <ItemSearch itemArray={data} updateFormData={updateFormData} />
              )}
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

                      {formData.type !== "IOP" && (
                        <FormInputItem
                          label="Locator Description"
                          value={
                            item.locatorDesc || locatorMaster[item.locatorId]
                          }
                          readOnly={true}
                        />
                      )}

                      <FormInputItem
                        name="quantity"
                        label="Quantity"
                        value={item.quantity}
                        onChange={(fieldName, value) =>
                          itemHandleChange(fieldName, value, key)
                        }
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
                      />
                    </div>
                    <Button
                      icon={<DeleteOutlined />}
                      className="delete-button"
                      onClick={() => removeItem(key, setFormData)}
                      disabled={igpData !== null}
                    />
                  </div>
                );
              })}
          </div>
          <div className="terms-condition-container">
            <div>
              <h3>Terms And Conditions</h3>
              <TextArea
                autoSize={{ minRows: 4, maxRows: 8 }}
                value={formData.termsCondition}
                onChange={(e) => handleChange("termsCondition", e.target.value)}
                readOnly={igpData !== null}
              />
            </div>
            <div>
              <h3>Note</h3>
              <TextArea
                autoSize={{ minRows: 4, maxRows: 8 }}
                value={formData.note}
                onChange={(e) => handleChange("note", e.target.value)}
                readOnly={igpData !== null}
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
                readOnly={igpData !== null}
              />
              {igpData !== null ? (
                <FormInputItem
                  value={formData.genDate}
                  readOnly={igpData !== null}
                />
              ) : (
                <FormDatePickerItem
                  defaultValue={dayjs()}
                  name="genDate"
                  onChange={handleChange}
                  value={formData.genDate}
                  readOnly={igpData !== null}
                />
              )}
            </div>

            {formData.type !== "PO" && (
              <div className="each-desg">
                <h4>
                  {formData.type === "PO" ? "Received By" : "Verified By"}{" "}
                </h4>
                <FormInputItem
                  placeholder="Name and Signature"
                  name="issueName"
                  value={formData.issueName}
                  onChange={handleChange}
                  readOnly={igpData !== null}
                />

                {igpData !== null ? (
                  <FormInputItem
                    value={formData.issueDate}
                    readOnly={igpData !== null}
                  />
                ) : (
                  <FormDatePickerItem
                    defaultValue={dayjs()}
                    name="issueDate"
                    onChange={handleChange}
                    value={formData.issueDate}
                    // readOnly={ogpData !== null}
                  />
                )}
              </div>
            )}
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
                disabled={igpData ? true : !submitBtnEnabled}
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
                // disabled={ogpData !== null}
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
                disabled={igpData ? false : !printBtnEnabled}
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
  //   <div className="goods-receive-note-form-container" ref={formRef}>
  //     <h1>Sports Authority of India - Inward Gate Pass</h1>

  //     <Form
  //       onFinish={onFinish}
  //       className="goods-receive-note-form"
  //       onValuesChange={handleValuesChange}
  //       layout="vertical"
  //       initialValues={{fieldName: formData}}
  //     >
  //       <Row>
  //         <Col span={6} offset={18}>
  //           <Form.Item label="DATE" name="gatePassDate">
  //             <DatePicker
  //               defaultValue={dayjs()}
  //               format={dateFormat}
  //               style={{ width: "100%" }}
  //               name="gatePassDate"
  //               onChange={(date, dateString) =>
  //                 handleChange("gatePassDate", dateString)
  //               }
  //             />
  //           </Form.Item>
  //         </Col>
  //         <Col span={6}>
  //           <Form.Item label="TYPE" name="type">
  //             <Select onChange={(value) => handleChange("processType", value)}>
  //               <Option value="IRP">1. Issue/Return</Option>
  //               <Option value="PO">2. Purchase Order</Option>
  //               <Option value="IOP">3. Inter-Org Transaction</Option>
  //             </Select>
  //           </Form.Item>
  //         </Col>
  //         <Col span={6} offset={12}>
  //           {/* <Form.Item label="INWARD GATE PASS NO." name="gatePassDate">
  //             <Input
  //               disabled
  //               onChange={(e) => handleChange("gatePassNo", e.target.value)}
  //             />
  //           </Form.Item> */}

  //           <FormInputItem label="INWARD GATE PASS NO." value={formData.gatePassNo ? formData.gatePassNo : ""} readOnly={true}/>
  //         </Col>
  //       </Row>

  //       <Row gutter={24}>
  //         <Col span={8}>
  //           <Title strong level={2} underline type="danger">
  //             {
  //               Type === "IRP" || Type === "IOP" ?
  //               "CONSIGNOR DETAIL :-" : "CONSIGNEE DETAIL :-"
  //             }
  //           </Title>

  //           {/* for purchase order */}

  //           <FormInputItem label="REGIONAL CENTER CODE :" value={Type==="IRP" || Type === "IOP" ? formData.crRegionalCenterCd : formData.ceRegionalCenterCd} readOnly={true}/>
  //           <FormInputItem label="REGIONAL CENTER NAME :" value={Type==="IRP" || Type === "IOP" ? formData.crRegionalCenterName :formData.ceRegionalCenterName} readOnly={true} />
  //           <FormInputItem label="ADDRESS :" value={Type==="IRP" || Type === "IOP" ? formData.crAddress : formData.ceAddress} readOnly={true} />
  //           <FormInputItem label="ZIPCODE :" value={Type==="IRP" || Type === "IOP" ? formData.crZipcode : formData.ceZipcode} readOnly={true} />
  //         </Col>
  //         <Col span={8}>
  //           <Title strong underline level={2} type="danger">
  //           {
  //               Type === "IRP" || Type === "IOP" ?
  //               "CONSIGNEE DETAIL ;-" : "CONSIGNOR DETAIL :-"
  //             }
  //           </Title>

  //           {Type === "PO" && (
  //             <>
  //               <FormInputItem label="SUPPLIER CODE :" name="supplierCode" onChange={handleChange} />
  //               <FormInputItem label="SUPPLIER NAME :" value={formData.supplierName} />
  //               <FormInputItem label="ADDRESS :" value={formData.crAddress} readOnly={true} />
  //             </>
  //           )}

  //           {Type === "IRP" && (
  //             <>
  //               <Form.Item
  //                 label="CONSUMER NAME :"
  //                 name="consumerName"
  //                 initialValue={formData.consumerName}
  //               >
  //                 <Input
  //                   value={formData.consumerName}
  //                   onChange={(e) =>
  //                     handleChange("consumerName", e.target.value)
  //                   }
  //                 />
  //                 <div style={{ display: "none" }}>{formData.crZipcode}</div>
  //               </Form.Item>
  //               <Form.Item
  //                 label="CONTACT NO. :"
  //                 name="contactNo"
  //                 initialValue={formData.contactNo}
  //               >
  //                 <Input
  //                   value={formData.contactNo}
  //                   onChange={(e) => handleChange("contactNo", e.target.value)}
  //                 />
  //                 <div style={{ display: "none" }}>{formData.crZipcode}</div>
  //               </Form.Item>
  //             </>
  //           )}

  //           {Type === "IOP" && (
  //             <>
  //               {/* <Form.Item
  //                 label="REGIONAL CENTER CODE"
  //                 name="ceRegionalCenterCd"
  //               >
  //                 <Input
  //                   onChange={(e) =>
  //                     handleChange("crRegionalCenterCd", e.target.value)
  //                   }
  //                 />
  //               </Form.Item> */}

  //               <FormInputItem label="REGIONAL CENTER CODE :" value={formData.ceRegionalCenterCd} readOnly={true}/>
  //               <FormInputItem label="REGIONAL CENTER NAME :" value={formData.ceRegionalCenterName} readOnly={true} />
  //               <FormInputItem label="ADDRESS :" value={formData.ceAddress} readOnly={true} />
  //               <FormInputItem label="ZIPCODE :" value={formData.ceZipcode} readOnly={true} />
  //               {/* <Form.Item label="ZIP CODE :" name="crZipcode">
  //                 <Input value={1234}
  //                   onChange={(e) => handleChange("crZipcode", e.target.value)}
  //                 />
  //               </Form.Item> */}
  //             </>
  //           )}
  //         </Col>

  //         <Col span={8}>
  //           <Form.Item></Form.Item>
  //           {Type === "IRP" && (
  //             // <Form.Item label="OUTWARD GATE PASS." name="outwardgatepass">
  //             //   <Input
  //             //     onChange={(e) => handleInwardGatePassChange(_, e.target.value)}
  //             //   />
  //             // </Form.Item>
  //             <FormInputItem name="outwardgatepass" label="OUTWARD GATE PASS." onChange={handleInwardGatePassChange} />
  //           )}
  //           {/*Type === 'PO' && (
  //             <Form.Item label="PURCHASE ORDER NO." name="purchaseorderno">
  //               <Input />
  //             </Form.Item>
  //           )*/}
  //           {Type === "IOP" && (
  //             <>
  //               <Form.Item label="SELECT NOTE TYPE" name="noteType">
  //                 <Select onChange={handleSelectChange}>
  //                   <Option value="ISSUE">ISSUE NOTE NO.</Option>
  //                   <Option value="REJECTION">REJECTION NOTE NO.</Option>
  //                 </Select>
  //               </Form.Item>

  //               {/* <Form.Item
  //                 label={
  //                   selectedOption === "ISSUE"
  //                     ? "ISSUE NOTE NO."
  //                     : "REJECTION NOTE NO."
  //                 }
  //                 name="inwardGatePass"
  //               >
  //                 <Input value={1234} />
  //               </Form.Item> */}

  //               <FormInputItem label={selectedOption === "ISSUE" ? "ISSUE NOTE NO." : "REJECTION NOTE NO."} name="inwardGatePass" onChange={selectedOption==="ISSUE" ? handleIssueNoteNoChange : handleInwardGatePassChange} />
  //             </>
  //           )}
  //           {(Type === "PO") && (
  //             <>
  //               <Form.Item label="NOA NO." name="noaNo">
  //                 <Input
  //                   onChange={(e) => handleChange("noaNo", e.target.value)}
  //                 />
  //               </Form.Item>
  //               <Form.Item label="NOA DATE" name="noaDate">
  //                 <DatePicker
  //                   format={dateFormat}
  //                   style={{ width: "100%" }}
  //                   onChange={(date, dateString) =>
  //                     handleChange("noaDate", dateString)
  //                   }
  //                 />
  //               </Form.Item>
  //               <Form.Item label="DATE OF DELIVERY" name="dateOfDelivery">
  //                 <DatePicker
  //                   format={dateFormat}
  //                   style={{ width: "100%" }}
  //                   onChange={(date, dateString) =>
  //                     handleChange("dateOfDelivery", dateString)
  //                   }
  //                 />
  //               </Form.Item>
  //             </>
  //           )}
  //         </Col>
  //       </Row>
  //       {(Type === "PO") && (
  //         <Row gutter={24}>
  //           <Col span={8}>
  //             <Form.Item label=" CHALLAN / INVOICE NO. :" name="challanNo">
  //               <Input
  //                 onChange={(e) => handleChange("challanNo", e.target.value)}
  //               />
  //             </Form.Item>
  //           </Col>
  //           <Col span={8}>
  //             <Form.Item label="MODE OF DELIVERY  :" name="modeOfDelivery">
  //               <Input
  //                 onChange={(e) =>
  //                   handleChange("modeOfDelivery", e.target.value)
  //                 }
  //               />
  //             </Form.Item>
  //           </Col>
  //         </Row>
  //       )}

  //       {/* Item Details */}
  //       <h2>ITEM DETAILS</h2>

  //       {
  //         Type === "PO" &&
  //         <div style={{ width: "300px" }}>
  //         <Popover
  //           onClick={() => setTableOpen(true)}
  //           content={
  //             <Table pagination={{pageSize: 3}} dataSource={filteredData} columns={tableColumns} scroll={{ x: "max-content" }} style={{width: "600px", display: tableOpen? "block": "none"}}/>
  //           }
  //           title="Filtered Item Data"
  //           trigger="click"
  //           // open={true}
  //           open={searchValue !== "" && filteredData.length > 0}
  //           style={{ width: "200px" }}
  //           placement="right"
  //         >
  //           <Input.Search
  //             placeholder="Search Item Data"
  //             allowClear
  //             enterButton="Search"
  //             size="large"
  //             onSearch={(e)=>handleSearch(e.target?.value || "", data, setFilteredData, setSearchValue )}
  //             onChange={(e)=>handleSearch(e.target?.value || "", data, setFilteredData, setSearchValue )}
  //           />
  //         </Popover>
  //       </div>
  //       }

  //       <Form.List name="items" initialValue={formData.items || [{}]}>
  //         {(fields, { add, remove }) => (
  //           <>
  //             {formData.items?.length > 0 &&
  //               formData.items.map((item, key) => {
  //                 return (
  //                   // <div className="xyz" style={{font:"150px", zIndex: "100"}}>xyz</div>

  //                   <div
  //                     key={key}
  //                     style={{
  //                       marginBottom: 16,
  //                       border: "1px solid #d9d9d9",
  //                       padding: 16,
  //                       borderRadius: 4,
  //                       display: "grid",
  //                       gridTemplateColumns:
  //                         "repeat(auto-fit, minmax(200px, 1fr))",
  //                       gap: "20px",
  //                     }}
  //                   >
  //                     <Form.Item label="Serial No.">
  //                       <Input value={item.srNo ? item.srNo : item.sNo} readOnly />
  //                     </Form.Item>

  //                     <Form.Item label="ITEM CODE">
  //                       <Input value={item.itemCode} readOnly />
  //                     </Form.Item>

  //                     <Form.Item label="ITEM DESCRIPTION">
  //                       <Input value={item.itemDesc} readOnly />
  //                     </Form.Item>

  //                     <Form.Item label="UOM">
  //                       <Input
  //                         value={item.uomDesc || uomMaster[item.uom]}
  //                       />
  //                     </Form.Item>

  //                     {
  //                       Type !== "IOP" &&
  //                     <Form.Item label="LOCATOR DESCRIPITON">
  //                       <Input
  //                         value={item.locatorDesc || locatorMaster[item.locatorId]}
  //                         readOnly
  //                         />
  //                     </Form.Item>
  //                       }

  //                     <Form.Item label="QUANTITY">
  //                       <Input
  //                         value={item.quantity}
  //                         onChange={(e) =>
  //                           itemHandleChange("quantity", e.target.value, key)
  //                         }
  //                       />
  //                     </Form.Item>

  //                   {
  //                     (Type === "IRP" || Type === "IOP") &&
  //                     <Form.Item label="REQUIRED FOR NO. OF DAYS">
  //                       <Input
  //                         value={item.noOfDays}
  //                         onChange={(e) =>
  //                           itemHandleChange("noOfDays", e.target.value, key)
  //                         }
  //                         />
  //                     </Form.Item>
  //                     }

  //                     <Form.Item label="REMARK">
  //                       <Input
  //                         value={item.remarks}
  //                         onChange={(e) =>
  //                           itemHandleChange("remarks", e.target.value, key)
  //                         }
  //                       />
  //                     </Form.Item>

  //                     <Col span={1}>
  //                       <MinusCircleOutlined
  //                         onClick={() => removeItem(key)}
  //                         style={{ marginTop: 8 }}
  //                       />
  //                     </Col>
  //                   </div>
  //                 );
  //               })}
  //           </>
  //         )}
  //       </Form.List>

  //       {/* Condition of Goods */}

  //       <Row gutter={24}>
  //         <Col span={12}>
  //           <Form.Item label="TERMS AND CONDITION :" name="termsCondition">
  //             <Input.TextArea
  //               value={formData.termsCondition}
  //               autoSize={{ minRows: 3, maxRows: 6 }}
  //               readOnly = {Type === "PO" ? false : true}
  //               onChange={(e) => handleChange("termsCondition", e.target.value)}
  //             />
  //             <Input style={{ display: "none" }} />
  //           </Form.Item>
  //         </Col>
  //         <Col span={12}>
  //           <Form.Item label="NOTE" name="note">
  //             <Input.TextArea
  //               value={formData.note}
  //               autoSize={{ minRows: 3, maxRows: 6 }}
  //               onChange={(e) => handleChange("note", e.target.value)}
  //             />
  //             <Input style={{ display: "none" }} />
  //           </Form.Item>
  //         </Col>
  //       </Row>

  //       {/* Note and Signature */}

  //       <div
  //         style={{
  //           display: "flex",
  //           width: "100%",
  //           justifyContent: "space-between",
  //         }}
  //       >
  //         <div>
  //           <div className="goods-receive-note-signature">GENERATED BY</div>
  //           <div className="goods-receive-note-signature">
  //             NAME & DESIGNATION :
  //             <Form>
  //               <Input
  //                 value={formData.genName}
  //                 name="genName"
  //                 onChange={(e) => handleChange("genName", e.target.value)}
  //               />
  //             </Form>
  //           </div>
  //           <div className="goods-receive-note-signature">
  //             DATE & TIME :
  //             <DatePicker
  //               defaultValue={dayjs()}
  //               format={dateFormat}
  //               style={{ width: "58%" }}
  //               name="genDate"
  //               onChange={(date, dateString) =>
  //                 handleChange("genDate", dateString)
  //               }
  //             />
  //           </div>
  //         </div>
  //         {Type !== "PO" && (
  //           <div>
  //             <div className="goods-receive-note-signature">RECEIVED BY</div>
  //             <div className="goods-receive-note-signature">
  //               NAME & SIGNATURE :
  //               <Form>
  //                 <Input
  //                   name="issueName"
  //                   onChange={(e) => handleChange("issueName", e.target.value)}
  //                 />
  //               </Form>
  //             </div>
  //             <div className="goods-receive-note-signature">
  //               DATE & TIME :
  //               <DatePicker
  //                 defaultValue={dayjs()}
  //                 format={dateFormat}
  //                 style={{ width: "58%" }}
  //                 name="issueDate"
  //                 onChange={(date, dateString) =>
  //                   handleChange("issueDate", dateString)
  //                 }
  //               />
  //             </div>
  //           </div>
  //         )}
  //       </div>

  //       {/* Submit Button */}
  //       <div className="goods-receive-note-button-container">
  //         <Form.Item>
  //           <Button
  //             type="primary"
  //             htmlType="save"
  //             style={{ width: "200px", margin: 16 }}
  //           >
  //             SAVE
  //           </Button>
  //         </Form.Item>

  //         <Form.Item>
  //           <Button
  //             type="primary"
  //             htmlType="submit"
  //             style={{
  //               backgroundColor: "#4CAF50",
  //               borderColor: "#4CAF50",
  //               width: "200px",
  //               margin: 16,
  //             }}
  //           >
  //             SUBMIT
  //           </Button>
  //         </Form.Item>
  //         <Form.Item>
  //         <Button disabled={!buttonVisible} onClick={()=> printOrSaveAsPDF(formRef)} type="primary" danger style={{ width: '200px', margin: 16, alignContent: 'end' }}>
  //             PRINT
  //           </Button>
  //         </Form.Item>
  //       </div>
  //       <Modal
  //         title="Inward gate pass saved successfully"
  //         visible={isModalOpen}
  //         onOk={handleOk}
  //       >
  //         {successMessage && <p>{successMessage}</p>}
  //         {errorMessage && <p>{errorMessage}</p>}
  //       </Modal>
  //     </Form>
  //   </div>
  // );
};

export default InwardGatePass;
