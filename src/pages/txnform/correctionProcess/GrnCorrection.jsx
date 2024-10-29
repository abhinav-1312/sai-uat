import React, { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import {
  apiCall,
  itemHandleChange,
  mergeItemMasterAndOhq,
  removeItem,
} from "../../../utils/Functions";
import { fetchOhq } from "../../../redux/slice/ohqSlice";
import FormContainer from "../../../components/FormContainer";
import FormHeading from "../../../components/FormHeading";
import FormBody from "../../../components/FormBody";
import CrCeDtlContainer from "../../../components/CrCeDtlContainer";
import RegionalCenterDetails from "../../../components/RegionalCenterDetails";
import FormInputItem from "../../../components/FormInputItem";
import ItemDetailsContainer from "../../../components/ItemDetailsContainer";
import { Button, Form, message, Select } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import TermsConditionContainer from "../../../components/TermsConditionContainer";
import DesignationContainer from "../../../components/DesignationContainer";
import ButtonContainer from "../../../components/ButtonContainer";
import useHandlePrint from "../../../components/useHandlePrint";
const { Option } = Select;
const dateFormat = "DD/MM/YYYY";
const currentDate = dayjs();

const GrnCorrection = () => {
  const dispatch = useDispatch();
  const formRef = useRef();
  const handlePrint = useHandlePrint(formRef);
  const formBodyRef = useRef();
  const { organizationDetails, locationDetails, token, userCd } = useSelector(
    (state) => state.auth
  );
  const { data: itemData } = useSelector((state) => state.item);
  const { data: ohqData } = useSelector((state) => state.ohq);
  const { locatorObj } = useSelector((state) => state.locators);

  const data = useMemo(
    () => mergeItemMasterAndOhq(itemData, ohqData),
    [itemData, ohqData]
  );

  const [submitBtnEnabled, setSubmitBtnEnabled] = useState(true);
  const [printBtnEnabled, setPrintBtnEnabled] = useState(false);
  const [draftBtnEnabled, setDraftBtnEnabled] = useState(true);

  const [formData, setFormData] = useState({
    genDate: currentDate.format(dateFormat),
    genName: userCd,
    issueDate: currentDate.format(dateFormat),
    issueName: userCd,
    approvedDate: currentDate.format(dateFormat),
    approvedName: "",
    processId: "",
    type: "CRN",
    grnDate: currentDate.format(dateFormat),
    grnNo: "string",
    ceRegionalCenterCd: organizationDetails?.id,
    ceRegionalCenterName: organizationDetails?.location,
    ceAddress: organizationDetails?.locationAddr,
    ceZipcode: locationDetails?.zipcode,
    items: [],
    userId: userCd,
    note: "",
  });

  useEffect(() => {
    dispatch(fetchOhq());
  }, [dispatch]);

  const onFinish = async () => {
    setSubmitBtnEnabled(false);
    try {
      const data = await apiCall("POST", "/doCorrectionProcess", token, {
        issueNoteDtls: null,
        grnDtls: formData,
      });
      if (data?.responseData?.grnResponse?.processId) {
        message.success(
          `GRN Correction Successful with Process ID: ${data?.responseData?.grnResponse?.processId}`
        );
        setFormData((prev) => {
          return {
            ...prev,
            grnNo: data?.responseData?.grnResponse?.processId,
          };
        });
        setPrintBtnEnabled(true);
        setSubmitBtnEnabled(false)
        setDraftBtnEnabled(false)
        localStorage.removeItem("grnDraft")
      } else {
        message.error("GRN correction failed. Please try again.");
        setSubmitBtnEnabled(true);
      }
    } catch (error) {
      message.error("GRN correction failed. Please try again.");
      setSubmitBtnEnabled(true);
    }
  };

  useEffect(() => {
    if (formBodyRef.current) formBodyRef.current.updateField(formData);
  }, [formData]);

  const handleChange = (fieldName, value) => {
    setFormData((prev) => {
      return {
        ...prev,
        [fieldName]: value,
      };
    });
  };

  const handleLocatorChange = (index, locatorId) => {
    setFormData((prev) => {
      const prevItemList = prev.items;
      prevItemList[index].locatorId = locatorId;
      prevItemList[index].locatorDesc = locatorObj[locatorId];
      return {
        ...prev,
        items: prevItemList,
      };
    });
  };

  return (
    <FormContainer
      onFinish={onFinish}
      ref={formRef}
      submitBtnEnabled={submitBtnEnabled}
      printBtnEnabled={printBtnEnabled}
    >
      <FormHeading
        formTitle="Correction Process GRN"
        date={formData.grnDate}
        txnNo={formData.grnNo === "string" ? "" : formData.grnNo}
      />

      <div style={{ marginTop: "1rem" }}>
        <h3 style={{ color: "red" }}>
          <strong>Note:</strong>
          This is a 'Correction Process.' Using this form will increase the
          quantity of the item at the specified locator.
        </h3>
      </div>

      <FormBody formData={formData} ref={formBodyRef}>
        <CrCeDtlContainer>
          <RegionalCenterDetails
            heading="Consignee Details"
            cdName="ceRegionalCenterCd"
            rcName="ceRegionalCenterName"
            adrName="ceAddress"
            zipName="ceZipcode"
          />

          <div className="consignor-container">
            <h3 className="consignor-consignee-heading">Employee Detail</h3>
            <FormInputItem
              label="Employee Name"
              name="genName"
              onChange={handleChange}
            />
          </div>
        </CrCeDtlContainer>

        <ItemDetailsContainer
          itemSearch
          itemArray={data}
          setFormData={setFormData}
        >
          {formData?.items?.length > 0 &&
            formData?.items?.map((item, key) => (
              <div className="each-item-detail-container">
                <div className="each-item-detail-container-grid">
                  <FormInputItem
                    label="S. No."
                    readOnly={true}
                    name={["items", key, "srNo"]}
                  />
                  <FormInputItem
                    label="Item Code"
                    name={["items", key, "itemCode"]}
                    readOnly={true}
                  />
                  <FormInputItem
                    label="Item Description"
                    className="item-desc-cell"
                    name={["items", key, "itemDesc"]}
                  />
                  <FormInputItem
                    label="Unit of Measurement"
                    name={["items", key, "uomDesc"]}
                  />
                  <FormInputItem
                    label="Quantity"
                    name={["items", key, "quantity"]}
                    onChange={(fName, value) =>
                      itemHandleChange("quantity", value, key, setFormData)
                    }
                  />
                  {/* <FormInputItem label="Locator" name={['items', key, 'locatorDesc']} /> */}
                  <Form.Item
                    label="Locator"
                    name={["items", key, "locatorDesc"]}
                  >
                    <Select
                      onChange={(value) => handleLocatorChange(key, value)}
                    >
                      {Object.keys(locatorObj).map((key) => (
                        <Option key={key} value={key}>
                          {locatorObj[key]}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                  <FormInputItem
                    label="Remarks"
                    name={["items", key, "remarks"]}
                    onChange={(fName, value) =>
                      itemHandleChange("remarks", value, key, setFormData)
                    }
                  />
                </div>
                <Button
                  icon={<DeleteOutlined />}
                  className="delete-button"
                  onClick={() => removeItem(key, setFormData)}
                />
              </div>
            ))}
        </ItemDetailsContainer>
        <TermsConditionContainer noteVisible handleChange={handleChange} />
        <DesignationContainer
          genByVisible
          approvedVisible
          genDateValue={formData.genDate}
          approvedDateValue={formData.approvedDate}
          handleChange={handleChange}
        />
        <ButtonContainer
          handlePrint={handlePrint}
          onFinish={onFinish}
          printBtnEnabled={printBtnEnabled}
          submitBtnEnabled={submitBtnEnabled}
          draftBtnEnabled={draftBtnEnabled}
          draftDataName="crnGrnDraft"
        />
      </FormBody>
    </FormContainer>
  );
};

export default GrnCorrection;
