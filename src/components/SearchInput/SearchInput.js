import React, { useRef, useState } from "react";
import "./SearchInput.style.scss";
import { useOutsideClick } from "../../Hooks/useOutsideClick";

export default function SearchInput({
  border = false,
  merchant,
  error,
  success,
  searchBtn,
  onIconClick,
  className,
  searchIconClassName,
  errorClassName,
  disable,
  maxLength,
  reserveHistory,
  disableSpace = false,
  ...props
}) {
  const [isFocus, setIsFocus] = useState(false);
  const ref = useRef(null);
  useOutsideClick(ref, () => {
    setIsFocus(false);
  });

  const handleChange = (e) => {
    if (e.key === "Enter") {
      onIconClick();
    }
    // Checking space charCode to disable space
    if (disableSpace) {
      e.which === 32 && e.preventDefault();
    }
  };

  const handleBlur = (e) => {
    setIsFocus(false);
    const { onBlur } = props;
    if (typeof onBlur === "function") {
      onBlur(e);
    }
  };

  return (
    <div
      className={`search-input flex flex-col group ${
        merchant && "reserve-search"
      } ${reserveHistory && "reserve-history-search"}`}
      ref={ref}
      data-testid="search_input"
    >
      <input
        maxLength={maxLength}
        className={`${
          searchBtn ? "form-input" : "form-input-search"
        } focus:!border-cm10 pl-3.5 ${
          error ? "error" : success ? "success" : ""
        } ${className} ${disable ? "cursor-default" : "cursor-pointer"} ${
          border && "search-border"
        }`}
        disabled={disable}
        onFocus={() => {
          setIsFocus(true);
        }}
        onBlur={handleBlur}
        onKeyDown={handleChange}
        id="searchFocus"
        {...props}
        data-testid="form-input"
      />
      {searchBtn && (
        <button
          disabled={disable}
          type="submit"
          htmlFor="searchFocus"
          onClick={onIconClick}
          className={`icon-search ${!disable && "group-hover:text-[#0460E3]"} ${
            isFocus === true && "focus-icon"
          } ${searchIconClassName}`}
        />
      )}
      <span className={`search-input__error-msg ${errorClassName}`}>
        {error}
      </span>
    </div>
  );
}
