import { Button } from "@mui/joy";
import { useFormik } from "formik";
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { IdentityTypeEnum } from "../../Enums/IdentityTypeEnum";
import { useMediaQuery } from "../../Hooks/useMediaQuery";
import { HBar } from "../../components/Bars/Bars";
import { Checkbox } from "../../components/Checkbox/Checkbox";
import {
  FormField,
  FormMask,
  FormPhoneWithCode,
  FormSelect,
} from "../../components/FormField/FormField";
import PasswordInput from "../../components/PasswordInput/PasswordInput";
import { RadioButton } from "../../components/RadioButton/RadioButton";
import {
  addNewBusinessInfo,
  exitAddNewBusinessInfo,
  exitAddNewBusinessInfoWithoutId,
  getAddNewBusinessInfo,
  updateBusinessInfo,
} from "../../services/profiles/poc";
import styles from "./BusinessInformation.module.scss";

type BusinessInformationProps = {
  onSucess: () => void;
  getTentId: any | null;
  countriesList: string | null;
};

export const BusinessInformation: React.FunctionComponent<
  BusinessInformationProps
> = ({ onSucess, getTentId, countriesList }) => {
  const [countryCodeList, setCountryCodeList] = useState([]);
  const [check, setCheck] = useState(false);
  const [getBusinessInfo, setGetBusinessInfo] = useState({});
  const [entitytype, setEntityType] = useState(1);
  const resolution = useMediaQuery("(max-width: 1260px)");
  const [country, setCountry] = useState([]);
  const [tennantId, setTennantId] = useState(0);
  const [countryCode, setCountryCode] = useState({});
  const [loading, setLodaing] = useState(false);
  const [countryRegex, setCountryRegex] = useState("");
  const navigateTo = useNavigate();
  const emojiRegex = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g;

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
  const exitHandler = () => {
    const {
      dbaName,
      dbaCountry,
      dbaCity,
      dbaAddressLine1,
      dbaAddressLine2,
      dbaState,
      dbaZipcode,
    } = dbaFormik.values;
    const {
      companyName,
      businessEntity,
      businessStartDate,
      entityValue,
      companyEmail,
      companyphoneNumberCode,
      phoneNumber,
      companyAddressLine1,
      companyAddressLine2,
      companyCity,
      companyZipcode,
      companyCountry,
      companyState,
    } = formik.values;

    const payload = {
      ...(!formik?.errors?.companyName && { name: companyName?.trim() }),
      ...(!formik?.errors?.businessEntity && {
        businessEntity: businessEntity?.value,
      }),
      identityType: showEntityTypeRadioBtn
        ? entitytype
        : IdentityTypeEnum.EinOrTin,
      ...(!formik?.errors?.businessStartDate && {
        businessStartDate: businessStartDate,
      }),
      ...(!formik?.errors?.entityValue && {
        ssnOrEin: entityValue?.replace(/-/g, ""),
      }),
      ...(!formik?.errors?.companyEmail && {
        email: companyEmail,
      }),
      ...(!formik?.errors?.companyphoneNumberCode &&
        !formik?.errors?.phoneNumber && {
          phoneNumberDto: {
            countryCode: companyphoneNumberCode,
            phoneNumber: phoneNumber?.replace(/[^\d]/g, ""),
          },
        }),
      ...(!formik?.errors?.companyAddressLine1 && {
        addressLine1: companyAddressLine1?.trim(),
      }),
      ...(!formik?.errors?.companyAddressLine2 && {
        addressLine2: companyAddressLine2?.trim(),
      }),
      ...(!formik?.errors?.companyCity && { city: companyCity?.trim() }),
      ...(!formik?.errors?.companyState && { state: companyState?.trim() }),
      ...(!formik?.errors?.companyZipcode && {
        zipCode: companyZipcode?.trim(),
      }),
      ...(!formik?.errors?.companyCountry && {
        country: companyCountry?.label,
      }),
      doingBusinessAs: check,
      ...(!check && {
        dbaInfoResponseDto: {
          ...(!dbaFormik?.errors?.dbaName && { dbaName: dbaName?.trim() }),
          ...(!dbaFormik?.errors?.dbaAddressLine1 && {
            dbaAddressLine1: dbaAddressLine1?.trim(),
          }),
          ...(!dbaFormik?.errors?.dbaAddressLine2 && {
            dbaAddressLine2: dbaAddressLine2?.trim(),
          }),
          ...(!dbaFormik?.errors?.dbaCity && { dbaCity: dbaCity?.trim() }),
          ...(!dbaFormik?.errors?.dbaState && { dbaState: dbaState?.trim() }),
          ...(!dbaFormik?.errors?.dbaZipcode && {
            dbaZipcode: dbaZipcode?.trim(),
          }),
          ...(!dbaFormik?.errors?.dbaCountry && {
            dbaCountry: dbaCountry?.label,
          }),
        },
      }),
    };
    if (
      !formik?.errors?.companyName &&
      !formik?.errors?.companyEmail &&
      !formik?.errors?.phoneNumber &&
      !formik?.errors?.companyphoneNumberCode
    ) {
      if (getTentId) {
        exitAddNewBusinessInfo(payload, getTentId)
          .then(() => {
            navigateTo("/business-profiles");
          })
          .catch((err) => {});
      } else {
        exitAddNewBusinessInfoWithoutId(payload)
          .then(() => {
            navigateTo("/business-profiles");
          })
          .catch((err) => {
            navigateTo("/business-profiles");
          });
      }
    }
    if (
      formik?.errors?.companyName ||
      formik?.errors?.companyEmail ||
      formik?.errors?.phoneNumber ||
      formik?.errors?.companyphoneNumberCode
    ) {
      navigateTo("/business-profiles");
    }
  };

  useEffect(() => {
    if (getTentId) {
      setLodaing(true);
      getAddNewBusinessInfo(getTentId)
        .then((res) => {
          const data = res?.data?.data;
          setGetBusinessInfo(data);
          setEntityType(data?.identityType);
          const patten = applyPattern(data?.ssnOrEin, "###-##-####");
          formik?.setValues({
            companyName: data?.name,
            entityValue: patten,
            businessEntity: {
              label: data?.businessEntity,
              value: data?.businessEntity,
            },
            companyEmail: data?.email,
            phoneNumber: data?.phoneNumberDto.phoneNumber,
            companyphoneNumberCode: data?.phoneNumberDto.countryCode,
            companyAddressLine1: data?.addressLine1,
            companyAddressLine2: data?.addressLine2,
            companyState: data?.state,
            companyCity: data?.city,
            companyZipcode: data?.zipCode,
            businessStartDate: data?.businessStartDate,
            companyCountry: {
              label: data?.country,
              value: data?.country,
            },
          });

          if (data?.doingBusinessAs === false) {
            setCheck(false);
          } else {
            setCheck(true);
          }
          const {
            dbaName,
            dbaAddressLine1,
            dbaAddressLine2,
            dbaCity,
            dbaZipCode,
            dbaState,
          } = data.dbaInfoResponseDto;
          dbaFormik.setValues({
            dbaName: dbaName,
            dbaAddressLine1: dbaAddressLine1,
            dbaAddressLine2: dbaAddressLine2,
            dbaZipcode: dbaZipCode,
            dbaState: dbaState,
            dbaCity: dbaCity,
            dbaCountry: {
              label: data?.country,
              value: data?.country,
            },
          });
          setLodaing(false);
        })
        .catch((err) => {
          setLodaing(false);
        });
    }
  }, []);

  useEffect(() => {
    if (countriesList) {
      const result = [];
      countriesList?.map((item) => {
        result?.push({
          label: item?.country,
          value: item?.countryShortCode,
          minLength: item?.minLength,
          maxLength: item?.maxLength,
        });
      });
      setCountry(result);
      setCountryCodeList(countriesList);
    }
  }, [countriesList]);

  useEffect(() => {
    if (countryCodeList) {
      countryCodeList?.map((item) => {
        if (
          item?.countryShortCode ===
          getBusinessInfo?.phoneNumberDto?.countryCode
        ) {
          setCountryCode(item?.phoneCountryCode);
          setCountryRegex(item);
        }
      });
    }
  }, [getBusinessInfo]);

  const companyFormikValues = (value) => {
    const {
      dbaName,
      dbaCountry,
      dbaCity,
      dbaAddressLine1,
      dbaAddressLine2,
      dbaState,
      dbaZipcode,
    } = dbaFormik.values;
    const {
      companyName,
      businessEntity,
      businessStartDate,
      entityValue,
      companyEmail,
      companyphoneNumberCode,
      phoneNumber,
      companyAddressLine1,
      companyAddressLine2,
      companyCity,
      companyZipcode,
      companyCountry,
      companyState,
    } = value;

    const payload = {
      name: companyName?.trim(),
      businessEntity: businessEntity.value,
      identityType: showEntityTypeRadioBtn
        ? entitytype
        : IdentityTypeEnum.EinOrTin,
      businessStartDate: businessStartDate,
      ssnOrEin: entityValue?.replace(/-/g, ""),
      email: companyEmail,
      phoneNumberDto: {
        countryCode: companyphoneNumberCode,
        phoneNumber: phoneNumber?.replace(/[^\d]/g, ""),
      },
      addressLine1: companyAddressLine1?.trim(),
      addressLine2: companyAddressLine2?.trim(),
      city: companyCity?.trim(),
      state: companyState?.trim(),
      zipCode: companyZipcode?.trim(),
      country: companyCountry?.label,
      doingBusinessAs: check,
      ...(!check && {
        dbaInfoResponseDto: {
          dbaName: dbaName?.trim(),
          dbaAddressLine1: dbaAddressLine1?.trim(),
          dbaAddressLine2: dbaAddressLine2?.trim(),
          dbaCity: dbaCity?.trim(),
          dbaState: dbaState?.trim(),
          dbaZipCode: dbaZipcode?.trim(),
          dbaCountry: dbaCountry?.label,
        },
      }),
    };

    if (getTentId <= 0 || getTentId == undefined) {
      addNewBusinessInfo(payload)
        .then((res) => {
          const data = res?.data?.data?.id;
          setTennantId(data);
          onSucess(data);
        })
        .catch((err) => {});
    } else {
      updateBusinessInfo(payload, getTentId)
        .then((res) => {
          const data = res?.data?.data?.id;
          setTennantId(data);
          onSucess(data);
        })
        .catch((err) => {});
    }
  };

  const applyPattern = (inputValue, inputPattern) => {
    const numericInput = inputValue?.replace(/\D/g, "");
    if (inputPattern === "###-##-####") {
      const match = numericInput?.match(/^(\d{0,3})(\d{0,2})(\d{0,4})$/);
      if (match) {
        const formattedInput = match?.slice(1, 4).filter(Boolean).join("-");
        return formattedInput;
      }
    } else if (inputPattern === "##-#######") {
      const match = numericInput?.match(/^(\d{0,2})(\d{0,7})$/);
      if (match) {
        const formattedInput = match?.slice(1, 3).filter(Boolean).join("-");
        return formattedInput;
      }
    }

    return inputValue;
  };

  //  In this code, I've implemented a validation mechanism to ensure that only past times are accepted.
  const currentDate = new Date();
  const currentYearMonth = `${(currentDate.getMonth() + 1)
    .toString()
    .padStart(2, "0")}/${currentDate.getFullYear()}`;
  const todaydate = new Date(`01/${currentYearMonth}`);

  const formik = useFormik({
    initialValues: {
      companyName: "",
      businessEntity: "",
      entityValue: "", // selected radio's value
      businessStartDate: "",
      companyEmail: "",
      phoneNumber: "",
      companyAddressLine1: "",
      companyAddressLine2: "",
      companyCity: "",
      companyState: "",
      companyZipcode: "",
      companyCountry: "",
      companyphoneNumberCode: "",
    },
    validationSchema: Yup.object({
      companyName: Yup.string()
        .required("Company name is required")
        .min(3, "Company name must be at least 3 characters")
        .matches(/^(?!\s+$)/, "Cannot contain only blankspaces")
        .test(
          "no-emojis",
          "Company name cannot contain emojis.",
          function (value) {
            const hasEmoji = emojiRegex.test(value);
            return !hasEmoji;
          }
        )
        .nullable(),
      businessEntity: Yup.object()
        .required("Business entity is required")
        .nullable(),
      entityValue: Yup.string()
        .required("Cannot be empty")
        .matches(/^(?!\s+$)/, "Cannot contain only blankspaces")
        .test(
          "9 digit test",
          "Invalid Value",
          (value) => `${value}`?.match(/\d+/g)?.join("")?.length === 9
        )
        .nullable(),
      businessStartDate: Yup.string()
        .required("Start date is required")
        .matches(/((0[1-9]|1[0-2])\/[12]\d{3})/, "Invalid Date")
        .matches(/^(?!\s+$)/, "Cannot contain only blankspaces")
        .test(
          "6 digit test",
          "Invalid Date",
          (value) => new Date(`01/${value}`) <= todaydate
        )
        .nullable(),
      companyEmail: Yup.string()
        .email("Invalid email address")
        .required("Email Address is required")
        .matches(
          /^([a-zA-Z0-9_.-])+@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,6}$)+$/,
          "Invalid email address"
        )
        .matches(/^(?!\s+$)/, "Cannot contain only blankspaces")
        .nullable(),
      phoneNumber: Yup.string()
        .required("Phone Number is required")
        .test(
          "Phone Number",
          "Phone Number exceeds the limit",
          function (value) {
            const phoneNumber = value?.replace(/[^\d]/g, "")?.toString();
            const minLength = countryRegex?.minLength;
            const maxLength = countryRegex?.maxLength;
            if (
              minLength === maxLength &&
              (phoneNumber?.length < minLength ||
                phoneNumber?.length > maxLength)
            ) {
              return this.createError({
                message: `Phone Number must be ${minLength} digits`,
              });
            }
            if (
              phoneNumber?.length < minLength ||
              phoneNumber?.length > maxLength
            ) {
              return this.createError({
                message: `Phone Number must be min ${minLength} and max ${maxLength} digits`,
              });
            }
            return true;
          }
        ),
      companyAddressLine1: Yup.string()
        .required("Address line 1 is required")
        .min(3, "Address Line 1 must be at least 3 characters")
        .matches(/^(?!\s+$)/, "Cannot contain only blankspaces")
        .test(
          "no-emojis",
          "Address Line 1 cannot contain emojis.",
          function (value) {
            const hasEmoji = emojiRegex.test(value);
            return !hasEmoji;
          }
        )
        .nullable(),
      companyphoneNumberCode: Yup.string().required(),
      companyAddressLine2: Yup.string()
        .test(
          "no-emojis",
          " Address Line 2 cannot contain emojis.",
          function (value) {
            const hasEmoji = emojiRegex.test(value);
            return !hasEmoji;
          }
        )
        .matches(/^(?!\s+$)/, "Cannot contain only blankspaces"),
      companyCity: Yup.string()
        .required("City is required")
        .matches(/^(?!\s+$)/, "Cannot contain only blankspaces")
        .matches(/^[A-Za-z ]+$/g, "Invalid city name")
        .nullable(),
      companyState: Yup.string()
        .matches(/^[A-Za-z ]+$/g, "Invalid state name")
        .matches(/^(?!\s+$)/, "Cannot contain only blankspaces"),
      companyZipcode: Yup.string()
        .matches(/^(?!\s+$)/, "Cannot contain only blankspaces")
        .test("no-emojis", "Zipcode cannot contain emojis.", function (value) {
          const hasEmoji = emojiRegex.test(value);
          return !hasEmoji;
        })
        .nullable(),

      companyCountry: Yup.object().required("Country is required"),
    }),
    onSubmit: companyFormikValues,
  });

  const dbaFormik = useFormik({
    initialValues: {
      dbaName: "",
      dbaAddressLine1: "",
      dbaAddressLine2: "",
      dbaCity: "",
      dbaState: "",
      dbaZipcode: "",
      dbaCountry: "",
    },
    validationSchema: Yup.object({
      dbaName: Yup.string()
        .required("DBA name is required")
        .min(3, "DBA name must be at least 3 characters")
        .matches(/^(?!\s+$)/, "Cannot contain only blankspaces")
        .test("no-emojis", "DBA name cannot contain emojis.", function (value) {
          const hasEmoji = emojiRegex.test(value);
          return !hasEmoji;
        })
        .nullable(),
      dbaAddressLine1: Yup.string()
        .required("Address line 1 is required")
        .matches(/^(?!\s+$)/, "Cannot contain only blankspaces")
        .min(3, "Address Line 1 must be at least 3 characters")
        .test(
          "no-emojis",
          "Address line 1 cannot contain emojis.",
          function (value) {
            const hasEmoji = emojiRegex.test(value);
            return !hasEmoji;
          }
        )
        .nullable(),
      dbaAddressLine2: Yup.string()
        .matches(/^(?!\s+$)/, "Cannot contain only blankspaces")
        .test(
          "no-emojis",
          "Address line 2 cannot contain emojis.",
          function (value) {
            const hasEmoji = emojiRegex.test(value);
            return !hasEmoji;
          }
        )
        .nullable(),
      dbaCity: Yup.string()
        .required("City is required")
        .matches(/^(?!\s+$)/, "Cannot contain only blankspaces")
        .matches(/^[A-Za-z ]+$/g, "Invalid city name")
        .nullable(),
      dbaCountry: Yup.object().required("Country is required").nullable(),
      dbaState: Yup.string()
        .matches(/^[A-Za-z ]+$/g, "Invalid state name")
        .matches(/^(?!\s+$)/, "Cannot contain only blankspaces"),
      dbaZipcode: Yup.string()
        .matches(/^(?!\s+$)/, "Cannot contain only blankspaces")
        .test("no-emojis", "Zipcode cannot contain emojis.", function (value) {
          const hasEmoji = emojiRegex.test(value);
          return !hasEmoji;
        })
        .nullable(),
    }),
    onSubmit: companyFormikValues,
  });

  const showEntityTypeRadioBtn = useMemo(() => {
    const businessEntity = formik?.values?.businessEntity;
    return businessEntity?.value === "Sole Proprietorship / Single LLC";
  }, [formik.values.businessEntity]);

  const onCheckBox = () => {
    if (getBusinessInfo.doingBusinessAs === true || getTentId <= 0) {
      dbaFormik.resetForm();
    }
  };

  const numberInput = (event) => {
    const value = event.target.value;
    formik.setFieldValue("phoneNumber", value);
  };

  useEffect(() => {
    formik.validateForm();
  }, [countryRegex]);

  return (
    <div>
      {!loading && (
        <div className={styles.container}>
          <div>
            <div className={styles.subContainer}>
              <h4 className={styles.bInfoName}>Business Information</h4>
            </div>
            <p className={styles.content}>
              Fill out your company information and the “Doing Business As”
              section if you do business using a different name and/or address.
            </p>
            <div className={styles.barAlign}>
              <span className={styles.company}>Company Information</span>
              <HBar className={styles.bar} />
            </div>
            <div className={styles.inputFiledsAlign}>
              <FormField
                id="company-name"
                {...formik.getFieldProps("companyName")}
                label="Company Name"
                placeholder={`Company Name`}
                isSemibold={true}
                autoFocus={true}
                className={`${styles.inputStyles} ${styles.placeHolderFont}`}
                maxLength={30}
                error={formik.touched.companyName && formik.errors.companyName}
                name="companyName"
              />
              <div className={`${styles.formAddressWidth} ${styles.open}`}>
                <FormSelect
                  id="business-entity"
                  label="Business Entity"
                  options={businessEntityOptions}
                  value={formik.values.businessEntity}
                  onChange={(option) => {
                    formik.setFieldValue("businessEntity", option);
                  }}
                  onBlur={() => formik.setFieldTouched("businessEntity")}
                  error={
                    formik.touched.businessEntity &&
                    formik.errors.businessEntity
                  }
                />
              </div>
              <div>
                {!resolution && (
                  <div
                    className={` ${
                      showEntityTypeRadioBtn &&
                      `${styles.entityTypeRadioBtn} ${styles.entityAlign}`
                    }`}
                  >
                    {showEntityTypeRadioBtn && (
                      <div className={styles.radioButton}>
                        <RadioButton
                          id="ssn-radio-btw"
                          label="SSN"
                          name="entityType"
                          value={0}
                          checked={entitytype === IdentityTypeEnum.Ssn}
                          onChange={() => {
                            setEntityType(IdentityTypeEnum.Ssn);
                          }}
                        />
                        <RadioButton
                          id="ein-tin-radio-btn"
                          label="EIN / TIN"
                          className={`${styles.rdButton}`}
                          value={1}
                          checked={entitytype === IdentityTypeEnum.EinOrTin}
                          onChange={() => {
                            setEntityType(IdentityTypeEnum.EinOrTin);
                          }}
                          name="entityType"
                        />
                      </div>
                    )}
                    <div>
                      <PasswordInput
                        id="ssn/ein-tin"
                        disableSpace={true}
                        disableAlphabets={true}
                        label={
                          entitytype == IdentityTypeEnum.Ssn &&
                          showEntityTypeRadioBtn
                            ? "SSN"
                            : "EIN / TIN"
                        }
                        maxLength={
                          entitytype == IdentityTypeEnum.Ssn &&
                          showEntityTypeRadioBtn
                            ? 11
                            : 10
                        }
                        isPattern={true}
                        placeholder={
                          formik?.values?.businessEntity?.value
                            ? entitytype == IdentityTypeEnum.Ssn &&
                              showEntityTypeRadioBtn
                              ? "SSN"
                              : "EIN / TIN"
                            : "Choose a Business Entity"
                        }
                        isIconEnable={
                          !formik?.values?.businessEntity?.value ? false : true
                        }
                        className={`
                ${
                  showEntityTypeRadioBtn
                    ? `${styles.radioswitch}`
                    : `${styles.inputStyles}`
                } 
                ${
                  !formik?.values?.businessEntity?.value
                    ? `${styles.ein}`
                    : `${styles.placeHolderFont}`
                }`}
                        disabled={
                          formik.values.businessEntity?.value ? false : true
                        }
                        {...formik.getFieldProps("entityValue")}
                        name="entityValue"
                        isLabelTop={
                          formik.values.businessEntity?.value ? false : true
                        }
                        isShowPlaceholder={true}
                        error={
                          formik.touched.entityValue &&
                          formik.errors.entityValue
                        }
                        value={formik.values.entityValue}
                        inputPattern={
                          entitytype === IdentityTypeEnum.Ssn &&
                          showEntityTypeRadioBtn
                            ? "###-##-####"
                            : "##-#######"
                        }
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
            {resolution && (
              <div className={`${styles.inputFiledsAlign}`}>
                <div
                  className={` ${
                    showEntityTypeRadioBtn && `${styles.buttonFlex}`
                  }`}
                >
                  {showEntityTypeRadioBtn && (
                    <div className={styles.radioButtonLower}>
                      <RadioButton
                        id="ssn-radio-btw"
                        label="SSN"
                        name="entityType"
                        value={0}
                        checked={entitytype == IdentityTypeEnum.Ssn}
                        onChange={() => {
                          setEntityType(IdentityTypeEnum.Ssn);
                        }}
                      />{" "}
                      <RadioButton
                        id="ein-tin-radio-btn"
                        label="EIN / TIN"
                        className={styles.rdButton}
                        value={1}
                        checked={entitytype === IdentityTypeEnum.EinOrTin}
                        onChange={() => {
                          setEntityType(IdentityTypeEnum.EinOrTin);
                        }}
                        name="entityType"
                      />
                    </div>
                  )}
                  <div>
                    <PasswordInput
                      id="ssn/ein-tin"
                      inputPattern={
                        entitytype === IdentityTypeEnum.Ssn &&
                        showEntityTypeRadioBtn
                          ? "###-##-####"
                          : "##-#######"
                      }
                      label={
                        entitytype === IdentityTypeEnum.Ssn &&
                        showEntityTypeRadioBtn
                          ? "SSN"
                          : "EIN / TIN"
                      }
                      maxLength={
                        entitytype == IdentityTypeEnum.Ssn &&
                        showEntityTypeRadioBtn
                          ? 11
                          : 10
                      }
                      disableSpace={true}
                      disableAlphabets={true}
                      value={formik.values.entityValue}
                      iconClassName={styles.iconSet}
                      isPattern={true}
                      placeholder={
                        formik.values.businessEntity.value
                          ? entitytype == IdentityTypeEnum.Ssn &&
                            showEntityTypeRadioBtn
                            ? "SSN"
                            : "EIN / TIN"
                          : "Choose a Business Entity"
                      }
                      isIconEnable={
                        !formik.values.businessEntity?.value ? false : true
                      }
                      className={`
                ${
                  showEntityTypeRadioBtn
                    ? `${styles.buttonRd}`
                    : `${styles.inputStyles}`
                } 
                ${
                  !formik.values.businessEntity?.value
                    ? `${styles.ein}`
                    : `${styles.placeHolderFont}`
                }`}
                      disabled={
                        formik.values.businessEntity?.value ? false : true
                      }
                      {...formik.getFieldProps("entityValue")}
                      name="entityValue"
                      isLabelTop={
                        formik.values.businessEntity?.value ? false : true
                      }
                      isShowPlaceholder={true}
                      error={
                        formik.touched.entityValue && formik.errors.entityValue
                      }
                    />
                  </div>
                </div>
                <div className={styles.inputStyles}>
                  <FormMask
                    id="business-start-date"
                    className={` ${styles.placeHolderFont}`}
                    format={`##/####`}
                    label={`Business Start Date (MM/YYYY)`}
                    value={formik.values.businessStartDate}
                    {...formik.getFieldProps("businessStartDate")}
                    placeholder={"Business Start Date (MM/YYYY)"}
                    name="businessStartDate"
                    error={
                      formik.touched.businessStartDate &&
                      formik.errors.businessStartDate
                    }
                  />
                </div>
              </div>
            )}
            <div className={styles.inputFiledsAlign}>
              {!resolution && (
                <FormMask
                  id="business-start-date"
                  className={`${styles.inputStyles} ${styles.placeHolderFont}`}
                  format={`##/####`}
                  label={`Business Start Date (MM/YYYY)`}
                  value={formik.values.businessStartDate}
                  {...formik.getFieldProps("businessStartDate")}
                  placeholder={"Business Start Date (MM/YYYY)"}
                  name="businessStartDate"
                  error={
                    formik.touched.businessStartDate &&
                    formik.errors.businessStartDate
                  }
                />
              )}
              <FormField
                isSemibold={true}
                className={resolution && `${styles.inputStyles}`}
                {...formik.getFieldProps("companyEmail")}
                id="company-email"
                label="Company Email"
                placeholder={`Company Email`}
                maxLength={255}
                error={
                  formik.touched.companyEmail && formik.errors.companyEmail
                }
                name="companyEmail"
              />
              <div className={styles.formTop}>
                <FormPhoneWithCode
                  className={styles.inputStyles}
                  id="phone-number"
                  countryCode={countryRegex?.countryShortCode}
                  onCodeChange={(e) => {
                    setCountryRegex(e);
                    formik.setFieldValue(
                      "companyphoneNumberCode",
                      e.countryShortCode
                    );
                    if (formik.values.companyphoneNumberCode?.length) {
                      formik.setFieldValue("phoneNumber", "");
                    }
                  }}
                  format="##########"
                  onChange={(event) => numberInput(event)}
                  value={formik.values.phoneNumber}
                  label="Company Phone Number"
                  placeholder="Company Phone Number"
                  selectedCode={countryCode}
                  error={
                    formik.touched.phoneNumber && formik.errors.phoneNumber
                  }
                  errorClassName={styles.errormessage}
                  options={countryCodeList}
                  {...formik.getFieldProps("phoneNumber")}
                  name="phoneNumber"
                />
              </div>
            </div>
            <div className={styles.addressStyle}>
              <FormField
                id="address-line-1"
                isSemibold={true}
                label="Company Address Line 1"
                maxLength={100}
                value={formik.values.companyAddressLine1}
                className={`${styles.placeHolderStyle} ${styles.formAddressWidth}`}
                error={
                  formik.touched.companyAddressLine1 &&
                  formik.errors.companyAddressLine1
                }
                placeholder={`Company Address Line 1`}
                name="companyAddressLine1"
                {...formik.getFieldProps("companyAddressLine1")}
              />
              <FormField
                isSemibold={true}
                id="address-line-2"
                label="Company Address Line 2 (optional)"
                className={`${styles.placeHolderStyle} ${styles.formAddressWidth}`}
                maxLength={100}
                name="companyAddressLine2"
                placeholder={`Company Address Line 2 (optional)`}
                {...formik.getFieldProps("companyAddressLine2")}
                error={
                  formik.touched.companyAddressLine2 &&
                  formik.errors.companyAddressLine2
                }
                value={formik.values.companyAddressLine2}
              />
            </div>
            <div className={styles.state}>
              <FormField
                isSemibold={true}
                id="city"
                maxLength={30}
                values={formik.values.companyCity}
                label="City"
                placeholder={`City`}
                className={`${styles.placeHolderStyle} ${styles.formAddressWidth}`}
                {...formik.getFieldProps("companyCity")}
                error={formik.touched.companyCity && formik.errors.companyCity}
                name="companyCity"
              />
              <FormField
                id="state"
                label="State/Province (optional)"
                isSemibold={true}
                maxLength={30}
                placeholder={`State/Province (optional)`}
                name="state/province"
                className={`${styles.placeHolderStyle} ${styles.formAddressWidth}`}
                {...formik.getFieldProps("companyState")}
                error={
                  formik.touched.companyState && formik.errors.companyState
                }
              />
              {!resolution && (
                <FormField
                  isSemibold={true}
                  id="zipcode"
                  label={`Zip/Postal Code (optional)`}
                  maxLength={10}
                  placeholder={`Zip/Postal Code (optional)`}
                  name="companyZipcode"
                  values={formik.values.companyZipcode}
                  className={styles.placeHolderStyle}
                  {...formik.getFieldProps("companyZipcode")}
                  error={
                    formik.touched.companyZipcode &&
                    formik.errors.companyZipcode
                  }
                />
              )}
              {!resolution && (
                <div className={styles.formSelectIndex}>
                  <FormSelect
                    id="country"
                    label="Country"
                    searchOption={true}
                    showSearchIcon={true}
                    searchPlaceholder={`Search Country`}
                    options={country}
                    value={formik.values.companyCountry}
                    onChange={(option) => {
                      formik.setFieldValue("companyCountry", option);
                    }}
                    onBlur={() => formik.setFieldTouched("companyCountry")}
                    error={
                      formik.touched.companyCountry &&
                      formik.errors.companyCountry
                    }
                  />
                </div>
              )}
            </div>
            {resolution && (
              <div className={styles.state}>
                <FormField
                  isSemibold={true}
                  id="zipcode"
                  label={`Zip/Postal Code (optional)`}
                  maxLength={10}
                  placeholder={`Zip/Postal Code (optional)`}
                  name="companyZipcode"
                  values={formik.values.companyZipcode}
                  className={`${styles.placeHolderStyle} ${styles.formAddressWidth}`}
                  {...formik.getFieldProps("companyZipcode")}
                  error={
                    formik.touched.companyZipcode &&
                    formik.errors.companyZipcode
                  }
                />
                <div className={`${styles.formAddressWidth} ${styles.close}`}>
                  <FormSelect
                    id="country"
                    label="Country"
                    searchOption={true}
                    showSearchIcon={true}
                    searchPlaceholder={`Search Country`}
                    options={country}
                    value={formik.values.companyCountry}
                    onChange={(option) => {
                      formik.setFieldValue("companyCountry", option);
                    }}
                    onBlur={() => formik.setFieldTouched("companyCountry")}
                    error={
                      formik.touched.companyCountry &&
                      formik.errors.companyCountry
                    }
                  />
                </div>
              </div>
            )}
            <div className={styles.dbaInfo}>
              <span className={styles.dbaInfoText}>Doing Business As</span>
              <HBar className={styles.bars} />
            </div>
            <div className={styles.buttonAlign}>
              <div className={styles.exitClass}>
                All completed progress is saved.
                <button
                  type="button"
                  className={styles.exit}
                  onClick={exitHandler}
                >
                  Exit
                </button>
              </div>
              <Button
                type="button"
                disabled={
                  check
                    ? !(formik.isValid && formik.dirty) ||
                      formik.values.companyphoneNumberCode.length <= 0
                    : !(formik.isValid && formik.dirty) ||
                      formik.values.companyphoneNumberCode.length <= 0 ||
                      !(dbaFormik.isValid && dbaFormik.dirty)
                }
                onClick={() => {
                  formik.handleSubmit();
                  dbaFormik.handleSubmit();
                }}
              >
                Next
              </Button>
            </div>
            <DbaInformation
              formikDbaInfo={dbaFormik}
              check={check}
              country={country}
              setCheck={setCheck}
              onCheckBox={onCheckBox}
            />
          </div>
        </div>
      )}
    </div>
  );
};

const DbaInformation = ({
  formikDbaInfo,
  setCheck,
  onCheckBox,
  check,
  country,
}) => {
  return (
    <div>
      <div className={styles.dbaName}>
        <div>
          <Checkbox
            checked={check}
            className={styles.checkBox}
            label={`I do business using my company name and address`}
            onChange={(event) => {
              setCheck(event.target.checked);
              onCheckBox();
            }}
            inputClassName={styles.checkClass}
            labelClassName={
              check ? `${styles.dbaCheckBox}` : `${styles.dbaText}`
            }
          />
        </div>
        {!check && (
          <FormField
            isSemibold={true}
            id="dba-name"
            maxLength={30}
            label="DBA Name"
            name="dbaName"
            placeholder={`DBA Name`}
            className={`${styles.placeHolderStyle} ${styles.formAddressWidth}`}
            error={
              formikDbaInfo.touched.dbaName && formikDbaInfo.errors.dbaName
            }
            {...formikDbaInfo.getFieldProps("dbaName")}
          />
        )}
      </div>
      {!check && (
        <>
          <div className={styles.addressStyle}>
            <FormField
              id="dba-address-line-1"
              isSemibold={true}
              label="DBA Address Line 1"
              maxLength={100}
              placeholder={`DBA Address Line 1`}
              name="dbaAddressLine1"
              className={`${styles.placeHolderStyle} ${styles.formAddressWidth}`}
              error={
                formikDbaInfo.touched.dbaAddressLine1 &&
                formikDbaInfo.errors.dbaAddressLine1
              }
              {...formikDbaInfo.getFieldProps("dbaAddressLine1")}
            />
            <FormField
              id="dba-address-line-2"
              isSemibold={true}
              label="DBA Address Line 2 (optional)"
              maxLength={100}
              placeholder={`DBA Address Line 2 (optional)`}
              className={`${styles.placeHolderStyle} ${styles.formAddressWidth}`}
              name="dbaAddressLine2"
              {...formikDbaInfo.getFieldProps("dbaAddressLine2")}
              error={
                formikDbaInfo.touched.dbaAddressLine2 &&
                formikDbaInfo.errors.dbaAddressLine2
              }
            />
          </div>
          <div className={styles.state}>
            <FormField
              id="dba-city"
              label="City"
              isSemibold={true}
              maxLength={30}
              name="dbaCity"
              className={`${styles.placeHolderStyle} ${styles.formAddressWidth}`}
              placeholder={`City`}
              error={
                formikDbaInfo.touched.dbaCity && formikDbaInfo.errors.dbaCity
              }
              {...formikDbaInfo.getFieldProps("dbaCity")}
            />
            <FormField
              id="state/province"
              label="State/Province (optional)"
              isSemibold={true}
              maxLength={30}
              placeholder={`State/Province (optional)`}
              name="state/province"
              className={`${styles.placeHolderStyle} ${styles.formAddressWidth}`}
              value={formikDbaInfo.values.dbaState}
              {...formikDbaInfo.getFieldProps("dbaState")}
              error={
                formikDbaInfo.touched.dbaState && formikDbaInfo.errors.dbaState
              }
            />
            <FormField
              id="dba-zipcode"
              isSemibold={true}
              label={`Zip/Postal Code (optional)`}
              name="dbaZipcode"
              placeholder={`Zip/Postal Code (optional)`}
              maxLength={10}
              className={`${styles.placeHolderStyle} ${styles.formAddressWidth}`}
              error={
                formikDbaInfo.touched.dbaZipcode &&
                formikDbaInfo.errors.dbaZipcode
              }
              value={formikDbaInfo.values.dbaZipcodes}
              {...formikDbaInfo.getFieldProps("dbaZipcode")}
            />
            <div className={`${styles.formAddressWidth} ${styles.close}`}>
              <FormSelect
                id="country"
                label="Country"
                showSearchIcon={true}
                searchPlaceholder={`Search Country`}
                searchOption={true}
                className={styles.selectStyles}
                options={country}
                formSearchAlign={true}
                value={formikDbaInfo.values.dbaCountry}
                onChange={(option) => {
                  formikDbaInfo.setFieldValue("dbaCountry", option);
                }}
                onBlur={() => formikDbaInfo.setFieldTouched("dbaCountry")}
                error={
                  formikDbaInfo.touched.dbaCountry &&
                  formikDbaInfo.errors.dbaCountry
                }
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};
