import axios from "axios";
import { Buffer } from "buffer";
import Moment from "moment";
import uuid from "react-uuid";
import ENV from "../../EnvironmentVariables.json";
import { LocalStorageKeysEnum } from "../Enums/LocalStorageKeysEnum";
import store from "../Store";
import { logout } from "../Store/ducks/auth";
import { getStorage } from "./Storage";

const shouldEncrypt = (url: any) => {
  let encrypt = true;
  const whitelist = ["/admin/step-up/phone", "/admin/login", "/system-dept"];
  whitelist.forEach((_url) => {
    if (url.endsWith(_url)) {
      encrypt = false;
    }
  });
  return encrypt;
};

let expiredSession = false;
const skipEncryption = true;

const api = axios.create({
  baseURL:
    process.env.NODE_ENV === "development"
      ? `${ENV.serverURL}${ENV.apiURL}`
      : `${ENV.apiURL}`,
  headers: {
    "content-type": "application/json",
    "Accept-Language": "en-us",
    "Access-Control-Allow-Origin": "*",
    ...(skipEncryption && { SkipDecryption: "YES" }),
  },
  timeout: 30000,
});

api.interceptors.request.use(async (config) => {
  let token = "";
  if (
    getStorage(LocalStorageKeysEnum.stepupToken) == null ||
    getStorage(LocalStorageKeysEnum.stepupToken) === "undefined" ||
    getStorage(LocalStorageKeysEnum.stepupToken) === undefined ||
    getStorage(LocalStorageKeysEnum.stepupToken) == "null"
  ) {
    token = getStorage(LocalStorageKeysEnum.jwtToken) as string;
  } else {
    token = getStorage(LocalStorageKeysEnum.stepupToken) as string;
  }

  if (shouldSendToken(config.url)) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    config.headers.Authorization = undefined;
  }
  const uniqueId = uuid();
  config.headers["X-REQUESTID"] = uniqueId;

  if (skipEncryption) {
    return config;
  }

  if (!shouldEncrypt(config.url)) {
    return config;
  }

  // encrypting the request body
  if (
    config.method === "post" ||
    config.method === "put" ||
    config.method === "patch"
  ) {
    const payload = config.data;
    if (payload) {
      config.headers["content-type"] = "text/plain";
      const momentDate = Moment().utc();
      const day = momentDate.format("DDMMYYYY");
      const time = momentDate.format("HHmmss");
      const rawPayload = window.encrUtil.encr(
        day,
        Buffer.from(JSON.stringify(payload)).toString("base64"),
        time,
        `${uniqueId}`
      );
      config.data = rawPayload;
    }
  }

  return config;
});

api.interceptors.response.use(
  (response) => {
    expiredSession = false;
    return response;
  },
  (error) => {
    const errorCode = error?.response?.data?.error?.errorCode;
    if (shouldLogout(errorCode) && expiredSession === false) {
      expiredSession = true;
      store.dispatch(logout());
    }
    return Promise.reject(error);
  }
);

const shouldLogout = (errorCode: any) =>
  ["G000004", "G000006"].includes(errorCode);

const shouldSendToken = (url: any) => {
  let sendToken = true;
  let params = new URLSearchParams(url.split("?")[1]);
  let otp = params.get("otp");
  let whitelist = [
    "/otp/register/phone-otp/resend",
    "/otp/forgot-password/email/validate",
    "/otp/forgot-password/email/resend",
    "/otp/forgot-password/email/send",
    "/country/list",
    `/admin/register/create-password`,
    `/otp/register/phone-otp/validate`,
    `/otp/register/phone-otp/resend`,
    `/otp/register/phone-otp/send`,
    `/otp/register/activate`,
    "/admin/login",
    "/admin/update-password",
    "/otp/register/phone-otp/resend",
    "/otp/forgot-email/phone/send",
    `/otp/forgot-email/phone/validate?otp=${otp}`,
    "/admin/public/initialize",
    "/profile/download-url",
  ];
  whitelist.forEach((_url) => {
    if (url.endsWith(_url)) {
      sendToken = false;
    }
  });
  return sendToken;
};

export default api;
