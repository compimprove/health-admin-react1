import axios from "axios";
import React from "react";
import Home from "../pages/Home";
import LoginPage from "../pages/LoginPage";
import Url from "../service/url";

const buildAuthorizationHeader = function (token) {
  return {
    "Authorization": 'Bearer ' + token
  };
}

export const UserContext = React.createContext();

export class UserProvider extends React.Component {
  state = {
    token: null,
    axios: axios.create(),
    userData: ""
  };

  constructor(props) {
    super(props);
    let token = localStorage.getItem("token");
    console.log("token", token);
    if (token != null) {
      this.initUserData(token);
    } else {
      this._goLogin();
    }
    this.login = this.login.bind(this);
    this.isLogin = this.isLogin.bind(this);
  }

  async initUserData(token) {
    let response;
    try {
      response = await this.state.axios({
        method: "get",
        headers: {
          ...buildAuthorizationHeader(token)
        },
        url: Url.UserData
      })
    } catch (error) {
      console.log(error);
    }
    if (response && response.status == 200) {
      console.log(response.data);
      this.setState({
        token,
        userData: response.data
      })
    }
    else {
      this._goLogin();
      localStorage.removeItem("token");
    }
  }

  _goLogin() {
    console.log("Go login");
    if (window.location.pathname == LoginPage.routeName) {
      return;
    }
    window.location.pathname = LoginPage.routeName;
  }

  async login({ email, password }) {
    let response = await this.state.axios({
      method: "post",
      url: Url.Login,
      data: {
        email: email,
        password: password
      }
    });
    if (response.status == 200) {
      if (window.location.pathname == LoginPage.routeName) {
        window.location.pathname = Home.routeName;
      }
      let token = response.data.token;
      localStorage.setItem("token", token)
      console.log("login success: ", Url.Login, "values: ", { email, password }, "response", response.data);
      this.state.axios.defaults.headers["Authorization"] = 'Bearer ' + token;
      let res = await this.state.axios({
        method: "get",
        url: Url.UserData
      })
      if (res.status == 200) {
        this.setState({
          token,
          userData: res.data
        })
      }
      window.location.pathname = Home.routeName
    }
  }

  isLogin() {
    return this.state.token != null;
  }

  render() {
    let { state, login } = this;
    let userData = this.state.userData;
    return (
      <UserContext.Provider value={{ state, login, userData }}>
        {this.props.children}
      </UserContext.Provider>
    );
  }
}