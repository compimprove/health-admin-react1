import React, { useState } from "react";
import { Layout } from "antd";
import AppSiderBar from "./Sider";

const { Content } = Layout;

const MainLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);

  const toggle = () => {
    setCollapsed(!collapsed);
  };

  return (
    <Layout>
      <AppSiderBar />
      <Layout className="site-layout">
        {/* <Header collapsed={collapsed} toggle={toggle} /> */}
        <Content>{children}</Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
