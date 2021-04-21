import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import Home from './Home';
import MealCreator from './MealCreator';
import StreamExercise from './StreamExercise';
import TrainingCreator from './TrainingCreator';

export const routes = [
  {
    path: TrainingCreator.routeName,
    component: TrainingCreator,
    navigationName: ""
  },
  {
    path: MealCreator.routeName,
    component: MealCreator
  },
  {
    path: StreamExercise.routeName,
    component: StreamExercise
  },
  {
    path: Home.routeName,
    component: Home
  },

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
    <Redirect to='/not-found' />
  </Switch>
);