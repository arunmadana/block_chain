import { Button, FormControl, FormLabel, Input } from "@mui/joy";
import { useFormik } from "formik";
import { Fragment, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { LocalStorageKeysEnum } from "../../Enums/LocalStorageKeysEnum";
import styles from "./Login.module.scss";
import { userLogin } from "../../services/Login/Login";
import { clearStorage, setStorage } from "../../services/Storage";
import { setActivateUser } from "../../Store/ducks/activateAccount";
import { login, storeAuthInfo } from "../../Store/ducks/auth";
import { storeLoginDetails } from "../../Store/ducks/loginDetails";

type LoginProps = {};

export const Login: React.FunctionComponent<LoginProps> = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const dataMail = location?.state?.email;
  const dataPass = location?.state?.password;

  const handleNext = (values: any) => {
    setIsLoading(true);
    userLogin({ email: values.email, password: values.password })
      .then((res) => {
        setIsLoading(false);
        const data = res?.data?.data;
        setStorage(
          LocalStorageKeysEnum?.authorities,
          JSON.stringify(data?.authorities)
        );
        clearStorage(LocalStorageKeysEnum.jwtToken);
        dispatch(storeLoginDetails(data));
        setStorage(LocalStorageKeysEnum.jwtToken, data?.jwtToken);
        const isAuthyRegistered = data?.isAuthyRegistered;
        setStorage("userIdLogin", data?.userId);
        dispatch(
          storeAuthInfo({
            ...data,
            token: data?.jwtToken,
          })
        );
        setStorage("isAuthorized", isAuthyRegistered);
        const phoneNumber = data?.phoneNumber;
        if (!isAuthyRegistered) {
          const userEmail = data?.email;
          dispatch(
            setActivateUser({
              email: userEmail,
              phoneNumber: phoneNumber,
            })
          );
          navigate("/login/sms-validation");
        } else {
          formik.setSubmitting(true);
          dispatch(login(data));
          navigate("/login/verify-identity", {
            state: { email: values.email, password: values.password },
          });
        }
      })
      .catch((err) => {
        setIsLoading(false);
        console.log(err);
      });
  };

  const initialValues = {
    email:
      dataMail === null || dataMail === undefined || dataMail === ""
        ? ""
        : dataMail,
    password:
      dataPass === null || dataPass === undefined || dataPass === ""
        ? ""
        : dataPass,
  };

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: Yup.object().shape({
      email: Yup.string()
        .required("Error: Email Address is required")
        .matches(
          /^([a-zA-Z0-9_.-])+@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,6}$)+$/,
          "Error: Invalid Email"
        ),
      password: Yup.string().required("Error: Password is required"),
    }),
    onSubmit: handleNext,
  });

  return (
    <Fragment>
      <div className={styles.loginContainer}>
        <div className={styles.loginBox}>
          <div
            style={{
              width: "100%",
              paddingTop: "50px",
              paddingBottom: "50px",
              paddingLeft: "40px",
              paddingRight: "40px",
            }}
          >
            <span className={styles.loginText}>Log in to continue</span>
            <FormControl style={{ marginBottom: "30px" }}>
              <FormLabel>Email</FormLabel>
              <Input
                {...formik.getFieldProps("email")}
                type="email"
                placeholder="Email"
                error={formik.touched.email && formik.errors.email}
              />
            </FormControl>
            <FormControl style={{ marginBottom: "30px" }}>
              <FormLabel>Password</FormLabel>
              <Input
                {...formik.getFieldProps("password")}
                type="password"
                placeholder="Password"
                error={formik.touched.password && formik.errors.password}
              />
            </FormControl>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Button
                disabled={
                  !formik.isValid ||
                  Object.keys(formik.touched).length === 0 ||
                  isLoading
                }
                style={{ width: "80px", height: "40px" }}
                onClick={formik.handleSubmit}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};
