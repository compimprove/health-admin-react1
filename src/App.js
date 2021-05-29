import React from 'react';
import LoginPage from './pages/LoginPage';
import {
  BrowserRouter,
  Switch,
  Route
} from "react-router-dom";
import AppRoutes from './pages/routes';
import "./App.css";
import { UserContext } from './context/UserContext';
import { Layout } from 'antd';
const { Content } = Layout;
import AppSiderBar from './component/Sider';
import TrainerRegisterPage from './pages/TrainerRegisterPage';

export default function App() {
  const { isLogin } = React.useContext(UserContext);
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/login" >
          <LoginPage />
        </Route>
        <Route path={TrainerRegisterPage.routeName} >
          <TrainerRegisterPage />
        </Route>
        {isLogin() && <Route >
          <Layout>
            <AppSiderBar />
            <Layout className="site-layout">
              <Content><AppRoutes /></Content>
            </Layout>
          </Layout>
        </Route>}
      </Switch>
    </BrowserRouter >
  );
}
