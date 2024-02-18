import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { internationalPhoneFormat } from "../../helpers/internationalPhoneFormat";
import phoneMask from "../../helpers/phoneMask";
import { resendSmsOtp } from "../../services/Login/Login";
import { phoneOtpValid } from "../../services/profiles/poc";
import Spinner from "../Spinner/Spinner";
import VerificationInput from "../VerificationInput/VerificationInput";
import styles from "./PhoneOtpVerification.module.scss";

export function PhoneOtpVerification({
  email,
  actionType,
  onVerifySmsCode = () => {},
  afterVerification = () => {},
}) {
  const blankCode = ["", "", "", "", "", ""];
  const [code, setCode] = useState(blankCode);
  const [codeError, setCodeError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [codeSuccess, setCodeSuccess] = useState(false);
  const [isOtpsent, setIsOtpSent] = useState(false);
  const [isError, setIsError] = useState(false);
  const [loader, setLoader] = useState(false);
  const phoneNumberDto = useSelector(
    (state) => state.adminUserDetails?.data?.phoneNumberDto
  );

  const onComplete = () => {
    setIsLoading(true);
    setCodeError(false);
    setCodeSuccess(false);
    if (actionType) {
      phoneOtpValid({ otp: code.join(""), actionType: actionType })
        .then((res) => {
          setIsLoading(false);
          setCodeSuccess(true);

          setTimeout(() => {
            afterVerification(res?.data?.data?.requestToken);
          }, 1500);
        })
        .catch((error) => {
          setIsLoading(false);
          setCodeError(true);
          setCode(blankCode);
          const errCode = error?.response?.data?.error?.errorCode;
          if (errCode === "G100068" || errCode === "G100008") {
            setIsError(true);
          }
        });
    } else {
      phoneOtpValid({ otp: code.join("") })
        .then(() => {
          setIsLoading(false);
          setCodeSuccess(true);

          setTimeout(() => {
            afterVerification();
          }, 1500);
        })
        .catch((error) => {
          setIsLoading(false);
          setCodeError(true);
          setCode(blankCode);
          const errCode = error?.response?.data?.error?.errorCode;
          if (errCode === "G100068" || errCode === "G100008") {
            setIsError(true);
          }
        });
    }
  };
  useEffect(() => {
    resendSmsOtp()
      .then(() => {})
      .catch((err) => {
        const errCode = err?.response?.data?.error?.errorCode;
        if (errCode === "G100068" || errCode === "G100008") {
          setIsError(true);
        }
      });
  }, []);

  const resendCode = () => {
    setLoader(true);
    resendSmsOtp()
      .then(() => {
        // Loading scenario for resend code statement
        setLoader(false);
        //Resend code success
        setIsOtpSent(true);

        setTimeout(() => {
          setIsOtpSent(false);
        }, 2000);
      })
      .catch(() => {
        setLoader(false);
        setIsError(true);
      });
  };

  return (
    <motion.div
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="grow"
    >
      <div className={styles.phoneVerificationContainer}>
        <h1 className={styles.titleClass}>Phone Verification</h1>
        <p className={styles.phoneNumberContainer}>
          Enter the 6-digit code sent to &nbsp;
          <span className={styles.phoneNumberClass}>
            +{phoneNumberDto?.countryCodeNumber} &nbsp;
            {phoneNumberDto?.countryCode === "US"
              ? phoneMask(phoneNumberDto?.phoneNumber)
              : internationalPhoneFormat(phoneNumberDto?.phoneNumber)}
            .
          </span>
        </p>
        {loader ? (
          <div className={styles.sendingClass}>
            <Spinner />
            <span>Sending Code…</span>
          </div>
        ) : isOtpsent ? (
          <div className={styles.newCodeSentClass}>
            New Verification Code Sent
          </div>
        ) : isError ? (
          <div className={styles.errorClass}>
            Looks like something went wrong. Please try again.
          </div>
        ) : (
          <button
            type="button"
            className={styles.resendClass}
            onClick={resendCode}
          >
            Resend Code
          </button>
        )}
        <span className={styles.verificationCodeTitle}>Verification Code:</span>
        <VerificationInput
          value={code}
          onChange={(value) => setCode(value)}
          onPaste={(value) => setCode(value)}
          onComplete={onComplete}
          error={codeError}
          success={codeSuccess}
          isLoading={isLoading}
        />
      </div>
    </motion.div>
  );
}

const variants = {
  initial: { x: 20, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: -20, opacity: 0 },
};
