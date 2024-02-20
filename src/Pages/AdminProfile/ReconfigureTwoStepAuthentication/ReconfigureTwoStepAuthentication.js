import handQr from '../../../assets/handScan.png';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import largeArrow from '../../../assets/Large-Arrow.svg';
import styles from './ReconfigureTwoStepAuthentication.module.scss';
import { validateAppOtp } from '../../../services/greenboxUsers/greenboxUsers';
import { getStorage, setStorage } from '../../../services/Storage';
import { getQRCode } from '../../../services/MyProfile/MyProfile';
import CopyButton from '../../../components/CopyButton/CopyButton';
import { H2 } from '../../../components/Heading/Heading';

export function ReconfigureTwoStepAuthentication({
  onVerifyCode = () => {},
  onSuccess = () => {},
  onClick = () => {}
}) {
  const blankCode = ['', '', '', '', '', ''];
  const [qrCodeImg, setQrCodeImg] = useState(false);
  const [qrCodeDecoded, setQrCodeDecoded] = useState(false);
  const [code, setCode] = useState(blankCode);
  const [codeError, setCodeError] = useState(false);
  const [codeSuccess, setCodeSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showQR, setShowQR] = useState(true);
  const authed = getStorage('isAuthorized');

  const { email } = useSelector((store) => store?.adminUserDetails?.data);

  const handleShowQR = () => {
    setShowQR(!showQR);
  };

  const onPaste = (value) => {
    setCode(value);
  };

  const onComplete = async () => {
    setIsLoading(true);
    setCodeError(false);
    setCodeSuccess(false);

    const payload = {
      actionType: 'AUTHY_CONFIG',
      otp: codeToString(code)
    };

    //otp api
    validateAppOtp(payload)
      .then((res) => {
        setIsLoading(false);
        setCodeSuccess(true);
        setTimeout(() => {
          onVerifyCode(res.data.data.requestToken);
          setStorage('isAuthorized', 'true');
          onSuccess();
        }, 1000);
      })
      .catch(() => {
        setCodeError(true);
        setCode(blankCode);
        setIsLoading(false);
      });
  };

  const codeToString = (code) => {
    const codeStr = code?.toString();
    const finalCode = codeStr?.replace(/,/g, '');
    return finalCode;
  };

  useEffect(() => {
    getQRCode(encodeURIComponent(email))
      .then((res) => {
        const data = res?.data?.data;
        setQrCodeImg(data?.qrCode);
        setQrCodeDecoded(data.qrDecodedValue);
      })
      .catch((err) => {
        const message =
          err?.response?.data?.error?.errorDescription ??
          'Error getting the QR Code';
        // toast.error(message);
      });
  }, [email]);

  return (
    <div className={styles.configContainer}>
      <h1 className={styles.titleClass}>
        {authed === 'true'
          ? 'Reconfigure Two-Step Authentication'
          : 'Configure Two-Step Authentication'}
      </h1>
      <div className={styles.pointsContainer}>
        <div>
          <h1>1.Open a compatible 2-Step Authentication mobile app.</h1>
          <p className={styles.recomendedClass}>
            Don’t have one? &nbsp;
            <button
              type="button"
              className={styles.clickHereClass}
              onClick={onClick}
            >
              Click Here
            </button>
          </p>
        </div>
        <div>
          <h1>2. Add a new account in your app.</h1>
          <p className={styles.recomendedClass}>
            Try tapping the ‘+’ or ‘Add’ button.
          </p>
        </div>

        <h1>3. Scan the QR Code below to link your new account.</h1>

        <h1>4. Enter your 6-digit verification code in the field below.</h1>
      </div>
      {showQR ? (
        <div>
          <div className={styles.scannerContainer}>
            <div className={styles.scannerText}>
              <img src={handQr} className={styles.deviceClass} />
              <p>Scan the QR code to link your authentication mobile app.</p>
            </div>

            <img src={largeArrow} className={styles.largeArrowClass} />

            <div>
              <div className={styles.corners}>
                <div className={`${styles.top} ${styles.left}`}></div>
                <div className={`${styles.top} ${styles.right}`}></div>
                <div className={`${styles.bottom} ${styles.right1}`}></div>
                <div className={`${styles.bottom} ${styles.left}`}></div>
                <div className={styles.imgQR}>
                  <img src={qrCodeImg} />
                </div>
              </div>
            </div>
          </div>
          <div className={styles.manualLabelClass}>
            <button
              className={styles.manualLabelButtonClass}
              onClick={handleShowQR}
              type="button"
            >
              Use Manual Entry instead
            </button>
          </div>
        </div>
      ) : (
        <div>
          <div className={styles.manualContainer}>
            <span className={styles.accountNameLabel}>Account Name</span>
            <span className={styles.accountNameValue}>
              {qrCodeDecoded[1] ? qrCodeDecoded[1] : '---'}
            </span>
          </div>
          <div className={styles.manualCodeClass}>
            <span className={styles.accountNameLabel}>Manual Entry Code</span>
            <div className={styles.copyButtonClass}>
              <p className={styles.accountNameValue}>
                {qrCodeDecoded[0] ? qrCodeDecoded[0] : '---'}
              </p>

              <CopyButton message={qrCodeDecoded[0]} />
            </div>
          </div>
          <div className={styles.manualLabelClass}>
            <button
              className={styles.manualLabelButtonClass}
              onClick={handleShowQR}
              type="button"
            >
              Scan QR Code instead
            </button>
          </div>
        </div>
      )}
      <H2
        title=" Verification Code:"
        className={styles.verificationCodeTitle}
      />
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
  );
}
