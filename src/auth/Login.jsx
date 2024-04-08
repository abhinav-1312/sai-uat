import React, { useState } from "react";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Checkbox, Form, Input, Typography, Popover } from "antd";
import axios from "axios";
import "./Login.css";
import { Navigate } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import SAI_Logo from "./../assets/images/SAI_logo.svg";

const SignIn = () => {
  const [userCd, setUserCd] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async (values) => {
    try {
      const response = await axios.post(
        "https://uat-sai-app.azurewebsites.net/sai-inv-mgmt/login/authenticate",
        {
          userCd: values.userCd,
          password: values.password,
        }
      );

      
      const { userCd, userType } = response.data.responseData.userDetails;
      const { token } = response.data.responseData;
      
      // Store user details in local storage
      // localStorage.setItem(response)
      localStorage.setItem("userCd", userCd);
      localStorage.setItem("userType", userType);
      localStorage.setItem("password", values.password);
      localStorage.setItem("token", token);

      setIsLoggedIn(true);
      console.log(isLoggedIn);

      if (userType === "11") {
        const userRoles = "admin";
        localStorage.setItem("userRoles", userRoles);
        localStorage.setItem("userType", "admin");
      }
      if (userType === "12") {
        const userRoles = "InventoryManager";
        localStorage.setItem("userRoles", userRoles);
        localStorage.setItem("userType", "InventoryManager");
      }
      if (userType === "13") {
        const userRoles = "QualityManager";
        localStorage.setItem("userRoles", userRoles);
        localStorage.setItem("userType", "QualityManager");
      }
      if (userType === "14") {
        const userRoles = "ItemAdmin";
        localStorage.setItem("userRoles", userRoles);
        localStorage.setItem("userType", "ItemAdmin");
      }
      if (userType === "15") {
        const userRoles = "VendorAdmin";
        localStorage.setItem("userRoles", userRoles);
        localStorage.setItem("userType", "VendorAdmin");
      }
      if (userType === "99") {
        const userRoles = "SuperAdmin";
        localStorage.setItem("userRoles", userRoles);
        localStorage.setItem("userType", "SuperAdmin");
      }

      window.location.reload();
    } catch (error) {
      console.log(error);
      setError("Invalid User Code or Password");
    }
  };

  if (isLoggedIn) {
    return <Navigate to="/" replace />;
  }
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
    </div>
  );
};

export default SignIn;
