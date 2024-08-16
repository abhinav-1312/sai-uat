import React, { useRef } from "react";
import RegionalCenterDetails from "./RegionalCenterDetails";
import ConsumerDetails from "./ConsumerDetails";
import SupplerDetails from "./SupplerDetails";
import { apiCall } from "../utils/Functions";
import { useSelector } from "react-redux";
import FormInputItem from "./FormInputItem";
import FormSearchItem from "./FormSearchItem";
import FormHeading from "./FormHeading";
import { formDate, formNo, processType } from "../utils/KeyValueMapping";
import FormDatePickerItem from "./FormDatePickerItem";
// InwardGatePass.js
// import React, { useState, useEffect, useRef, useMemo } from "react";
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
// import {
//   apiHeader,
//   mergeItemMasterAndOhq,
//   removeItem,
// } from "../../../utils/Functions";
// import FormInputItem from "../../../components/FormInputItem";
// import { useDispatch, useSelector } from "react-redux";
// import useHandlePrint from "../../../components/useHandlePrint";
// import { useLocation, useNavigate } from "react-router-dom";
// import FormDatePickerItem from "../../../components/FormDatePickerItem";
// import ItemSearch from "../issuenote/ItemSearch";
// import { fetchOhq } from "../../../redux/slice/ohqSlice";
// import FormBody from "../../../components/FormBody";
// import FormHeading from "../../../components/FormHeading";
const dateFormat = "DD/MM/YYYY";
const { Option } = Select;


const { TextArea, Search } = Input;

const FormBody = ({ formData, txnType, setFormData, formTitle }) => {
  const formRef = useRef();
  const [form] = Form.useForm();
  const { token, userCd } = useSelector((state) => state.auth);

  // WHEN SELECTING FROM ISP, PO AND IOP
  const handleSelectChange = (value) => {
    setFormData((prev) => {
      return {
        ...prev,
        noteType: value,
      };
    });
  };

  const handleChange = (fieldName, value) => {
    // IF FIELD IS PROCESS TYPE, THEN processType and type FIELD BOTH CHANGE
    if(fieldName === 'processType'){
      setFormData((prevValues) => ({
        ...prevValues,
        type: value === "" ? null : value,
        processType: value === "" ? null : value
      }));
      return
    }

    setFormData((prevValues) => ({
      ...prevValues,
      [fieldName]: value === "" ? null : value,
    }));
  };

  const handleCeRccChange = async (_, value) => {
    setFormData((prev) => {
      return {
        ...prev,
        ceRegionalCenterCd: value,
      };
    });
    const url = "/master/getOrgMasterById";
    const { responseStatus, responseData } = await apiCall("POST", url, token, {
      id: value,
      userId: userCd,
    });

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

  const handleIssueNoteNoChange = async (value) => {
    try {
      const apiUrl = "/getSubProcessDtls";
      // const response = await axios.post(apiUrl, {
      //   processId: value,
      //   processStage: "IGP",
      // }, apiHeader("POST", token));
      const { responseData } = await apiCall("POST", apiUrl, token, {
        processId: value,
        processStage: "IGP",
      });
      const { processData, itemList } = responseData;

      if (processData !== null) {
        setFormData((prevFormData) => ({
          ...prevFormData,

          regionalCenterCd: processData?.crRegionalCenterCd,
          regionalCenterName: processData?.crRegionalCenterName,
          address: processData?.crAddress,
          zipcode: processData?.crZipcode,

          processId: processData?.processId,
          issueNoteDt: processData?.issueNoteDt || processData?.issueDate,
          consumerName: processData?.consumerName,
          contactNo: processData?.contactNo,

          termsCondition: processData?.termsCondition,
          note: processData?.note,

          items: itemList.map((item) => ({
            srNo: item?.sNo,
            id: item?.id || "Null",
            itemId: item?.itemId,
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
      } else {
        // const response = await axios.post(apiUrl, {
        //   processId: value,
        //   processStage: "ISN",
        // }, apiHeader("POST", token));
        const { responseData } = await apiCall("POST", apiUrl, token, {
          processId: value,
          processStage: "ISN",
        });
        const { processData, itemList } = responseData;

        setFormData((prevFormData) => ({
          ...prevFormData,

          regionalCenterCd: processData?.crRegionalCenterCd,
          regionalCenterName: processData?.crRegionalCenterName,
          address: processData?.crAddress,
          zipcode: processData?.crZipcode,

          processId: processData?.processId,
          issueNoteDt: processData?.issueNoteDt || processData?.issueDate,
          consumerName: processData?.consumerName,
          contactNo: processData?.contactNo,

          termsCondition: processData?.termsCondition,
          note: processData?.note,

          items: itemList.map((item) => ({
            srNo: item?.sNo,
            id: item?.id || "Null",
            itemId: item?.itemId,
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
      }
      // Handle response data as needed
    } catch (error) {
      console.error("Error fetching sub process details:", error);
    }
  };

  const searchFormData = (value) => {

  }

  console.log("FOrmdata: ", formData)

  return (
    <>
      <div className="a4-container" ref={formRef}>
        <FormHeading
          formTitle={formTitle}
          txnType={txnType}
          date={formData[formDate[txnType]]}
          txnNo={formData[formNo[txnType]]}
        />
      <Form
        form={form}
        layout="vertical"
        className="form-body"
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

            <RegionalCenterDetails
              regionalCenterCd={
                txnType === "RN" ? formData.regionalCenterCd : (formData.type === "PO" ? formData.ceRegionalCenterCd : formData.crRegionalCenterCd)}
              regionalCenterName={
                txnType === "RN"
                  ? formData.regionalCenterName
                  : formData.type === "PO"
                  ? formData.ceRegionalCenterName
                  : formData.crRegionalCenterName
              }
              address={
                txnType === "RN"
                  ? formData.address
                  : formData.type === "PO"
                  ? formData.ceAddress
                  : formData.crAddress
              }
              zipcode={
                txnType === "RN"
                  ? formData.zipcode
                  : formData.type === "PO"
                  ? formData.ceZipcode
                  : formData.crZipcode
              }
            />
          </div>

          <div className="consignor-container">
            <h3 className="consignor-consignee-heading">
              {formData.type === "IRP" || formData.type === "IOP"
                ? "Consignor Details"
                : "Consignee Details"}
            </h3>

            {formData.type === "IRP" && (
              <ConsumerDetails
                consumerName={formData.consumerName}
                contactNo={formData.contactNo}
              />
            )}
            {formData.type === "PO" && (
              <SupplerDetails
                supplierName={formData.supplierName}
                supplierCode={formData.supplierCode}
                handleChange={handleChange}
              />
            )}
            {formData.type === "IOP" && (
              <RegionalCenterDetails
                regionalCenterName={formData.ceRegionalCenterName}
                regionalCenterCd={formData.ceRegionalCenterCd}
                address={formData.ceAddress}
                zipcode={formData.ceZipcode}
                txnType={txnType}
                handleChange={handleCeRccChange}
              />
            )}
          </div>

          {/* <div className="other-container">
            <h3 className="consignor-consignee-heading">Other Details</h3>
            {txnType === "RN" && (
              <>
                <FormInputItem
                  label="Issue Note No."
                  name="issueNoteNo"
                  onChange={handleIssueNoteNoChange}
                />
                <FormSearchItem
                  label="Issue Note No."
                  name="issueNoteNo"
                  onChange={handleChange}
                  onSearch={handleProcessSearch}
                />
              </>
            )}
          </div> */}

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
                // <FormInputItem
                //   label="Outward Gate Pass No."
                //   name="outwardGatePass"
                //   value={formData.outwardGatePass}
                //   // onChange={handleInwardGatePassChange}
                // />

                <FormSearchItem label='Outward Gate Pass No.' name='outwardGatePass' value={formData.outwardGatePass} onSearch={searchFormData} onChange={handleChange} />
              )}

              {formData.type === "IOP" && (
                <>
                  <Form.Item label="Select Note Type" name="noteType">
                    <Select onChange={handleSelectChange}>
                    {/* <Select> */}
                      <Option value="Issue Note No.">Issue Note No.</Option>
                      <Option value="Rejection Note No.">
                        Rejection Note No.
                      </Option>
                    </Select>
                  </Form.Item>

                  <Search
                  name="inwardGatePass"
                  label={formData.noteType}
                  onSearch={handleIssueNoteNoChange}
                  enterButton
                  value={formData.inwardGatePass}
                  onChange={(e)=> handleChange(e.target.name, e.target.value)}
                  />

                  {/* <FormInputItem
                    label={formData.noteType}
                    name="inwardGatePass"
                    onChange={
                      formData.noteType === "Issue Note No."
                        ? handleIssueNoteNoChange
                        : handleInwardGatePassChange
                    }
                    value={formData.inwardGatePass}
                  /> */}
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
          {/* </div> */}


        </div>
      </Form>
      </div>
    </>
  );
};

export default FormBody;
