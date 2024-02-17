import React from 'react';
import styles from './RadioButton.module.scss';

export const RadioButton = ({
  children,
  className = '',
  label = '',
  ...props
}) => {
  const { checked } = props;

  const handleChange = (e) => {
    const { onChange } = props;
    if (typeof onChange === 'function') {
      onChange(e);
    }
  };

  return (
    <label
      className={`${styles.radio_button} ${className}`}
      htmlFor={props?.id}
    >
      <input
        type="radio"
        {...props}
        onChange={handleChange}
        data-testid="radio_input"
      />
      {label && !children && (
        <span
          className={`text-xs font-normal text-cgy3 -ml-[4px]
          ${checked ? 'text-cgy4 !font-semibold' : ''}
          ${props?.disabled ? 'text-cgy2' : ''}`}
        >
          {label}
        </span>
      )}
      {children}
    </label>
  );
};
