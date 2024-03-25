import React from "react";
import { Button, Layout, theme } from "antd";
import SAI_Logo from "./../assets/images/SAI_logo.svg";
import SideNav from "./SideNav";

const { Header } = Layout;
const App = () => {
  const Logout = () => {
    localStorage.removeItem("userCd");
    localStorage.removeItem("userType");
    localStorage.removeItem("userRoles");
    window.location.reload();
  };
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  return (
    <Layout
      style={{
        minHeight: "100vh",
      }}
    >
      <Header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: colorBgContainer,
          padding: "2px",
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
      <SideNav />
    </Layout>
  );
};
export default App;
