import React from 'react';
import logo from './logo.svg';
import LoginPage from './pages/LoginPage';
import {
  BrowserRouter,
  Switch,
  Route,
  Link,
  useHistory
} from "react-router-dom";
import Home from './pages/Home';
import { connect } from 'react-redux';
import TrainingCreator from './pages/TrainingCreator';
import RouteDefine from './route_define';
import appRoutes from './pages/routes';
import MainLayout from './component/MainLayout';
import "./App.css";

function App({ isLogin }) {
  // if (!isLogin) {
  //   return <LoginPage />;
  // }
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/login" >
          <LoginPage />
        </Route>
        <Route>
          <MainLayout>{appRoutes()}</MainLayout>
        </Route>
      </Switch>
    </BrowserRouter>
  );
}

export default connect(state => ({ isLogin: state.isLogin }), null)(App);
