import React from 'react'
import { Form, Input, Button } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import SAI_Logo from "./../assets/images/SAI_logo.svg";
import { apiHeader } from '../utils/Functions';
import axios from 'axios';

const ChangePasswordForm = () => {
    const [form] = Form.useForm();

    const handleSubmit = async (values) => {
        if (values.newPassword !== values.confirmPassword) {
          form.setFields([
            {
              name: 'confirmPassword',
              errors: ['The new password and confirmation password do not match!'],
            },
          ]);
        } else {
          const {userCd, oldPassword, newPassword} = values

          const url = "https://uat-sai-app.azurewebsites.net/sai-inv-mgmt/master/changePassword"

          try{
            const token = localStorage.getItem("token")
            const {data} = await axios.post(url, {userCd, oldPassword, newPassword}, apiHeader("POST", token))
            console.log("Data: ", data)
          }catch(error){
            console.log("Error occured while changing password.", error)
            alert("Error occured while changing password.")
          }
        }
      };
    

  return (
    <Form
    className='login-container'
      form={form}
      name="change_password"
      onFinish={handleSubmit}
      initialValues={{ remember: true }}
    >
        <img src={SAI_Logo} alt="SAI LOGO" className="logo" style={{marginBottom: "2rem"}} />
      <Form.Item
      style={{width: "25%"}}
        name="userCd"
        rules={[{ required: true, message: 'Please input your User ID!' }]}
      >
        <Input prefix={<UserOutlined />} placeholder="User ID" />
      </Form.Item>
      <Form.Item
      style={{width: "25%"}}
        name="oldPassword"
        rules={[{ required: true, message: 'Please input your old password!' }]}
      >
        <Input.Password prefix={<LockOutlined />} placeholder="Old Password" />
      </Form.Item>
      <Form.Item
      style={{width: "25%"}}
        name="newPassword"
        rules={[{ required: true, message: 'Please input your new password!' }]}
      >
        <Input.Password prefix={<LockOutlined />} placeholder="New Password" />
      </Form.Item>
      <Form.Item
      style={{width: "25%"}}
        name="confirmPassword"
        dependencies={['newPassword']}
        rules={[
          { required: true, message: 'Please confirm your new password!' },
        ]}
      >
        <Input.Password prefix={<LockOutlined />} placeholder="Confirm New Password" />
      </Form.Item>
      <Form.Item style={{width: "25%"}}>
        <Button type="primary" htmlType="submit" style={{width: "100%"}}>
          Change Password
        </Button>
      </Form.Item>

      <Link to="/login"> Return to Login </Link>
    </Form>
  )
}

export default ChangePasswordForm
