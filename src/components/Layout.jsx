import React from "react";
import { Button, theme, Layout, Breadcrumb } from "antd";
import SAI_Logo from "./../assets/images/SAI_logo.svg";
import SideNav from "./SideNav";
import { Outlet, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { userLogout } from "../redux/slice/authSlice";
import { clearDepartment } from "../redux/slice/departmentSlice";
import { clearEmployee } from "../redux/slice/employeeSlice";
import { clearItem } from "../redux/slice/itemSlice";
import { clearLocation } from "../redux/slice/locationSlice";
import { clearLocator } from "../redux/slice/locatorSlice";
import { clearOrganization } from "../redux/slice/organizationSlice";
import { clearUom } from "../redux/slice/uomSlice";
import { clearUser } from "../redux/slice/userSlice";
import { clearVendor } from "../redux/slice/vendorSlice";
import { clearOrgMaster } from "../redux/slice/orgMasterSlice";
// import Sider from "antd/es/layout/Sider";


const { Header, Content } = Layout;
const Template = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const Logout = () => {
    // localStorage.removeItem("userCd");
    // localStorage.removeItem("userType");
    // localStorage.removeItem("userRoles");
    // localStorage.removeItem("token");
    // // navigate('/login', { replace: true });
    // <Navigate to='/login' replace/>
    // console.log("Navigate called")
    // window.location.reload();
    dispatch(userLogout())
    dispatch(clearDepartment())
    dispatch(clearEmployee())
    dispatch(clearItem())
    dispatch(clearLocation())
    dispatch(clearLocator())
    dispatch(clearOrganization())
    dispatch(clearUom())
    dispatch(clearUser())
    dispatch(clearVendor())
    dispatch(clearOrgMaster())
    navigate('/login')
  };
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  // const isLoggedIn = useSelector((state) => {
  //   console.log("Statas", state)
  //   return state.auth.token !== null
  // })

  // if(!isLoggedIn){
  //   return <Navigate to="/login" replace />
  // }

  return (
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
      <div style={{display: "flex", minHeight: "100vh"}} className="divv">
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

      {/* <Layout hasSider>
        <Sider style={siderStyle}>
          <SideNav />
        </Sider>
      </Layout> */}
      </>
  );
};
export default Template;
