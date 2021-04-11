import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import RouteDefine from '../route_define';
import Home from './Home';
import LoginPage from './LoginPage';
import TrainingCreator from './TrainingCreator';

export const routes = [
  {
    path: RouteDefine.TrainingCreator,
    component: TrainingCreator,
  },
  {
    path: RouteDefine.Home,
    component: Home
  }
];

export default () => (
  <Switch>
    {routes.map(({ path, exact = false, component: Component, ...rest }) => {
      return (
        <Route
          key={path}
          exact={exact}
          path={path}
          component={Component}
          {...rest}
        />
      );
    })}
    <Redirect to='/' />
  </Switch>
);