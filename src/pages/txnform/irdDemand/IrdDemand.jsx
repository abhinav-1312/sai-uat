// DemandNoteForm.js
import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Row, Col, DatePicker, Typography, AutoComplete } from 'antd';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import axios from 'axios';
const dateFormat = 'YYYY/MM/DD';
const { Title } = Typography;
const { TextArea } = Input;

const DemandNoteForm = () => {

  const [itemData, setItemData] = useState([]);
  const [formData, setFormData] = useState({
    regionalCenterCode: '',
    regionalCenterName: '',
    consigneeAddress: '',
    consigneeZipCode: ''
  });
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
      // Update form data with fetched values
      setFormData({
        regionalCenterCode: "20",
        regionalCenterName: organizationDetails.location,
        consigneeAddress: organizationDetails.locationAddr,
        consigneeZipCode: "131021",
        firstName: userDetails.firstName,
        lastName: userDetails.lastName

      });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };


  const onFinish = (values) => {
    console.log('Received values:', values);
  };

  return (
    <div className="goods-receive-note-form-container">
      <h1>Sports Authority of India - INTER RD DEMAND NOTE </h1>

      <Form onFinish={onFinish} className="goods-receive-note-form" layout="vertical">
        <Row>
          <Col span={6} offset={18}>
            <Form.Item label="DATE" name="date">
              <DatePicker defaultValue={dayjs()} format={dateFormat} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={6} >

          </Col>
          <Col span={6} offset={12}>
            <Form.Item label="INTER RD DEMAND NOTE NO. :" name="grnNo">
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col span={8}>
            <Title strong level={2} underline type='danger' > CONSIGNEE DETAIL :-</Title>

            <Form.Item label="REGIONAL CENTER CODE" name="regionalCenterCode">
              <Input value={formData.regionalCenterCode} />
              <div style={{ display: 'none' }}>
                {formData.regionalCenterCode}
              </div>
            </Form.Item>
            <Form.Item label="REGIONAL CENTER NAME " name="regionalCenterNameConsignee">
              <Input value={formData.regionalCenterName} />
              <div style={{ display: 'none' }}>
                {formData.regionalCenterCode}
              </div>
            </Form.Item>
            <Form.Item label="ADDRESS :" name="consigneeAddress">
              <Input value={formData.consigneeAddress} />
              <div style={{ display: 'none' }}>
                {formData.regionalCenterCode}
              </div>
            </Form.Item>
            <Form.Item label="ZIP CODE :" name="consigneeZipCode">
              <Input value={formData.consigneeZipCode} />
              <div style={{ display: 'none' }}>
                {formData.regionalCenterCode}
              </div>
            </Form.Item>

          </Col>

          <Col span={8}>

          </Col>

          <Col span={8}>
            <Title strong underline level={2} type="danger" >CONSIGNOR DETAIL :-</Title>

            <Form.Item label="SUPPLIER CODE :" name="supplierCode">
              <Input />
            </Form.Item>
            <Form.Item label="SUPPLIER NAME :" name="supplierName">
              <Input />
            </Form.Item>
            <Form.Item label="ADDRESS:" name="supplierAddress">
              <Input />
            </Form.Item>
            <Form.Item label="ZIP CODE :" name="consigneeZipCode">
              <Input />
            </Form.Item>
          </Col>
        </Row>

        {/* Item Details */}
        <h2>ITEM DETAILS</h2>

        <Form.List name="itemDetails" initialValue={[{}]}>
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
                      <Form.Item {...restField} label="S.NO." name={[name, 'sNo']} >
                        <Input value={index + 1} />
                        <span style={{ display: 'none' }}>{index + 1}</span>
                      </Form.Item>
                    </Col>
                    <Col span={6}>
                      <Form.Item {...restField} label="ITEM CODE" name={[name, 'itemCode']}>
                        <AutoComplete
                          style={{ width: '100%' }}
                          options={itemData.map(item => ({ value: item.itemMasterCd }))}
                          placeholder="Enter item code"
                          filterOption={(inputValue, option) =>
                            option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                          }
                        />
                      </Form.Item>
                    </Col>
                    <Col span={6}>
                      <Form.Item {...restField} label="ITEM DESCRIPTION" name={[name, 'itemDescription']}>
                        <AutoComplete
                          style={{ width: '100%' }}
                          options={itemData.map(item => ({ value: item.itemMasterDesc }))}
                          placeholder="Enter item description"
                          filterOption={(inputValue, option) =>
                            option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                          }
                        />
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
                        />
                      </Form.Item>
                    </Col>

                    <Col span={6}>
                      <Form.Item {...restField} label=" QUANTITY" name={[name, 'receivedQuantity']}>
                        <Input />
                      </Form.Item>
                    </Col>


                    <Col span={5}>
                      <Form.Item {...restField} label="REMARK" name={[name, 'remark']}>
                        <Input />
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

        {/* Terms and Condition */}
        <Row gutter={24}>
          <Col span={12}>
            <h2>TERM AND CONDITION</h2>
            <Form.Item name="termsAndCondition">
              <TextArea rows={3} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <h2>NOTE</h2>
            <Form.Item name="termsAndCondition">
              <TextArea rows={3} />
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
              NAME & SIGNATURE :<Form><Input value={formData.firstName + " " + formData.lastName} /></Form>
            </div>
            <div className='goods-receive-note-signature'>
              DATE & TIME :<DatePicker defaultValue={dayjs()} format={dateFormat} style={{ width: '58%' }} />
            </div>
          </div>
          <div  >
            <div className='goods-receive-note-signature'>
              DEMANDED  BY
            </div>
            <div className='goods-receive-note-signature'>
              NAME & SIGNATURE :<Form><Input /></Form>
            </div>
            <div className='goods-receive-note-signature'>
              DATE & TIME :<DatePicker defaultValue={dayjs()} format={dateFormat} style={{ width: '58%' }} />
            </div>
          </div>
          <div >
            <div className='goods-receive-note-signature'>
              APPROVED BY
            </div>
            <div className='goods-receive-note-signature'>
              NAME & SIGNATURE :<Form><Input /></Form>
            </div>
            <div className='goods-receive-note-signature'>
              DATE & TIME :<DatePicker defaultValue={dayjs()} format={dateFormat} style={{ width: '58%' }} />
            </div>


          </div>

        </div>

      </Form>
      <div className='goods-receive-note-button-container'>

        <Form.Item >
          <Button type="primary" htmlType="save" style={{ width: '200px', margin: 16 }}>
            Save
          </Button>
        </Form.Item>

        <Form.Item >
          <Button type="primary" htmlType="submit" style={{ backgroundColor: '#4CAF50', borderColor: '#4CAF50', width: '200px', margin: 16 }}>
            Submit
          </Button>
        </Form.Item>
        <Form.Item >
          <Button type="primary" danger htmlType="save" style={{ width: '200px', margin: 16 }}>
            Print
          </Button>
        </Form.Item>

      </div>
    </div>
  );
};

export default DemandNoteForm;
