import api from "..";

export const getAllContacts = (businessId: any) => {
  return api.get(`/business/contacts/${businessId}`);
};

export const removeContact = (data: any) => {
  return api.delete("/business/contact", { data });
};

export const addContact = (payload: any) => {
  return api.post("/business/add-contact", payload);
};

export const newContact = (payload: any) => {
  return api.post("/business/new-contact", payload);
};

export const updateContact = (businessId: any, payload: any) => {
  return api.patch(`/business/contact/${businessId}`, payload);
};

export const getPhoneCountryList = (pcmType: any) => {
  return api.get("/country/list", { params: { pcmType } });
};

export const editBusinessTracker = (payload: any) => {
  return api.patch("/business/tracker", payload);
};

export const getBusinessTrackerDetails = (id: any) => {
  return api.get(`/business/tracker/${id}`);
};

export const addNewBusinessInfo = (payload: any) => {
  return api.post("/business/business-info", payload);
};

export const getAddNewBusinessInfo = (id: any) => {
  return api.get(`/business/business-info/${id}`);
};

export const updateBusinessInfo = (payload: any, userId: any) => {
  return api.post(`/business/business-info?tenantId=${userId}`, payload);
};
export const getTenantList = (payload: any) => {
  return api.post(`/tenant/list`, payload);
};

export const exitAddNewBusinessInfo = (payload: any, userId: any) => {
  return api.patch(`/business/business-info?tenantId=${userId}`, payload);
};

export const exitAddNewBusinessInfoWithoutId = (payload: any) => {
  return api.patch(`/business/business-info`, payload);
};

export const addNewPointOfContact = (data: any) => {
  return api.post(`/business/new-contact`, data);
};

export const addPointOfContact = (data: any) => {
  return api.post(`/business/add-contact`, data);
};

export const getPointOfContactDetails = (id: any) => {
  return api.get(`/business/contacts/${id}`);
};

export const removePointOfContact = (data: any) => {
  return api.delete(`/business/contact`, { data });
};

export const updatePointOfContact = (id: any, data: any) => {
  return api.patch(`/business/contact/${id}`, data);
};

export const validatePointOfContact = (id: any) => {
  return api.post(`/business/validate/contacts/${id}`);
};

export const documentUpload = (payload: any) => {
  const config = {
    headers: {
      "Content-Type": "multipart/form-data", // Set the content type to 'multipart/form-data' for file uploads...
    },
  };
  return api.post("/document", payload, config);
};

export const getDocuments = (id: any) => {
  return api.post(`/business/documents/${id}`, {});
};

export const deleteDocument = (docId: any) => {
  return api.delete(`/document?documentId=${docId}`);
};

export const updateBusinessTracker = (id: any) => {
  return api.post(`/business/document/${id}`);
};

export const getUrl = (payload: any) => {
  return api.post("/business/download-url", payload);
};

export const getConfiguredNodes = (id: any) => {
  return api.get(`/business/nodes/${id}`);
};

export const nodesList = () => {
  return api.get("/business/nodes");
};

export const configureNode = (payload: any) => {
  return api.post("/business/nodes", payload);
};

export const getCompanyInfo = (id: any) => {
  return api.get(`/business/business-info/${id}`);
};

export const getContacts = (id: any) => {
  return api.get(`/business/contacts/${id}`);
};

export const getUploadedDocuments = (id: any) => {
  return api.post(`/business/documents/${id}`, {});
};

export const addBusiness = (id: any) => {
  return api.post(`/business/submit/${id}`);
};

export const getActivityLogs = (data: any) => {
  return api.post(`/logs/activity`, data);
};

export const getNodes = (tenantId: any) =>
  api.get(`/business/nodes/${tenantId}`);

export const getAllApiKeys = (tenantId: any, payload: any) =>
  api.post(`/tenant/api-keys/${tenantId}`, payload);

export const generateKey = (tenantId: any) => {
  return api.post(`/tenant/api-keys/generate?tenantId=${tenantId}`);
};

export const revealKey = (tenantId: any) =>
  api.post(`/tenant/api-keys/revealKey/${tenantId}`);

export const otpValidade = (otp: any, actionType: any) => {
  const payload = {
    otp: otp,
    actionType: actionType,
  };

  return api.post("/admin/step-up/authy", payload);
};

export const phoneOtpValid = (payload: any) => {
  return api.post("/otp/phone/validate", payload);
};

export const getWebhookData = (tenantId: any) => {
  return api.get(`/webhook?tenantId=${tenantId}`);
};

export const modifyWebhook = (payload: any) => api.post("/webhook", payload);

export const addIPAddress = (data: any) => {
  return api.post("/whitelist", data);
};

export const getIPList = (data: any) => {
  return api.post("/whitelist/fetch-all", data);
};

export const deleteIPAddress = (userId: any) => {
  return api.delete(`/whitelist/${userId}`);
};
