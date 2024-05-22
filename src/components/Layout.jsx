import React from "react";
import { Button, theme, Layout, Breadcrumb } from "antd";
import SAI_Logo from "./../assets/images/SAI_logo.svg";
import SideNav from "./SideNav";
import { Navigate, Outlet } from "react-router-dom";
import { Content } from "antd/es/layout/layout";

const { Header } = Layout;
const Template = () => {
  const Logout = () => {
    localStorage.removeItem("userCd");
    localStorage.removeItem("userType");
    localStorage.removeItem("userRoles");
    localStorage.removeItem("token");
    <Navigate to='/login' />
  window.location.reload();
  };
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const userCd = localStorage.getItem("userCd")

  if(!userCd){
    return <Navigate to="/login" />
  }

  console.log("UserCd: ", userCd)

  return (
    // <div
    //   style={{
    //     minHeight: "100vh",
    //   }}
    // >
    <>
    
      <Header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: colorBgContainer,
          padding: "2px",
          position: "sticky",
          top: "0",
          zIndex: 10
        }}
      >
        <img
          src={SAI_Logo}
          alt="sai"
          style={{
            width: "200px",
            padding: "0px 0px 2px 6px",
            display: "flex",
            alignItems: "center",
            backgroundColor: colorBgContainer,
            overflow: "hidden",
          }}
        />
        <Button type="primary" onClick={Logout}>
          Log Out
        </Button>
      </Header>
      <div style={{display: "flex"}} className="divv">
      <SideNav />
       <Layout style={{ padding: "0 24px 24px",  overflow: "hidden", flex: 1  }} className="layout">
        <Breadcrumb style={{ margin: "16px 0" }}>
          <Breadcrumb.Item>Home</Breadcrumb.Item>
          <Breadcrumb.Item>List</Breadcrumb.Item>
          <Breadcrumb.Item>App</Breadcrumb.Item>
        </Breadcrumb>
        <Content
          style={{ padding: 24, margin: 0, minHeight: 280, background: "#fff", overflow: "auto"}}
        >
        <Outlet />
        </Content>
      </Layout>
      </div>
      </>
  );
};
export default Template;
