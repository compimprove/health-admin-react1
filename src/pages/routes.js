import React from 'react';
import {Switch, Route, Redirect} from 'react-router-dom';
import Home from './Home';
import MealCreator from './MealCreator';
import MealOverview from './MealOverview';
import MealProgram from './MealProgram';
import Rooms from './Rooms';
import StreamExercise from './StreamExercise';
import ExerciseCreator from './ExerciseCreator';
import TrainingOverview from './TrainingOverview';
import TrainingProgramCreator from './TrainingProgramCreator';
import TraineeOverview from './TraineeOverview';
import TraineeManagement from './TraineeManagement';
import {
  DesktopOutlined,
  UserOutlined,
} from '@ant-design/icons';
import UserData from '../models/User';
import UserManagement from './UserManagement';
import TrainerRegisterPage from './TrainerRegisterPage';
import TrainerHomePage from './TrainerHomePage';
import RoomHistory from "./RoomHistory";
import AdminHomePage from "./AdminHomePage";


export const routes = [
  // {
  //   path: AdminHomePage.routeName,
  //   component: AdminHomePage,
  //   menuName: "Trang chủ",
  //   icon: <UserOutlined/>,
  //   role: [UserData.Role.Admin]
  // },
  {
    path: TrainerHomePage.routeName,
    component: TrainerHomePage,
    menuName: "Trang chủ",
    icon: <UserOutlined/>,
    role: [UserData.Role.Trainer]
  },
  {
    path: UserManagement.routeName,
    component: UserManagement,
    menuName: "Quản lý User",
    icon: <UserOutlined/>,
    role: [UserData.Role.Admin]
  },
  {
    path: Rooms.routeName,
    component: Rooms,
    menuName: "Phòng tập trực tuyến",
    icon: <DesktopOutlined/>,
    role: [UserData.Role.User, UserData.Role.Trainer]
  },
  {
    path: RoomHistory.routeName,
    component: RoomHistory,
    menuName: "Lịch sử phòng tập",
    icon: <UserOutlined/>,
    role: [UserData.Role.Trainer, UserData.Role.User]
  },
  {
    path: MealOverview.routeName,
    component: MealOverview,
    menuName: "Quản lý dinh dưỡng",
    icon: <DesktopOutlined/>,
    role: [UserData.Role.Trainer]
  },
  {
    path: TraineeOverview.routeName,
    component: TraineeOverview,
    menuName: "Quản lý Học viên",
    icon: <UserOutlined/>,
    role: [UserData.Role.Trainer]
  },
  {
    path: TrainingOverview.routeName,
    component: TrainingOverview,
    menuName: "Quản lý các bài tập",
    icon: <DesktopOutlined/>,
    role: [UserData.Role.Trainer]
  },
  {
    path: TraineeManagement.routeName,
    component: TraineeManagement,
  },
  {
    path: ExerciseCreator.routeName,
    component: ExerciseCreator,
  },
  {
    path: TrainingProgramCreator.routeName,
    component: TrainingProgramCreator,
  },
  {
    path: MealCreator.routeName,
    component: MealCreator
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
    path: Home.routeName,
    component: Home
  },

];

class AppRoutes extends React.Component {
  render() {
    return (
      <Switch>
        {routes.map(({path, exact = false, component: Component, ...rest}) => {
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
        <Redirect to='/not-found'/>
      </Switch>
    )
  }
}

export default AppRoutes;