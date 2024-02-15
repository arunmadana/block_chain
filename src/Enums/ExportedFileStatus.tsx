export const ExportedFilesStatus = {
  UploadFail: 'UPLOADFAIL',
  Open: 'OPEN',
  ReportGenerateFail: 'REPORTGENERATEFAIL',
  Completed: 'COMPLETED',
  SentToMb: 'SENTTOMB',
  ReportGenerated: 'REPORTGENERATED',
  UploadedToS3: 'UPLOADEDTOS3',
  UploadingToS3: 'UPLOADINGTOS3',
  Exporting: 'EXPORTING'
};

Object.freeze(ExportedFilesStatus);

export const ExportedFilesStatusNumber = {
  Open: '0',
  SentToMb: '2',
  ReportGenerated: '5',
  ReportGenerateFail: '6',
  UploadingToS3: '7',
  UploadedToS3: '8',
  UploadFail: '9',
  Completed: '11'
};

Object.freeze(ExportedFilesStatusNumber);
