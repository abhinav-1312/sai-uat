// RetunNote.js
import React, { useState, useEffect } from 'react';
import { Form, Input, Select, DatePicker, Button, Row, Col, AutoComplete, Modal, message } from 'antd';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import axios from 'axios';
const dateFormat = 'DD/MM/YYYY';


const { Option } = Select;
const RetunNote = () => {
  const [Type, setType] = useState('1');
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
    returnNoteNo: '',
    returnNoteDt: '',
    processId: '',
    issueNoteNo: '',
    issueNoteDt: '',
    type: '',
    regionalCenterCd: '',
    regionalCenterName: '',
    address: '',
    zipcode: '',
    consumerName: '',
    contactNo: '',
    termsCondition: '',
    note: '',
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
    ],
    userId: ''
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

  console.log("Form data: ", formData)

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
      const currentDate = dayjs();
      console.log('Fetched data:', organizationDetails);
      // Update form data with fetched values
      setFormData({
        regionalCenterCd: "20",
        regionalCenterName: organizationDetails.location,
        address: organizationDetails.locationAddr,
        zipcode: "131021",
        genName: userDetails.firstName,
        userId: "string",
        genDate: currentDate.format(dateFormat),
        issueDate: currentDate.format(dateFormat),
        approvedDate: currentDate.format(dateFormat),
        returnNoteDt: currentDate.format(dateFormat),
        returnNoteNo: "string",
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  const handleIssueNoteNoChange = async (value) => {
    try {
      const apiUrl = 'https://sai-services.azurewebsites.net/sai-inv-mgmt/getSubProcessDtls';
      const response = await axios.post(apiUrl, {
        processId: value,
        processStage: "ISN",
      });
      const responseData = response.data.responseData;
      console.log("Changed response: ", responseData)
      const { processData, itemList } = responseData;
      // console.log('API Response:', response.data);
      const issueNoteDt = processData?.issueNoteDt;
      setFormData(prevFormData => ({
        ...prevFormData,

        processId: processData?.processId,
        issueNoteDt: issueNoteDt,
        consumerName: processData?.consumerName,
        contactNo: processData?.contactNo,

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

      // Ensure all fields are present
      const allFields = [
        "genDate",
        "genName",
        "issueDate",
        // "issueName",
        "approvedDate",
        "approvedName",
        "returnNoteNo",
        "returnNoteDt",
        "processId",
        "issueNoteNo",
        "issueNoteDt",
        "type",
        "regionalCenterCd",
        "regionalCenterName",
        "address",
        "zipcode",
        "consumerName",
        "contactNo",
        "termsCondition",
        "note",
        "items",
        "userId"
      ];

      allFields.forEach(field => {
        if (!(field in formDataCopy)) {
          formDataCopy[field] = "";
        }
      });

      const apiUrl = 'https://sai-services.azurewebsites.net/sai-inv-mgmt/saveReturnNote';
      const response = await axios.post(apiUrl, formDataCopy);
      console.log('API Response:', response.data);
      // Handle success response here
      if (response.status === 200 && response.data && response.data.responseStatus && response.data.responseStatus.message === 'Success') {
        // Access the specific success message data if available
        const { processId, processType, subProcessId } = response.data.responseData;
        setFormData({
          returnNoteNo: processId,
        });
        setSuccessMessage(`Return Note successfully! Return Note : ${processId}, Process Type: ${processType}, Sub Process ID: ${subProcessId}`);
        showModal();
        message.success(`Return Note successfully! Process ID: ${processId}, Process Type: ${processType}, Sub Process ID: ${subProcessId}`);

      } else {
        // Display a generic success message if specific data is not available
        message.error('Failed to Return Note. Please try again later.');
        console.log(response.data)
      }

    } catch (error) {
      console.error('Error saving Return Note:', error);
      // Handle error response here
    }
  };



  const handleValuesChange = (_, allValues) => {
    setType(allValues.type);
  };

  const handleIssueNoteDtChange = (value) => {
    console.log("Changed")
  }



  return (

    <div className="goods-receive-note-form-container">
      <h1>Sports Authority of India - Return Note</h1>

      <Form onFinish={onFinish} className="goods-receive-note-form" onValuesChange={handleValuesChange} layout="vertical">
        <Row>
          <Col span={6} offset={18}>
            <Form.Item label="DATE" name="returnNoteDt">
              <DatePicker defaultValue={dayjs()} format={dateFormat} style={{ width: '100%' }} name="returnNoteDt" onChange={(date, dateString) => handleChange("returnNoteDt", dateString)} />
            </Form.Item>
          </Col>
          <Col span={6}>

          </Col>
          <Col span={6} offset={12}>
            <Form.Item label="RETURN NOTE NO." name="returnNoteNo">
              <Input disabled onChange={(e) => handleChange("returnNoteNo", e.target.value)} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col span={8}>

            <Form.Item label="REGIONAL CENTER CODE" name="regionalCenterCd">
              <Input value={formData.regionalCenterCd} />
              <div style={{ display: 'none' }}>
                {formData.regionalCenterCd}
              </div>
            </Form.Item>
            <Form.Item label="REGIONAL CENTER NAME " name="regionalCenterName">
              <Input value={formData.regionalCenterName} />
              <div style={{ display: 'none' }}>
                {formData.regionalCenterCd}
              </div>
            </Form.Item>
            <Form.Item label="ADDRESS :" name="address">
              <Input value={formData.address} />
              <div style={{ display: 'none' }}>
                {formData.regionalCenterCd}
              </div>
            </Form.Item>
            <Form.Item label="ZIP CODE :" name="zipcode">
              <Input value={formData.zipcode} />
              <div style={{ display: 'none' }}>
                {formData.regionalCenterCd}
              </div>
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item label="CONSUMER NAME :" name="consumerName" initialValue={formData.consumerName}>
              <Input value={formData.consumerName} onChange={(e) => handleChange("consumerName", e.target.value)} readOnly/>
              <div style={{ display: 'none' }}>
                {formData.regionalCenterCd}
              </div>
            </Form.Item>
            {/* <Form.Item label="CONTACT NO. :" name="contactNo" initialValue={formData.contactNo}> */}
            <Form.Item label="CONTACT NO. :" name="contactNo" initialValue={formData.contactNo}>
              <Input value={formData.contactNo} onChange={(e) => handleChange("contactNo", e.target.value)} readOnly />

              <div style={{ display: 'none' }}>
                {formData.zipcode}
              </div>
            </Form.Item>
          </Col>




          <Col span={8}>
            <Form.Item label="ISSUE NOTE NO. :" name="issueNoteNo">
              <Input onChange={(e) => handleIssueNoteNoChange(e.target.value)} />
            </Form.Item>
            {/* <Form.Item label="ISSUE DA :" name="issueNoteDt">
              <Input value={12233} onChange={(e)=>handleIssueNoteDtChange(e.target.value)}/>
              {/* <DatePicker value={formData.issueNoteDt} format={dateFormat} style={{ width: '100%' }} onChange={(date, dateString) => handleChange("issueNoteDt", dateString)} /> */}

            {/* </Form.Item> */} 

            <Form.Item label="ISSUE DATE :" name="issueNoteDt">
              <Input value={formData.issueNoteDt} readOnly />

              <div style={{ display: 'none' }}>
                {formData.zipcode}
              </div>
            </Form.Item>
          </Col>
        </Row>

        {/* Item Details */}
        <h2>ITEM DETAILS</h2>

        <Form.List name="itemDetails" initialValue={formData.items || [{}]}>
          {(fields, { add, remove }) => (
            <>
              <Form.Item style={{ textAlign: 'right' }}>
                {/* <Button type="dashed" onClick={() => add()} style={{ marginBottom: 8 }} icon={<PlusOutlined />}>
                  ADD ITEM
                </Button> */}
              </Form.Item>
              {fields.map(({ key, name, ...restField }, index) => (
                <div key={key} style={{ marginBottom: 16, border: '1px solid #d9d9d9', padding: 16, borderRadius: 4 }}>
                  <Row gutter={24}>
                    <Col span={6}>

                      <Form.Item {...restField} label="S.NO." name={[name, 'srNo']}  >
                        <Input value={formData.items?.[index]?.srNo} onChange={(e) => e.target && itemHandleChange(`srNo`, e.target.value, index)} readOnly />
                        <span style={{ display: 'none' }}>{index + 1}</span>
                      </Form.Item>
                    </Col>
                    <Col span={6}>
                      <Form.Item {...restField} label="ITEM CODE" name={[name, 'itemCode']} initialValue={formData.items?.[index]?.itemCode}>
                        <Input
                          style={{ width: '100%' }}
                          value={formData.items?.[index]?.itemCode}
                          readOnly
                        />
                        <span style={{ display: 'none' }}>{index + 1}</span>
                      </Form.Item>
                    </Col>
                    <Col span={6}>
                      <Form.Item label="ITEM DESCRIPTION" name={[name, 'itemDesc']}>
                        <Input
                          style={{ width: '100%' }}
                          value={formData.items?.[index]?.itemDesc}
                          readOnly

                        />
                        <span style={{ display: 'none' }}>{index + 1}</span>
                      </Form.Item>
                    </Col>
                    <Col span={5}>
                      <Form.Item label="UOM" name={[name, 'uom']}>
                        <Input
                          style={{ width: '100%' }}
                          onChange={(value) => itemHandleChange(`uom`, value, index)}
                          value={formData.items?.[index]?.uom}
                          readOnly
                        />
                      </Form.Item>
                    </Col>
                    <Col span={6}>
                      <Form.Item label="RETURN QUANTITY" name={[name, 'quantity']}>
                        <Input value={formData.items?.[index]?.quantity} onChange={(e) => itemHandleChange(`quantity`, e.target.value, index)} />
                        <span style={{ display: 'none' }}>{index + 1}</span>
                      </Form.Item>
                    </Col>
                    <Col span={6}>
                      <Form.Item label="RETURNED AFTER NO. OF DAYS" name={[name, 'noOfDays']}>
                        <Input value={formData.items?.[index]?.noOfDays || 1345} onChange={(e) => itemHandleChange(`noOfDays`, e.target.value, index)} readOnly />
                        <span style={{ display: 'none' }}>{index + 1}</span>
                      </Form.Item>
                    </Col>
                    <Col span={6}>
                      <Form.Item label="CONDITION OF GOODS" name={[name, 'conditionOfgoods']}>
                        <Input value={formData.items?.[index]?.conditionOfGoods} readOnly/>
                      </Form.Item>
                    </Col>
                    <Col span={5}>
                      <Form.Item label="REMARK" name={[name, 'remarks']}>
                        <Input value={formData.items?.[index]?.remarks} readOnly/>
                        <span style={{ display: 'none' }}>{index + 1}</span>
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
            <Form.Item label="TERMS AND CONDITION :" name="termsCondition">
              <Input.TextArea onChange={(e) => handleChange("termsCondition", e.target.value)} />
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

          <div>
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
          <div  >
            <div className='goods-receive-note-signature'>
              RETURNED/SUBMITTED BY
            </div>
            <div className='goods-receive-note-signature'>
              NAME & SIGNATURE :<Form><Input value={formData.approvedName} name='approvedName' onChange={(e) => handleChange("approvedName", e.target.value)} /></Form>
            </div>
            <div className='goods-receive-note-signature'>
              DATE & TIME :<DatePicker defaultValue={dayjs()} format={dateFormat} style={{ width: '58%' }} name='approvedDate' onChange={(date, dateString) => handleChange("approvedDate", dateString)} />
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
        <Modal title="Return Note saved successfully" visible={isModalOpen} onOk={handleOk} >
          {successMessage && <p>{successMessage}</p>}
          {errorMessage && <p>{errorMessage}</p>}
        </Modal>
      </Form>
    </div >
  );
};

export default RetunNote;
