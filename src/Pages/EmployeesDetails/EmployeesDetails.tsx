import { Button, FormControl, FormLabel, Input } from "@mui/joy";
import { Breadcrumbs, Link, Typography } from "@mui/material";
import { useFormik } from "formik";
import { FC, Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import * as Yup from "yup";
import { EmployeesStatusEnum } from "../../Enums/EmployeesStatusEnum";
import { fetchUserDetailsAction } from "../../Store/ducks/adminUserDetails";
import image from "../../assets/images/new/image.png";
import { FormSelect } from "../../components/Select/Select";
import {
  getPermissionsRolesActivityLogs,
  viewProfile,
} from "../../services/Employees/Employees";
import styles from "./EmployeesDetails.module.scss";

interface EmployeesDetailsProps {}

const EmployeesDetails: FC<EmployeesDetailsProps> = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const id = useSelector((store) => store.adminUserDetails?.data);
  const employeeDetails = location?.state;
  const [isLoading, setIsLoading] = useState(false);
  const [activityLogsData, setActivityLogsData] = useState([]);
  const [profileDetails, setProfileDetails] = useState({});
  const [status, setStatus] = useState(employeeDetails?.status);
  const [isDelete, setIsDelete] = useState(false);
  const [isDeactivate, setIsDeactivate] = useState(false);
  const [isActivate, setIsActivate] = useState(false);
  const createMarkup = (html: any) => {
    return { __html: html };
  };

  console.log(id);

  const viewProfileDetails = () => {
    setIsLoading(true);
    viewProfile({ userId: location?.state?.id })
      .then((res) => {
        setIsLoading(false);
        setProfileDetails(res?.data?.data);
        setStatus(res?.data?.data?.status);
      })
      .catch(() => {
        setIsLoading(false);
      });
  };

  const getActivityLogs = () => {
    getPermissionsRolesActivityLogs({
      activityType: 2,
      userId: employeeDetails?.id,
    })
      .then((res) => {
        setActivityLogsData(res?.data?.data.reverse());
      })
      .catch(() => {});
  };

  useEffect(() => {
    // dispatch(fetchUserDetailsAction());
    viewProfileDetails();
    getActivityLogs();
  }, []);

  useEffect(() => {
    formik.setValues({
      email: profileDetails?.email,
      phoneNumber: profileDetails?.phoneNumberDto?.phoneNumber,
      permission: profileDetails?.userRoleName,
      department: profileDetails?.departmentName,
    });
  }, [profileDetails]);

  const handleInvitationClick = () => {
    if (status === EmployeesStatusEnum.Active) {
      if (id !== employeeDetails?.id) {
        setIsDeactivate(true);
      } else {
        return;
      }
    } else if (
      status === EmployeesStatusEnum.Expired ||
      status === EmployeesStatusEnum.Pending
    ) {
      setIsDelete(true);
    } else {
      setIsActivate(true);
    }
  };

  const formik = useFormik({
    initialValues: {
      email: "",
      phoneNumber: "",
      permission: "",
      department: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .required("Please enter your email")
        .matches(
          /^([a-zA-Z0-9_.-])+@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,6}$)+$/,
          "Invalid Email"
        ),
      phoneNumber: Yup.string().required("Please enter Phone Number."),
      department: Yup.object().required("Employee Department is required"),
      permission: Yup.object().required("Permission Role is required"),
    }),
    // onSubmit: handleSubmit
  });

  return (
    <Fragment>
      <Breadcrumbs style={{ marginTop: "30px" }} aria-label="breadcrumb">
        <Link underline="hover" color="black" href="/dashboards/employees/">
          RYVYL Employees
        </Link>
        <Typography>{employeeDetails?.name}</Typography>
      </Breadcrumbs>
      <div className={styles.card}>
        <div className={styles.nameAndDeptGrid}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              height: "200px",
              justifyContent: "space-between",
            }}
          >
            <div className={styles.imageAndName}>
              <img src={image} alt="user_image" className={styles.image} />
              <div className={styles.nameId}>
                <span className={styles.name}>{employeeDetails?.name}</span>
                <span className={styles.userId}>
                  Account ID: EMP-{employeeDetails?.id}
                </span>
                <div
                  style={{ marginTop: "20px" }}
                  className={`chips chips--${
                    employeeDetails?.status === 2
                      ? "green"
                      : employeeDetails?.status === 1
                      ? "orange"
                      : employeeDetails?.status === 4
                      ? "red"
                      : "grey"
                  }`}
                >
                  <div
                    className={`chips__text--${
                      employeeDetails?.status === 2
                        ? "green"
                        : employeeDetails?.status === 1
                        ? "orange"
                        : employeeDetails?.status === 4
                        ? "red"
                        : "grey"
                    } `}
                  >
                    {employeeDetails?.status === 2
                      ? "Active"
                      : employeeDetails?.status === 1
                      ? "Pending"
                      : employeeDetails?.status === 4
                      ? "Expired"
                      : employeeDetails?.status === 3 && "In active"}
                  </div>
                </div>
              </div>
            </div>
            <span>
              {status === EmployeesStatusEnum.Inactive
                ? "Deactivated"
                : status === EmployeesStatusEnum.Active
                ? "Activated"
                : status === EmployeesStatusEnum.Pending
                ? "Invitation sent"
                : "Expired"}{" "}
              on{" "}
              {status === EmployeesStatusEnum.Active
                ? profileDetails?.activatedOn
                : profileDetails?.modifiedDate}
              .{" "}
              <button
                type="button"
                className={styles.status}
                // onClick={handleInvitationClick}
              >
                {status === EmployeesStatusEnum.Pending ||
                status === EmployeesStatusEnum.Expired
                  ? "Delete Invitation"
                  : status === EmployeesStatusEnum.Inactive
                  ? "Activate Employee"
                  : "Deactivate Employee"}
              </button>
            </span>
          </div>
          <div>
            <div className={styles.formInputs}>
              <FormControl>
                <FormLabel>Phone Number</FormLabel>
                <Input
                  {...formik.getFieldProps("phoneNumber")}
                  type="text"
                  placeholder="Phone Number"
                />
              </FormControl>
              <FormControl>
                <FormLabel>Email</FormLabel>
                <Input
                  {...formik.getFieldProps("email")}
                  type="email"
                  placeholder="Email"
                />
              </FormControl>
              <FormControl>
                <FormLabel {...formik.getFieldProps("department")}>
                  Department
                </FormLabel>
                <FormSelect />
              </FormControl>
              <div>
                <FormControl>
                  <FormLabel {...formik.getFieldProps("permission")}>
                    Permission Role
                  </FormLabel>
                  <FormSelect />
                </FormControl>
                {/* <button className={styles.viewPermissionButton}>
                  View Permissions
                </button> */}
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "end" }}>
              <Button>Save</Button>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.card}>
        <span className={styles.activityLogName}>Activity log:</span>
        <div className={styles.activityLogContainer}>
          {activityLogsData?.length > 0 ? (
            activityLogsData?.map((item: any, i) => (
              <div className={styles.activity} key={i}>
                <div className={styles.dot} />
                <div className={styles.dateAndDesc}>
                  <p className={styles.dateLog}>{item?.createdAt}</p>
                  <div className={styles?.logContainer}>
                    <div
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
      </div>
    </Fragment>
  );
};

export default EmployeesDetails;
