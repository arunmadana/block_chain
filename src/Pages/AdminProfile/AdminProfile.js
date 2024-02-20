import { Button } from "@mui/joy";
import axios from "axios";
import { useFormik } from "formik";
import PropTypes from "prop-types";
import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import Cropper from "react-easy-crop";
import "react-image-crop/dist/ReactCrop.css";
import { useDispatch, useSelector } from "react-redux";
import uuid from "react-uuid";
import * as Yup from "yup";
import { ActionTypeEnums } from "../../Enums/ActionTypeEnums";
import { LocalStorageKeysEnum } from "../../Enums/LocalStorageKeysEnum";
import ENV from "../../EnvironmentVariables.json";
import { fetchUserDetailsAction } from "../../Store/ducks/adminUserDetails";
import { logout } from "../../Store/ducks/auth";
import handheldDevice from "../../assets/HandheldDevice.png";
import successIcon from "../../assets/successIcon.svg";
import { HBar } from "../../components/Bars/Bars";
import Card from "../../components/Card/Card";
import { ChipTitle } from "../../components/ChipTitle/ChipTitle";
import { H1, H2 } from "../../components/Heading/Heading";
import Modal from "../../components/Modal/Modal";
import PasswordInput from "../../components/PasswordInput/PasswordInput";
import PasswordStrength from "../../components/PasswordStrength/PasswordStrength";
import { PhoneOtpVerification } from "../../components/PhoneOtpVerification/PhoneOtpVerification";
import Spinner from "../../components/Spinner/Spinner";
import VerificationInput from "../../components/VerificationInput/VerificationInput";
import codeToString from "../../helpers/codeToString";
import nameToInitials from "../../helpers/initials";
import { internationalPhoneFormat } from "../../helpers/internationalPhoneFormat";
import { textEllipsis } from "../../helpers/textEllipsis";
import userDateTime from "../../helpers/userDateTime";
import { getStorage } from "../../services/Storage";
import {
  RemoveImageAPI,
  changeAdminPassword,
} from "../../services/greenboxUsers/greenboxUsers";
import { otpValidade } from "../../services/transactions/transactions";
import styles from "./AdminProfile.module.scss";
import { base64StringtoFile } from "./ImageCrop";
import { ReconfigureTwoStepAuthentication } from "./ReconfigureTwoStepAuthentication/ReconfigureTwoStepAuthentication";
import getCroppedImg from "./cropImage";

export default function AdminProfile() {
  const dispatch = useDispatch();
  const userDetailsData = useSelector((store) => store.adminUserDetails?.data);

  const [profileEdit, setProfileEdit] = useState(false);
  const [profileStep, setProfileStep] = useState(0);
  const [showValidate, setShowValidate] = useState(false);
  const [showPassCode, setShowPassCode] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [reqToken, setReqToken] = useState(null);
  const [step, setStep] = useState(0);
  const [showConfigureModal, setShowConfigureModal] = useState(false);
  const [imageError, setImageError] = useState(false);
  const isLoading = useSelector((state) => state.adminUserDetails.isLoading);
  const imageBaseUrl = `${userDetailsData?.imageUrl}${
    userDetailsData?.id
  }_profileimage.png?${new Date()}`;
  const [isOldPasswordError, setIsOldPasswordError] = useState(false);

  useEffect(() => {
    if (step === 1) {
      setTimeout(() => {
        dispatch(logout());
      }, 1000);
    }
  }, [step]);

  const handleEditProfile = () => {
    setProfileEdit(true);
  };

  const handleChangePassword = () => {
    if (!showPassCode) {
      setShowValidate(true);
    }
  };

  const handleOldPasswordChange = (e) => {
    if (e.target.value) {
      setIsOldPasswordError(false);
    }

    formik.handleChange(e);
  };

  const onSubmit = (values) => {
    // api to change password here
    const payload = {
      newPassword: values.newPassword,
      oldPassword: values.oldPassword,
    };
    setIsProcessing(true);
    changeAdminPassword(reqToken, payload)
      .then(() => {
        setIsProcessing(false);
        setStep(1);
      })
      .catch((err) => {
        setIsProcessing(false);

        const code = err?.response?.data?.error?.errorCode;
        if (code === "G100029" || code === "V000001") {
          formik.setFieldValue("oldPassword", "");
          setIsOldPasswordError(true);
        }
        // const message = err?.response?.data?.error;
        // toast.error(message?.errorDescription);
      });
  };

  const handleShowConfigureModal = () => {
    setShowConfigureModal(true);
  };

  const formik = useFormik({
    initialValues: initialvalues,
    validationSchema: validationSchema,
    onSubmit: onSubmit,
    //commented for further refernce
    // validateOnBlur: false
  });

  const handleImageError = () => {
    if (userDetailsData?.id && userDetailsData?.imageUrl) {
      setImageError(true);
    }
  };

  const cancelHandler = () => {
    setShowPassCode(false);

    setIsOldPasswordError(false);
    formik.resetForm();
  };

  const EmailCell = (email) => (
    <>
      {email &&
        (email?.length > 25 ? (
          `${textEllipsis(email.split("@")[0], 20)}@${email.split("@")[1]}`
        ) : (
          <span>{email}</span>
        ))}
    </>
  );

  EmailCell.propTypes = {
    email: PropTypes.string,
  };

  return (
    <>
      <h1 className={styles.userDetailsTitle}>User Details</h1>
      <Card isHeader={false} isLoading={isLoading} className={styles.cardClass}>
        <div className={styles.detailsPasswordContainer}>
          <div className={styles.userDetailsContainer}>
            {/* div for profile image */}
            <div className={styles.profileInfo}>
              {imageError ? (
                <div className={styles.profileContainer}>
                  <span className={styles.profileName}>
                    {nameToInitials(
                      userDetailsData?.firstName,
                      userDetailsData?.lastName
                    )}
                  </span>
                </div>
              ) : (
                <div className={styles.imgContainer}>
                  <img
                    src={imageBaseUrl}
                    className={styles.profileImage}
                    onError={handleImageError}
                  />
                </div>
              )}
              <button
                data-tooltip-id={`tooltip`}
                className={`icon-edit ${styles.editIconClass}`}
                data-tooltip-content={"Edit Image"}
                type="button"
                onClick={handleEditProfile}
              />
            </div>
            {/* div for name and 2step config text */}
            <div>
              <p className={styles.userName}>{userDetailsData?.displayName}</p>
              <p
                className={styles.userIdDiv}
              >{`Account ID: EMP-${userDetailsData?.id}`}</p>
              {userDetailsData?.authyLastConfiguredAt ? (
                <p className={styles.configurationClass}>
                  Two-Step Authentication was configured on&nbsp;
                  <span className={styles.dateClass}>
                    {userDateTime(
                      userDetailsData?.authyLastConfiguredAt,
                      false
                    )}
                    .&nbsp;
                  </span>
                  <span
                    className={styles.reconfigureClass}
                    onClick={handleShowConfigureModal}
                  >
                    Reconfigure
                  </span>
                </p>
              ) : (
                <div className={styles.configurationClass}>
                  <p>
                    Two-Step Authentication is required to take actions <br />{" "}
                    in RYVYL Block admin.
                  </p>
                  <span
                    className={styles.reconfigureClass}
                    onClick={handleShowConfigureModal}
                  >
                    Configure Two-Step Authentication
                  </span>
                </div>
              )}
              {!showPassCode && (
                <Button
                  onClick={handleChangePassword}
                  className={styles.buttonClass}
                >
                  Change Password
                </Button>
              )}
            </div>
          </div>

          {/* permissions and other roles container */}
          <div className={styles.permissionContaine}>
            <div>
              <p className={styles.roleClass}>Phone Number</p>
              <p className={styles.infoClass}>
                <span
                  className={`icon-phone ${styles.logo} ${styles.phoneLogo}`}
                />
                <span>
                  {userDetailsData?.phoneNumberDto?.phoneNumber !== "" && (
                    <>
                      +{userDetailsData?.phoneNumberDto?.countryCodeNumber}
                      &nbsp;
                      {userDetailsData?.phoneNumberDto?.countryCode === "US"
                        ? phoneMask(
                            userDetailsData?.phoneNumberDto?.phoneNumber
                          )
                        : internationalPhoneFormat(
                            userDetailsData?.phoneNumberDto?.phoneNumber
                          )}
                    </>
                  )}
                </span>
                <span
                  className={`icon-lock ${styles.lockClass}`}
                  data-tooltip-id={"tooltip"}
                  data-tooltip-content={"Can’t edit"}
                />
              </p>
            </div>
            <div>
              <p className={styles.roleClass}>Employee Department</p>
              <p className={styles.infoClass}>
                <span
                  className={`icon-department ${styles.logo} ${styles.departmentLogo}`}
                />
                <span>{userDetailsData?.departmentName}</span>
                <span
                  className={`icon-lock ${styles.lockClass}`}
                  data-tooltip-id={"tooltip"}
                  data-tooltip-content={"Can’t edit"}
                />
              </p>
            </div>
            <div>
              <p className={styles.roleClass}>Email Address</p>
              <p className={styles.infoClass}>
                <span
                  className={`icon-email-envelope ${styles.logo} ${styles.emailLogo}`}
                />
                <span
                  data-tooltip-id="tooltip"
                  className="max-w-[330px] truncate"
                  data-tooltip-content={
                    userDetailsData?.email?.length > 25
                      ? userDetailsData?.email
                      : ""
                  }
                >
                  {EmailCell(userDetailsData?.email)}
                </span>
                <span
                  className={`icon-lock ${styles.lockClass}`}
                  data-tooltip-content={"Can’t edit"}
                  data-tooltip-id={"tooltip"}
                />
              </p>
            </div>
            <div>
              <p className={styles.roleClass}>Permission Role</p>
              <p className={styles.infoClass}>
                <span
                  className={`icon-person ${styles.logo} ${styles.permissionLogo}`}
                />
                <span>{userDetailsData?.userRoleName}</span>
                <span
                  className={`icon-lock ${styles.lockClass}`}
                  data-tooltip-content={"Can’t edit"}
                  data-tooltip-id={"tooltip"}
                />
              </p>
            </div>
          </div>
        </div>
        {showPassCode && (
          <div
            className={` ${styles.animatePassword} 
            
            `}
          >
            <ChipTitle>Change Password</ChipTitle>
            {step === 0 ? (
              <>
                <span className={styles.securityInfoClass}>
                  As a security measure, you will be logged out of
                  <br />
                  your account after changing your password.
                </span>
                <div className={styles.fieldsContainer}>
                  <PasswordInput
                    label="Current Password"
                    {...formik.getFieldProps("oldPassword")}
                    type="password"
                    placeholder={"Current Password"}
                    inputStyles={styles.inputStyles}
                    error={
                      (isOldPasswordError && "Incorrect password.") ||
                      (formik.touched.oldPassword && formik.errors.oldPassword)
                    }
                    autoComplete="off"
                    maxLength={32}
                    autoFocus={true}
                    disableSpace={true}
                    disablePasswordSymbols={true}
                    id={"oldPassword"}
                    name={"oldPassword"}
                    onChange={handleOldPasswordChange}
                  />

                  <HBar className={styles.hBarClass} />

                  <PasswordStrength password={formik.values.newPassword}>
                    <PasswordInput
                      label="New Password"
                      error={
                        formik.touched.newPassword && formik.errors.newPassword
                      }
                      inputStyles={styles.inputStyles}
                      autoComplete="off"
                      maxLength={32}
                      type="password"
                      disableSpace={true}
                      disablePasswordSymbols={true}
                      {...formik.getFieldProps("newPassword")}
                      placeholder={"New Password"}
                      id={"newPassword"}
                      name={"newPassword"}
                    />
                  </PasswordStrength>

                  <PasswordInput
                    label="Confirm Password"
                    inputClassname={styles.newPasswordClass}
                    error={
                      formik.touched.confirmNewPassword &&
                      formik.errors.confirmNewPassword
                    }
                    type="password"
                    autoComplete="off"
                    maxLength={32}
                    disableSpace={true}
                    disablePasswordSymbols={true}
                    {...formik.getFieldProps("confirmNewPassword")}
                    id={"confirmNewPassword"}
                    name={"confirmNewPassword"}
                    inputStyles={styles.inputStyles}
                    placeholder={"Confirm Password"}
                    isSuccess={
                      formik.values.confirmNewPassword &&
                      !formik.errors.confirmNewPassword
                    }
                    success={"Passwords match."}
                  />

                  <div className={styles.cancelButtonContainer}>
                    <button
                      className={styles.cancelButtonClass}
                      onClick={cancelHandler}
                      type="button"
                    >
                      Cancel
                    </button>
                    <Button
                      onClick={formik.handleSubmit}
                      type="submit"
                      disabled={
                        !(formik.dirty && formik.isValid) || isProcessing
                      }
                    >
                      Save
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <span className={styles.passwordUpdateText}>
                  Your password has been changed.
                </span>
                <div className={styles.redirectClass}>
                  <Spinner size={19} className={styles.spinnerClass} />
                  <span>Redirecting to login…</span>
                </div>
              </>
            )}
          </div>
        )}
      </Card>
      <ProfilePopUp
        show={profileEdit}
        setProfileEdit={setProfileEdit}
        setProfileStep={setProfileStep}
        profileStep={profileStep}
        initials={nameToInitials(
          userDetailsData?.firstName,
          userDetailsData?.lastName
        )}
        userInfos={imageBaseUrl}
        imageError={imageError}
        setImageError={() => setImageError(false)}
      />
      <PasswordCheck
        show={showValidate}
        setShowValidate={setShowValidate}
        setShowPassCode={setShowPassCode}
        setReqToken={setReqToken}
      />

      <PhoneVerification
        show={showConfigureModal}
        setShowConfigureModal={setShowConfigureModal}
        onClose={!showConfigureModal}
      />
    </>
  );
}

const blankCode = ["", "", "", "", "", ""];
const PasswordCheck = ({
  show,
  setShowValidate,
  setShowPassCode,
  setReqToken,
}) => {
  const [code, setCode] = useState(blankCode);
  const [codeError, setCodeError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [codeSuccess, setCodeSuccess] = useState(false);
  const [step, setStep] = useState(null);
  const authed = getStorage("isAuthorized");

  useEffect(() => {
    if (authed === "true") {
      setStep(0);
    } else {
      setStep(1);
    }
  }, [show]);

  const onPaste = (value) => {
    setCode(value);
  };

  const onPhoneVerification = (requestToken) => {
    setReqToken(requestToken);
    setShowPassCode(true);
    setShowValidate(false);
  };

  const onCompleteAuthy = () => {
    setIsLoading(true);
    setCodeError(false);

    otpValidade(codeToString(code), ActionTypeEnums?.ChangePassword)
      .then((res) => {
        setReqToken(res.data.data.requestToken);
        setCodeSuccess(true);
        setIsLoading(false);
        setTimeout(() => {
          setShowValidate(false);
          setCodeSuccess(false);
          setShowPassCode(true);
          setCode(blankCode);
        }, 400);
      })
      .catch(() => {
        setCode(blankCode);
        setIsLoading(false);
        setCodeError(true);
      });
  };

  const handleClose = () => {
    setShowValidate(false);
    setCode(blankCode);
    setCodeSuccess(false);
    setIsLoading(false);
    setStep(0);
    setCodeError(false);
  };

  const handleBackButton = () => {
    setStep(0);
    setCode(blankCode);
    setCodeError(false);
  };

  return (
    <Modal
      show={show}
      showCloseButton={true}
      onClose={handleClose}
      className={styles.verification_Modal}
      showBackButton={step == 1 && authed === "true"}
      onBack={handleBackButton}
    >
      {step === 0 && (
        <div className={styles.verificationModalContainer}>
          <h1 className={styles.titleClass}>Two-Step Authentication</h1>
          <span className={styles.titleSubLabelClass}>
            Enter the 6-digit code shown in your authentication app.
          </span>
          <H2
            title=" Verification Code:"
            className={styles.verificationCodeTitle}
          />
          <div>
            <VerificationInput
              value={code}
              onChange={(value) => setCode(value)}
              onPaste={onPaste}
              onComplete={onCompleteAuthy}
              error={codeError}
              success={codeSuccess}
              isLoading={isLoading}
            />
          </div>
          <div className={styles.issueLabelClass}>
            Having an issue with your authentication app?
            <span className={styles.getSmsClass} onClick={() => setStep(1)}>
              Get an SMS code.
            </span>
          </div>
        </div>
      )}
      {step === 1 && (
        <PhoneOtpVerification
          actionType={ActionTypeEnums?.ChangePassword}
          afterVerification={onPhoneVerification}
        />
      )}
    </Modal>
  );
};

PasswordCheck.propTypes = {
  show: PropTypes.bool,
  setShowValidate: PropTypes.bool,
  setShowPassCode: PropTypes.bool,
  setReqToken: PropTypes.string,
};

const ProfilePopUp = ({
  show,
  setProfileEdit,
  profileStep,
  setProfileStep,
  initials,
  userInfos,
  imageError,
  setImageError,
  onRemove,
}) => {
  const dispatch = useDispatch();
  const [step, setStep] = useState(0);
  const [imgSrc, setImgSrc] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const imageMaxSize = 5000000; // Bytes
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [newImage, setNewImage] = useState("");
  const [btnLoading, setBtnLoading] = useState(false);
  const [isBtnDisable, setIsBtnDisable] = useState(false);

  const verifyFile = (files) => {
    if (files && files.length > 0) {
      const currentFile = files[0];
      const currentFileSize = currentFile.size;
      if (currentFileSize >= imageMaxSize) {
        alert("Image size should not be greater that 5 mb.");
        return false;
      }
      return true;
    }
  };

  const onDrop = useCallback((files, rejectedFiles) => {
    if (rejectedFiles && rejectedFiles.length > 0) {
      const currentFile = rejectedFiles[0];
      const currentFileSize = currentFile.file.size;
      if (currentFileSize >= imageMaxSize) {
        // toast.error("Image size should not be greater than 5 mb.");
        return false;
      }
    }

    // jpg, jpeg and png formats should be allowed rest of the formats no need to upload
    const fileExtension = files[0].path.split(".").pop().toLowerCase();
    const allowedExtensions = ["jpg", "jpeg", "png"];
    const notAllowedExtensions = [
      "pdf",
      "csv",
      "doc",
      "docx",
      "txt",
      "rtf",
      "zip",
      "json",
      "xlsx",
    ];
    if (
      allowedExtensions.includes(fileExtension) ||
      !notAllowedExtensions.includes(fileExtension)
    ) {
      if (files && files.length > 0) {
        const isVerified = verifyFile(files);
        if (isVerified) {
          const currentFile = files[0];
          setNewImage(currentFile);
          const myFileItemReader = new FileReader();

          myFileItemReader.onload = () => {
            setImgSrc(myFileItemReader.result);
            setStep(1);
          };
          myFileItemReader.readAsDataURL(currentFile);
        }
      }
    }
  });

  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/jpeg, image/png",
    multiple: false,
    maxSize: imageMaxSize,
    onDrop,
  });

  const handleRemove = () => {
    RemoveImageAPI("")
      .then(() => {
        setImgSrc(null);
        setProfileStep(0);
        onRemove();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleNextStep = () => {
    setProfileStep(2);
  };

  const handleStepClick = () => {
    profileStep === 1 ? handleRemove() : handleNextStep();
  };

  const handleOnCropChange = useCallback((croppedArea, croppedAreaPixels) => {
    //croppedArea is not used but we need to pass the parameter. -- Arun B
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleSave = useCallback(async () => {
    setBtnLoading(true);
    try {
      const croppedImage = await getCroppedImg(imgSrc, croppedAreaPixels, 0);
      const newCropped = await base64StringtoFile(croppedImage, newImage?.name);
      setTimeout(() => {
        handleAPI(newCropped);
      }, 1000);
    } catch (e) {
      console.error(e);
    }
  }, [croppedAreaPixels]);

  const handleAPI = (newCropped) => {
    //API
    const token = getStorage(LocalStorageKeysEnum.stepupToken);
    const baseURL =
      process.env.NODE_ENV === "development"
        ? `${ENV.serverURL}${ENV.apiURL}`
        : `${ENV.apiURL}`;
    const sendURL = `${baseURL}/document/profileImage`;
    const formData = new FormData();
    formData.append("image", newCropped);

    return axios
      .post(sendURL, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Accept-Language": "en-US",
          "X-REQUESTID": uuid(),
          accept: "*/*",
          "Content-Type": "multipart/form-data",
        },
      })
      .then(() => {
        // const data = res.data.data;
        // toast.success(data?.message);
        setBtnLoading(false);
        setIsBtnDisable(true);
        dispatch(fetchUserDetailsAction());
        setTimeout(() => {
          setProfileEdit(false);
          setImageError();
          setImgSrc(null);
          setProfileStep(0);
          setStep(0);
          setIsBtnDisable(false);
        }, 1000);
      })
      .catch(() => {
        // const message = err?.response?.data?.error;
        setBtnLoading(false);
        // toast.error(message?.errorDescription || "Image upload failed!");
      });
  };

  return (
    <Modal
      show={show}
      showCloseButton={true}
      onClose={() => (
        setProfileEdit(false),
        setProfileStep(0),
        setImgSrc(null),
        setStep(0),
        setIsBtnDisable(false)
      )}
      showBackButton={profileStep === 1 || (profileStep === 2 && true)}
      onBack={() => (setProfileStep(0), setImgSrc(null), setStep(0))}
    >
      <div className={styles.imageContainer}>
        <H1
          className={styles.modalTitle}
          title={
            profileStep === 1
              ? "Remove Image"
              : profileStep === 2
              ? "Crop Your Image"
              : "Edit Image"
          }
        ></H1>
        {profileStep === 0 ? (
          <div className={styles.imagePosition}>
            <div>
              {imageError ? (
                <div
                  className={`${styles.imageSize} ${styles.initialPosition}`}
                >
                  <span
                    className={`${
                      initials == "WW" || initials == "MM"
                        ? `${styles.initialsSizeSmall}`
                        : `${styles.initialsSize}`
                    } `}
                  >
                    {initials}
                  </span>
                </div>
              ) : (
                <>
                  <img src={userInfos} className={styles.imageSize} />
                  <div className={styles.imgPlacement}>
                    <div
                      className={styles.removeImgTitle}
                      onClick={() => setProfileStep(1)}
                    >
                      Remove Image
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        ) : profileStep === 1 ? (
          <>
            <div className={styles.removeImage}>
              <span className={styles.removeImgDesc}>
                Are you sure you want to remove your profile image? <br /> We
                will replace it with your initials as a default.
              </span>
              <div>
                <img src={userInfos} className={styles.imageSize} />
              </div>
            </div>
          </>
        ) : (
          profileStep === 2 &&
          (step === 0 ? (
            <form
              {...getRootProps()}
              className={`${styles.imageSize} ${styles.uploadImg}`}
            >
              <input {...getInputProps()} />
              <p className={styles.selectImage}>Click to select Image</p>
            </form>
          ) : step === 1 ? (
            <div className={`${styles.profileCropImage}`}>
              <Cropper
                image={imgSrc}
                crop={crop}
                aspect={1}
                onCropChange={setCrop}
                zoom={zoom}
                onZoomChange={setZoom}
                onCropComplete={handleOnCropChange}
                cropShape={"round"}
                className={styles.uploadSize}
              />
            </div>
          ) : (
            step === 2 && (
              <div className="crop-image">
                <img src={imgSrc} className="rounded-full w-52 h-52" />
              </div>
            )
          ))
        )}
        {btnLoading ? (
          <div className={styles.spinnerStyle}>
            <Spinner size={36} />
          </div>
        ) : (
          <Button
            className={styles.submitButton}
            disabled={(profileStep === 2 && imgSrc === null) || isBtnDisable}
            onClick={profileStep === 2 ? handleSave : handleStepClick}
          >
            {profileStep === 1
              ? "Remove"
              : profileStep === 2
              ? "Save"
              : "Upload New Image"}
          </Button>
        )}
      </div>
    </Modal>
  );
};

ProfilePopUp.propTypes = {
  show: PropTypes.bool,
  setProfileEdit: PropTypes.bool,
  profileStep: PropTypes.number,
  setProfileStep: PropTypes.number,
  initials: PropTypes.string,
  userInfos: PropTypes.string,
  onRemove: PropTypes.func,
};

const PhoneVerification = ({ setShowConfigureModal, show }) => {
  const [step, setStep] = useState(0);
  const dispatch = useDispatch();
  const userDetailsData = useSelector((store) => store.adminUserDetails?.data);

  const onPhoneVerification = () => {
    setStep(1);
  };

  const handleClose = () => {
    setShowConfigureModal(false);
    setStep(0);
    if (step == 3) {
      dispatch(fetchUserDetailsAction());
    }
  };

  const handleBack = () => {
    setStep(1);
  };

  const handleOnSuccessTwoStep = () => {
    setStep(3);
  };
  return (
    <Modal
      show={show}
      setShowConfigureModal={setShowConfigureModal}
      onClose={handleClose}
      showCloseButton={true}
      showBackButton={step === 2}
      onBack={handleBack}
      className={
        step === 0
          ? styles.password_modal
          : step === 1
          ? styles.reconfigure_modal
          : step === 2
          ? styles.download_auth
          : styles.success_modal
      }
    >
      {step === 0 && (
        <PhoneOtpVerification afterVerification={onPhoneVerification} />
      )}
      {step === 1 && (
        <ReconfigureTwoStepAuthentication
          onSuccess={handleOnSuccessTwoStep}
          onClick={() => setStep(2)}
        />
      )}
      {step === 2 && (
        <div className={styles.downloadAuthClass}>
          <h1 className={styles.titleClass}>Download an Authenticator App</h1>
          <div className={styles.pointsContainer}>
            <p>1. Visit the App Store in your mobile device.</p>

            <p>2. Search “Authenticator.”</p>

            <div>
              <p>3. Download one of the apps.</p>
              <p className={styles.recomendedClass}>
                We recommend Google Authenticator or Microsoft <br />
                Authenticator.
              </p>
            </div>

            <p>
              4.
              <button
                className={styles.getSmsClass}
                onClick={() => {
                  setStep(1);
                }}
                type="button"
              >
                Go Back
              </button>
              &nbsp; to finish reconfiguring Two-Step Authentication.
            </p>
          </div>

          <div className={styles.handleDeviceClass}>
            <img
              src={handheldDevice}
              className={styles.handImageClass}
              alt="device"
            />

            <p>
              Visit your device’s App Store to <br /> download an authenticator
              app.
            </p>
          </div>
        </div>
      )}
      {step === 3 && (
        <div className={styles.successModalContainer}>
          <h1 className={`${styles.titleClass} ${styles.twostepTitleClass}`}>
            Two-Step Authentication
            <br />
            {userDetailsData?.authyLastConfiguredAt
              ? "Reconfigured"
              : "Configured"}
          </h1>
          <img src={successIcon} className={styles.successImage} />
          <Button onClick={handleClose}>Done</Button>
        </div>
      )}
    </Modal>
  );
};

PhoneVerification.propTypes = {
  show: PropTypes.bool,
  setShowConfigureModal: PropTypes.bool,
  phoneNumber: PropTypes.number,
  setProfileStep: PropTypes.number,
};

const validationSchema = Yup.object().shape({
  oldPassword: Yup.string()
    .required("Current Password is required")
    .min(8, "Incorrect password."),
  newPassword: Yup.string()
    .required("New Password is required")
    .notOneOf(
      [Yup.ref("oldPassword")],
      "New password should not match with Old password"
    )
    .min(8, "Requirements not met.")
    .max(32, "Password must be a maximum of 32 characters")
    .matches(/^(?=.*[@$!%*#?&])/, "Requirements not met.")
    .matches(/\d/, "Requirements not met.")
    .matches(/(?=.*[a-z])/, "Requirements not met.")
    .matches(/(?=.*[A-Z])/, "Requirements not met."),

  confirmNewPassword: Yup.string()
    .required("Confirm Password is required")
    .oneOf([Yup.ref("newPassword")], "Passwords do not match."),
});

const initialvalues = {
  oldPassword: "",
  newPassword: "",
  confirmNewPassword: "",
};

const phoneMask = (number) => {
  return `(${number && number.substring(0, 3)}) ${
    number && number.slice(3, 6)
  } - ${number && number.slice(6)} `;
};
