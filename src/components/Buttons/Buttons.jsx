import "./Buttons.style.scss";

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

export const PrimaryButtonSmall = ({
  id = '',
  children,
  className,
  label = '',
  disable,
  type = 'button',
  leftImage,
  rightImage,
  isActionButton = false,
  onClick = () => {}
}) => {
  return (
    <button
      id={id}
      data-testid={id}
      type={type}
      className={`h-9 w-[170px] rounded-full font-bold text-center transition-all ease text-base
      ${
        !disable
          ? 'hover:bg-cm4 bg-cm3 text-cwhite'
          : `bg-cwhitesmoke pointer-events-none ${
              isActionButton ? 'text-cgy1' : 'text-cgy2 '
            }`
      } ${className}`}
      onClick={onClick}
    >
      {leftImage && (
        <span
          className={`icon-${leftImage} text-xs mr-2`}
          data-testid="leftImage"
        />
      )}
      {children || label}
      {rightImage && (
        <span
          className={`icon-${rightImage} text-xs ml-3`}
          data-testid="rightImage"
        />
      )}
    </button>
  );
};