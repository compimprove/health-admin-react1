import { Layout, Menu } from 'antd';
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
import { UserContext } from '../context/UserContext';
import TrainingCreator from '../pages/TrainingCreator';
import MealCreator from '../pages/MealCreator';
import Home from '../pages/Home';
import StreamExercise from '../pages/StreamExercise';

const { Sider } = Layout;
const { SubMenu } = Menu;

export default class AppSiderBar extends React.Component {
  static contextType = UserContext;
  state = {
    collapsed: false,

  };
  defaultSelectedRoute = window.location.pathname;

  onCollapse = collapsed => {
    console.log("collapsed", collapsed);
    this.setState({ collapsed });
  };

  render() {
    const { collapsed } = this.state;
    const userData = this.context.userData;

    return (
      <Sider collapsible collapsed={collapsed} onCollapse={this.onCollapse}>
        <div className="logo" />
        <Menu theme="dark" defaultSelectedKeys={[this.defaultSelectedRoute]} mode="inline">
          <Menu.Item key={Home.routeName} icon={<PieChartOutlined />}>
            <Link to={Home.routeName}>Over view</Link>
          </Menu.Item>
          <Menu.Item key={TrainingCreator.routeName} icon={<DesktopOutlined />}>
            <Link to={TrainingCreator.routeName}>Training Creator</Link>
          </Menu.Item>
          <Menu.Item key={MealCreator.routeName} icon={<DesktopOutlined />}>
            <Link to={MealCreator.routeName}>Meal Creator</Link>
          </Menu.Item>
          <Menu.Item key={StreamExercise.routeName} icon={<DesktopOutlined />}>
            <Link to={StreamExercise.routeName}>Stream Exercise</Link>
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