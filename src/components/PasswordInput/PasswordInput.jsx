import React, { useEffect, useState } from "react";
import style from "./PasswordInput.module.scss";
import { FormField } from "../FormField/FormField";

const PasswordInput = ({
  isLoading,
  inputClassName,
  error,
  success,
  label,
  placeholder,
  isPattern = false,
  inputPattern,
  isIconEnable = true,
  isSuccess = false,
  iconClassName = "",
  value,
  className,
  inputStyles,
  ...props
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [formattedValue, setFormattedValue] = useState("");
  const [isHover, setIsHover] = useState(false);

  const applyPattern = (inputValue, inputPattern) => {
    const numericInput = inputValue?.replace(/\D/g, "");
    if (inputPattern === "###-##-####") {
      const match = numericInput?.match(/^(\d{0,3})(\d{0,2})(\d{0,4})$/);
      if (match) {
        const formattedInput = match?.slice(1, 4).filter(Boolean).join("-");
        return formattedInput;
      }
    } else if (inputPattern === "##-#######") {
      const match = numericInput?.match(/^(\d{0,2})(\d{0,7})$/);
      if (match) {
        const formattedInput = match?.slice(1, 3).filter(Boolean).join("-");
        return formattedInput;
      }
    }

    return inputValue;
  };
  // Commented the code for future refernce
  // const handleChange = (event) => {
  //   const { onChange } = props;
  //   const inputValue = event.target.value;
  //   let formattedInput = inputValue;
  //   if (!isPasswordVisible.type === 'password') {
  //     // Mask the password input with asterisks, but keep it in a state variable
  //     setFormattedValue(inputValue);
  //   } else {
  //     // Apply your regular pattern logic for other input types
  //     formattedInput = applyPattern(inputValue, inputPattern);
  //     setFormattedValue(formattedInput);
  //   }
  //   onChange(event);
  // };

  useEffect(() => {
    const inputValue = applyPattern(value, inputPattern);
    setFormattedValue(inputValue);
  }, [value, inputPattern]);
  return (
    <div className={`${style.login_password_input}`}>
      {isPattern ? (
        <FormField
          disabled={isLoading}
          placeholder={placeholder}
          innerIcon
          className={`${inputClassName} ${isSuccess && `border-cgn11`}  ${
            isHover && `${style.hovered_color}`
          } ${className}`}
          error={error}
          isSuccess={isSuccess}
          success={isSuccess && success}
          {...props}
          type={isPasswordVisible ? "text" : "password"}
          label={label}
          isPaste={false}
          value={formattedValue}
          isCopy={false}
          // onChange={handleChange}
          // value={formattedValue}
          isCut={false}
        />
      ) : (
        <FormField
          disabled={isLoading}
          placeholder={placeholder}
          innerIcon
          className={`${inputClassName} ${isSuccess && `border-cgn11`}  ${
            isHover && `${style.hovered_color}`
          }`}
          error={error}
          isSuccess={isSuccess}
          success={isSuccess && success}
          {...props}
          type={isPasswordVisible ? "text" : "password"}
          label={label}
          isPaste={false}
          isCopy={false}
          isCut={false}
          value={value}
          inputStyles={inputStyles}
        />
      )}
      {isIconEnable && (
        <button
          type="button"
          onMouseEnter={() => setIsHover(true)}
          onMouseLeave={() => setIsHover(false)}
          onClick={() => setIsPasswordVisible(!isPasswordVisible)}
          className={`${style.view_password} ${iconClassName}${
            isPasswordVisible ? "icon-eye-open" : "icon-eye-hide"
          }`}
        >
          {!isPasswordVisible && (
            <>
              <span className="path1"></span>
              <span className="path2"></span>
              <span className="path3"></span>
            </>
          )}
        </button>
      )}
    </div>
  );
};

export default PasswordInput;
