import PropTypes from 'prop-types';
import React from 'react';
import styles from './Heading.module.scss';

//H1 represents fontsize of 24px
export const H1 = ({ id = '', title = '', className = '' }) => {
  return (
    <h1
      id={id}
      data-testid={id}
      className={`text-cm3 tracking-normal ${styles.heading1} ${className}`}
    >
      {title}
    </h1>
  );
};

H1.propTypes = {
  id: PropTypes.string,
  title: PropTypes.string,
  className: PropTypes.string
};

//H2 represents fontsize of 20px
export const H2 = ({ id = '', title = '', className = '' }) => {
  return (
    <h2
      id={id}
      data-testid={id}
      className={`text-cgy4 tracking-tight ${styles.heading2} ${className}`}
    >
      {title}
    </h2>
  );
};

H2.propTypes = {
  id: PropTypes.string,
  title: PropTypes.string,
  className: PropTypes.string
};

//H3 represents fontsize of 16px
export const H3 = ({ id = '', title = '', className = '' }) => {
  return (
    <h3
      id={id}
      data-testid={id}
      className={`text-cgy4 tracking-wide ${styles.heading3} ${className}`}
    >
      {title}
    </h3>
  );
};

H3.propTypes = {
  id: PropTypes.string,
  title: PropTypes.string,
  className: PropTypes.string
};

//H4 represents fontsize of 28px
export const H4 = ({ id = '', title = '', className = '' }) => {
  return (
    <h1
      id={id}
      data-testid={id}
      className={`text-cm3 tracking-normal ${styles.heading4} ${className}`}
    >
      {title}
    </h1>
  );
};

H4.propTypes = {
  id: PropTypes.string,
  title: PropTypes.string,
  className: PropTypes.string
};
