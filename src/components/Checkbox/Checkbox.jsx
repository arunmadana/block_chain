import React from "react";
import "./Checkbox.style.scss";

/**
 *How to use Checkbox component
 *1.In parent component we have to  call this child component
 *2.We can pass the label name prop to show the label of checkbox
 *3.We can pass the specific styles to the label by passing labelClassName prop
 *4.We can disable the checkbox by passing disabled prop
 *5.We can track the which checkbox is checked by using onChange functionality if we have multiple checkboxes
 */

export const Checkbox = React.forwardRef(
  (
    {
      children,
      className = "",
      inputClassName = "",
      label = "",
      labelClassName = "",
      greenBox,
      onChange,
      checked,
      disabled,
      id,
      ...props
    },
    ref
  ) => {
    return (
      <label
        className={`custom-checkbox ${
          greenBox && !disabled ? "green-checkbox" : ""
        } ${disabled ? "disabled" : ""} ${className}`}
        htmlFor={id}
      >
        <input
          type="checkbox"
          ref={ref}
          className={inputClassName}
          onChange={onChange}
          checked={checked}
          disabled={disabled}
          {...props}
        />
        {label && !children && (
          <span
            className={`text-cgy2 text-sm ml-1.5 ${
              disabled ? "disabled" : ""
            } ${labelClassName}`}
          >
            {label}
          </span>
        )}
        {children}
      </label>
    );
  }
);
Checkbox.displayName = "Checkbox";

export const FilterCheckbox = ({
  children,
  className,
  inputClassName,
  label,
  onChange,
  value,
  checked,
  ...props
}) => {
  return (
    <>
      <label
        className={`custom-filter-checkbox gap-2 flex mb-0  ${
          props.disabled ? "disabled" : ""
        } ${className}  relative justify-around`}
        htmlFor={props.id}
      >
        <input
          {...props}
          type="checkbox"
          className={`appearance-none  px-[2px] w-[17px] h-[17px] rounded-[5px] bg-cwhite cursor-pointer outline-none border-[1px] border-cgy2`}
          value={value}
          onChange={onChange}
          checked={checked}
        />
        {label && !children && (
          <span
            className={`text-xs texts ${
              props.disabled ? "disabled" : ""
            } relative`}
          >
            {label}
          </span>
        )}
      </label>
    </>
  );
};

export const MultiSelectCheckbox = ({
  id,
  className,
  inputClassName,
  onChange,
  checked,
  value,
  disabled,
  ...props
}) => {
  const handleChange = (e) => {
    onChange(e, value);
  };

  return (
    <>
      <div
        className={`multiselect-filter-checkbox flex mb-0  ${
          disabled ? "disabled" : ""
        } ${className}  relative justify-around `}
      >
        <input
          {...props}
          type="checkbox"
          className={inputClassName}
          value={value}
          onChange={(e) => handleChange(e)}
          checked={checked}
          id={id}
        />
      </div>
    </>
  );
};
