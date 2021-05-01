import React, { Component } from 'react';
import { Layout } from 'antd';
const { Header } = Layout;
const { Content } = Layout;


const MainLayout = function ({ children, title }) {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Layout className="site-layout">
        <Header className="site-layout-background" style={{ color: "white" }}>{title}</Header>
        <Content>{children}</Content>
      </Layout>
    </Layout>);
}

export default MainLayout;