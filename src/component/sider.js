import { Layout, Menu, Breadcrumb } from 'antd';
import {
  DesktopOutlined,
  PieChartOutlined,
  FileOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import React from 'react';
import 'antd/dist/antd.css';
import { Link } from 'react-router-dom';
import RouteDefine from '../route_define';

const { Sider } = Layout;
const { SubMenu } = Menu;

export default class AppSiderBar extends React.Component {
  state = {
    collapsed: false,
  };

  onCollapse = collapsed => {
    console.log(collapsed);
    this.setState({ collapsed });
  };

  render() {
    const { collapsed } = this.state;
    const defaultRoute = this.props.defaultRoute || RouteDefine.Home;
    return (
      <Sider collapsible collapsed={collapsed} onCollapse={this.onCollapse}>
        <div className="logo" />
        <Menu theme="dark" defaultSelectedKeys={[defaultRoute]} mode="inline">
          <Menu.Item key={RouteDefine.Home} icon={<PieChartOutlined />}>
            <Link to={RouteDefine.Home}>Over view</Link>
          </Menu.Item>
          <Menu.Item key={RouteDefine.LoginPage} icon={<DesktopOutlined />}>
            <Link to={RouteDefine.LoginPage}>Login</Link>
          </Menu.Item>
          <Menu.Item key={RouteDefine.TrainingCreator} icon={<DesktopOutlined />}>
            <Link to={RouteDefine.TrainingCreator}>Training Creator</Link>
          </Menu.Item>
          <SubMenu key="sub1" icon={<UserOutlined />} title="User">
            <Menu.Item key="3">Tom</Menu.Item>
            <Menu.Item key="4">Bill</Menu.Item>
            <Menu.Item key="5">Alex</Menu.Item>
          </SubMenu>
          <SubMenu key="sub2" icon={<TeamOutlined />} title="Team">
            <Menu.Item key="6">Team 1</Menu.Item>
            <Menu.Item key="8">Team 2</Menu.Item>
          </SubMenu>
          <Menu.Item key="9" icon={<FileOutlined />}>
            Files
            </Menu.Item>
        </Menu>
      </Sider>
    );
  }
}