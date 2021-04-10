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

function App({ isLogin }) {
  // if (!isLogin) {
  //   return <LoginPage />;
  // }
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" >
          <Home />
        </Route>
        <Route path="/create-training" >
          <TrainingCreator />
        </Route>
        <Route path="/login" >
          <LoginPage />
        </Route>
      </Switch>
    </BrowserRouter>
  );
}

export default connect(state => ({ isLogin: state.isLogin }), null)(App);
