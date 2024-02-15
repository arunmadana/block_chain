import { applyMiddleware, combineReducers, createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";
import accountLockedModal from "./ducks/accountLockedModal";
import activateAccount from "./ducks/activateAccount";
import adminUserDetails from "./ducks/adminUserDetails";
import auth from "./ducks/auth";
import greenboxUserInfo from "./ducks/greenboxUserInfo";
import loginDetails from "./ducks/loginDetails";

const reducers = combineReducers({
  auth,
  activateAccount,
  greenboxUserInfo,
  accountLockedModal,
  adminUserDetails,
  loginDetails,
});

const rootReducer = (state, action) => {
  if (action.type === "greenbox-admin/auth/logout") {
    return reducers(undefined, action);
  }
  return reducers(state, action);
};

const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(thunk))
);

export default store;
