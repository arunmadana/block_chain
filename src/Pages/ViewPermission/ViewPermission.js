import { useFormik } from "formik";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import { HBar } from "../../components/Bars/Bars";
import { FormSelectWithAddButton } from "../../components/FormField/FormField";
import Modal from "../../components/Modal/Modal";
import {
  getAddPermissionsRoles,
  getPermissionsList,
} from "../../services/Employees/Employees";
import { AddNewPermission } from "../AddNewPermission/AddNewPermission";
import styles from "./ViewPermission.module.scss";

export function ViewPermission({
  selectedPermission,
  permissions,
  show,
  handleBackClose = () => {},
}) {
  const [permissionsList, setPermissionsList] = useState(permissions);
  const [showNewPermission, setShowNewPermission] = useState(false);
  const [permissionUpdated, setPermissionUpdated] = useState(false);

  const [permissionsData, setPermissionsData] = useState(false);
  const [permissionsRolesArray, setPermissionsRolesArray] = useState([]);
  const authorities = permissionsData?.authoritiesList?.sort((a, b) => {
    return a.id - b.id;
  });
  const businesses = authorities?.find((x) => x.permission === "Businesses");
  const businessesEdit = authorities?.find(
    (x) => x.permission === "Businesses.Edit"
  );
  const exports = authorities?.find((x) => x.permission === "Exports");
  const ryvylEmployees = authorities?.find(
    (x) => x.permission === "RYVYL Employees"
  );

  const formik = useFormik({
    initialValues: {
      permission: "",
      permissions: [],
    },
    validationSchema: Yup.object({
      permission: Yup.object().required("Permission Role is required"),
    }),
  });

  useEffect(() => {
    if (
      selectedPermission &&
      (formik.values.permission == "" ||
        Object.keys(formik.values.permission)?.length > 0)
    ) {
      formik.setFieldValue("permission", selectedPermission);
    }
  }, [selectedPermission, show]);

  const getRyvylPermissionRoles = (id) => {
    getAddPermissionsRoles(id)
      .then((res) => {
        setPermissionsData(res?.data?.data);
        setPermissionsRolesArray(res?.data?.data?.authoritiesList);
      })
      .catch((err) => {
        console.log(err?.response?.data?.error?.errorDescription);
      });
  };

  useEffect(() => {
    if (show) {
      getRyvylPermissionRoles(formik.values.permission.value);
    }
  }, [formik.values.permission]);

  useEffect(() => {
    if (show) {
      getRyvylPermissionRoles(selectedPermission?.value);
      getPermissionRoles();
    }
  }, [show]);

  const onSuccessPermission = () => {
    setShowNewPermission(false);
    getPermissionRoles();
  };

  // api call for getting all permission roles
  const getPermissionRoles = () => {
    getPermissionsList({
      sortProperties: "id",
      sortDirection: "ASC",
    })
      .then((res) => {
        const response = res.data?.data?.items;
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
        console.log(error);
      });
  };

  return (
    <>
      <Modal
        show={show && !showNewPermission}
        showCloseButton
        showBackButton={true}
        onBack={() => {
          handleBackClose(permissionUpdated && formik.values.permission);
          formik.resetForm();
        }}
        onClose={() => {
          handleBackClose(permissionUpdated && formik.values.permission);
          formik.resetForm();
        }}
        className={styles.viewPermissionModal}
      >
        <div className={styles.mainAddPermissions}>
          <h1 className={styles.addEmployeeHeader}>View Permission Role</h1>
          <div className={styles.formSelectButtonMain}>
            <FormSelectWithAddButton
              topLabel="Permission Role"
              label="Select a Permission Roles"
              buttonName="Add Permission Role"
              isPermissionDropdown
              options={permissionsList}
              value={formik.values.permission}
              onChange={(option) => {
                formik.setFieldValue("permission", option);
                setPermissionUpdated(true);
              }}
              onBlur={() => formik.setFieldTouched("permission")}
              error={formik.touched.permission && formik.errors.permission}
              onAddButtonClick={() => {
                setShowNewPermission(!showNewPermission);
              }}
            />
          </div>
          <HBar className={styles.hBarDiv} />
          <h1 className={styles.addEmployeeHeader}>
            {formik.values.permission?.label}
          </h1>
          <p className={styles.permissionRoleDesc}>
            {formik.values.permission?.description
              ? formik.values.permission?.description
              : permissionsData.description}
          </p>

          <div className={styles.permissionsGrid}>
            <div>
              <div className={styles.featuresHeading}>FEATURES</div>
              <div className={styles.businessesTableData}>Businesses</div>
              <div className={styles.editTableData}>Edit</div>
              <div className={styles.businessesTableData}>RYVYL Employees</div>
              <div className={styles.exportsTableData}>Exports</div>
            </div>
            <div>
              <div>
                <div className={styles.permissionsHeading}>PERMISSION</div>
                <div className={styles.CustomToggle}>
                  {businesses?.isAccessAble ? (
                    <div className={`icon-tick ${styles.tickColor}`} />
                  ) : (
                    <div className={styles.dashed}>--</div>
                  )}
                </div>
                <div className={styles.editCustomToggle}>
                  {businessesEdit?.isAccessAble ? (
                    <div className={`icon-tick ${styles.tickColor}`} />
                  ) : (
                    <div className={styles.dashed}>--</div>
                  )}
                </div>
                <div className={styles.CustomToggle}>
                  {ryvylEmployees?.isAccessAble ? (
                    <div className={`icon-tick ${styles.tickColor}`} />
                  ) : (
                    <div className={styles.dashed}>--</div>
                  )}
                </div>
                <div className={styles.CustomToggle}>
                  {exports?.isAccessAble ? (
                    <div className={`icon-tick ${styles.tickColor}`} />
                  ) : (
                    <div className={styles.dashed}>--</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>
      <AddNewPermission
        onSuccessPermission={onSuccessPermission}
        show={showNewPermission}
        setShowNewPermission={setShowNewPermission}
      />
    </>
  );
}
