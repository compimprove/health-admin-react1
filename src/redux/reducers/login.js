import axios from "axios";
import { useHistory } from "react-router";
import { LOGIN } from "../actionTypes";
const initialState = {};

export const login = async function (state = initialState, action) {
  let payload = action.payload;
  switch (action.type) {
    case LOGIN:
      const host = process.env.REACT_APP_HOST;
      let response = await axios({
        method: "post",
        url: host + "/auth/login",
        data: {
          email: payload.email,
          password: payload.password
        }
      });
      if (response.status == 200) {
        let token = response.data.token;
        localStorage.setItem("token", token)
        console.log("login success with host", host, "values: ", payload, "response", response.data);
        payload.history.push("/");
        axios.defaults.headers["Authorization"] = 'Bearer ' + token;
        axios({
          method: "get",
          url: host + "/user"
        }).then(response => {
          if (response.status == 200) {

          }
        })
      }
      break;
  }
}