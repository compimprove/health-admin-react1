import React from 'react';
import LoginPage from './pages/LoginPage';
import {
  BrowserRouter,
  Switch,
  Route} from "react-router-dom";
import appRoutes from './pages/routes';
import MainLayout from './component/MainLayout';
import "./App.css";
import { UserContext } from './context/UserContext';

export default function App() {
  const { isLogin } = React.useContext(UserContext);
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/login" >
          <LoginPage />
        </Route>
        {isLogin() && < Route >
          <MainLayout>{appRoutes()}</MainLayout>
        </Route>}
      </Switch>
    </BrowserRouter >
  );
}
