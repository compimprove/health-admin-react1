const host = process.env.REACT_APP_HOST;
const Url = {
  Websocket: host + "/websocket",
  Login: host + "/auth/login",
  UserData: host + "/user",
  Room: host + "/room",
  TrainerRoom: host + "/room/trainer"
};
export default Url;