import React from 'react'
import { Form, Input, Button, message } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthPageLayout from '../components/AuthPageLayout';

const ChangePasswordForm = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate()

    const handleSubmit = async (values) => {
        if (values.newPassword !== values.confirmPassword) {
          form.setFields([
            {
              name: 'confirmPassword',
              errors: ['The new password and confirmation password do not match!'],
            },
          ]);
        } 
        else if ((values.newPassword).length < 7){
          form.setFields([
            {
              name: 'newPassword',
              errors: ['The new password must contains atleast 7 characters!'],
            },
          ]);
        }
        else {
          const {userCd, oldPassword, newPassword} = values

          const url = "/master/changePassword"

          try{
            await axios.post(url, {userCd, oldPassword, newPassword})
            message.error("Password changed successfully.")
            navigate("/login")
          }catch(error){
            message.error("Error occured while changing password.")
          }
        }
      };
    

  return (
    <AuthPageLayout>
    <Form
      form={form}
      name="change_password"
      onFinish={handleSubmit}
      initialValues={{ remember: true }}
      size='large'
      layout='vertical'
    >
      <Form.Item
        name="userCd"
        label="User ID"
        rules={[{ required: true, message: 'Please input your User ID!' }]}
      >
        <Input prefix={<UserOutlined />} placeholder="SAI User" />
      </Form.Item>
      <br />
      <Form.Item
        name="oldPassword"
        label="Old Password"
        rules={[{ required: true, message: 'Please input your old password!' }]}
      >
        <Input.Password prefix={<LockOutlined />} placeholder="*****" />
      </Form.Item>
      <br />
      <Form.Item
        name="newPassword"
        label="New Password"
        rules={[{ required: true, message: 'Please input your new password!' }]}
      >
        <Input.Password prefix={<LockOutlined />} placeholder="*******" />
      </Form.Item>
      <br />
      <Form.Item
        name="confirmPassword"
        label="Confirm Password"
        dependencies={['newPassword']}
        rules={[
          { required: true, message: 'Please confirm your new password!' },
        ]}
      >
        <Input.Password prefix={<LockOutlined />} placeholder="*******" />
      </Form.Item >
      <br />
      <Form.Item>
        <Button type="primary" htmlType="submit" style={{width: "100%"}}>
          Change Password
        </Button>
      </Form.Item>
        <div style={{marginBottom: "0.3rem"}}></div>
      <Link to="/login"> Return to Login </Link>
    </Form>

    </AuthPageLayout>
  )
}

export default ChangePasswordForm
