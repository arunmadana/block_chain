import "./Buttons.style.scss";

export const AddingButton = ({
  id = "",
  label = "",
  children,
  className = "",
  disable = false,
  type = "button",
  icon,
  size,
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
