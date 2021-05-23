import { Layout, Menu, Breadcrumb } from 'antd';
import React from 'react';
import 'antd/dist/antd.css';
import MainLayout from '../component/MainLayout';

const { Header, Content, Footer } = Layout;
const { SubMenu } = Menu;

export default class Home extends React.Component {
  static routeName = "/";


  render() {
    return (
      <MainLayout title="Welcome">

      </MainLayout>
    );
  }
}