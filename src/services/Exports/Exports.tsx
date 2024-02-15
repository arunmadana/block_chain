import api from "..";

// Export Transaction details based on given filter
export const exportAPI = (
  eventTypeId: any,
  eventSubTypeId: any,
  exportColumns: any,
  filterColumns: any
) =>
  api.post("export/me/txnexport", {
    eventTypeId,
    eventSubTypeId,
    exportColumns,
    filterColumns,
  });

// Get all events based on eventTypeId and EventSubTypeId

export const exportAllEvents = () => {
  return api.post("/exports/all");
};
// Get Export Columns by EventTypeId and EventSubTypeId

export const exportColumn = (
  eventTypeId: any,
  eventSubTypeId: any,
  params: any
) => {
  const queryParams = { params };
  return api.get(
    `/export/transaction/{eventTypeId}/{eventSubTypeId}?eventTypeId=${eventTypeId}&eventSubTypeId=${eventSubTypeId}`,
    queryParams
  );
};

// Download Report

export const exportDownloadReport = (eventId: any) =>
  api.get(`/download/export/${eventId}`);

//Bulk-download

export const exportBulkDownload = (id: any) =>
  api.post("/download/export/bulk", id);

//Bulk delete
export const exportBulkDelete = (data: any) => {
  const queryParams = { data };
  return api.delete(`/download/export/delete`, queryParams);
};
