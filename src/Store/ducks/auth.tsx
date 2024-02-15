import { LocalStorageKeysEnum } from "../../Enums/LocalStorageKeysEnum";
import { logoutUser } from "../../services/Login/Login";
import { clearStorage, getStorage, setStorage } from "../../services/Storage";

//actions
const LOGIN = "greenbox-admin/auth/login";
const LOGOUT = "greenbox-admin/auth/logout";
const SET_AUTH = "greenbox-admin/auth/SET_AUTH";
const SET_UN_AUTH = "greenbox-admin/auth/SET_UN_AUTH";
const AUTH_INFO = "greenbox-admin/auth/AUTH_INFO";

//initial state
const user = JSON.parse(getStorage("user"));
const initialState = {
  token: getStorage(LocalStorageKeysEnum.jwtToken),
  isAuthed: getStorage("isAuthed") || false,
  isLogged: getStorage("isAuthed") || false,
  userPhoneNumber: user?.phoneNumber || null,
  stepupToken: getStorage(LocalStorageKeysEnum.stepupToken) ?? null,
  loginPassword: "",
};

//reducer
export default function authReducer(state = initialState, { type, payload }) {
  switch (type) {
    case LOGIN:
      return { ...state, isAuthed: false, isLogged: true, ...payload };
    case SET_AUTH:
      return { ...state, isAuthed: true, isLogged: true, ...payload };
    case SET_UN_AUTH:
      return {
        ...state,
        isAuthed: false,
        isLogged: false,
      };
    case LOGOUT:
      return { token: null, isAuthed: false, userId: null, userEmail: null };
    case AUTH_INFO:
      return {
        ...state,
        ...payload,
        lastUpdated: new Date(),
      };
    default:
      return state;
  }
}

//action creators
export const login = (data) => {
  const user = {
    userId: data.userId,
    email: data.email,
    phoneNumber: data.phoneNumber,
  };
  setStorage("id", data.userId);
  // setStorage("token", data.jwtToken);
  setStorage("user", JSON.stringify(user));
  return {
    type: LOGIN,
    payload: user,
  };
};

export const setAuth = () => {
  setStorage("isAuthed", true);
  return {
    type: SET_AUTH,
  };
};

export const logout = () => (dispatch) => {
  logoutUser()
    .then(() => {
      dispatch({ type: SET_UN_AUTH });
      dispatch({ type: LOGOUT });
    })
    .catch(() => {
      dispatch({ type: SET_UN_AUTH });
      dispatch({ type: LOGOUT });
    })
    .finally(() => {
      clearStorage(LocalStorageKeysEnum.stepupToken);
    });
  clearStorage("token");
  clearStorage("user");
  clearStorage("isAuthed");
  clearStorage("id");
  clearStorage(LocalStorageKeysEnum.authorities);
  clearStorage("isAuthorized");
  clearStorage("userIdLogin");
  clearStorage("loginEmail");
  clearStorage("loginPassword");
  clearStorage("requestToken");
  clearStorage("loginPhone");
  clearStorage("businessDetails");
  return {
    type: LOGOUT,
  };
};

export const storeAuthInfo = (payload) => ({ type: AUTH_INFO, payload });
