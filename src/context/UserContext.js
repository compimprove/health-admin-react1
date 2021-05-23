import axios, { AxiosRequestConfig } from "axios";
import React from "react";
import UserData from "../models/User";
import Home from "../pages/Home";
import LoginPage from "../pages/LoginPage";
import Url from "../service/url";
import {
  StatusCodes,
} from 'http-status-codes';


const tokenLength = 20 * 1000; // milliseconds
export const UserContext = React.createContext();

export class UserProvider extends React.Component {
  state = {
    token: null,
    userData: null
  };
  axios = axios.create();

  constructor(props) {
    super(props);
    let token = localStorage.getItem("token");
    console.log("token", token);
    if (token != null) {
      this.axios.defaults.headers["Authorization"] = "Bearer " + token;
      this.initUserData(token);
    } else {
      this._goLogin();
    }
    this.login = this.login.bind(this);
  }

  async initUserData(token) {
    let response;
    try {
      response = await this.axios({
        method: "get",
        url: Url.UserData
      })
    } catch (error) {
      console.log(error);
    }
    if (response && response.status == 200) {
      console.log(response.data);
      this.setState({
        token,
        userData: new UserData(response.data)
      });
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
    let response = await this.axios({
      method: "post",
      url: Url.Login,
      data: {
        email: email,
        password: password
      }
    });
    if (response.status == 200) {
      let token = response.data.token;
      localStorage.setItem("token", token)
      console.log("login success: ", Url.Login, "values: ", { email, password }, "response", response.data);
      this.axios.defaults.headers["Authorization"] = 'Bearer ' + token;
      let res = await this.axios({
        method: "get",
        url: Url.UserData
      })
      if (res.status == 200) {
        let userData = new UserData(res.data)
        this.setState({
          token,
          userData
        });
        console.log(userData.role);

        switch (userData.role) {
          case UserData.Role.Admin:
            window.location.pathname = "/user-management";
            break;
          case UserData.Role.Trainer:
            window.location.pathname = "/trainee-overview";
            break;
          case UserData.Role.User:
            window.location.pathname = "/stream-exercise/room";
            break;
        }

      }

    }
  }

  isLogin = () => {
    return this.state.token != null;
  }
  /**
   * @param {AxiosRequestConfig} config
   */
  axiosCall = async (config) => {
    try {
      let response = await this.axios(config);
      switch (response.status) {
        case StatusCodes.OK:
          console.log("axios: ", config.url)
          console.log("receiveData", response.data);
          return response;
        case StatusCodes.UNAUTHORIZED:
          this._goLogin();
          return;
        default:
          console.error("Error response", response.status);
          return response;
      }
    } catch (error) {
      console.error(error);
      // this._goLogin();
      return {
        status: StatusCodes.INTERNAL_SERVER_ERROR
      }
    }
  }

  componentWillUnmount() {
  }

  render() {
    let { state, login, isLogin } = this;
    let userData = this.state.userData;
    let axios = this.axiosCall;
    return (
      <UserContext.Provider value={{ axios, state, login, isLogin, userData }}>
        {this.props.children}
      </UserContext.Provider>
    );
  }
}