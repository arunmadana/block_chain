import api from "..";

export const userLogin = (data: any) => {
  return api.post("/admin/login", data);
};

export const validateAppOtp = (payload: any) => {
  return api.post("/admin/step-up/authy", payload);
};

export const resendSmsOtp = () => {
  return api.post("/otp/step-up/phone/send");
};

export const logoutUser = () => api.post("/admin/sign-out");

export const phoneOtpStepup = (otp: any) => {
  const payload = {
    otp: otp,
  };
  return api.post("/admin/step-up/phone", payload);
};
