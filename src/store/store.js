import { createStore } from "redux";
import { loginReducer } from "./reducers";

const store = createStore(loginReducer)

export default store