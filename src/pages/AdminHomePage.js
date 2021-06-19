import React, {Component} from 'react';
import MainLayout from "../component/MainLayout";
import {UserContext} from "../context/UserContext";
import Url from "../service/url";
import UserData from "../models/User";

class AdminHomePage extends Component {
  static routeName = "/admin-home-page";
  static contextType = UserContext;

  constructor(props) {
    super(props);
    this.state = {
      users: []
    }
  }

  componentDidMount() {
    this.getUsersData();
  }

  getUsersData = async () => {
    let res = await this.context.axios({
      url: Url.AdminUser
    })
    let users = res.data;
    let roles = Object.values(UserData.Role);
    users.sort((user1, user2) => {
      return roles.indexOf(user1.role) - roles.indexOf(user2.role);
    })
    this.setState({ users });
  }

  render() {
    return (
      <MainLayout title="Trang chủ">

      </MainLayout>
    );
  }
}

export default AdminHomePage;