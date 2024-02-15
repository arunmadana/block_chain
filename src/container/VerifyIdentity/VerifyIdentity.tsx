import * as React from "react";
import { Fragment } from "react";
import { OTPInput } from "../../components/OTPInput/OTPInput";
import styles from "./VerifyIdentity.module.scss";
import { useNavigate } from "react-router-dom";

type VerifyIdentityProps = {};

export const VerifyIdentity: React.FunctionComponent<
  VerifyIdentityProps
> = () => {
  const navigate = useNavigate();
  return (
    <Fragment>
      <div className={styles.loginContainer}>
        <div className={styles.loginBox}>
          <span className={styles.twoStepText}>Two-Step Authentication</span>
          <span className={styles.twoStepVerificationText}>
            Enter the 6-digit verification code shown in your authentication
            app.
          </span>
          <OTPInput />
          <span
            onClick={() => navigate("/login/sms-otp")}
            className={styles.issueText}
          >
            Having an issue with your authentication app?{" "}
            <strong className={styles.getSmsText}>Get an SMS code.</strong>
          </span>
        </div>
      </div>
    </Fragment>
  );
};
