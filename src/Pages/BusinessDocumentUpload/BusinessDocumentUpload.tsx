import { Button } from "@mui/joy";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { Document, Page as ReactPdfPage } from "react-pdf";
import * as Yup from "yup";
import { FormField } from "../../components/FormField/FormField";
import { FormFile } from "../../components/FormFile/FormFile";
import Modal from "../../components/Modal/Modal";
import Spinner from "../../components/Spinner/Spinner";
import {
  deleteDocument,
  documentUpload,
  getDocuments,
  getUrl,
  updateBusinessTracker,
} from "../../services/profiles/poc";
import styles from "./BusinessDocumentUpload.module.scss";
import ExitButton from "../../components/ExitButton/ExitButton";

type BusinessDocumentUploadProps = {
  onBack: () => void;
  onNext: () => void;
  getTentId: any | null;
};

export const BusinessDocumentUpload: React.FunctionComponent<
  BusinessDocumentUploadProps
> = ({ onBack = () => {}, onNext = () => {}, tenantId }) => {
  const [upload, setUpload] = useState(false);
  const [showSkipModal, setShowSkipModal] = useState(false);
  const [modalStep, setModalStep] = useState(false);
  const [removeDoc, setRemoveDoc] = useState({});
  const [viewDoc, setViewDoc] = useState({});
  const fileType = viewDoc?.fileName?.split(".").pop().toLowerCase();
  const [numPages, setNumPages] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [disable, setDisable] = useState(false);
  const [docUrl, setDocUrl] = useState("");
  const [docLoading, setDocLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const onPageChange = (page, totalPages) => {
    setCurrentPage(page);
    setNumPages(totalPages);
  };

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  useEffect(() => {
    getDocs();
  }, [upload]);

  // getting uploaded documents....
  const getDocs = () => {
    setIsLoading(true);
    getDocuments(tenantId)
      .then((res) => {
        const data = res?.data?.data?.items;
        setDocuments(data);
        setIsLoading(false);
      })
      .catch((err) => {});
  };

  // Delete uploaded documents from the documents list.....
  const handleDeleteDocument = (docId: any) => {
    deleteDocument(docId)
      .then((res) => {
        const data = res?.data?.data?.message;
        // toast.success(data);
        getDocs();
        setShowSkipModal(false);
        setModalStep(0);
        setRemoveDoc({});
      })
      .catch((err) => {});
  };
  //tracker update api call....
  const updateTracker = () => {
    setDisable(true);
    const id = tenantId;
    updateBusinessTracker(id)
      .then((res) => {
        onNext();
        setDisable(false);
      })
      .catch((err) => {
        setDisable(false);
      });
  };

  const handleSubmit = () => {
    if (documents?.length == 0) {
      setShowSkipModal(true);
    } else {
      updateTracker();
    }
  };

  const handleRemove = (doc) => {
    setShowSkipModal(true);
    setModalStep(1);
    setRemoveDoc(doc);
  };

  const handleView = (view) => {
    setDocLoading(true);
    setShowSkipModal(true);
    setModalStep(2);
    setViewDoc(view);

    // getting s3 url for view doc...
    const payload = {
      url: view?.documentRefPath,
    };
    getUrl(payload)
      .then((res) => {
        const data = res?.data?.data?.url;
        setDocUrl(data);
        setDocLoading(false);
      })
      .catch((err) => {
        setDocLoading(false);
      });
  };

  const handleCloseModal = () => {
    setShowSkipModal(false);
    setModalStep(0);
    setViewDoc({});
    setDocUrl("");
  };
  //handleSKip function...
  const handleSkip = () => {
    updateTracker();
  };
  return (
    <>
      {upload ? (
        <UploadDocs tenantId={tenantId} setUpload={setUpload} />
      ) : (
        <>
          {isLoading ? (
            <div className={styles.loadingClass}>
              <Spinner />
            </div>
          ) : (
            <div className={styles.documentsContainer}>
              <div>
                <h1 className={styles.header}>Business Documents</h1>
                <p
                  className={`${styles.disclaimerClass} ${
                    documents?.length == 0 && styles.formatText
                  }`}
                >
                  Please upload all available official business formation
                  documents, such as business licenses or registrations. Files
                  can be in PNG, JPG, or PDF format (up to 4MB).
                </p>
                {documents?.length > 0 && (
                  <div className={styles.documentsListContainer}>
                    {documents?.map((document, i) => {
                      return (
                        <>
                          <div key={i} className={styles.documentList}>
                            <div
                              className={`icon-attach ${styles.attachPaperClipIcon}`}
                            />
                            <div className={styles.docsDataContainer}>
                              <div className={styles.docsData}>
                                <button
                                  type="button"
                                  onClick={() => handleView(document)}
                                  className={styles.docTitle}
                                >
                                  {document?.fileName}
                                </button>
                                <span className={styles.docSize}>
                                  ({document?.documentSize} KB)
                                </span>
                                <div
                                  onClick={() => handleRemove(document)}
                                  className={`icon-plus ${styles.cancelIconButton}`}
                                />
                              </div>
                              <div className={styles.documentName}>
                                {document?.documentName}
                              </div>
                            </div>
                          </div>
                        </>
                      );
                    })}
                  </div>
                )}
                {documents?.length < 10 && (
                  <button
                    type="button"
                    className={styles.addButton}
                    onClick={() => setUpload(true)}
                  >
                    <span className={`${styles.plusIcon} icon-plus`} />
                    <span className={styles.addDocText}>Add Document</span>
                  </button>
                )}
              </div>
              <div className={styles.navigationButtons}>
                <button
                  type="button"
                  className={styles.docBackButton}
                  onClick={onBack}
                >
                  Back
                </button>
                <div className={styles.exitRow}>
                  <ExitButton />
                  <Button
                    disable={disable}
                    onClick={handleSubmit}
                    label={documents?.length == 0 ? "Skip" : "Next"}
                    className={styles.skipBtn}
                  >
                    {documents?.length == 0 ? "Skip" : "Next"}
                  </Button>
                </div>
              </div>
            </div>
          )}

          <Modal
            show={showSkipModal}
            className={
              modalStep == 2 ? styles.viewModalContainer : styles.skipModal
            }
            showCloseButton={true}
            onClose={handleCloseModal}
          >
            {modalStep == 0 && (
              <div className={styles.skipModalContainer}>
                <h1 className={styles.modalHeader}>No Business Documents</h1>
                <p className={styles.modalDisclaimer}>
                  Are you sure you want to skip without adding any business
                  documents?
                </p>
                <Button
                  onClick={handleSkip}
                  disable={disable}
                  className={styles.ModalSkipBtn}
                >
                  Skip
                </Button>
                <button
                  className={styles.cancelBtn}
                  onClick={() => setShowSkipModal(false)}
                >
                  Cancel
                </button>
              </div>
            )}
            {modalStep == 1 && (
              <div className={styles.skipModalContainer}>
                <h1 className={styles.modalHeader}>Remove Document?</h1>
                <div className={styles.removeDocModal}>
                  <div
                    className={`icon-attach ${styles.attachPaperClipIcon}`}
                  />
                  <p className={styles.docFileName}>
                    {removeDoc?.fileName}
                    <span className={styles.docSize}>
                      ({removeDoc?.documentSize} KB)
                    </span>
                  </p>
                </div>
                <Button
                  onClick={() => handleDeleteDocument(removeDoc?.id)}
                  className={styles.ModalSkipBtn}
                >
                  Remove
                </Button>
                <button
                  className={styles.cancelBtn}
                  onClick={() => setShowSkipModal(false)}
                >
                  Cancel
                </button>
              </div>
            )}

            {modalStep == 2 && (
              <div className={styles.viewDocContainer}>
                <h1 className={styles.modalHeader}>
                  {viewDoc?.fileName}
                  <span className={styles.viewSize}>
                    ({viewDoc?.documentSize} KB)
                  </span>
                </h1>

                <div className={styles.viewDoc}>
                  <div className={styles.viewBox}>
                    {docLoading ? (
                      <div className={styles.docLoaderClass}>
                        <Spinner />
                      </div>
                    ) : (
                      <>
                        {fileType == "pdf" ? (
                          <Document
                            file={docUrl}
                            onLoadSuccess={onDocumentLoadSuccess}
                            externalLinkTarget={"_blank"}
                          >
                            {Array.from(new Array(numPages), (el, index) => (
                              <ReactPdfPage
                                width={295}
                                name={`page${index + 1}`}
                                key={`page${index + 1}`}
                                scale={2.0}
                                loading={""}
                                pageNumber={currentPage}
                                onPageChange={onPageChange}
                              />
                            ))}
                          </Document>
                        ) : (
                          docUrl && (
                            <img
                              src={docUrl}
                              alt="doc"
                              className={styles.viewImageClass}
                            />
                          )
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}
          </Modal>
        </>
      )}
    </>
  );
};

const UploadDocs = ({ setUpload, tenantId }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [disable, setDisable] = useState(false);
  const [isExceeded, setIsExceeded] = useState(false);
  const [file, setFile] = useState({});
  const emojiRegex = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g;

  // Post api call for document upload....
  const addDocument = () => {
    setDisable(true);
    const formData = new FormData();
    formData.append("tenantId", tenantId);
    formData.append("documentName", documentFormik.values.documentName);
    formData.append("documentType", 1);
    formData.append("document", documentFormik.values.document);

    documentUpload(formData)
      .then((res) => {
        const message = res.data.data?.message;
        // toast.success(message);
        setUpload(false);
        documentFormik.resetForm();
        setDisable(false);
      })
      .catch((err) => {
        const errorMessage = err?.response?.data?.error;
        setDisable(false);
        if (errorMessage?.errorCode === "G100073") {
          documentFormik.setFieldValue("document", null);
          setIsExceeded(true);
          setTimeout(() => {
            setIsExceeded(false);
          }, 3000);
        } else {
          return;
        }
      });
  };

  const MAX_FILE_SIZE_BYTES = 4 * 1024 * 1024; // 4MB in bytes
  const supportedFormats = ["jpg", "jpeg", "png", "pdf"];

  const validationSchema = Yup.object().shape({
    documentName: Yup.string()
      .required("Document name is required")
      .test("no-emojis", "Document name cannot contain emojis", (val) => {
        return !emojiRegex.test(val);
      })
      .matches(/^(?!\s+$)/, "Cannot contain only blankspaces")
      .min(3, "Document name should be minimum 3 characters"),
    document: Yup.mixed()
      .required("")
      .test("fileType", "Provided file format is invalid", (value) => {
        if (!value) {
          // No file provided, validation will be handled by 'required' validation
          return true;
        }

        // Check if the file format is supported
        const fileExtension = value.name.split(".").pop().toLowerCase();
        if (supportedFormats.includes(fileExtension)) {
          return true; // File format is supported
        }

        // Return false without clearing the file field
        return false;
      })
      .test(
        "fileSize",
        "File exceeds maximum upload size of 4MB. Please try again.",
        (value) => {
          if (!value) {
            // No file provided, validation will be handled by 'required' validation
            return true;
          }

          // Check if file size is within the limit
          if (value.size <= MAX_FILE_SIZE_BYTES) {
            return true; // File size is within limit
          }

          // Return false without clearing the file field
          return false;
        }
      ),
  });

  const documentFormik = useFormik({
    initialValues: {
      documentName: "",
      document: null,
    },
    validationSchema,
  });

  const handleUpload = (file) => {
    setIsUploading(true);
    setTimeout(() => {
      setFile(file);
      documentFormik.setFieldValue("document", file);
      setIsUploading(false);
    }, 1200);
  };

  useEffect(() => {
    if (documentFormik?.values?.document !== null) {
      documentFormik.setFieldValue(
        "documentName",
        file?.name?.replace(/\.(png|jpg|jpeg|pdf)$/, "")
      );
    } else {
      documentFormik.setFieldValue("documentName", "");
    }
  }, [file]);

  return (
    <div className={styles.uploadDocsContainer}>
      <div className={styles.subContainer}>
        <button
          className={`icon-back-arrow ${styles.backArrowBtn}`}
          type="button"
          onClick={() => setUpload(false)}
        ></button>
      </div>
      <div className={styles.addButtonContainer}>
        <h1 className={styles.header}>Add Document</h1>
        <FormFile
          id="document"
          name="document"
          label="Upload Document"
          accept=".pdf, .jpg, .png, .jpeg"
          className={styles.DocUpload}
          isUploading={isUploading}
          successIcon={true}
          onSelectFile={(file) => handleUpload(file)}
          onRemoveFile={() => {
            documentFormik.setFieldValue("document", null);
            setFile({});
          }}
          {...documentFormik.getFieldProps("document")}
          errorMessage={documentFormik.errors.document}
        />
        <FormField
          id="documentName"
          name="documentName"
          label="Document Name"
          placeholder="Document Name"
          className={styles.docName}
          maxLength={60}
          {...documentFormik.getFieldProps("documentName")}
          error={
            documentFormik.touched.documentName &&
            documentFormik.errors.documentName
          }
        />
        <div className={styles.navButtons}>
          <button
            type="button"
            onClick={() => setUpload(false)}
            className={styles.uploadCancelButton}
          >
            Cancel
          </button>
          <button
            disabled={
              !(documentFormik.isValid && documentFormik.dirty) || disable
            }
            onClick={addDocument}
            className={styles.uploadBtn}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};
