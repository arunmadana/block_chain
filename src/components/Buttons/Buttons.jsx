import "./Buttons.style.scss";
import styles from "./Buttons.module.scss";

export const AddingButton = ({
  id = "",
  label = "",
  children,
  className = "",
  disable = false,
  type = "button",
  color = "bg-cm3",
  onClick = () => {},
  disableClassName = "",
}) => {
  return (
    <button
      id={id}
      disabled={disable}
      data-testid={id}
      className={`rounded-lg font-bold text-center transition-all ease ${
        !disable
          ? `${color} hover:${color} text-cwhite`
          : `bg-cwhitesmoke text-cgy12 pointer-events-none ${disableClassName}`
      } ${className}`}
      onClick={onClick}
      type={type}
    >
      {children || label}
    </button>
  );
};

export const CustomButton = ({
  id = "",
  className,
  children,
  icon,
  disable,
  isSelected = false,
  small = false,
  onClick,
  onBlur,
  border = false,
  "ui-auto": ui_auto = "",
  ...props
}) => {
  return (
    <button
      data-testid="customButton"
      className={` text-sm
      ${styles.btn} ${styles.btn__custom_button}  ${
        small ? `${styles.btn__icon__small}` : ""
      } ${isSelected ? `${styles.Active}` : ""} ${className} ${
        border && `${styles.buttonBorder}`
      }`}
      onClick={onClick}
      onBlur={onBlur}
      id={id}
      disabled={disable}
      ui-auto={ui_auto}
      {...props}
    >
      {children}
    </button>
  );
};

export const PrimaryButton = ({
  id = "",
  label = "",
  children,
  className = "",
  disable = false,
  type = "button",
  onClick = () => {},
}) => {
  return (
    <button
      id={id}
      disabled={disable}
      data-testid={id}
      className={`${styles.primaryButton} ${
        !disable ? styles.notDisable : styles.isDisable
      } ${className}`}
      onClick={onClick}
      type={type}
    >
      {children || label}
    </button>
  );
};
