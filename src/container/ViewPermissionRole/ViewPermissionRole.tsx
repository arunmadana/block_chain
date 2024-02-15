import { TextareaAutosize as BaseTextareaAutosize } from "@mui/base/TextareaAutosize";
import StarIcon from "@mui/icons-material/Star";
import { Button } from "@mui/joy";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import { Box, Breadcrumbs, Link, Switch, Typography } from "@mui/material";
import { styled } from "@mui/system";
import { useFormik } from "formik";
import * as React from "react";
import { Fragment, useEffect } from "react";
import { Col } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import * as Yup from "yup";
import editImg from "../../assets/images/new/edit.webp";
import tickImg from "../../assets/images/new/tick.png";
import {
  getAddPermissionsRoles,
  getPermissionsRolesActivityLogs,
  updatePermissionsRoles,
} from "../../services/Employees/Employees";
import styles from "./ViewPermissionRole.module.scss";

type ViewPermissionRoleProps = {};

export const ViewPermissionRole: React.FunctionComponent<
  ViewPermissionRoleProps
> = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [permissionsData, setPermissionsData] = React.useState({
    id: "",
    name: "",
    description: "",
    isDefaultRole: false,
    createdDate: "",
    modifiedDate: "",
    authoritiesList: [],
  });
  const [activityLogData, setActivityLogData] = React.useState([]);
  const [permissionsRolesArray, setPermissionsRolesArray] = React.useState([]);
  const location = useLocation();
  const id = location?.state?.id;
  const [edit, setEdit] = React.useState(false);
  const authorities = permissionsData?.authoritiesList?.sort(
    (a: any, b: any) => {
      return a.id - b.id;
    }
  );
  const businesses = authorities?.find(
    (x: any) => x.permission === "Businesses"
  );
  const businessesEdit = authorities?.find(
    (x: any) => x.permission === "Businesses.Edit"
  );
  const exports = authorities?.find((x: any) => x.permission === "Exports");
  const ryvylEmployees = authorities?.find(
    (x: any) => x.permission === "RYVYL Employees"
  );
  const emojiRegex = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g;

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
    width:  100%;
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

  const handleSave = (values: object) => {
    setIsLoading(true);
    const payloadData = {
      name: values.name,
      description: values.description,
      authorities: values.permissions.sort(),
    };
    updatePermissionsRoles(id, payloadData)
      .then(() => {
        setIsLoading(false);
        setEdit(false);
        getRolesEdit();
        getActivityLogs();
      })
      .catch(() => {
        setEdit(false);
        setIsLoading(false);
      });
    formik.resetForm();
  };

  const createMarkup = (html: any) => {
    return { __html: html };
  };

  useEffect(() => {
    getActivityLogs();
    getRolesEdit();
  }, []);

  const getRolesEdit = () => {
    setIsLoading(true);
    getAddPermissionsRoles(id)
      .then((res) => {
        setIsLoading(false);
        setPermissionsData(res?.data?.data);
        setPermissionsRolesArray(
          res?.data?.data?.authoritiesList?.sort(
            (a: any, b: any) => a.id - b.id
          )
        );
      })
      .catch(() => {
        setIsLoading(false);
      });
  };

  const getActivityLogs = () => {
    setIsLoading(true);
    getPermissionsRolesActivityLogs({
      referenceId: id.toString(),
      activityType: 5,
    })
      .then((res) => {
        setIsLoading(false);
        setActivityLogData(res?.data?.data.reverse());
      })
      .catch(() => {
        setIsLoading(false);
      });
  };

  const handleToggleChecked = (item: any) => {
    const updatedPermissions = [...formik.values.permissions];
    if (updatedPermissions.includes(item.id)) {
      const index = updatedPermissions.indexOf(item.id);
      updatedPermissions.splice(index, 1);
    } else if (item?.permission?.split(".")[1]) {
      const i = permissionsRolesArray.find(
        (x) => x.permission == item?.permission.split(".")[0]
      );
      updatedPermissions.push(item.id);
      updatedPermissions.push(i.id);
    } else {
      updatedPermissions.push(item.id);
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

  useEffect(() => {
    if (edit) {
      formik.setValues({
        name: permissionsData?.name,
        description: permissionsData?.description,
        permissions: permissionsData?.authoritiesList
          ?.filter((item: any) => item.isAccessAble === true)
          .map((item: any) => item.id),
      });
    }
  }, [edit]);

  const checkArraysAreEqual = () => {
    let currentArray = permissionsData?.authoritiesList
      ?.filter((item: any) => item.isAccessAble === true)
      .map((item: any) => item.id)
      .sort();

    let updatedArray = formik.values.permissions.sort();

    if (currentArray?.length !== updatedArray?.length) {
      return false; // If the lengths are different, the arrays can't be the same
    }
    for (let i = 0; i < currentArray?.length; i++) {
      if (currentArray[i] !== updatedArray[i]) {
        return false; // If any elements differ, the arrays are not the same
      }
    }
    return true; // If none of the above conditions were met, the arrays are the same
  };

  return (
    <Fragment>
      <Breadcrumbs style={{ marginTop: "30px" }} aria-label="breadcrumb">
        <Link underline="hover" color="black" href="/dashboards/employees/">
          RYVYL Employees
        </Link>
        <Typography>Edit Permission Role</Typography>
      </Breadcrumbs>
      <div>
        <p className="fw-semibold text-black fs-30 mt-3">
          Edit Permission Role
        </p>
      </div>
      <Col>
        <div className="card">
          <div className="card-body">
            <Box sx={{ width: "100%", typography: "body1" }}>
              <div className={styles.grid}>
                <div>
                  {edit ? (
                    <div>
                      <FormControl style={{ marginBottom: "10px" }}>
                        <FormLabel>Permission Role Name</FormLabel>
                        <Input
                          id="name"
                          {...formik.getFieldProps("name")}
                          placeholder="Permission Role Name"
                          error={formik.touched.name && formik.errors.name}
                        />
                      </FormControl>
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
                          {permissionsRolesArray?.map(
                            (item: any, i: number) => (
                              <div
                                className={
                                  item?.permission === "Businesses" ||
                                  item?.permission === "RYVYL Employees"
                                    ? styles.tableData
                                    : item?.permission === "Businesses.Edit"
                                    ? styles.editTableData
                                    : item?.permission === "Exports" &&
                                      styles.tableData
                                }
                                key={i}
                              >
                                {item?.permission === "Businesses.Edit"
                                  ? "Edit"
                                  : item?.permission}
                              </div>
                            )
                          )}
                        </div>
                        <div>
                          <div className={styles.permissionsHeading}>
                            PERMISSION
                          </div>
                          {permissionsRolesArray?.map(
                            (item: any, i: number) => (
                              <div className={styles.tableDatas} key={i}>
                                <Switch
                                  checked={formik.values.permissions.includes(
                                    item?.id
                                  )}
                                  onChange={() => handleToggleChecked(item)}
                                />
                              </div>
                            )
                          )}
                        </div>
                      </div>
                      <div className={styles.buttonGroup}>
                        <button
                          onClick={() => setEdit(false)}
                          className={styles.cancelButton}
                        >
                          Cancel
                        </button>
                        <Button
                          disabled={
                            isLoading ||
                            (formik.values.name === permissionsData?.name &&
                              formik.values.description ===
                                permissionsData?.description &&
                              checkArraysAreEqual()) ||
                            !(
                              formik.isValid &&
                              formik.dirty &&
                              formik.values.permissions.length
                            )
                          }
                          onClick={formik.handleSubmit}
                        >
                          Save
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className={styles.nameAndButton}>
                        <span className={styles.roleName}>
                          {permissionsData?.name}
                          {location?.state?.isDefaultRole && (
                            <StarIcon
                              style={{
                                fontSize: "20px",
                                color: "#0460e3",
                                marginTop: "-2px",
                                marginLeft: "5px",
                              }}
                            />
                          )}
                        </span>
                        {!permissionsData?.isDefaultRole && (
                          <button
                            className={styles.editButton}
                            onClick={() => setEdit(true)}
                          >
                            <img src={editImg} width={15} height={15} />
                            Edit
                          </button>
                        )}
                      </div>
                      <span className={styles.description}>
                        {permissionsData?.description}
                      </span>
                      <div className={styles.editBoxContainer}>
                        <div>
                          <div className={styles.featuresHeading}>Features</div>
                          <div className={styles.tableData}>Businesses</div>
                          <div className={styles.editTableData}>Edit</div>
                          <div className={styles.tableData}>
                            RYVYL Employees
                          </div>
                          <div className={styles.tableData}>Exports</div>
                        </div>
                        <div>
                          <div className={styles.permissionsHeading}>
                            PERMISSION
                          </div>
                          <div className={styles.tableDatas}>
                            {businesses?.isAccessAble ? (
                              <img src={tickImg} width={20} height={20} />
                            ) : (
                              "--"
                            )}
                          </div>
                          <div className={styles.tableDatas}>
                            {businessesEdit?.isAccessAble ? (
                              <img src={tickImg} width={20} height={20} />
                            ) : (
                              "--"
                            )}
                          </div>
                          <div className={styles.tableDatas}>
                            {ryvylEmployees?.isAccessAble ? (
                              <img src={tickImg} width={20} height={20} />
                            ) : (
                              "--"
                            )}
                          </div>
                          <div className={styles.tableDatas}>
                            {exports?.isAccessAble ? (
                              <img src={tickImg} width={20} height={20} />
                            ) : (
                              "--"
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div>
                  <FormLabel>Activity Log</FormLabel>
                  <div>
                    <div className={styles.activityLogContainer}>
                      {activityLogData.map((item: any, i: number) => (
                        <div key={i} className={styles.log}>
                          <div className={styles.dot} />
                          <div className={styles.logTexts}>
                            <span className={styles.timeText}>
                              {item?.createdAt}
                            </span>
                            <div
                              className={styles.comment}
                              dangerouslySetInnerHTML={createMarkup(
                                `<b>${item?.userName}</b> ${item.comment}`
                              )}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Box>
          </div>
        </div>
      </Col>
    </Fragment>
  );
};
