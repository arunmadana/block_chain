import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import tick from "../../assets/tick.svg";
import { useLocation, useParams } from "react-router-dom";
import * as Yup from "yup";
import { APIKeyEnum } from "../../Enums/APIKeyEnum";
import { AccountTypeStatusEnum } from "../../Enums/AccountTypeStatusEnum";
import { useOutsideClick } from "../../Hooks/useOutsideClick";
import { HBar } from "../../components/Bars/Bars";
import { Checkbox } from "../../components/Checkbox/Checkbox";
import { FormTextArea } from "../../components/FormField/FormField";
import Modal from "../../components/Modal/Modal";
import { ProfileNavButton } from "../../components/ProfileNavButton/ProfileNavButton";
import { getStorage } from "../../services/Storage";
import {
  changeStatus,
  getBusinessInfo,
} from "../../services/customerProfiles/customerProfiles";
import styles from "./BusinessSettingsSideMenu.module.scss";
import { PermissionTypeEnum } from "../../Enums/PermissionTypeEnum";
import { LocalStorageKeysEnum } from "../../Enums/LocalStorageKeysEnum";
import { Button } from "@mui/joy";

const BusinessSettingsSideMenu = ({ getInfo = () => {} }) => {
  const location = useLocation();
  const [bulkActions, setBulkActions] = useState([]);
  const [statusModal, setStatusModal] = useState(false);
  const [showDropDownModal, setshowDropDownModal] = useState(false);
  const [currentStatus, setCurrentStatus] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedStatusNumber, setSelectedStatusNumber] = useState("");
  const statusDropDownRef = React.useRef(null);
  const { id } = useParams();
  const [editPermission, setEditPermission] = useState(false);
  const [rowData, setRowData] = useState("");
  const profileListUpdate = location?.key;

  const statusUpdate = () => {
    getUserInfo();
  };

  const getUserInfo = () => {
    getBusinessInfo(id)
      .then((res) => {
        const response = res.data?.data;
        const currentStatus = Object.keys(APIKeyEnum)?.find(
          (key) => APIKeyEnum[key] === response?.status
        );
        setCurrentStatus(currentStatus);
        if (currentStatus == AccountTypeStatusEnum.Active) {
          setBulkActions([
            {
              value: AccountTypeStatusEnum.Active,
              label: AccountTypeStatusEnum.Active,
            },
            {
              value: AccountTypeStatusEnum.UnderReview,
              label: AccountTypeStatusEnum.UnderReview,
            },
            {
              value: AccountTypeStatusEnum.Terminated,
              label: AccountTypeStatusEnum.Terminated,
            },
            {
              value: AccountTypeStatusEnum.Cancelled,
              label: AccountTypeStatusEnum.Cancelled,
            },
          ]);
        } else if (currentStatus == AccountTypeStatusEnum.UnderReview) {
          setBulkActions([
            {
              value: AccountTypeStatusEnum.UnderReview,
              label: AccountTypeStatusEnum.UnderReview,
            },
            {
              value: AccountTypeStatusEnum.Terminated,
              label: AccountTypeStatusEnum.Terminated,
            },

            {
              value: AccountTypeStatusEnum.Cancelled,
              label: AccountTypeStatusEnum.Cancelled,
            },

            {
              value: AccountTypeStatusEnum.Active,
              label: AccountTypeStatusEnum.Active,
            },
          ]);
        } else if (currentStatus == AccountTypeStatusEnum.Cancelled) {
          setBulkActions([
            {
              value: AccountTypeStatusEnum.Cancelled,
              label: AccountTypeStatusEnum.Cancelled,
            },

            {
              value: AccountTypeStatusEnum.Active,
              label: AccountTypeStatusEnum.Active,
            },
            {
              value: AccountTypeStatusEnum.UnderReview,
              label: AccountTypeStatusEnum.UnderReview,
            },
            {
              value: AccountTypeStatusEnum.Terminated,
              label: AccountTypeStatusEnum.Terminated,
            },
          ]);
        } else {
          setBulkActions([
            {
              value: AccountTypeStatusEnum.Terminated,
              label: AccountTypeStatusEnum.Terminated,
            },
            {
              value: AccountTypeStatusEnum.Cancelled,
              label: AccountTypeStatusEnum.Cancelled,
            },
            {
              value: AccountTypeStatusEnum.Active,
              label: AccountTypeStatusEnum.Active,
            },
            {
              value: AccountTypeStatusEnum.UnderReview,
              label: AccountTypeStatusEnum.UnderReview,
            },
          ]);
        }
      })
      .catch((err) => {
        const message =
          err?.response?.data?.error?.errorDescription ||
          "Failed to get business information";
      });
  };

  useEffect(() => {
    const rowDetails = localStorage?.getItem("businessDetails");
    const businessData = JSON?.parse(rowDetails);
    setRowData(businessData);
  }, [profileListUpdate]);

  useEffect(() => {
    getInfo(rowData);
  }, [rowData]);

  useOutsideClick(statusDropDownRef, () => {
    if (showDropDownModal) {
      setshowDropDownModal(false);
    }
  });

  useEffect(() => {
    const userAuthority = getStorage(LocalStorageKeysEnum?.authorities);
    const parsedData = JSON?.parse(userAuthority);
    setEditPermission(
      parsedData?.ADMIN_BUSINESS_EDIT ==
        PermissionTypeEnum?.BusinessProfilesEdit
    );
    getUserInfo();
  }, [rowData?.status]);

  const menuData = [
    {
      id: "business-info",
      label: "Business Information",
      url: `/dashboards/profiles/business-details/${id}/business-info`,
    },
    {
      id: "points-of-contact",
      label: "Points of Contact",
      url: `/dashboards/profiles/business-details/${id}/points-of-contact`,
    },
    {
      id: "configuration",
      label: "Configuration",
      url: `/dashboards/profiles/business-details/${id}/configuration/nodes`,
      configPaths: {
        nodes: `/dashboards/profiles/business-details/${id}/configuration/nodes`,
        keys: `/dashboards/profiles/business-details/${id}/configuration/api-keys`,
        webHooks: `/dashboards/profiles/business-details/${id}/configuration/webhooks`,
        ip: `/dashboards/profiles/business-details/${id}/configuration/ip-addresses`,
        activity: `/dashboards/profiles/business-details/${id}/configuration/activity-logs`,
      },
    },
    {
      id: "activity-log",
      label: "Activity Log",
      url: `/dashboards/profiles/business-details/${id}/activity-log`,
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.relativeClass} ref={statusDropDownRef}>
        <div
          className={`${styles.accountStatusAlign} ${
            showDropDownModal && styles.dropDownActiveClass
          } ${!editPermission && styles.editPermissionClass}`}
          onClick={() => {
            editPermission && setshowDropDownModal(!showDropDownModal);
          }}
        >
          <p className={styles.accountStatusText}>Account Status:</p>
          <div
            className={`${styles.optionsContainer} ${
              !editPermission && styles.disableOptionsContainerClass
            }`}
          >
            <span className={styles.accountStatus}>
              {changeStatusColor(currentStatus)}
            </span>
            {editPermission && (
              <span className={`icon-small-arrow1 ${styles.arrow}`} />
            )}
          </div>
        </div>
        {showDropDownModal && (
          <div className={styles.statusDropDownContainer}>
            {bulkActions?.map((each, index) => (
              <div
                key={index}
                className={styles.optionsContainer}
                onClick={() => {
                  if (currentStatus !== each?.value) {
                    setSelectedStatus(each?.value);
                    setSelectedStatusNumber(APIKeyEnum[each?.value]);
                    setStatusModal(true);
                    setshowDropDownModal(false);
                  }
                }}
              >
                <span
                  className={`${styles.accountStatusClass} ${
                    index === 0 && styles.statusBackgroundClass
                  } ${
                    each?.value === AccountTypeStatusEnum.UnderReview &&
                    styles.underReviewClass
                  }`}
                >
                  {changeStatusColor(each?.value)}
                </span>
                {index === 0 && <img src={tick} className={styles.tickClass} />}
              </div>
            ))}
          </div>
        )}
      </div>
      <HBar className={styles.hbarClass} />
      <div className={styles.businessName}>{rowData?.name}</div>
      <div className={styles.accountID}>Account ID: BID-{rowData?.id}</div>
      <div className={styles.navButton}>
        {menuData.map((menu, index) => {
          return (
            <p key={index}>
              <ProfileNavButton
                id={menu.id}
                label={menu.label}
                to={menu.url}
                imgClassName={`${
                  (location?.pathname === menu?.configPaths?.nodes ||
                    location?.pathname === menu?.configPaths?.keys ||
                    location?.pathname === menu?.configPaths?.webHooks ||
                    location?.pathname === menu?.configPaths?.ip ||
                    location?.pathname === menu?.configPaths?.activity ||
                    location?.pathname === menu?.url) &&
                  `${styles.caret}`
                }`}
                activeClassName={`${styles.Profile} ${
                  (location?.pathname === menu?.configPaths?.nodes ||
                    location?.pathname === menu?.configPaths?.keys ||
                    location?.pathname === menu?.configPaths?.webHooks ||
                    location?.pathname === menu?.configPaths?.ip ||
                    location?.pathname === menu?.configPaths?.activity ||
                    location?.pathname === menu?.url) &&
                  `${styles.active}`
                } `}
              />
            </p>
          );
        })}
      </div>
      <StatusChange
        show={statusModal}
        statusUpdate={statusUpdate}
        handleClose={() => setStatusModal(false)}
        selectedStatus={selectedStatus}
        currentStatus={currentStatus}
        selectedStatusNumber={selectedStatusNumber}
        rowData={rowData}
      />
    </div>
  );
};
export default BusinessSettingsSideMenu;

const changeStatusColor = (value) => {
  return (
    <span
      className={
        value === AccountTypeStatusEnum.Active
          ? styles.activeColor
          : value === AccountTypeStatusEnum.UnderReview
          ? styles.underReviewColor
          : value === AccountTypeStatusEnum.Terminated
          ? styles.terminatedColor
          : value === AccountTypeStatusEnum.Cancelled
          ? styles.canceledColor
          : ""
      }
    >
      {value}
    </span>
  );
};

const StatusChange = ({
  show,
  currentStatus,
  selectedStatus,
  handleClose,
  statusUpdate,
  selectedStatusNumber,
  rowData,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const emojiRegex = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g;

  const handleSubmit = () => {
    setIsProcessing(true);
    const payLoad = {
      status: selectedStatusNumber,
      tenantId: rowData?.id,
      reason: formik.values.reason,
      isStatusChange: formik.values.isStatusChange,
    };
    changeStatus(payLoad)
      .then(() => {
        statusUpdate();
        setIsProcessing(false);
        handleClose();
        formik.resetForm();
      })
      .catch(() => {
        handleClose();
        formik.resetForm();
        setIsProcessing(false);
      });
  };

  const formik = useFormik({
    initialValues: {
      reason: "",
      isStatusChange: false,
    },
    validationSchema: Yup.object({
      reason: Yup.string()
        .required("Reason is required")
        .test("no-emojis", "Reason cannot contain emojis", (val) => {
          return !emojiRegex?.test(val);
        })
        .matches(/^(?!\s+$)/, "Reason cannot contain only blankspaces"),
      isStatusChange: Yup.bool().oneOf([true]),
    }),
    onSubmit: handleSubmit,
  });

  return (
    <Modal
      showCloseButton={true}
      show={show}
      onClose={() => {
        formik.resetForm();
        handleClose();
      }}
      className={styles.statusModalClass}
    >
      <div className={styles.statusChangeContainer}>
        <h1 className={styles.titleClass}>Change Account Status</h1>
        <p className={styles.messageClass}>
          Are you sure you want to change the status of this business <br />
          from &nbsp;
          <span className={styles.statusFontClass}>
            {changeStatusColor(currentStatus)}
          </span>
          &nbsp; to &nbsp;
          <span className={styles.statusFontClass}>
            {changeStatusColor(selectedStatus)}
          </span>
          ? This will <br /> go into effect immediately.
        </p>
        <div className={styles.textFieldContainer}>
          <p className={styles.reasonClass}>Reason for status change:</p>
          <FormTextArea
            id="reason"
            name="reason"
            charLimit={120}
            disableLabelTop={true}
            className={styles.textAreaClass}
            {...formik.getFieldProps("reason")}
            error={formik.touched.reason && formik.errors.reason}
            placeHolder="Enter the reason for changing status"
          />
          <div className={styles.checkBoxContainer}>
            <Checkbox
              type="checkbox"
              className={styles.checkBoxClass}
              onChange={() =>
                formik.setFieldValue(
                  "isStatusChange",
                  !formik.values.isStatusChange
                )
              }
              name="isStatusChange"
              label={`I understand that changing the status will ${
                selectedStatusNumber == APIKeyEnum.Active ||
                selectedStatusNumber == APIKeyEnum["Under Review"]
                  ? "allow"
                  : "stop"
              } all
              RYVYL Block operations for this business.`}
              checked={formik.values.isStatusChange}
              labelClassName={styles.checkBoxLabel}
            />
          </div>
        </div>
        <Button
          className={styles.buttonClass}
          disabled={!(formik.isValid && formik.dirty) || isProcessing}
          onClick={handleSubmit}
        >
          Apply Change
        </Button>
      </div>
    </Modal>
  );
};
