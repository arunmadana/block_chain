import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import './Breadcrumb.style.scss';

export default function Breadcrumb({
  data = [
    { label: 'Bread', url: '/', icon: 'help' },
    { label: 'Crumb', url: '/', icon: 'help' }
  ],
  className,
  handleClick = () => {},
  ...props
}) {
  const breadcrumbItems = data.map((item, index) => {
    if (index < data.length - 1) {
      return (
        <React.Fragment key={index}>
          {item.icon && (
            <span className={`icon-${item.icon} breadcrumb__icon past`} />
          )}
          <Link
            className="breadcrumb--past"
            to={item.url}
            key={index}
            onClick={handleClick}
          >
            {item.label}
          </Link>
          <span className="icon-small-arrow1 breadcrumb--arrow text-cm5" />
        </React.Fragment>
      );
    } else {
      return (
        <React.Fragment key={index}>
          {item.icon && (
            <span className={`icon-${item.icon} breadcrumb__icon`} />
          )}
          <p className="breadcrumb--current" key={index}>
            {item.label}
          </p>
        </React.Fragment>
      );
    }
  });

  return (
    <div {...props} className={`breadcrumb ${className}`}>
      {breadcrumbItems}
    </div>
  );
}

Breadcrumb.propTypes = {
  className: PropTypes.string,
  data: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      url: PropTypes.string,
      icon: PropTypes.oneOfType([PropTypes.string, PropTypes.bool])
    })
  ),
  handleClick: PropTypes.func
};
