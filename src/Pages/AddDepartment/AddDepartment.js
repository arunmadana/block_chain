import { Button } from "@mui/joy";
import { useFormik } from "formik";
import { useState } from "react";
import * as Yup from "yup";
import { FormField } from "../../components/FormField/FormField";
import Modal from "../../components/Modal/Modal";
import { addDepartments } from "../../services/Employees/Employees";
import styles from "./AddDepartment.module.scss";

export function AddDepartment({ show, setViewDepartment, onSuccess }) {
  const emojiRegex = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g;
  const numberRegex = /^[^0-9]*$/;
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = (values) => {
    const payload = {
      departmentName: values.role,
    };
    setIsLoading(true);
    addDepartments(payload)
      .then((res) => {
        const successMessage = res?.data?.data?.message;
        console.log(successMessage);
        onSuccess(res?.data?.data?.id);
        formik.resetForm();
        setIsLoading(false);
      })
      .catch((err) => {
        const error = err?.response?.data?.error?.errorDescription;
        console.log(error);
        setIsLoading(false);
      });
  };

  const formik = useFormik({
    initialValues: {
      role: "",
    },
    validationSchema: Yup.object({
      role: Yup.string()
        .required("Department Name is required")
        .test("no numbers", "Department cannot contains numbers", (val) => {
          return numberRegex.test(val);
        })
        .test("no-emojis", "Department Name cannot contain emojis.", (val) => {
          return !emojiRegex.test(val);
        })
        .matches(
          /^(?!\s+$)/,
          "Department Name cannot contain only blankspaces"
        ),
    }),
    onSubmit: handleSave,
  });

  return (
    <Modal
      show={show}
      showBackButton={true}
      onBack={() => {
        setViewDepartment();
        formik.resetForm();
      }}
      showCloseButton
      onClose={() => {
        setViewDepartment();
        formik.resetForm();
      }}
      className={styles.addNewPermissionModal}
    >
      <div className={styles.mainAddPermissions}>
        {" "}
        <h1 className={styles.addEmployeeHeader}>Add Department</h1>
        <p className={styles.descriptionText}>
          Please enter the new department’s name below.
        </p>
        <FormField
          label="Enter Department Name"
          id="department"
          placeholder={"Enter Department Name"}
          maxLength={30}
          autoFocus={true}
          {...formik.getFieldProps("role")}
          error={formik.touched.role && formik.errors.role}
          disableSymbols={false}
          disableNumbers={true}
        />
        <div className={styles.cancelSaveButtons}>
          <Button
            disabled={!(formik.dirty && formik.isValid && !isLoading)}
            onClick={formik.handleSubmit}
          >
            Add
          </Button>
        </div>
      </div>
    </Modal>
  );
}
