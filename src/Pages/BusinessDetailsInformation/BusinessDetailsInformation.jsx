import { Button } from "@mui/joy";
import { saveAs } from "file-saver";
import { useFormik } from "formik";
import { useEffect, useMemo, useState } from "react";
import { Document, Page as ReactPdfPage } from "react-pdf";
import { useNavigate, useParams } from "react-router-dom";
import * as Yup from "yup";
import { LocalStorageKeysEnum } from "../../Enums/LocalStorageKeysEnum";
import { PermissionTypeEnum } from "../../Enums/PermissionTypeEnum";
import { PhoneCountryListEnum } from "../../Enums/PhoneCountryListEnum";
import { HBar } from "../../components/Bars/Bars";
import Card from "../../components/Card/Card";
import EmailWidthCalculatorWithTooltip from "../../components/EmailWidthCalculatorWithTooltip/EmailWidthCalculatorWithTooltip";
import {
  FormField,
  FormPhoneWithCode,
  FormSelect,
  FormTextArea,
} from "../../components/FormField/FormField";
import { FormFile } from "../../components/FormFile/FormFile";
import Modal from "../../components/Modal/Modal";
import Spinner from "../../components/Spinner/Spinner";
import { internationalPhoneFormat } from "../../helpers/internationalPhoneFormat";
import phoneMask from "../../helpers/phoneMask";
import { getStorage } from "../../services/Storage";
import {
  getBusinessDocuments,
  getBusinessInfo,
} from "../../services/customerProfiles/customerProfiles";
import {
  deleteDocument,
  documentUpload,
  getPhoneCountryList,
  getUrl,
  updateBusinessInfo,
} from "../../services/profiles/poc";
import styles from "./BusinessDetailsInformation.module.scss";

const emojiRegex = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g;

export default function BusinessDetailsInformation() {
  const { id: tenantId } = useParams();
  const [isEdit, setIsEdit] = useState(false);
  const [businessInfo, setBusinessInfo] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddDocument, setIsAddDocument] = useState(false);
  const [isDocumentModal, setIsDocumentModal] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState({});
  const [documentsList, setDocumentsList] = useState([]);
  const [newDocumentList, setNewDocumentList] = useState([]);
  const [removedDocList, setRemovedDocList] = useState([]);
  const [isRemoveModal, setIsRemoveModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [removeDocument, setRemoveDocument] = useState({});
  const [phoneCountryList, setPhoneCountryList] = useState([]);
  const [countries, setCountries] = useState([]);
  const [countryRegex, setCountryRegex] = useState({});
  const [isSaved, setIsSaved] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const [docUrl, setDocUrl] = useState("");
  const navigateTo = useNavigate();

  // fetching the authorities of user for restricting the user from editing
  useEffect(() => {
    const userAuthority = getStorage(LocalStorageKeysEnum?.authorities);
    const parsedData = JSON.parse(userAuthority);
    setHasPermission(
      parsedData?.ADMIN_BUSINESS_EDIT ==
        PermissionTypeEnum?.BusinessProfilesEdit
    );
  }, []);

  const infoFormik = useFormik({
    initialValues: {
      businessName: "",
      businessEntity: {},
      businessStartDate: "",
      phoneNumber: "",
      phoneCode: "",
      email: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      stateProvince: "",
      country: {},
      zipPostalCode: "",
    },
    validationSchema: Yup.object({
      businessName: Yup.string()
        .required("Business name is required")
        .min(3, "Business name must be at least 3 characters")
        .matches(/^(?!\s+$)/, "Cannot contain only blankspaces")
        .test("no-emojis", "Cannot contain emojis", (val) => {
          return !emojiRegex.test(val);
        })
        .nullable(),
      businessEntity: Yup.object()
        .required("Business entity is required")
        .nullable(),
      email: Yup.string()
        .required("Email Address is required")
        .matches(
          /^([a-zA-Z0-9_.-])+@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,6}$)+$/,
          "Invalid Email"
        ),
      phoneNumber: Yup.string()
        .required("Phone Number is required")
        .test(
          "len",
          countryRegex?.minLength === countryRegex?.maxLength
            ? `Phone Number must be ${countryRegex?.minLength} digits`
            : `Phone Number must be min ${countryRegex?.minLength} and max ${countryRegex?.maxLength} digits`,
          (value) =>
            value?.replace(/[^\d]/g, "")?.toString().length >=
              countryRegex?.minLength &&
            value?.replace(/[^\d]/g, "")?.toString().length <=
              countryRegex?.maxLength
        ),
      phoneCode: Yup.string().required("Please select Country Code"),
      addressLine1: Yup.string()
        .required("Address line 1 is required")
        .test("no-emojis", "Cannot contain emojis", (val) => {
          return !emojiRegex.test(val);
        })
        .min(3, "Address line 1 must be at least 3 characters")
        .matches(/^(?!\s+$)/, "Cannot contain only blankspaces")
        .nullable(),
      addressLine2: Yup.string()
        .matches(/^(?!\s+$)/, "Cannot contain only blankspaces")
        .test("no-emojis", "Cannot contain emojis", (val) => {
          return !emojiRegex.test(val);
        }),
      stateProvince: Yup.string()
        .matches(/^[A-Za-z ]+$/g, "Invalid state/province name")
        .matches(/^(?!\s)[a-zA-Z0-9\s\S]*$/, "Cannot contain only blankspaces"),
      zipPostalCode: Yup.string()
        .test("no-emojis", "Cannot contain emojis", (val) => {
          return !emojiRegex.test(val);
        })
        .matches(/^(?!\s)[a-zA-Z0-9\s\S]*$/, "Cannot contain only blankspaces")
        .nullable(),
      city: Yup.string()
        .required("City is required")
        .matches(/^(?!\s+$)/, "Cannot contain only blankspaces")
        .matches(/^[A-Za-z ]+$/g, "Invalid city name")
        .nullable(),
    }),
  });

  // As api's are not ready and base url is not changed, I commented this code and I need it once they are ready
  useEffect(() => {
    getCountryList();
    getInfo();
    getDocuments();
  }, []);

  const getInfo = (loading = true) => {
    setIsLoading(loading);
    getBusinessInfo(tenantId)
      .then((res) => {
        const response = res.data?.data;
        setBusinessInfo(response);
        infoFormik.setValues({
          businessName: response?.name,
          businessEntity: {
            label: response?.businessEntity,
            value: response?.businessEntity,
          },
          businessStartDate: response?.businessStartDate,
          phoneNumber: response?.phoneNumberDto?.phoneNumber,
          phoneCode: response?.phoneNumberDto?.countryCode,
          email: response?.email,
          addressLine1: response?.addressLine1,
          addressLine2: response?.addressLine2,
          city: response?.city,
          stateProvince: response?.state,
          country: {
            label: response?.country,
            value: response?.country,
          },
          zipPostalCode: response?.zipCode,
        });

        // // Retrieve the object from local storage
        const storedData = JSON?.parse(
          localStorage?.getItem("businessDetails")
        );
        if (storedData) {
          const newName = response?.name;
          storedData.name = newName;
          // Updating the localstorage by modifying name value in the object
          localStorage?.setItem("businessDetails", JSON?.stringify(storedData));
        }
        navigateTo(
          `/dashboards/profiles/business-details/${tenantId}/business-info`
        );
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  };

  const getDocuments = () => {
    setIsLoading(true);
    getBusinessDocuments(tenantId)
      .then((res) => {
        const response = res.data?.data?.items;
        const updatedResponse = response?.map((item) => {
          return { ...item, isFromBE: true };
        });
        setDocumentsList(updatedResponse);
        setNewDocumentList(updatedResponse);
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  };

  const getCountryList = () => {
    getPhoneCountryList(PhoneCountryListEnum.POCCountryList)
      .then((res) => {
        const response = res.data?.data;
        const sortedList = response?.sort((a, b) =>
          a?.country.localeCompare(b?.country)
        );
        const countryList = sortedList?.map((item) => ({
          label: item?.country,
          value: item?.countryShortCode,
        }));
        setCountries(countryList);
        setPhoneCountryList(sortedList);
      })
      .catch(() => {});
  };

  useEffect(() => {
    setCountryRegex(
      findCountryCode(businessInfo?.phoneNumberDto?.countryCode, true)
    );
  }, [phoneCountryList]);

  const findCountryCode = (countryId, isOnlyCode = false) => {
    const code = phoneCountryList?.find(
      (item) => item.countryShortCode === countryId
    );
    return isOnlyCode ? code : code?.phoneCountryCode;
  };

  const businessEntityOptions = useMemo(
    () => [
      {
        label: "Sole Proprietorship / Single LLC",
        value: "Sole Proprietorship / Single LLC",
      },
      {
        label: "C Corporation",
        value: "C Corporation",
      },
      {
        label: "S Corporation",
        value: "S Corporation",
      },
      {
        label: "Partnership",
        value: "Partnership",
      },
      {
        label: "Trust / Estate",
        value: "Trust / Estate",
      },
      {
        label: "Limited Liability Company",
        value: "Limited Liability Company",
      },
      {
        label: "Government",
        value: "Government",
      },
    ],
    []
  );

  const cancelEdit = () => {
    getInfo(false);
    setRemovedDocList([]);
    setNewDocumentList(documentsList);
    setIsEdit(!isEdit);
    setCountryRegex(
      findCountryCode(businessInfo?.phoneNumberDto?.countryCode, true)
    );
    if (isEdit) {
      infoFormik.setValues({
        businessName: businessInfo?.name,
        businessEntity: {
          label: businessInfo?.businessEntity,
          value: businessInfo?.businessEntity,
        },
        businessStartDate: businessInfo?.businessStartDate,
        phoneNumber: businessInfo?.phoneNumberDto?.phoneNumber,
        phoneCode: businessInfo?.phoneNumberDto?.countryCode,
        email: businessInfo?.email,
        addressLine1: businessInfo?.addressLine1,
        addressLine2: businessInfo?.addressLine2,
        city: businessInfo?.city,
        stateProvince: businessInfo?.state,
        country: {
          label: businessInfo?.country,
          value: businessInfo?.country,
        },
        zipPostalCode: businessInfo?.zipCode,
      });
    }
  };

  useEffect(() => {
    if (countryRegex?.countryShortCode) {
      infoFormik.setFieldTouched("phoneNumber", true);
    }
  }, [countryRegex]);

  const isAnyChanges = () => {
    return (
      !(infoFormik.dirty && infoFormik.isValid) ||
      (businessInfo?.name === infoFormik.values.businessName &&
        businessInfo?.businessEntity ===
          infoFormik.values.businessEntity?.label &&
        businessInfo?.email === infoFormik.values.email &&
        findCountryCode(businessInfo?.phoneNumberDto?.countryCode) ===
          countryRegex?.phoneCountryCode &&
        infoFormik.values.phoneNumber?.replace(/[^\d]/g, "") ===
          businessInfo?.phoneNumberDto?.phoneNumber &&
        businessInfo?.addressLine1 === infoFormik.values.addressLine1 &&
        businessInfo?.addressLine2 === infoFormik.values.addressLine2 &&
        businessInfo?.city === infoFormik.values.city &&
        businessInfo?.zipCode === infoFormik.values.zipPostalCode &&
        businessInfo?.country === infoFormik.values.country?.label &&
        businessInfo?.state === infoFormik.values.stateProvince &&
        JSON.stringify(documentsList) === JSON.stringify(newDocumentList))
    );
  };

  const applyChanges = async () => {
    setIsSaved(true);

    const payload = {
      name: infoFormik.values.businessName?.trim(),
      businessEntity: infoFormik.values.businessEntity?.label,
      businessStartDate: infoFormik.values.businessStartDate,
      email: infoFormik.values.email,
      phoneNumberDto: {
        countryCode: countryRegex?.countryShortCode,
        phoneNumber: infoFormik.values.phoneNumber?.replace(/[^\d]/g, ""),
      },
      addressLine1: infoFormik.values.addressLine1?.trim(),
      addressLine2: infoFormik.values.addressLine2?.trim(),
      city: infoFormik.values.city?.trim(),
      state: infoFormik.values.stateProvince?.trim(),
      zipCode: infoFormik.values.zipPostalCode?.trim(),
      country: infoFormik.values.country?.label,
      reason: textFormik.values.reason?.trim(),
    };

    const successMessages = [];
    const errorMessages = [];

    try {
      // Create an array of promises for API calls
      const apiPromises = [];
      let isErrorOccurred = false;

      // API call 1: Update Business Info
      const updateInfoPromise = updateBusinessInfo(tenantId, payload)
        .then(() => {
          successMessages.push("Business information saved");
        })
        .catch((err) => {
          const message =
            err?.response?.data?.error?.errorDescription ||
            "Failed to update business information";
          errorMessages.push(message);
          isErrorOccurred = true;
        });
      apiPromises.push(updateInfoPromise);

      // API calls for deleted documents
      removedDocList?.forEach((docId) => {
        const deleteDocumentPromise = deleteDocument(docId)
          .then((res) => {
            const message = res.data?.data?.message;
            successMessages.push(message);
          })
          .catch((err) => {
            const message = err?.response?.data?.error?.errorDescription;
            errorMessages.push(message);
            isErrorOccurred = true;
          });
        apiPromises.push(deleteDocumentPromise);
      });

      // API calls for new documents
      newDocumentList?.forEach((item) => {
        if (!item?.isFromBE) {
          const formData = new FormData();
          formData.append("tenantId", tenantId);
          formData.append("documentName", item?.documentName);
          formData.append("documentType", 1);
          formData.append("document", item?.document);

          const documentUploadPromise = documentUpload(formData)
            .then((res) => {
              const message = res.data.data?.message;
              successMessages.push(message);
            })
            .catch((err) => {
              const errorMessage = err?.response?.data?.error?.errorDescription;
              errorMessages.push(errorMessage);
              isErrorOccurred = true;
            });
          apiPromises.push(documentUploadPromise);
        }
      });

      // Execute all API calls in parallel
      await Promise.all(apiPromises);

      if (!isErrorOccurred) {
        // Display a single toast with all accumulated success messages
        if (successMessages.length > 0) {
          console.log(errorMessages);
        }

        setIsSaved(false);
        setIsModalOpen(false);
        textFormik.resetForm();
        setIsAddDocument(false);
        getDocuments();
        getInfo();
        setIsEdit(false);
      } else {
        // Display an error toast if any API call fails
        if (errorMessages.length > 0) {
          const errorArray = [...new Set(errorMessages)];
          errorArray?.forEach((item) => {
            // toast.error(item);
            console.log(item);
          });
        }

        setIsModalOpen(false);
        setIsSaved(false);
        getDocuments();
        textFormik.resetForm();
      }
    } catch (error) {
      setIsModalOpen(false);
      setIsSaved(false);
      textFormik.resetForm();
    }
  };

  const textFormik = useFormik({
    initialValues: {
      reason: "",
    },
    validationSchema: Yup.object().shape({
      reason: Yup.string()
        .test("no-emojis", "Cannot contain emojis", (val) => {
          return !emojiRegex.test(val);
        })
        .required("Reason is required")
        .matches(/^(?!\s+$)/, "Cannot contain only blankspaces"),
    }),
    onSubmit: applyChanges,
  });

  const downloadUrl = (document) => {
    setIsDocumentModal(true);
    setSelectedDoc(document);
    if (document?.isFromBE) {
      // getting s3 url for view doc...
      const payload = {
        url: document?.documentRefPath,
      };
      getUrl(payload)
        .then((res) => {
          const data = res?.data?.data?.url;
          setDocUrl(data);
        })
        .catch((err) => {});
    } else {
      setDocUrl(document?.documentUrl);
    }
  };

  return (
    <Card isHeader={false} className={styles.cardContainer}>
      {isLoading ? (
        <div className={styles.spinnerStyle}>
          <Spinner />
        </div>
      ) : (
        <>
          <div className={styles.businessTitleContainer}>
            <div className={styles.businessTitle}>Business Information</div>
            {!isAddDocument && (
              <div data-tooltip-id="noPermission">
                <button
                  type="button"
                  onClick={() => cancelEdit()}
                  className={
                    !hasPermission
                      ? styles.noPermission
                      : isEdit
                      ? styles.cancelButton
                      : styles.editButton
                  }
                  disabled={!hasPermission}
                >
                  {isEdit ? "Cancel" : "Edit"}
                </button>
              </div>
            )}
          </div>
          <AddDocumentModal
            show={isAddDocument}
            closeModal={() => setIsAddDocument(false)}
            tenantId={tenantId}
            newDocumentList={newDocumentList}
            setNewDocumentList={setNewDocumentList}
          />
          <div className={styles.details}>
            <div className={styles.detailsContainer}>
              <h1 className={styles.sideHeading}>Business Name</h1>
              <div>
                {isEdit ? (
                  <>
                    <FormField
                      id="businessName"
                      name="businessName"
                      className={styles.inputFields}
                      label="Business Name"
                      placeholder="Business Name"
                      maxLength={30}
                      {...infoFormik.getFieldProps("businessName")}
                      error={
                        infoFormik.touched.businessName &&
                        infoFormik.errors.businessName
                      }
                    />
                    <FormSelect
                      id="businessEntity"
                      name="businessEntity"
                      value={infoFormik.values.businessEntity}
                      error={
                        infoFormik.touched.businessEntity &&
                        infoFormik.errors.businessEntity
                      }
                      onChange={(option) => {
                        infoFormik.setFieldValue("businessEntity", option);
                      }}
                      label="Business Entity"
                      options={businessEntityOptions}
                      isBusinessEntity
                    />
                  </>
                ) : (
                  <>
                    <h1 className={styles.name}>{businessInfo?.name}</h1>
                    <span
                      className={`${styles.description} ${styles.bottomMargin}`}
                    >
                      {businessInfo?.businessEntity}
                    </span>
                  </>
                )}
                <span className={styles.moreDescription}>BID-{tenantId}</span>
              </div>
            </div>
            <HBar className={styles.bar} />
            <div className={styles.detailsContainer}>
              <h1 className={styles.sideHeading}>Business Start Date</h1>
              <span className={styles.description}>
                {businessInfo?.businessStartDate}
              </span>
            </div>
            <HBar className={styles.bar} />
            <div className={styles.detailsContainer}>
              <h1 className={styles.sideHeading}>Contact Information</h1>
              <div>
                {isEdit ? (
                  <>
                    <FormPhoneWithCode
                      label="Company Phone Number"
                      id="phoneNumber"
                      name="phoneNumber"
                      placeholder="Phone Number"
                      countryCode={countryRegex?.countryShortCode}
                      options={phoneCountryList}
                      selectedCode={countryRegex?.phoneCountryCode}
                      onCodeChange={(option, clickCount) => {
                        setCountryRegex(option);
                        if (clickCount >= 0) {
                          infoFormik.setFieldValue("phoneNumber", "");
                        }
                      }}
                      errorClassName="mt-[46px]"
                      {...infoFormik.getFieldProps("phoneNumber")}
                      error={
                        infoFormik.touched.phoneNumber &&
                        infoFormik.errors.phoneNumber
                      }
                    />
                    <FormField
                      id="email"
                      name="email"
                      maxLength={255}
                      label="Company Email Address"
                      placeholder="Company Email Address"
                      className={styles.inputFields}
                      {...infoFormik.getFieldProps("email")}
                      error={
                        infoFormik.touched.email && infoFormik.errors.email
                      }
                    />
                  </>
                ) : (
                  <>
                    <span
                      className={`${styles.description} ${styles.informationGap}`}
                    >
                      {findCountryCode(
                        businessInfo?.phoneNumberDto?.countryCode
                      )}{" "}
                      {businessInfo?.phoneNumberDto?.countryCode === "US"
                        ? phoneMask(businessInfo?.phoneNumberDto?.phoneNumber)
                        : internationalPhoneFormat(
                            businessInfo?.phoneNumberDto?.phoneNumber
                          )}
                    </span>

                    <EmailWidthCalculatorWithTooltip
                      id={businessInfo?.email}
                      label={businessInfo?.email?.split("@")[0]}
                      labelTwo={businessInfo?.email?.split("@")[1]}
                      // labelTwo={'hotmankjbhnjhil.com'}
                      toolTipContent={businessInfo?.email}
                      ellipsisNumber={20}
                      compareWidth={240}
                      className={styles.contactNameEllipsis}
                      compareClassName={styles.compareClassName}
                    />
                  </>
                )}
              </div>
            </div>
            <HBar className={isEdit ? styles.editBar : styles.bar} />
            <div className={styles.detailsContainer}>
              <h1 className={styles.sideHeading}>Address</h1>
              <div>
                {isEdit ? (
                  <>
                    <FormField
                      id="addressLine1"
                      name="addressLine1"
                      label="Mailing Address Line 1"
                      placeholder="Mailing Address Line 1"
                      maxLength={100}
                      className={styles.inputFields}
                      {...infoFormik.getFieldProps("addressLine1")}
                      error={
                        infoFormik.touched.addressLine1 &&
                        infoFormik.errors.addressLine1
                      }
                    />
                    <FormField
                      id="addressLine2"
                      name="addressLine2"
                      maxLength={100}
                      label="Mailing Address Line 2 (optional)"
                      placeholder="Mailing Address Line 2 (optional)"
                      className={styles.inputFields}
                      {...infoFormik.getFieldProps("addressLine2")}
                      error={
                        infoFormik.touched.addressLine2 &&
                        infoFormik.errors.addressLine2
                      }
                    />
                    <div className={styles.cityStateContainer}>
                      <FormField
                        id="city"
                        name="city"
                        label="City"
                        placeholder="City"
                        maxLength={30}
                        className={styles.smallInputFields}
                        {...infoFormik.getFieldProps("city")}
                        error={
                          infoFormik.touched.city && infoFormik.errors.city
                        }
                      />
                      <FormField
                        id="stateProvince"
                        name="stateProvince"
                        smallText={true}
                        maxLength={30}
                        label="State/Province (optional)"
                        placeholder="State/Province (optional)"
                        {...infoFormik.getFieldProps("stateProvince")}
                        error={
                          infoFormik.touched.stateProvince &&
                          infoFormik.errors.stateProvince
                        }
                      />
                    </div>
                    <div className={styles.cityStateContainer}>
                      <FormField
                        id="zipPostalCode"
                        name="zipPostalCode"
                        label="Zip/Postal code (optional)"
                        placeholder="Zip/Postal code (optional)"
                        smallText={true}
                        maxLength={10}
                        className={styles.smallInputFields}
                        {...infoFormik.getFieldProps("zipPostalCode")}
                        error={
                          infoFormik.touched.zipPostalCode &&
                          infoFormik.errors.zipPostalCode
                        }
                      />
                      <FormSelect
                        id="country"
                        name="country"
                        label="Country"
                        searchOption
                        showSearchIcon
                        options={countries}
                        value={infoFormik.values.country}
                        onChange={(option) => {
                          infoFormik.setFieldValue("country", option);
                        }}
                        error={
                          infoFormik.touched.country &&
                          infoFormik.errors.country
                        }
                        searchPlaceholder={`Search`}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <span className={styles.description}>
                      {businessInfo?.addressLine1}
                    </span>
                    <span className={styles.description}>
                      {businessInfo?.addressLine2}
                    </span>
                    <span className={styles.description}>
                      {businessInfo?.city}, {businessInfo?.state}{" "}
                      {businessInfo.zipCode}
                    </span>
                    <span className={styles.description}>
                      {businessInfo.country}
                    </span>
                  </>
                )}
              </div>
            </div>
            <HBar className={isEdit ? styles.editBar : styles.bar} />
            <div className={styles.detailsContainer}>
              <h1 className={styles.sideHeading}>Documents</h1>
              <div>
                {newDocumentList?.length === 0 ? (
                  <span
                    className={`${styles.description} ${
                      newDocumentList?.length === 0 && styles.noDoc
                    }`}
                  >
                    No Documents Added
                  </span>
                ) : (
                  newDocumentList?.map((doc, index) => {
                    return (
                      <div key={index} className={styles.docContainer}>
                        <div>
                          <div className={styles.buttonContainer}>
                            <button
                              type="button"
                              onClick={() => downloadUrl(doc)}
                              className={styles.docButton}
                            >
                              {doc?.fileName}
                            </button>
                            <span className={styles.docSize}>
                              ({doc?.documentSize} KB)
                            </span>
                            {isEdit && (
                              <>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setIsRemoveModal(true);
                                    setRemoveDocument(doc);
                                  }}
                                  data-tooltip-content="Remove Document"
                                  data-tooltip-id={`remove${index}`}
                                  className={`icon-close ${styles.closeButton}`}
                                />
                              </>
                            )}
                          </div>
                          <span className={styles.docName}>
                            {doc?.documentName}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
                {isEdit && newDocumentList?.length < 10 && (
                  <button
                    type="button"
                    className={styles.addButton}
                    onClick={() => setIsAddDocument(true)}
                  >
                    <span className={`${styles.plusIcon} icon-plus`} />
                    Add Document
                  </button>
                )}
              </div>
            </div>
            <HBar
              className={
                isEdit && newDocumentList?.length < 10
                  ? styles.lastBar
                  : styles.docBar
              }
            />
            {isEdit && (
              <div className={styles.saveButtonContainer}>
                <button
                  type="button"
                  onClick={() => cancelEdit()}
                  className={styles.cancelEditButton}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className={`${styles.saveButton} ${
                    isAnyChanges()
                      ? styles.saveButtonInactive
                      : styles.saveButtonActive
                  }`}
                  disabled={isAnyChanges()}
                >
                  Save
                </button>
              </div>
            )}
            <SaveModal
              show={isModalOpen}
              closeModal={() => {
                setIsModalOpen(false);
                textFormik.resetForm();
              }}
              isSaved={isSaved}
              applyChanges={applyChanges}
              textFormik={textFormik}
            />
            <DocumentModal
              show={isDocumentModal}
              closeModal={() => {
                setIsDocumentModal(false);
                setSelectedDoc({});
                setDocUrl("");
              }}
              document={selectedDoc}
              docUrl={docUrl}
            />
            <RemoveModal
              show={isRemoveModal}
              document={removeDocument}
              closeModal={() => setIsRemoveModal(false)}
              newDocumentList={newDocumentList}
              setNewDocumentList={setNewDocumentList}
              removedDocList={removedDocList}
              setRemovedDocList={setRemovedDocList}
            />
          </div>
        </>
      )}
    </Card>
  );
}

const DocumentModal = ({
  show = false,
  closeModal,
  document = {},
  docUrl = "",
}) => {
  const isPdf = document?.fileName?.slice(-3) === "pdf";
  const [numPages, setNumPages] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  // // Function to download the file on button click
  const handleButtonClick = async (url) => {
    try {
      // Fetch the image data from the provided URL
      const response = await fetch(url);
      // Get the image data as a Blob
      const blob = await response.blob();
      // Use the "file-saver" library to trigger the download
      saveAs(blob, document?.fileName);
      setIsDownloading(false);
    } catch (error) {
      // Handle any errors that occur during the download process
      // It wont fail but this is for worst case scenario as if download url already succeeds then only it will work and we don't need to show error here, so consoling it..
      console.error("Error downloading image:", error);
      setIsDownloading(false);
    }
  };

  // calling this download url again here when user clicks download file because it we are using same url for image and download, so browsers saves the cache if there is no difference in image url. So i am calling it again to trigger the server and browser
  const downloadUrl = () => {
    setIsDownloading(true);
    const payload = {
      url: document?.documentRefPath,
    };

    getUrl(payload)
      .then((res) => {
        const data = res?.data?.data?.url;
        handleButtonClick(data);
      })
      .catch((err) => {
        const errorMessage =
          err?.response?.data?.error?.errorDescription ||
          "Failed to get the document";
        console.log(errorMessage);
      });
  };

  return (
    <Modal
      show={show}
      onClose={closeModal}
      showCloseButton
      className={styles.documentModal}
    >
      <h1 className={styles.documentModalHeader}>
        {document?.fileName}
        <span className={styles.documentSize}>
          ({document?.documentSize} KB)
        </span>
      </h1>
      <button
        type="button"
        onClick={() => {
          document?.isFromBE ? downloadUrl() : handleButtonClick(docUrl);
        }}
        className={`${styles.documentDownload} ${
          !isDownloading && styles.documentDownloadActive
        }`}
        disabled={isDownloading}
      >
        {isDownloading ? "Downloading..." : "Download File"}
      </button>
      <div className={styles.documentModalContainer}>
        <div className={styles.previewContainer}>
          {docUrl === "" ? (
            <div className={styles.spinnerContainer}>
              <Spinner />
            </div>
          ) : (
            <>
              {isPdf ? (
                <Document
                  file={docUrl}
                  onLoadSuccess={onDocumentLoadSuccess}
                  externalLinkTarget={"_blank"}
                  className={`${styles.pdfContent}`}
                >
                  {Array.from(new Array(numPages), (el, index) => (
                    <ReactPdfPage
                      width={295}
                      key={`page_${index + 1}`}
                      pageNumber={index + 1}
                      scale={2.0}
                    />
                  ))}
                </Document>
              ) : (
                <img src={docUrl} alt="document" className={styles.preview} />
              )}
            </>
          )}
        </div>
      </div>
    </Modal>
  );
};

const SaveModal = ({ show = false, closeModal, isSaved, textFormik }) => {
  return (
    <Modal
      show={show}
      onClose={closeModal}
      showCloseButton
      className={styles.saveModal}
    >
      <div className={styles.saveModalContainer}>
        <h1 className={styles.saveModalHeader}>Change Business Information</h1>
        <span className={styles.saveModalDescription}>
          Are you sure you want to change this business’ information? This will
          be reflected immediately in their business settings.
        </span>
        <span className={styles.saveModalReason}>Reason for change:</span>
        <FormTextArea
          id="reason"
          name="reason"
          placeHolder="Enter the reason for changing business information"
          className={styles.saveModalTextInput}
          rows={4}
          charLimit={120}
          maxLength={120}
          {...textFormik.getFieldProps("reason")}
          disableLabelTop={true}
          error={textFormik.touched.reason && textFormik.errors.reason}
        />
        <div className={styles.saveModalButton}>
          {isSaved ? (
            <Spinner size={40} />
          ) : (
            <Button
              disabled={!(textFormik.isValid && textFormik.dirty)}
              onClick={textFormik.handleSubmit}
            >
              Apply Changes
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};

const RemoveModal = ({
  show = false,
  closeModal,
  document,
  newDocumentList,
  setNewDocumentList,
  removedDocList,
  setRemovedDocList,
}) => {
  const [isDisabled, setIsDisabled] = useState(false);

  const removeDocument = () => {
    setIsDisabled(true);
    const updatedList = newDocumentList?.filter(
      (item) => item?.id !== document?.id
    );
    setNewDocumentList(updatedList);

    const removeList = [...removedDocList];
    if (document?.isFromBE) {
      removeList.push(document?.id);
    }

    setRemovedDocList(removeList);
    closeModal();
    setIsDisabled(false);
  };

  return (
    <Modal
      show={show}
      onClose={closeModal}
      showCloseButton
      className={styles.removeModal}
    >
      <h1 className={styles.saveModalHeader}>Remove Document?</h1>
      <div className={styles.paperContainer}>
        <span className={`icon-attach ${styles.clip}`} />
        <h1 className={styles.documentFileName}>{document?.fileName}</h1>
        <span className={styles.documentFileSize}>
          ({document?.documentSize} KB)
        </span>
      </div>
      <div className={styles.buttonsContainer}>
        <Button disabled={isDisabled} onClick={removeDocument}>
          Remove
        </Button>
        <button
          type="button"
          className={styles.cancelButton}
          onClick={closeModal}
        >
          Cancel
        </button>
      </div>
    </Modal>
  );
};

const AddDocumentModal = ({
  show = false,
  closeModal,
  tenantId,
  newDocumentList,
  setNewDocumentList,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [file, setFile] = useState({});

  const addDocument = (values) => {
    setIsDisabled(true);
    const getNewId = newDocumentList[0]?.id;
    const newDocument = {
      id: getNewId ? getNewId + 1 : 1,
      tenantId,
      fileName: values.document?.name,
      documentName: values.documentName?.trim(),
      documentSize: Math.floor(values.document?.size / 1024),
      document: values.document,
      isFromBE: false,
      documentUrl: URL.createObjectURL(values.document),
    };

    const updatedList = [newDocument, ...newDocumentList];
    setNewDocumentList(updatedList);
    documentFormik.resetForm();
    setIsDisabled(false);
    closeModal();
  };

  const MAX_FILE_SIZE_BYTES = 4 * 1024 * 1024; // 4MB in bytes
  const supportedFormats = ["jpg", "jpeg", "png", "pdf"];

  const documentFormik = useFormik({
    initialValues: {
      documentName: "",
      document: null,
    },
    validationSchema: Yup.object().shape({
      documentName: Yup.string()
        .test("no-emojis", "Cannot contain emojis", (val) => {
          return !emojiRegex.test(val);
        })
        .required("Document name is required")
        .matches(/^(?!\s+$)/, "Cannot contain only blank spaces")
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
    }),
    onSubmit: addDocument,
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
    <Modal
      show={show}
      onClose={() => {
        closeModal();
        documentFormik.resetForm();
        setIsDisabled(false);
      }}
      showCloseButton
      className={styles.addDocumentModal}
    >
      <div className={styles.addContainer}>
        <h1 className={styles.addDocumentHeader}>Add Document</h1>
        <FormFile
          id="document"
          name="document"
          label="Upload Document"
          accept=".pdf, .jpg, .png, .jpeg"
          className={styles.addDocumentUpload}
          isUploading={isUploading}
          successIcon={true}
          onSelectFile={(file) => handleUpload(file)}
          onRemoveFile={() => {
            setFile({});
            documentFormik.setFieldValue("document", null);
          }}
          {...documentFormik.getFieldProps("document")}
          errorMessage={documentFormik.errors.document}
          isUsedInModal
        />
        <FormField
          id="documentName"
          name="documentName"
          label="Document Name"
          placeholder="Document Name"
          className={styles.addDocumentName}
          maxLength={60}
          {...documentFormik.getFieldProps("documentName")}
          error={
            documentFormik.touched.documentName &&
            documentFormik.errors.documentName
          }
        />
        <Button
          disabled={
            !(documentFormik.isValid && documentFormik.dirty) || isDisabled
          }
          onClick={documentFormik.handleSubmit}
        >
          Add
        </Button>
        <button
          type="button"
          onClick={() => {
            closeModal();
            setIsDisabled(false);
            documentFormik.resetForm();
          }}
          className={styles.addDocumentCancel}
        >
          Cancel
        </button>
      </div>
    </Modal>
  );
};
