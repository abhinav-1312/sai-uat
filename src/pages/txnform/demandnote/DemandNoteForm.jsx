// DemandNoteForm.js
import React, { useState, useEffect, useRef, useCallback } from "react";
import dayjs from "dayjs";
import { Form, Input, Button, Row, Col, DatePicker } from "antd";
import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";

import FormInputItem from "../../../components/FormInputItem";
import FormDatePickerItem from "../../../components/FormDatePickerItem";
import { printOrSaveAsPDF } from "../../../utils/Functions";
import { useSelector } from "react-redux";
const { TextArea } = Input;
const dateFormat = "DD/MM/YYYY";

const DemandNoteForm = () => {
  const formRef = useRef();
  const { userDetails, locationDetails } = useSelector((state) => state.auth);
  const organizationDetails = useSelector(
    (state) => state.auth.organizationDetails
  );
  const [formData, setFormData] = useState({
    regionalCenterCode: "",
    regionalCenterName: "",
    consignorAddress: "",
    consignorZipCode: "",
  });

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

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div
      className="goods-receive-note-form-container"
      id="formContainer"
      ref={formRef}
    >
      <h1>Sports Authority of India - Demand Note</h1>

      <Form
        className="goods-receive-note-form formInsideContainer"
        layout="vertical"
      >
        <Row>
          <Col span={6}>
            <FormInputItem
              label="REGIONAL CENTER CODE :"
              value={formData.regionalCenterCode}
            />
          </Col>
          <Col span={6} offset={12}>
            <FormDatePickerItem
              label="DEMAND NOTE DATE"
              defaultValue={dayjs()}
            />
          </Col>
        </Row>
        <Row>
          <Col span={6}>
            <FormInputItem
              label="REGIONAL CENTER NAME :"
              value={formData.regionalCenterName}
            />
          </Col>
          <Col span={6} offset={12}>
            <FormInputItem label="DEMAND NOTE NO. :" />
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <FormInputItem
              label="ADDRESS :"
              value={formData.consignorAddress}
            />
          </Col>
          <Col span={8} offset={4}>
            <FormInputItem label="CONSUMER NAME :" />
          </Col>
        </Row>
        <Row>
          <Col span={6}>
            <FormInputItem
              label="ZIPCODE :"
              value={formData.consignorZipCode}
            />
          </Col>
          <Col span={8} offset={10}>
            <FormInputItem label="CONTACT NO. :" />
          </Col>
        </Row>

        <h2>ITEM DETAILS</h2>

        <Form.List name="itemDetails" initialValue={[{}]}>
          {(fields, { add, remove }) => (
            <>
              <Form.Item style={{ textAlign: "right" }}>
                <Button
                  type="dashed"
                  onClick={() => add()}
                  style={{ marginBottom: 8 }}
                  icon={<PlusOutlined />}
                >
                  ADD ITEM
                </Button>
              </Form.Item>
              {fields.map(({ key, name }, index) => (
                <div
                  key={key}
                  style={{
                    marginBottom: 16,
                    border: "1px solid #d9d9d9",
                    padding: 16,
                    borderRadius: 4,
                  }}
                >
                  <Row gutter={24}>
                    <Col span={6}>
                      <FormInputItem label="S. No" value={index + 1} />
                    </Col>
                    <Col span={6}>
                      <FormInputItem label="ITEM CODE" />
                    </Col>
                    <Col span={6}>
                      <FormInputItem label="ITEM DESCRIPTION" />
                    </Col>
                    <Col span={5}>
                      <FormInputItem label="UOM" />
                    </Col>

                    <Col span={6}>
                      <FormInputItem label="REQUIRED QUANTITY" />
                    </Col>
                    <Col span={6}>
                      <FormInputItem label="REQUIRED FOR NO. OF DAYS" />
                    </Col>

                    <Col span={5}>
                      <FormInputItem label="REMARK" />
                    </Col>
                    <Col span={1}>
                      <MinusCircleOutlined
                        onClick={() => remove(name)}
                        style={{ marginTop: 8 }}
                      />
                    </Col>
                  </Row>
                </div>
              ))}
            </>
          )}
        </Form.List>

        {/* Terms and Condition */}
        <h2>Terms and Condition</h2>
        <Form.Item name="termsAndCondition">
          <TextArea rows={4} />
        </Form.Item>

        {/* Note and Signature */}

        <div
          style={{
            display: "flex",
            width: "100%",
            justifyContent: "space-between",
          }}
        >
          <div>
            <div className="goods-receive-note-signature">DEMANDED BY :</div>
            <div className="goods-receive-note-signature">
              NAME & SIGNATURE :
              <Form>
                <Input />
              </Form>
            </div>
            <div className="goods-receive-note-signature">
              DATE & TIME :
              <DatePicker defaultValue={dayjs()} format={dateFormat} />
            </div>
          </div>
          <div>
            <div className="goods-receive-note-signature">APPROVED BY :</div>
            <div className="goods-receive-note-signature">
              NAME & SIGNATURE :
              <Form>
                <Input />
              </Form>
            </div>
            <div className="goods-receive-note-signature">
              DATE & TIME :
              <DatePicker
                defaultValue={dayjs()}
                format={dateFormat}
                style={{ width: "58%" }}
              />
            </div>
          </div>
          <div>
            <div className="goods-receive-note-signature">RECEIVED BY :</div>
            <div className="goods-receive-note-signature">
              NAME & SIGNATURE :
              <Form>
                <Input />
              </Form>
            </div>
            <div className="goods-receive-note-signature">
              DATE & TIME :
              <DatePicker
                defaultValue={dayjs()}
                format={dateFormat}
                style={{ width: "58%" }}
              />
            </div>
          </div>
        </div>

        <div className="goods-receive-note-button-container">
          <Form.Item>
            <Button
              onClick={() => printOrSaveAsPDF(formRef)}
              type="primary"
              danger
              style={{ width: "200px", margin: 16, alignContent: "end" }}
            >
              PRINT
            </Button>
          </Form.Item>
        </div>
      </Form>
    </div>
  );
};

export default DemandNoteForm;
