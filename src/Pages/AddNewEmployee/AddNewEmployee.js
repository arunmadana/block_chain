import { Button } from "@mui/joy";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import {
  FormField,
  FormPhoneWithCode,
  FormSelectWithAddButton,
} from "../../components/FormField/FormField";
import Modal from "../../components/Modal/Modal";
import {
  addNewEmployee,
  countryList,
  getAllDepartments,
  getPermissionsList,
} from "../../services/Employees/Employees";
import { AddDepartment } from "../AddDepartment/AddDepartment";
import { AddNewPermission } from "../AddNewPermission/AddNewPermission";
import { ViewPermission } from "../ViewPermission/ViewPermission";
import styles from "./AddNewEmployee.module.scss";

export default function AddNewEmployee({
  isModalOpen = false,
  setIsModalOpen,
  handleList = () => {},
}) {
  const [departmentsList, setDepartmentsList] = useState([]);
  const [countryData, setCountryData] = useState([]);
  const [countryRegex, setCountryRegex] = useState([]);
  const [countryCodeError, setCountryCodeError] = useState(false);
  const [permissionsList, setPermissionsList] = useState([]);
  const [showNewPermission, setShowNewPermission] = useState(false);
  const [viewPermissionModal, setViewPermissionModal] = useState(false);
  const [viewDepartment, setViewDepartment] = useState(false);
  const [isSafari, setIsSafari] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (
      window.navigator.userAgent.toLowerCase().indexOf("safari") != -1 &&
      window.navigator.userAgent.indexOf("Chrome") === -1
    ) {
      setIsSafari(true);
    }
  }, []);

  useEffect(() => {
    if (isModalOpen) {
      getDepartments();
      getPermissionRoles();
      getCountryList();
    }
  }, [isModalOpen]);

  const handleViewRole = () => {
    // if (newEmployeeFormik.values.permission == '') {
    //   newEmployeeFormik.setFieldValue('permission', permissionsList[0]);
    // }
    setViewPermissionModal(!viewPermissionModal);
  };

  const getCountryList = () => {
    countryList()
      .then((res) => {
        const data = res?.data?.data;
        const sortedList = data?.sort((a, b) =>
          a?.country.localeCompare(b?.country)
        );
        setCountryData(sortedList);
      })
      .catch((err) => {
        const error = err?.response?.data?.error?.errorDescription;
        console.log(error);
      });
  };

  // api call for getting all departments
  const getDepartments = (id) => {
    getAllDepartments()
      .then((res) => {
        const response = res?.data?.data;
        const updatedList = response?.map((item) => ({
          value: item?.id,
          label: item?.departmentName,
        }));
        if (id) {
          const selectedRole = response?.find((role) => role.id === id);
          if (selectedRole) {
            newEmployeeFormik.setFieldValue("department", {
              value: selectedRole?.id,
              label: selectedRole?.departmentName,
            });
          }
        }
        setDepartmentsList(updatedList);
      })
      .catch((err) => {
        const error =
          err?.response?.data?.error?.errorDescription ||
          "Failed to get departments";
        console.log(error);
      });
  };

  // api call for getting all permission roles
  const getPermissionRoles = (id) => {
    getPermissionsList({
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
        if (id) {
          const selectedRole = response?.find((role) => role.id === id);
          if (selectedRole) {
            newEmployeeFormik.setFieldValue("permission", {
              value: selectedRole?.id,
              label: selectedRole?.name,
              description: selectedRole?.description,
              isStar: selectedRole?.isDefaultRole,
              userCount: selectedRole?.userCount,
            });
          }
        }
        setPermissionsList(updatedList);
      })
      .catch((err) => {
        const error =
          err?.response?.data?.error?.errorDescription ||
          "Failed to get permission roles";
        console.log(error);
      });
  };

  // api call for adding new employee
  const handleSubmit = (values) => {
    const payload = {
      department: values.department.value,
      email: values.email,
      firstName: values.firstName,
      lastName: values.lastName,
      userRole: values.permission.value,
      phoneNumberDto: {
        countryCode: countryRegex?.countryShortCode,
        phoneNumber: values.phoneNumber?.replace(/[^\d]/g, ""),
      },
    };
    setIsLoading(true);
    addNewEmployee(payload)
      .then((res) => {
        const message = res.data?.data?.message;
        setIsModalOpen();
        newEmployeeFormik.resetForm();
        handleList();
        console.log(message ?? "The Employee invitation has been sent.");
        setIsLoading(false);
      })
      .catch((err) => {
        const error =
          err?.response?.data?.error?.errorDescription ||
          "Failed to add new employee";
        console.log(error);
        setIsLoading(false);
      });
  };

  const handleDepartmentSuccess = (id) => {
    setViewDepartment(false);
    getDepartments(id);
  };

  const onSuccessPermission = (id) => {
    setShowNewPermission(false);
    getPermissionRoles(id);
  };

  const regex = /^[a-zA-Z\s]*$/g;
  const newEmployeeFormik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      permission: "",
      department: "",
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
        .matches(/^(?!\s+$)/, "Email Address cannot contain only blankspaces")
        .matches(
          /^([a-zA-Z0-9_.-])+@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,6}$)+$/,
          "Invalid Email"
        ),
      phoneNumber: Yup.string()
        .required("Phone Number is required")
        .test(
          "len",
          countryRegex?.minLength !== countryRegex?.maxLength
            ? `Phone Number must be min ${countryRegex?.minLength} and max ${countryRegex?.maxLength} digits`
            : `Phone Number must be ${countryRegex?.minLength} digits`,
          (value) =>
            value?.replace(/[^\d]/g, "")?.toString().length >=
              countryRegex?.minLength &&
            value?.replace(/[^\d]/g, "")?.toString().length <=
              countryRegex?.maxLength
        ),
      phoneCode: Yup.string().required("Please select Country Code"),
      department: Yup.object().required("Department is required"),
      permission: Yup.object().required("Permission Role is required"),
    }),
    onSubmit: handleSubmit,
  });

  useEffect(() => {
    if (
      newEmployeeFormik?.values?.phoneNumber?.length >= 1 &&
      countryRegex.length == 0
    ) {
      setCountryCodeError(true);
    } else {
      setCountryCodeError(false);
    }
  }, [countryRegex, newEmployeeFormik?.values?.phoneNumber]);

  const handlePermissions = (list) => {
    setViewPermissionModal(false);
    if (list) {
      newEmployeeFormik.setFieldValue("permission", list);
    }
  };

  useEffect(() => {
    if (countryRegex?.countryShortCode) {
      newEmployeeFormik.setFieldTouched("phoneNumber", true);
    }
  }, [countryRegex]);

  return (
    <>
      <Modal
        show={
          isModalOpen &&
          !showNewPermission &&
          !viewPermissionModal &&
          !viewDepartment
        }
        showCloseButton
        onClose={() => {
          setIsModalOpen();
          newEmployeeFormik.resetForm();
        }}
        className={`${styles.addEmployeeModal}`}
      >
        <div className={styles.addNewEmployeeMainContainer}>
          <h1 className={styles.addEmployeeHeader}>Add Employee</h1>
          <div className={styles.addEmployeeMainBody}>
            <div className={styles.addEmployeeContactMainContainer}>
              <p className={styles.hBarHeader}>Contact Information</p>
              <div className={styles.hBar} />
            </div>
            <div className={styles.firstFormContainer}>
              <FormField
                id="firstName"
                label="First Name"
                placeholder="First Name"
                isNewEmployee
                disableNumbers
                disableSymbols
                autoFocus
                maxLength={30}
                {...newEmployeeFormik.getFieldProps("firstName")}
                error={
                  newEmployeeFormik.touched.firstName &&
                  newEmployeeFormik.errors.firstName
                }
              />
              <FormField
                id="lastName"
                label="Last Name"
                placeholder="Last Name"
                isNewEmployee
                disableNumbers
                disableSymbols
                maxLength={30}
                {...newEmployeeFormik.getFieldProps("lastName")}
                error={
                  newEmployeeFormik.touched.lastName &&
                  newEmployeeFormik.errors.lastName
                }
              />
              <FormField
                id="email"
                label="Email Address"
                isNewEmployee
                placeholder="Email Address"
                maxLength={255}
                {...newEmployeeFormik.getFieldProps("email")}
                error={
                  newEmployeeFormik.touched.email &&
                  newEmployeeFormik.errors.email
                }
              />

              <FormPhoneWithCode
                label="Phone Number"
                id="Phone Number"
                placeholder="Phone Number"
                options={countryData}
                selectedCode={newEmployeeFormik?.values?.phoneCode}
                onCodeChange={(option, clickCount) => {
                  setCountryRegex(option);
                  newEmployeeFormik.setFieldValue(
                    "phoneCode",
                    option.phoneCountryCode
                  );
                  if (clickCount >= 1) {
                    newEmployeeFormik.setFieldValue("phoneNumber", "");
                  }
                }}
                errorClassName={styles.errorClassName}
                {...newEmployeeFormik.getFieldProps("phoneNumber")}
                error={
                  !countryCodeError
                    ? newEmployeeFormik.touched.phoneNumber &&
                      newEmployeeFormik.errors.phoneNumber
                    : newEmployeeFormik?.touched?.phoneCode &&
                      newEmployeeFormik?.errors?.phoneCode
                }
              />
            </div>
            <div className={styles.addEmployeeContactMainContainer}>
              <p className={styles.hBarHeader}>Department & Permission</p>
              <div className={styles.hBar} />
            </div>
            <FormSelectWithAddButton
              topLabel="Department"
              label="Select a Department"
              buttonName="Add Department"
              options={departmentsList}
              dropdownClassName={styles.dropdownClassName}
              value={newEmployeeFormik.values.department}
              onChange={(option) =>
                newEmployeeFormik.setFieldValue("department", option)
              }
              onBlur={() => newEmployeeFormik.setFieldTouched("department")}
              error={
                newEmployeeFormik.touched.department &&
                newEmployeeFormik.errors.department
              }
              openDropdown={viewDepartment}
              onAddButtonClick={() => {
                setViewDepartment(!viewDepartment);
              }}
            />
            <FormSelectWithAddButton
              topLabel="Permission Role"
              label="Select a Permission Roles"
              buttonName="Add Permission Role"
              isPermissionDropdown={true}
              dropdownClassName={
                isSafari ? styles.safariDropdown : styles.dropdownClassName
              }
              options={permissionsList}
              value={newEmployeeFormik.values.permission}
              onChange={(option) =>
                newEmployeeFormik.setFieldValue("permission", option)
              }
              onBlur={() => newEmployeeFormik.setFieldTouched("permission")}
              error={
                newEmployeeFormik.touched.permission &&
                newEmployeeFormik.errors.permission
              }
              openDropdown={showNewPermission}
              onAddButtonClick={() => {
                setShowNewPermission(!showNewPermission);
              }}
            />
            <button
              type="button"
              className={styles.viewPermissionButton}
              onClick={handleViewRole}
            >
              View Permissions
            </button>
            <div className={styles.sendInvitationButton}>
              <Button
                className={styles.sendInvitationSize}
                disabled={
                  !(
                    newEmployeeFormik.dirty &&
                    newEmployeeFormik.isValid &&
                    !isLoading
                  )
                }
                onClick={newEmployeeFormik.handleSubmit}
              >
                Send Invitation
              </Button>
            </div>
          </div>
        </div>
      </Modal>
      <AddNewPermission
        show={showNewPermission}
        setShowNewPermission={setShowNewPermission}
        onSuccessPermission={onSuccessPermission}
      />
      <ViewPermission
        selectedPermission={
          newEmployeeFormik.values.permission == ""
            ? permissionsList[0]
            : newEmployeeFormik.values.permission
        }
        show={viewPermissionModal}
        handleBackClose={(list) => handlePermissions(list)}
        permissions={permissionsList}
      />
      <AddDepartment
        show={viewDepartment}
        setViewDepartment={setViewDepartment}
        onSuccess={handleDepartmentSuccess}
      />
    </>
  );
}
