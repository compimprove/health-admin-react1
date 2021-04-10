import axios from "axios";
import { LOGIN } from "../actionTypes";

const initialState = {};

export const login = async function (state = initialState, action) {
  let payload = action.payload;
  switch (action.type) {
    case LOGIN:
      const host = process.env.NEXT_PUBLIC_HOST;
      let response = await axios.post(host + "/auth/login",
        {
          email: payload.email,
          password: payload.password
        }
      )
      if (response.status == 200) {
        let token = response.data.token;
        sessionStorage.setItem("token",)
        console.log("login success with host", host, "values: ", payload, "response", response.data);
        payload.router.push("/");
        axios.get(host + "/user", { token }).then(response => {
          if (response.status == 200) {
            
          }
        })

      }
      break;
  }
}