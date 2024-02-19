import * as React from "react";
import { Fragment } from "react";
import { useLocation, useNavigate } from "react-router";
import backArrow from "../../assets/back-arrow.svg";
import { LocalStorageKeysEnum } from "../../Enums/LocalStorageKeysEnum";
import { PermissionTypeEnum } from "../../Enums/PermissionTypeEnum";
import VerificationInput from "../../components/VerificationInput/VerificationInput";
import { phoneOtpStepup, resendSmsOtp } from "../../services/Login/Login";
import { getStorage, setStorage } from "../../services/Storage";
import styles from "./PhoneVerification.module.scss";

type PhoneVerificationProps = {};

export const PhoneVerification: React.FunctionComponent<
  PhoneVerificationProps
> = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const blankCode = ["", "", "", "", "", ""];
  const [newOTP, setNewOTP] = React.useState(false);
  const [errorOTP, setErrorOTP] = React.useState(false);
  const [loader, setLoader] = React.useState(false);
  const [code, setCode] = React.useState(blankCode);
  const [codeError, setCodeError] = React.useState(false);
  const [codeSuccess, setCodeSuccess] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [userAuthorities, setUserAuthorities] = React.useState({});
  const authorities = getStorage(LocalStorageKeysEnum?.authorities);
  const [data, setData] = React.useState({
    phoneNumberDto: {
      countryCode: "",
      phoneNumber: "",
      countryCodeNumber: "",
    },
  });
  const [phoneNumber, setPhoneNumber] = React.useState("");

  const formatPhoneNumber = (phoneNumberString: string) => {
    var cleaned = ("" + phoneNumberString).replace(/\D/g, "");
    var match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return "(" + match[1] + ") " + match[2] + " - " + match[3];
    }
    return null;
  };

  const internationalPhoneFormat = (input: any) => {
    const cleanedNumber = input?.replace(/\D/g, "");
    if (cleanedNumber?.length < 2) {
      return cleanedNumber;
    }
    let formatted = cleanedNumber?.slice(0, 2) + " ";
    formatted += cleanedNumber?.slice(2, 6) + "-";
    formatted += cleanedNumber?.slice(6);
    if (formatted?.endsWith("-")) {
      return (formatted = formatted?.slice(0, -1));
    } else {
      return formatted;
    }
  };

  const reSendOTP = (otpAlreadySent = true) => {
    resendSmsOtp()
      .then(() => {
        if (otpAlreadySent) {
          setNewOTP(true);
          setLoader(true);
          setTimeout(() => {
            setLoader(false);
          }, 1000);
          setTimeout(() => {
            setNewOTP(false);
          }, 3000);
        }
      })
      .catch(() => {
        if (otpAlreadySent) {
          setErrorOTP(true);
        }
      });
  };

  React.useEffect(() => {
    resendSmsOtp()
      .then((res) => {
        setData(res?.data?.data);
        setPhoneNumber(res?.data?.data?.phoneNumberDto?.phoneNumber);
      })
      .catch((err) => {
        const errCode = err?.response?.data?.error?.errorCode;
        if (errCode === "G100068" || errCode === "G100008") {
          setErrorOTP(true);
        }
      });
  }, []);

  React.useEffect(() => {
    if (authorities) {
      setUserAuthorities(JSON.parse(authorities));
    }
  }, []);

  const wait = (time) =>
    new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, time);
    });

  const onComplete = async () => {
    setIsLoading(true);
    setCodeError(false);
    setCodeSuccess(false);
    setLoader(true);
    const payload = code.join("");

    try {
      const res = await phoneOtpStepup(payload);
      const { jwtToken } = res.data.data;
      // commented for reference
      // dispatch(fetchUserDetailsAction());
      setStorage(LocalStorageKeysEnum.jwtToken, jwtToken);
      // dispatch(
      //   storeUserDetails({
      //     ...res?.data?.data
      //   })
      // );
      setStorage(LocalStorageKeysEnum.stepupToken, jwtToken);
      setIsLoading(false);
      setCodeSuccess(true);
      await wait(1000);
      // dispatch(setAuth());
      // dispatch(storeAuthInfo({ stepupToken: jwtToken }));
      // Here we are finding the Business profiles permission from authorities
      const businessProfilesPermission = Object?.values(userAuthorities)?.find(
        (each) => each == PermissionTypeEnum?.BusinessProfiles
      );
      navigate("/dashboards/profiles");

      // if (isPwdExpired === true) {
      //   navigateTo('/login/update-password');
      // } else if (businessProfilesPermission) {
      //   navigateTo('/business-profiles');
      // } else {
      //   navigateTo('/admin-profile/user-details');
      // }
    } catch (error) {
      setIsLoading(false);
      setCodeError(true);
      setCode(blankCode);
      const errCode = error?.response?.data?.error?.errorCode;
      if (errCode === "G100068" || errCode === "G100008") {
        setErrorOTP(true);
      }
    }
  };

  const onPaste = (value) => {
    setCode(value);
  };

  const handleBack = () => {
    navigate("/login/verify-identity", {
      state: location?.state,
    });
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
            <span className={styles.twoStepText}>Phone Verification</span>
            <span className={styles.twoStepVerificationText}>
              A 6-digit verification code was sent to{" "}
              {phoneNumber && (
                <>
                  <span className={styles.phoneNumber}>
                    +{data?.phoneNumberDto?.countryCodeNumber}
                  </span>
                  &nbsp;
                  <span className={styles.phoneNumber}>
                    {data?.phoneNumberDto?.countryCode === "US"
                      ? formatPhoneNumber(phoneNumber)
                      : internationalPhoneFormat(phoneNumber)}
                    .
                  </span>
                </>
              )}
            </span>
            {errorOTP === false ? (
              <>
                <div className={styles.verification_input}>
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
                {newOTP === false ? (
                  <button
                    type="button"
                    className={styles.resend_sms}
                    onClick={reSendOTP}
                  >
                    Resend Code
                  </button>
                ) : (
                  <div>
                    {loader === true ? (
                      <div className={styles.sending_code}>
                        <p className={`icon-loading ${styles.loader_icon}`}></p>
                        <span>Sending Code... </span>
                      </div>
                    ) : (
                      <button
                        type="button"
                        className={styles.new_code}
                        onClick={reSendOTP}
                      >
                        New Verification Code Sent
                      </button>
                    )}
                  </div>
                )}
              </>
            ) : (
              <div className={styles.error_container}>
                <span className={styles.error_msg}>
                  Looks like something went wrong. Please try again later.
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Fragment>
  );
};
