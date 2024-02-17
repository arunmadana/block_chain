import { Button } from "@mui/joy";
import redExclamation from "../../assets/red-exclamation.svg";
import { useEffect, useRef, useState } from "react";
import Modal from "../Modal/Modal";
import styles from "./DuplicateContactModal.module.scss";
import formatPhoneNumber from "../../helpers/formatPhoneNumber";
import { internationalPhoneFormat } from "../../helpers/internationalPhoneFormat";

export default function DuplicateContactModal({
  show = false,
  onclose,
  email,
  phoneNumber,
  countryCode,
  countryNumber,
}) {
  return (
    <Modal
      show={show}
      showCloseButton
      onClose={onclose}
      className={styles.duplicateContactModal}
    >
      <div className={styles.contactModalContainer}>
        <p className={styles.containerHeading}>Duplicate contact</p>
        <img src={redExclamation} />
        <div className={styles.duplicateText}>
          <p className={styles.ContentPara}>
            This contact information is already being used:
          </p>
          <p className={styles.emailText}>
            <WidthCalculator label={email} />
            <span className={styles.ContentPara}>
              {phoneNumber ? countryNumber : ""}&nbsp;
              {countryCode === "US"
                ? formatPhoneNumber(phoneNumber)
                : internationalPhoneFormat(String(phoneNumber))}
            </span>
          </p>
        </div>
        <Button onClick={() => onclose()}>Okay</Button>
      </div>
    </Modal>
  );
}

const WidthCalculator = ({ label }) => {
  const [width, setWidth] = useState(0);
  const textRef = useRef(null);
  useEffect(() => {
    if (textRef.current) {
      const boundingBox = textRef.current.getBoundingClientRect();
      setWidth(Math.floor(boundingBox.width));
    }
  }, []);

  return (
    <>
      <h1
        ref={textRef}
        data-tooltip-id={width > 354 ? "fullName" : ""}
        className={width > 354 && styles.ContentPara}
      >
        {label}
      </h1>
    </>
  );
};
