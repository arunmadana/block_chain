import { Breadcrumbs, Link, Typography } from "@mui/material";
import { AnimatePresence } from "framer-motion";
import { FC, Fragment, useEffect, useState } from "react";
import { useLocation } from "react-router";
import { BusinessTrackerEnum } from "../../Enums/BusinessTrackerEnum";
import { PhoneCountryListEnum } from "../../Enums/PhoneCountryListEnum";
import {
  editBusinessTracker,
  getBusinessTrackerDetails,
  getPhoneCountryList,
} from "../../services/profiles/poc";
import { BusinessApplicationSummary } from "../BusinessApplicationSummary/BusinessApplicationSummary";
import { BusinessDocumentUpload } from "../BusinessDocumentUpload/BusinessDocumentUpload";
import { BusinessInformation } from "../BusinessInformation/BusinessInformation";
import NodeConfiguration from "../NodeConfiguration/NodeConfiguration";
import { PointOfContact } from "../PointOfContact/PointOfContact";
import styles from "./BusinessTracker.module.scss";

const BusinessTracker: FC = () => {
  const [step, setStep] = useState(0);
  const [tentId, setTentId] = useState(null);
  const [countriesList, setCountriesList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [businessTrackerInformation, setBusinessTrackerInformation] = useState(
    {}
  );
  const [prevStep, setPrevStep] = useState(null);
  const [nextButtonDisabled, setNextButtonDisabled] = useState(false);
  const [updateTracker, setUpdateTracker] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (location?.state?.id) {
      handleBusinessTracker(location?.state?.id);
    }
  }, []);

  useEffect(() => {
    if (!isLoading) {
      return;
    }

    if (
      businessTrackerInformation?.isBusinessInformation &&
      businessTrackerInformation?.isPointOfContact &&
      businessTrackerInformation?.isDocumentsUploaded &&
      businessTrackerInformation?.isNodeConfiguration
    ) {
      setStep(4);
    } else if (
      businessTrackerInformation?.isBusinessInformation &&
      businessTrackerInformation?.isPointOfContact &&
      businessTrackerInformation?.isDocumentsUploaded
    ) {
      setStep(3);
    } else if (
      businessTrackerInformation?.isBusinessInformation &&
      businessTrackerInformation?.isPointOfContact
    ) {
      setStep(2);
    } else if (businessTrackerInformation?.isBusinessInformation) {
      setStep(1);
    } else {
      setStep(0);
    }
  }, [isLoading]);

  useEffect(() => {
    if (
      businessTrackerInformation?.isPointOfContact &&
      step == 1 &&
      nextButtonDisabled
    ) {
      handleBusinessTracker(tentId);
    }
  }, [updateTracker]);

  const handleBusinessTracker = (tentId) => {
    setTentId(tentId);
    setIsLoading(false);
    getBusinessTrackerDetails(tentId)
      .then((res) => {
        const data = res.data.data;
        setBusinessTrackerInformation(data);
        setIsLoading(true);
      })
      .catch((err) => {});
  };

  const EditBusinessTracker = (payload) => {
    editBusinessTracker(payload)
      .then(() => {})
      .catch((err) => {});
  };

  const handlePaymentStepSelect = (step) => {
    setStep(step);
    trackerUpdate();
    if (step == 1) {
      const payload = {
        tenantId: tentId,
        isTrackerUpdate: false,
        trackerType: BusinessTrackerEnum?.PointOfContact,
      };
      EditBusinessTracker(payload);
    } // Here Based on Cancel Button status i changed the payload
    if (step != 1 && tentId) {
      const payload = {
        tenantId: tentId,
        isTrackerUpdate: businessTrackerInformation?.isPointOfContact
          ? true
          : false,
        trackerType: BusinessTrackerEnum?.PointOfContact,
      };
      EditBusinessTracker(payload);
    }
  };

  const trackerUpdate = () => {
    const payload =
      prevStep === 0
        ? {
            tenantId: tentId,
            isTrackerUpdate: true,
            trackerType: BusinessTrackerEnum?.BusinessInfo,
          }
        : prevStep === 2
        ? {
            tenantId: tentId,
            isTrackerUpdate: true,
            trackerType: BusinessTrackerEnum?.BusinessDocument,
          }
        : prevStep === 3
        ? {
            tenantId: tentId,
            isTrackerUpdate: false,
            trackerType: BusinessTrackerEnum?.NodeConfiguration,
          }
        : {};

    if (prevStep === 0 || (prevStep && prevStep !== 1)) {
      editBusinessTracker(payload)
        .then((res) => {
          const data = res?.data?.data?.message;
          // toast.success(data);
        })
        .catch((err) => {});
    }
  };

  useEffect(() => {
    getCountryCodeList();
  }, []);

  //country list api call...
  const getCountryCodeList = () => {
    getPhoneCountryList(PhoneCountryListEnum.POCCountryList)
      .then((res) => {
        const data = res?.data?.data;
        setCountriesList(data);
      })
      .catch((err) => {});
  };
  return (
    <Fragment>
      <Breadcrumbs
        style={{ marginTop: "30px", marginBottom: "15px" }}
        aria-label="breadcrumb"
      >
        <Link underline="hover" color="black" href="/dashboards/profiles">
          Business Profiles
        </Link>
        <Typography>New Business</Typography>
      </Breadcrumbs>
      <div className={styles.trackerPage}>
        <div className={`${styles.trackerDetailsPage}`}>
          <span
            data-ui-auto="business_application"
            className={`${styles.headerText}`}
          >
            New Business
          </span>
          <div className={`${styles.trackerDetails}`}>
            <BusinessStep
              label="Business Information"
              isActive={step == 0}
              isCompleted={businessTrackerInformation?.isBusinessInformation}
              isDisabled={true}
              onLabelClick={() => handlePaymentStepSelect(0)}
            />
            <BusinessStep
              label="Points of Contact"
              isActive={step == 1}
              isCompleted={businessTrackerInformation?.isPointOfContact}
              isDisabled={businessTrackerInformation?.isPointOfContact}
              onLabelClick={() => {
                handlePaymentStepSelect(1);
              }}
            />
            <BusinessStep
              label="Business Documents"
              ui-auto="document_upload"
              isCompleted={businessTrackerInformation?.isDocumentsUploaded}
              isDisabled={businessTrackerInformation?.isDocumentsUploaded}
              isActive={step == 2}
              onLabelClick={() => handlePaymentStepSelect(2)}
            />
            <BusinessStep
              label="Node Configuration"
              isCompleted={businessTrackerInformation?.isNodeConfiguration}
              isDisabled={businessTrackerInformation?.isNodeConfiguration}
              isActive={step == 3}
              onLabelClick={() => handlePaymentStepSelect(3)}
            />
            <BusinessStep
              label="Summary"
              ui-auto="summary"
              isActive={step == 4}
              onLabelClick={() => {
                handlePaymentStepSelect(4);
              }}
            />
          </div>
        </div>
        <div className={`${styles.detailsScreen}`}>
          <AnimatePresence>
            {step === 0 && (
              <div>
                <BusinessInformation
                  onSucess={(tentId) =>
                    handleBusinessTracker(tentId || location?.state?.id)
                  }
                  getTentId={tentId || location?.state?.id}
                  countriesList={countriesList}
                />
              </div>
            )}
            {step === 1 && (
              <div>
                <PointOfContact
                  onSubmit={() =>
                    handleBusinessTracker(tentId || location?.state?.id)
                  }
                  onBack={() => setStep(0)}
                  tenantId={tentId || location?.state?.id}
                  countriesList={countriesList}
                  onDeleteChanges={(value) => setNextButtonDisabled(value)}
                  onUpdateTracker={(value) => setUpdateTracker(value)}
                />
              </div>
            )}
            {step === 2 && (
              <BusinessDocumentUpload
                onBack={() => {
                  setStep(1);
                  handlePaymentStepSelect(1);
                }}
                onNext={() =>
                  handleBusinessTracker(tentId || location?.state?.id)
                }
                tenantId={tentId || location?.state?.id}
              />
            )}
            {step === 3 && (
              <NodeConfiguration
                onBack={() => setStep(2)}
                onNext={() =>
                  handleBusinessTracker(tentId || location?.state?.id)
                }
                tenantId={tentId || location?.state?.id}
              />
            )}
            {step === 4 && (
              <BusinessApplicationSummary
                onBack={() => setStep(3)}
                onEdit={(step) => {
                  setStep(step);
                  setPrevStep(step);
                }}
                tenantId={tentId || location?.state?.id}
                countriesList={countriesList}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </Fragment>
  );
};

const BusinessStep = ({
  isActive = false,
  isCompleted = false,
  label,
  onLabelClick,
  isDisabled = false,
}) => {
  return (
    <div className={styles.businessStep}>
      <div
        className={`${styles.bullet} ${isActive && styles.bullet_active} ${
          isCompleted && styles.bullet_completed
        }`}
      />
      <div
        className={`${styles.vertical} ${
          isCompleted && styles.vertical_active
        }`}
      />
      <h6
        className={`${styles.bulletText}  ${
          isActive && styles.bulletText_active
        } ${isCompleted && styles.bulletText_completed} ${
          isActive && isCompleted && styles.activateBulletText
        }
      ${
        isCompleted && isDisabled
          ? styles.bulletText_hoverAction
          : "pointer-events-none"
      }`}
        onClick={onLabelClick}
      >
        {label}
      </h6>
    </div>
  );
};

export default BusinessTracker;
