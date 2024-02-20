import styles from "./ChipTitle.module.scss";
import PropTypes from "prop-types";

export const ChipTitle = ({ children, className, onClick }: any) => {
  return (
    <div
      data-testid="chipTitle"
      className={`${styles.chip} ${className} ${
        onClick ? styles.pointerCursor : styles.defaultCursor
      }`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

ChipTitle.propTypes = {
  children: PropTypes.node,
  onClick: PropTypes.func,
  className: PropTypes.string,
};
