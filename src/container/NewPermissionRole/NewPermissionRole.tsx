import { TextareaAutosize as BaseTextareaAutosize } from "@mui/base/TextareaAutosize";
import { Button } from "@mui/joy";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import { Box, Breadcrumbs, Link, Switch, Typography } from "@mui/material";
import { styled } from "@mui/system";
import { useFormik } from "formik";
import { FC, Fragment, useEffect, useState } from "react";
import { Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import {
  addPermissionsRoles,
  getDefaultRoles,
} from "../../services/Employees/Employees";
import styles from "./NewPermissionRole.module.scss";

interface NewPermissionRoleProps {}

const NewPermissionRole: FC<NewPermissionRoleProps> = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [permissionsRolesArray, setPermissionsRolesArray] = useState([]);
  const emojiRegex = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g;

  useEffect(() => {
    setIsLoading(true);
    getDefaultRoles({})
      .then((res) => {
        setIsLoading(false);
        setPermissionsRolesArray(
          res?.data?.data?.sort((a: number, b: number) => a.id - b.id)
        );
      })
      .catch(() => {
        setIsLoading(false);
      });
  }, []);

  const blue = {
    100: "#DAECFF",
    200: "#b6daff",
    400: "#3399FF",
    500: "#007FFF",
    600: "#0072E5",
    900: "#003A75",
  };

  const grey = {
    50: "#F3F6F9",
    100: "#E5EAF2",
    200: "#DAE2ED",
    300: "#C7D0DD",
    400: "#B0B8C4",
    500: "#9DA8B7",
    600: "#6B7A90",
    700: "#434D5B",
    800: "#303740",
    900: "#1C2025",
  };

  const Textarea = styled(BaseTextareaAutosize)(
    ({ theme }) => `
    box-sizing: border-box;
    width:  720px;
    font-family: 'IBM Plex Sans', sans-serif;
    font-size: 0.875rem;
    font-weight: 400;
    margin-top: 10px;
    line-height: 1.5;
    padding: 12px;
    border-radius: 12px 12px 0 12px;
    color: ${theme.palette.mode === "dark" ? grey[300] : grey[900]};
    background: ${theme.palette.mode === "dark" ? grey[900] : "#fff"};
    border: 1px solid ${theme.palette.mode === "dark" ? grey[700] : grey[200]};
    box-shadow: 0px 2px 2px ${
      theme.palette.mode === "dark" ? grey[900] : grey[50]
    };

    &:hover {
      border-color: ${blue[400]};
    }

    &:focus {
      outline: 0;
      border-color: ${blue[400]};
      box-shadow: 0 0 0 3px ${
        theme.palette.mode === "dark" ? blue[600] : blue[200]
      };
    }
  `
  );

  const handleSave = (values: any) => {
    const payload = {
      name: values.name,
      description: values.description,
      authorities: values.permissions.sort(),
    };
    addPermissionsRoles(payload)
      .then((res) => {
        navigate("/dashboards/employees/view", {
          state: { values: values, id: res?.data?.data?.id },
        });
        formik.resetForm();
      })
      .catch(() => {});
  };

  const handleToggleChecked = (item: any) => {
    const updatedPermissions = [...formik.values.permissions];
    if (updatedPermissions?.includes(item.id)) {
      const index = updatedPermissions?.indexOf(item.id);
      updatedPermissions?.splice(index, 1);
    } else {
      if (item?.permission?.split(".")[1]) {
        const i = permissionsRolesArray?.find(
          (x: any) => x.permission == item?.permission?.split(".")[0]
        );
        updatedPermissions?.push(item.id);
        updatedPermissions?.push(i.id);
      } else {
        updatedPermissions?.push(item.id);
      }
    }
    formik.setFieldValue("permissions", [...new Set(updatedPermissions)]);
  };

  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
      permissions: [],
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .required("Permission Role Name is required")
        .test(
          "no-emojis",
          "Name should not contain special characters and numbers.",
          (val) => {
            return !emojiRegex.test(val);
          }
        )
        .matches(
          /^[a-zA-Z\s]*$/g,
          "Name should not contain special characters and numbers."
        )
        .matches(/^(?!\s+$)/, "Role Name cannot contain only blankspaces"),
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
    <Fragment>
      <Breadcrumbs style={{ marginTop: "30px" }} aria-label="breadcrumb">
        <Link underline="hover" color="black" href="/dashboards/employees/">
          RYVYL Employees
        </Link>
        <Typography>New Permission Role</Typography>
      </Breadcrumbs>
      <div>
        <p className="fw-semibold text-black fs-30 mt-3">New Permission Role</p>
      </div>
      <Col>
        <div className="card">
          <div className="card-body">
            <Box sx={{ width: "100%", typography: "body1" }}>
              <div className={styles.name}>
                <FormControl style={{ marginBottom: "10px" }}>
                  <FormLabel>Permission Role Name</FormLabel>
                  <Input
                    {...formik.getFieldProps("name")}
                    error={formik.touched.name && formik.errors.name}
                    placeholder="Permission Role Name"
                  />
                </FormControl>
              </div>
              <Textarea
                id="text"
                minRows={5}
                aria-label="empty textarea"
                placeholder="Description"
                {...formik.getFieldProps("description")}
              />
              <div className={styles.boxContainer}>
                <div>
                  <div className={styles.featuresHeading}>Features</div>
                  {permissionsRolesArray?.map((item: any, i) => (
                    <div
                      className={
                        item?.permission === "Businesses" ||
                        item?.permission === "RYVYL Employees"
                          ? styles.tableData
                          : item?.permission === "Businesses.Edit"
                          ? styles.editTableData
                          : item?.permission === "Exports" && styles.tableData
                      }
                      key={i}
                    >
                      {item?.permission === "Businesses.Edit"
                        ? "Edit"
                        : item?.permission}
                    </div>
                  ))}
                </div>
                <div>
                  <div className={styles.permissionsHeading}>PERMISSION</div>
                  {permissionsRolesArray?.map((item: any, i) => (
                    <div className={styles.tableDatas} key={i}>
                      <Switch
                        checked={formik.values.permissions.includes(item?.id)}
                        onChange={() => handleToggleChecked(item)}
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div className={styles.buttonGroup}>
                <button
                  className={styles.cancelButton}
                  onClick={() => navigate("/dashboards/employees")}
                >
                  Cancel
                </button>
                <Button
                  onClick={formik.handleSubmit}
                  disabled={
                    !(
                      formik.dirty &&
                      formik.isValid &&
                      formik.values.permissions.length
                    ) || isLoading
                  }
                >
                  Save
                </Button>
              </div>
            </Box>
          </div>
        </div>
      </Col>
    </Fragment>
  );
};

export default NewPermissionRole;
