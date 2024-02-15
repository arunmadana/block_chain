import api from "..";

export const getAllIndividuals = (
  userType: any,
  searchKey: any,
  { pageSize = 10, currentPage = 1 },
  { column = '', order = '' }
) =>
  api.get('/api/v2/view/customers', {
    params: {
      searchKey: searchKey ? searchKey : undefined,
      pageSize: pageSize,
      pageNo: currentPage - 1,
      status: userType ? userType : undefined,
      sortColumnName: column !== '' ? column : undefined,
      sortDirection: order !== '' ? order : undefined
    }
  });

// Add New Point of Contact
export const addNewPointOfContact = (data: any) => {
  return api.post(`/business/new-contact`, data);
};

//get Point of Contact Details
export const getPointOfContactDetails = (id: any) => {
  return api.get(`/business/contacts/${id}`);
};

//update user details
export const updatePointOfContact = (id: any, data: any) => {
  return api.patch(`/business/contact/${id}`, data);
};

//Remove Merchant user from List
export const removePointOfContact = (data: any) => {
  return api.delete(`/business/contact`, { data });
};

//Update Merchant user from List
export const addPointOfContact = (data: any) => {
  return api.post(`/business/add-contact`, data);
};

//Validate Point Of Contact
export const validatePointOfContact = (id: any) => {
  return api.post(`/business/validate/contacts/${id}`);
};
