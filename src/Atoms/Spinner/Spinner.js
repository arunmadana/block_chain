/* eslint-disable react/prop-types */
import PropTypes from 'prop-types';
import './Spinner.style.scss';

export default function Spinner({
  color,
  yellow,
  className,
  style,
  width,
  height,
  size,
  forIpAddress = false,
  forBlockApi = true,
  ...props
}) {
  return (
    <div
      className="loading-container"
      style={{ width: width || size, height: height || size }}
    >
      {(color || yellow) && (
        <span
          className={`icon-loading loading loading--color ${className}`}
          style={{
            ...style,
            fontSize: size + 24
          }}
          {...props}
        />
      )}

      {forIpAddress && (
        <span
          className={`icon-loading loading loading--gray  ${className}`}
          style={{ ...style, fontSize: size }}
          {...props}
        />
      )}
      {forBlockApi && (
        <span
          className={`icon-loading loading loading--blue ${className}`}
          style={{ ...style, fontSize: size }}
          {...props}
        />
      )}
    </div>
  );
}

Spinner.protoTypes = {
  color: PropTypes.bool,
  yellow: PropTypes.bool,
  className: PropTypes.string,
  style: PropTypes.object,
  width: PropTypes.number,
  height: PropTypes.number,
  size: PropTypes.number,
  forBlockApi: PropTypes.bool
};

Spinner.defaultProps = {
  size: 52
};
