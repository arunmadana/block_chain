import capitalizeFirstLetter from '../../helpers/capitalizeFirstLetter';
import api from '../../services';

export const getAllUsers = (
  userType,
  searchKey,
  { pageSize = 10, currentPage = 1 },
  { column = '', order = '' },
  data
) => {
  const standardParams = {
    searchKey: searchKey ? searchKey : undefined,
    pageSize: pageSize,
    pageNo: currentPage === 0 ? currentPage : currentPage - 1,
    status: userType ? userType : undefined,
    sortColumnName: column !== '' ? column : undefined,
    sortDirection: order !== '' ? order : undefined
  };
  const finalParams = Object.assign(standardParams, data);
  return api.post('/view/greenbox-users', finalParams);
};

export const getUsers = () => api.get('/view/greenbox-users');

export const changeStatus = (arr, status) => {
  let archiveArray;
  if (arr.id) {
    archiveArray = [
      {
        userId: arr.id,
        status: status,
        reason: ''
      }
    ];
  } else {
    archiveArray = arr.map((item) => ({
      userId: item.id.toString(),
      status: status,
      reason: ''
    }));
  }
  return api.patch('admin/updatestatus', archiveArray);
};

export const resendActivation = (id) => {
  return api.get(`/register/resend-activation-email/${id}`);
};

export const createUser = (data) => {
  const payload = {
    department: data.department.value,
    email: data.email,
    firstName: capitalizeFirstLetter(data.firstName.replace(/ /g, '')),
    lastName: capitalizeFirstLetter(data.lastName.replace(/ /g, '')),
    permission: capitalizeFirstLetter(data.permission),
    phoneNumberWithCountryCode: {
      countryCode: 'us',
      phoneNumber: data.phoneNumber.replace(/[^\d]/g, '')
    }
  };
  return api.post('/register/greenbox-user', payload);
};

export const login = (email, password) =>
  api.post('/admin/login', { email: email, password: password });

export const logoutUser = () => api.post('/admin/sign-out');

//Forgot Password
export const forgotPassword = (email) =>
  api.post(`/user/forgot-password?email=${email}`);

export const setPassword = (data) => {
  return api.post(`/admin/update-password`, data);
};

export const setPasswordEncrypt = (id, data) => {
  const payload = {
    code: id,
    key: data.key,
    payload: data.payload
  };
  return api.patch(`/register/encrypt/set-password`, payload);
};
export const userInfoApi = (data) => api.post(`/profile/admin`, data);

export const profileInformation = () => api.post('/admin/public/initialize');

export const validateAppOtp = (payload) => {
  return api.post('/admin/step-up/authy', payload);
};

export const RemoveImageAPI = (id) => {
  return api.delete(`/document/profileImage?tenantId=${id}`);
};

export const profileInfo = () => api.get('/profile/me');

//change password in Admin user details
export const changeAdminPassword = (requestToken, data) => {
  return api.patch('/admin/change-password', { ...data, requestToken });
};

export const updateUser = (id, data) => {
  const payload = {
    department: data.department.value,
    firstName: data.firstName,
    lastName: data.lastName,
    permission: capitalizeFirstLetter(data.permission)
  };

  return api.patch(`/admin/${id}/update`, payload);
};

//reset customer pass
export const resetCustomerPassword = (id) => {
  return api.post(`/user/${id}/reset-password`);
};

//unlock by email
export const unlockByEmail = (id) => {
  return api.post(`/user/${id}/unlock-by-email`);
};

//Permissions API

export const permissionGet = (portalName) => {
  return api.get(`/roles/${portalName}`);
};

//Permissions Check API

export const PermissionCheck = (id, type) => {
  return api.get(`/roles/permissions?roleId=${id}&portalType=${type}`);
};

//Permission Check Update API

export const PermissionUpdate = (data) => {
  return api.post(`/roles/permissions`, data);
};

export const GetDefaultPermission = (portalName) => {
  return api.get(`/roles/${portalName}/default`);
};

export const createNewRole = (portalName, permissionsArray, role) => {
  const payload = {
    permissionsResponse: permissionsArray,
    roleName: capitalizeFirstLetter(role)
  };
  return api.post(`/roles/${portalName}`, payload);
};

export const updateNewRole = (portalName, permissionsArray, role, roleId) => {
  const payload = {
    permissionsResponse: permissionsArray,
    roleId: roleId,
    roleName: capitalizeFirstLetter(role)
  };
  return api.patch(`/roles/${portalName}`, payload);
};

export const getCommissionData = (payload) => {
  return api.post(`/transactions/admin/commission-activity `, payload);
};

export const removeUser = (id) => {
  let archiveArray = [
    {
      userId: id,
      status: 'DeActivated',
      reason: 'This account has been deactivated.'
    }
  ];
  return api.patch('admin/updatestatus', archiveArray);
};

// get all permission roles
export const getAllPermissionRoles = () => {
  return api.post(`/system-roles/all`, {
    pageNo: 0,
    pageSize: 25,
    sortProperties: 'modifiedDate,id',
    sortDirection: 'DESC'
  });
};
