import React, { useEffect, useMemo, useRef, useState } from "react";
import FormContainer from "../../../components/FormContainer";
import FormHeading from "../../../components/FormHeading";
import dayjs from "dayjs";
import FormBody from "../../../components/FormBody";
import CrCeDtlContainer from "../../../components/CrCeDtlContainer";
import RegionalCenterDetails from "../../../components/RegionalCenterDetails";
import ConsumerDetails from "../../../components/ConsumerDetails";
import { useDispatch, useSelector } from "react-redux";
import ItemDetailsContainer from "../../../components/ItemDetailsContainer";
import { apiCall, mergeItemMasterAndOhq, removeItem } from "../../../utils/Functions";
import FormInputItem from "../../../components/FormInputItem";
import { fetchOhq } from "../../../redux/slice/ohqSlice";
import { Button, message } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import TermsConditionContainer from "../../../components/TermsConditionContainer";
import DesignationContainer from "../../../components/DesignationContainer";
import ButtonContainer from "../../../components/ButtonContainer";
import useHandlePrint from "../../../components/useHandlePrint";

const dateFormat = "DD/MM/YYYY";
const currentDate = dayjs();

const IssueNoteCorrection = () => {
  const dispatch = useDispatch()
  const formRef = useRef();
  const handlePrint = useHandlePrint(formRef)
  const formBodyRef = useRef();
  const { organizationDetails, locationDetails, userDetails, token, userCd } =
    useSelector((state) => state.auth);
  const { data: itemData } = useSelector((state) => state.item);
  const { data: ohqData } = useSelector((state) => state.ohq);

  const data = useMemo(() => mergeItemMasterAndOhq(itemData, ohqData), [itemData, ohqData]);
  const onFinish = async () => {
    message.error("Error submitting form. Please try again.")
    try{
     const data = await apiCall("POST", "/doCorrectionProcess", token, formData);
    }
    catch(error){
      message.error("Error submitting form. Please try again.")
    }
  }

  const [formData, setFormData] = useState({
    genDate: currentDate.format(dateFormat),
    processId: "",
    crRegionalCenterCd: organizationDetails?.id,
    crRegionalCenterName: organizationDetails?.location,
    crAddress: organizationDetails?.locationAddr,
    crZipcode: locationDetails?.zipcode,
    consumerName: userDetails?.firstName + " " + userDetails?.lastName,
    genName: userDetails?.firstName + " " + userDetails?.lastName,
    contactNo: "",
    type: "IRP",
    demandNoteDt: currentDate.format(dateFormat),
    userId: userCd,
    processType: "IRP",
    items: [
    ]
  });

  const handleChange = (fieldName, value) => {
    setFormData((prev) => {
      return {
        ...prev,
        [fieldName]: value,
      };
    });
  };

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

  const testingp = () => {
    setFormData(prev => {
      return {
        ...prev,
        crRegionalCenterCd: 100
      }
    })
  }

  useEffect(() => {
    dispatch(fetchOhq());
  }, [])

  console.log(formData)

  useEffect(() => {
    if(formBodyRef.current)
      formBodyRef.current.updateField(formData)
  }, [formData])


  return (
    <FormContainer onFinish={onFinish} ref={formRef}>
      <FormHeading
        formTitle={"Correction Process Issue Note"}
        date={formData.genDate}
        txnNo={formData.processId}
      />
      <FormBody formData={formData} ref={formBodyRef}>
        <CrCeDtlContainer>
          <RegionalCenterDetails
            heading="Consignor Details"
            regionalCenterCd={formData.crRegionalCenterCd}
            cdName="crRegionalCenterCd"
            regionalCenterName={formData.crRegionalCenterName}
            rcName="crRegionalCenterName"
            address={formData.crAddress}
            adrName="crAddress"
            zipcode={formData.crZipcode}
            zipName="crZipcode"
          />
          <div className="consignor-container">
            <h3 className="consignor-consignee-heading"> 
              Employee Detail
              </h3>
              <FormInputItem
          label="Employee Name"
          name="consumerName"
          // value={consumerName}
          onChange={handleChange}
          // readOnly={txnType === 'ISN' ? false : true}
        />
          </div>
        </CrCeDtlContainer>

        <ItemDetailsContainer
          itemSearch
          itemArray={data}
          updateFormData={updateFormData}
        >
          {formData?.items?.length > 0 && formData?.items?.map((item, key) => (
            <div className="each-item-detail-container">
              <div className="each-item-detail-container-grid">
                <FormInputItem
                  label="S. No."
                  readOnly={true}
                  name={['items', key, 'srNo']}
                />
                 <FormInputItem
                    label="Item Code"
                    name={['items', key, 'itemCode']}
                    readOnly={true}
                  />
                  <FormInputItem label="Item Description"
                    className="item-desc-cell"
                    name={['items', key, 'itemDesc']}
                  />
                  <FormInputItem 
                  label="Unit of Measurement"
                  name={['items', key, 'uomDesc']}
                  />
                  <FormInputItem label="Quantity" name={['items', key, 'quantity']} onChange={(fName, value) => itemHandleChange("quantity", value, key)} />
                  <FormInputItem label="Locator" name={['items', key, 'locatorDesc']} />
                  <FormInputItem label="Remarks" name={['items', key, 'remarks']} onChange={(fName, value) => itemHandleChange("remarks", value, key)} />
              </div>
              <Button
                  icon={<DeleteOutlined />}
                  className="delete-button"
                  onClick={() => removeItem(key, setFormData)}
                />
            </div>
          ))}
        </ItemDetailsContainer>
        <TermsConditionContainer
          noteVisible handleChange={handleChange} />
        <DesignationContainer
          genByVisible
          handleChange={handleChange} />
          {/* <ButtonContainer handlePrint={handlePrint} onFinish={onFinish} /> */}
      </FormBody>
    </FormContainer>
  );
};

export default IssueNoteCorrection;
