import api from "..";

//get all customers
export const getCustomers = (
  searchKey: any,
  { pageSize = 10, currentPage = 1 },
  { column = "", order = "" },
  data: any
) => {
  const standardParams = {
    searchKey: searchKey ? searchKey : undefined,
    pageSize: pageSize,
    pageNo: currentPage === 0 ? currentPage : currentPage - 1,
    accountType: [1],
    sortColumnName: column !== "" ? column : undefined,
    sortDirection: order !== "" ? order : undefined,
  };
  let finalParams = standardParams;
  if (data?.accountStatus?.length) {
    finalParams = Object.assign(standardParams, data);
  }
  return api.post("/view/customers", finalParams);
};
// get Business profiles
export const getBusiness = (
  searchKey: any,
  { pageSize = 10, currentPage = 1 },
  { column = "", order = "" },
  data: any
) => {
  const standardParams = {
    searchKey: searchKey,
    pageSize: pageSize,
    pageNo: currentPage == 0 ? currentPage : currentPage - 1,
    accountType: [2],
    sortColumnName: column !== "" ? column : undefined,
    sortDirection: order !== "" ? order : undefined,
  };
  const finalParams = Object.assign(standardParams, data);
  return api.post("/view/customers", finalParams);
};

//Added to Filter Users based on Status
export const getFiltered = (data: any) => {
  const payload = {
    accountStatus: data.Status,
    accountType: "2",
  };
  return api.post("/view/customers", payload);
};

// Business Profile API
export const businessProfiles = (data: any) => {
  return api.post("/tenant/list", data);
};

// Business Profile List count
export const profileListCount = (data: any) => {
  return api.post("/tenant/count", data);
};

// Export Get API
export const exportsList = () => {
  return api.get("/exports/ADMIN_TENANTS_PROFILES_EXPORT");
};

// Export Post API
export const sendExport = (data: any) => {
  return api.post("/exports/tenant", data);
};

//get customer by ID
export const getCustomerById = (id: any) => {
  return api.get(`/admin/customer/${id}`);
};

export const getAgreementById = (documentNumber: any) =>
  api.get(`/agreements/url/${documentNumber}`);

//get customer agreements
export const getCustomerAgreements = (id: any) => {
  return api.get(`/admin/${id}/signedagreements`);
};
//get customer agreements content
export const getCustomerAgreementContent = (id: any) => {
  return api.get(`/agreements/${id}`);
};

//get customer Cards
export const getCustomerCards = (id: any) => {
  return api.get(`/payment-methods/${id}`);
};

//get customer wallets
export const getCustomerWallets = (id: any) => {
  return api.get(`/wallets/${id}/wallets`);
};
// get business wallets
export const getBusinessWallets = (id: any) => {
  return api.get(`/wallets/${id}/wallets`);
};

//update Account status
export const changeStatus = (data: any) => {
  return api.patch("/business/update-status", data);
};

// Update Business Status
export const changeBusinessStatus = (arr: any, status: any, reason: any) => {
  const id = arr.apiBusinessId;
  let archiveArray;
  if (status === "Active") {
    archiveArray = [
      {
        userId: id,
        status: status,
      },
    ];
  } else if (status === "Terminated") {
    archiveArray = [
      {
        reason: reason,
        userId: id,
        status: status,
      },
    ];
  } else if (status === "Under Review") {
    archiveArray = [
      {
        reason: reason,
        userId: id,
        status: status,
      },
    ];
  } else if (status === "DeActivated") {
    archiveArray = [
      {
        userId: id,
        status: status,
      },
    ];
  }
  return api.patch("admin/updatestatus", archiveArray); //admin/updatestatus
};

//Edit Status
export const EditStatus = (id: any, status: any, reason: any) => {
  let archiveArray;
  archiveArray = [
    {
      userId: id,
      status: status,
      reason: reason,
    },
  ];
  return api.patch("admin/updatestatus", archiveArray);
};

//Check LastLogin
export const LastLogin = (logType: any, referenceId: any) => {
  let payload = {
    logType: logType,
    referenceId: referenceId,
  };
  return api.post(`/logs/user-activity`, payload);
};

//Check card Activity Log
export const CardActivity = (referenceId: any) => {
  return api.get(`/logs/dispute/${referenceId}/card/activity-log`);
};

//update customer preferences
export const updateCustomerPreference = (id: any, data: any) => {
  return api.post(`/admin/${id}/preferences`, data);
};

//get customer preferences
export const getCustomerPreference = (id: any) => {
  return api.get(`/admin/${id}/preferences`);
};

//update customer informations
export const updateCustomer = (id: any, data: any) => {
  const payload = {
    addressLine1: data.addressLine1,
    addressLine2: data.addressLine2,
    city: data.city,
    firstName: data.firstName,
    lastName: data.lastName,
    country: data.country.value,
    state: data.state.value,
    zipCode: data.zipCode,
  };
  return api.patch(`/admin/customer/${id}/update`, payload);
};

//reset customer pass
export const resetCustomerPassword = (id: any) => {
  return api.post(`/user/${id}/reset-password`);
};

//unlock by email
export const unlockByEmail = (id: any) => {
  return api.post(`/user/${id}/unlock-by-email`);
};

// Business Account
export const businessDetails = (data: any) => {
  return api.post(`/profile/profile-accounts`, data);
};

//Business Account
export const einInfo = (id: any) => {
  return api.get(`/business/company-info/${id}`);
};

//get New Merchant Details
export const getNewBusinessDetails = (id: any) => {
  const params = {
    id: id,
  };
  return api.get("register/buiness-invitation", { params });
};

export const getBusinessInfo = (businessId: any) => {
  return api.get(`business/business-profile/${businessId}`);
};

export const getBusinessDocuments = (businessId: any) => {
  return api.post(`business/documents/${businessId}`, {});
};
