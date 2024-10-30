// GoodsReceiveNoteForm.js
import React, { useState, useEffect, useRef } from "react";
import { Button, Modal, message } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import "./GoodsReceiveNoteForm.css";
import dayjs from "dayjs";
import FormInputItem from "../../../components/FormInputItem";
import {
  apiCall,
  convertEpochToDateString,
  itemHandleChange,
  removeItem,
} from "../../../utils/Functions";
import { useSelector } from "react-redux";
import FormContainer from "../../../components/FormContainer";
import FormHeading from "../../../components/FormHeading";
import FormBody from "../../../components/FormBody";
import CrCeDtlContainer from "../../../components/CrCeDtlContainer";
import RegionalCenterDetails from "../../../components/RegionalCenterDetails";
import ConsumerDetails from "../../../components/ConsumerDetails";
import SupplierDetails from "../../../components/SupplierDetails";
import OtherDetails from "../../../components/OtherDetails";
import FormSelectItem from "../../../components/FormSelectItem";
import {
  iopTypeOptionList,
  processTypeGrnOptionList,
} from "../../../utils/KeyValueMapping";
import FormSearchItem from "../../../components/FormSearchItem";
import InputDatePickerCombo from "../../../components/InputDatePickerCombo";
import ItemDetailsContainer from "../../../components/ItemDetailsContainer";
import TermsConditionContainer from "../../../components/TermsConditionContainer";
import DesignationContainer from "../../../components/DesignationContainer";
import ButtonContainer from "../../../components/ButtonContainer";
import useHandlePrint from "../../../components/useHandlePrint";
import { useLocation } from "react-router-dom";
const dateFormat = "DD/MM/YYYY";

const currentDate = dayjs();

const GoodsReceiveNoteForm = () => {
  const location = useLocation();

  const formBodyRef = useRef();
  const formRef = useRef();
  const handlePrint = useHandlePrint(formRef);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const [printBtnEnabled, setPrintBtnEnabled] = useState(false);
  const [submitBtnEnabled, setSubmitBtnEnabled] = useState(true);
  const [draftBtnEnabled, setDraftBtnEnabled] = useState(true);
  const [isTxnData, setIsTxnData] = useState(false);

  const { locatorObj } = useSelector((state) => state.locators);
  const { uomObj } = useSelector((state) => state.uoms);
  const { data: itemData } = useSelector((state) => state.item);
  const { organizationDetails, locationDetails, userDetails, token, userCd } =
    useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    issueName: "",
    approvedName: "",
    type: "IRP",
    processType: "IRP",
    processTypeDesc: "Issue Return Process",
    grnNo: "",
    ceRegionalCenterCd: "",
    ceRegionalCenterName: "",
    ceAddress: "",
    ceZipcode: "",
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
    noteType: "Accepted Items",
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
    processId: "string",
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
    conditionOfGoods: "",
    note: "",
  });

  const deepClone = (obj) => {
    if (obj === null || typeof obj !== "object") {
      return obj;
    }

    let clone = Array.isArray(obj) ? [] : {};

    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        clone[key] = deepClone(obj[key]);
      }
    }

    return clone;
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const locatorOptionList = locatorObj
    ? Object.keys(locatorObj).map((key) => {
        // dropdown while assigning locator to quantity
        return {
          value: key,
          desc: locatorObj[key],
        };
      })
    : [];

  const onFinish = async (values) => {
    setSubmitBtnEnabled(false);
    if (!formData.issueName || !formData.genName) {
      message.error("Please fill all the fields.");
      setSubmitBtnEnabled(true);
      return;
    }
    let found = false;
    const tempFormData = deepClone(formData);
    tempFormData.items?.forEach((item) => {
      const { quantity, remQuantity } = item;
      if (quantity - remQuantity > 0) {
        message.error("Please locate a locator to all quantity");
        found = true;
        setSubmitBtnEnabled(true);
        return;
      }
    });

    if (found) return;

    const updatedForm = deepClone(formData);
    const updatedItems = updatedForm.items?.map((item) => {
      const itemObj = item;
      const { qtyList } = item;
      delete itemObj.quantity;
      delete itemObj.remQuantity;
      delete itemObj.qtyList;

      const insideArray = qtyList?.map((qtyObj) => {
        return {
          ...itemObj,
          quantity: qtyObj.quantity,
          locatorId: qtyObj.locatorId,
          unitPrice: parseFloat(itemObj.unitPrice),
        };
      });

      return insideArray;
    });

    const flatItemsArray = updatedItems?.flatMap((innerArray) => innerArray);

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
        "unitPrice",
      ];

      allFields.forEach((field) => {
        if (!(field in formDataCopy)) {
          formDataCopy[field] = "";
        }
      });

      const apiUrl = "/saveGRN";
      const { responseStatus, responseData } = await apiCall(
        "POST",
        apiUrl,
        token,
        formDataCopy
      );
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
        // setButtonVisible(true)
        setSuccessMessage(
          ` Goods Receive Note saved successfully! \n Process ID: ${processId}, \n Process Type: ${processType}, \n Sub Process ID: ${subProcessId}`
        );
        setIsModalOpen(true);
        setPrintBtnEnabled(true);
        setIsModalOpen(true);
        setDraftBtnEnabled(false);
        localStorage.removeItem("grnDraft");
      } else {
        message.error(responseStatus.errorType || "Failed to Goods Receive Note. Please try again later.");
        setSubmitBtnEnabled(true);
      }
    } catch (error) {
      message.error("Failed to Goods Receive Note. Please try again later.");
      setSubmitBtnEnabled(true);
    }
  };

  const addLocator = (index) => {
    setFormData((prevValue) => {
      const itemsArray = prevValue.items;
      itemsArray[index].qtyList.push({
        locatorId: "",
        quantity: 0,
        locatorDesc: "",
      });
      return {
        ...prevValue,
        items: itemsArray,
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
        itemArray[itemIndex].qtyList[qtyListIndex].locatorDesc =
          locatorObj[parseInt(value)];

        return {
          ...prevValues,
          items: itemArray,
        };
      });
    }
  };

  const handleChange = (fieldName, value) => {
    setFormData((prev) => {
      const newData = { ...prev, [fieldName]: value };

      if (fieldName === "processType") {
        newData.type = value;
        newData.processTypeDesc =
          value === "IRP"
            ? "Issue Return Process"
            : value === "PO"
            ? "Purchase Order"
            : "Inter Org Process";
      }

      return newData;
    });
  };

  // function handles data fetch for IRP, PO and Accepted Items for IOP
  const handleReturnAcceptDataSearch = async (
    value,
    processStage,
    rejectProcess = false
  ) => {
    try {
      const subProcessDtlUrl = "/getSubProcessDtls";

      const data = await apiCall("POST", subProcessDtlUrl, token, {
        processId: value,
        processStage,
        rejectProcess,
      });

      const { responseData } = data;
      const { processData, itemList } = responseData;

      setFormData((prevFormData) => ({
        ...prevFormData,

        issueName: processData?.issueName,
        approvedName: processData?.approvedName,
        processId: processData?.processId,

        crRegionalCenterCd:
          processData?.crRegionalCenterCd || processData?.regionalCenterCd,
        crRegionalCenterName:
          processData?.crRegionalCenterName || processData?.regionalCenterName,
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

        noaDate: processData?.noaDate
          ? convertEpochToDateString(processData.noaDate)
          : "",
        noa: processData?.noa ? processData.noa : "",
        dateOfDelivery: processData?.dateOfDelivery,

        items: itemList?.map((item) => ({
          srNo: item?.sNo,
          itemId: item?.itemId,
          itemCode: item?.itemCode,
          itemDesc: item?.itemDesc,
          uom: parseInt(item?.uom),
          uomDesc: uomObj[parseInt(item.uom)],
          quantity: item?.quantity,
          remQuantity: item?.quantity,
          noOfDays: item?.requiredDays,
          remarks: item?.remarks,
          conditionOfGoods: item?.conditionOfGoods,
          budgetHeadProcurement: item?.budgetHeadProcurement,
          locatorId: parseInt(item?.locatorId),
          locatorDesc: locatorObj[parseInt(item.locatorId)],
          unitPrice:
            itemData.find((obj) => obj.itemMasterCd === item.itemCode)?.price ||
            0,
          qtyList: [
            {
              locatorId: parseInt(item?.locatorId),
              locatorDesc: locatorObj[parseInt(item?.locatorId)],
              quantity: item?.quantity,
            },
          ],
        })),
      }));
      // Handle response data as needed
    } catch (error) {
      message.error("Error fetching sub process details");
    }
  };

  useEffect(() => {
    if (formBodyRef.current) formBodyRef.current.updateField(formData);
  }, [formData]);

  // when form is loaded and a form is saved as draft
  useEffect(() => {
    const formData = localStorage.getItem("grnDraft");
    if (formData) {
      setFormData(JSON.parse(formData));
      message.success("Form data loaded from draft.");
    }
  }, []);

  // when form is loaded and it is redirect by pressing print option on txn summary
  useEffect(() => {
    const txnData = location.state;

    if (txnData && txnData.data && txnData.itemList) {
      setFormData({
        ...txnData?.data,
        noa: txnData?.data?.noaNo,
        grnNo: txnData?.data?.processId,
        processType: txnData?.data?.type,
        processTypeDesc:
          txnData?.data?.type === "IRP"
            ? "Issue Return Process"
            : txnData?.data?.type === "NIRP"
            ? "Non Returnable"
            : txnData?.data?.type === "PO"
            ? "Purchase Order"
            : "Inter Org Transfer",
        items: txnData?.itemList,
      });

      setDraftBtnEnabled(false);
      setSubmitBtnEnabled(false);
      setPrintBtnEnabled(true);
      setIsTxnData(true);
    }
  }, [location.state]);

  return (
    <>
      <FormContainer ref={formRef}>
        <FormHeading
          formTitle="Goods Receive Note"
          date={formData.grnDate}
          txnNo={formData.grnNo === "string" ? "" : formData.grnNo}
          txnType="GRN"
        />
        <FormBody formData={formData} ref={formBodyRef}>
          <CrCeDtlContainer>
            <RegionalCenterDetails
              heading={
                formData.processType === "IRP"
                  ? "Consignor Details"
                  : "Consignee Details"
              }
              rcName={
                formData.processType === "IRP"
                  ? "crRegionalCenterName"
                  : "ceRegionalCenterName"
              }
              cdName={
                formData.processType === "IRP"
                  ? "crRegionalCenterCd"
                  : "ceRegionalCenterCd"
              }
              adrName={
                formData.processType === "IRP" ? "crAddress" : "ceAddress"
              }
              zipName={
                formData.processType === "IRP" ? "crZipcode" : "ceZipcode"
              }
              readOnly
            />
            {formData.processType === "IRP" && (
              <ConsumerDetails handleChange={handleChange} readOnly />
            )}
            {formData.processType === "PO" && (
              <SupplierDetails handleChange={handleChange} readOnly />
            )}
            {formData.processType === "IOP" && (
              <RegionalCenterDetails
                heading="Consignor Details"
                rcName="crRegionalCenterName"
                cdName="crRegionalCenterCd"
                zipName="crZipcode"
                adrName="crAddress"
                readOnly
              />
            )}
            <OtherDetails>
              <FormSelectItem
                name="processTypeDesc"
                label="Select Process Type"
                optionArray={processTypeGrnOptionList}
                onChange={handleChange}
                formField="processType"
                readOnly={isTxnData}
              />

              {formData.processType === "IRP" && (
                <FormSearchItem
                  label="Return Note No."
                  name="returnVoucher"
                  onSearch={(value) =>
                    handleReturnAcceptDataSearch(value, "RN")
                  }
                  onChange={handleChange}
                  readOnly={isTxnData}
                />
              )}
              {formData.processType === "PO" && (
                <>
                  <FormSearchItem
                    label="Acceptance Note No."
                    name="acceptanceNoteNo"
                    onSearch={(value) =>
                      handleReturnAcceptDataSearch(value, "ACT")
                    }
                    onChange={handleChange}
                    readOnly={isTxnData}
                  />
                  <InputDatePickerCombo
                    inputLabel="NOA No."
                    inputName="noa"
                    dateLabel="NOA Date"
                    dateName="noaDate"
                    dateValue={formData.noaDate}
                    onChange={handleChange}
                    readOnly
                  />
                  <FormInputItem
                    label="Date Of Delivery"
                    name="dateOfDelivery"
                    readOnly
                  />
                </>
              )}
              {formData.processType === "IOP" && (
                <>
                  <FormSelectItem
                    label="Select Type"
                    name="noteType"
                    optionArray={iopTypeOptionList}
                    formField="noteType"
                    onChange={handleChange}
                  />
                </>
              )}

              {formData.processType === "IOP" &&
                formData.noteType === "Accepted Items" && (
                  <FormSearchItem
                    label="Acceptance Note No."
                    name="acceptanceNoteNo"
                    onSearch={(value) =>
                      handleReturnAcceptDataSearch(value, "ACT")
                    }
                    onChange={handleChange}
                    readOnly={isTxnData}
                  />
                )}
              {formData.processType === "IOP" &&
                formData.noteType === "Rejected Items" && (
                  <FormSearchItem
                    label="Inward Gate Pass No."
                    name="inwardGatePass"
                    onSearch={(value) =>
                      handleReturnAcceptDataSearch(value, "IGP", true)
                    }
                    onChange={handleChange}
                    readOnly={isTxnData}
                  />
                )}
            </OtherDetails>
          </CrCeDtlContainer>
          <ItemDetailsContainer>
            {formData.items?.map((item, key) => (
              <div className="each-item-detail-container">
                <div className="each-item-detail-container-grid">
                  <FormInputItem
                    label="Serial No."
                    name={
                      item.srNo ? ["items", key, "srNo"] : ["items", key, "sNo"]
                    }
                    readOnly
                  />
                  <FormInputItem
                    label="Item Code"
                    name={["items", key, "itemCode"]}
                    readOnly
                  />
                  <FormInputItem
                    label="Item Description"
                    name={["items", key, "itemDesc"]}
                    readOnly
                    className="item-desc-cell"
                  />
                  <FormInputItem
                    label="Unit of Measurement"
                    name={["items", key, "uomDesc"]}
                    readOnly
                  />
                  <FormInputItem
                    label="Received Quantity"
                    name={["items", key, "quantity"]}
                    readOnly
                  />
                  {formData.processType === "PO" && (
                    <FormInputItem
                      label="Unit Price"
                      name={["items", key, "unitPrice"]}
                      onChange={(fName, value) =>
                        itemHandleChange(fName, value, key, setFormData)
                      }
                      readOnly={isTxnData}
                    />
                  )}

                  <FormInputItem
                    label="Budget Head Procurement"
                    name={["items", key, "budgetHeadProcurement"]}
                    value={item.budgetHeadProcurement}
                    onChange={(name, value) =>
                      itemHandleChange(name, value, key, setFormData)
                    }
                    readOnly={isTxnData}
                  />
                  <FormInputItem
                    label="Remarks"
                    name={["items", key, "remarks"]}
                    value={item.budgetHeadProcurement}
                    onChange={(name, value) =>
                      itemHandleChange(name, value, key)
                    }
                    readOnly={isTxnData}
                  />
                  <div
                    className="exclude-print"
                    style={{
                      gridColumn: "span 4",
                      width: "50%",
                      display: isTxnData ? "none" : "block",
                    }}
                  >
                    <h3>
                      ITEMS LEFT TO ASSIGN A LOCATOR:{" "}
                      {item.quantity - item.remQuantity}
                    </h3>

                    {item.qtyList?.map((qtyObj, qtyKey) => (
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "auto auto",
                          gap: "1rem",
                        }}
                      >
                        <FormSelectItem
                          label="Locator Description"
                          name={[
                            "items",
                            key,
                            "qtyList",
                            qtyKey,
                            "locatorDesc",
                          ]}
                          formField={[
                            "items",
                            key,
                            "qtyList",
                            qtyKey,
                            "locatorId",
                          ]}
                          onChange={(fName, value) =>
                            handleLocatorChange("locatorId", key, qtyKey, value)
                          }
                          optionArray={locatorOptionList}
                        />
                        <FormInputItem
                          label="No. Of Items Kept"
                          name={["items", key, "qtyList", qtyKey, "quantity"]}
                          onChange={(fName, value) =>
                            handleLocatorChange("quantity", key, qtyKey, value)
                          }
                        />
                      </div>
                    ))}
                  </div>
                  <Button
                    className="exclude-print"
                    style={{ display: isTxnData ? "none" : "block" }}
                    onClick={() => addLocator(key)}
                    disabled={isTxnData}
                  >
                    Add more locator
                  </Button>

                  <Button
                    icon={<DeleteOutlined />}
                    className="delete-button"
                    onClick={() => removeItem(key, setFormData)}
                    style={
                      isTxnData ? { display: "none" } : { display: "block" }
                    }
                  />
                </div>
              </div>
            ))}
          </ItemDetailsContainer>

          <TermsConditionContainer
            conditionOfGoodsVisible
            noteVisible
            handleChange={handleChange}
            readOnly={isTxnData}
          />
          <DesignationContainer
            genByVisible
            issueVisible
            genDateValue={formData.genDate}
            issueDateValue={formData.issueDate}
            formType="PO"
            handleChange={handleChange}
            readOnly={isTxnData}
          />
          <ButtonContainer
            handlePrint={handlePrint}
            onFinish={onFinish}
            submitBtnEnabled={submitBtnEnabled}
            printBtnEnabled={printBtnEnabled}
            draftDataName="grnDraft"
            formData={formData}
            draftBtnEnabled={draftBtnEnabled}
            disabled={isTxnData}
          />
        </FormBody>

        <Modal
          title="Gooda receive saved successfully"
          open={isModalOpen}
          onOk={handleOk}
        >
          {successMessage && <p>{successMessage}</p>}
        </Modal>
      </FormContainer>
    </>
  );
};

export default GoodsReceiveNoteForm;
