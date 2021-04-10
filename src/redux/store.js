import { createStore } from "redux";
import { login } from './reducers/login';

const store = createStore(login);
export default store;