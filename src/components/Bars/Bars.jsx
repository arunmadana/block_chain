import React from 'react';
import styles from './Bars.module.scss';
import PropTypes from 'prop-types';

export function HBar({ className = '' }) {
  return <div className={`${styles.h_bar} ${className}`}></div>;
}

HBar.propTypes = {
  className: PropTypes.string
};

export function VBar({ className = '' }) {
  return <div className={`${styles.v_bar} ${className}`}></div>;
}

VBar.propTypes = {
  className: PropTypes.string
};

export function RBar({ className = '' }) {
  return <div className={`${styles.r_bar} ${className}`}></div>;
}

RBar.propTypes = {
  className: PropTypes.string
};
