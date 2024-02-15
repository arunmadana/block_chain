import * as React from "react";
import { Fragment } from "react";
import { OTPInput } from "../../components/OTPInput/OTPInput";
import { resendSmsOtp } from "../../services/Login/Login";
import styles from "./PhoneVerification.module.scss";

type PhoneVerificationProps = {};

export const PhoneVerification: React.FunctionComponent<
  PhoneVerificationProps
> = () => {
  const [newOTP, setNewOTP] = React.useState(false);
  const [errorOTP, setErrorOTP] = React.useState(false);
  const [loader, setLoader] = React.useState(false);
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

  return (
    <Fragment>
      <div className={styles.loginContainer}>
        <div className={styles.loginBox}>
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
              <OTPInput />
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
    </Fragment>
  );
};
