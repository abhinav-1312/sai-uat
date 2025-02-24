import React from "react";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Checkbox, Form, Input, Popover } from "antd";
import "./Login.css";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../redux/slice/authSlice";
import { fetchDepartments } from "../redux/slice/departmentSlice";
import { fetchEmployees } from "../redux/slice/employeeSlice";
import { fetchLocations } from "../redux/slice/locationSlice";
import { fetchLocators } from "../redux/slice/locatorSlice";
import { fetchUsers } from "../redux/slice/userSlice";
import { fetchVendors } from "../redux/slice/vendorSlice";
import { fetchOrganizations } from "../redux/slice/organizationSlice";
import { fetchUoms } from "../redux/slice/uomSlice";
import AuthPageLayout from "../components/AuthPageLayout";

const SignIn = () => {
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const handleLogin = async (values) => {
    try{
      await dispatch(login(values)).unwrap();
      navigate("/");
    }
    catch(error){}
  };


  return (
    <AuthPageLayout>
    <Form onFinish={handleLogin} className="login-form" layout="vertical" size="large">
      <Form.Item
        rules={[{ required: true, message: "Enter User Code" }]}
        label="User ID"
        name="userCd"
        >
        <Input
          prefix={<UserOutlined className="site-form-item-icon" />}
          placeholder="Enter Login ID"
          />
      </Form.Item>

      <br />
      <Form.Item
        rules={[{ required: true, message: "Enter valid password" }]}
        label="Password"
        name="password"
        >
        <Input.Password
          prefix={<LockOutlined className="site-form-item-icon" />}
          placeholder="Enter Password"
          />
      </Form.Item>
      <br />
      <div className="remember-change-combined">
      <Form.Item className="checkbox-container">
        <Form.Item name="remember" valuePropName="checked" >
          <Checkbox>Remember me</Checkbox>
        </Form.Item>
      </Form.Item>
      <Link to="/changePassword">Change Password</Link>
      </div>
      <br />
      <Form.Item>
        <Button type="primary" htmlType="submit" className="btnLogin">
          Sign in
        </Button>
        <br />
        <Popover
          content="Contact Admin for Registration"
          title="Register"
          trigger="click"
          className="popover-container"
          >
          <Button type="link">Register</Button>
        </Popover>
      </Form.Item>
    </Form>
    </AuthPageLayout>
  );
};

export default SignIn;
