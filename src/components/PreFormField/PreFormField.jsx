import { useState } from "react";
import {
  alphabets,
  numbers,
  symbolPassCode,
  symbols,
} from "../../Schemas/keyboard-keys";
import { Input } from "../Input/Input";
import styles from "./PreFormField.module.scss";

const PreFormField = ({
  disableSymbols = false,
  disableSpace = false,
  disableNumbers = false,
  disablePasswordSymbols = false,
  disableAlphabets = false,
  id = "",
  label = "",
  error = "",
  className = "",
  httpText = "",
  inputBeforeText = "",
  innerRef,
  maxLength,
  ...props
}) => {
  // State for handling focus and labelTop state
  const [isFocused, setIsFocused] = useState(false);
  const [labelTop, setLabelTop] = useState(false);

  // Event handler for handling blur event
  const handleBlur = (e) => {
    const { onBlur } = props;
    setLabelTop(!!e.target.value);
    if (typeof onBlur === "function") {
      onBlur(e);
    }
    setIsFocused(false);
  };

  // Event handler for handling focus event
  const handleFocus = (e) => {
    setIsFocused(true);
    setLabelTop(true || e.target.value);
  };

  // Event handler for handling keyDown event
  const handleInputKeyDown = (e) => {
    if (disableSymbols) {
      [...symbols].includes(e.key) && e.preventDefault();
    }
    if (disableSpace) {
      e.which === 32 && e.preventDefault();
    }
    if (disableNumbers) {
      [...numbers].includes(e.key) && e.preventDefault();
    }
    if (disableAlphabets) {
      [...alphabets].includes(e.key) && e.preventDefault();
    }
    if (disablePasswordSymbols) {
      [...symbolPassCode].includes(e.key) && e.preventDefault();
    }
  };

  return (
    <div
      className={`
        ${styles.formField} 
        ${isFocused && styles.focus} 
        ${error && !isFocused && styles.error}
        ${className}`}
    >
      {label && (
        <label
          className={`${styles.label}
            ${labelTop ? styles.isLabelTop : styles.initialLabel}
           `}
          htmlFor={id}
        >
          <div className={styles.preLabel}>
            {!labelTop && <span className={styles.httpText}>{httpText}</span>}
            {!labelTop && <span className={styles.initialVbar} />}
            <span
              className={`${styles.text} ${!labelTop && styles.initialText}`}
            >
              {label}
            </span>
          </div>
        </label>
      )}
      <div className={styles.focusContainer}>
        <span className={styles.httpText}>{inputBeforeText}</span>
        <span className={styles.focusVbar} />
        <Input
          {...props}
          id={id}
          className={styles.inputContainer}
          ref={innerRef}
          placeHolder={label}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleInputKeyDown}
          maxLength={maxLength}
        />
      </div>
      <span className={styles.errorText}>{error}</span>
    </div>
  );
};

export default PreFormField;
