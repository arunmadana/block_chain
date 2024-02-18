import { Button } from "@mui/joy";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { LocalStorageKeysEnum } from "../../../Enums/LocalStorageKeysEnum";
import { PermissionTypeEnum } from "../../../Enums/PermissionTypeEnum";
import { HBar, VBar } from "../../../components/Bars/Bars";
import Chip from "../../../components/Chip/Chip";
import CopyButton from "../../../components/CopyButton/CopyButton";
import Modal from "../../../components/Modal/Modal";
import { PhoneOtpVerification } from "../../../components/PhoneOtpVerification/PhoneOtpVerification";
import Spinner from "../../../components/Spinner/Spinner";
import VerificationInput from "../../../components/VerificationInput/VerificationInput";
import codeToString from "../../../helpers/codeToString";
import { getStorage } from "../../../services/Storage";
import { getBusinessInfo } from "../../../services/customerProfiles/customerProfiles";
import {
  generateKey,
  getAllApiKeys,
  otpValidade,
  revealKey,
} from "../../../services/profiles/poc";
import styles from "./BusinessDetailsApiKeys.module.scss";

const BusinessDetailsApikeys = () => {
  const [selectedKeys, setSelectedKeys] = useState(1);
  const [publicKeyData, setPublicKeyData] = useState(null); // this data will come from business-info Api
  const [activeKeys, setActiveKeys] = useState([]);
  const [inActiveKeys, setInActiveKeys] = useState([]);
  const [expiredKeys, setExpiredKeys] = useState([]);
  const [hasPermission, setHasPermission] = useState(false); // This will come from login or step up Api
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { id: tenantId } = useParams();

  // fetching the authority of user for generating the new Api Key
  useEffect(() => {
    const userAuthority = getStorage(LocalStorageKeysEnum?.authorities);
    const parsedData = JSON.parse(userAuthority);
    setHasPermission(
      parsedData?.ADMIN_BUSINESS_EDIT ==
        PermissionTypeEnum?.BusinessProfilesEdit
    );
  }, []);

  // fetching only Public Key
  const fetchPublicKey = () => {
    setIsLoading(true);
    getBusinessInfo(tenantId)
      .then((res) => {
        const data = res?.data?.data?.apiKey;
        setPublicKeyData(data);
        setIsLoading(false);
      })
      .catch((error) => {
        const errorMessage = error?.response?.data?.error?.errorDescription;
        console.log(errorMessage);
      });
  };

  // fetching only Active Api Keys
  const fetchActiveApiKeys = () => {
    setIsLoading(true);
    const payload = { status: 1 };
    getAllApiKeys(tenantId, payload)
      .then((res) => {
        const activeData = res?.data?.data?.items;
        setActiveKeys(activeData);
        setIsLoading(false);
      })
      .catch((error) => {
        const errorMessage = error?.response?.data?.error?.errorDescription;
        console.log(errorMessage);
      });
  };

  // fetching only Inactive Api Keys
  const fetchInactiveApiKeys = () => {
    setIsLoading(true);
    const payload = { status: 2 };
    getAllApiKeys(tenantId, payload)
      .then((res) => {
        const inactiveData = res?.data?.data?.items;
        setInActiveKeys(inactiveData);
        setIsLoading(false);
      })
      .catch((error) => {
        const errorMessage = error?.response?.data?.error?.errorDescription;
        console.log(errorMessage);
      });
  };

  // fetching only Expired Api Keys
  const fetchExpiredApiKeys = () => {
    setIsLoading(true);
    const payload = { status: 4 };
    getAllApiKeys(tenantId, payload)
      .then((res) => {
        const expiredData = res?.data?.data?.items;
        setExpiredKeys(expiredData);
        setIsLoading(false);
      })
      .catch((error) => {
        const errorMessage = error?.response?.data?.error?.errorDescription;
        console.log(errorMessage);
      });
  };

  useEffect(() => {
    if (selectedKeys == 1) {
      fetchPublicKey();
      fetchActiveApiKeys();
    } else if (selectedKeys == 2) {
      fetchInactiveApiKeys();
    } else {
      fetchExpiredApiKeys();
    }
    // eslint-disable-next-line
  }, [selectedKeys]);

  const handleGenerateKey = () => {
    if (hasPermission) {
      setShowModal(true);
    }
  };

  const tooltipContent =
    "You do not have access to this feature. Contact your supervisor for permission.";

  // to generate the Api Secret Key
  const generateApiKey = () => {
    setIsLoading(true);
    generateKey(tenantId)
      .then((res) => {
        const data = res?.data?.data?.message;
        setShowModal(false);
        setSelectedKeys(1);
        fetchActiveApiKeys();
        console.log(data);
        setIsLoading(false);
      })
      .catch((error) => {
        const errorMessage = error?.response?.data?.error?.errorDescription;
        console.log(errorMessage);
        setIsLoading(false);
      });
  };

  return (
    <div className={styles.container}>
      <button
        type="button"
        data-tooltip-content={!hasPermission ? tooltipContent : undefined}
        data-tooltip-id="generate"
        className={`${hasPermission ? styles.generateKey : styles.disableKey}`}
        onClick={handleGenerateKey}
      >
        <span className={`icon-plus ${styles.plus}`} />
        Generate Secret Key
      </button>
      <div className={styles.subContainer}>
        <div className={styles.lableContainer}>
          {apiKeyLabels?.map((label, i) => (
            <KeysButton
              key={i}
              labelName={label?.labelName}
              onClick={() => {
                setSelectedKeys(label?.id);
              }}
              isActive={selectedKeys === label?.id}
            />
          ))}
        </div>
        <VBar className={styles.verticalBar} />
        {selectedKeys === 1 &&
          (isLoading ? (
            <div className={styles.loadingContainer}>
              <Spinner />
            </div>
          ) : (
            <div className={styles.secretKeyContainer}>
              <div className={styles.public}>Public Key: </div>
              <div className={styles.publicKey}>
                <div className={styles.flexContainer}>
                  <span className={styles.publicKeyData}>{publicKeyData}</span>
                  <CopyButton id="copyButton" message={publicKeyData} />
                </div>
                <Chip className={styles.activeKey}>Active</Chip>
              </div>
              <div className={styles.dateField}>
                <p className={styles.dateKey}>
                  Created On:
                  <span className={styles.dateValue}>
                    {publicKeyData?.createdDate}
                  </span>
                </p>
                <p className={styles.dateKey}>
                  Last Update:
                  <span className={styles.dateValue}>
                    {publicKeyData?.updatedDate}
                  </span>
                </p>
              </div>
              <HBar className={styles.hBar} />
              {activeKeys?.length > 0 ? (
                activeKeys?.map((eachSecretKey, i) => (
                  <SecretKey
                    key={i}
                    header="Secret Key:"
                    id={eachSecretKey?.id}
                    secretKey={eachSecretKey?.secretKey}
                    status="Active"
                    color="green"
                    createdDate={eachSecretKey?.createdDate}
                    updatedDate={eachSecretKey?.modifiedDate}
                  />
                ))
              ) : (
                <div>
                  <div className={styles.public}>Secret Key:</div>
                  <p className={styles.statusMessage}>
                    {activeKeys?.length === 0 && expiredKeys?.length > 0
                      ? "The current Secret Key has expired. "
                      : "Business does not have secret key. "}
                    {hasPermission && (
                      <button
                        type="button"
                        className={styles.generateLink}
                        onClick={handleGenerateKey}
                      >
                        Please generate a new secret key.
                      </button>
                    )}
                  </p>
                </div>
              )}
            </div>
          ))}
        {selectedKeys === 2 &&
          (isLoading ? (
            <div className={styles.loadingContainer}>
              <Spinner />
            </div>
          ) : inActiveKeys?.length ? (
            <div className={styles.notActiveContainer}>
              {inActiveKeys?.map((eachSecretKey, i) => (
                <>
                  <SecretKey
                    key={i}
                    header="Inactive Secret Key:"
                    id={eachSecretKey?.id}
                    secretKey={eachSecretKey?.secretKey}
                    status="Inactive"
                    color="lorange"
                    createdDate={eachSecretKey?.createdDate}
                    updatedDate={eachSecretKey?.modifiedDate}
                  />
                  <HBar className={styles.hBar} />
                </>
              ))}
            </div>
          ) : (
            <p className={styles.message}>
              Business does not have any inactive key.
            </p>
          ))}
        {selectedKeys === 4 &&
          (isLoading ? (
            <div className={styles.loadingContainer}>
              <Spinner />
            </div>
          ) : expiredKeys?.length ? (
            <div className={styles.notActiveContainer}>
              {expiredKeys?.map((eachSecretKey, i) => (
                <>
                  <SecretKey
                    key={i}
                    header="Expired Secret Key:"
                    id={eachSecretKey?.id}
                    secretKey={eachSecretKey?.secretKey}
                    status="Expired"
                    color="red"
                    createdDate={eachSecretKey?.createdDate}
                    updatedDate={eachSecretKey?.modifiedDate}
                  />
                  <HBar className={styles.hBar} />
                </>
              ))}
            </div>
          ) : (
            <p className={styles.message}>
              Business does not have any expired key.
            </p>
          ))}
      </div>
      <GenerateKeyModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onClick={generateApiKey}
        disable={isLoading}
      />
    </div>
  );
};

export default BusinessDetailsApikeys;

const KeysButton = ({
  labelName = "",
  isActive = false,
  onClick = () => {},
}) => {
  return (
    <div className={styles.keyContainer}>
      <button
        type="button"
        className={`${isActive ? styles.keyActive : styles.keyButton}`}
        onClick={onClick}
      >
        {labelName}
      </button>
      {isActive && <span className={`icon-small-arrow1 ${styles.arrow}`} />}
    </div>
  );
};

const SecretKey = ({
  id,
  header,
  createdDate,
  updatedDate,
  color,
  status,
  secretKey,
}) => {
  const [show, setShow] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [revealSecretKey, setRevealSecretKey] = useState(null);
  const handleClickReveal = (id) => {
    setSelectedId(id);
    setShow(true);
  };

  const handleReveal = () => {
    setShow(false);
    revealKey(selectedId)
      .then((res) => {
        const data = res?.data?.data?.secretKey;
        setRevealSecretKey(data);
      })
      .catch((error) => {
        const errorMessage = error?.response?.data?.error?.errorDescription;
        console.log(errorMessage);
      });
  };

  return (
    <div className={`${revealSecretKey && styles.indexMargin}`}>
      <div className={styles.secretKeyContainer}>
        <div className={styles.public}>{header}</div>
        {revealSecretKey ? (
          <div className={styles.publicKey}>
            <div className={styles.flexContainer}>
              <span className={styles.publicKeyData}>
                {revealSecretKey ? revealSecretKey : secretKey}
              </span>
              <CopyButton
                id="copyButton"
                message={revealSecretKey ? revealSecretKey : secretKey}
              />
            </div>
            <div>
              <Chip className={styles.activeKey} color={color}>
                {status}
              </Chip>
            </div>
          </div>
        ) : (
          <div className={styles.secretKey}>
            <span className={styles.secretKeyData}>{secretKey}</span>
            <button
              type="button"
              className={styles.revealButton}
              onClick={() => handleClickReveal(id)}
            >
              Reveal Secret Key
            </button>
            <Chip className={styles.secretKeyChip} color={color}>
              {status}
            </Chip>
          </div>
        )}
        {revealSecretKey && (
          <button
            type="button"
            className={styles.hideKey}
            onClick={() => {
              setRevealSecretKey(null);
            }}
          >
            Hide Secret Key
          </button>
        )}
        <div className={styles.dateField}>
          <p className={styles.dateKey}>
            Created On:
            <span className={styles.dateValue}>{createdDate}</span>
          </p>
          <p className={styles.dateKey}>
            Last Update:
            <span className={styles.dateValue}>{updatedDate}</span>
          </p>
        </div>
        <RevealModal
          show={show}
          onClose={() => setShow(false)}
          handleReveal={handleReveal}
        />
      </div>
    </div>
  );
};

const RevealModal = ({ show, onClose, handleReveal }) => {
  const blankCode = ["", "", "", "", "", ""];
  const [step, setStep] = useState(0);
  const [code, setCode] = useState(blankCode);
  const [codeError, setCodeError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [codeSuccess, setCodeSuccess] = useState(false);
  const authed = getStorage("isAuthorized");

  const onCompleteAuthy = () => {
    setIsLoading(true);
    setCodeError(false);
    otpValidade(codeToString(code), "AUTHY_CONFIG")
      .then(() => {
        setIsLoading(false);
        setCodeSuccess(true);
        setTimeout(() => {
          setCodeSuccess(false);
          onClose();
          handleReveal();
          setCode(blankCode);
        }, 400);
      })
      .catch(() => {
        setCode(blankCode);
        setIsLoading(false);
        setCodeError(true);
      });
  };

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

  const handleBack = () => {
    setCode(blankCode);
    setStep(0);
    setCodeError(false);
  };

  const onPhoneOtp = () => {
    setStep(0);
    handleReveal();
  };

  const handleClose = () => {
    handleBack();
    onClose();
  };

  return (
    <Modal
      show={show}
      onClose={handleClose}
      showCloseButton={true}
      showBackButton={step == 1 && authed === "true"}
      onBack={handleBack}
      className={styles.revealModalContainer}
    >
      {step == 0 && (
        <div>
          <div className={styles.revealModalTitle}>Two-Step Authentication</div>
          <div className={styles.revealModalSubTitle}>
            Enter the 6-digit code shown in your authentication app.
          </div>
          <div className={styles.revealModalText}>Verification Code:</div>
          <div className={styles.revealModalInput}>
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
      {step == 1 && (
        <div>
          <PhoneOtpVerification
            actionType={"AUTHY_CONFIG"}
            afterVerification={onPhoneOtp}
          />
        </div>
      )}
    </Modal>
  );
};

const GenerateKeyModal = ({ show, onClose = () => {}, onClick, disable }) => {
  return (
    <Modal
      show={show}
      showCloseButton={true}
      onClose={onClose}
      className={styles.modal}
    >
      <div className={styles.modalImage}></div>
      <div className={styles.modalContainer}>
        <p className={styles.modalTitle}>
          Are you sure you want to generate a new secret key?
        </p>
        <p className={styles.modalSubTitle}>
          The current secret key will become inactive, causing any linked
          applications to stop working.
        </p>
        <Button onClick={onClick} disable={disable}>
          Generate New Secret Key
        </Button>
      </div>
    </Modal>
  );
};

//data for the  buttons keys
const apiKeyLabels = [
  { labelName: "Active", id: 1 },
  { labelName: "Inactive", id: 2 },
  { labelName: "Expired", id: 4 },
];
