import ryvylActivityLogDot from '../../assets/ryvylActivityLogDoy.svg';
import { useFormik } from "formik";
import PropTypes from "prop-types";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { Tooltip } from "react-tooltip";
import * as Yup from "yup";
import { AddDepartment } from "../AddDepartment/AddDepartment";
import { AddNewPermission } from "../AddNewPermission/AddNewPermission";
import { ViewPermission } from "../ViewPermission/ViewPermission";
import styles from "./EmployeesDetails.module.scss";
import { countryList, viewProfile } from "../../services/Employees/Employees";
import { RYVYLEmployeesStatusEnum } from "../../Enums/RYVYLEmployeesStatusEnum";
import { fetchUserDetailsAction } from "../../Store/ducks/adminUserDetails";
import Breadcrumb from "../../Atoms/Breadcrumb/Breadcrumb";
import Card from "../../components/Card/Card";
import nameToInitials from "../../helpers/initials";
import Chip from "../../components/Chip/Chip";
import userDateTime from "../../helpers/userDateTime";
import { VBar } from "../../components/Bars/Bars";
import formatPhoneNumber from "../../helpers/formatPhoneNumber";
import { FormField, FormPhoneWithCode, FormSelectWithAddButton } from "../../components/FormField/FormField";
import { textEllipsis } from "../../helpers/textEllipsis";
import { PrimaryButton, PrimaryButtonSmall } from "../../Atoms/Buttons/Buttons";
import { ChipTitle } from "../../components/ChipTitle/ChipTitle";
import Modal from "../../components/Modal/Modal";
import { activateRyvylEmployee, deleteInvitation, getAllRyvylDepartments, getRyvylPermissionsList, getRyvylPermissionsRolesActivityLogs, resendRyvylEmployee, updateDeptAndPermission } from '../../services/RyvylEmployees/ryvylEmployees';

export function RyvylEmployeesDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [countryData, setCountryData] = useState([]);
  const [countryRegex, setCountryRegex] = useState([]);
  const [defaultCountryCode, setDefaultCountryCode] = useState("");
  const [departmentsList, setDepartmentsList] = useState([]);
  const [viewDepartment, setViewDepartment] = useState(false);
  const [permissionsList, setPermissionsList] = useState([]);
  const [activityLogsData, setActivityLogsData] = useState([]);
  const [isDelete, setIsDelete] = useState(false);
  const [isDeactivate, setIsDeactivate] = useState(false);
  const [isActivate, setIsActivate] = useState(false);
  const [viewPermissionModal, setViewPermissionModal] = useState(false);
  const [showNewPermission, setShowNewPermission] = useState(false);
  const [profileDetails, setProfileDetails] = useState({});
  const employeeDetails = location?.state;
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalLoading, setIsModalLoading] = useState(false);
  const { imageUrl, id } = useSelector((store) => store.adminUserDetails?.data);
  const imageBaseUrl = `${imageUrl}${
    location?.state?.id
  }_profileimage.png?${new Date()}`;

  const createMarkup = (html) => {
    return { __html: html };
  };
  const [status, setStatus] = useState(employeeDetails?.status);
  const employeeId = location?.state?.id;

  const getCountryList = () => {
    countryList()
      .then((res) => {
        const data = res?.data?.data;
        const sortedList = data?.sort((a, b) =>
          a?.country.localeCompare(b?.country)
        );
        setCountryData(sortedList);
        const countryDetails = data?.filter(
          (contact) => contact?.countryShortCode == defaultCountryCode
        );
        setCountryRegex(countryDetails[0]);
        employeeDetailsFormik.setFieldValue(
          "phoneCode",
          countryDetails[0]?.phoneCountryCode
        );
      })
      .catch((err) => {
        const error = err?.response?.data?.error?.errorDescription;
        // toast.error(error);
      });
  };

  const codeChange = (option) => {
    setCountryRegex(option);
    employeeDetailsFormik.setFieldValue("phoneCode", option.phoneCountryCode);
  };

  const breadCrumbData = [
    {
      label: "RYVYL Employees",
      url: "/ryvyl-employees/all-employees",
    },
    {
      label: `${employeeDetails?.name}`,
      url: "",
    },
  ];

  useEffect(() => {
    getDepartments();
    getPermissionRoles();
  }, []);

  useEffect(() => {
    if (defaultCountryCode) {
      getCountryList();
    }
  }, [defaultCountryCode, status, profileDetails]);

  useEffect(() => {
    if (countryRegex?.countryShortCode) {
      employeeDetailsFormik.setFieldTouched("phoneNumber", true);
    }
  }, [countryRegex]);

  const viewProfileDetails = () => {
    setIsLoading(true);
    viewProfile({ userId: employeeId })
      .then((res) => {
        setIsLoading(false);
        setProfileDetails(res?.data?.data);
        setDefaultCountryCode(res?.data?.data?.phoneNumberDto?.countryCode);
        setStatus(res?.data?.data?.status);
      })
      .catch((err) => {
        setIsLoading(false);
        const message = err?.response?.data?.error?.errorDescription;
        // toast.error(message);
      });
  };

  const getActivityLogs = () => {
    getRyvylPermissionsRolesActivityLogs({
      activityType: 2,
      userId: employeeDetails?.id,
    })
      .then((res) => {
        setActivityLogsData(res?.data?.data.reverse());
      })
      .catch((err) => {
        // toast.error(err?.response?.data?.error?.errorDescription);
      });
  };

  useEffect(() => {
    viewProfileDetails();
    getActivityLogs();
  }, [employeeId]);

  useEffect(() => {
    const permission = {
      label: profileDetails?.userRoleName,
      value: profileDetails?.userRole,
    };
    const department = {
      label: profileDetails?.departmentName,
      value: profileDetails?.department,
    };
    employeeDetailsFormik.setValues({
      email: profileDetails?.email,
      phoneNumber: profileDetails?.phoneNumberDto?.phoneNumber,
      permission: permission,
      department: department,
      phoneCode: "",
    });
  }, [profileDetails]);

  //api call for getting all departments
  const getDepartments = () => {
    getAllRyvylDepartments()
      .then((res) => {
        const response = res?.data?.data;
        const updatedList = response?.map((item) => ({
          value: item.id,
          label: item.departmentName,
        }));
        setDepartmentsList(updatedList);
      })
      .catch((err) => {
        const error =
          err?.response?.data?.error?.errorDescription ||
          "Failed to get departments";
        // toast.error(error);
      });
  };

  const employeeDetailsFormik = useFormik({
    initialValues: {
      email: "",
      phoneNumber: "",
      permission: "",
      department: "",
      phoneCode: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .required("Please enter your email")
        .matches(
          /^([a-zA-Z0-9_.-])+@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,6}$)+$/,
          "Invalid Email"
        ),
      phoneNumber: Yup.string()
        .required("Please enter Phone Number.")
        .test(
          "Phone Number",
          "phone Number exceeds the limit.",
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
                message: `Phone Number must be ${minLength} digits.`,
              });
            }
            if (
              phoneNumber?.length < minLength ||
              phoneNumber?.length > maxLength
            ) {
              return this.createError({
                message: `Phone Number must be min ${minLength} and max ${maxLength} digits.`,
              });
            }
            return true;
          }
        ),
      phoneCode: Yup.string().required("Please select Country Code"),
      department: Yup.object().required("Employee Department is required"),
      permission: Yup.object().required("Permission Role is required"),
    }),
    // onSubmit: handleSubmit
  });

  const handleDepartmentSuccess = () => {
    setViewDepartment(false);
    getDepartments();
  };

  // api call for getting all permission roles
  const getPermissionRoles = () => {
    getRyvylPermissionsList({
      sortProperties: "id",
      sortDirection: "ASC",
    })
      .then((res) => {
        const response = res?.data?.data?.items;
        const updatedList = response?.map((item) => ({
          value: item.id,
          label: item.name,
          description: item.description,
          isStar: item.isDefaultRole,
          userCount: item.userCount,
        }));
        setPermissionsList(updatedList);
      })
      .catch((err) => {
        const error =
          err?.response?.data?.error?.errorDescription ||
          "Failed to get permission roles";
        // toast.error(error);
      });
  };

  // function to open Activate, Deactivate, Delete Modals.
  const handleInvitationClick = () => {
    if (status === RYVYLEmployeesStatusEnum.Active) {
      if (id !== employeeId) {
        setIsDeactivate(true);
      } else {
        // toast.error(`This user can't be deactivated.`);
      }
    } else if (
      status === RYVYLEmployeesStatusEnum.Expired ||
      status === RYVYLEmployeesStatusEnum.Pending
    ) {
      setIsDelete(true);
    } else {
      setIsActivate(true);
    }
  };

  // api call to delete the employee.
  const handleDelete = (id) => {
    setIsModalLoading(true);
    deleteInvitation(id)
      .then(() => {
        setIsModalLoading(false);
        // toast.success("Invitation has been deleted.");
        navigate(`/ryvyl-employees/all-employees`);
      })
      .catch((err) => {
        setIsModalLoading(false);
        const error = err?.response?.data?.error?.errorDescription;
        // toast.error(error);
      });
  };

  //  api call to Activate or deactivate the employee.
  const handleStatus = (id, updatedStatus) => {
    setIsModalLoading(true);
    activateRyvylEmployee({
      userId: id,
      status: updatedStatus,
    })
      .then(() => {
        setIsModalLoading(false);
        let message;
        if (status === RYVYLEmployeesStatusEnum.Active) {
          setIsDeactivate(false);
          message = "Employee has been deactivated.";
        } else {
          setIsActivate(false);
          message = "Employee has been activated.";
        }
        // toast.success(message);
        getActivityLogs();
        viewProfileDetails();
      })
      .catch((err) => {
        setIsModalLoading(false);
        const msg = err?.response?.data?.error?.errorDescription;
        if (status === RYVYLEmployeesStatusEnum.Active) {
          setIsDeactivate(false);
        } else {
          setIsActivate(false);
        }
        // toast.error(msg);
      });
  };

  const onSuccessPermission = () => {
    setShowNewPermission(false);
    getPermissionRoles();
  };

  const handleImageError = () => {
    if (location?.state?.id && imageUrl) {
      setImageError(true);
    }
  };

  const handlePermissions = (list) => {
    setViewPermissionModal(false);
    if (list) {
      employeeDetailsFormik.setFieldValue("permission", list);
    }
  };

  // appi call to Resend and Save the employee details.
  const handleResendInvitation = () => {
    if (status === RYVYLEmployeesStatusEnum.Active) {
      const payload = {
        id: employeeId,
        department: employeeDetailsFormik?.values?.department?.value,
        permissionRole: employeeDetailsFormik?.values?.permission?.value,
      };
      setIsLoading(true);
      updateDeptAndPermission(payload)
        .then(() => {
          viewProfileDetails();
          dispatch(fetchUserDetailsAction());
          getActivityLogs();
          // toast.success("Employee details saved.");
        })
        .catch((err) => {
          const error = err?.response?.data?.error?.errorDescription;
          // toast.error(error);
        });
    } else {
      const payload = {
        firstName: profileDetails?.firstName,
        lastName: profileDetails?.lastName,
        email: employeeDetailsFormik?.values?.email,
        phoneNumberDto: {
          countryCode: countryRegex?.countryShortCode,
          phoneNumber: employeeDetailsFormik?.values?.phoneNumber?.replace(
            /[^\d]/g,
            ""
          ),
        },
        userRole: employeeDetailsFormik?.values?.permission?.value,
        department: employeeDetailsFormik?.values?.department?.value,
      };
      setIsLoading(true);
      resendRyvylEmployee(employeeId, payload)
        .then(() => {
          // toast.success("A new invitation link has been sent.");
          navigate(`/ryvyl-employees/all-employees`);
          setIsLoading(false);
        })
        .catch((err) => {
          const error = err?.response?.data?.error?.errorDescription;
          // toast.error(error);
          setIsLoading(false);
        });
    }
  };

  const disableNxtBtn = useMemo(() => {
    return (
      employeeDetailsFormik?.values?.department?.label !==
        profileDetails?.departmentName ||
      employeeDetailsFormik?.values?.permission?.label !==
        profileDetails?.userRoleName
    );
  }, [employeeDetailsFormik, profileDetails]);

  return (
    <div>
      <Breadcrumb data={breadCrumbData} />
      <Card isHeader={false}>
        <div className={styles.detailsContainer}>
          <div className={styles.imageSection}>
            <div className={styles.leftSection}>
              <div className={styles.imageAndName}>
                {imageError ? (
                  <div className={styles.image}>
                    <p
                      className={`${styles.initialName} ${
                        (nameToInitials(
                          profileDetails?.firstName,
                          profileDetails?.lastName
                        ) == "WW" ||
                          nameToInitials(
                            profileDetails?.firstName,
                            profileDetails?.lastName
                          ) == "MM") &&
                        styles.smallName
                      }`}
                    >
                      {nameToInitials(
                        profileDetails?.firstName,
                        profileDetails?.lastName
                      )}
                    </p>
                  </div>
                ) : (
                  <img
                    src={imageBaseUrl}
                    style={{
                      width: "137px",
                      height: "137px",
                      borderRadius: "100px",
                    }}
                    onError={handleImageError}
                  />
                )}
                <div className={styles.name}>
                  <p className={styles.userName}>
                    {profileDetails?.displayName}
                  </p>
                  <p
                    className={styles.userId}
                  >{`Account ID: EMP-${employeeDetails?.id}`}</p>
                  <Chip
                    color={
                      status === RYVYLEmployeesStatusEnum.Active
                        ? "green"
                        : status === RYVYLEmployeesStatusEnum.Inactive
                        ? "light-dgray"
                        : status === RYVYLEmployeesStatusEnum.Pending
                        ? "lorange"
                        : "red"
                    }
                    className={styles.chip}
                  >
                    {Object.keys(RYVYLEmployeesStatusEnum).find(
                      (key) => RYVYLEmployeesStatusEnum[key] === status
                    )}
                  </Chip>
                </div>
              </div>
              <div className={styles.dateAndStatus}>
                <p className={styles.date}>
                  {status === RYVYLEmployeesStatusEnum.Inactive
                    ? "Deactivated"
                    : status === RYVYLEmployeesStatusEnum.Active
                    ? "Activated"
                    : status === RYVYLEmployeesStatusEnum.Pending
                    ? "Invitation sent"
                    : "Expired"}
                  &nbsp;on&nbsp;
                  {status === RYVYLEmployeesStatusEnum.Active
                    ? userDateTime(
                        profileDetails?.activatedOn,
                        false,
                        "MM/DD/YYYY"
                      )
                    : userDateTime(
                        profileDetails?.modifiedDate,
                        false,
                        "MM/DD/YYYY"
                      )}
                  .
                </p>
                <button
                  type="button"
                  className={styles.status}
                  onClick={handleInvitationClick}
                >
                  {status === RYVYLEmployeesStatusEnum.Pending ||
                  status === RYVYLEmployeesStatusEnum.Expired
                    ? "Delete Invitation"
                    : status === RYVYLEmployeesStatusEnum.Inactive
                    ? "Activate Employee"
                    : "Deactivate Employee"}
                </button>
              </div>
            </div>
            <VBar className={styles.line} />
          </div>
          <div
            className={`${styles.rightContainer} ${
              (status === RYVYLEmployeesStatusEnum.Inactive ||
                status === RYVYLEmployeesStatusEnum.Active) &&
              styles.rightContainerActiveAndInactive
            }`}
          >
            <div>
              <div
                className={`${styles.phoneAndEmailContainer} ${
                  status === RYVYLEmployeesStatusEnum.Inactive &&
                  styles.phoneAndEmailInactive
                } ${
                  status === RYVYLEmployeesStatusEnum.Active &&
                  styles.phoneAndEmailActive
                }`}
              >
                <div className={styles.phone}>
                  <span
                    className={`icon-phone ${
                      status === RYVYLEmployeesStatusEnum.Inactive ||
                      status === RYVYLEmployeesStatusEnum.Active
                        ? styles.phoneImg
                        : styles.phoneIconPending
                    }`}
                  />
                  {status === RYVYLEmployeesStatusEnum.Inactive ||
                  status === RYVYLEmployeesStatusEnum.Active ? (
                    <p className={styles.phoneText}>
                      {employeeDetailsFormik?.values?.phoneCode}&nbsp;
                      {countryRegex?.phoneCountryCode == "+1"
                        ? !isLoading &&
                          formatPhoneNumber(
                            employeeDetailsFormik?.values?.phoneNumber
                          )
                        : !isLoading &&
                          internationalPhoneFormat(
                            employeeDetailsFormik?.values?.phoneNumber
                          )}
                    </p>
                  ) : (
                    <FormPhoneWithCode
                      label="Phone Number"
                      id="PhoneNumber"
                      placeholder="Phone Number"
                      options={countryData}
                      countryCode={countryRegex?.countryShortCode}
                      selectedCode={employeeDetailsFormik.values.phoneCode}
                      errorClassName={styles.errorClassName}
                      onCodeChange={(option, clickCount) => {
                        codeChange(option);
                        if (clickCount >= 0) {
                          employeeDetailsFormik.setFieldValue(
                            "phoneNumber",
                            ""
                          );
                        }
                      }}
                      {...employeeDetailsFormik.getFieldProps("phoneNumber")}
                      error={
                        employeeDetailsFormik.touched.phoneNumber &&
                        employeeDetailsFormik.errors.phoneNumber
                      }
                    />
                  )}
                </div>
                <div className={styles.emailAndRole}>
                  <span
                    className={`icon-email-envelope ${
                      status === RYVYLEmployeesStatusEnum.Inactive ||
                      status === RYVYLEmployeesStatusEnum.Active
                        ? styles.emailImg
                        : styles.emailPending
                    }`}
                  />
                  {status === RYVYLEmployeesStatusEnum.Inactive ||
                  status === RYVYLEmployeesStatusEnum.Active ? (
                    <>
                      <p
                        className={`${styles.phoneText} ${
                          employeeDetailsFormik?.values?.email?.length > 25 &&
                          styles.phoneTextTooltip
                        }`}
                        data-tooltip-id="email"
                        data-tooltip-content={
                          employeeDetailsFormik?.values?.email?.length > 25
                            ? employeeDetailsFormik?.values?.email
                            : ""
                        }
                      >
                        {EmailCell(employeeDetailsFormik?.values?.email)}
                      </p>
                      <Tooltip
                        id="email"
                        className={styles.tooltip}
                        classNameArrow={styles.tooltipArrow}
                      />
                    </>
                  ) : (
                    <FormField
                      label="Email Address"
                      permissionForm={true}
                      id="email"
                      maxLength={255}
                      {...employeeDetailsFormik.getFieldProps("email")}
                      error={
                        employeeDetailsFormik.touched.email &&
                        employeeDetailsFormik.errors.email
                      }
                    />
                  )}
                </div>
              </div>
              <div
                className={`${styles.phoneAndEmailContainer} ${
                  (status === RYVYLEmployeesStatusEnum.Pending ||
                    status === RYVYLEmployeesStatusEnum.Expired) &&
                  styles.phoneAndEmailContainerActiveAndInactive
                }`}
              >
                <div className={styles.emailAndRole}>
                  <span
                    className={`icon-department ${
                      status === RYVYLEmployeesStatusEnum.Inactive
                        ? styles.deptAndPermissionImg
                        : styles.deptAndPermissionImgActive
                    }`}
                  />
                  <div className="w-[100%]">
                    {status === RYVYLEmployeesStatusEnum.Inactive ? (
                      <>
                        <p className={styles.roleAndDeptText}>Department</p>
                        <div>
                          <p
                            className={`${styles.phoneText} ${
                              profileDetails?.departmentName?.length > 27 &&
                              styles.phoneTextTooltip
                            }`}
                            data-tooltip-id="department"
                            data-tooltip-content={
                              !isLoading &&
                              profileDetails?.departmentName?.length > 27
                                ? profileDetails?.departmentName
                                : ""
                            }
                          >
                            {isLoading
                              ? ""
                              : textEllipsis(
                                  profileDetails?.departmentName,
                                  27
                                )}
                          </p>
                          <Tooltip
                            id="department"
                            className={styles.tooltip}
                            classNameArrow={styles.tooltipArrow}
                          />
                        </div>
                      </>
                    ) : (
                      <FormSelectWithAddButton
                        topLabel="Department"
                        label="Select a Department"
                        buttonName="Add Department"
                        options={departmentsList}
                        value={employeeDetailsFormik.values.department}
                        onChange={(option) =>
                          employeeDetailsFormik.setFieldValue(
                            "department",
                            option
                          )
                        }
                        onBlur={() =>
                          employeeDetailsFormik.setFieldTouched("department")
                        }
                        error={
                          employeeDetailsFormik.touched.department &&
                          employeeDetailsFormik.errors.department
                        }
                        openDropdown={viewDepartment}
                        onAddButtonClick={() => {
                          setViewDepartment(!viewDepartment);
                        }}
                      />
                    )}
                  </div>
                </div>
                <div>
                  <div className={styles.emailAndRole}>
                    <span
                      className={`icon-person ${
                        status === RYVYLEmployeesStatusEnum.Inactive
                          ? styles.deptAndPermissionImg
                          : styles.deptAndPermissionImgActive
                      }`}
                    />
                    <div className={styles.permissionRole}>
                      {status === RYVYLEmployeesStatusEnum.Inactive ? (
                        <div>
                          <p className={styles.roleAndDeptText}>
                            Permission Role
                          </p>
                          <div>
                            <p
                              className={`${styles.phoneText} ${
                                profileDetails?.userRoleName?.length > 27 &&
                                styles.phoneTextTooltip
                              }`}
                              data-tooltip-id="permission"
                              data-tooltip-content={
                                !isLoading &&
                                profileDetails?.userRoleName?.length > 27
                                  ? profileDetails?.userRoleName
                                  : ""
                              }
                            >
                              {isLoading
                                ? ""
                                : textEllipsis(
                                    profileDetails?.userRoleName,
                                    27
                                  )}
                            </p>
                            <Tooltip
                              id="permission"
                              className={styles.tooltip}
                              classNameArrow={styles.tooltipArrow}
                            />
                          </div>
                        </div>
                      ) : (
                        <>
                          <FormSelectWithAddButton
                            topLabel="Permission Role"
                            label="Select a Permission Role"
                            buttonName="Add Permission Role"
                            isPermissionDropdown
                            options={permissionsList}
                            value={employeeDetailsFormik.values.permission}
                            onChange={(option) =>
                              employeeDetailsFormik.setFieldValue(
                                "permission",
                                option
                              )
                            }
                            onBlur={() =>
                              employeeDetailsFormik.setFieldTouched(
                                "permission"
                              )
                            }
                            error={
                              employeeDetailsFormik.touched.permission &&
                              employeeDetailsFormik.errors.permission
                            }
                            openDropdown={showNewPermission}
                            onAddButtonClick={() => {
                              setShowNewPermission(!showNewPermission);
                            }}
                          />
                          <p
                            type="button"
                            className={styles.viewPermission}
                            onClick={() => {
                              setViewPermissionModal(!viewPermissionModal);
                            }}
                          >
                            View Permissions
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {status !== RYVYLEmployeesStatusEnum.Inactive && (
              <div className={styles.saveButton}>
                <PrimaryButtonSmall
                  className={styles.buttonStyles}
                  disable={
                    status === RYVYLEmployeesStatusEnum.Active
                      ? !(
                          employeeDetailsFormik.isValid &&
                          employeeDetailsFormik.dirty &&
                          disableNxtBtn
                        ) || isLoading
                      : !employeeDetailsFormik.isValid || isLoading
                  }
                  onClick={handleResendInvitation}
                  label={
                    status === RYVYLEmployeesStatusEnum.Active
                      ? "Save"
                      : "Resend Invitation"
                  }
                />
              </div>
            )}
          </div>
        </div>
      </Card>
      <Card isHeader={false} className={styles.activityLogsData}>
        <ChipTitle>Activity Log</ChipTitle>
        <div className={styles.activityLogContainer}>
          {activityLogsData?.length > 0 ? (
            activityLogsData?.map((item, i) => (
              <div className={styles.activity} key={i}>
                <img src={ryvylActivityLogDot} className={styles.dot} />
                <div className={styles.dateAndDesc}>
                  <p className={styles.dateLog}>
                    {userDateTime(
                      item?.createdAt,
                      false,
                      "MM/DD/YYYY @ hh:mm:ss a"
                    )}
                  </p>
                  <div className={styles?.logContainer}>
                    <p
                      className={styles.descLog}
                      dangerouslySetInnerHTML={createMarkup(
                        `<b>${item?.userName}</b> ${item?.comment}`
                      )}
                    />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className={styles.noActivityLogs}>No Activity Logs</p>
          )}
        </div>
      </Card>
      <InvitationModal
        title={"Delete Invitation"}
        data={employeeDetails}
        show={isDelete}
        onConfirm={() => handleDelete(employeeDetails?.id)}
        onCancel={() => {
          setIsDelete(false);
        }}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        disable={isModalLoading}
        description={
          <p className="text-sm">
            Are you sure you want to delete &nbsp;
            <>
              <span
                className={`${styles.modalUserName} ${
                  employeeDetails?.name?.length > 13 &&
                  styles.modalUserNameTruncate
                }`}
                data-tooltip-id="delete"
                data-tooltip-content={
                  employeeDetails?.name?.length > 13
                    ? employeeDetails?.name
                    : ""
                }
              >
                {`${textEllipsis(employeeDetails?.name, 13)}'s`}
              </span>
              <Tooltip
                id="delete"
                className={styles.tooltip}
                classNameArrow={styles.tooltipArrow}
              />
            </>
            <span className="font-bold"></span>
            <br />
            invitation? They will be removed from your list of
            <br />
            RYVYL employees.
          </p>
        }
      />
      <InvitationModal
        title={"Deactivate Employee"}
        data={employeeDetails}
        show={isDeactivate}
        onConfirm={() =>
          handleStatus(employeeDetails.id, RYVYLEmployeesStatusEnum.Inactive)
        }
        onCancel={() => {
          setIsDeactivate(false);
        }}
        confirmLabel="Deactivate"
        cancelLabel="Cancel"
        disable={isModalLoading}
        description={
          <p className={styles.modalDescription}>
            Are you sure you want to deactivate&nbsp;
            <>
              <span
                className={`${styles.modalUserName} ${
                  employeeDetails?.name?.length > 13 &&
                  styles.modalUserNameTruncate
                }`}
                data-tooltip-id="deactivate"
                data-tooltip-content={
                  employeeDetails?.name?.length > 13
                    ? employeeDetails?.name
                    : ""
                }
              >
                {textEllipsis(employeeDetails?.name, 13)}
              </span>
              <Tooltip
                id="deactivate"
                className={styles.tooltip}
                classNameArrow={styles.tooltipArrow}
              />
            </>
            ?
            <br />
            They will lose all access to the RYVYL Block system.
          </p>
        }
      />
      <InvitationModal
        title={"Activate Employee"}
        data={employeeDetails}
        show={isActivate}
        onConfirm={() =>
          handleStatus(employeeDetails.id, RYVYLEmployeesStatusEnum.Active)
        }
        onCancel={() => {
          setIsActivate(false);
        }}
        confirmLabel="Activate"
        cancelLabel="Cancel"
        disable={isModalLoading}
        description={
          <p className="text-sm">
            Are you sure you want to Activate&nbsp;
            <>
              <span
                className={`${styles.modalUserName} ${
                  employeeDetails?.name?.length > 13 &&
                  styles.modalUserNameTruncate
                }`}
                data-tooltip-id="activate"
                data-tooltip-content={
                  employeeDetails?.name?.length > 13
                    ? employeeDetails?.name
                    : ""
                }
              >
                {textEllipsis(employeeDetails?.name, 13)}
              </span>
              <Tooltip
                id="activate"
                className={styles.tooltip}
                classNameArrow={styles.tooltipArrow}
              />
            </>
            ?
          </p>
        }
      />
      <AddNewPermission
        show={showNewPermission}
        setShowNewPermission={setShowNewPermission}
        onSuccessPermission={onSuccessPermission}
      />
      <ViewPermission
        selectedPermission={employeeDetailsFormik.values.permission}
        show={viewPermissionModal}
        // setViewPermissionModal={setViewPermissionModal}
        permissions={permissionsList}
        handleBackClose={(list) => handlePermissions(list)}
      />
      <AddDepartment
        show={viewDepartment}
        setViewDepartment={setViewDepartment}
        onSuccess={handleDepartmentSuccess}
      />
    </div>
  );
}

const InvitationModal = ({
  title,
  show,
  onConfirm,
  onCancel,
  description,
  confirmLabel,
  cancelLabel,
  disable,
}) => {
  return (
    <Modal
      show={show}
      showCloseButton
      onClose={onCancel}
      className={styles.modal}
    >
      <div className={styles.invitationModal}>
        <h1 className={styles.invitationModal_title}> {title} </h1>
        <p className={styles.invitationModal_description}>{description}</p>
        <PrimaryButton disable={disable} onClick={onConfirm}>
          {confirmLabel}
        </PrimaryButton>
        <span onClick={onCancel} className={styles.modalCancel}>
          {cancelLabel}
        </span>
      </div>
    </Modal>
  );
};

InvitationModal.propTypes = {
  title: PropTypes.string,
  data: PropTypes.any,
  show: PropTypes.bool,
  onConfirm: PropTypes.func,
  onCancel: PropTypes.func,
  description: PropTypes.string,
  confirmLabel: PropTypes.string,
  cancelLabel: PropTypes.string,
  disable: PropTypes.bool,
};

const EmailCell = (email) => (
  <>
    {email ? (
      email?.length > 25 ? (
        `${textEllipsis(email.split("@")[0], 12)}@${email.split("@")[1]}`
      ) : (
        <p>{email}</p>
      )
    ) : (
      ""
    )}
  </>
);

EmailCell.propTypes = {
  email: PropTypes.string,
};
