import { Button } from "@mui/joy";
import { useFormik } from "formik";
import { useEffect, useMemo, useRef, useState } from "react";
import * as Yup from "yup";
import { BusinessContactTypeEnum } from "../../Enums/BusinessContactTypeEnum";
import { PhoneCountryListEnum } from "../../Enums/PhoneCountryListEnum";
import { useOutsideClick } from "../../Hooks/useOutsideClick";
import backArrowIcon from "../../assets/back-arrow.svg";
import ryvylTickMark from "../../assets/ryvylTickMark.svg";
import { HBar } from "../../components/Bars/Bars";
import { AddingButton } from "../../components/Buttons/Buttons";
import DuplicateContactModal from "../../components/DuplicateContactModal/DuplicateContactModal";
import ExitButton from "../../components/ExitButton/ExitButton";
import {
  FormField,
  FormPhoneWithCode,
} from "../../components/FormField/FormField";
import {
  addNewPointOfContact,
  addPointOfContact,
  getPhoneCountryList,
  getPointOfContactDetails,
  removePointOfContact,
  updatePointOfContact,
  validatePointOfContact,
} from "../../services/profiles/poc";
import styles from "./PointOfContact.module.scss";

type PointOfContactProps = {
  onBack: () => void;
  onSubmit: () => void;
  tenantId: any | null;
  onDeleteChanges: () => void;
  onUpdateTracker: () => void;
};

export const PointOfContact: React.FunctionComponent<PointOfContactProps> = ({
  onBack,
  onSubmit,
  tenantId,
  onDeleteChanges,
  onUpdateTracker,
}) => {
  const [step, setStep] = useState(0);
  const [showButtonModal, setShowButtonModal] = useState("");
  const [resetForm, setResetForm] = useState(false);
  const [duplicateInvitation, setDuplicateInvitation] = useState(false);
  const [countryRegex, setCountryRegex] = useState("");
  const [countryData, setCountryData] = useState([]);
  const [primaryContacts, setPrimaryContacts] = useState([]);
  const [countryCode, setCountryCode] = useState("");
  const [editData, setEditData] = useState([]);
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [countryCodeError, setCountryCodeError] = useState(false);
  const [pointOfContactData, setPointOfContactData] = useState([]);
  const [contactType, setContactType] = useState("");
  const [isDisableNextButton, setIsDisableNextButton] = useState(false);
  const [disable, setDisable] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editStep, SetEditStep] = useState(false);
  const modalRef = useRef(null);

  useOutsideClick(modalRef, () => {
    if (showButtonModal !== "") {
      setShowButtonModal("");
    }
  });

  useEffect(() => {
    if (step === 0 && !editStep) {
      getNewUserDetails(tenantId);
    }
    if (step == 1) {
      getCountryList();
    }
  }, [step]);

  // getList of Countries
  const getCountryList = () => {
    getPhoneCountryList(PhoneCountryListEnum.POCCountryList)
      .then((res) => {
        const data = res?.data?.data;
        const sortedList = data?.sort((a, b) =>
          a?.country.localeCompare(b?.country)
        );
        setCountryData(sortedList);
      })
      .catch((err) => {});
  };

  useEffect(() => {
    //Here from Backend we are getting different data based on that we are filtering the data for error handling
    if (editData.length !== 0) {
      const countryShortCode = countryData?.filter(
        (contact) =>
          contact?.countryShortCode == editData?.phoneNumberDto?.countryCode
      );
      setCountryCode(countryShortCode);
    }
  }, [countryData]);

  useEffect(() => {
    if (step == 1) {
      formik.setValues({
        firstName: editData.firstName,
        lastName: editData.lastName,
        email: editData.email,
        phoneCode: countryCode[0]?.phoneCountryCode,
        phoneNumber: editData?.phoneNumberDto?.phoneNumber,
      });
    }
  }, [step, editData, countryCode]);

  const handleClose = () => {
    setStep(0);
    SetEditStep(true);
    formik.resetForm();
  };

  //Create New User Contact
  const handleSave = (value) => {
    setDisable(true);
    const data = {
      tenantId: tenantId,
      firstName: value?.firstName.trim(),
      lastName: value?.lastName.trim(),
      email: value?.email,
      contactType: showButtonModal + 1,
      phoneNumberDto: {
        countryCode: countryRegex?.countryShortCode,
        phoneNumber: value?.phoneNumber?.replace(/[^\d]/g, ""),
      },
    };
    setShowButtonModal("");
    addNewPointOfContact(data)
      .then((res) => {
        getNewUserDetails(tenantId);
        handleClose();
        setDuplicateInvitation(false);
        setDisable(false);
      })
      .catch((err) => {
        const message = err?.response?.data?.error?.errorDescription;
        const emailRegex = /[\w\.-]+@[\w\.-]+\.\w{2,}/g;
        const phoneRegex = /\b\d{7,}\b/g;
        setPhoneNumber(message.match(phoneRegex));
        setEmail(message.match(emailRegex));
        setDuplicateInvitation(true);
        setDisable(false);
      });
  };

  const getNewUserDetails = (id) => {
    setIsLoading(true);
    getPointOfContactDetails(id)
      .then((res) => {
        const data = res?.data?.data;
        setPointOfContactData(data);

        const primaryContacts = data.filter((contact) =>
          contact.contacts.includes(BusinessContactTypeEnum.Primary)
        );
        const technicalContacts = data.filter((contact) =>
          contact.contacts.includes(BusinessContactTypeEnum.Technical)
        );
        const FinancialContacts = data.filter((contact) =>
          contact.contacts.includes(BusinessContactTypeEnum.FinancialBilling)
        );

        const contactDetails = [
          {
            ContactName: "Primary Contacts",
            details: primaryContacts,
            contactId: BusinessContactTypeEnum.Primary,
          },
          {
            ContactName: "Technical Contacts",
            details: technicalContacts,
            contactId: BusinessContactTypeEnum.Technical,
          },
          {
            ContactName: "Financial/Billing Contacts",
            details: FinancialContacts,
            contactId: BusinessContactTypeEnum.FinancialBilling,
          },
        ];
        const isNextButtonDisabled = contactDetails.map(
          (item) => item.details.length >= 1
        );
        //Here we are handling next button is disabled min one contact in each type
        setIsDisableNextButton(isNextButtonDisabled.includes(false));
        setPrimaryContacts(contactDetails);
        onUpdateTracker(isNextButtonDisabled.includes(false));
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
      });
  };

  // update the contact Details
  const handleUpdatePointOfContact = (item) => {
    const data = {
      tenantId: tenantId,
      contactType: showButtonModal + 1,
      contactId: item,
    };
    addPointOfContact(data)
      .then((res) => {
        getNewUserDetails(tenantId);
      })
      .catch((err) => {});
  };

  //Remove Merchant user from List
  const handleCancelPointOfContact = (item, id) => {
    setDisable(true);
    const data = {
      tenantId: tenantId,
      contactType: id,
      contactId: item,
    };
    removePointOfContact(data)
      .then((res) => {
        getNewUserDetails(tenantId);
        const message = res.data.data.message;
        const isNextButtonDisabled = primaryContacts.map(
          (item) => item.details.length === 1
        );
        if (isNextButtonDisabled.every((value) => value === true)) {
          onDeleteChanges(true);
        } else {
          onDeleteChanges(false);
        }
        setDisable(false);
      })
      .catch((err) => {
        setDisable(false);
      });
  };

  //update user details
  const handleUpdateContact = (contactId, value) => {
    setDisable(true);
    const data = {
      tenantId: tenantId,
      firstName: value?.firstName.trim(),
      lastName: value?.lastName.trim(),
      email: value?.email,
      contactType: contactType,
      phoneNumberDto: {
        countryCode:
          countryRegex == ""
            ? countryCode[0]?.countryShortCode
            : countryRegex?.countryShortCode,
        phoneNumber: value?.phoneNumber?.replace(/[^\d]/g, ""),
      },
    };
    updatePointOfContact(contactId, data)
      .then((res) => {
        getNewUserDetails(tenantId);
        const message = res.data.data.message;
        handleClose();
        setDisable(false);
      })
      .catch((err) => {
        const message = err?.response?.data?.error?.errorDescription;
        const emailRegex = /[\w\.-]+@[\w\.-]+\.\w{2,}/g;
        const phoneRegex = /\b\d{7,}\b/g;
        setPhoneNumber(message.match(phoneRegex));
        setEmail(message.match(emailRegex));
        setDuplicateInvitation(true);
        setDisable(false);
      });
  };

  const handleUpdate = (value) => {
    handleUpdateContact(editData?.id, value);
  };

  const validateContacts = (id) => {
    setDisable(true);
    validatePointOfContact(id)
      .then((res) => {
        onSubmit();
        setDisable(false);
      })
      .catch((err) => {
        setDisable(false);
      });
  };

  const regex = /^[a-zA-Z\s]*$/g;
  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneCode: "",
      phoneNumber: "",
    },
    validationSchema: Yup.object({
      firstName: Yup.string()
        .required("First Name is required")
        .matches(regex, {
          message: "Cannot accept numbers or special characters",
        })
        .matches(
          /^(?!\s)[a-zA-Z0-9_\s-]*$/,
          "This field cannot contain only blankspaces"
        )
        .min(2, "First Name must be at least 2 characters"),
      lastName: Yup.string()
        .required("Last Name is required")
        .matches(regex, {
          message: "Cannot accept numbers or special characters",
        })
        .matches(
          /^(?!\s)[a-zA-Z0-9_\s-]*$/,
          "This field cannot contain only blankspaces"
        )
        .min(2, "Last Name must be at least 2 characters"),
      email: Yup.string()
        .required("Email Address is required")
        .matches(
          /^([a-zA-Z0-9_.-])+@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,6}$)+$/,
          "Invalid Email"
        ),
      phoneNumber: Yup.string()
        .required("Please enter Phone Number")
        .test(
          "len",
          `Phone Number must be min ${
            countryRegex != ""
              ? countryRegex?.minLength
              : countryCode[0]?.minLength
          } and max ${
            countryRegex != ""
              ? countryRegex?.maxLength
              : countryCode[0]?.maxLength
          } digits`,
          (value) =>
            value?.replace(/[^\d]/g, "")?.toString().length >=
              (countryRegex != ""
                ? countryRegex?.minLength
                : countryCode[0]?.minLength) &&
            value?.replace(/[^\d]/g, "")?.toString().length <=
              (countryRegex != ""
                ? countryRegex?.maxLength
                : countryCode[0]?.maxLength)
        ),
      phoneCode: Yup.string().required("Please select Country Code"),
    }),
    onSubmit: (value) => {
      if (editData.length == "") {
        handleSave(value);
      } else {
        handleUpdate(value);
      }
    },
  });

  useEffect(() => {
    if (countryRegex?.countryShortCode) {
      formik.setFieldTouched("phoneNumber", true);
    }
  }, [countryRegex]);

  // here we are assigning values are getting from backend
  const disableResendButton = useMemo(() => {
    return (
      editData?.firstName !== formik.values.firstName ||
      editData?.lastName !== formik.values.lastName ||
      editData?.email !== formik.values.email ||
      editData?.phoneNumberDto?.phoneNumber !==
        formik.values.phoneNumber?.replace(/[^\d]/g, "") ||
      countryCode[0]?.phoneCountryCode !== formik.values.phoneCode
    );
  }, [formik, editData, countryCode]);

  const toggleHandler = (index) => {
    if (index !== showButtonModal) {
      setShowButtonModal(index);
    } else {
      setShowButtonModal("");
    }
  };

  useEffect(() => {
    if (editData.length == "") {
      if (formik?.values?.phoneNumber?.length >= 1 && !countryRegex) {
        setCountryCodeError(true);
      } else {
        setCountryCodeError(false);
      }
    }
  }, [countryRegex, formik?.values?.phoneNumber, editData]);

  return (
    <div>
      {!isLoading && (
        <div>
          {step == 0 && (
            <div className={`${styles.pocContainer}`}>
              <div>
                <p className={`${styles.pocTitle}`}>Points of Contact</p>
                <p className={`${styles.pocParaHeading}`}>
                  Provide the main points of contact for the business. Up to
                  five contacts per type.
                </p>
                <div>
                  {primaryContacts?.map((item, index) => (
                    <div
                      key={index}
                      className={`${styles.contactsClassName} ${
                        item?.details?.length == 5 &&
                        styles.contactsClassName_lastContact
                      }`}
                    >
                      <p className={`${styles.contactsHeadingClassName}`}>
                        {item?.ContactName}
                      </p>
                      <div className={`${styles.pointOfContactContainer}`}>
                        {item?.details?.map((contactDetails, index) => (
                          <div
                            key={index}
                            className={`${styles.contactInputField}`}
                          >
                            <WidthCalculator
                              label={`${contactDetails?.firstName} ${contactDetails?.lastName}`}
                              id={contactDetails?.email}
                            />
                            <div className={styles.iconContainer}>
                              <button
                                className={`icon-edit ${styles.editIcon} ${styles.editIcon_edit}`}
                                data-tooltip-id="edit-icon"
                                data-tooltip-content="Edit contact"
                                onClick={() => {
                                  setStep(1);
                                  setEditData(contactDetails);
                                  setContactType(item?.contactId);
                                }}
                              ></button>
                              <button
                                className={`icon-close ${styles.editIcon}`}
                                disabled={disable}
                                onClick={() => {
                                  handleCancelPointOfContact(
                                    contactDetails?.id,
                                    item?.contactId
                                  );
                                }}
                                data-tooltip-id="edit-icon"
                                type="button"
                                data-tooltip-content="Remove contact"
                              ></button>
                            </div>
                          </div>
                        ))}

                        <div className={`${styles.addButtonContainer}`}>
                          {item?.details?.length < 5 && (
                            <div
                              ref={showButtonModal == index ? modalRef : null}
                            >
                              <AddingButton
                                size={"lg"}
                                onClick={() => {
                                  toggleHandler(index);
                                  pointOfContactData?.length == 0 && setStep(1);
                                }}
                                icon={"plus"}
                                color="bg-cm6"
                                className={`${styles.addContactButton} ${
                                  item?.details?.length > 0 &&
                                  styles.addContactButton_buttonDetails
                                } ${
                                  showButtonModal == index &&
                                  showButtonModal !== "" &&
                                  styles.addContactButton_openState
                                }`}
                              >
                                Add Contact
                              </AddingButton>
                            </div>
                          )}

                          {showButtonModal == index &&
                            showButtonModal !== "" && (
                              <div
                                className={`${styles.multipleButtonContainer}`}
                              >
                                <div className={styles.contactsContainer}>
                                  {pointOfContactData?.map((item, index) => (
                                    <div
                                      key={index}
                                      className={`${styles.nameContainer}`}
                                      onClick={() => {
                                        !item?.contacts.includes(
                                          showButtonModal + 1
                                        ) &&
                                          handleUpdatePointOfContact(item?.id);
                                      }}
                                    >
                                      <p
                                        className={` ${
                                          item?.contacts.includes(
                                            showButtonModal + 1
                                          )
                                            ? styles.ContactName
                                            : styles.nameContainerHover
                                        }`}
                                      >
                                        {`${item?.firstName} ${item?.lastName}`}
                                      </p>
                                      {item?.contacts.includes(
                                        showButtonModal + 1
                                      ) && (
                                        <img
                                          src={ryvylTickMark}
                                          className={`${styles.tickMark}`}
                                        />
                                      )}
                                    </div>
                                  ))}
                                </div>
                                <HBar className={`${styles.hBarClassName}`} />
                                <div
                                  className={`${styles.createButtonContainer}`}
                                >
                                  <button
                                    onClick={() => {
                                      setStep(1);
                                      setEditData([]);
                                      setCountryCode("");
                                      setCountryRegex("");
                                    }}
                                    className={styles.createContactButton}
                                  >
                                    <span
                                      className={`icon-plus ${styles.plusIcon}`}
                                    />
                                    <p
                                      className={`${styles.createContactText}`}
                                    >
                                      Create New
                                    </p>
                                  </button>
                                </div>
                              </div>
                            )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <div className={`${styles.backButtonContainer}`}>
                  <button
                    className={styles.cancel}
                    type="button"
                    onClick={() => {
                      onBack();
                    }}
                  >
                    Back
                  </button>
                  <div className={styles.exitButtonContainer}>
                    <ExitButton />
                    <Button
                      disabled={isDisableNextButton || disable}
                      onClick={() => validateContacts(tenantId)}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
          {step == 1 && (
            <div>
              <button
                onClick={() => {
                  setStep(0);
                  formik.resetForm();
                }}
                type="button"
                className="self-start"
              >
                <img src={backArrowIcon} width="21" height="18" />
              </button>
              <div>
                <div className={`${styles.addNewContactDetails}`}>
                  <p className={`${styles.pocTitle}`}>
                    {editData.length != "" ? "Edit Contact" : "New Contact"}
                  </p>
                  <div className={`${styles.formFieldContainer}`}>
                    <div
                      className={`${styles.formFieldContainer_fieldsDetails}`}
                    >
                      <FormField
                        label="First Name"
                        disableNumbers={true}
                        disableSymbols={true}
                        id="firstName"
                        name="firstName"
                        placeholder="First Name"
                        maxLength={30}
                        autoFocus={true}
                        {...formik.getFieldProps("firstName")}
                        error={
                          formik.touched.firstName && formik.errors.firstName
                        }
                      />
                      <FormField
                        label="Last Name"
                        id="lastName"
                        name="lastName"
                        disableNumbers={true}
                        disableSymbols={true}
                        placeholder="Last Name"
                        maxLength={30}
                        {...formik.getFieldProps("lastName")}
                        error={
                          formik.touched.lastName && formik.errors.lastName
                        }
                      />
                    </div>
                    <div
                      className={`${styles.formFieldContainer_fieldsDetails}`}
                    >
                      <FormField
                        label="Email Address"
                        name="email"
                        id={"Email"}
                        placeholder="Email Address"
                        maxLength={255}
                        {...formik.getFieldProps("email")}
                        error={formik.touched.email && formik.errors.email}
                      />
                      <FormPhoneWithCode
                        label="Phone Number"
                        id="Phone Number"
                        placeholder="Phone Number"
                        countryCode={
                          countryRegex == ""
                            ? countryCode[0]?.countryShortCode
                            : countryRegex?.countryShortCode
                        }
                        options={countryData}
                        selectedCode={formik?.values?.phoneCode}
                        onCodeChange={(option, clickCount) => {
                          setCountryRegex(option);
                          formik.setFieldValue(
                            "phoneCode",
                            option.phoneCountryCode
                          );
                          if (clickCount >= 0 && editData.length != "") {
                            formik.setFieldValue("phoneNumber", "");
                          }
                          if (clickCount >= 1 && editData.length == "") {
                            formik.setFieldValue("phoneNumber", "");
                          }
                        }}
                        errorClassName="mt-[46px]"
                        {...formik.getFieldProps("phoneNumber")}
                        error={
                          //here phoneNumber and country code are in two different components that's why i am handling that errors 1st time we are not getting any error from backend so it is coming like undefined that's why we are handling errors here
                          countryCodeError
                            ? formik.touched.countryCode &&
                              formik.errors.countryCode
                            : formik.touched.phoneNumber &&
                              formik.errors.phoneNumber
                        }
                        resetForm={resetForm}
                      />
                    </div>
                    <div className={`${styles.buttonContainer}`}>
                      <button
                        type="submit"
                        className={`${styles.cancelButton}`}
                        onClick={() => {
                          formik.resetForm();
                          setResetForm(true);
                          setStep(0);
                        }}
                      >
                        Cancel
                      </button>
                      <Button
                        className={`${styles.addingButton}`}
                        disableClassName={styles.disableClassName}
                        disable={
                          !(
                            formik.isValid &&
                            formik.dirty &&
                            disableResendButton
                          ) || disable
                        }
                        onClick={formik.handleSubmit}
                      >
                        Add
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DuplicateContactModal
            show={duplicateInvitation}
            onclose={() => setDuplicateInvitation(false)}
            email={email}
            phoneNumber={phoneNumber}
            countryCode={
              countryRegex == ""
                ? countryCode[0]?.countryShortCode
                : countryRegex?.countryShortCode
            }
            countryNumber={
              countryRegex == ""
                ? countryCode[0]?.phoneCountryCode
                : countryRegex?.phoneCountryCode
            }
          />
        </div>
      )}
    </div>
  );
};

const WidthCalculator = ({ label, id }) => {
  const [width, setWidth] = useState(0);
  const textRef = useRef(null);
  useEffect(() => {
    if (textRef.current) {
      const boundingBox = textRef.current.getBoundingClientRect();
      setWidth(Math.floor(boundingBox.width));
    }
  }, []);

  return (
    <div>
      <h1
        ref={textRef}
        data-tooltip-id={width > 288 ? id : ""}
        className={`${styles.editContactName} ${
          width > 288 && styles.contactNameEllipsis
        }`}
      >
        {label}
      </h1>
    </div>
  );
};
