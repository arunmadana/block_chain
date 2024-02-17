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

// export function FormMultiSelect({
//   className,
//   message,
//   error,
//   disabled,
//   selectedOptions = [],
//   onChange = () => {},
//   onBlur = () => {},
//   options = [
//     { value: 'Option 1', label: 'Option 1' },
//     { value: 'Option 2', label: 'Option 2' },
//     { value: 'Option 3', label: 'Option 3' }
//   ]
// }) {
//   const [isActive, setIsActive] = useState(false);

//   const selectRef = useRef(null);
//   useOutsideClick(selectRef, () => {
//     setIsActive(false);
//   });

//   const handleBlur = () => {
//     onBlur();
//   };

//   return (
//     <div className={`${styles.form_select_container}`} ref={selectRef}>
//       <div
//         className={`${styles.formSelect}
//         ${isActive && styles.focus}
//         ${error && styles.error}
//         ${disabled && styles.disabled}`}
//         onBlur={handleBlur}
//       >
//         <div
//           className={`px-1 bg-cwhite absolute left-3 transform transition-all duration-100 ease-in top-2.5 text-sm${
//             selectedOptions.length > 0
//               ? `-top-1.5 ${styles.textErrorTopLabel}`
//               : 'top-2.5 text-sm'
//           } ${
//             disabled
//               ? 'text-cgy2 pointer-events-none'
//               : selectedOptions.length > 0
//               ? 'text-cgy4'
//               : 'text-cgy3'
//           }`}
//           onClick={() => setIsActive(!isActive)}
//         ></div>
//         <div
//           className={`${
//             isActive ? styles.selected_option_no_border : styles.selected_option
//           } ${disabled ? 'text-cgy2 pointer-events-none' : 'text-cgy4'}`}
//           onClick={() => setIsActive(!isActive)}
//         >
//           {isActive
//             ? `Select Employee(s)`
//             : `Employees Selected (${selectedOptions.length})`}
//         </div>
//         {!disabled && (
//           <img
//             src={isActive ? arrowBlue : arrowGray}
//             width="8"
//             height="8"
//             className={`absolute transform rotate-90 top-3 right-3
//               ${isActive && '-rotate-90'}`}
//             onClick={() => setIsActive(!isActive)}
//           />
//         )}
//         {isActive && (
//           <>
//             <div
//               className={` overflow-y-scroll ${styles.options_wrap} ${className}`}
//             >
//               {options.map((option, i) => (
//                 <div
//                   key={i}
//                   className={`flex items-center justify-between pr-3 cursor-pointer text-cgy3 font-semibold`}
//                 >
//                   <label
//                     className={
//                       selectedOptions.some((x) => x.value === option.value)
//                         ? `text-cm3 font-semibold	cursor-pointer w-[223px] break-all`
//                         : `text-cgy3 font-semibold cursor-pointer w-[223px] break-all`
//                     }
//                     htmlFor={`custom-checkbox-${i}`}
//                   >
//                     {option.label}
//                   </label>
//                   <MultiSelectCheckbox
//                     className="font"
//                     id={`custom-checkbox-${i}`}
//                     value={option}
//                     onChange={(e, value) => onChange(e, value)}
//                     option={option}
//                     checked={selectedOptions.some(
//                       (x) => x.value === option.value
//                     )}
//                   />
//                 </div>
//               ))}
//             </div>
//             <div className="w-full h-2"></div>
//           </>
//         )}
//       </div>
//       <span
//         className={`
//         ${styles.textErrorTopLabel} absolute left-3 -bottom-3.5 text-ellipsis
//         ${error && 'text-crd5'}`}
//       >
//         {error || message}
//       </span>
//     </div>
//   );
// }

// FormMultiSelect.propTypes = {
//   onChange: PropTypes.func,
//   onBlur: PropTypes.func,
//   disabled: PropTypes.bool,
//   checked: PropTypes.bool,
//   className: PropTypes.string,
//   message: PropTypes.string,
//   error: PropTypes.string,
//   options: PropTypes.any,
//   selectedOptions: PropTypes.array
// };

// export function FormFieldPreText({
//   id = '',
//   label = '',
//   error = '',
//   className = '',
//   disabled = false,
//   preText = '',
//   innerRef,
//   ...props
// }) {
//   const [isFocused, setIsFocused] = useState(false);
//   const [labelTop, setLabelTop] = useState(false);

//   const { value } = props;

//   const handleBlur = (e) => {
//     setIsFocused(false);
//     setLabelTop(!!e.target.value);
//     const { onBlur } = props;
//     if (typeof onBlur === 'function') {
//       onBlur(e);
//     }
//   };

//   const handleFocus = (e) => {
//     setIsFocused(true);
//     setLabelTop(true);
//   };

//   useEffect(() => {
//     setLabelTop(isFocused ? isFocused : !!value);
//   }, [value]);

//   return (
//     <div
//       className={`
//         ${styles.form_field}
//         ${isFocused && styles.focus}
//         ${error && styles.error}
//         ${disabled && styles.disabled}
//         flex items-center
//         ${className}`}
//     >
//       {label && (
//         <label
//           className={`px-1 -ml-1 bg-cwhite absolute left-3 transform transition-all duration-100 ease-in
//             ${
//               labelTop
//                 ? `-top-2 ${styles.textErrorTopLabel}`
//                 : 'top-1/4 text-sm'
//             }
//             ${
//               disabled
//                 ? 'text-cgy2 pointer-events-none'
//                 : labelTop
//                 ? 'text-cgy4'
//                 : 'text-cgy3'
//             }`}
//           htmlFor={id}
//         >
//           {label}
//         </label>
//       )}
//       {preText && labelTop && (
//         <span className="text-cgy4 text-sm font-normal inline mr-1.5 relative top-0.5">
//           {preText}
//         </span>
//       )}
//       <Input
//         {...props}
//         id={id}
//         className="inline-block"
//         disabled={disabled}
//         ref={innerRef}
//         onFocus={handleFocus}
//         onBlur={handleBlur}
//       />
//       {error && (
//         <span
//           className={`${styles.textErrorTopLabel} text-crd5 absolute left-3 -bottom-4 truncate font-semibold`}
//         >
//           {error}
//         </span>
//       )}
//     </div>
//   );
// }

// FormField.propTypes = {
//   alignRight: PropTypes.bool,
//   children: PropTypes.any,
//   error: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
//   label: PropTypes.string,
//   message: PropTypes.string,
//   optional: PropTypes.string,
//   success: PropTypes.string,
//   isSuccess: PropTypes.bool,
//   unit: PropTypes.string,
//   locked: PropTypes.bool
// };

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

// export function FormAccountingSelect({
//   label,
//   className,
//   optional,
//   message,
//   error,
//   disabled,
//   optionColor = false,
//   options = [
//     { value: 'Option 1', label: 'Option 1' },
//     { value: 'Option 2', label: 'Option 2' },
//     { value: 'Option 3', label: 'Option 3' }
//   ],
//   value = {},
//   onChange = () => {},
//   onBlur = () => {},
//   ...props
// }) {
//   const [isActive, setIsActive] = useState(false);
//   const [selectedOption, setSelectedOption] = useState({});
//   const selectRef = useRef(null);

//   useOutsideClick(selectRef, () => {
//     setIsActive(false);
//   });

//   const handleOptionSelect = (option) => {
//     setIsActive(false);
//     if (typeof onChange == 'function') {
//       onChange(option);
//     } else {
//       setSelectedOption(option);
//     }
//   };

//   const handleBlur = () => {
//     onBlur();
//   };

//   useEffect(() => {
//     setSelectedOption(value);
//   }, [value]);

//   return (
//     <div className={`${styles.form_select_container}`} ref={selectRef}>
//       <div
//         className={`${styles.form_select_Accounting}
//         ${isActive && styles.focus}
//         ${error && styles.error}
//         ${disabled && styles.disabled}`}
//         onBlur={handleBlur}
//       >
//         <div
//           className={`px-1 bg-cwhite absolute left-3 transform transition-all duration-100 ease-in ${
//             selectedOption
//               ? `-top-1.5 -mt-0.5  ${styles.textErrorTopLabel}`
//               : 'top-2.5 text-sm'
//           } ${
//             disabled
//               ? 'text-cgy2 pointer-events-none'
//               : selectedOption
//               ? 'text-cgy4'
//               : 'text-cgy3'
//           }`}
//           onClick={() => setIsActive(!isActive)}
//         >
//           {label}
//         </div>
//         <div
//           className={`${styles.selected_option} ${
//             disabled
//               ? 'text-cgy2 pointer-events-none'
//               : optionColor
//               ? 'text-cgy2'
//               : 'text-cgy4'
//           }`}
//           onClick={() => setIsActive(!isActive)}
//         >
//           {selectedOption?.label || ''}
//         </div>
//         {!disabled && (
//           <img
//             src={arrowGray}
//             width="8"
//             height="8"
//             className={`absolute transform rotate-90 top-3 right-3
//               ${isActive && '-rotate-90'}`}
//             onClick={() => setIsActive(!isActive)}
//           />
//         )}
//         {isActive && (
//           <>
//             <div className={`${styles.options_wrap_Select} ${className}`}>
//               {options.map((x, i) => (
//                 <div
//                   key={i}
//                   className={`flex items-center justify-between pr-3 cursor-pointer hover:text-cm3 text-xs ${
//                     selectedOption?.value === x?.value
//                       ? 'text-cm4'
//                       : 'text-cgy3'
//                   } font-semibold`}
//                   onClick={() => handleOptionSelect(x)}
//                 >
//                   {x.label}
//                   {/* {selectedOption?.value === x?.value && (
//                     <img src={checkMarkIcon} width="15" height="10" />
//                   )} */}
//                 </div>
//               ))}
//             </div>
//             <div className="w-full h-2"></div>
//           </>
//         )}
//       </div>
//       <span
//         className={`
//         ${styles.textErrorTopLabel} absolute left-3 -bottom-3.5 text-ellipsis
//         ${error && 'text-crd5'}`}
//       >
//         {error || message}
//       </span>
//     </div>
//     // <FormField
//     //   label={label}
//     //   optional={optional}
//     //   message={message}
//     //   error={error}
//     //   locked={locked}
//     // >
//     //   <Select {...props} error={Boolean(error)} />
//     // </FormField>
//   );
// }

// export function FormSelectZone({
//   label,
//   optional,
//   message,
//   error,
//   className,
//   width,
//   disabled,
//   disabledClassName,
//   options = [
//     { value: 'Option 1', label: 'Option 1' },
//     { value: 'Option 2', label: 'Option 2' },
//     { value: 'Option 3', label: 'Option 3' }
//   ],
//   value = {},
//   onChange = () => {},
//   onBlur = () => {},
//   ...props
// }) {
//   const [isActive, setIsActive] = useState(false);
//   const [selectedOption, setSelectedOption] = useState({});
//   const [isHover, setIsHover] = useState(false);
//   const selectRef = useRef(null);

//   useOutsideClick(selectRef, () => {
//     setIsActive(false);
//   });

//   const handleOptionSelect = (option) => {
//     setIsActive(false);
//     setIsHover(false);
//     if (typeof onChange == 'function') {
//       onChange(option);
//     } else {
//       setSelectedOption(option);
//     }
//   };

//   const handleBlur = () => {
//     onBlur();
//   };

//   useEffect(() => {
//     setSelectedOption(value);
//   }, [value]);

//   return (
//     <div
//       className={`${styles.form_select_container} ${
//         width === 'small' ? ' w-48' : ' w-full'
//       }`}
//       ref={selectRef}
//     >
//       <div
//         className={`${styles.formSelect}
//         ${isActive && styles.focus}
//         ${error && styles.error}
//         ${disabled && styles.disabled} ${disabledClassName} cursor-pointer`}
//         tabIndex="0"
//         onBlur={handleBlur}
//         onMouseEnter={() => setIsHover(true)}
//         onMouseLeave={() => setIsHover(false)}
//       >
//         <div
//           className={`text-cgy3 px-1 bg-cwhite absolute left-3 transform transition-all duration-100 ease-in ${
//             selectedOption
//               ? `-top-1.5 ${styles.textErrorTopLabel}`
//               : 'top-2.5 text-sm'
//           } ${disabled && 'text-cgy12'} ${disabledClassName}`}
//           onClick={() => setIsActive(!isActive)}
//         >
//           {label}
//         </div>
//         <div
//           className={` ${styles.selected_option} ${disabledClassName} ${
//             disabled && 'text-cgy12'
//           }`}
//           onClick={() => setIsActive(!isActive)}
//         >
//           {selectedOption?.label || ''}
//         </div>
//         {!disabled && (
//           <img
//             src={isActive || isHover ? arrowBlue : arrowGray}
//             width="8"
//             height="8"
//             className={`absolute transform rotate-90 top-3 right-3
//               ${isActive && '-rotate-90'}`}
//             onClick={() => setIsActive(!isActive)}
//           />
//         )}
//         {isActive && (
//           <>
//             <div className={`${styles.options_wrap}`}>
//               {options.map((x, i) => (
//                 <div
//                   key={i}
//                   className={`flex items-center justify-between pr-3 text-sm cursor-pointer hover:text-cm4
//                    ${
//                      selectedOption?.value === x?.value
//                        ? 'text-cm4'
//                        : 'text-cgy4'
//                    }`}
//                   onClick={() => handleOptionSelect(x)}
//                 >
//                   {x.label}
//                   {selectedOption?.value === x?.value && (
//                     <img src={checkMarkIcon} width="15" height="10" />
//                   )}
//                 </div>
//               ))}
//             </div>
//             <div className="w-full h-4"></div>
//           </>
//         )}
//       </div>
//       <span
//         className={`
//         ${styles.textErrorTopLabel} absolute left-3 -bottom-3.5 text-ellipsis
//         ${error && 'text-crd5'}`}
//       >
//         {error || message}
//       </span>
//     </div>
//   );
// }

// export function FormCountry({
//   label,
//   optional,
//   message,
//   error,
//   locked,
//   value,
//   onChange,
//   ...props
// }) {
//   return (
//     <FormField
//       label={label}
//       optional={optional}
//       message={message}
//       error={error}
//       locked={locked}
//     >
//       <Select
//         {...props}
//         options={countryOptions}
//         error={Boolean(error)}
//         value={value === null ? value : { value: value, label: value }}
//         onChange={
//           typeof onChange === 'function'
//             ? (obj) => onChange(obj.value)
//             : undefined
//         }
//       />
//     </FormField>
//   );
// }

// export function FormState({
//   className,
//   label,
//   error,
//   disabled,
//   value,
//   onChange,
//   onBlur,
//   ...props
// }) {
//   const { states } = useSelector((state) => state.states);
//   const dispatch = useDispatch();

//   const [isActive, setIsActive] = useState(false);
//   const [selectedOption, setSelectedOption] = useState({});
//   const selectRef = useRef(null);

//   useEffect(() => {
//     if (states.length === 0) {
//       dispatch(getStatesAction());
//     }
//   }, []);

//   useOutsideClick(selectRef, () => {
//     setIsActive(false);
//   });

//   const handleOptionSelect = (option) => {
//     setIsActive(false);
//     if (typeof onChange == 'function') {
//       onChange(option);
//     } else {
//       setSelectedOption(option);
//     }
//   };

//   const handleBlur = () => {
//     setIsActive(false);
//     onBlur();
//   };

//   useEffect(() => {
//     setSelectedOption(value);
//   }, [value]);

//   return (
//     <div className={`${styles.form_select_container}`} ref={selectRef}>
//       <div
//         className={`${styles.formSelect}
//         ${isActive && styles.focus}
//         ${error && styles.error}
//         ${disabled && styles.disabled}`}
//         tabIndex="0"
//         onBlur={handleBlur}
//       >
//         <div
//           className={`px-1 bg-cwhite absolute left-3 transform transition-all duration-100 ease-in ${
//             selectedOption
//               ? `-top-2 ${styles.textErrorTopLabel}`
//               : 'top-2.5 text-sm'
//           } ${
//             disabled
//               ? 'text-cgy2 pointer-events-none'
//               : selectedOption
//               ? 'text-cgy4'
//               : 'text-cgy3'
//           }`}
//           onClick={() => setIsActive(!isActive)}
//         >
//           {label}
//         </div>
//         <div
//           className={`${styles.selected_option} ${
//             disabled ? 'text-cgy2 pointer-events-none' : 'text-cgy4'
//           }`}
//           onClick={() => setIsActive(!isActive)}
//         >
//           {selectedOption?.name || ''}
//         </div>
//         {!disabled && (
//           <img
//             src={isActive ? arrowBlue : arrowGray}
//             width="8"
//             height="8"
//             className={`absolute transform rotate-90 top-3 right-3
//               ${isActive && '-rotate-90'}`}
//             onClick={() => setIsActive(!isActive)}
//           />
//         )}
//         {isActive && (
//           <>
//             <div className={`${styles.options_wrap} ${className}`}>
//               {states.map((x, i) => (
//                 <div
//                   key={i}
//                   className={`flex items-center justify-between pr-3 cursor-pointer`}
//                   onClick={() => handleOptionSelect(x)}
//                 >
//                   {x.name}
//                   {selectedOption?.code === x?.code && (
//                     <img src={checkMarkIcon} width="15" height="10" />
//                   )}
//                 </div>
//               ))}
//             </div>
//             <div className="w-full h-2"></div>
//           </>
//         )}
//       </div>
//       <span
//         className={`
//         ${styles.textErrorTopLabel} absolute left-3 -bottom-4 text-ellipsis
//         ${error && 'text-crd5'}`}
//       >
//         {error}
//       </span>
//     </div>
//   );
// }

// const optionsList = countryData.map((country) => ({
//   value: { dialCode: country.dialCode, alpha2: country.alpha2 },
//   label: (
//     <div className="f32 country-option">
//       {/* <span className={`fflag fflag-${country.alpha2.toUpperCase()} ff-sm`} /> */}
//       <img
//         alt={country.alpha2}
//         src={`https://www.countryflags.io/${country.alpha2}/flat/24.png`}
//       />
//       <span className="country-label">
//         {country.name} +{country.dialCode}
//       </span>
//     </div>
//   )
// }));

// export function FormSearch({
//   label,
//   optional,
//   message,
//   error,
//   locked,
//   ...props
// }) {
//   return (
//     <FormField
//       label={label}
//       optional={optional}
//       message={message}
//       error={error}
//       locked={locked}
//     >
//       <SearchInput {...props} error={Boolean(error)} />
//     </FormField>
//   );
// }

// export const FormPhone = ({
//   id = '',
//   className = '',
//   showTwoLabels = false,
//   secondLabel = '',
//   label = '',
//   message = '',
//   error = '',
//   errorClassName = '',
//   disabled = false,
//   ShowImage = true,
//   isSemibold = false,
//   ...rest
// }) => {
//   const [isFocused, setIsFocused] = useState(false);
//   const [labelTop, setLabelTop] = useState(false);

//   const handleBlur = (e) => {
//     setIsFocused(false);
//     setLabelTop(!!e.target.value);
//     const { onBlur } = rest;
//     if (typeof onBlur === 'function') {
//       onBlur(e);
//     }
//   };

//   const handleFocus = (e) => {
//     setIsFocused(true);
//     setLabelTop(true);
//     const { onFocus } = rest;
//     if (typeof onFocus === 'function') {
//       onFocus(e);
//     }
//   };

//   useEffect(() => {
//     const { value } = rest;
//     setLabelTop(isFocused ? isFocused : !!value);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [rest?.value, isFocused]);

//   return (
//     <div
//       className={`
//         ${styles.form_field}
//         ${isFocused && styles.focus}
//         ${error && styles.error}
//         ${disabled && styles.disabled}
//         ${className}`}
//     >
//       {ShowImage && <img src={usaFlag} className="absolute top-2" />}
//       {label && (
//         <label
//           className={`px-1 -ml-1 bg-cwhite absolute ${
//             labelTop ? 'left-3' : ShowImage ? 'left-12' : 'left-3'
//           } transform transition-all duration-100 ease-in
//              ${
//                labelTop
//                  ? `-top-2  ${styles.textErrorTopLabel}`
//                  : 'top-1/4 text-sm'
//              }
//             ${disabled ? 'text-cgy2' : labelTop ? 'text-cgy4' : 'text-cgy3'}`}
//           htmlFor={id}
//         >
//           {showTwoLabels ? (labelTop ? label : secondLabel) : label}
//         </label>
//       )}
//       <PatternFormat
//         {...rest}
//         id={id}
//         customInput={Input}
//         onFocus={handleFocus}
//         onBlur={handleBlur}
//         className={`${disabled ? 'text-cgy2' : 'text-cgy4'} ${
//           ShowImage ? 'pl-9' : 'pl-0'
//         } ${styles.formatWidth} ${isSemibold && 'font-semibold'}`}
//       />
//       <span
//         className={`
//         ${
//           styles.textErrorTopLabel
//         } absolute left-3 -bottom-4 font-semibold truncate
//         ${error && 'text-crd5 font-semibold'} ${errorClassName}`}
//       >
//         {error || message}
//       </span>
//     </div>

//     // <FormField
//     //   className={styles.form_mask}
//     //   label={label}
//     //   optional={optional}
//     //   message={message}
//     //   error={error}
//     //   locked={locked}
//     // >
//     //   <InputMask
//     //     {...props}
//     //     className={unit ? 'unit' : ''}
//     //     error={Boolean(error)}
//     //   />
//     //   {unit && <span className="unit-label">{unit}</span>}
//     // </FormField>
//   );
// };

// FormPhone.propTypes = {
//   id: PropTypes.string,
//   className: PropTypes.string,
//   showTwoLabels: PropTypes.bool,
//   secondLabel: PropTypes.string,
//   label: PropTypes.string,
//   error: PropTypes.any,
//   message: PropTypes.string,
//   errorClassName: PropTypes.bool,
//   disabled: PropTypes.bool,
//   ShowImage: PropTypes.bool,
//   isSemibold: PropTypes.bool
// };

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
// export function FormMIDForPayment({
//   className = '',
//   errorClassName = '',
//   error,
//   id = '',
//   unit,
//   label,
//   disabled,
//   optional,
//   maxLength,
//   innerRef,
//   disableSymbols,
//   disableSpace,
//   disableNumbers,
//   dotNotAllow = false,
//   disableAlphabets,
//   disablePasswordSymbols,
//   thousandSeparator = true,
//   fixedDecimalScale,
//   autoFocus,
//   dollar,
//   dropdown = false,
//   children,
//   specialStyle = false,
//   chargeBackText = false,
//   ACText = false,
//   chargeBack = false,
//   account_Limit = false,
//   AccountLimit = false,
//   isFocusColor = false,
//   textColor = '',
//   limits = false,
//   invitation = false,

//   minTrans = false,
//   ...rest
// }) {
//   const [isFocused, setIsFocused] = useState(false);
//   const [labelTop, setLabelTop] = useState(false);

//   const handleBlur = (e) => {
//     setIsFocused(false);
//     setLabelTop(!!e.target.value);
//     const { onBlur } = rest;
//     if (typeof onBlur === 'function') {
//       onBlur(e);
//     }
//   };

//   const handleFocus = (e) => {
//     setIsFocused(true);
//     setLabelTop(true);
//   };

//   const handleInputKeyDown = (e) => {
//     if (disableSymbols) {
//       [...symbolsMID].includes(e.key) && e.preventDefault();
//     }
//     if (dotNotAllow) {
//       e.which === 190 && e.preventDefault();
//     }
//     if (disableSpace) {
//       e.which === 32 && e.preventDefault();
//     }
//     if (disableNumbers) {
//       [...numbers].includes(e.key) && e.preventDefault();
//     }
//     if (disableAlphabets) {
//       [...alphabets].includes(e.key) && e.preventDefault();
//     }
//     if (disablePasswordSymbols) {
//       [...symbolPassCode].includes(e.key) && e.preventDefault();
//     }
//   };

//   useEffect(() => {
//     const { value } = rest;
//     setLabelTop(isFocused ? isFocused : !!value);
//   }, [rest]);

//   return (
//     <div
//       className={`${
//         specialStyle
//           ? `${styles.form_field_Special} w-24`
//           : AccountLimit
//           ? styles.form_field_Account_limit_MID
//           : limits
//           ? styles.form_field_Special
//           : invitation
//           ? styles.form_field_Special
//           : styles.form_field_MID
//       } flex items-center ${className} ${
//         isFocusColor && isFocused && styles.focus
//       }
//        ${error && styles.error} `}
//     >
//       {label && (
//         <label
//           className={`px-1 -ml-1 bg-cwhite absolute ${
//             labelTop ? 'left-3' : 'left-10'
//           } ${
//             labelTop && chargeBack && '`visibility: hidden'
//           } transform transition-all duration-100 ease-in
//             ${
//               labelTop
//                 ? `-top-1.5 -mt-0.5 ${styles.textErrorTopLabel}`
//                 : chargeBack
//                 ? 'top-1.5 text-sm'
//                 : 'top-1/4 text-sm'
//             }
//             ${
//               disabled
//                 ? 'text-cgy2 pointer-events-none'
//                 : labelTop
//                 ? 'text-cgy4'
//                 : 'text-cgy3'
//             }`}
//           htmlFor={id}
//         >
//           {label}
//           {optional && (
//             <span
//               className={`ml-2 text-xs   ${
//                 disabled ? 'text-cgy2 pointer-events-none' : 'text-cgy4'
//               }`}
//             >
//               {optional}
//             </span>
//           )}
//         </label>
//       )}
//       <div className="flex flex-row">
//         <span
//           className={`w-4 mr-1 mt-1 text-lg font-bold ${
//             disabled ? 'text-cgy2' : 'text-cm3'
//           }`}
//         >
//           {unit}
//         </span>
//         <VBar className="flex-grow h-7 bg-cgy1" />
//       </div>
//       <NumericFormat
//         {...rest}
//         className={`${
//           specialStyle
//             ? 'w-20'
//             : chargeBackText
//             ? 'w-24'
//             : ACText
//             ? 'w-24'
//             : limits
//             ? 'w-16 text-right pr-1.5'
//             : invitation
//             ? 'w-16'
//             : 'w-48'
//         } ${ACText ? '-ml-7' : 'ml-2'} text-left ${
//           disabled ? 'text-cgy2 font-semibold' : 'text-cgy4 font-semibold'
//         } ${(chargeBackText || ACText) && 'text-right'} ${textColor} `}
//         customInput={Input}
//         decimalScale={2}
//         allowLeadingZeros={false}
//         fixedDecimalScale={fixedDecimalScale}
//         thousandSeparator={thousandSeparator}
//         allowNegative={false}
//         isAllowed={({ value }) =>
//           specialStyle
//             ? value <= 1000
//             : minTrans
//             ? value < 10000
//             : value < 10000000
//         }
//         disabled={disabled}
//         ref={innerRef}
//         id={id}
//         onFocus={account_Limit ? rest.onFocus : handleFocus}
//         onBlur={handleBlur}
//         onKeyDown={handleInputKeyDown}
//         maxLength={maxLength}
//         autoFocus={autoFocus}
//         decimalSeparator={dotNotAllow === false && '.'}
//       />
//       <span
//         className={`
//         ${
//           styles.textErrorTopLabel
//         } absolute left-3 -bottom-4 truncate font-semibold
//         ${error && 'text-crd5'} ${errorClassName}`}
//       >
//         {error}
//       </span>
//     </div>
//   );
// }
// export function FormMID({
//   className = '',
//   errorClassName = '',
//   error,
//   id = '',
//   unit,
//   label,
//   disabled,
//   optional,
//   maxLength,
//   innerRef,
//   disableSymbols,
//   disableSpace,
//   disableNumbers,
//   dotNotAllow = false,
//   disableAlphabets,
//   disablePasswordSymbols,
//   thousandSeparator = true,
//   fixedDecimalScale,
//   autoFocus,
//   dollar,
//   dropdown = false,
//   children,
//   specialStyle = false,
//   chargeBackText = false,
//   ACText = false,
//   chargeBack = false,
//   account_Limit = false,
//   AccountLimit = false,
//   isFocusColor = false,
//   textColor = '',
//   limits = false,
//   invitation = false,
//   value,
//   minTrans = false,
//   isRegular = false,
//   ...rest
// }) {
//   const [isFocused, setIsFocused] = useState(false);
//   const [labelTop, setLabelTop] = useState(false);

//   const handleBlur = (e) => {
//     setIsFocused(false);
//     setLabelTop(!!e.target.value);
//     const { onBlur } = rest;
//     if (typeof onBlur === 'function') {
//       onBlur(e);
//     }
//   };

//   const handleFocus = (e) => {
//     setIsFocused(true);
//     setLabelTop(true);
//     const { onFocus } = rest;
//     if (typeof onFocus == 'function') {
//       onFocus(e);
//     }
//   };

//   const handleInputKeyDown = (e) => {
//     if (disableSymbols) {
//       [...symbolsMID].includes(e.key) && e.preventDefault();
//     }
//     if (dotNotAllow) {
//       e.which === 190 && e.preventDefault();
//     }
//     if (disableSpace) {
//       e.which === 32 && e.preventDefault();
//     }
//     if (disableNumbers) {
//       [...numbers].includes(e.key) && e.preventDefault();
//     }
//     if (disableAlphabets) {
//       [...alphabets].includes(e.key) && e.preventDefault();
//     }
//     if (disablePasswordSymbols) {
//       [...symbolPassCode].includes(e.key) && e.preventDefault();
//     }
//   };

//   useEffect(() => {
//     const { value } = rest;
//     // setLabelTop(isFocused ? isFocused : !!value);
//   }, [rest]);

//   return (
//     <div
//       className={`${
//         specialStyle
//           ? `${styles.form_field_Special} w-24`
//           : AccountLimit
//           ? styles.form_field_Account_limit_MID
//           : limits
//           ? styles.form_field_Special
//           : invitation
//           ? styles.form_field_Special
//           : styles.form_field_MID
//       } flex items-center ${className} ${
//         isFocusColor && isFocused && styles.focus
//       }
//        ${error && styles.error} `}
//     >
//       {label && (
//         <label
//           className={`px-1 -ml-1 bg-cwhite absolute ${
//             labelTop ? 'left-3' : 'left-10'
//           } ${
//             labelTop && chargeBack && '`visibility: hidden'
//           } transform transition-all duration-100 ease-in
//             ${
//               labelTop
//                 ? `-top-1.5 -mt-0.5 ${styles.textErrorTopLabel}`
//                 : chargeBack
//                 ? 'top-1.5 text-sm'
//                 : 'top-1/4 text-sm'
//             }
//             ${
//               disabled
//                 ? 'text-cgy2 pointer-events-none'
//                 : labelTop
//                 ? 'text-cgy4'
//                 : 'text-cgy3'
//             }`}
//           htmlFor={id}
//         >
//           {label}
//           {optional && (
//             <span
//               className={`ml-2 text-xs   ${
//                 disabled ? 'text-cgy2 pointer-events-none' : 'text-cgy4'
//               }`}
//             >
//               {optional}
//             </span>
//           )}
//         </label>
//       )}
//       <div className="flex flex-row">
//         <span
//           className={`w-4 mr-1 mt-1 text-sm font-bold ${
//             disabled ? 'text-cgy2' : 'text-cm3'
//           }`}
//         >
//           {unit}
//         </span>
//         <VBar className="flex-grow h-7 bg-cgy1" />
//       </div>
//       <NumericFormat
//         {...rest}
//         className={`${
//           specialStyle
//             ? 'w-13'
//             : chargeBackText
//             ? 'w-24'
//             : ACText
//             ? 'w-24'
//             : limits
//             ? 'w-16 text-right pr-1.5'
//             : invitation
//             ? 'w-16'
//             : 'w-48'
//         } ${ACText ? '-ml-7' : 'ml-2'} text-left ${
//           disabled ? 'text-cgy2' : 'text-cgy4'
//         } ${(chargeBackText || ACText) && 'text-right'} ${textColor} ${
//           isRegular ? 'font-normal' : 'font-semibold'
//         }`}
//         customInput={Input}
//         decimalScale={2}
//         value={
//           value === null
//             ? '0.00'
//             : isArray(value)
//             ? value[0] == 0
//               ? toCurrencyAmount(value)
//               : value
//             : value
//         }
//         allowLeadingZeros={false}
//         fixedDecimalScale={fixedDecimalScale}
//         thousandSeparator={thousandSeparator}
//         allowNegative={false}
//         isAllowed={({ value }) =>
//           specialStyle
//             ? value <= 1000
//             : minTrans
//             ? value < 10000
//             : value < 100000000
//         }
//         disabled={disabled}
//         ref={innerRef}
//         id={id}
//         onFocus={handleFocus}
//         onBlur={handleBlur}
//         onKeyDown={handleInputKeyDown}
//         maxLength={maxLength}
//         autoFocus={autoFocus}
//         decimalSeparator={dotNotAllow === false && '.'}
//       />

//       {/* <span
//         className={`
//         ${styles.textErrorTopLabel} absolute -bottom-4 truncate text-crd5`}
//       >
//         {error}
//       </span>
//       {children} */}
//       <span
//         className={`
//         ${
//           styles.textErrorTopLabel
//         } absolute left-3 -bottom-4 truncate font-semibold
//         ${error && 'text-crd5'} ${errorClassName}`}
//       >
//         {error}
//       </span>
//     </div>
//   );
// }

// export function FormRightMID({
//   className = '',
//   error,
//   id = '',
//   unit,
//   label,
//   disabled,
//   optional,
//   maxLength,
//   innerRef,
//   disableSymbols,
//   disableSpace,
//   disableNumbers,
//   dotNotAllow = false,
//   disableAlphabets,
//   disablePasswordSymbols,
//   thousandSeparator,
//   fixedDecimalScale,
//   autoFocus,
//   dollar,
//   dropdown = false,
//   children,
//   specialStyle = false,
//   businessApprove = false,
//   setRight = true,
//   ...rest
// }) {
//   const [isFocused, setIsFocused] = useState(false);
//   const [labelTop, setLabelTop] = useState(false);

//   const handleBlur = (e) => {
//     setIsFocused(false);
//     setLabelTop(!!e.target.value);
//     const { onBlur } = rest;
//     if (typeof onBlur === 'function') {
//       onBlur(e);
//     }
//   };

//   const handleFocus = (e) => {
//     setIsFocused(true);
//     setLabelTop(true);
//   };

//   const handleInputKeyDown = (e) => {
//     if (disableSymbols) {
//       [...symbolsMID].includes(e.key) && e.preventDefault();
//     }
//     if (dotNotAllow) {
//       e.which === 190 && e.preventDefault();
//     }
//     if (disableSpace) {
//       e.which === 32 && e.preventDefault();
//     }
//     if (disableNumbers) {
//       [...numbers].includes(e.key) && e.preventDefault();
//     }
//     if (disableAlphabets) {
//       [...alphabets].includes(e.key) && e.preventDefault();
//     }
//     if (disablePasswordSymbols) {
//       [...symbolPassCode].includes(e.key) && e.preventDefault();
//     }
//   };

//   useEffect(() => {
//     const { value } = rest;
//     setLabelTop(isFocused ? isFocused : !!value);
//   }, [rest]);

//   return (
//     <div
//       className={`${
//         specialStyle ? styles.form_field_Special : styles.form_field_MID
//       } flex items-center ${className}`}
//     >
//       {label && (
//         <label
//           className={`px-1 -ml-1 bg-cwhite absolute ${
//             labelTop ? 'left-3' : 'left-10'
//           } transform transition-all duration-100 ease-in
//             ${
//               labelTop
//                 ? `-top-1.5 -mt-0.5 ${styles.textErrorTopLabel}`
//                 : 'top-1/4 text-sm'
//             }
//             ${
//               disabled
//                 ? 'text-cgy2 pointer-events-none'
//                 : labelTop
//                 ? 'text-cgy4'
//                 : 'text-cgy3'
//             }`}
//           htmlFor={id}
//         >
//           {label}
//           {optional && (
//             <span
//               className={`ml-2 text-xs   ${
//                 disabled ? 'text-cgy2 pointer-events-none' : 'text-cgy4'
//               }`}
//             >
//               {optional}
//             </span>
//           )}
//         </label>
//       )}
//       <NumericFormat
//         {...rest}
//         className={`${
//           specialStyle ? 'w-20' : businessApprove ? 'w-48' : 'w-40'
//         } ml-2 text-left ${disabled ? 'text-cgy2' : 'text-cgy4'}`}
//         customInput={Input}
//         decimalScale={2}
//         fixedDecimalScale={fixedDecimalScale}
//         thousandSeparator={thousandSeparator}
//         isAllowed={({ value }) =>
//           specialStyle ? value <= 1000 : value < 10000000000
//         }
//         disabled={disabled}
//         ref={innerRef}
//         id={id}
//         onFocus={handleFocus}
//         onBlur={handleBlur}
//         onKeyDown={handleInputKeyDown}
//         maxLength={maxLength}
//         autoFocus={autoFocus}
//         decimalSeparator={dotNotAllow === false && '.'}
//       />
//       <div className="flex flex-row">
//         {setRight ? <VBar className="flex-grow h-7 bg-cgy1" /> : ''}
//         <span
//           className={`w-4 ${
//             !businessApprove ? 'ml-3 mr-3' : 'ml-4'
//           } mt-1  font-semibold ${disabled ? 'text-cgy2' : 'text-cm3'}`}
//         >
//           {unit}
//         </span>
//       </div>
//       <span
//         className={`
//         ${styles.textErrorTopLabel} absolute -bottom-4 truncate text-crd5`}
//       >
//         {error}
//       </span>
//       {children}
//     </div>
//   );
// }

// export function FormFeeDrop({
//   className = '',
//   error,
//   id = '',
//   unit,
//   label,
//   disabled,
//   optional,
//   maxLength,
//   innerRef,
//   disableSymbols,
//   disableSpace,
//   disableNumbers,
//   disableAlphabets,
//   disablePasswordSymbols,
//   thousandSeparator = true,
//   autoFocus,
//   dropdown = false,
//   children,
//   dropDownOptions,
//   specialStyle = false,
//   selectValue = '',
//   limits = false,
//   invitation = false,
//   fixedDecimalScale = false,
//   minTrans = false,
//   handleChange = () => {},
//   value,
//   ...rest
// }) {
//   const [isFocused, setIsFocused] = useState(false);
//   const [labelTop, setLabelTop] = useState(false);

//   const handleBlur = (e) => {
//     setIsFocused(false);
//     setLabelTop(!!e.target.value);
//     const { onBlur } = rest;
//     if (typeof onBlur === 'function') {
//       onBlur(e);
//     }
//   };

//   const handleFocus = (e) => {
//     setIsFocused(true);
//     setLabelTop(true);
//   };

//   const handleInputKeyDown = (e) => {
//     if (disableSymbols) {
//       [...symbols].includes(e.key) && e.preventDefault();
//     }
//     if (disableSpace) {
//       e.which === 32 && e.preventDefault();
//     }
//     if (disableNumbers) {
//       [...numbers].includes(e.key) && e.preventDefault();
//     }
//     if (disableAlphabets) {
//       [...alphabets].includes(e.key) && e.preventDefault();
//     }
//     if (disablePasswordSymbols) {
//       [...symbolPassCode].includes(e.key) && e.preventDefault();
//     }
//   };

//   useEffect(() => {
//     const { value } = rest;
//     setLabelTop(isFocused ? isFocused : !!value);
//   }, [rest]);

//   return (
//     <div
//       className={`${
//         specialStyle
//           ? styles.form_field_Special
//           : limits
//           ? styles.form_field_Special
//           : invitation
//           ? styles.form_field_Special
//           : styles.form_field_MID
//       } flex items-center ${className} ${error && styles.error}`}
//     >
//       {label && (
//         <label
//           className={`px-1 -ml-1 bg-cwhite absolute ${
//             labelTop ? 'left-3' : 'left-10'
//           } transform transition-all duration-100 ease-in
//             ${
//               labelTop
//                 ? `-top-1.5 ${styles.textErrorTopLabel}`
//                 : 'top-1/4 text-sm'
//             }
//             ${
//               disabled
//                 ? 'text-cgy2 pointer-events-none'
//                 : labelTop
//                 ? 'text-cgy4'
//                 : 'text-cgy3'
//             }`}
//           htmlFor={id}
//         >
//           {label}
//           {optional && (
//             <span
//               className={`ml-2 text-xs   ${
//                 disabled ? 'text-cgy2 pointer-events-none' : 'text-cgy4'
//               }`}
//             >
//               {optional}
//             </span>
//           )}
//         </label>
//       )}
//       <div className="flex flex-row">
//         <span
//           className={`w-4 mr-1 mt-1 text-sm font-bold ${
//             disabled ? 'text-cgy2' : 'text-cm3'
//           }`}
//         >
//           {unit}
//         </span>
//         <VBar className="flex-grow h-7 bg-cgy1" />
//       </div>
//       <NumericFormat
//         {...rest}
//         allowNegative={false}
//         className={`${
//           specialStyle
//             ? 'w-14'
//             : limits
//             ? `${styles.invitation_width} text-right pr-1`
//             : invitation
//             ? styles.invitation_width
//             : 'w-40'
//         } ml-2 text-left ${
//           disabled ? 'text-cgy2 font-semibold' : 'text-cgy4 font-semibold'
//         }`}
//         customInput={Input}
//         decimalScale={2}
//         value={
//           value === null
//             ? '0.00'
//             : value[0] == 0
//             ? toCurrencyAmount(value)
//             : value
//         }
//         allowLeadingZeros={false}
//         thousandSeparator={thousandSeparator}
//         isAllowed={({ value }) =>
//           specialStyle ? value <= 1000 : minTrans ? 10000 : value < 10000000
//         }
//         disabled={disabled}
//         ref={innerRef}
//         id={id}
//         onFocus={handleFocus}
//         onBlur={handleBlur}
//         onKeyDown={handleInputKeyDown}
//         maxLength={maxLength}
//         autoFocus={autoFocus}
//         fixedDecimalScale={fixedDecimalScale}
//       />
//       <div
//         className={`${styles.floating_dropdown} ${
//           limits && styles.border_none
//         } ${error && styles.error}`}
//       >
//         <FloatingDropDown
//           className="relative"
//           limits={true}
//           position="left"
//           value={selectValue}
//           width={'normal'}
//           options={dropDownOptions}
//           onChange={(value) => handleChange(value)}
//         />
//       </div>
//       <span
//         className={`
//         ${styles.textErrorTopLabel} absolute ${
//           limits ? '' : invitation ? 'left-3.5' : '-left-0'
//         } -bottom-4 font-semibold truncate text-crd5`}
//       >
//         {error}
//       </span>
//       {children}
//     </div>
//   );
// }

// export function FormTextArea({
//   id,
//   className,
//   hoverStyle = false,
//   label,
//   value,
//   error,
//   showCharCount = true,
//   businessResonModal = false,
//   reasonModal = false,
//   disabled = false,
//   isCapitalize = false,
//   caseDetails = false,
//   underwritingCustomTask = false,
//   underwritingCaseDetails = false,
//   disableNumbers = false,
//   disableAlphabets = false,
//   disableSymbols = false,
//   charLimit,
//   isOpen = false,
//   isUpdateStatus = false,
//   arrowOpen,
//   handleArrow,
//   isBold = false,
//   isNormal = false,
//   dispute = false,
//   placeHolder,
//   textClassname = '',
//   errorClassName = '',
//   borderAlign = '',
//   isItalic = true,
//   disableLabelTop = false,
//   ...rest
// }) {
//   const [isFocused, setIsFocused] = useState(false);
//   const [labelTop, setLabelTop] = useState(false);
//   const [charCount, setCharCount] = useState(0);
//   // const [isOpen, setIsOpen] = useState(false);

//   const handleBlur = (e) => {
//     setIsFocused(false);
//     setLabelTop(!!e.target.value);
//     const { onBlur } = rest;
//     if (typeof onBlur === 'function') {
//       onBlur(e);
//     }
//   };

//   const handleFocus = (e) => {
//     setIsFocused(true);
//     setLabelTop(true);
//   };

//   const handleChange = (e) => {
//     const msgLength = e.target.value.length;
//     if (msgLength > charLimit) return;
//     const { onChange } = rest;
//     if (
//       typeof onChange === 'function' &&
//       !(e.target.value === ' ' && e.target.value.length === 1)
//     ) {
//       onChange(e);
//     }
//   };

//   const handleKeyDown = (e) => {
//     if (disableSymbols) {
//       [...symbols].includes(e.key) && e.preventDefault();
//     }
//     if (disableNumbers) {
//       [...numbers].includes(e.key) && e.preventDefault();
//     }
//     if (disableAlphabets) {
//       [...alphabets].includes(e.key) && e.preventDefault();
//     }
//   };

//   // const handleArrow = () => {
//   //   setIsOpen(!isOpen);
//   //   arrowOpen(isOpen);
//   // }

//   useEffect(() => {
//     setLabelTop(isFocused ? isFocused : !!value);
//     if (value) {
//       setCharCount(`${value}`.length);
//     } else if (value == ' ') {
//       setCharCount(0);
//     } else {
//       setCharCount(0);
//     }
//   }, [value]);

//   return (
//     <div className={`relative ${styles.textarea_wrap} ${className}`}>
//       {label && (
//         <label
//           className={`px-1 -ml-1 bg-cwhite absolute left-3 transform transition-all duration-100 ease-in
//             ${
//               labelTop && !caseDetails
//                 ? `-top-1.5 ${styles.textErrorTopLabel}`
//                 : 'top-2 text-sm'
//             }
//             ${
//               (labelTop && caseDetails && `visibility: hidden`) ||
//               (labelTop && underwritingCaseDetails && `visibility: hidden`) ||
//               (labelTop && underwritingCustomTask && `visibility: hidden`) ||
//               (labelTop && isUpdateStatus && `visibility: hidden`)
//             } ${
//             disabled
//               ? 'text-cgy2 pointer-events-none'
//               : labelTop
//               ? 'text-cgy4'
//               : 'text-cgy3'
//           }`}
//           htmlFor={id}
//         >
//           {label}
//         </label>
//       )}
//       <textarea
//         {...rest}
//         id={id}
//         value={value}
//         onFocus={handleFocus}
//         onBlur={handleBlur}
//         onKeyDown={handleKeyDown}
//         onChange={handleChange}
//         className={
//           caseDetails
//             ? `${styles.form_caseDetails}
//         ${
//           isFocused && caseDetails
//             ? styles.caseFocus
//             : isFocused && styles.focus
//         }
//         ${error && styles.error}
//         ${disabled && styles.disabled}`
//             : underwritingCaseDetails
//             ? `${styles.form_underWritingCaseDetails}${borderAlign}
//         ${isFocused && styles.focus}
//         ${error && styles.error}
//         ${disabled && styles.disabled}`
//             : underwritingCustomTask
//             ? `${styles.form_underWritingCustomTask}
//         ${error && styles.error}
//         ${disabled && styles.disabled}`
//             : // ${isFocused && styles.focus}

//             reasonModal
//             ? `${styles.reason_box_style}`
//             : businessResonModal
//             ? `${styles.business_reson_modal}`
//             : isUpdateStatus
//             ? `${styles.is_update_status}`
//             : `${styles.form_textarea}

//         ${isFocused && styles.focus}
//         ${error && styles.error}
//         ${isCapitalize && styles.input}
//         ${disabled && styles.disabled}
//          ${isNormal && styles.text_normal}
//          ${isBold && styles.text_bold} ${textClassname} ${
//                 isItalic && styles.text_italic
//               }`
//         }
//         placeholder={(labelTop || disableLabelTop) && placeHolder}
//       ></textarea>
//       {charLimit &&
//         (caseDetails ? (
//           <div className={`flex flex-row justify-between`}>
//             {showCharCount ? (
//               <span
//                 className={`absolute pb-2 pr-2 text-cgy2  ${
//                   caseDetails ? ' bottom-0 left-2' : 'bottom-0 right-0'
//                 } ${styles.textErrorTopLabel}`}
//               >
//                 {charCount} / {charLimit}
//               </span>
//             ) : null}
//             <div
//               onClick={() => handleArrow()}
//               className={`${
//                 !isOpen ? styles.downArrowIcon : styles.whiteArrowIcon
//               } ${
//                 isOpen && `hover:bg-cm4`
//               } absolute bottom-2 right-2 flex flex-row justify-center items-center cursor-pointer `}
//             >
//               <div
//                 className={`icon-small-arrow1 text-xs mt-0.5 fill-current ${
//                   isOpen ? 'text-cwhite' : 'text-cgy2'
//                 } ${
//                   isOpen && dispute === false
//                     ? styles.upArrow
//                     : styles.downArrow
//                 } ${dispute === true && styles.upArrow}`}
//               />
//             </div>
//           </div>
//         ) : underwritingCaseDetails || underwritingCustomTask ? null : (
//           <span
//             className={`absolute pb-4 pr-5 text-cgy2  ${
//               caseDetails ? ' bottom-0 left-4' : 'bottom-0 right-0'
//             } ${styles.textErrorTopLabel}`}
//           >
//             {charCount} / {charLimit}
//           </span>
//         ))}
//       <span
//         className={`
//         ${styles.textErrorTopLabel} absolute left-3 -bottom-3.5 truncate
//         ${error && 'text-crd5 font-semibold'} ${errorClassName}`}
//       >
//         {error}
//       </span>
//     </div>
//   );
// }

// export function FormWalletId({
//   id,
//   className,
//   value,
//   label,
//   onChange,
//   error,
//   success,
//   disabled = false,
//   disableSymbols = false,
//   disableSpace = false,
//   ...rest
// }) {
//   const [isFocused, setIsFocused] = useState(false);
//   const [labelTop, setLabelTop] = useState(false);
//   const inputRef = useRef(null);
//   // const [inputValue, setInputValue] = useState(null);

//   // useEffect(() => {
//   // setInputValue(value);
//   // }, [value]);

//   useEffect(() => {
//     setLabelTop(isFocused ? isFocused : !!value);
//   }, [value]);

//   const handleBlur = (e) => {
//     setIsFocused(false);
//     setLabelTop(!!e.target.value);
//     const { onBlur } = rest;
//     if (typeof onBlur === 'function') {
//       onBlur(e);
//     }
//   };

//   const handleFocus = (e) => {
//     setIsFocused(true);
//     setLabelTop(true);
//     //e.target.select();
//   };

//   const handleChange = (e) => {
//     const value = e.target.value;
//     if (typeof onChange === 'function') {
//       onChange(value);
//     }
//   };

//   const handleInputKeyDown = (e) => {
//     if (disableSymbols) {
//       [...symbols].includes(e.key) && e.preventDefault();
//     }
//     if (disableSpace) {
//       e.which === 32 && e.preventDefault();
//     }
//   };
//   const handlePaste = () => {
//     navigator.clipboard
//       .readText()
//       .then((text) => {
//         if (typeof onChange === 'function') {
//           onChange(text);
//         }
//       })
//       .catch((err) => {
//         console.error('Unable to copy from clipboard', err);
//       });
//   };

//   return (
//     <div
//       className={`${styles.form_field} flex items-center`}
//       onClick={() => inputRef.current.focus()}
//     >
//       {label && (
//         <label
//           className={` ${
//             styles.label
//           } px-1 -ml-1 bg-cwhite absolute left-3 transform transition-all duration-100 ease-in
//             ${
//               labelTop
//                 ? `-top-1.5 ${styles.textErrorTopLabel}`
//                 : 'top-1/4 text-sm'
//             }
//             ${
//               disabled
//                 ? 'text-cgy2 pointer-events-none'
//                 : labelTop
//                 ? 'text-cgy4'
//                 : 'text-cgy3'
//             }`}
//           htmlFor={id}
//         >
//           {label}
//         </label>
//       )}
//       <Input
//         {...rest}
//         id={id}
//         value={value}
//         className={`${isFocused ? 'w-full ' : 'w-1/2 pr-6 truncate'}`}
//         onFocus={handleFocus}
//         onChange={handleChange}
//         onBlur={handleBlur}
//         onKeyDown={handleInputKeyDown}
//         ref={inputRef}
//       />

//       <div
//         className={`flex items-center justify-end   truncate ${
//           isFocused && value ? 'w-auto' : 'w-1/2 pl-6'
//         }`}
//       >
//         {value && !isFocused ? (
//           <>
//             {error && <span className="text-sm text-crd5">{error}</span>}
//             {success && (
//               <span className="text-sm truncate text-cm3">{success}</span>
//             )}
//           </>
//         ) : (
//           <>
//             {!value && (
//               <button
//                 onClick={handlePaste}
//                 className={`font-bold uppercase text-cm3 ${styles.text}`}
//               >
//                 Paste
//               </button>
//             )}
//           </>
//         )}
//       </div>
//     </div>
//   );
// }

// const countryOptions = countryData.map((item) => ({
//   label: item.name,
//   value: item.name
// }));

// export function FormFieldEmail({
//   id = '',
//   label = '',
//   optional = '',
//   message = '',
//   error = '',
//   disableNumbers = false,
//   disableAlphabets = false,
//   disableSymbols = false,
//   disableSpace = false,
//   success = '',
//   unit = '',
//   children,
//   locked = false,
//   className = '',
//   innerIcon = false,
//   withIcon,
//   placeholder,
//   disabled = false,
//   innerRef,
//   isSemibold = false,
//   ...props
// }) {
//   const [isFocused, setIsFocused] = useState(false);
//   const [labelTop, setLabelTop] = useState(false);

//   const handleBlur = (e) => {
//     setIsFocused(false);
//     setLabelTop(!!e.target.value);
//     const { onBlur } = props;
//     if (typeof onBlur === 'function') {
//       onBlur(e);
//     }
//   };

//   const handleFocus = (e) => {
//     setIsFocused(true);
//     setLabelTop(true);
//   };

//   const handleInputKeyDown = (e) => {
//     if (disableSymbols) {
//       [...symbols].includes(e.key) && e.preventDefault();
//     }
//     if (disableSpace) {
//       e.which === 32 && e.preventDefault();
//     }
//     if (disableNumbers) {
//       [...numbers].includes(e.key) && e.preventDefault();
//     }
//     if (disableAlphabets) {
//       [...alphabets].includes(e.key) && e.preventDefault();
//     }
//   };

//   useEffect(() => {
//     const { value } = props;
//     setLabelTop(isFocused ? isFocused : !!value);
//   }, [props]);

//   return (
//     <div
//       className={`
//         ${styles.form_field}
//         ${isFocused && styles.focus}
//         ${error && styles.error}
//         ${disabled && styles.disabled}
//         ${className}`}
//     >
//       {label && (
//         <label
//           className={`px-1 -ml-1 bg-cwhite absolute left-3 transform transition-all duration-100 ease-in
//             ${
//               labelTop
//                 ? `-top-1.5 ${styles.textErrorTopLabel}`
//                 : 'top-1/4 text-sm'
//             }
//             ${disabled ? 'text-cgy2 pointer-events-none' : 'text-cgy4'}`}
//           htmlFor={id}
//         >
//           {label}
//           {optional && (
//             <span
//               className={`ml-2 text-xs   ${
//                 disabled ? 'text-cgy2 pointer-events-none' : 'text-cgy4'
//               }`}
//             >
//               {optional}
//             </span>
//           )}
//         </label>
//       )}
//       <Input
//         {...props}
//         id={id}
//         disabled={disabled}
//         ref={innerRef}
//         onFocus={handleFocus}
//         onBlur={handleBlur}
//         onKeyDown={handleInputKeyDown}
//         className={`${isSemibold && 'font-semibold'}`}
//         placeHolder={placeholder}
//       />
//       <span
//         className={`
//         ${
//           styles.textErrorTopLabel
//         } absolute left-3 -bottom-4 truncate flex font-semibold
//         ${error && 'text-crd5'} `}
//       >
//         {error || message}
//         {/* {concat(
//           error,
//           error ? (
//             <NavLink to="/login/forgot-email">
//               <div className="ml-1 font-semibold cursor-pointer hover:underline text-cm3">
//                 ForgotEmail?
//               </div>
//             </NavLink>
//           ) : null
//         ) || message} */}
//       </span>
//     </div>
//   );
// }

// export function FormMIDReserve({
//   className = '',
//   errorClassName = '',
//   error,
//   id = '',
//   unit = [],
//   label,
//   disabled,
//   optional,
//   maxLength,
//   innerRef,
//   disableSymbols,
//   disableSpace,
//   disableNumbers,
//   dotNotAllow = false,
//   disableAlphabets,
//   disablePasswordSymbols,
//   thousandSeparator,
//   fixedDecimalScale,
//   autoFocus,
//   specialStyle = false,
//   chargeBackText = false,
//   ACText = false,
//   chargeBack = false,
//   account_Limit = false,
//   isFocusColor = false,
//   handleFormClick = () => {},
//   dollarActive = false,
//   percentActive = false,
//   textColor = '',
//   ...rest
// }) {
//   const [isFocused, setIsFocused] = useState(false);
//   const [labelTop, setLabelTop] = useState(false);

//   const handleBlur = (e) => {
//     setIsFocused(false);
//     setLabelTop(!!e.target.value);
//     const { onBlur } = rest;
//     if (typeof onBlur === 'function') {
//       onBlur(e);
//     }
//   };

//   const handleFocus = (e) => {
//     setIsFocused(true);
//     setLabelTop(true);
//   };

//   const handleInputKeyDown = (e) => {
//     if (disableSymbols) {
//       [...symbolsMID].includes(e.key) && e.preventDefault();
//     }
//     if (dotNotAllow) {
//       e.which === 190 && e.preventDefault();
//     }
//     if (disableSpace) {
//       e.which === 32 && e.preventDefault();
//     }
//     if (disableNumbers) {
//       [...numbers].includes(e.key) && e.preventDefault();
//     }
//     if (disableAlphabets) {
//       [...alphabets].includes(e.key) && e.preventDefault();
//     }
//     if (disablePasswordSymbols) {
//       [...symbolPassCode].includes(e.key) && e.preventDefault();
//     }
//   };

//   useEffect(() => {
//     const { value } = rest;
//     setLabelTop(isFocused ? isFocused : !!value);
//   }, [rest]);

//   return (
//     <div
//       className={`${
//         specialStyle ? styles.form_field_Special : styles.form_field_MID
//       } flex items-center ${className} ${
//         isFocusColor && isFocused && styles.focus
//       }
//        ${error && styles.error} `}
//     >
//       {label && (
//         <label
//           className={`px-1 -ml-1 bg-cwhite absolute cursor-text ${
//             labelTop ? 'left-3' : 'left-14'
//           }  ${
//             labelTop && chargeBack && 'visibility: hidden'
//           } transform transition-all duration-100 ease-in
//             ${
//               labelTop
//                 ? `-top-1.5 -mt-0.5 ${styles.textErrorTopLabel}`
//                 : chargeBack
//                 ? 'top-1.5 text-sm'
//                 : 'top-1/4 text-sm'
//             }
//             ${
//               disabled
//                 ? 'text-cgy2 pointer-events-none'
//                 : labelTop
//                 ? 'text-cgy4'
//                 : 'text-cgy3'
//             }`}
//           htmlFor={id}
//         >
//           {label}
//           {optional && (
//             <span
//               className={`ml-2 text-xs   ${
//                 disabled ? 'text-cgy2 pointer-events-none' : 'text-cgy4'
//               }`}
//             >
//               {optional}
//             </span>
//           )}
//         </label>
//       )}
//       <div className="flex flex-row">
//         {unit.map((item, key) => (
//           <div key={key} onClick={() => handleFormClick(item)}>
//             <div
//               className={`w-4 mr-1 mt-1 text-sm font-bold cursor-pointer ${
//                 item === '$' && dollarActive
//                   ? 'bg-cm4 rounded-full text-[#fff] text-center'
//                   : 'text-cm3'
//               }
//               ${
//                 item === '%' && percentActive
//                   ? 'bg-cm4 rounded-full text-[#fff] text-center'
//                   : 'text-cm3'
//               }`}
//             >
//               {item}
//             </div>
//           </div>
//         ))}
//         <VBar className="flex-grow h-7 bg-cgy1" />
//       </div>
//       <NumericFormat
//         {...rest}
//         className={`${specialStyle ? 'w-20' : 'w-24'} z-10 ${
//           ACText ? '-ml-7' : 'ml-2'
//         } text-left ${disabled ? 'text-cgy2' : 'text-cgy4'} ${
//           (chargeBackText || ACText) && 'text-right'
//         } ${textColor} `}
//         customInput={Input}
//         decimalScale={2}
//         fixedDecimalScale={fixedDecimalScale}
//         thousandSeparator={thousandSeparator}
//         allowNegative={false}
//         isAllowed={({ value }) =>
//           specialStyle ? value <= 1000 : value < 10000000000
//         }
//         disabled={disabled}
//         ref={innerRef}
//         id={id}
//         onFocus={account_Limit ? rest.onFocus : handleFocus}
//         onBlur={handleBlur}
//         onKeyDown={handleInputKeyDown}
//         maxLength={maxLength}
//         autoFocus={autoFocus}
//         decimalSeparator={dotNotAllow === false && '.'}
//       />

//       {/* <span
//         className={`
//         ${styles.textErrorTopLabel} absolute -bottom-4 truncate text-crd5`}
//       >
//         {error}
//       </span>
//       {children} */}
//       <span
//         className={`
//         ${
//           styles.textErrorTopLabel
//         } absolute left-3 -bottom-4 truncate font-semibold
//         ${error && 'text-crd5'} ${errorClassName}`}
//       >
//         {error}
//       </span>
//     </div>
//   );
// }

// FormMIDReserve.propTypes = {
//   className: PropTypes.any,
//   errorClassName: PropTypes.any,
//   error: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
//   label: PropTypes.string,
//   id: PropTypes.any,
//   optional: PropTypes.any,
//   success: PropTypes.any,
//   unit: PropTypes.any,
//   locked: PropTypes.any,
//   disabled: PropTypes.any,
//   maxLength: PropTypes.any,
//   innerRef: PropTypes.any,
//   disableSymbols: PropTypes.any,
//   disableSpace: PropTypes.any,
//   dotNotAllow: PropTypes.any,
//   disableAlphabets: PropTypes.any,
//   disablePasswordSymbols: PropTypes.any,
//   disableNumbers: PropTypes.any,
//   thousandSeparator: PropTypes.any,
//   fixedDecimalScale: PropTypes.any,
//   autoFocus: PropTypes.any,
//   dollar: PropTypes.any,
//   dropdown: PropTypes.bool,
//   children: PropTypes.string,
//   specialStyle: PropTypes.any,
//   chargeBackText: PropTypes.any,
//   ACText: PropTypes.any,
//   chargeBack: PropTypes.any,
//   account_Limit: PropTypes.any,
//   AccountLimit: PropTypes.bool,
//   isFocusColor: PropTypes.any,
//   handleFormClick: PropTypes.func,
//   dollarActive: PropTypes.any,
//   percentActive: PropTypes.any,
//   textColor: PropTypes.any
// };

// const textEllipsis = (text, length) => {
//   if (!text) return '';
//   if (text.length <= length) return text;
//   return `${text.slice(0, length)}`;
// };

// // controllable form field for designed to control the styling and edit the content (for example refer minimum buy rates)
// // Please check the props and proptypes before using the component.
// export function EditFormField({
//   fieldStyling = false, // if input field is required pass true else pass false.
//   value,
//   defaultValue = 0,
//   maxLimit = 1000,
//   unit,
//   error,
//   ...props
// }) {
//   return (
//     <div
//       className={`${
//         fieldStyling &&
//         `h-[34px] border ${
//           error ? 'border-crd5' : 'border-cgy1'
//         } rounded-[10px] w-24 pl-3 py-1 flex items-center`
//       } relative`}
//     >
//       {fieldStyling && (
//         <>
//           <p className="font-bold text-sm text-cm3 mr-2.5">{unit}</p>
//           <div className="h-full mr-1 border border-cgy1" />
//         </>
//       )}
//       <NumericFormat
//         className={`w-full border-none h-full  ${
//           fieldStyling ? 'text-right pr-2.5' : 'text-center'
//         } focus:outline-none text-cgy4 font-semibold text-sm mr-0.5`}
//         isAllowed={(values) => {
//           const { value } = values;
//           return value < maxLimit;
//         }}
//         thousandSeparator=","
//         allowNegative={false}
//         decimalScale={2}
//         defaultValue={defaultValue}
//         value={value}
//         valueIsNumericString
//         fixedDecimalScale
//         placeholder="0.00"
//         displayType={fieldStyling ? 'input' : 'text'}
//         {...props}
//       />
//       <p className="text-crd5 text-[10px] font-semibold absolute w-max -bottom-[18px] left-3.5">
//         {error}
//       </p>
//     </div>
//   );
// }

// EditFormField.propTypes = {
//   fieldStyling: PropTypes.bool,
//   maxLimit: PropTypes.number,
//   value: PropTypes.number,
//   defaultValue: PropTypes.number,
//   id: PropTypes.string,
//   name: PropTypes.string,
//   unit: PropTypes.string,
//   error: PropTypes.string
// };

// export function BusinessFormSelect({
//   label,
//   optional,
//   message,
//   error,
//   className,
//   width,
//   disabled,
//   options = [
//     { value: 'Option 1', label: 'Option 1', high: '' },
//     { value: 'Option 2', label: 'Option 2', high: '' },
//     { value: 'Option 3', label: 'Option 3', high: '' }
//   ],
//   value = {},
//   onChange = () => {},
//   onBlur = () => {},
//   ...props
// }) {
//   const [isActive, setIsActive] = useState(false);
//   const [selectedOption, setSelectedOption] = useState({});
//   const [isHover, setIsHover] = useState(false);
//   const selectRef = useRef(null);

//   useOutsideClick(selectRef, () => {
//     setIsActive(false);
//   });

//   const handleOptionSelect = (option) => {
//     setIsActive(false);
//     setIsHover(false);
//     if (typeof onChange == 'function') {
//       onChange(option);
//     } else {
//       setSelectedOption(option);
//     }
//   };

//   const handleBlur = () => {
//     onBlur();
//   };

//   useEffect(() => {
//     setSelectedOption(value);
//   }, [value]);

//   return (
//     <div
//       className={`${styles.form_select_container} ${
//         width === 'small' ? ' w-48' : ' w-full'
//       }`}
//       ref={selectRef}
//     >
//       <div
//         className={`${styles.formSelect}
//         ${isActive && styles.focus}
//         ${error && styles.error}
//         ${disabled && styles.disabled} cursor-pointer`}
//         tabIndex="0"
//         onBlur={handleBlur}
//         onMouseEnter={() => setIsHover(true)}
//         onMouseLeave={() => setIsHover(false)}
//       >
//         <div
//           className={`text-cgy3 px-1 bg-cwhite absolute left-3 transform transition-all duration-100 ease-in ${
//             selectedOption
//               ? `-top-1.5 ${styles.textErrorTopLabel}`
//               : 'top-2.5 text-sm'
//           } ${disabled && 'text-cgy12'}`}
//           onClick={() => setIsActive(!isActive)}
//         >
//           {label}
//         </div>
//         <div
//           className={` ${styles.selected_option} ${
//             disabled && 'text-cgy12'
//           } flex gap-2`}
//           onClick={() => setIsActive(!isActive)}
//         >
//           {selectedOption?.label || ''}
//           {selectedOption?.high ? (
//             <div
//               className={`relative item inline-block px-1 top-[1px] w-[34px] h-[17px]`}
//             >
//               <span
//                 aria-hidden
//                 className={`absolute inset-0 rounded-md bg-crd8`}
//               ></span>

//               <span
//                 className={`relative bottom-[3px] text-crd5 text-[11px] font-bold`}
//               >
//                 High
//               </span>
//             </div>
//           ) : (
//             <div
//               className={`relative item inline-block px-1 top-[1px] w-[31px] h-[17px]`}
//             >
//               <span
//                 aria-hidden
//                 className={`absolute inset-0 rounded-md bg-cbl1`}
//               ></span>
//               <span
//                 className={`relative bottom-[3px] text-cbl5 text-[11px] font-bold`}
//               >
//                 Low
//               </span>
//             </div>
//           )}
//         </div>
//         {!disabled && (
//           <img
//             src={isActive || isHover ? arrowBlue : arrowGray}
//             width="8"
//             height="8"
//             className={`absolute transform rotate-90 top-3 right-3
//               ${isActive && '-rotate-90'}`}
//             onClick={() => setIsActive(!isActive)}
//           />
//         )}
//         {isActive && (
//           <>
//             <div className={`${styles.options_wrap}`}>
//               {options.map((x, i) => (
//                 <div
//                   key={i}
//                   className={`flex items-center justify-between pr-3 text-sm cursor-pointer hover:text-cm4
//                    ${
//                      selectedOption?.value === x?.value
//                        ? 'text-cm4'
//                        : 'text-cgy4'
//                    }`}
//                   onClick={() => handleOptionSelect(x)}
//                 >
//                   <span className="flex gap-2">
//                     {x.label}
//                     {x?.high ? (
//                       <div
//                         className={`relative item inline-block px-1 top-[1px] w-[34px] h-[17px]`}
//                       >
//                         <span
//                           aria-hidden
//                           className={`absolute inset-0 rounded-md bg-crd8`}
//                         ></span>

//                         <span
//                           className={`relative bottom-0.5 text-crd5 text-[11px] font-bold`}
//                         >
//                           High
//                         </span>
//                       </div>
//                     ) : (
//                       <div
//                         className={`relative item inline-block px-1 top-[1px] w-[31px] h-[17px]`}
//                       >
//                         <span
//                           aria-hidden
//                           className={`absolute inset-0 rounded-md bg-cbl1`}
//                         ></span>
//                         <span
//                           className={`relative bottom-0.5 text-cbl5 text-[11px] font-bold`}
//                         >
//                           Low
//                         </span>
//                       </div>
//                     )}
//                   </span>
//                   {selectedOption?.value === x?.value && (
//                     <img src={checkMarkIcon} width="15" height="10" />
//                   )}
//                 </div>
//               ))}
//             </div>
//             <div className="w-full h-4"></div>
//           </>
//         )}
//       </div>
//       <span
//         className={`
//         ${styles.textErrorTopLabel} absolute left-3 -bottom-3.5 text-ellipsis
//         ${error && 'text-crd5'}`}
//       >
//         {error || message}
//       </span>
//     </div>
//   );
// }

// export function FormSelectWithAddButton({
//   topLabel = '',
//   label = '',
//   dropdownClassName,
//   buttonName = '',
//   isPermissionDropdown = false,
//   options = [
//     { value: 'Option 1', label: 'Option 1' },
//     { value: 'Option 2', label: 'Option 2' },
//     { value: 'Option 3', label: 'Option 3' }
//   ],
//   value = {},
//   onChange = () => {},
//   onBlur = () => {},
//   error,
//   openDropdown = false,
//   onAddButtonClick = () => {}
// }) {
//   const addButtonRef = useRef(null);

//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);

//   useOutsideClick(addButtonRef, () => {
//     if (!openDropdown && isDropdownOpen) {
//       setIsDropdownOpen(false);
//     }
//   });

//   const handleBlur = () => {
//     onBlur();
//   };

//   const handleSelectOption = (option) => {
//     onChange(option);
//     setIsDropdownOpen(false);
//   };

//   useEffect(() => {
//     setIsDropdownOpen(false);
//   }, [value]);

//   return (
//     <div className="relative h-10 mb-[26px]" ref={addButtonRef}>
//       <div
//         className={`${
//           error && !isDropdownOpen && 'border-crd5'
//         } min-h-[40px] rounded-[10px] border bg-cwhite border-solid w-full absolute group ${
//           isDropdownOpen
//             ? `z-10 border-cbl11 ${styles.formSelectWithAddButton}`
//             : `border-cgy1 ${!error && 'hover:border-cbl11'}  ${
//                 styles.formSelectWithAddButtonClose
//               }`
//         }`}
//         tabIndex="0"
//         onBlur={handleBlur}
//       >
//         {value !== '' && (
//           <p className={styles.formAddButtonTopLabel}>{topLabel}</p>
//         )}
//         <button
//           type="button"
//           onClick={() => {
//             setIsDropdownOpen(!isDropdownOpen);
//           }}
//           className="flex h-[38px] justify-between items-center w-full px-3.5"
//         >
//           <span
//             className={`text-sm truncate ${
//               value ? 'text-cgy4 font-semibold' : 'text-cgy3'
//             }`}
//           >
//             {value ? value?.label : label}
//           </span>
//           <span
//             className={`icon-small-arrow1 text-[7px] transition-all ${
//               isDropdownOpen
//                 ? '!text-cgy26 rotate-180'
//                 : '!text-cgy3 group-hover:!text-cm4'
//             }`}
//           />
//         </button>
//         {isDropdownOpen && (
//           <div className={styles.formAddButtonMainOptionsList}>
//             <div className={`${dropdownClassName} ${styles.optionsSelector}`}>
//               {options.map((item, index) => {
//                 return (
//                   <button
//                     type="button"
//                     key={index}
//                     onClick={() => handleSelectOption(item)}
//                     className={`${styles.formAddButtonMainDropdownButton} w-full `}
//                   >
//                     <span
//                       className={`${styles.formAddButtonValueLabel} ${
//                         item?.value === value?.value &&
//                         styles.formAddButtonSelectedValue
//                       } w-full ${
//                         item?.value === value?.value && 'flex justify-between'
//                       }`}
//                     >
//                       <div className="flex items-center w-[85%]">
//                         <span className="break-all text-start">
//                           {item?.label}
//                         </span>
//                         {item?.isStar == true && (
//                           <span
//                             className={`${styles.formAddButtonStarIcon} icon-star`}
//                           />
//                         )}
//                       </div>
//                       {item?.value === value?.value && (
//                         <span
//                           className={`${styles.formAddButtonSuccessIcon} icon-tick`}
//                         />
//                       )}
//                     </span>
//                     {isPermissionDropdown && (
//                       <span className={`${styles.formAddButtonDescription}`}>
//                         {item?.description}
//                       </span>
//                     )}
//                   </button>
//                 );
//               })}
//             </div>
//             <div className={styles.formButtonDiv}>
//               <button
//                 type="button"
//                 onClick={onAddButtonClick}
//                 className={styles.formTextAddButtonSubmit}
//               >
//                 <span className={`icon-plus ${styles.formTextAddButtonIcon}`} />
//                 <span className={styles.formTextAddMainButton}>
//                   {buttonName}
//                 </span>
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//       <p className={styles.formTextAddButtonError}>{error}</p>
//     </div>
//   );
// }

// FormSelectWithAddButton.propTypes = {
//   buttonName: PropTypes.string,
//   isPermissionDropdown: PropTypes.bool,
//   label: PropTypes.string,
//   options: PropTypes.array,
//   topLabel: PropTypes.string,
//   value: PropTypes.object,
//   onChange: PropTypes.func,
//   onBlur: PropTypes.func,
//   error: PropTypes.string,
//   onAddButtonClick: PropTypes.func,
//   dropdownClassName: PropTypes.string
// };

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

// FormPhoneWithCode.propTypes = {
//   label: PropTypes.string,
//   countryCode: PropTypes.string,
//   className: PropTypes.string,
//   resetForm: PropTypes.bool,
//   value: PropTypes.string,
//   id: PropTypes.any,
//   showSearchIcon: PropTypes.bool,
//   optional: PropTypes.bool,
//   message: PropTypes.string,
//   error: PropTypes.string,
//   disabled: PropTypes.bool,
//   options: PropTypes.array,
//   textSmall: PropTypes.bool,
//   onCodeChange: PropTypes.any,
//   selectedCode: PropTypes.any,
//   showEditIcon: PropTypes.bool,
//   errorClassName: PropTypes.string
// };

// export function TextAreaField({
//   id,
//   className,
//   label,
//   value,
//   error,
//   disabled = false,
//   disableNumbers = false,
//   disableAlphabets = false,
//   disableSymbols = false,
//   charLimit = 0,
//   placeHolder = '',
//   textClassName = '',
//   ...rest
// }) {
//   const [isFocused, setIsFocused] = useState(false);
//   const [labelTop, setLabelTop] = useState(false);
//   const [charCount, setCharCount] = useState(0);

//   const handleBlur = (e) => {
//     setIsFocused(false);
//     setLabelTop(!!e.target.value);
//     const { onBlur } = rest;
//     if (typeof onBlur === 'function') {
//       onBlur(e);
//     }
//   };

//   const handleFocus = () => {
//     setIsFocused(true);
//     setLabelTop(true);
//   };

//   const handleChange = (e) => {
//     const msgLength = e.target.value.length;
//     if (msgLength > charLimit) return;
//     const { onChange } = rest;
//     if (typeof onChange === 'function') {
//       onChange(e);
//     }
//   };

//   const handleKeyDown = (e) => {
//     if (disableSymbols) {
//       [...symbols].includes(e.key) && e.preventDefault();
//     }
//     if (disableNumbers) {
//       [...numbers].includes(e.key) && e.preventDefault();
//     }
//     if (disableAlphabets) {
//       [...alphabets].includes(e.key) && e.preventDefault();
//     }
//   };

//   useEffect(() => {
//     setLabelTop(isFocused ? isFocused : !!value);
//     if (value) {
//       setCharCount(`${value}`.length);
//     } else if (value == ' ') {
//       setCharCount(0);
//     } else {
//       setCharCount(0);
//     }
//     // eslint-disable-next-line
//   }, [value]);

//   return (
//     <div className={`${styles.textAreaForm} ${className}`}>
//       {label && (
//         <label
//           className={` ${styles.label}
//             ${labelTop ? styles.isLabelTop : styles.isnotLabelTop}
//              ${disabled && styles.isDisabled}`}
//           htmlFor={id}
//         >
//           {label}
//         </label>
//       )}
//       <textarea
//         {...rest}
//         id={id}
//         value={value}
//         placeholder={
//           labelTop && placeHolder ? placeHolder : labelTop ? label : ''
//         }
//         onFocus={handleFocus}
//         onBlur={handleBlur}
//         onKeyDown={handleKeyDown}
//         onChange={handleChange}
//         maxLength={charLimit}
//         className={`${styles.textArea}
//         ${textClassName}
//         ${error && !isFocused && styles.textAreaError}
//         ${disabled && styles.disabled}
//         `}
//       />
//       {charLimit && (
//         <span className={styles.charText}>
//           {charCount} / {charLimit}
//         </span>
//       )}
//       <span className={styles.textError}>{error}</span>
//     </div>
//   );
// }

// TextAreaField.propTypes = {
//   charLimit: PropTypes.number,
//   className: PropTypes.string,
//   disableAlphabets: PropTypes.bool,
//   disableNumbers: PropTypes.bool,
//   disableSymbols: PropTypes.bool,
//   disabled: PropTypes.bool,
//   error: PropTypes.string,
//   id: PropTypes.any,
//   label: PropTypes.any,
//   textClassName: PropTypes.string,
//   value: PropTypes.string
// };
