import { Fragment, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { LocalStorageKeysEnum } from "../../Enums/LocalStorageKeysEnum";
import { PermissionTypeEnum } from "../../Enums/PermissionTypeEnum";
import backArrow from "../../assets/back-arrow.svg";
import VerificationInput from "../../components/VerificationInput/VerificationInput";
import codeToString from "../../helpers/codeToString";
import { validateAppOtp } from "../../services/Login/Login";
import { getStorage, setStorage } from "../../services/Storage";
import styles from "./VerifyIdentity.module.scss";

type VerifyIdentityProps = {};

export const VerifyIdentity: React.FunctionComponent<
  VerifyIdentityProps
> = () => {
  const blankCode = ["", "", "", "", "", ""];
  const navigate = useNavigate();
  const location = useLocation();
  const [code, setCode] = useState(blankCode);
  const [codeError, setCodeError] = useState(false);
  const [codeSuccess, setCodeSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userAuthorities, setUserAuthorities] = useState({});
  const authorities = getStorage(LocalStorageKeysEnum?.authorities);

  useEffect(() => {
    if (authorities) {
      setUserAuthorities(JSON.parse(authorities));
    }
  }, []);

  const onComplete = () => {
    setIsLoading(true);
    setCodeError(false);
    setIsLoading(true);
    const payload = {
      otp: codeToString(code),
    };
    validateAppOtp(payload)
      .then((res) => {
        const { jwtToken, userId } = res.data.data;
        // commented for reference
        // dispatch(fetchUserDetailsAction());
        // Here we are finding the Business profiles permission from authorities
        const businessProfilesPermission = Object?.values(
          userAuthorities
        )?.find((each) => each == PermissionTypeEnum?.BusinessProfiles);
        setStorage(LocalStorageKeysEnum.jwtToken, jwtToken);
        // dispatch(storeUserDetails({ id: userId, email: email }));
        setStorage(LocalStorageKeysEnum.stepupToken, jwtToken);
        setCodeSuccess(true);
        setIsLoading(false);
        // dispatch(setAuth());
        // dispatch(storeAuthInfo({ stepupToken: jwtToken }));
        navigate("/dashboards/profiles");
        // setTimeout(() => {
        //   if (isPwdExpired === true) {
        //     navigate('/login/update-password');
        //   } else if (businessProfilesPermission) {
        //   } else {
        //     navigate('/admin-profile/user-details');
        //   }
        // }, 1000);
      })
      .catch(() => {
        setCode(blankCode);
        setCodeError(true);
        setIsLoading(false);
      });
  };

  const onPaste = (value) => {
    setCode(value);
  };

  const handleBack = () => {
    navigate("/login", { state: location?.state });
  };

  return (
    <Fragment>
      <div className={styles.loginContainer}>
        <div className={styles.loginBox}>
          <button
            style={{
              display: "flex",
              justifyContent: "start",
              marginTop: "25px",
              marginLeft: "20px",
            }}
            onClick={handleBack}
          >
            <img src={backArrow} />
          </button>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginTop: "75px",
              justiftContent: "center",
            }}
          >
            <span className={styles.twoStepText}>Two-Step Authentication</span>
            <span className={styles.twoStepVerificationText}>
              Enter the 6-digit verification code shown in your authentication
              app.
            </span>
            {/* <OTPInput /> */}
            <div className={styles.verification_code_input}>
              <VerificationInput
                value={code}
                onChange={(value) => setCode(value)}
                onPaste={onPaste}
                onComplete={onComplete}
                error={codeError}
                success={codeSuccess}
                isLoading={isLoading}
              />
            </div>
            <span
              onClick={() => navigate("/login/sms-otp")}
              className={styles.issueText}
            >
              Having an issue with your authentication app?{" "}
              <strong className={styles.getSmsText}>Get an SMS code.</strong>
            </span>
          </div>
        </div>
      </div>
    </Fragment>
  );
};
