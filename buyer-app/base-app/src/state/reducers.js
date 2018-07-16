import { combineReducers } from "redux";
import balance from "./balance/reducers";
import notaries from "./notaries/reducers";
import notifications from "./notifications/reducers";


export default combineReducers({
  balance,
  notaries,
  notifications
});
