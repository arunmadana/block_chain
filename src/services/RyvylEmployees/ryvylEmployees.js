import api from "..";

export const getRyvylEmployeesList = (data) => {
  return api.post(`/profile/admin/list `, data);
};

export const getRyvylEmployeesCount = (data) => {
  return api.post(`/profile/admin/count`, data);
};

export const getRyvylPermissionsList = (data) => {
  return api.post(`/system-roles/all`, data);
};

export const deleteRyvylPermissionsList = (id) => {
  return api.delete(`/system-roles/${id}`);
};

export const addRyvylPermissionsRoles = (data) => {
  return api.post(`/system-roles`, data);
};

export const getDefaultRoles = (data) => {
  return api.get(`/system-roles/default`, data);
};

export const getAddRyvylPermissionsRoles = (id) => {
  return api.get(`/system-roles/${id}`);
};

export const updateRyvylPermissionsRoles = (id, data) => {
  return api.patch(`/system-roles/${id}`, data);
};

export const getRyvylPermissionsRolesActivityLogs = (data) => {
  return api.post(`/logs/activity`, data);
};

export const resendRyvylEmployee = (id, data) => {
  return api.post(`/register/admin/resend-invitation/${id}`, data);
};

export const resendRyvylEmployeeList = (id) => {
  return api.post(`/register/admin/resend-invitation-email/${id}`);
};

export const activateRyvylEmployee = (data) => {
  return api.patch(`/profile/admin/update-status`, data);
};

export const deActivateRyvylEmployee = (data) => {
  return api.patch(`/profile/admin/update-status`, data);
};

export const getAllRyvylDepartments = () => {
  return api.get(`/system-dept`);
};

export const addRyvylDepartments = (data) => {
  return api.post(`/system-dept`, data);
};

export const addNewEmployee = (payload) => {
  return api.post('/register/admin/send-invitation', payload);
};

export const deleteInvitation = (id) => {
  return api.delete(`/profile/admin/${id}`);
};

export const viewProfile = (data) => {
  return api.post(`/profile/admin`, data);
};

export const updateDeptAndPermission = (data) => {
  return api.patch(`/profile/admin/update`, data);
};
