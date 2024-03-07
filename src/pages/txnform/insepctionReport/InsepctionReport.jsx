// InsepctionReport.js
import React, { useState, useEffect } from 'react';
import { Form, Input, Select, DatePicker, Button, Row, Col, Typography, AutoComplete, Modal, message } from 'antd';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import axios from 'axios';
const dateFormat = 'YYYY/MM/DD';
const { Option } = Select;
const { Title } = Typography;


const InsepctionReport = () => {
  const [Type, setType] = useState('PO');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [itemData, setItemData] = useState([]);
  const [formData, setFormData] = useState({
    genDate: '',
    genName: '',
    issueDate: '',
    issueName: '',
    approvedDate: '',
    approvedName: '',
    processId: 0,
    type: '',
    typeOfInspection: '',
    inspectionRptNo: '',
    inspectionRptDate: '',
    invoiceNo: '',
    inwardGatePass: '',
    ceRegionalCenterCd: '',
    ceRegionalCenterName: '',
    ceAddress: '',
    ceZipcode: '',
    crRegionalCenterCd: '',
    crRegionalCenterName: '',
    crAddress: '',
    crZipcode: '',
    consumerName: '',
    supplierName: '',
    supplierCd: '',
    address: '',
    contactNo: '',
    dateOfDeliveryDate: '',
    dateOfInspectionDate: '',
    note: '',
    conditionOfGoods: '',
    userId: '',
    items: [
      {
        srNo: 0,
        itemCode: '',
        itemDesc: '',
        uom: '',
        quantity: 0,
        noOfDays: 0,
        remarks: '',
        conditionOfGoods: '',
        budgetHeadProcurement: '',
        locatorId: ''
      }
    ]
  });


  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleChange = (fieldName, value) => {
    setFormData(prevValues => ({
      ...prevValues,
      [fieldName]: value === "" ? null : value
    }));
  };

  const itemHandleChange = (fieldName, value, index) => {
    setFormData(prevValues => {
      const updatedItems = [...(prevValues.items || [])];
      updatedItems[index] = {
        ...updatedItems[index],
        [fieldName]: value === "" ? null : value,
        uom: "string",
        conditionOfGoods: "string", // Hard-coded data
        budgetHeadProcurement: "string", // Hard-coded data
        locatorId: "string", // Hard-coded data
      };
      return {
        ...prevValues,
        items: updatedItems
      };
    });
  };
  useEffect(() => {

    fetchItemData()
    fetchUserDetails()
  }, []);

  const fetchItemData = async () => {
    try {
      const apiUrl = 'https://sai-services.azurewebsites.net/sai-inv-mgmt/master/getItemMaster';
      const response = await axios.get(apiUrl);
      const { responseData } = response.data;
      setItemData(responseData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  const fetchUserDetails = async () => {
    try {
      const apiUrl = 'https://sai-services.azurewebsites.net/sai-inv-mgmt/login/authenticate';
      const response = await axios.post(apiUrl, {
        userCd: "dkg",
        password: "string"
      });

      const { responseData } = response.data;
      const { organizationDetails } = responseData;
      const { userDetails } = responseData;
      console.log('Fetched data:', organizationDetails);
      const currentDate = dayjs();
      // Update form data with fetched values
      setFormData({
        ceRegionalCenterCd: organizationDetails.location,
        ceRegionalCenterName: organizationDetails.organizationName,
        ceAddress: organizationDetails.locationAddr,
        ceZipcode: "",
        genName: userDetails.firstName,
        userId: "string",
        genDate: currentDate.format(dateFormat),
        issueDate: currentDate.format(dateFormat),
        approvedDate: currentDate.format(dateFormat),
        inspectionRptDate: currentDate.format(dateFormat),
        inspectionRptNo: "string",

      });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleInwardGatePassChange = async (value) => {
    try {
      const apiUrl = 'https://sai-services.azurewebsites.net/sai-inv-mgmt/getSubProcessDtls';
      const response = await axios.post(apiUrl, {
        processId: value,
        processStage: "IGP",
      });
      const responseData = response.data.responseData;
      const { processData, itemList } = responseData;
      console.log('API Response:', response.data);
      setFormData(prevFormData => ({
        ...prevFormData,

        issueName: processData?.issueName,
        approvedName: processData?.approvedName,
        processId: processData?.processId,

        crRegionalCenterCd: processData?.crRegionalCenterCd,
        crRegionalCenterName: processData?.crRegionalCenterName,
        crAddress: processData?.crAddress,
        crZipcode: processData?.crZipcode,

        consumerName: processData?.consumerName,
        contactNo: processData?.contactNo,

        supplierCode: processData?.supplierCode,
        supplierName: processData?.supplierCode,
        address: processData?.crAddress,

        items: itemList.map(item => ({
          srNo: item?.sNo,
          itemCode: item?.itemCode,
          itemDesc: item?.itemDesc,
          uom: item?.uom,
          quantity: item?.quantity,
          noOfDays: item?.requiredDays,
          remarks: item?.remarks,
          conditionOfGoods: item?.conditionOfGoods,
          budgetHeadProcurement: item?.budgetHeadProcurement,
          locatorId: item?.locatorId
        }))
      }));
      // Handle response data as needed
    } catch (error) {
      console.error('Error fetching sub process details:', error);
      // Handle error
    }
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
        "typeOfInspection",
        "inspectionRptNo",
        "inspectionRptDate",
        "invoiceNo",
        "inwardGatePass",
        "ceRegionalCenterCd",
        "ceRegionalCenterName",
        "ceAddress",
        "ceZipcode",
        "crRegionalCenterCd",
        "crRegionalCenterName",
        "crAddress",
        "crZipcode",
        "consumerName",
        "supplierName",
        "supplierCd",
        "address",
        "contactNo",
        "dateOfDeliveryDate",
        "dateOfInspectionDate",
        "note",
        "conditionOfGoods",
        "userId"
      ];



      allFields.forEach(field => {
        if (!(field in formDataCopy)) {
          formDataCopy[field] = "";
        }
      });

      const apiUrl = 'https://sai-services.azurewebsites.net/sai-inv-mgmt/saveInspectionReport';
      const response = await axios.post(apiUrl, formDataCopy);
      console.log('Received values:', values);
      if (response.status === 200 && response.data && response.data.responseStatus && response.data.responseStatus.message === 'Success') {
        // Access the specific success message data if available
        const { processId, processType, subProcessId } = response.data.responseData;
        setFormData({
          inspectionRptNo: processId,
        });
        setSuccessMessage(`Inspection Report : ${processId}, Process Type: ${processType}, Sub Process ID: ${subProcessId}`);
        showModal();
        message.success(`Inspection Report  successfully! Process ID: ${processId}, Process Type: ${processType}, Sub Process ID: ${subProcessId}`);

      } else {
        // Display a generic success message if specific data is not available
        message.error('Failed to Inspection Report . Please try again later.');
      }
    } catch (error) {
      console.error('Error saving Inspection Report :', error);
      message.error('Failed to Inspection Report . Please try again later.');

      // Handle error response here
    }
  };


  const handleValuesChange = (_, allValues) => {
    setType(allValues.type);
  };

  return (

    <div className="goods-receive-note-form-container">
      <h1>Sports Authority of India - Inspection Report</h1>

      <Form onFinish={onFinish} className="goods-receive-note-form" onValuesChange={handleValuesChange} layout="vertical">
        <Row>
          <Col span={6} offset={18}>
            <Form.Item label="DATE" name="inspectionRptDate">
              <DatePicker defaultValue={dayjs()} format={dateFormat} style={{ width: '100%' }} name="inspectionRptDate" onChange={(date, dateString) => handleChange("inspectionRptDate", dateString)} />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="TYPE" name="type">
              <Select onChange={(value) => handleChange("type", value)}>
                <Option value="PO">1. Purchase Order</Option>
                <Option value="IOP">2. Inter-Org Transaction</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={6} offset={12}>
            <Form.Item label="INSEPCTION REPORT NO." name="inspectionRptNo">
              <Input disabled onChange={(e) => handleChange("inspectionRptNo", e.target.value)} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col span={8}>

            <Title strong level={2} underline type='danger' > CONSIGNEE DETAIL :-</Title>

            <Form.Item label="REGIONAL CENTER CODE" name="ceRegionalCenterCd">
              <Input value={formData.ceRegionalCenterCd} />
              <div style={{ display: 'none' }}>
                {formData.ceRegionalCenterCd}
              </div>
            </Form.Item>
            <Form.Item label="REGIONAL CENTER NAME " name="ceRegionalCenterName">
              <Input value={formData.ceRegionalCenterName} />
              <div style={{ display: 'none' }}>
                {formData.ceRegionalCenterCd}
              </div>
            </Form.Item>
            <Form.Item label="ADDRESS :" name="ceAddress">
              <Input value={formData.ceAddress} />
              <div style={{ display: 'none' }}>
                {formData.ceRegionalCenterCd}
              </div>
            </Form.Item>
            <Form.Item label="ZIP CODE :" name="ceZipcode">
              <Input value={formData.ceZipcode} />
              <div style={{ display: 'none' }}>
                {formData.ceRegionalCenterCd}
              </div>
            </Form.Item>
          </Col>
          <Col span={8}>

            <Title strong underline level={2} type="danger" >CONSIGNOR DETAIL :-</Title>

            {Type === 'PO' && (
              <>
                <Form.Item label="SUPPLIER CODE :" name="supplierCode">
                  <Input onChange={(e) => handleChange("supplierCode", e.target.value)} />
                </Form.Item>
                <Form.Item label="SUPPLIER NAME :" name="supplierName">
                  <Input onChange={(e) => handleChange("supplierName", e.target.value)} />
                </Form.Item>
                {/** adress filed missing in inward gete pass so how we get auto data for now we use cr  address */}
                <Form.Item label="ADDRESS:" name="supplierAddress">
                  <Input onChange={(e) => handleChange("supplierAddress", e.target.value)} />
                </Form.Item>
              </>
            )}


            {Type === 'IOP' && (
              <>
                <Form.Item label="REGIONAL CENTER CODE" name="crRegionalCenterCd">
                  <Input onChange={(e) => handleChange("crRegionalCenterCd", e.target.value)} />
                </Form.Item>
                <Form.Item label="REGIONAL CENTER NAME " name="crRegionalCenterName">
                  <Input onChange={(e) => handleChange("crRegionalCenterName", e.target.value)} />
                </Form.Item>
                <Form.Item label="ADDRESS :" name="crAddress">
                  <Input onChange={(e) => handleChange("crAddress", e.target.value)} />
                </Form.Item>
                <Form.Item label="ZIP CODE :" name="crZipcode">
                  <Input onChange={(e) => handleChange("crZipcode", e.target.value)} />
                </Form.Item>
              </>
            )}
          </Col>
          <Col span={8}>
            <Form.Item>
            </Form.Item>
            <Form.Item label="INWARD GATE PASS No." name="inwardGatePass">
              <Input onChange={(e) => handleInwardGatePassChange(e.target.value)} />
            </Form.Item>
            <Form.Item label=" CHALLAN / INVOICE NO. :" name="invoiceNo">
              <Input onChange={(e) => handleChange("invoiceNo", e.target.value)} />
            </Form.Item>
            {/** Mode of deleivery is missing filed in api  */}
            <Form.Item label="MODE OF DELIVERY  :" name="modeOfDelivery">
              <Input onChange={(e) => handleChange("modeOfDelivery", e.target.value)} />
            </Form.Item>
            <Form.Item label="DATE OF INSPECTION :" name="dateOfInspectionDate">
              <DatePicker format={dateFormat} style={{ width: '100%' }} onChange={(date, dateString) => handleChange("dateOfInspectionDate", dateString)} />
            </Form.Item>
            <Form.Item label="DATE OF DELIVERY " name="dateOfDeliveryDate">
              <DatePicker format={dateFormat} style={{ width: '100%' }} onChange={(date, dateString) => handleChange("dateOfDeliveryDate", dateString)} />
            </Form.Item>
            <Form.Item label="TYPE OF INSPECTION:" name="typeOfInspection">
              <Input onChange={(e) => handleChange("typeOfInspection", e.target.value)} />
            </Form.Item>

          </Col>
        </Row>

        {/* Item Details */}
        <h2>ITEM DETAILS</h2>

        <Form.List name="itemDetails" initialValue={formData.items || [{}]}>
          {(fields, { add, remove }) => (
            <>
              <Form.Item style={{ textAlign: 'right' }}>
                <Button type="dashed" onClick={() => add()} style={{ marginBottom: 8 }} icon={<PlusOutlined />}>
                  ADD ITEM
                </Button>
              </Form.Item>
              {fields.map(({ key, name, ...restField }, index) => (
                <div key={key} style={{ marginBottom: 16, border: '1px solid #d9d9d9', padding: 16, borderRadius: 4 }}>
                  <Row gutter={24}>
                    <Col span={6}>
                      <Form.Item {...restField} label="S.NO." name={[name, 'srNo']}  >
                        <Input value={formData.items?.[index]?.srNo} onChange={(e) => e.target && itemHandleChange(`srNo`, e.target.value, index)} />
                        <span style={{ display: 'none' }}>{index + 1}</span>
                      </Form.Item>
                    </Col>
                    <Col span={6}>
                      <Form.Item {...restField} label="ITEM CODE" name={[name, 'itemCode']} initialValue={formData.items?.[index]?.itemCode}>
                        <AutoComplete
                          style={{ width: '100%' }}
                          options={itemData.map(item => ({ value: item.itemMasterCd }))}
                          placeholder="Enter item code"
                          filterOption={(inputValue, option) =>
                            option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                          }
                          value={formData.items?.[index]?.itemCode}
                          onChange={(value) => itemHandleChange(`itemCode`, value, index)}
                        />
                        <span style={{ display: 'none' }}>{index + 1}</span>
                      </Form.Item>
                    </Col>
                    <Col span={6}>
                      <Form.Item {...restField} label="ITEM DESCRIPTION" name={[name, 'itemDesc']}>
                        <AutoComplete
                          style={{ width: '100%' }}
                          options={itemData.map(item => ({ value: item.itemMasterDesc }))}
                          placeholder="Enter item description"
                          filterOption={(inputValue, option) =>
                            option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                          }
                          onChange={(value) => itemHandleChange(`itemDesc`, value, index)}
                          value={formData.items?.[index]?.itemDesc}

                        />
                        <span style={{ display: 'none' }}>{index + 1}</span>
                      </Form.Item>
                    </Col>
                    <Col span={5}>
                      <Form.Item {...restField} label="UOM" name={[name, 'uom']}>
                        <AutoComplete
                          style={{ width: '100%' }}
                          options={itemData.map(item => ({ value: item.uom }))}
                          placeholder="Enter UOM"
                          filterOption={(inputValue, option) =>
                            option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                          }
                          onChange={(value) => itemHandleChange(`uom`, value, index)}
                        />
                      </Form.Item>
                    </Col>

                    <Col span={6}>
                      <Form.Item {...restField} label="RECEIVED QUANTITY" name={[name, 'quantity']}>
                        <Input value={formData.items?.[index]?.quantity} onChange={(e) => itemHandleChange(`quantity`, e.target.value, index)} />
                        <span style={{ display: 'none' }}>{index + 1}</span>
                      </Form.Item>
                    </Col>
                    <Col span={6}>
                      <Form.Item {...restField} label="BUDGET HEAD PROCUREMENT" name={[name, 'budgetHeadProcurement']}>
                        <Input onChange={(e) => itemHandleChange(`budgetHeadProcurement`, e.target.value, index)} />
                      </Form.Item>
                    </Col>
                    <Col span={6}>
                      <Form.Item {...restField} label="LOCATOR" name={[name, 'locatorId']}>
                        <Input onChange={(e) => itemHandleChange(`locatorId`, e.target.value, index)} />
                      </Form.Item>
                    </Col>
                    <Col span={5}>
                      <Form.Item {...restField} label="REMARK" name={[name, 'remarks']}>
                        <Input onChange={(e) => itemHandleChange(`remarks`, e.target.value, index)} />
                      </Form.Item>
                    </Col>
                    <Col span={1}>
                      <MinusCircleOutlined onClick={() => remove(name)} style={{ marginTop: 8 }} />
                    </Col>
                  </Row>
                </div>
              ))}
            </>
          )}
        </Form.List>

        {/* Condition of Goods */}

        <Row gutter={24}>
          <Col span={12}>
            <Form.Item label="CONDITION OF GOODS" name="conditionOfGoods">
              <Input.TextArea onChange={(e) => handleChange("conditionOfGoods", e.target.value)} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="NOTE" name="note">
              <Input.TextArea onChange={(e) => handleChange("note", e.target.value)} />
            </Form.Item>
          </Col>
        </Row>

        {/* Note and Signature */}

        <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between' }}>
          <div  >
            <div className='goods-receive-note-signature'>
              GENERATED  BY
            </div>
            <div className='goods-receive-note-signature'>
              NAME & SIGNATURE :<Form><Input value={formData.genName} name="genName" onChange={(e) => handleChange("genName", e.target.value)} /></Form>
            </div>
            <div className='goods-receive-note-signature'>
              DATE & TIME :<DatePicker defaultValue={dayjs()} format={dateFormat} style={{ width: '58%' }} name="genDate" onChange={(date, dateString) => handleChange("genDate", dateString)} />
            </div>
          </div>

          <div >
            <div className='goods-receive-note-signature'>
              RECEIVED BY
            </div>
            <div className='goods-receive-note-signature'>
              NAME & SIGNATURE :<Form><Input name='issueName' onChange={(e) => handleChange("issueName", e.target.value)} /></Form>
            </div>
            <div className='goods-receive-note-signature'>
              DATE & TIME :<DatePicker defaultValue={dayjs()} format={dateFormat} style={{ width: '58%' }} name='issueDate' onChange={(date, dateString) => handleChange("issueDate", dateString)} />
            </div>
          </div>
        </div>



        {/* Submit Button */}
        <div className='goods-receive-note-button-container'>

          <Form.Item >
            <Button type="primary" htmlType="save" style={{ width: '200px', margin: 16 }}>
              SAVE
            </Button>
          </Form.Item>

          <Form.Item >
            <Button type="primary" htmlType="submit" style={{ backgroundColor: '#4CAF50', borderColor: '#4CAF50', width: '200px', margin: 16 }}>
              SUBMIT
            </Button>
          </Form.Item>
          <Form.Item >
            <Button type="primary" danger htmlType="save" style={{ width: '200px', margin: 16 }}>
              PRINT
            </Button>
          </Form.Item>

        </div>
        <Modal title="Insepction Report  saved successfully" visible={isModalOpen} onOk={handleOk} >
          {successMessage && <p>{successMessage}</p>}
          {errorMessage && <p>{errorMessage}</p>}
        </Modal>
      </Form>
    </div >
  );
};

export default InsepctionReport;
