// DemandNoteForm.js
import React, { useState, useEffect, useRef, useCallback } from "react";
import dayjs from "dayjs";
import { Form, Input, Button } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import FormInputItem from "../../../components/FormInputItem";
import FormDatePickerItem from "../../../components/FormDatePickerItem";
import { useSelector } from "react-redux";
import { useReactToPrint } from "react-to-print";
const { TextArea } = Input;

const DemandNoteForm = () => {
  const [form] = Form.useForm();
  const formRef = useRef();
  const [counter, setCounter] = useState(1);

  
  const handlePrint = useReactToPrint({
    content: () => formRef.current,
  });
  const { userDetails, locationDetails, organizationDetails } = useSelector(
    (state) => state.auth
  );
  const [formData, setFormData] = useState({
    regionalCenterCode: "",
    regionalCenterName: "",
    consignorAddress: "",
    consignorZipCode: "",
  });
  console.log(":FORMDATA: ", formData)

  const fetchData = useCallback(async () => {
    setFormData({
      regionalCenterCode: organizationDetails.id,
      regionalCenterName: organizationDetails.organizationName,
      consignorAddress: organizationDetails.locationAddr,
      consignorZipCode: locationDetails.zipcode,
      firstName: userDetails.firstName,
    });
  }, [
    organizationDetails.id,
    organizationDetails.organizationName,
    organizationDetails.locationAddr,
    locationDetails.zipcode,
    userDetails.firstName,
  ]);

  const handleChange = (fieldName, value) => {
    setFormData((prevValues) => ({
      ...prevValues,
      [fieldName]: value === "" ? null : value,
    }));
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);
  useEffect(() => {
    form.setFieldsValue(formData);
  }, [form, formData])

  return (
    <div className="a4-container" ref={formRef}>
      <h2 className="a4-heading">Sports Authority Of India - Demand Note</h2>

      <Form
      form={form}
        layout="vertical"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          margin: "1rem 0",
        }}
      >
        <div className="consignor-consignee-container grid-2">
          <FormInputItem
            label="Regional Center Code"
            // value={formData.regionalCenterCode}
            name="regionalCenterCode"
          />
          <FormInputItem label="Demand Note No." />
          <FormInputItem
            label="Regional Center Name"
            name="regionalCenterName"
          />
          <FormDatePickerItem
            name="demandNoteDt"
            label="Demand Note Date"
            defaultValue={dayjs()}
            onChange={handleChange}
            value={formData.demandNoteDt}
          />
          <FormInputItem label="Address" name="consignorAddress" />
          <FormInputItem label="Consumer Name" />
          <FormInputItem label="Zipcode" name="consignorZipCode" />
          <FormInputItem label="Contact No." />
        </div>

        <div className="item-details-container">
          <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
            <h3>Item Details</h3>
            <Button
              type="dashed"
              icon={<PlusOutlined />}
              onClick={() => setCounter((prev) => prev + 1)}
            >
              Add Item
            </Button>
          </div>
          {Array.from({ length: counter }).map((_, index) => {
            return (
              <div key={index} className="each-item-detail-container">
                <div className="each-item-detail-container-grid">
                  {/* <FormInputItem label="S. No." value={index + 1} /> */}
                  <Form.Item label="S.No">
                  <Input value={index + 1} />
                    </Form.Item>
                  <FormInputItem label="Item Code" />
                  <FormInputItem
                    label="Item Description"
                    className="item-desc-cell"
                  />
                  <FormInputItem label="Unit of Measurement" />
                  <FormInputItem label="Required Quantity" />
                  <FormInputItem label="Req. For No. of Days" />
                  <FormInputItem label="Remark" />
                  <Button
                    icon={<DeleteOutlined />}
                    className="delete-button"
                    onClick={() => setCounter((prev) => prev - 1)}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="terms-condition-container">
          <div>
            <h3>Terms And Conditions</h3>
            <TextArea rows={4} />
          </div>
        </div>

        <div className="designations-container">
          <div className="each-desg">
            <h4> Demanded By </h4>
            <FormInputItem placeholder="Name and Signature" />
            <FormDatePickerItem
              defaultValue={dayjs()}
              value={formData.demandDt}
              name="demandDt"
              onChange={handleChange}
            />
          </div>
          <div className="each-desg">
            <h4> Approved By </h4>
            <FormInputItem placeholder="Name and Signature" />
            <FormDatePickerItem
              defaultValue={dayjs()}
              value={formData.approvalDt}
              name="approvalDt"
              onChange={handleChange}
            />
          </div>
          <div className="each-desg">
            <h4> Received By </h4>
            <FormInputItem placeholder="Name and Signature" />
            <FormDatePickerItem
              defaultValue={dayjs()}
              value={formData.receiveDt}
              name="receiveDt"
              onChange={handleChange}
            />
          </div>
        </div>
      </Form>

      <div className="button-container">
        <Button
          onClick={() => handlePrint(formRef)}
          type="primary"
          danger
          style={{ width: "200px", alignContent: "end" }}
        >
          PRINT
        </Button>
      </div>
    </div>
  );
};

export default DemandNoteForm;
