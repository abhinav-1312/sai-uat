import { Form } from "antd";
import React from "react";
import RegionalCenterDetails from "./RegionalCenterDetails";
import ConsumerDetails from "./ConsumerDetails";
import SupplerDetails from "./SupplerDetails";
import { apiCall } from "../utils/Functions";
import { useSelector } from "react-redux";
import FormInputItem from "./FormInputItem";

const FormBody = ({ formData, txnType, setFormData }) => {
  const [form] = Form.useForm();
  const {token, userCd} = useSelector(state => state.auth)
  const handleChange = (fieldName, value) => {
    // if (fieldName === "processType") {
    //   fetchUserDetails(value);
    //   return;
    // }
    // if (fieldName === "supplierCode") {
    //   searchVendor(value);
    //   return;
    // }

    setFormData((prevValues) => ({
      ...prevValues,
      [fieldName]: value === "" ? null : value,
    }));
  };

  const handleCeRccChange = async (_, value) => {
    setFormData(prev => {
      return {
        ...prev,
        ceRegionalCenterCd: value
      }
    })
    const url = "/master/getOrgMasterById";
    const { responseStatus, responseData } = await  apiCall('POST', url, token, { id: value, userId: userCd });

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
      const apiUrl =
        "/getSubProcessDtls";
      // const response = await axios.post(apiUrl, {
      //   processId: value,
      //   processStage: "IGP",
      // }, apiHeader("POST", token));
      const {responseData} = await apiCall('POST', apiUrl, token, {processId: value, processStage: 'IGP'});
      const { processData, itemList } = responseData;

      if(processData !== null){
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
      else{
        // const response = await axios.post(apiUrl, {
        //   processId: value,
        //   processStage: "ISN",
        // }, apiHeader("POST", token));
        const {responseData} = await apiCall('POST', apiUrl, token, {processId: value, processStage: 'ISN'});
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

  return (
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
            regionalCenterCd={txnType === 'RN' ? formData.regionalCenterCd : (formData.type === 'PO' ? formData.ceRegionalCenterCd : formData.crRegionalCenterCd)}
            regionalCenterName={txnType === 'RN' ? formData.regionalCenterName : (formData.type === 'PO' ? formData.ceRegionalCenterName : formData.crRegionalCenterName)}
            address={txnType === 'RN' ? formData.address : (formData.type === 'PO' ? formData.ceAddress : formData.crAddress)}
            zipcode={txnType === 'RN' ? formData.zipcode : (formData.type === 'PO' ? formData.ceZipcode : formData.crZipcode)}
          />
        </div>

        <div className="consignor-container">
          <h3 className="consignor-consignee-heading">
            {
              formData.type === "IRP" || formData.type === "IOP"
                ? "Consignor Details"
                : "Consignee Details"
            }
          </h3>

          {
            formData.type === 'IRP' && 
            <ConsumerDetails consumerName={formData.consumerName} contactNo={formData.contactNo} />
          }
          {
            formData.type === "PO" && (
              <SupplerDetails supplierName={formData.supplierName} supplierCode={formData.supplierCode} handleChange={handleChange} />
            )
          }
          {
            formData.type === 'IOP' && 
              <RegionalCenterDetails regionalCenterName={formData.ceRegionalCenterName} regionalCenterCd={formData.ceRegionalCenterCd} address={formData.ceAddress} zipcode={formData.ceZipcode} txnType={txnType} handleChange={handleCeRccChange}
            />
          }
        </div>

        <div className="other-container">
          <h3 className="consignor-consignee-heading">Other Details</h3>
          {
            txnType === 'RN' && (
              <>
                <FormInputItem label='Issue Note No.' name='issueNoteNo' onChange={handleIssueNoteNoChange} />
              </>
            )

          }
        </div>


      </div>
    </Form>
  );
};

export default FormBody;
