import { FormHelperText } from "@mui/joy";
import Button from "@mui/joy/Button";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import Modal from "@mui/joy/Modal";
import ModalClose from "@mui/joy/ModalClose";
import Sheet from "@mui/joy/Sheet";
import Typography from "@mui/joy/Typography";
import { MenuItem, Select, SelectChangeEvent } from "@mui/material";
import { useFormik } from "formik";
import * as React from "react";
import * as Yup from "yup";
import {
  addNewEmployee,
  getAllDepartments,
  getPermissionsList,
} from "../../services/Employees/Employees";
import styles from "./Modals.module.scss";

type ModalProps = {
  open: boolean;
  setOpen: (value: boolean) => void;
  value: string;
  handleClick: () => void;
  handleList: () => void;
};

export const Modals: React.FunctionComponent<ModalProps> = ({
  open,
  setOpen,
  value,
  handleClick,
  handleList,
}) => {
  const [dept, setDept] = React.useState("");
  const [role, setRole] = React.useState("");
  const [departmentsList, setDepartmentsList] = React.useState([]);
  const [permissionsList, setPermissionsList] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleDeptChange = (event: SelectChangeEvent) => {
    setDept(event.target.value);
  };

  const handleRoleChange = (event: SelectChangeEvent) => {
    setRole(event.target.value);
  };

  const handleSubmit = (values: any) => {
    const payload = {
      department: dept,
      email: values.email,
      firstName: values.firstName,
      lastName: values.lastName,
      userRole: role,
      phoneNumberDto: {
        countryCode: "IN",
        phoneNumber: values.phoneNumber,
      },
    };
    setIsLoading(true);
    addNewEmployee(payload)
      .then(() => {
        setOpen(false);
        formik.resetForm();
        setRole("");
        setDept("");
        handleList();
        setIsLoading(false);
      })
      .catch(() => {
        setRole("");
        formik.resetForm();
        setOpen(false);
        setDept("");
        setIsLoading(false);
      });
  };

  const regex = /^[a-zA-Z\s]*$/g;
  const formik = useFormik({
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
      phoneNumber: Yup.string().required("Phone Number is required"),
    }),
    onSubmit: handleSubmit,
  });

  const getDepartments = () => {
    getAllDepartments()
      .then((res) => {
        const response = res?.data?.data;
        setDepartmentsList(response);
      })
      .catch(() => {});
  };

  const getPermissionRoles = () => {
    getPermissionsList({
      sortProperties: "id",
      sortDirection: "ASC",
    })
      .then((res: any) => {
        const response = res?.data?.data?.items;
        setPermissionsList(response);
      })
      .catch(() => {});
  };

  React.useEffect(() => {
    if (open) {
      getDepartments();
      getPermissionRoles();
    }
  }, [open]);

  return (
    <React.Fragment>
      <Button onClick={handleClick}>
        {value === "1" ? "Add Employee" : "Add Permission Role"}
      </Button>
      <Modal
        key={"addEmployeeModal"}
        aria-labelledby="modal-title"
        aria-describedby="modal-desc"
        open={open}
        onClose={() => {
          formik.resetForm();
          setRole("");
          setDept("");
          setOpen(false);
        }}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Sheet
          variant="outlined"
          sx={{
            minWidth: 600,
            minHeight: 600,
            borderRadius: "md",
            p: 3,
            boxShadow: "lg",
          }}
        >
          <ModalClose variant="plain" sx={{ m: 1 }} />
          <Typography
            component="h1"
            id="modal-title"
            level="h4"
            textColor="inherit"
            fontWeight="lg"
            mb={1}
          >
            Add Employee
          </Typography>
          <Typography component="h4" fontWeight="lg" mb={1}>
            Contact Information
          </Typography>
          <FormControl style={{ marginBottom: "10px" }}>
            <FormLabel>First Name</FormLabel>
            <Input
              placeholder="First Name"
              {...formik.getFieldProps("firstName")}
              error={formik.touched.firstName && formik.errors.firstName}
            />
            <FormHelperText sx={{ fontSize: "10px", color: "red" }}>
              {formik.touched.firstName && formik.errors.firstName}
            </FormHelperText>
          </FormControl>
          <FormControl style={{ marginBottom: "10px" }}>
            <FormLabel>Last Name</FormLabel>
            <Input
              placeholder="Last Name"
              {...formik.getFieldProps("lastName")}
              error={formik.touched.lastName && formik.errors.lastName}
            />
            <FormHelperText sx={{ fontSize: "10px", color: "red" }}>
              {formik.touched.lastName && formik.errors.lastName}
            </FormHelperText>
          </FormControl>
          <FormControl style={{ marginBottom: "10px" }}>
            <FormLabel>Email</FormLabel>
            <Input
              placeholder="Email"
              {...formik.getFieldProps("email")}
              error={formik.touched.email && formik.errors.email}
            />
            <FormHelperText sx={{ fontSize: "10px", color: "red" }}>
              {formik.touched.email && formik.errors.email}
            </FormHelperText>
          </FormControl>
          <FormControl style={{ marginBottom: "10px" }}>
            <FormLabel>Phone Number</FormLabel>
            <Input
              placeholder="Phone Number"
              {...formik.getFieldProps("phoneNumber")}
              error={formik.touched.phoneNumber && formik.errors.phoneNumber}
            />
            <FormHelperText sx={{ fontSize: "10px", color: "red" }}>
              {formik.touched.phoneNumber && formik.errors.phoneNumber}
            </FormHelperText>
          </FormControl>
          <Typography component="h4" fontWeight="lg" mb={1}>
            Department & Permission
          </Typography>
          <FormControl style={{ marginBottom: "10px" }}>
            <Select
              value={dept}
              displayEmpty={true}
              renderValue={(value) =>
                value?.length
                  ? Array.isArray(value)
                    ? value.join(", ")
                    : value
                  : "Select Department"
              }
              onChange={handleDeptChange}
            >
              {departmentsList?.map((item: any) => (
                <MenuItem value={item?.id}>{item?.departmentName}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl style={{ marginBottom: "10px" }}>
            <Select
              renderValue={(value) =>
                value?.length
                  ? Array.isArray(value)
                    ? value.join(", ")
                    : value
                  : "Select Permission Role"
              }
              value={role}
              displayEmpty={true}
              onChange={handleRoleChange}
            >
              {permissionsList?.map((item: any) => (
                <MenuItem value={item?.id}>{item?.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <div className={styles.addButton}>
            <Button
              disabled={
                !(formik.dirty && formik.isValid) ||
                role == "" ||
                dept === "" ||
                isLoading
              }
              onClick={formik.handleSubmit}
            >
              Send Invitation
            </Button>
          </div>
        </Sheet>
      </Modal>
    </React.Fragment>
  );
};
