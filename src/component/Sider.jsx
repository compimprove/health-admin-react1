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
import { routes } from '../pages/routes';


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

  filterMenuRoutes(userRole) {
    return routes.filter((element) => element.role && element.role.indexOf(userRole) !== -1);
  }

  render() {
    const { collapsed } = this.state;
    const userData = this.context.userData;
    let routes = [];
    if (userData != null)
      routes = this.filterMenuRoutes(userData.role);

    return (
      <Sider collapsible collapsed={collapsed} onCollapse={this.onCollapse}>
        <div style={{ height: "60px" }}>
        </div>
        <Menu theme="dark" defaultSelectedKeys={[this.defaultSelectedRoute]} mode="inline">
          {routes.map(route => {
            let icon = route.icon || <DesktopOutlined />
            let menuName = route.menuName || "Menu"
            return (
              <Menu.Item key={route.path} icon={icon}>
                <Link to={route.path}>{menuName}</Link>
              </Menu.Item>);
          })}
        </Menu>
      </Sider>
    );
  }
}