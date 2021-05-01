import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import Home from './Home';
import MealCreator from './MealCreator';
import MealOverview from './MealOverview';
import MealProgram from './MealProgram';
import Rooms from './Rooms';
import StreamExercise from './StreamExercise';
import ExerciseCreator from './ExerciseCreator';
import TrainingOverview from './TrainingOverview';

export const routes = [
  {
    path: ExerciseCreator.routeName,
    component: ExerciseCreator,
  },
  {
    path: TrainingOverview.routeName,
    component: TrainingOverview,
  },
  {
    path: MealCreator.routeName,
    component: MealCreator
  },
  {
    path: MealOverview.routeName,
    component: MealOverview
  },
  {
    path: MealProgram.routeName,
    component: MealProgram
  },
  {
    path: StreamExercise.routeName,
    component: StreamExercise
  },
  {
    path: Rooms.routeName,
    component: Rooms
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