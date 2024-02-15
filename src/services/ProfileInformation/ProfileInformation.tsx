import api from "..";

export const profileInformation = () => api.post("/admin/public/initialize");

export const userInfoApi = (data: any) => api.post(`/profile/admin`, data);
