import { useEffect, useRef, useState } from "react";
import { PatternFormat } from "react-number-format";
import { useOutsideClick } from "../../Hooks/useOutsideClick";
import {
  alphabets,
  numbers,
  symbolPassCode,
  symbols,
} from "../../Schemas/keyboard-keys";
import checkMarkIcon from "../../assets/check-mark.svg";
import { Input } from "../Input/Input";
import styles from "./FormField.module.scss";

export function FormField({
  id = "",
  label = "",
  optional = "",
  message = "",
  error = "",
  showCharCount = true,
  smallText = false,
  isCapitalize = false,
  disableNumbers = false,
  disableAlphabets = false,
  disableSymbols = false,
  disableSpace = false,
  disablePasswordSymbols = false,
  success = "",
  unit = "",
  children,
  locked = false,
  className = "",
  errorClassName = "",
  innerIcon = false,
  withIcon,
  disabled = false,
  innerRef,
  maxLength = false,
  placeholder,
  parentComponent,
  lableOpen = false,
  enableComa = false,
  enableDot = false,
  chargeBack = false,
  textRight = false,
  isSemibold = false,
  textColor = "",
  permissionForm = false,
  isPaste = true,
  isCopy = true,
  isCut = true,
  isLabelTop = false,
  isSuccess = true,
  chargeBackText,
  labelClass = "",
  inputStyles = "",
  ...props
}) {
  const [isFocused, setIsFocused] = useState(false);
  const [labelTop, setLabelTop] = useState(false);

  const handleBlur = (e) => {
    setIsFocused(false);
    setLabelTop(!!e.target.value);
    const { onBlur } = props;
    if (typeof onBlur === "function") {
      onBlur(e);
    }
  };

  const handleFocus = (e) => {
    setIsFocused(true);
    setLabelTop(true);
  };

  const handleInputKeyDown = (e) => {
    if (disableSymbols) {
      if (enableComa) {
        const s = [...symbols];
        const i = s.indexOf(",");
        if (i > -1) {
          s.splice(i, 1);
        }
        [...s].includes(e.key) && e.preventDefault();
      }
      // return;
      //  }else{
      //   [...symbols].includes(e.key) && e.preventDefault();
      // }
      else if (enableDot) {
        const D = [...symbols];
        const O = D.indexOf(".");
        if (O > -1) {
          D.splice(O, 1);
        }
        [...D].includes(e.key) && e.preventDefault();
      } else {
        [...symbols].includes(e.key) && e.preventDefault();
      }
    }
    //  if (disableSymbols)
    // if (enableDot) {
    //   const D = [...symbols];
    //   const O = D.indexOf('.');
    //   if (O > -1) {
    //     D.splice(O, 1);
    //   }
    //   [...D].includes(e.key) && e.preventDefault();
    // } else {
    //   [...symbols].includes(e.key) && e.preventDefault();
    // }

    if (disableSpace) {
      e.which === 32 && e.preventDefault();
    }
    if (disableNumbers) {
      [...numbers].includes(e.key) && e.preventDefault();
    }
    if (disableAlphabets) {
      [...alphabets].includes(e.key) && e.preventDefault();
    }
    if (disablePasswordSymbols) {
      [...symbolPassCode].includes(e.key) && e.preventDefault();
    }
  };

  const { value } = props;
  useEffect(() => {
    setLabelTop(isFocused ? isFocused : !!value);
  }, [props]);

  const handleOnPaste = (e) => {
    if (!isPaste) {
      e.preventDefault();
      return false;
    }
  };

  const handleOnCopy = (e) => {
    if (!isCopy) {
      e.preventDefault();
      return false;
    }
  };

  const handleOnCut = (e) => {
    if (!isCut) {
      e.preventDefault();
      return false;
    }
  };

  return (
    <div
      className={`${
        parentComponent == "ApiBusiness" ? styles.form_field_business : ""
      }
        ${styles.form_field} 
        ${isFocused && styles.focus} 
        ${error && styles.error} 
        ${disabled && styles.disabled}
        ${success && styles.successMessage}
        ${className}`}
    >
      {label && (
        <label
          className={`px-[5px] -ml-[4px] text-cgy3 bg-cwhite absolute left-3 transform transition-all duration-100 ease-in
            ${
              (permissionForm && labelTop) || isLabelTop
                ? `-top-2 ${styles.textErrorTopLabel} pl-[5px] text-cgy4`
                : labelTop
                ? `-top-1.5 text-cgy4 ${styles.textErrorTopLabel}`
                : chargeBack
                ? "top-1.5 text-sm text-cgy4"
                : `top-1/4 ${
                    smallText ? "text-[11px]" : "text-sm"
                  } pl-[3px] pr-[5px] text-cgy3`
            }
            ${value?.length > 0 && "!text-cgy26"}
            ${
              disabled
                ? "text-cgy2 pointer-events-none"
                : labelTop && !lableOpen && parentComponent == "ApiBusiness"
                ? "text-cm3"
                : labelTop && !lableOpen && parentComponent !== "ApiBusiness"
                ? `${styles.textColor}`
                : labelTop && lableOpen
                ? "text-cm3"
                : `text-cgy3 ${labelClass}`
            }
            `}
          htmlFor={id}
        >
          {label == "Enter Role Name" && labelTop ? "Role Name" : label}
          {optional && (
            <span
              className={`ml-2 text-xs   ${
                disabled ? "text-cgy2 pointer-events-none" : "text-cgy4"
              }`}
            >
              {optional}
            </span>
          )}
        </label>
      )}
      {lableOpen ? (
        <div className={`flex items-center pt-3`}>
          <Input
            {...props}
            id={id}
            className={`${isCapitalize && styles.input} ${
              textRight && `text-right`
            } ${textColor}`}
            disabled={disabled}
            ref={innerRef}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onKeyDown={handleInputKeyDown}
            maxLength={maxLength}
            onCopy={handleOnCopy}
            onPaste={handleOnPaste}
            onCut={handleOnCut}
            placeholder={(labelTop || isLabelTop) && placeholder}
          />
          <span className={`-ml-5`}>{children}</span>
        </div>
      ) : (
        <Input
          {...props}
          placeholder={(labelTop || isLabelTop) && placeholder}
          id={id}
          className={`${isCapitalize && styles.input} ${
            textRight && `text-right `
          }  ${isSemibold && `font-semibold`}${textColor} ${inputStyles}`}
          disabled={disabled}
          ref={innerRef}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onCopy={handleOnCopy}
          onPaste={handleOnPaste}
          onKeyDown={handleInputKeyDown}
          maxLength={maxLength}
          chargeBackText={chargeBackText}
        />
      )}
      <span
        className={`
        ${
          styles.textErrorTopLabel
        } absolute left-3 -bottom-4 truncate font-semibold
        ${error && "text-crd5"} ${errorClassName}`}
      >
        {error || message}
      </span>
      {isSuccess && (
        <span
          className={`absolute left-3 -bottom-4 truncate font-semibold -ml-[11px] ${styles.successMessage}`}
        >
          {success}
        </span>
      )}
    </div>
  );
}

export function FormTextArea({
  id,
  className,
  hoverStyle = false,
  label,
  value,
  error,
  showCharCount = true,
  businessResonModal = false,
  reasonModal = false,
  disabled = false,
  isCapitalize = false,
  caseDetails = false,
  underwritingCustomTask = false,
  underwritingCaseDetails = false,
  disableNumbers = false,
  disableAlphabets = false,
  disableSymbols = false,
  charLimit,
  isOpen = false,
  isUpdateStatus = false,
  arrowOpen,
  handleArrow,
  isBold = false,
  isNormal = false,
  dispute = false,
  placeHolder,
  textClassname = "",
  errorClassName = "",
  borderAlign = "",
  isItalic = true,
  disableLabelTop = false,
  ...rest
}) {
  const [isFocused, setIsFocused] = useState(false);
  const [labelTop, setLabelTop] = useState(false);
  const [charCount, setCharCount] = useState(0);
  // const [isOpen, setIsOpen] = useState(false);

  const handleBlur = (e) => {
    setIsFocused(false);
    setLabelTop(!!e.target.value);
    const { onBlur } = rest;
    if (typeof onBlur === "function") {
      onBlur(e);
    }
  };

  const handleFocus = (e) => {
    setIsFocused(true);
    setLabelTop(true);
  };

  const handleChange = (e) => {
    const msgLength = e.target.value.length;
    if (msgLength > charLimit) return;
    const { onChange } = rest;
    if (
      typeof onChange === "function" &&
      !(e.target.value === " " && e.target.value.length === 1)
    ) {
      onChange(e);
    }
  };

  const handleKeyDown = (e) => {
    if (disableSymbols) {
      [...symbols].includes(e.key) && e.preventDefault();
    }
    if (disableNumbers) {
      [...numbers].includes(e.key) && e.preventDefault();
    }
    if (disableAlphabets) {
      [...alphabets].includes(e.key) && e.preventDefault();
    }
  };

  // const handleArrow = () => {
  //   setIsOpen(!isOpen);
  //   arrowOpen(isOpen);
  // }

  useEffect(() => {
    setLabelTop(isFocused ? isFocused : !!value);
    if (value) {
      setCharCount(`${value}`.length);
    } else if (value == " ") {
      setCharCount(0);
    } else {
      setCharCount(0);
    }
  }, [value]);

  return (
    <div className={`relative ${styles.textarea_wrap} ${className}`}>
      {label && (
        <label
          className={`px-1 -ml-1 bg-cwhite absolute left-3 transform transition-all duration-100 ease-in 
            ${
              labelTop && !caseDetails
                ? `-top-1.5 ${styles.textErrorTopLabel}`
                : "top-2 text-sm"
            }
            ${
              (labelTop && caseDetails && `visibility: hidden`) ||
              (labelTop && underwritingCaseDetails && `visibility: hidden`) ||
              (labelTop && underwritingCustomTask && `visibility: hidden`) ||
              (labelTop && isUpdateStatus && `visibility: hidden`)
            } ${
            disabled
              ? "text-cgy2 pointer-events-none"
              : labelTop
              ? "text-cgy4"
              : "text-cgy3"
          }`}
          htmlFor={id}
        >
          {label}
        </label>
      )}
      <textarea
        {...rest}
        id={id}
        value={value}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        onChange={handleChange}
        className={
          caseDetails
            ? `${styles.form_caseDetails}
        ${
          isFocused && caseDetails
            ? styles.caseFocus
            : isFocused && styles.focus
        } 
        ${error && styles.error}
        ${disabled && styles.disabled}`
            : underwritingCaseDetails
            ? `${styles.form_underWritingCaseDetails}${borderAlign}
        ${isFocused && styles.focus}
        ${error && styles.error}
        ${disabled && styles.disabled}`
            : underwritingCustomTask
            ? `${styles.form_underWritingCustomTask}
        ${error && styles.error}
        ${disabled && styles.disabled}`
            : // ${isFocused && styles.focus}

            reasonModal
            ? `${styles.reason_box_style}`
            : businessResonModal
            ? `${styles.business_reson_modal}`
            : isUpdateStatus
            ? `${styles.is_update_status}`
            : `${styles.form_textarea} 

        ${isFocused && styles.focus} 
        ${error && styles.error} 
        ${isCapitalize && styles.input}
        ${disabled && styles.disabled}
         ${isNormal && styles.text_normal}
         ${isBold && styles.text_bold} ${textClassname} ${
                isItalic && styles.text_italic
              }`
        }
        placeholder={(labelTop || disableLabelTop) && placeHolder}
      ></textarea>
      {charLimit &&
        (caseDetails ? (
          <div className={`flex flex-row justify-between`}>
            {showCharCount ? (
              <span
                className={`absolute pb-2 pr-2 text-cgy2  ${
                  caseDetails ? " bottom-0 left-2" : "bottom-0 right-0"
                } ${styles.textErrorTopLabel}`}
              >
                {charCount} / {charLimit}
              </span>
            ) : null}
            <div
              onClick={() => handleArrow()}
              className={`${
                !isOpen ? styles.downArrowIcon : styles.whiteArrowIcon
              } ${
                isOpen && `hover:bg-cm4`
              } absolute bottom-2 right-2 flex flex-row justify-center items-center cursor-pointer `}
            >
              <div
                className={`icon-small-arrow1 text-xs mt-0.5 fill-current ${
                  isOpen ? "text-cwhite" : "text-cgy2"
                } ${
                  isOpen && dispute === false
                    ? styles.upArrow
                    : styles.downArrow
                } ${dispute === true && styles.upArrow}`}
              />
            </div>
          </div>
        ) : underwritingCaseDetails || underwritingCustomTask ? null : (
          <span
            className={`absolute pb-4 pr-5 text-cgy2  ${
              caseDetails ? " bottom-0 left-4" : "bottom-0 right-0"
            } ${styles.textErrorTopLabel}`}
          >
            {charCount} / {charLimit}
          </span>
        ))}
      <span
        className={`
        ${styles.textErrorTopLabel} absolute left-3 -bottom-3.5 truncate
        ${error && "text-crd5 font-semibold"} ${errorClassName}`}
      >
        {error}
      </span>
    </div>
  );
}

export function FormSelect({
  label,
  status,
  className,
  optional,
  message,
  noBorder = false,
  error,
  disabled,
  chargeBack = false,
  value = {},
  options = [
    { value: "Option 1", label: "Option 1" },
    { value: "Option 2", label: "Option 2" },
    { value: "Option 3", label: "Option 3" },
  ],
  boolBoldValue = false,
  onHoverOptions = false,
  onChange = () => {},
  onBlur = () => {},
  touched = () => {},
  searchOption = false,
  showSearchIcon = false,
  textSmall,
  searchPlaceholder = "",
  isBusinessEntity = false,
  formSearchAlign = false,
  ...props
}) {
  const [isActive, setIsActive] = useState(false);
  const [selectedOption, setSelectedOption] = useState({});
  const [filterValue, setFilterValue] = useState("");
  const [filteredList, setFilteredList] = useState([]);

  const handleFilterChange = (e) => {
    setFilterValue(e.target.value);
    const filteredOptions = options.filter((item) =>
      item.label.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFilteredList(filteredOptions);
  };

  const textEllipsis = (text, length) => {
    if (!text) return "";
    if (text.length <= length) return text;
    return `${text.slice(0, length)}`;
  };

  const selectRef = useRef(null);
  useOutsideClick(selectRef, () => {
    setIsActive(false);
  });

  const handleOptionSelect = (option) => {
    setIsActive(false);
    if (typeof onChange == "function") {
      onChange(option);
    } else {
      setSelectedOption(option);
    }
  };

  useEffect(() => {
    setFilteredList(options);
    setSelectedOption(value?.value === null ? "" : value);
    if (!isActive) {
      setFilterValue("");
    }
  }, [isActive]);

  const handleBlur = () => {
    onBlur();
  };

  useEffect(() => {
    const data =
      Object?.keys(value)?.length === 0 || value?.value === null ? "" : value;
    setSelectedOption(data);
  }, [value]);

  return (
    <div
      className={`${
        chargeBack
          ? styles.form_select_chargeBack
          : styles.form_select_container
      } ${isActive && "z-[2]"} ${isBusinessEntity && "mb-3"}`}
      ref={selectRef}
    >
      <div
        chargeBack
        className={`group ${
          chargeBack && isActive
            ? styles.form_select_charge_Active
            : chargeBack
            ? styles.form_select_charge
            : `${styles.formSelect} ${isActive && `!shadow-lg`} ${
                isActive && formSearchAlign && `max-h-[220px]`
              }`
        }
        ${isActive && styles.focus}
        ${error && !isActive && styles.error}
        ${disabled && styles.disabled}`}
        tabIndex="0"
        onBlur={handleBlur}
      >
        <div
          className={`px-1 bg-cwhite absolute left-3 transform transition-all duration-100 ease-in ${
            chargeBack && isActive
              ? "top-2.5 text-sm"
              : chargeBack
              ? "top-2 text-sm "
              : selectedOption && (chargeBack || noBorder)
              ? "visibility: hidden"
              : selectedOption
              ? `-top-2 !left-5 ${styles.textErrorTopLabel}`
              : "top-2.5 text-sm"
          } ${
            disabled
              ? "text-cgy2 pointer-events-none"
              : selectedOption
              ? `${styles.textColor}`
              : "text-cgy3 cursor-pointer"
          }`}
          onClick={() => {
            setIsActive(!isActive);
          }}
        >
          {label == "Choose from dropdown" && selectedOption ? "Reason" : label}
        </div>
        <div
          className={`${
            isActive
              ? noBorder
                ? styles.selected_option_no_border
                : styles.selected_option_border
              : styles.selected_option
          } ${
            disabled
              ? "text-cgy2 pointer-events-none"
              : "text-cgy4 cursor-pointer"
          }`}
          onClick={() => {
            setIsActive(!isActive);
            touched();
          }}
        >
          {chargeBack && selectedOption ? (
            <span className={`${styles.selected_option_charge} -mt-1.5`}>
              <span className="mr-1.5 font-bold text-cgy4">
                {selectedOption?.bold}
              </span>
              {textEllipsis(selectedOption?.label, 37)}
            </span>
          ) : (
            selectedOption?.label || (noBorder ? label : "")
          )}
        </div>
        {!disabled && (
          <p
            className={`absolute cursor-pointer transform text-cgy3 group-hover:text-cm3 text-[7px] ${
              chargeBack ? "top-2.5" : "top-4"
            }  right-3 ${styles.tranasition}
             ${
               isActive
                 ? `icon-small-arrow1 -rotate-180 ${
                     searchOption && selectedOption && "text-cgy26"
                   }`
                 : `icon-small-arrow1 ${
                     searchOption && selectedOption && isActive && "text-cgy26"
                   }`
             }
              ${
                isActive &&
                noBorder &&
                "rotate-[270deg] transition-all ease-in duration-300"
              }`}
            onClick={() => {
              setIsActive(!isActive);
            }}
          />
        )}
        {searchOption ? (
          <>
            {isActive && (
              <>
                <div>
                  <div
                    className={`border-y-[1px] border-cgy2 h-[43px] py-3 flex justify-between items-center mb-1`}
                  >
                    <Input
                      value={filterValue}
                      autoFocus={true}
                      onChange={(e) => handleFilterChange(e)}
                      className={`w-full h-[19px] font-normal ${styles.searchInput}`}
                      placeholder={searchPlaceholder}
                    />

                    {showSearchIcon && (
                      <div className="text-[13px] icon-search text-cgy3" />
                    )}
                  </div>
                  <div
                    className={`${styles.options_wrap} ${
                      isActive && formSearchAlign && "max-h-[120px]"
                    } ${styles.scroll_Bar} ${className}`}
                  >
                    {filteredList.length > 0 ? (
                      filteredList.map((x, i) => (
                        <div
                          data-={x.label}
                          key={i}
                          className={`flex items-center justify-between pr-3 cursor-pointer font-semibold text-cgy3 hover:text-cm3 ${
                            textSmall ? "text-xs" : "text-sm"
                          } ${
                            selectedOption?.value === x?.value && "text-cm3"
                          }`}
                          onClick={() => handleOptionSelect(x)}
                        >
                          {x?.label}

                          {selectedOption?.value === x?.value && (
                            <div className="icon-tick h-2.5 w-[15px] text-cm3" />
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="flex items-center justify-center h-[70px]">
                        <p className={styles.noSearchResult}>
                          Search results not found
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="w-full h-4 opacity-0"></div>
                </div>
              </>
            )}
          </>
        ) : (
          <>
            {isActive && (
              <>
                <div
                  className={`${
                    chargeBack
                      ? styles.options_wrap_charge
                      : styles.options_wrap
                  } ${className} `}
                >
                  {options.map((x, i) => (
                    <div
                      data-={x.label}
                      key={i}
                      className={`flex items-center justify-between pr-[3px] cursor-pointer font-semibold text-cgy3 hover:text-cm3 text-xs ${
                        selectedOption?.value === x?.value && "text-cm3"
                      }`}
                      onClick={() => handleOptionSelect(x)}
                    >
                      {x.label}

                      {selectedOption?.value === x?.value && (
                        <div className="icon-tick h-2.5 w-[15px] text-cm3" />
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>
      <span
        className={`
        ${
          styles.textErrorTopLabel
        } mt-2.5 absolute left-3 -bottom-5 text-ellipsis
        ${error && "text-crd5  font-semibold"}`}
      >
        {error || message}
      </span>
    </div>
    // <FormField
    //   label={label}
    //   optional={optional}
    //   message={message}
    //   error={error}
    //   locked={locked}
    // >
    //   <Select {...props} error={Boolean(error)} />
    // </FormField>
  );
}

export const FormMask = ({
  id = "",
  className = "",
  label = "",
  message = "",
  error = "",
  disabled = false,
  PhoneError = "",
  ...rest
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [labelTop, setLabelTop] = useState(false);

  const handleBlur = (e) => {
    setIsFocused(false);
    setLabelTop(!!e.target.value);
    const { onBlur } = rest;
    if (typeof onBlur === "function") {
      onBlur(e);
    }
  };

  const handleFocus = (e) => {
    setIsFocused(true);
    setLabelTop(true);
    const { onFocus } = rest;
    if (typeof onFocus === "function") {
      onFocus(e);
    }
  };

  useEffect(() => {
    const { value } = rest;
    setLabelTop(isFocused ? isFocused : !!value);
  }, [rest?.value]);

  return (
    <div
      className={`
        ${styles.form_field}
        ${isFocused && styles.focus}
        ${error && styles.error}
        ${disabled && styles.disabled}
        ${className}`}
    >
      {label && (
        <label
          className={`px-1 -ml-1 bg-cwhite absolute left-3 transform transition-all duration-100 ease-in
            ${
              labelTop
                ? `-top-1.5  ${styles.textErrorTopLabel}`
                : "top-1/4 text-sm"
            }
            ${disabled ? "text-cgy2" : "text-cgy3"}`}
          htmlFor={id}
        >
          {label}
        </label>
      )}
      <PatternFormat
        {...rest}
        id={id}
        customInput={Input}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className={`${disabled ? "text-cgy2" : "text-cgy4"} font-semibold`}
      />
      <span
        className={`
        ${styles.textErrorTopLabel} absolute left-3 -bottom-3.5 truncate mt-0.5
        ${error && "text-crd5"}
        ${PhoneError ? "font-bold" : "font-semibold"}`}
      >
        {error || message}
      </span>
    </div>

    // <FormField
    //   className={styles.form_mask}
    //   label={label}
    //   optional={optional}
    //   message={message}
    //   error={error}
    //   locked={locked}
    // >
    //   <InputMask
    //     {...props}
    //     className={unit ? 'unit' : ''}
    //     error={Boolean(error)}
    //   />
    //   {unit && <span className="unit-label">{unit}</span>}
    // </FormField>
  );
};

export function FormPhoneWithCode({
  label,
  className,
  id,
  showSearchIcon = true,
  optional = false,
  message,
  error,
  countryCode,
  disabled,
  options = [],
  textSmall = false,
  resetForm = false,
  errorClassName = "",
  onCodeChange,
  selectedCode = "",
  showEditIcon = false,
  ...props
}) {
  const [isActive, setIsActive] = useState(false);
  const [isHover, setIsHover] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [selectedCountryCode, setSelectedCountryCode] = useState("");
  const [phoneNumberFormat, setPhoneNumberFormat] =
    useState("## ####-#########"); // Here By Default we are passing format to the input field
  const [labelTop, setLabelTop] = useState(false);
  const [filterValue, setFilterValue] = useState("");
  const [codeError, setCodeError] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const [filteredList, setFilteredList] = useState([]);
  const selectRef = useRef(null);
  const inputRef = useRef(null);
  const [showDropDown, setShowDropDown] = useState(false);
  const [clickCount, setClickCount] = useState(0);

  // eslint-disable-next-line
  const { value } = props;
  useOutsideClick(selectRef, () => {
    if (showDropDown) {
      if (Object.keys(selectedOption).length === 0 && !optional) {
        setCodeError("Please select Country Code");
      } else {
        setCodeError("");
      }
    } else {
      setIsActive(false);
    }
  });

  const handleOptionSelect = (option) => {
    setSelectedOption(option?.phoneCountryCode);
    setSelectedCountryCode(option?.countryShortCode);
    setIsActive(false);
    setIsHover(false);
    setClickCount(clickCount + 1);
    onCodeChange(option, clickCount);
    setCodeError("");
    if (option?.countryShortCode == "US") {
      setPhoneNumberFormat("(###) ###-####");
    } else {
      setPhoneNumberFormat("## ####-#########");
    }
  };

  const handleFilterChange = (e) => {
    setFilterValue(e.target.value);
    const filteredOptions = options.filter(
      (item) =>
        item.country.toLowerCase().includes(e.target.value.toLowerCase()) ||
        item.phoneCountryCode.includes(e.target.value.toLowerCase())
    );
    setFilteredList(filteredOptions);
  };

  const handleBlur = (e) => {
    setIsFocused(false);
    setLabelTop(e.target.value);
    if (Object.keys(selectedOption).length === 0 && !optional) {
      setCodeError("Please select Country Code");
    } else {
      setCodeError("");
    }
    // eslint-disable-next-line
    const { onBlur } = props;
    if (typeof onBlur === "function") {
      onBlur(e);
    }
  };

  useEffect(() => {
    setFilteredList(options);
  }, [options]);

  useEffect(() => {
    if (!isActive) {
      setFilterValue("");
      setFilteredList(options);
    }
    // eslint-disable-next-line
  }, [isActive]);

  const handleFocus = (e) => {
    setIsFocused(true);
    setLabelTop(true); // eslint-disable-next-line
    const { onFocus } = props;
    if (typeof onFocus === "function") {
      onFocus(e);
    }
  };

  useEffect(() => {
    const { value } = props;
    setLabelTop(isFocused ? isFocused : !!value);
  }, [props]);

  useEffect(() => {
    if (countryCode && !selectedCountryCode) {
      if (countryCode == "US") {
        setPhoneNumberFormat("(###) ###-####");
      } else {
        setPhoneNumberFormat("## ####-#########");
      }
      setSelectedCountryCode(countryCode);
    }
  }, [selectedOption, countryCode]);

  useEffect(() => {
    if (selectedCode) {
      setSelectedOption(selectedCode);
    } else {
      setSelectedOption("");
    }
  }, [selectedCode, resetForm]);

  return (
    <div
      className={`${styles.formSelectContainer} ${
        isActive && "z-[2]"
      } ${className} group`}
    >
      <div
        className={`${styles.formSelect} !pl-0 h-10
        ${
          isFocused && showEditIcon
            ? styles.paymentFocus
            : isFocused && styles.focus
        }
        ${error && styles.error}
        ${disabled && styles.disabled} ${showEditIcon && "hover:border-cm11"}`}
        tabIndex="0"
      >
        {label && (
          <label
            className={` ${
              styles.label
            } px-1 -ml-0.5 bg-cwhite absolute transform transition-all duration-100 ease-in
            ${
              labelTop
                ? ` -top-[9px] left-3 ${styles.textErrorTopLabel}`
                : "top-1/4 left-[83px] text-sm"
            }
            ${
              disabled
                ? "text-cgy2 pointer-events-none"
                : labelTop
                ? "text-cgy4"
                : "text-cgy3"
            }`}
            htmlFor={id}
          >
            {label}
          </label>
        )}
        <div className="flex justify-center">
          <div
            className={`${
              styles.phoneSelectedOption
            } rounded-l-[10px] px-2 hover:bg-cgy22 group font-semibold ${
              disabled ? "text-cgy2 pointer-events-none" : "text-cgy3"
            } ${textSmall ? "text-xs" : "text-sm"} ${isActive && "bg-cgy22"}`}
            onClick={() => {
              setIsActive(!isActive);
              if (isActive) {
                if (Object.keys(selectedOption).length === 0 && !optional) {
                  setCodeError("Please select Country Code");
                } else {
                  setCodeError("");
                }
              }
              setShowDropDown(true);
              //This setTime is mandatory for recognize the outside click previously we are using e.stopPropagation(), so now i changed
              setTimeout(() => {
                setShowDropDown(false);
              }, 200);
            }}
            onMouseEnter={() => setIsHover(true)}
            onMouseLeave={() => setIsHover(false)}
          >
            <div
              className={
                selectedOption?.length > 0 && styles.selectOptionsStyles
              }
            >
              {selectedOption?.length > 0 ? selectedOption : "- -"}
            </div>
            {!disabled && (
              <p
                className={`text-cgy3
                ${
                  isActive
                    ? `icon-small-arrow1 ${styles.openDropDown} ${
                        isActive && "text-cm3"
                      }`
                    : `icon-small-arrow1 ${styles.closedDropDown}`
                }
                ${isHover && "group-hover:text-cm3"}
                `}
                onClick={() => {
                  setIsActive(!isActive);
                }}
              />
            )}
          </div>
          <PatternFormat
            {...props}
            id={id}
            customInput={Input}
            onFocus={handleFocus}
            format={phoneNumberFormat}
            onBlur={handleBlur}
            // eslint-disable-next-line
            placeholder={labelTop && props.placeholder}
            className={`${
              disabled ? "text-cgy2" : "text-cgy4"
            } font-semibold pl-2 py-2.5 ${styles.PhoneWithCode}`}
          />
          {!isFocused && (
            <div
              className={`absolute invisible transform -translate-y-1/2 cursor-pointer text-cm3 icon-edit top-1/2 right-2 ${
                showEditIcon && "group-hover:visible"
              }`}
              onClick={() => inputRef?.current?.focus()}
            ></div>
          )}
        </div>
      </div>

      {isActive && (
        <div
          className={`absolute top-[50px] ${styles.phoneOptionsContainer}`}
          ref={selectRef}
        >
          <div className="border-y-[1px] border-cgy1 h-[43px] py-3 flex justify-between items-center mt-3.5 mb-2">
            <Input
              value={filterValue}
              ref={inputRef}
              autoFocus={true}
              onChange={(e) => handleFilterChange(e)}
              className={`w-full h-[19px] ${styles.searchInput} ${
                filterValue?.length === 0 && "font-normal"
              }`}
              placeholder={"Search Country"}
            />
            {showSearchIcon && (
              <div className="text-[16px] icon-search text-cgy3"></div>
            )}
          </div>
          <div className={`${styles.optionsWraps}`}>
            {filteredList?.length > 0 ? (
              filteredList?.map((x, i) => (
                <div
                  key={i}
                  className={`flex items-center justify-between pr-3 cursor-pointer font-semibold hover:text-cm3 ${
                    selectedCountryCode === x?.countryShortCode
                      ? "text-cm3"
                      : "text-cgy3 hover:text-cgy4"
                  }
                  ${textSmall ? "text-xs" : "text-sm"}`}
                  onClick={() => handleOptionSelect(x)}
                >
                  {x?.country} {x?.phoneCountryCode}
                  {selectedCountryCode === x?.countryShortCode && (
                    <img src={checkMarkIcon} width="15" height="10" />
                  )}
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center h-[70px]">
                <p className={styles.noSearchResult}>
                  Search results not found
                </p>
              </div>
            )}
          </div>
          <div className="w-full h-2 opacity-0"></div>
        </div>
      )}
      {!isActive && (
        <span
          className={`
        ${styles.textErrorTopLabel}   ${
            styles.errorGap
          } absolute truncate ${errorClassName} left-[13px] text-ellipsis font-semibold
        ${(error || codeError) && "text-crd5"}`}
        >
          {error ? error : codeError || message}
        </span>
      )}
    </div>
  );
}

export function TextAreaField({
  id,
  className,
  label,
  value,
  error,
  disabled = false,
  disableNumbers = false,
  disableAlphabets = false,
  disableSymbols = false,
  charLimit = 0,
  placeHolder = "",
  textClassName = "",
  ...rest
}) {
  const [isFocused, setIsFocused] = useState(false);
  const [labelTop, setLabelTop] = useState(false);
  const [charCount, setCharCount] = useState(0);

  const handleBlur = (e) => {
    setIsFocused(false);
    setLabelTop(!!e.target.value);
    const { onBlur } = rest;
    if (typeof onBlur === "function") {
      onBlur(e);
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
    setLabelTop(true);
  };

  const handleChange = (e) => {
    const msgLength = e.target.value.length;
    if (msgLength > charLimit) return;
    const { onChange } = rest;
    if (typeof onChange === "function") {
      onChange(e);
    }
  };

  const handleKeyDown = (e) => {
    if (disableSymbols) {
      [...symbols].includes(e.key) && e.preventDefault();
    }
    if (disableNumbers) {
      [...numbers].includes(e.key) && e.preventDefault();
    }
    if (disableAlphabets) {
      [...alphabets].includes(e.key) && e.preventDefault();
    }
  };

  useEffect(() => {
    setLabelTop(isFocused ? isFocused : !!value);
    if (value) {
      setCharCount(`${value}`.length);
    } else if (value == " ") {
      setCharCount(0);
    } else {
      setCharCount(0);
    }
    // eslint-disable-next-line
  }, [value]);

  return (
    <div className={`${styles.textAreaForm} ${className}`}>
      {label && (
        <label
          className={` ${styles.label}
            ${labelTop ? styles.isLabelTop : styles.isnotLabelTop}
             ${disabled && styles.isDisabled}`}
          htmlFor={id}
        >
          {label}
        </label>
      )}
      <textarea
        {...rest}
        id={id}
        value={value}
        placeholder={
          labelTop && placeHolder ? placeHolder : labelTop ? label : ""
        }
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        onChange={handleChange}
        maxLength={charLimit}
        className={`${styles.textArea} 
        ${textClassName}
        ${error && !isFocused && styles.textAreaError} 
        ${disabled && styles.disabled}
        `}
      />
      {charLimit && (
        <span className={styles.charText}>
          {charCount} / {charLimit}
        </span>
      )}
      <span className={styles.textError}>{error}</span>
    </div>
  );
}
