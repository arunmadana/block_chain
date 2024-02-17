import React from 'react';
import PropTypes from 'prop-types';
import styles from './Input.module.scss';

export const Input = React.forwardRef(
  ({ className = '', chargeBackText = false, ...props }, ref) => {
    return (
      <input
        data-testid="inputLabel"
        className={`${
          chargeBackText ? styles.form_chargeBack : styles.form_input
        } ${className} ${
          props.id === 'stateProvince' || props.id === 'zipPostalCode'
            ? styles.form_input_small
            : styles.form_input_normal
        }`}
        autoComplete="off"
        {...props}
        ref={ref}
      />
    );
  }
);

Input.displayName = 'Input';
Input.propTypes = {
  error: PropTypes.bool,
  className: PropTypes.string,
  chargeBackText: PropTypes.bool
};
