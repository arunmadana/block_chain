import api from "..";

export const getAllContacts = (businessId: any) => {
  return api.get(`/business/contacts/${businessId}`);
};

export const removeContact = (data: any) => {
  return api.delete('/business/contact', { data });
};

export const addContact = (payload: any) => {
  return api.post('/business/add-contact', payload);
};

export const newContact = (payload: any) => {
  return api.post('/business/new-contact', payload);
};

export const updateContact = (businessId: any, payload: any) => {
  return api.patch(`/business/contact/${businessId}`, payload);
};

export const getPhoneCountryList = (pcmType: any) => {
  return api.get('/country/list', { params: { pcmType } });
};
