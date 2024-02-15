import api from "..";

export const getPermissionsList = (data: any) => {
  return api.post(`/system-roles/all`, data);
};

export const getAddPermissionsRoles = (id: any) => {
  return api.get(`/system-roles/${id}`);
};

export const getPermissionsRolesActivityLogs = (data: any) => {
  return api.post(`/logs/activity`, data);
};

export const updatePermissionsRoles = (id: number, data: object) => {
  return api.patch(`/system-roles/${id}`, data);
};

export const addPermissionsRoles = (data: object) => {
  return api.post(`/system-roles`, data);
};

export const getDefaultRoles = (data: any) => {
  return api.get(`/system-roles/default`, data);
};

export const getEmployeesList = (data: any) => {
  return api.post(`/profile/admin/list `, data);
};

export const viewProfile = (data: any) => {
  return api.post(`/profile/admin`, data);
};

export const getAllDepartments = () => {
  return api.get(`/system-dept`);
};

export const addDepartments = (data: any) => {
  return api.post(`/system-dept`, data);
};

export const addNewEmployee = (payload: any) => {
  return api.post("/register/admin/send-invitation", payload);
};

export const deletePermissionsList = (id: number) => {
  return api.delete(`/system-roles/${id}`);
};

export const resendEmployeeList = (id: number) => {
  return api.post(`/register/admin/resend-invitation-email/${id}`);
};

export const activateEmployee = (data: any) => {
  return api.patch(`/profile/admin/update-status`, data);
};

export const deActivateEmployee = (data: any) => {
  return api.patch(`/profile/admin/update-status`, data);
};
