import { useFormik } from "formik";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import styles from "./AddNewPermission.module.scss";
import {
  addPermissionsRoles,
  getDefaultRoles,
} from "../../services/Employees/Employees";
import Modal from "../../components/Modal/Modal";
import { FormField, TextAreaField } from "../../components/FormField/FormField";
import { Button } from "@mui/joy";
import CustomToggle from "../../components/Toggle/Toggle";

export function AddNewPermission({
  show,
  setShowNewPermission,
  onSuccessPermission,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [permissionsRolesArray, setPermissionsRolesArray] = useState([]);
  const emojiRegex = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g;

  const handleSave = (values) => {
    const payload = {
      name: values.role,
      description: values.description,
      authorities: values.permissions,
    };
    setIsLoading(true);
    addPermissionsRoles(payload)
      .then((res) => {
        const data = res?.data?.data;
        onSuccessPermission(data?.id);
        console.log(data.message);
        formik.resetForm();
        setIsLoading(false);
      })
      .catch((err) => {
        const error = err?.response?.data?.error?.errorDescription;
        console.log(error);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    setIsLoading(true);
    if (show) {
      defaultPermissionsList();
    }
  }, [show]);

  const defaultPermissionsList = () => {
    getDefaultRoles().then((res) => {
      const data = res?.data?.data;
      setPermissionsRolesArray(data?.sort((a, b) => a.id - b.id));
      setIsLoading(false);
    });
  };

  const handleToggleChecked = (item) => {
    const updatedPermissions = [...formik.values.permissions];
    if (updatedPermissions?.includes(item.id)) {
      const index = updatedPermissions?.indexOf(item.id);
      updatedPermissions?.splice(index, 1);
    } else {
      if (item?.permission?.split(".")[1]) {
        const i = permissionsRolesArray?.find(
          (x) => x.permission == item?.permission?.split(".")[0]
        );
        updatedPermissions.push(item.id);
        updatedPermissions.push(i.id);
      } else {
        updatedPermissions.push(item.id);
      }
    }
    formik.setFieldValue("permissions", updatedPermissions);
  };
  const formik = useFormik({
    initialValues: {
      role: "",
      description: "",
      permissions: [],
    },
    validationSchema: Yup.object({
      role: Yup.string()
        .required("Permission Role Name is required")
        .matches(/^[a-zA-Z\s]*$/g, {
          message: "special characters, numbers are not valid",
        })
        .test(
          "no-emojis",
          "Permission Role Name should not contain special characters and numbers.",
          (val) => {
            return !emojiRegex.test(val);
          }
        )
        .matches(
          /^(?!\s+$)/,
          "Permission Role Name cannot contain only blankspaces"
        ),
      description: Yup.string()
        .required("Description is required")
        .test("no-emojis", "Description cannot contain emojis", (val) => {
          return !emojiRegex.test(val);
        })
        .matches(/^(?!\s+$)/, "Description cannot contain only blankspaces"),
    }),
    onSubmit: handleSave,
  });

  return (
    <Modal
      loadingSpinner={isLoading}
      show={show}
      showBackButton={true}
      onBack={() => {
        formik.resetForm();
        setShowNewPermission();
      }}
      showCloseButton
      onClose={() => {
        formik.resetForm();
        setShowNewPermission();
      }}
      className={styles.addNewPermissionModal}
    >
      <div className={styles.mainAddPermissions}>
        <h1 className={styles.addEmployeeHeader}>Add Permission Role</h1>
        <FormField
          label="Permission Role Name"
          id="permission-role"
          placeholder={"Enter Permission Role Name"}
          maxLength={30}
          autoFocus={true}
          {...formik.getFieldProps("role")}
          error={formik.touched.role && formik.errors.role}
          disableSymbols={true}
          disableNumbers={true}
        />
        <TextAreaField
          placeHolder={"Enter Description"}
          label="Description"
          id="Description"
          charLimit={120}
          {...formik.getFieldProps("description")}
          className={styles.textArea}
          error={formik.touched.description && formik.errors.description}
          onChange={formik.handleChange}
        />
        <div className={styles.permissionsGrid}>
          <div>
            <div className={styles.featuresHeading}>FEATURES</div>
            {permissionsRolesArray?.map((item, i) => (
              <div
                className={
                  item?.permission === "Businesses" ||
                  item?.permission === "RYVYL Employees"
                    ? styles.businessesTableData
                    : item?.permission?.split(".")[1] === "Edit"
                    ? styles.editTableData
                    : item?.permission === "Exports" && styles.exportsTableData
                }
                key={i}
              >
                {item?.permission?.split(".")[1]
                  ? item?.permission?.split(".")[1]
                  : item.permission}
              </div>
            ))}
          </div>
          <div>
            <div className={styles.permissionsHeading}>PERMISSION</div>
            {permissionsRolesArray?.map((item, i) => (
              <div
                className={
                  item?.permission?.split(".")[1] === "Edit"
                    ? styles.editCustomToggle
                    : styles.CustomToggle
                }
                key={i}
              >
                <CustomToggle
                  color="ryvyl-blue"
                  checked={formik.values.permissions.includes(item.id)}
                  onChange={() => {
                    handleToggleChecked(item);
                  }}
                />
              </div>
            ))}
          </div>
        </div>
        <div className={styles.cancelSaveButtons}>
          <Button
            disabled={
              !(
                formik.dirty &&
                formik.isValid &&
                formik.values.permissions.length &&
                !isLoading
              )
            }
            onClick={formik.handleSubmit}
          >
            Add
          </Button>
        </div>
      </div>
    </Modal>
  );
}
