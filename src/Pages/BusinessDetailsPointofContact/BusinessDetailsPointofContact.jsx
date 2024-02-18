import styles from "./BusinessDetailsPointofContact.module.scss";
import tick from "../../assets/tick.svg";
import threeDots from "../../assets/three-dots.jpg";
import plusIcon from "../../assets/plus-icon-blue.svg";
import { useEffect, useRef, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useParams } from "react-router-dom";
import { getStorage } from "../../services/Storage";
import { LocalStorageKeysEnum } from "../../Enums/LocalStorageKeysEnum";
import { PermissionTypeEnum } from "../../Enums/PermissionTypeEnum";
import {
  addContact,
  getAllContacts,
  getPhoneCountryList,
  newContact,
  removeContact,
  updateContact,
} from "../../services/profiles/poc";
import { PhoneCountryListEnum } from "../../Enums/PhoneCountryListEnum";
import Card from "../../components/Card/Card";
import Spinner from "../../components/Spinner/Spinner";
import {
  FormField,
  FormPhoneWithCode,
} from "../../components/FormField/FormField";
import DuplicateContactModal from "../../components/DuplicateContactModal/DuplicateContactModal";
import { useOutsideClick } from "../../Hooks/useOutsideClick";
import EmailWidthCalculatorWithTooltip from "../../components/EmailWidthCalculatorWithTooltip/EmailWidthCalculatorWithTooltip";
import formatPhoneNumber from "../../helpers/formatPhoneNumber";
import { internationalPhoneFormat } from "../../helpers/internationalPhoneFormat";
import Modal from "../../components/Modal/Modal";
import { Button } from "@mui/joy";

export default function BusinessDetailsPointOfContact() {
  const { id: tenantId } = useParams();
  const [step, setStep] = useState(0);
  const [selectedContact, setSelectedContact] = useState({});
  const [isAddDropdown, setIsAddDropdown] = useState(false);
  const [isEditOptions, setIsEditOptions] = useState(null);
  const [allContacts, setAllContacts] = useState([]);
  const [primaryContacts, setPrimaryContacts] = useState([]);
  const [technicalContacts, setTechnicalContacts] = useState([]);
  const [billingContacts, setBillingContacts] = useState([]);
  const [phoneCountryList, setPhoneCountryList] = useState([]);
  const [contactNum, setContactNum] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    // fetching the authorities of user for restricting the user from editing
    const userAuthority = getStorage(LocalStorageKeysEnum?.authorities);
    const parsedData = JSON.parse(userAuthority);
    setHasPermission(
      parsedData?.ADMIN_BUSINESS_EDIT ==
        PermissionTypeEnum?.BusinessProfilesEdit
    );
    getContacts();
    getCountryList();
  }, []);

  const getCountryList = () => {
    getPhoneCountryList(PhoneCountryListEnum.POCCountryList)
      .then((res) => {
        const response = res.data?.data;
        const sortedList = response?.sort((a, b) =>
          a?.country.localeCompare(b?.country)
        );
        setPhoneCountryList(sortedList);
      })
      .catch((err) => {
        const message =
          err?.response?.data?.error?.errorDescription ||
          "Failed to get country list";
        console.log(message);
      });
  };

  const getContacts = () => {
    setIsLoading(true);
    getAllContacts(tenantId)
      .then((res) => {
        const response = res.data?.data;
        setAllContacts(response);
        const oneContacts = response?.filter((item) =>
          item?.contacts?.includes(1)
        );
        setPrimaryContacts(oneContacts);
        const twoContacts = response?.filter((item) =>
          item?.contacts?.includes(2)
        );
        setTechnicalContacts(twoContacts);
        const threeContacts = response?.filter((item) =>
          item?.contacts?.includes(3)
        );
        setBillingContacts(threeContacts);
        setIsLoading(false);
      })
      .catch((err) => {
        const message =
          err?.response?.data?.error?.errorDescription ||
          "Failed to get contacts";
        console.log(message);
        setIsLoading(false);
      });
  };

  return (
    <Card
      isHeader={false}
      className={`${step !== 0 && styles.contactContainerHeight} ${
        styles.pocCardContainer
      }`}
    >
      {isLoading ? (
        <div className={styles.spinnerContainer}>
          <Spinner />
        </div>
      ) : (
        <>
          {step === 0 && (
            <>
              <div className={styles.pocTitle}>Points of Contact</div>
              <div className={styles.contacts}>
                <ContactContainer
                  contactHeader="primary"
                  type={1}
                  contactData={primaryContacts}
                  onEdit={() => setStep(2)}
                  onNew={() => setStep(1)}
                  setSelectedContact={(selectedData) =>
                    setSelectedContact(selectedData)
                  }
                  isAddDropdown={isAddDropdown}
                  setIsAddDropdown={setIsAddDropdown}
                  isEditOptions={isEditOptions}
                  setIsEditOptions={setIsEditOptions}
                  countryList={phoneCountryList}
                  allContacts={allContacts}
                  getContacts={getContacts}
                  setContactNum={setContactNum}
                  tenantId={tenantId}
                  hasPermission={hasPermission}
                />
                <ContactContainer
                  contactHeader="technical"
                  type={2}
                  contactData={technicalContacts}
                  onEdit={() => setStep(2)}
                  onNew={() => setStep(1)}
                  setSelectedContact={(selectedData) =>
                    setSelectedContact(selectedData)
                  }
                  isAddDropdown={isAddDropdown}
                  setIsAddDropdown={setIsAddDropdown}
                  isEditOptions={isEditOptions}
                  setIsEditOptions={setIsEditOptions}
                  countryList={phoneCountryList}
                  allContacts={allContacts}
                  getContacts={getContacts}
                  setContactNum={setContactNum}
                  tenantId={tenantId}
                  hasPermission={hasPermission}
                />
                <ContactContainer
                  contactHeader="financial/billing"
                  type={3}
                  contactData={billingContacts}
                  onEdit={() => setStep(2)}
                  onNew={() => setStep(1)}
                  setSelectedContact={(selectedData) =>
                    setSelectedContact(selectedData)
                  }
                  isAddDropdown={isAddDropdown}
                  setIsAddDropdown={setIsAddDropdown}
                  isEditOptions={isEditOptions}
                  setIsEditOptions={setIsEditOptions}
                  countryList={phoneCountryList}
                  allContacts={allContacts}
                  getContacts={getContacts}
                  setContactNum={setContactNum}
                  tenantId={tenantId}
                  hasPermission={hasPermission}
                />
              </div>
            </>
          )}
          {step === 1 && (
            <NewContact
              contactType={contactNum}
              phoneCodeList={phoneCountryList}
              onBack={() => setStep(0)}
              getContacts={getContacts}
              tenantId={tenantId}
            />
          )}
          {step === 2 && (
            <EditContact
              contactType={contactNum}
              phoneCodeList={phoneCountryList}
              contactDetails={selectedContact}
              onBack={() => setStep(0)}
              getContacts={getContacts}
              tenantId={tenantId}
            />
          )}
        </>
      )}
    </Card>
  );
}

const EditContact = ({
  onBack,
  contactDetails = {},
  contactType,
  phoneCodeList = [],
  getContacts,
  tenantId,
}) => {
  const [isDisabled, setIsDisabled] = useState(false);
  const [isDuplicate, setIsDuplicate] = useState(false);
  const [duplicateEmail, setDuplicateEmail] = useState("");
  const [duplicateNumber, setDuplicateNumber] = useState("");
  const [countryRegex, setCountryRegex] = useState({});

  const handleSubmit = (values) => {
    setIsDisabled(true);
    const payload = {
      tenantId: tenantId,
      firstName: values?.firstName?.trim(),
      lastName: values?.lastName?.trim(),
      email: values?.email,
      contactType: contactType, // need it for reference to complete the functionality later
      phoneNumberDto: {
        countryCode: countryRegex?.countryShortCode,
        phoneNumber: values?.phoneNumber?.replace(/[^\d]/g, ""),
      },
    };

    updateContact(contactDetails?.id, payload)
      .then((res) => {
        const message = res.data?.data?.message;
        console.log(message);
        editContactFormik.resetForm();
        onBack();
        getContacts();
        setIsDisabled(false);
      })
      .catch((err) => {
        const message = err?.response?.data?.error?.errorDescription;
        setIsDisabled(false);
        const emailRegex = /[\w\.-]+@[\w\.-]+\.\w{2,}/g;
        const phoneRegex = /\b\d{7,}\b/g;
        setDuplicateNumber(message.match(phoneRegex));
        setDuplicateEmail(message.match(emailRegex));
        setIsDuplicate(true);
      });
  };

  const editContactFormik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      phoneCode: "",
    },
    validationSchema: Yup.object({
      ...validationSchema.fields,
      phoneNumber: Yup.string()
        .required("Please enter phone number")
        .test(
          "len",
          `Phone Number must be min ${countryRegex?.minLength} and max ${countryRegex?.maxLength} digits`,
          (value) =>
            value?.replace(/[^\d]/g, "")?.toString().length >=
              countryRegex?.minLength &&
            value?.replace(/[^\d]/g, "")?.toString().length <=
              countryRegex?.maxLength
        ),
    }),
    onSubmit: handleSubmit,
  });

  const findCountryCode = (countryId, isOnlyCode = false) => {
    const code = phoneCodeList?.find(
      (item) => item.countryShortCode === countryId
    );
    return isOnlyCode ? code : code?.phoneCountryCode;
  };

  useEffect(() => {
    setCountryRegex(
      findCountryCode(contactDetails?.phoneNumberDto?.countryCode, true)
    );
    editContactFormik.setValues({
      firstName: contactDetails?.firstName,
      lastName: contactDetails?.lastName,
      email: contactDetails?.email,
      phoneNumber: contactDetails?.phoneNumberDto?.phoneNumber,
      phoneCode: findCountryCode(contactDetails?.phoneNumberDto?.countryCode),
    });
  }, [contactDetails]);

  const isChanged = () => {
    return (
      !(editContactFormik.dirty && editContactFormik.isValid) ||
      isDisabled ||
      (contactDetails?.firstName === editContactFormik.values.firstName &&
        contactDetails?.lastName === editContactFormik.values.lastName &&
        contactDetails?.email === editContactFormik.values.email &&
        findCountryCode(contactDetails?.phoneNumberDto?.countryCode) ===
          countryRegex?.phoneCountryCode &&
        editContactFormik.values.phoneNumber?.replace(/[^\d]/g, "") ===
          contactDetails?.phoneNumberDto?.phoneNumber)
    );
  };

  return (
    <>
      <button
        type="button"
        className={`icon-back-arrow ${styles.backButton}`}
        onClick={onBack}
      />
      <div className={styles.editContactContainer}>
        <div className={styles.editFieldsContainer}>
          <span className={styles.editContactHeader}>Edit Contact</span>
          <div className={styles.fields}>
            <FormField
              id="firstName"
              name="firstName"
              label="First Name"
              placeholder="First Name"
              disableNumbers={true}
              autoFocus
              maxLength={30}
              isSemibold
              {...editContactFormik.getFieldProps("firstName")}
              error={
                editContactFormik.touched.firstName &&
                editContactFormik.errors.firstName
              }
            />
            <FormField
              id="lastName"
              name="lastName"
              label="Last Name"
              placeholder="Last Name"
              disableNumbers={true}
              maxLength={30}
              isSemibold
              {...editContactFormik.getFieldProps("lastName")}
              error={
                editContactFormik.touched.lastName &&
                editContactFormik.errors.lastName
              }
            />
          </div>
          <div className={styles.fields}>
            <FormField
              id="email"
              name="email"
              label="Email Address"
              placeholder="Email Address"
              maxLength={255}
              isSemibold
              {...editContactFormik.getFieldProps("email")}
              error={
                editContactFormik.touched.email &&
                editContactFormik.errors.email
              }
            />
            <FormPhoneWithCode
              label="Phone Number"
              id="phoneNumber"
              placeholder="Phone Number"
              name="phoneNumber"
              options={phoneCodeList}
              countryCode={countryRegex?.countryShortCode}
              selectedCode={editContactFormik?.values?.phoneCode}
              onCodeChange={(option, clickCount) => {
                setCountryRegex(option);
                editContactFormik.setFieldValue(
                  "phoneCode",
                  option.phoneCountryCode
                );
                if (clickCount >= 0) {
                  editContactFormik.setFieldValue("phoneNumber", "");
                }
              }}
              errorClassName="mt-[46px]"
              {...editContactFormik.getFieldProps("phoneNumber")}
              error={
                editContactFormik.touched.phoneNumber &&
                editContactFormik.errors.phoneNumber
              }
            />
          </div>
          <DuplicateContactModal
            show={isDuplicate}
            onclose={() => setIsDuplicate(false)}
            email={duplicateEmail}
            phoneNumber={duplicateNumber}
            countryCode={countryRegex?.countryShortCode}
            countryNumber={countryRegex?.phoneCountryCode}
          />
          <div className={styles.editButtonContainer}>
            <button
              type="button"
              onClick={onBack}
              className={styles.editCancelButton}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={editContactFormik.handleSubmit}
              disabled={isChanged()}
              className={`${styles.editSaveButton} ${
                isChanged()
                  ? styles.editSaveButtonInactive
                  : styles.editSaveButtonActive
              }`}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

const ContactContainer = ({
  contactHeader = "",
  contactData = [],
  onEdit,
  setSelectedContact,
  isAddDropdown,
  setIsAddDropdown,
  isEditOptions,
  setIsEditOptions,
  countryList,
  onNew,
  allContacts,
  getContacts,
  type,
  setContactNum,
  tenantId,
  hasPermission,
}) => {
  const dropdownRef = useRef(null);
  const contactDropdownRef = useRef(null);
  const [isWarningModal, setIsWarningModal] = useState(false);
  const [isRemoveModal, setIsRemoveModal] = useState(false);
  const [firstLastName, setFirstLastName] = useState("");
  const [contactType, setContactType] = useState("");
  const [contactId, setContactId] = useState("");

  useOutsideClick(dropdownRef, () => {
    setIsEditOptions(null);
  });

  useOutsideClick(contactDropdownRef, () => {
    setIsAddDropdown(null);
  });

  const findCountryCode = (countryId) => {
    const code = countryList?.find(
      (item) => item.countryShortCode === countryId
    );
    return code?.phoneCountryCode;
  };

  const isContactExists = (contactId) => {
    return contactData?.some((item) => item?.id === contactId);
  };

  const callModal = () => {
    contactData?.length < 2 ? setIsWarningModal(true) : setIsRemoveModal(true);
  };

  const addTheContact = (id) => {
    setIsAddDropdown(null);
    const payload = {
      tenantId: tenantId,
      contactType: type,
      contactId: id,
    };

    addContact(payload)
      .then((res) => {
        const message = res.data?.data?.message;
        console.log(message);
        getContacts();
        setIsAddDropdown(null);
      })
      .catch((err) => {
        const message =
          err?.response?.data?.error?.errorDescription ||
          "Failed to add contact";
        console.log(message);
      });
  };

  return (
    <div className={styles.contactContainer}>
      <div className={styles.chipContainer}>
        <div className={styles.contactHeader}>
          <span className={styles.contactType}>{contactHeader} Contacts</span>
          <span className={styles.contactSize}>({contactData?.length}/5)</span>
        </div>
        <div
          className={styles.plusButtonContainer}
          data-tooltip-id={"noPermission"}
        >
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              setIsEditOptions(null);
              setIsAddDropdown(
                (isAddDropdown !== null && isAddDropdown === contactHeader) ||
                  contactData?.length > 4
                  ? null
                  : contactHeader
              );
            }}
            data-tooltip-id="contacts"
            data-tooltip-content={
              contactData?.length < 5
                ? "Add Contact"
                : "You can have up to 5 contacts"
            }
            className={`icon-plus ${styles.plusButton} ${
              !hasPermission || contactData?.length >= 5
                ? styles.plusButtonInactive
                : styles.plusButtonActive
            }`}
            disabled={!hasPermission}
          />
          <img
            onClick={(event) => {
              event.stopPropagation();
              setIsEditOptions(null);
              setIsAddDropdown(
                (isAddDropdown !== null && isAddDropdown === contactHeader) ||
                  contactData?.length > 4
                  ? null
                  : contactHeader
              );
            }}
            src={plusIcon}
            className="mt-[-23px] ml-[4px] cursor-pointer"
          />
          {isAddDropdown === contactHeader && (
            <div className={styles.addContactDropdown} ref={contactDropdownRef}>
              <div className={styles.extraContactsContainer}>
                {allContacts?.map((contact, index) => {
                  return (
                    <div className={styles.contactItem} key={index}>
                      <button
                        type="button"
                        className={`${styles.contactHead} ${
                          isContactExists(contact?.id)
                            ? styles.selectedContact
                            : styles.notSelectedContact
                        }`}
                        onClick={() => {
                          !isContactExists(contact?.id) &&
                            addTheContact(contact?.id);
                        }}
                      >
                        {contact?.firstName} {contact?.lastName}
                      </button>
                      {isContactExists(contact?.id) && (
                        <img src={tick} className={styles.checkMark} />
                      )}
                    </div>
                  );
                })}
              </div>
              <div className={styles.sideLine} />
              <div className={styles.newButtonContainer}>
                <button
                  type="button"
                  onClick={() => {
                    onNew();
                    setContactNum(type);
                    setIsAddDropdown(null);
                  }}
                  className={styles.addPlusButton}
                >
                  <span className="icon-plus" />
                  <span className={styles.buttonText}>Create New</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className={styles.contactDetails}>
        {contactData?.map((contact, index) => {
          const headerIndex = `${contactHeader}${index}`;
          return (
            <div key={index} className={styles.details}>
              <div className={styles.contactName}>
                <span className={`icon-person ${styles.contactImage}`} />
                <WidthCalculator
                  label={`${contact?.firstName} ${contact?.lastName}`}
                  id={contact?.email}
                />
              </div>
              <span className={styles.emailContactInfo}>
                <EmailWidthCalculatorWithTooltip
                  id={contact?.email}
                  toolTipContent={contact?.email}
                  label={contact?.email?.split("@")[0]}
                  labelTwo={contact?.email?.split("@")[1]}
                  compareWidth={150}
                  ellipsisNumber={12}
                  className={styles.contactNameEllipsis}
                />
              </span>
              <div className={styles.infoContainer}>
                <span className={styles.contactInfo}>
                  {findCountryCode(contact?.phoneNumberDto?.countryCode)}{" "}
                  {contact?.phoneNumberDto?.countryCode === "US"
                    ? formatPhoneNumber(contact?.phoneNumberDto?.phoneNumber)
                    : internationalPhoneFormat(
                        contact?.phoneNumberDto?.phoneNumber
                      )}
                </span>
                <div
                  className={styles.dropdownContainer}
                  data-tooltip-id="noPermission"
                >
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      setIsEditOptions(headerIndex);
                      setIsAddDropdown(null);
                    }}
                    disabled={!hasPermission}
                    className={`${styles.dotsButton} ${
                      !hasPermission
                        ? styles.disableDotsContainer
                        : styles.dotsButtonColor
                    } ${
                      isEditOptions === headerIndex && styles.dotsButtonActive
                    }`}
                  >
                    <img src={threeDots} />
                  </button>
                  {isEditOptions === headerIndex && (
                    <div className={styles.editDropdown} ref={dropdownRef}>
                      <button
                        type="button"
                        onClick={() => {
                          onEdit();
                          setSelectedContact(contact);
                          setContactNum(type);
                          setIsEditOptions(null);
                        }}
                        className={styles.dropDownButton}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          callModal();
                          setFirstLastName(
                            `${contact?.firstName} ${contact?.lastName}`
                          );
                          setIsEditOptions(null);
                          setContactType(contactHeader);
                          setContactId(contact?.id);
                        }}
                        className={styles.dropDownButton}
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        <WarningModal
          show={isWarningModal}
          closeModal={() => setIsWarningModal(false)}
        />
        <RemoveModal
          name={firstLastName}
          contactType={contactType}
          type={type}
          contactId={contactId}
          getContacts={getContacts}
          show={isRemoveModal}
          closeModal={() => setIsRemoveModal(false)}
          tenantId={tenantId}
        />
      </div>
    </div>
  );
};

const NewContact = ({
  onBack,
  phoneCodeList = [],
  contactType,
  getContacts,
  tenantId,
}) => {
  const [isDisabled, setIsDisabled] = useState(false);
  const [isDuplicate, setIsDuplicate] = useState(false);
  const [duplicateEmail, setDuplicateEmail] = useState("");
  const [duplicateNumber, setDuplicateNumber] = useState("");
  const [countryRegex, setCountryRegex] = useState({});
  const [countryCodeError, setCountryCodeError] = useState(false);

  const handleSubmit = (values) => {
    setIsDisabled(true);
    const payload = {
      tenantId: tenantId,
      firstName: values?.firstName?.trim(),
      lastName: values?.lastName?.trim(),
      email: values?.email,
      contactType: contactType,
      phoneNumberDto: {
        countryCode: countryRegex?.countryShortCode,
        phoneNumber: values?.phoneNumber?.replace(/[^\d]/g, ""),
      },
    };

    newContact(payload)
      .then((res) => {
        const message = res.data?.data?.message;
        console.log(message);
        newContactFormik.resetForm();
        onBack();
        getContacts();
        setIsDisabled(false);
      })
      .catch((err) => {
        const message = err?.response?.data?.error?.errorDescription;
        const emailRegex = /[\w\.-]+@[\w\.-]+\.\w{2,}/g;
        const phoneRegex = /\b\d{7,}\b/g;
        setDuplicateNumber(message.match(phoneRegex));
        setDuplicateEmail(message.match(emailRegex));
        setIsDuplicate(true);
        setIsDisabled(false);
      });
  };

  const newContactFormik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      phoneCode: "",
    },
    validationSchema: Yup.object({
      ...validationSchema.fields,
      phoneNumber: Yup.string()
        .required("Please enter Phone Number")
        .test(
          "len",
          `Phone Number must be min ${countryRegex?.minLength} and max ${countryRegex?.maxLength} digits`,
          (value) =>
            value?.replace(/[^\d]/g, "")?.toString().length >=
              countryRegex?.minLength &&
            value?.replace(/[^\d]/g, "")?.toString().length <=
              countryRegex?.maxLength
        ),
    }),
    onSubmit: handleSubmit,
  });

  useEffect(() => {
    if (countryRegex?.countryShortCode) {
      newContactFormik.setFieldTouched("phoneNumber", true);
    }
  }, [countryRegex]);

  useEffect(() => {
    if (
      newContactFormik.values.phoneNumber?.length >= 1 &&
      Object.keys(countryRegex)?.length === 0
    ) {
      setCountryCodeError(true);
    } else {
      setCountryCodeError(false);
    }
  }, [newContactFormik.values.phoneNumber, countryRegex]);

  return (
    <div className={styles.addPocContainer}>
      <button
        type="button"
        onClick={() => {
          onBack();
          newContactFormik.resetForm();
        }}
        className={`icon-back-arrow ${styles.backButton}`}
      />
      <div className={styles.editContactContainer}>
        <div className={styles.editFieldsContainer}>
          <span className={styles.editContactHeader}>New Contact</span>
          <div className={styles.fields}>
            <FormField
              id="firstName"
              name="firstName"
              label="First Name"
              placeholder="First Name"
              autoFocus
              disableNumbers={true}
              disableSymbols={true}
              maxLength={30}
              isSemibold
              {...newContactFormik.getFieldProps("firstName")}
              error={
                newContactFormik.touched.firstName &&
                newContactFormik.errors.firstName
              }
            />
            <FormField
              id="lastName"
              name="lastName"
              disableNumbers={true}
              disableSymbols={true}
              label="Last Name"
              placeholder="Last Name"
              maxLength={30}
              isSemibold
              {...newContactFormik.getFieldProps("lastName")}
              error={
                newContactFormik.touched.lastName &&
                newContactFormik.errors.lastName
              }
            />
          </div>
          <div className={styles.fields}>
            <FormField
              id="email"
              name="email"
              label="Email Address"
              placeholder="Email Address"
              maxLength={255}
              isSemibold
              {...newContactFormik.getFieldProps("email")}
              error={
                newContactFormik.touched.email && newContactFormik.errors.email
              }
            />
            <FormPhoneWithCode
              label="Phone Number"
              id="phoneNumber"
              name="phoneNumber"
              placeholder="Phone Number"
              countryCode={countryRegex?.countryShortCode}
              options={phoneCodeList}
              selectedCode={newContactFormik?.values?.phoneCode}
              onCodeChange={(option, clickCount) => {
                setCountryRegex(option);
                newContactFormik.setFieldValue(
                  "phoneCode",
                  option.phoneCountryCode
                );
                if (clickCount >= 1) {
                  newContactFormik.setFieldValue("phoneNumber", "");
                }
              }}
              errorClassName="mt-[46px]"
              {...newContactFormik.getFieldProps("phoneNumber")}
              error={
                countryCodeError
                  ? newContactFormik.touched.phoneCode &&
                    newContactFormik.errors.phoneCode
                  : newContactFormik.touched.phoneNumber &&
                    newContactFormik.errors.phoneNumber
              }
            />
          </div>
          <DuplicateContactModal
            show={isDuplicate}
            onclose={() => setIsDuplicate(false)}
            email={duplicateEmail}
            phoneNumber={duplicateNumber}
            countryCode={countryRegex?.countryShortCode}
            countryNumber={countryRegex?.phoneCountryCode}
          />
          <div className={styles.editButtonContainer}>
            <button
              type="button"
              onClick={() => {
                onBack();
                newContactFormik.resetForm();
              }}
              className={styles.editCancelButton}
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={
                !(newContactFormik.dirty && newContactFormik.isValid) ||
                isDisabled
              }
              className={`${styles.editSaveButton} ${
                !(newContactFormik.dirty && newContactFormik.isValid) ||
                isDisabled
                  ? styles.editSaveButtonInactive
                  : styles.editSaveButtonActive
              }`}
              onClick={newContactFormik.handleSubmit}
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const WarningModal = ({ show = false, closeModal }) => {
  const IconPath = ({ pathNumber }) => {
    const icons = [];

    for (let i = 1; i <= pathNumber; i++) {
      const className = `path${i}`;
      icons.push(<span key={i} className={className} />);
    }

    return icons;
  };

  return (
    <Modal
      show={show}
      showCloseButton
      onClose={closeModal}
      className={styles.warningModal}
    >
      <div className={styles.warningContainer}>
        <span className={styles.warningHeader}>Unable to remove</span>
        <span className={`icon-failure ${styles.failedIcon}`}>
          <IconPath pathNumber={15} />
        </span>
        <span className={styles.warningDescription}>
          There must be at least one contact for each type.
          <br /> Please add another contact, then try again.
        </span>
        <Button onClick={closeModal}>Okay</Button>
      </div>
    </Modal>
  );
};

const RemoveModal = ({
  show,
  closeModal,
  name,
  contactType,
  type,
  contactId,
  getContacts,
  tenantId,
}) => {
  const [isDisabled, setIsDisabled] = useState(false);

  const deleteContact = () => {
    setIsDisabled(true);
    const payload = {
      tenantId: tenantId,
      contactType: type,
      contactId,
    };

    removeContact(payload)
      .then((res) => {
        const message = res.data?.data?.message;
        console.log(message || "Contact removed.");
        setIsDisabled(false);
        getContacts();
        closeModal();
      })
      .catch((err) => {
        const message =
          err?.response?.data?.error?.errorDescription ||
          "Failed to remove contact";
        console.log(message);
        setIsDisabled(false);
      });
  };

  return (
    <Modal
      show={show}
      onClose={closeModal}
      showCloseButton
      className={styles.removeModal}
    >
      <div className={styles.removeContainer}>
        <span className={styles.warningHeader}>Remove Contact?</span>
        <span className={styles.removeDescription}>
          Are you sure you want to remove{" "}
          <span className={styles.specialDescription}>{name}</span> from your{" "}
          {contactType} contact list?
        </span>
        <Button disabled={isDisabled} onClick={deleteContact}>
          Remove
        </Button>
        <button
          type="button"
          onClick={closeModal}
          className={styles.cancelRemove}
        >
          Cancel
        </button>
      </div>
    </Modal>
  );
};

const regex = /^[a-zA-Z\s]*$/g;
const validationSchema = Yup.object({
  firstName: Yup.string()
    .required("First Name is required")
    .matches(regex, {
      message: "Cannot accept numbers or special characters",
    })
    .matches(/^(?!\s+$)/, "Cannot contain only blankspaces")
    .min(2, "First name must be at least 2 characters"),
  lastName: Yup.string()
    .required("Last Name is required")
    .matches(regex, {
      message: "Cannot accept numbers or special characters",
    })
    .matches(/^(?!\s+$)/, "Cannot contain only blankspaces")
    .min(2, "Last name must be at least 2 characters"),
  email: Yup.string()
    .required("Email Address is required")
    .matches(
      /^([a-zA-Z0-9_.-])+@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,6}$)+$/,
      "Invalid Email"
    ),
  phoneCode: Yup.string().required("Please select Country Code"),
});

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
    <>
      <span
        ref={textRef}
        data-tooltip-id={width > 170 ? `fullName-${id}` : ""}
        className={width > 170 && styles.contactNameEllipsis}
      >
        {label}
      </span>
    </>
  );
};
