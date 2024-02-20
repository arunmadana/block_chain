import { motion } from 'framer-motion';
import React from 'react';
import './PasswordStrength.style.scss';
import styles from './PasswordStrength.module.scss';

export default function PasswordStrength({
  password,
  children,
  leftAlign,
  whiteBG = false
}) {
  const hasMinimumLength = password.length >= 8;
  const hasNumber = password.match(/(?=.*\d)/);
  const hasLowercaseLetter = password.match(/(?=.*[a-z])/);
  const hasUppercaseLetter = password.match(/(?=.*[A-Z])/);
  const hasSpecialCharacter = password.match(/^(?=.*[@$!%*#?&])/);
  return (
    <div
      className={`${
        whiteBG
          ? 'password-strength-wrapper-white'
          : 'password-strength-wrapper'
      }`}
    >
      {children}
      <div
        className={`${
          leftAlign
            ? 'password-strength-container'
            : 'password-strength-container-right'
        }`}
      >
        <div
          className={`${
            leftAlign
              ? 'password-strength-outer-triangle'
              : 'password-strength-outer-triangle-right'
          }`}
        />
        <div className="text-container">
          <p className="message">Password Requirements:</p>
          <span className="criteria">
            <ValidationIcon valid={hasMinimumLength} />8 minimum characters
          </span>
          <span className="criteria">
            <ValidationIcon valid={hasUppercaseLetter} />1 uppercase letter
            (A-Z)
          </span>
          <span className="criteria">
            <ValidationIcon valid={hasLowercaseLetter} />1 lowercase letter
            (a-z)
          </span>
          <span className="criteria">
            <ValidationIcon valid={hasSpecialCharacter} />1 special character
            (@, #, $...)
          </span>
          <span className="criteria">
            <ValidationIcon valid={hasNumber} />1 number (0-9)
          </span>
        </div>
      </div>
    </div>
  );
}

export function PasswordValidator({
  password,
  children,
}) {
  const hasMinimumLength = password.length >= 8;
  const hasNumber = password.match(/(?=.*\d)/);
  const hasLowercaseLetter = password.match(/(?=.*[a-z])/);
  const hasUppercaseLetter = password.match(/(?=.*[A-Z])/);
  const hasSpecialCharacter = password.match(/^(?=.*[@$!%*#?&])/);
  return (
    <div className={`${styles.validator_password_container}`}>
      {children}

      <div className="flex flex-col">
        <p className="mb-px ml-1 text-sm font-bold text-cbc1">
          Password Requirements:
        </p>
        <span className={`${styles.password_criteria}`}>
          <ValidationIcon valid={hasUppercaseLetter} />1 uppercase letter (A-Z)
        </span>
        <span className={`${styles.password_criteria}`}>
          <ValidationIcon valid={hasLowercaseLetter} />1 lowercase letter (a-z)
        </span>
        <span className={`${styles.password_criteria}`}>
          <ValidationIcon valid={hasMinimumLength} />8 -12 total characters
        </span>
        <span className={`${styles.password_criteria}`}>
          <ValidationIcon valid={hasSpecialCharacter} />1 special character (@,
          #, $...)
        </span>
        <span className={`${styles.password_criteria}`}>
          <ValidationIcon valid={hasNumber} />1 number (0-9)
        </span>
        <span className="ml-1 text-xs font-semibold text-cbc1">
          You cannot resuse a password.
        </span>
      </div>
    </div>
  );
}

const ValidationIcon = (props) => {
  return props.valid ? (
    <motion.span
      variants={passwordAnimation}
      initial="hiddenInPlace"
      animate="fadeIn"
      exit="hiddenInPlace"
      transition="slow"
      className={'green-dot'}
    />
  ) : (
    <span className={'red-dot'} />
  );
};

const passwordAnimation = {
  hiddenInPlace: { opacity: 0, scale: 0 },
  fadeIn: { opacity: 1, scale: 1 },
  show: { opacity: 1, y: 0 },
  hidden: { opacity: 0, y: 100 }
};
