import { Button } from "@mui/joy";
import { useFormik } from "formik";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import * as Yup from "yup";
import { LocalStorageKeysEnum } from "../../../Enums/LocalStorageKeysEnum";
import { PermissionTypeEnum } from "../../../Enums/PermissionTypeEnum";
import backArrowIcon from "../../../assets/back-arrow.svg";
import { TextAreaField } from "../../../components/FormField/FormField";
import Modal from "../../../components/Modal/Modal";
import PreFormField from "../../../components/PreFormField/PreFormField";
import Spinner from "../../../components/Spinner/Spinner";
import { textEllipsis } from "../../../helpers/textEllipsis";
import { getStorage } from "../../../services/Storage";
import { getWebhookData, modifyWebhook } from "../../../services/profiles/poc";
import styles from "./BusinessDetailsWebhooks.module.scss";

const BusinessDetailsWebhooks = () => {
  const [step, setStep] = useState(0);
  const [hasPermission, setHasPermission] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [webhookData, setWebhookData] = useState(null);
  const [emptyData, setEmptyData] = useState(false);
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

  //fetching the webhook Endpoints
  const getWebhook = () => {
    setIsLoading(true);
    getWebhookData(tenantId)
      .then((res) => {
        const data = res?.data?.data;
        setWebhookData(data);
        setIsLoading(false);
        // Check for null values [if null then show No Endpoint Screen else webhook detail screen]
        const hasNullValues = (obj) => {
          return Object.values(obj).includes(null);
        };
        const hasNull = hasNullValues(data);
        setEmptyData(hasNull);
        if (hasNull) {
          setStep(0);
        } else {
          setStep(2);
        }
      })
      .catch(() => {
        setIsLoading(false);
      });
  };

  // Split the URL using '://' as the delimiter and take the second part
  const parts = webhookData?.webhookUrl && webhookData?.webhookUrl.split("://");
  const newUrl = parts?.length === 2 ? parts[1] : webhookData?.webhookUrl;

  useEffect(() => {
    if (step == 1) {
      formik.setValues({
        url: webhookData?.webhookUrl && newUrl,
        description: webhookData?.webhookDescription,
      });
    }
    // eslint-disable-next-line
  }, [step]);

  //creating the webhook Endpoints
  const createEndpoint = () => {
    setIsLoading(true);
    const payload = {
      tenantId: `${tenantId}`,
      webhookUrl: `https://${formik.values.url}`,
      webhookDescription: formik.values.description,
      isUpdateWebhook: false,
    };
    modifyWebhook(payload)
      .then((res) => {
        const message = res?.data?.data?.message;
        console.log();
        message;
        getWebhook();
        setIsLoading(false);
      })
      .catch((err) => {
        const message =
          err?.response?.data?.error?.errorDescription || "Please try again";
        console.log();
        message;
        setIsLoading(false);
      });
  };

  //updating the webhook Endpoints
  const updateEndpoint = () => {
    setIsLoading(true);
    const payload = {
      tenantId: `${tenantId}`,
      webhookUrl: `https://${formik.values.url}`,
      webhookDescription: formik.values.description,
      isUpdateWebhook: true,
    };
    modifyWebhook(payload)
      .then((res) => {
        const message = res?.data?.data?.message;
        console.log(message);
        setShowModal(false);
        getWebhook();
        setIsLoading(false);
      })
      .catch((err) => {
        const message =
          err?.response?.data?.error?.errorDescription || "Please try again";
        console.log(message);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    getWebhook();
    // eslint-disable-next-line
  }, []);

  //integrated the backArrow functionality
  const handleBackArrow = () => {
    if (!emptyData) {
      setStep(2);
    } else {
      formik.resetForm();
      setStep(0);
    }
  };

  //integrated whether we are creating or upadting the endpoint
  const handleSave = () => {
    if (!emptyData) {
      setShowModal(true);
    } else {
      createEndpoint();
    }
  };

  const emojiRegex = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g;

  //formik initialization
  const formik = useFormik({
    initialValues: {
      url: "",
      description: "",
    },
    validationSchema: Yup.object({
      url: Yup.string()
        .required("URL is required")
        .matches(
          /^(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/,
          "Invalid endpoint URL"
        ),
      description: Yup.string()
        .required("Description is required")
        .test("no-emojis", "Description cannot contain emojis", (val) => {
          return !emojiRegex.test(val);
        })
        .matches(/^(?!\s+$)/, "Description cannot contain blankspaces"),
    }),
    onSubmit: handleSave,
  });

  const disableButton = useMemo(() => {
    return !(
      formik.dirty &&
      formik.isValid &&
      (formik.values.url != newUrl ||
        formik.values.description != webhookData?.webhookDescription)
    );
  }, [formik, webhookData, newUrl]);

  const handleEdit = () => {
    if (hasPermission) {
      setStep(1);
    }
  };

  const tooltipContent =
    "You do not have access to this feature. Contact your supervisor for permission.";

  return (
    <>
      {/* if no endpoint exist */}
      {step === 0 && (
        <>
          {isLoading ? (
            <div className={styles.loadingContainer}>
              <Spinner />
            </div>
          ) : (
            <div className={styles.container}>
              <div className={`icon-webhooks ${styles.webhookIcon}`} />
              <p className={styles.text}>No Endpoints Exist</p>
              <div
                className={styles.primaryButton}
                data-tooltip-content={
                  !hasPermission ? tooltipContent : undefined
                }
                data-tooltip-id="create"
              >
                <Button onClick={() => setStep(1)} disabled={!hasPermission}>
                  Create Endpoint
                </Button>
              </div>
            </div>
          )}
        </>
      )}
      {/* to show the form */}
      {step === 1 && (
        <div>
          <img
            src={backArrowIcon}
            className={styles.backArrow}
            onClick={handleBackArrow}
          />
          <div className={styles.container}>
            <p className={styles.title}>
              {emptyData ? "New Endpoint" : "Edit Endpoint"}
            </p>
            <div className={styles.subContainer}>
              <PreFormField
                label="Endpoint URL"
                httpText="https://"
                inputBeforeText="https://"
                id="url"
                name="url"
                value={formik.values.url}
                autoFocus={true}
                {...formik.getFieldProps("url")}
                error={formik.touched.url && formik.errors.url}
              />
              <TextAreaField
                label="Endpoint Description"
                charLimit={120}
                name="description"
                id="description"
                className={styles.textArea}
                {...formik.getFieldProps("description")}
                error={formik.touched.description && formik.errors.description}
              />
              <div className={styles.buttonContainer}>
                <button
                  type="button"
                  className={styles.cancelButton}
                  onClick={handleBackArrow}
                >
                  Cancel
                </button>
                <Button
                  isActionButton={true}
                  className={styles.primaryButtonSmall}
                  disabled={disableButton || isLoading}
                  onClick={formik.handleSubmit}
                >
                  {emptyData ? "Add" : "Save"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* to show the webhook details */}
      {step === 2 && (
        <>
          {isLoading ? (
            <div className={styles.loadingContainer}>
              <Spinner />
            </div>
          ) : (
            <div className={styles.detailContainer}>
              <div className={styles.topLabel}>
                <p className={styles.titleHead}>Webhook</p>
                <button
                  type="button"
                  data-tooltip-content={
                    !hasPermission ? tooltipContent : undefined
                  }
                  data-tooltip-id="edit"
                  className={`${
                    hasPermission ? styles.editButton : styles.disableEdit
                  }`}
                  onClick={handleEdit}
                >
                  Edit
                </button>
              </div>
              <div className={styles.keyValue}>
                <p className={styles.key}>Endpoint URL</p>
                <p
                  className={styles.urlValue}
                  data-tooltip-content={
                    webhookData &&
                    webhookData.webhookUrl &&
                    webhookData.webhookUrl.length > 30
                      ? webhookData && webhookData?.webhookUrl
                      : null
                  }
                  data-tooltip-id="endpoint"
                >
                  {textEllipsis(webhookData?.webhookUrl, 30)}
                </p>
              </div>
              <div className={styles.description}>
                <p className={styles.descriptionKey}>Description</p>
                <p className={styles.descriptionValue}>
                  {webhookData?.webhookDescription}
                </p>
              </div>
              <div className={styles.date}>
                <p className={styles.key}>Last saved</p>
                <p className={styles.urlValue}>{webhookData?.lastSaved}</p>
              </div>
            </div>
          )}
        </>
      )}
      <SaveModal
        show={showModal}
        onClose={() => setShowModal(false)}
        handleUpdate={updateEndpoint}
        disable={isLoading}
      />
    </>
  );
};

export default BusinessDetailsWebhooks;

//Modal designed when we update the end point
const SaveModal = ({ show, onClose, handleUpdate, disable }) => {
  return (
    <Modal
      show={show}
      showCloseButton={true}
      onClose={onClose}
      className={styles.modalContainer}
    >
      <div className={styles.modalTitle}>Save Endpoint Changes</div>
      <p className={styles.modalText}>
        Are you sure you want to save the changes you made to this endpoint URL?
        Any system currently using this endpoint will immediately go offline.
      </p>
      <Button
        className={styles.modalButton}
        onClick={handleUpdate}
        disabled={disable}
      >
        Save
      </Button>
      <div>
        <button
          type="button"
          className={styles.modalCancelButton}
          onClick={onClose}
        >
          Cancel
        </button>
      </div>
    </Modal>
  );
};
