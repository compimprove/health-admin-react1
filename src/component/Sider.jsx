import { Layout, Menu } from 'antd';
import {
  DesktopOutlined,
  UserOutlined,
} from '@ant-design/icons';
import React from 'react';
import 'antd/dist/antd.css';
import { Link } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import Rooms from '../pages/Rooms';
import MealOverview from '../pages/MealOverview';
import TrainingOverview from '../pages/TrainingOverview';
import TraineeOverview from '../pages/TraineeOverview';

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
        <div style={{ height: "60px" }}>

        </div>
        <Menu theme="dark" defaultSelectedKeys={[this.defaultSelectedRoute]} mode="inline">

          {/* <Menu.Item key={Home.routeName} icon={<PieChartOutlined />}>
            <Link to={Home.routeName}>Over view</Link>
          </Menu.Item> */}
          <Menu.Item key={TrainingOverview.routeName} icon={<DesktopOutlined />}>
            <Link to={TrainingOverview.routeName}>Quản lý các bài tập</Link>
          </Menu.Item>
          <Menu.Item key={MealOverview.routeName} icon={<DesktopOutlined />}>
            <Link to={MealOverview.routeName}>Quản lý dinh dưỡng</Link>
          </Menu.Item>
          <Menu.Item key={Rooms.routeName} icon={<DesktopOutlined />}>
            <Link to={Rooms.routeName}>Phòng tập trực tuyến</Link>
          </Menu.Item>
          <Menu.Item key="sub1" icon={<UserOutlined />} >
            <Link to={TraineeOverview.routeName}>Quản lý Học viên</Link>
          </Menu.Item>
          {/* <SubMenu key="sub2" icon={<TeamOutlined />} title="Team">
            <Menu.Item key="6">Team 1</Menu.Item>
            <Menu.Item key="8">Team 2</Menu.Item>
          </SubMenu>
          <Menu.Item key="9" icon={<FileOutlined />}>
            Files
            </Menu.Item> */}
        </Menu>
      </Sider>
    );
  }
}