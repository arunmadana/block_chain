import ENV from '../EnvironmentVariables.json';
import uuid from 'react-uuid';
import api from '../../services';

// Retrieve profile information
export const profileInfo = () => api.get('/profile/me');

/**
 * Get an agreement by type
 * 0 - Terms of service
 * 1 - Privacy Policy
 * @param {number} typeId
 * @returns
 */
export const getAgreement = (typeId) =>
  api.get(`/agreements/active/type`, { params: { agreementType: typeId } });

// Account limits
export const getAccountLimits = (userType) =>
  api.get(`/accountlimits/me/${userType}`);
// Save agreement as PDF
export const saveAgreement = (data) =>
  fetch(`${ENV.serverURL}${ENV.apiURL}/customer/save-pdf`, {
    method: 'POST',
    headers: {
      'Content-Type': ' application/json',
      'X-REQUESTID': uuid(),
      accept: '*/*',
      'Accept-Language': 'en-us'
    },
    body: `{"fileName": "${data.fileName}","textContent": "${data.textContent}"}`
  });

// Add address of a customer
export const setAddress = (data) => {
  const payload = {
    addressLine1: data.addressLine1,
    addressLine2: data.addressLine2,
    country: data.country.value,
    state: data.state.name,
    city: data.city,
    zipCode: data.zipCode,
    addressType: 0
  };

  return api.post('/profile/me/add-address', payload);
};

// update address info
export const updateAddress = (data) => {
  const payload = {
    addressLine1: data.addressLine1,
    addressLine2: data.addressLine2,
    state: data.state.name,
    city: data.city,
    zipCode: data.zipCode,
    country: data.country.value
  };

  return api.patch('/profile/me/update-address', payload);
};

// Set User Password
// export const setPassword = data => {
//   const payload = {
//     code: data.code,
//     password: data.password,
//   };
//   return api.post('/register/set-password', payload);
// };

export const setPassword = (id, data) => {
  const payload = {
    code: id,
    key: data.key,
    payload: data.payload
  };
  return api.patch(`/register/encrypt/set-password`, payload);
};

// Used to unlock user
export const unlock = (id) => api.patch(`/user/${id}/unlock`);

// Used to get user preferences (timezone and currency)
export const getPreferences = () => api.get('/profile/me/preferences');

// Used to update preferences
export const updatePreferences = (data) => {
  const payload = {
    localCurrency: data.localCurrency.value,
    timezone: data.timeZone.value,
    preferredAccount: data.preferredAccount.value
  };

  return api.post('/profile/me/preferences', payload);
};

// Get QRCode
export const getQRCode = (email) => api.post(`/otp/qr-code?email=${email}`);

// Decoder QR Code
export const decodeQRCode = (qrCode) =>
  api.get(`/customer/decodeQRCode?qrCode=${qrCode}`);

// Validate 2stepOTP
export const otpValidade = (email, otp, tokenRequired = false) => {
  const payload = { email, otp };

  const tokenPayload = {
    email,
    otp,
    tokenRequired
  };

  return api.post('/otp/otp/validate', tokenRequired ? tokenPayload : payload);
};
export const batchNowotpValidade = (email, otp, actionType) => {
  const payload = {
    email,
    otp,
    actionType
  };

  return api.post('/otp/otp/validate', payload);
};

// Forgot Password
export const forgotPassword = (email) =>
  api.post(`/otp/forgot-password/email/send`, { email: email });

export const changePassword = (id, data) =>
  api.patch('/user/encrypt/change-password', data, {
    params: { id }
  });

export const phoneOtpStepup = (otp) => {
  const payload = {
    otp: otp
  };
  return api.post('/admin/step-up/phone', payload);
};

/**
 * Type of document being used to do the verification.
 * type = driving_license (or) id_card
 *
 * @param {string} type
 * @returns
 */
export const getKycVerificationLink = (type) =>
  api.post('/profile/me/kyc-checks', null, { params: { type } });

export const getKycVerificationStatus = (referenceId) =>
  api.post(`/profile/me/kyc-checks/${referenceId}/status`);

export const RemoveImageAPI = (path) => {
  return api.delete(`/profile/me/removeImage?filename=${path}`);
};

export const profileAccounts = () => {
  return api.get('/profile/me/profile-accounts');
};

export const currentPhoneNumberEdit = (
  currentPhoneNumber,
  currentcountryCode,
  newPhoneNumber,
  newcountryCode
) => {
  const payload = {
    currentPhoneNumber,
    currentcountryCode,
    newPhoneNumber,
    newcountryCode
  };
  return api.post('/otp/update-phone/otp/send', payload);
};

export const newNumberEditOtp = (
  countryCode,
  isCurrentNumber = false,
  otp,
  phoneNumber,
  trackerId
) => {
  const payload = {
    countryCode,
    isCurrentNumber: isCurrentNumber,
    otp,
    phoneNumber,
    trackerId
  };
  return api.post('/otp/update-phone/otp/validate', payload);
};

//email update
export const currentEmailOtp = (existingEmail, newEmail) => {
  const payLoad = {
    existingEmail,
    newEmail
  };
  return api.post('/otp/update-email/otp/send', payLoad);
};

//new email otp
export const newEmailOtp = (isOldEmail, otp, trackerId) => {
  const payLoad = {
    isOldEmail: isOldEmail,
    otp,
    trackerId: trackerId.toString()
  };
  return api.post('/otp/update-email/otp-validate', payLoad);
};

//resend new phone old phone new email old email OTP

export const ResentOTP = (email, phone, trackerId) => {
  const payLoad = {
    isEmail: email,
    isNew: phone,
    trackerId: trackerId.toString()
  };
  return api.post('/otp/update/otp/resend', payLoad);
};
export const profileRemoveIdentity = (identityType) => {
  const params = {
    identityType
  };
  return api.delete('/profile/me/remove-identity', { params });
};
export const getProfileIdentity = () => api.get('/profile/identity');
export const profileUploadIdentity = (data) =>
  api.post('/profile/me/upload-identity', data);

//update all features in preferences/controls
export const updateAllFeatureControls = (data) => {
  // const payload = data;
  return api.post('/feature/controls/customer', data);
};

//Websocket
export const getUserConfig = () => api.post('/user/start', {});
