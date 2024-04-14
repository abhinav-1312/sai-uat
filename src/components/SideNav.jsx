import React, { useState } from "react";
import { Layout, Menu, Breadcrumb } from "antd";
import {
  HomeOutlined,
  EnvironmentOutlined,
  AppstoreAddOutlined,
  SearchOutlined,
  UserOutlined,
  TeamOutlined,
  DollarOutlined,
  TransactionOutlined,
  AppstoreOutlined,
  TagsOutlined,
  CreditCardOutlined,
  AccountBookOutlined,
  IdcardOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import RoutesComponent from "../routers/Routes";

const { Content, Sider } = Layout;

const menuItems = [
  { key: "1", icon: <HomeOutlined />, label: "Dashboard", path: "/" },
  {
    key: "13",
    icon: <IdcardOutlined />,
    label: "Organizations",
    path: "/organization",
    children: [
      { key: "13.1", label: "Sub-Organizations", path: "/sub-organization" },
    ],
  },
  {
    key: "2",
    icon: <EnvironmentOutlined />,
    label: "Locations",
    path: "/location",
  },
  { key: "3", icon: <AppstoreAddOutlined />, label: "Items", path: "/items" },
  { key: "16", icon: <AccountBookOutlined />, label: "OHQ", path: "/ohq" },
  {
    key: "17",
    icon: <AccountBookOutlined />,
    label: "Transaction Summary",
    path: "/trnsummary",
  },
  { key: "4", icon: <SearchOutlined />, label: "Locators", path: "/locator" },
  {
    key: "18",
    icon: <AccountBookOutlined />,
    label: "Department",
    path: "/department",
  },
  { key: "5", icon: <UserOutlined />, label: "Users", path: "/user" },
  { key: "6", icon: <TeamOutlined />, label: "Employees", path: "/employee" },
  { key: "7", icon: <DollarOutlined />, label: "Taxes", path: "/tax" },
  { key: "9", icon: <AppstoreOutlined />, label: "UOM", path: "/uom" },
  { key: "10", icon: <TagsOutlined />, label: "Currencies", path: "/currency" },
  {
    key: "11",
    icon: <CreditCardOutlined />,
    label: "Vendors",
    path: "/vendor",
  },
  {
    key: "12",
    icon: <AccountBookOutlined />,
    label: "Quick Codes",
    path: "/quickcode",
  },

  {
    key: "14",
    label: "Issue-Return Process",
    path: "/transaction",
    children: [
      { key: "8.2", label: "Demand", path: "/trans/demand" },
      { key: "8.4", label: "Issue Note", path: "/trans/issue" },
      { key: "8.5", label: "Outward Gate Pass", path: "/trans/outward" },
      { key: "8.6", label: "Inward Gate Pass", path: "/trans/inward" },
      { key: "8.7", label: "Return Note", path: "/trans/return" },
      { key: "8.1", label: "GRN", path: "/trans/grn" },
    ],
  },
  {
    key: "15",
    label: "PURCHASE ORDER PROCESS",
    path: "/transaction",
    children: [
      { key: "8.2", label: "Demand", path: "/trans/demand" },
      { key: "8.6", label: "Inward Gate Pass", path: "/trans/inward" },
      { key: "8.8", label: "MIS", path: "/trans/inspection" },
      { key: "8.11", label: "Inspection Note", path: "/trans/inspectionNote" },
      { key: "8.9", label: "Acceptance Note", path: "/trans/acceptance" },
      { key: "8.1", label: "GRN", path: "/trans/grn" },
      { key: "8.10", label: "Rejection Note", path: "/trans/rejection" },
      { key: "8.5", label: "Outward Gate Pass", path: "/trans/outward" },
    ],
  },
  {
    key: "8",
    label: "INTER - ORG. PROCESS",
    path: "/transaction",
    children: [
      { key: "8.3", label: "IRD Demand", path: "/trans/ird-demand" },
      { key: "8.4", label: "Issue Note", path: "/trans/issue" },
      { key: "8.5", label: "Outward Gate Pass", path: "/trans/outward" },
      { key: "8.6", label: "Inward Gate Pass", path: "/trans/inward" },
      { key: "8.8", label: "Inspection Note", path: "/trans/inspectionNote" },
      { key: "8.9", label: "Acceptance Note", path: "/trans/acceptance" },
      { key: "8.1", label: "GRN", path: "/trans/grn" },
      { key: "8.10", label: "Rejection Note", path: "/trans/rejection" },
      { key: "8.7", label: "Return Note", path: "/trans/return" },
    ],
  },
  {
    key: "8",
    icon: <TransactionOutlined />,
    label: "Transactions",
    path: "/transaction",
    children: [
      { key: "8.2", label: "Demand", path: "/trans/demand" },
      { key: "8.4", label: "Issue Note", path: "/trans/issue" },
      { key: "8.5", label: "Outward Gate Pass", path: "/trans/outward" },
      { key: "8.6", label: "Inward Gate Pass", path: "/trans/inward" },
      { key: "8.7", label: "Return Note", path: "/trans/return" },
      { key: "8.1", label: "GRN", path: "/trans/grn" },
      { key: "8.3", label: "IRD Demand", path: "/trans/ird-demand" },
      { key: "8.8", label: "Inspection Report", path: "/trans/inspection" },
      { key: "8.9", label: "Acceptance Note", path: "/trans/acceptance" },
      { key: "8.10", label: "Rejection Note", path: "/trans/rejection" },
    ],
  },
  {
    key: "21",
    icon: <EnvironmentOutlined />,
    label: "ItemDemandSearch",
    path: "/itemsearch",
  },
];

const SideNav = () => {
  const [collapsed, setCollapsed] = useState(false);

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  const userRole = localStorage.getItem("userRoles");
  const filteredMenuItems = menuItems.filter((item) => {
    switch (userRole) {
      case "admin":
        return (
          item.key !== "13" &&
          item.key !== "2" &&
          item.key !== "5" &&
          item.key !== "4"
        );
      case "InventoryManager":
        // Only show items accessible to inventory managers
        return (
          item.key !== "2" &&
          item.key !== "13" &&
          item.key !== "5" &&
          item.key !== "6" &&
          item.key !== "18" &&
          item.key !== "7" &&
          item.key !== "10" &&
          // item.key !== "11" &&
          item.key !== "12" &&
          item.key !== "21"
        ); // Hide these menus
      case "QualityManager":
        return (
          item.key !== "2" &&
          item.key !== "13" &&
          item.key !== "3" &&
          item.key !== "16" &&
          item.key !== "17" &&
          item.key !== "4" &&
          item.key !== "5" &&
          item.key !== "6" &&
          item.key !== "7" &&
          item.key !== "9" &&
          item.key !== "10" &&
          item.key !== "11" &&
          item.key !== "12" &&
          item.key !== "21"
        );
      case "ItemAdmin":
        return (
          item.key !== "2" &&
          item.key !== "13" &&
          item.key !== "16" &&
          item.key !== "17" &&
          item.key !== "4" &&
          item.key !== "14" &&
          item.key !== "18" &&
          item.key !== "5" &&
          item.key !== "6" &&
          item.key !== "7" &&
          item.key !== "9" &&
          item.key !== "10" &&
          item.key !== "11" &&
          item.key !== "12" &&
          item.key !== "15" &&
          item.key !== "8" &&
          item.key !== "21"
        );
      case "VendorAdmin":
        return (
          item.key !== "2" &&
          item.key !== "13" &&
          item.key !== "16" &&
          item.key !== "17" &&
          item.key !== "4" &&
          item.key !== "14" &&
          item.key !== "18" &&
          item.key !== "5" &&
          item.key !== "6" &&
          item.key !== "7" &&
          item.key !== "9" &&
          item.key !== "10" &&
          item.key !== "3" &&
          item.key !== "12" &&
          item.key !== "15" &&
          item.key !== "8" &&
          item.key !== "21"
        );
      default:
        return true; // Show all items for other roles
    }
  });

  const renderSubMenu = (item) => (
    <Menu.SubMenu key={item.key} icon={item.icon} title={item.label}>
      {item.children.map((subItem) => (
        <Menu.Item key={subItem.key}>
          <Link to={subItem.path}>{subItem.label}</Link>
        </Menu.Item>
      ))}
    </Menu.SubMenu>
  );

  return (
    <Layout>
      <Sider
        width={220}
        collapsible
        collapsed={collapsed}
        onCollapse={toggleCollapse}
        style={{
          background: "#57cac3",
          color: "white",
          fontWeight: "bold",
        }}
      >
        <Menu
          mode="inline"
          defaultSelectedKeys={["1"]}
          style={{ background: "#57cac3", color: "white" }}
        >
          {filteredMenuItems.map((item) =>
            item.children ? (
              renderSubMenu(item)
            ) : (
              <Menu.Item key={item.key} icon={item.icon}>
                <Link to={item.path}>{item.label}</Link>
              </Menu.Item>
            )
          )}
        </Menu>
      </Sider>
      <Layout style={{ padding: "0 24px 24px" }}>
        <Breadcrumb style={{ margin: "16px 0" }}>
          <Breadcrumb.Item>Home</Breadcrumb.Item>
          <Breadcrumb.Item>List</Breadcrumb.Item>
          <Breadcrumb.Item>App</Breadcrumb.Item>
        </Breadcrumb>
        <Content
          style={{ padding: 24, margin: 0, minHeight: 280, background: "#fff" }}
        >
          <RoutesComponent />
        </Content>
      </Layout>
    </Layout>
  );
};

export default SideNav;
