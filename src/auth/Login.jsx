import React, { useState } from "react";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Checkbox, Form, Input, Typography, Popover } from "antd";
import axios from "axios";
import "./Login.css";
import { Link, Navigate, useNavigate } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import SAI_Logo from "./../assets/images/SAI_logo.svg";
import { useUser } from "../context/UserContext";
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

const SignIn = () => {
  // const [userCd, setUserCd] = useState("");
  // const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate()

  const dispatch = useDispatch()

  const handleLogin = async (values) => {
    try{
      await dispatch(login(values)).unwrap()
      navigate("/")
      dispatch(fetchDepartments())
    dispatch(fetchEmployees())
    dispatch(fetchLocations())
    dispatch(fetchLocators())
    dispatch(fetchUsers())
    dispatch(fetchVendors())
    dispatch(fetchOrganizations())
    dispatch(fetchUoms())

    }
    catch(error){
      console.log("Error on login.", error)
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div className="login-container">
      <img src={SAI_Logo} alt="SAI LOGO" className="logo" />
      <Form onFinish={handleLogin} onFinishFailed={onFinishFailed}>
        <Typography.Title>Sign In</Typography.Title>
        {error && <div style={{ color: "red" }}>{error}</div>}
        <Form.Item
          rules={[
            {
              required: true,
              message: "Enter User Code",
            },
          ]}
          label="Login Id"
          name="userCd"
        >
          <Input
            prefix={<UserOutlined className="site-form-item-icon" />}
            placeholder="Enter Login Id"
            // value={userCd}
            // onChange={(e) => setUserCd(e.target.value)}
          />
        </Form.Item>
        <Form.Item
          rules={[
            {
              required: true,
              message: "Enter valid password",
            },
          ]}
          label="Password"
          name="password"
        >
          <Input.Password
            prefix={<LockOutlined className="site-form-item-icon" />}
            placeholder="Enter Password"
            // value={password}
            // onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Item>
        <Form.Item>
          <Form.Item name="remember" valuePropName="checked" noStyle>
            <Checkbox>Remember me</Checkbox>
          </Form.Item>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" className="btnLogin">
            Sign In
          </Button>
          <br />
          Or
          <Popover
            content="Contact Admin for Registration"
            title="Resigter"
            trigger="click"
          >
            <a> Register</a>
          </Popover>
        </Form.Item>
      </Form>

      <Link to="/changePassword"> Change Password </Link>
    </div>
  );
};

export default SignIn;
