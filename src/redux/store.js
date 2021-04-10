import { combineReducers } from "redux";
import { createStore } from "redux";
import { login } from './reducers/login';

class InitialStore {
  _user = null;
  _token = null;

  constructor() {
    this.token = localStorage.getItem("token");
    console.log("InitialStore", this);
  }

  get isLogin() {
    return this._token != null;
  }

  get token() {
    return this._token;
  };
  set token(value) {
    this._token = value;
  };
  get user() {
    return this._user;
  };
  set user(value) {
    this._user = value;
  };
}

const store = createStore(login, new InitialStore());
export default store;