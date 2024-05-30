import React, { useRef } from "react";
import FormInputItem from "../../../components/FormInputItem";
import FormDatePickerItem from "../../../components/FormDatePickerItem";
import { Button, Form, Input } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { useReactToPrint } from "react-to-print";

const { TextArea } = Input;

const DemandNotePage = () => {
  const formRef = useRef();

  const handlePrint  = useReactToPrint({
    content: () => formRef.current,
  });
  return (
    <>
      <div className="a4-container" ref={formRef}>
        <h2 className="a4-heading">Sports Authority Of India - Demand Note</h2>

        <Form layout="vertical" style={{display: "flex", flexDirection: "column", gap: "1rem", margin: "1rem 0"}}>
          <div className="consignor-consignee-container grid-2">
            <FormInputItem label="Regional Center Code" />
            <FormInputItem label="Demand Note No." />
            <FormInputItem label="Regional Center Name" />
            <FormInputItem label="Demand Note Date" />
            <FormInputItem label="Address" />
            <FormInputItem label="Consumer Name" />
            <FormInputItem label="Zipcode" />
            <FormInputItem label="Contact No." />
          </div>

          <div className="item-details-container">
            <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
              <h3>Item Details</h3>
              <Button type="dashed" icon={<PlusOutlined />}>
                Add Item
              </Button>
            </div>

            <div className="each-item-detail-container">
              <div className="each-item-detail-container-grid">
                <FormInputItem label="S. No." />
                <FormInputItem label="Item Code" />
                <FormInputItem
                  label="Item Description"
                  className="item-desc-cell"
                />
                <FormInputItem label="Unit of Measurement" />
                <FormInputItem label="Required Quantity" />
                <FormInputItem label="Req. For No. of Days" />
                <FormInputItem label="Remark" />
                <Button icon={<DeleteOutlined />} className="delete-button" />
              </div>
            </div>
          </div>


            <div className="terms-condition-container">
              <h3>Terms And Conditions</h3>
              <TextArea rows={4} />
            </div>

          <div className="designations-container">
            <div className="each-desg">
              <h4> Demanded By </h4>
              <FormInputItem />
              <FormDatePickerItem />
            </div>
            <div className="each-desg">
              <h4> Approved By </h4>
              <FormInputItem />
              <FormDatePickerItem />
            </div>
            <div className="each-desg">
              <h4> Received By </h4>
              <FormInputItem />
              <FormDatePickerItem />
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
    </>
  );
};

export default DemandNotePage;
