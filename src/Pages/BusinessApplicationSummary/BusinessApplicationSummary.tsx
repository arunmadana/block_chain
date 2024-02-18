import { Button } from "@mui/joy";
import { useEffect, useState } from "react";
import { Document, Page as ReactPdfPage } from "react-pdf";
import { useNavigate } from "react-router-dom";
import { BusinessTrackerEnum } from "../../Enums/BusinessTrackerEnum";
import { IdentityTypeEnum } from "../../Enums/IdentityTypeEnum";
import { HBar } from "../../components/Bars/Bars";
import EmailWidthCalculatorWithTooltip from "../../components/EmailWidthCalculatorWithTooltip/EmailWidthCalculatorWithTooltip";
import Modal from "../../components/Modal/Modal";
import Spinner from "../../components/Spinner/Spinner";
import { internationalPhoneFormat } from "../../helpers/internationalPhoneFormat";
import lastFourChar from "../../helpers/lastFourChar";
import {
  addBusiness,
  editBusinessTracker,
  getCompanyInfo,
  getConfiguredNodes,
  getContacts,
  getUploadedDocuments,
  getUrl,
} from "../../services/profiles/poc";
import styles from "./BusinessApplicationSummary.module.scss";
import ExitButton from "../../components/ExitButton/ExitButton";

type BusinessApplicationSummaryProps = {
  onEdit: () => void;
  onBack: () => void;
  tenantId: any | null;
  countriesList: any;
};

export const BusinessApplicationSummary: React.FunctionComponent<
  BusinessApplicationSummaryProps
> = ({ onEdit, onBack, tenantId, countriesList }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [companyInfo, setCompanyInfo] = useState({});
  const [primaryContacts, setPrimaryContacts] = useState([]);
  const [technicalContacts, setTechnicalContacts] = useState([]);
  const [FinancialContacts, setFinancialContacts] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [configuredNodes, setConfiguredNodes] = useState([]);
  const [disable, setDisable] = useState(false);
  const [countryCode, setCountryCode] = useState();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [viewDoc, setViewDoc] = useState({});
  const fileType = viewDoc?.fileName?.split(".").pop().toLowerCase();
  const [numPages, setNumPages] = useState(null);
  const navigateTo = useNavigate();
  const [docUrl, setDocUrl] = useState("");
  const [docLoading, setDocLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const onPageChange = (page, totalPages) => {
    setCurrentPage(page);
    setNumPages(totalPages);
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  // calculation of years in Business...
  // getting the years in business function...
  const calculateBusinessYears = (startDate) => {
    const startParts = startDate?.split("/") ?? ["0", "0"];
    const startMonth = parseInt(startParts[0], 10) - 1; // Month is zero-based
    const startYear = parseInt(startParts[1], 10);
    const start = new Date(startYear, startMonth);
    const end = new Date();
    const diffInMilliseconds = end - start;
    const years = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24 * 365));
    const months = Math.floor(
      (diffInMilliseconds % (1000 * 60 * 60 * 24 * 365)) /
        (1000 * 60 * 60 * 24 * 30)
    );
    return `${years} Years ${months} Months`;
  };

  const handleView = (view) => {
    setDocLoading(true);
    setShowModal(true);
    setViewDoc(view);

    // getting documents url...
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
      .catch(() => {
        setDocLoading(false);
      });
  };

  useEffect(() => {
    getBusinessInfo();
    getBusinessContacts();
    getDocs();
    getNodes();
    //eslint-disable-next-line
  }, [countriesList]);

  // getting companyInformation
  const getBusinessInfo = () => {
    setIsLoading(true);
    if (countriesList?.length > 0) {
      const id = tenantId;
      getCompanyInfo(id)
        .then((res) => {
          const data = res?.data?.data;
          setCompanyInfo(data);
          setIsLoading(false);
          const countryShortCode = countriesList.find(
            (country) =>
              country.countryShortCode === data?.phoneNumberDto?.countryCode
          );
          setCountryCode(countryShortCode?.phoneCountryCode);
        })
        .catch(() => {
          setIsLoading(false);
        });
    }
  };
  //getBusiness contacts...
  const getBusinessContacts = () => {
    setIsLoading(true);
    const id = tenantId;
    getContacts(id)
      .then((res) => {
        const data = res?.data?.data;
        data.forEach((contact) => {
          if (contact.contacts.includes(1)) {
            setPrimaryContacts((prevContacts) => [...prevContacts, contact]);
          }
          if (contact.contacts.includes(2)) {
            setTechnicalContacts((prevContacts) => [...prevContacts, contact]);
          }
          if (contact.contacts.includes(3)) {
            setFinancialContacts((prevContacts) => [...prevContacts, contact]);
          }
        });
      })
      .catch((err) => {
        setIsLoading(false);
      });
  };
  //get Uploaded documents...
  const getDocs = () => {
    setIsLoading(true);
    const id = tenantId;
    getUploadedDocuments(id)
      .then((res) => {
        const data = res?.data?.data;
        setDocuments(data?.items);
      })
      .catch(() => {
        setIsLoading(false);
      });
  };
  // get Configured nodes...
  const getNodes = () => {
    setIsLoading(true);
    const id = tenantId;
    getConfiguredNodes(id)
      .then((res) => {
        const data = res?.data?.data;
        setConfiguredNodes(data);
      })
      .catch(() => {
        setIsLoading(false);
      });
  };
  //add Business...
  const handleAddBusiness = () => {
    setDisable(true);
    const id = tenantId;
    addBusiness(id)
      .then(() => {
        navigateTo("/dashboards/profiles");
        setDisable(false);
      })
      .catch(() => {
        setDisable(false);
      });
  };
  //Edit tracker status
  const handleEdit = (edit) => {
    const trackerType =
      edit === 0
        ? BusinessTrackerEnum?.BusinessInfo
        : edit === 1
        ? BusinessTrackerEnum?.PointOfContact
        : edit === 2
        ? BusinessTrackerEnum?.BusinessDocument
        : BusinessTrackerEnum?.NodeConfiguration;

    const payload = {
      tenantId: tenantId,
      isTrackerUpdate: false,
      trackerType: trackerType,
    };
    editBusinessTracker(payload)
      .then((res) => {
        const data = res?.data?.data?.message;
        onEdit(edit);
        // toast.success(data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      {isLoading ? (
        <div className={styles.loadingClass}>
          <Spinner />
        </div>
      ) : (
        <div className={styles.parentContainer}>
          <div>
            <div className={styles.summaryHeader}>Summary</div>
            <span className={styles.infoText}>
              Please review the summary below before adding this business.
            </span>
          </div>

          {/* // Business information..... */}
          <div className={styles.mainContainer}>
            <div className={styles.applicationHead}>
              <span className={styles.companyInfo}>Business Information</span>
              <button
                type="button"
                onClick={() => handleEdit(0)}
                className={styles.infoEditBtn}
              >
                Edit
              </button>
            </div>
            {/* CompanyInformation */}
            <div className={styles.companyInfoContainer}>
              <div className={styles.dataInfo}>
                <span className={styles.leftTitle}>Company Name</span>
                <span className={styles.rightTitle}>{companyInfo?.name}</span>
              </div>
              <HBar className={`${styles.horiBar}`} />
              {/* businessEntity */}
              <div className={styles.dataInfoColumn}>
                <span className={styles.leftTitle}>Business Entity</span>
                <span className={styles.rightTitle}>
                  {companyInfo?.businessEntity}
                </span>
              </div>
              <HBar className={`${styles.horiBar}`} />
              {/* EIN Number */}
              <div className={styles.dataInfoColumn}>
                <span className={styles.leftTitle}>
                  {companyInfo?.identityType === IdentityTypeEnum?.Ssn
                    ? "SSN"
                    : "EIN/TIN"}
                </span>
                <div className={styles.einNumberContainer}>
                  <span className={styles.ssnNumber}>
                    {!isPasswordVisible
                      ? `••••• ${lastFourChar(companyInfo?.ssnOrEin)}`
                      : companyInfo.ssnOrEin}
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                    className={`${
                      !isPasswordVisible ? "icon-eye-hide" : "icon-eye-open"
                    } ${styles.eyeIconStyles}`}
                  >
                    {!isPasswordVisible && (
                      <>
                        <span className="path1"></span>
                        <span className="path2"></span>
                        <span className="path3"></span>
                      </>
                    )}
                  </button>
                </div>
              </div>
              <HBar className={`${styles.horiBar}`} />
              {/* Business Start Date */}
              <div className={styles.dataInfoColumn}>
                <span className={styles.leftTitle}>Business Start Date</span>
                <span className={styles.rightTitle}>
                  {companyInfo?.businessStartDate}
                </span>
              </div>
              <HBar className={`${styles.horiBar}`} />
              {/* Years In Business */}
              <div className={styles.dataInfoColumn}>
                <span className={styles.leftTitle}>Years In Business</span>
                <span className={styles.rightTitle}>
                  {calculateBusinessYears(companyInfo?.businessStartDate)}
                </span>
              </div>
              <HBar className={`${styles.horiBar}`} />
              {/* Email Address */}
              <div className={styles.dataInfoColumn}>
                <span className={styles.leftTitle}>Company Email</span>
                <span className={styles.rightTitleEmail}>
                  <EmailWidthCalculatorWithTooltip
                    id={companyInfo?.email}
                    toolTipContent={companyInfo?.email}
                    label={companyInfo?.email?.split("@")[0]}
                    labelTwo={companyInfo?.email?.split("@")[1]}
                    compareWidth={280}
                    ellipsisNumber={20}
                    className={styles.contactNameEllipsis}
                  />
                </span>
              </div>
              <HBar className={`${styles.horiBar}`} />
              {/* Phone Number */}
              <div className={styles.dataInfoColumn}>
                <span className={styles.leftTitle}>Company Phone Number</span>
                <span className={styles.rightTitle}>
                  {countryCode}{" "}
                  {companyInfo?.phoneNumberDto?.countryCode === "US"
                    ? phoneMask(companyInfo?.phoneNumberDto?.phoneNumber)
                    : internationalPhoneFormat(
                        companyInfo?.phoneNumberDto?.phoneNumber
                      )}
                </span>
              </div>
              <HBar className={`${styles.horiBar}`} />
              {/* Address */}
              <div className={styles.dataInfoColumn}>
                <span className={styles.leftTitle}>Address</span>
                <div className={styles.addressContainer}>
                  <span className={styles.rightTitle}>
                    {companyInfo?.addressLine1}
                  </span>
                  <span className={styles.rightTitle}>
                    {companyInfo?.addressLine2}
                  </span>
                  <span className={styles.rightTitle}>
                    {companyInfo?.city}, {companyInfo?.state}{" "}
                    {companyInfo?.zipCode}
                  </span>
                  <span className={styles.rightTitle}>
                    {companyInfo?.country}
                  </span>
                </div>
              </div>
              <HBar className={`${styles.horiBar}`} />
              {/* copy dba info scenario */}
              {!companyInfo?.doingBusinessAs ? (
                <>
                  {/* // Dba Name */}
                  <div className={styles.dataInfoColumn}>
                    <span className={styles.leftTitle}>Doing Business As</span>
                    <div className={styles.yesDba}>
                      <span className={styles.rightTitle}>
                        {companyInfo?.dbaInfoResponseDto?.dbaName}
                      </span>
                      <div className={styles.addressContainer}>
                        <span className={styles.rightTitle}>
                          {companyInfo?.dbaInfoResponseDto?.dbaAddressLine1}
                        </span>
                        {companyInfo?.dbaInfoResponseDto?.dbaAddressLine2 && (
                          <span className={styles.rightTitle}>
                            {companyInfo?.dbaInfoResponseDto?.dbaAddressLine2}
                          </span>
                        )}
                        <span className={styles.rightTitle}>
                          {companyInfo?.dbaInfoResponseDto?.dbaCity},
                          {companyInfo?.dbaInfoResponseDto?.dbaState}
                          {companyInfo?.dbaInfoResponseDto?.dbaZipCode}
                        </span>
                        <span className={styles.rightTitle}>
                          {companyInfo?.dbaInfoResponseDto?.dbaCountry}
                        </span>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className={styles.dataInfoColumn}>
                  <span className={styles.leftTitle}>Doing Business As</span>
                  <span className={styles.rightDisclaimerTitle}>
                    This company does not do business under <br /> another name.
                  </span>
                </div>
              )}
              <HBar className={`${styles.horiBar}`} />
            </div>
          </div>

          {/* // Points of contacts..... */}
          <div className={styles.posMainContainer}>
            <div className={styles.applicationHead}>
              <span className={styles.companyInfo}>Points of Contact</span>
              <button
                type="button"
                onClick={() => handleEdit(1)}
                className={styles.infoEditBtn}
              >
                Edit
              </button>
            </div>
            <div className={styles.contactsContainer}>
              {/* Primary Contacts */}
              <div className={styles.dataInfoColumn}>
                <span className={styles.leftTitle}>Primary Contacts</span>
                <div className={styles.rightTitle}>
                  {primaryContacts?.map((contact, i) => {
                    return (
                      <ul key={i}>
                        <li>
                          {contact?.firstName} {contact?.lastName}
                        </li>
                      </ul>
                    );
                  })}
                </div>
              </div>
              <HBar className={styles.contactsHBar} />

              {/* Technical Contacts */}
              <div className={styles.contactsDataInfoColumn}>
                <span className={styles.leftTitle}>Technical Contacts</span>

                <div className={styles.rightTitle}>
                  {technicalContacts?.map((contact, i) => {
                    return (
                      <ul key={i}>
                        <li>
                          {contact?.firstName} {contact?.lastName}
                        </li>
                      </ul>
                    );
                  })}
                </div>
              </div>
              <HBar className={`${styles.contactsHBar}`} />

              {/* Financial/Billing Contacts */}
              <div className={styles.contactsDataInfoColumn}>
                <span className={styles.leftTitle}>
                  Financial/Billing Contacts
                </span>
                <div className={styles.rightTitle}>
                  {FinancialContacts?.map((contact, i) => {
                    return (
                      <ul key={i}>
                        <li>
                          {contact?.firstName} {contact?.lastName}
                        </li>
                      </ul>
                    );
                  })}
                </div>
              </div>
              <HBar className={`${styles.contactsHBar}`} />
            </div>
          </div>
          {/* // Business Documents..... */}
          <div className={styles.summaryDocumentsContainer}>
            <div className={styles.applicationHead}>
              <span className={styles.companyInfo}>Business Documents</span>
              <button
                type="button"
                onClick={() => handleEdit(2)}
                className={styles.infoEditBtn}
              >
                Edit
              </button>
            </div>

            <div className={styles.documentsContainer}>
              {/* // documents List... */}
              {documents?.length > 0 ? (
                <>
                  {documents?.map((document, i) => {
                    return (
                      <>
                        <div className={styles.docsDataContainer}>
                          <div key={i} className={styles.documentList}>
                            <div
                              className={`icon-attach ${styles.attachPaperClipIcon}`}
                            />
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
                            </div>
                          </div>
                          <div className={styles.documentName}>
                            {document?.documentName}
                          </div>
                        </div>
                        <HBar className={`${styles.docsHBar}`} />
                      </>
                    );
                  })}
                </>
              ) : (
                <span className={styles.noDocsText}>
                  No documents were uploaded.
                </span>
              )}
              <Modal
                show={showModal}
                onClose={() => setShowModal(false)}
                showCloseButton={true}
                className={styles.viewModalContainer}
              >
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
              </Modal>
            </div>
          </div>
          {/* // Node configuration..... */}
          <div className={styles.summaryDocumentsContainer}>
            <div className={styles.applicationHead}>
              <span className={styles.companyInfo}>Node Configuration</span>
              <button
                type="button"
                onClick={() => handleEdit(3)}
                className={styles.infoEditBtn}
              >
                Edit
              </button>
            </div>
            <div>
              {configuredNodes?.map((node, i) => {
                return (
                  <div key={i} className={styles.nodesContainer}>
                    <div className={styles.inBlock}>
                      <span className={styles.nodeCurrency}>
                        {node?.nodeName}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* // Navigation and submit block... */}
          <div className={styles.navigationButtons}>
            <button
              type="button"
              className={styles.backButton}
              onClick={onBack}
            >
              Back
            </button>
            <div className={styles.exitRow}>
              <ExitButton />
              <Button
                disabled={disable}
                onClick={handleAddBusiness}
                className="text-sm"
              >
                Add Business
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
