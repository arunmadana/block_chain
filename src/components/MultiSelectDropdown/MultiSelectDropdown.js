import { useRef, useState } from "react";
import styles from "./MultiSelectDropdown.module.scss";
import { useOutsideClick } from "../../Hooks/useOutsideClick";
import { textEllipsis } from "../../helpers/textEllipsis";

/**
 *  How to use the multiSelectDropdown
 * 1. In Parent component we have to call this child component
 * 2. We have to define what option we have to show
 * example:-
 * const option = [
 * { value: false, label: 'option 1' },
 * { value: false, label: 'option 2' },
 * { value: false, label: 'option 3' },
 * { value: false, label: 'option 4' }
 * ];
 * 4. onChange props:-
 * const handleChangeOption = (event) => {
 *  const clickedItem = selectedOption.find(
 *      (item) => item.value === event.target.value)};
 * 5.selectedOptions prop is to pass items selected from parent to child
 */

export const MultiSelectDropdown = ({
  className,
  onChange,
  optionsList,
  selectedOptions = [],
  primaryLabel = "Status",
  secondaryLabel = "Statuses",
  isCountShow = false,
  disable = false,
}) => {
  const multiSelectDropdownRef = useRef(null);
  const [open, setOpen] = useState(false); // State for toggle the dropdown

  // function for handling the dropDown
  const handleToggle = () => {
    if (!disable) {
      setOpen(!open);
    }
  };

  // closing dropdown while clicking outside
  useOutsideClick(multiSelectDropdownRef, () => {
    if (open) {
      setOpen(false);
    }
  });

  const labelItems = optionsList?.map((item, i) => (
    <div
      className=" h-6 px-1 mb-2.5 rounded-[5px] transition-all ease-in duration-300  cursor-pointer"
      key={i}
    >
      <span className="h-[18px] text-cgy4">
        <label
          className={`${styles.checkbox} flex items-center text-xs cursor-pointer h-full gap-2`}
        >
          <input
            type="checkbox"
            value={item?.value}
            name={item?.label}
            onChange={(e) => {
              onChange(e, item);
            }}
            checked={selectedOptions?.some((x) => x.label === item.label)}
            className="appearance-none px-[2px] w-[17px] h-[17px] rounded-[5px] bg-cwhite cursor-pointer outline-none border-[1px] border-cgy2"
            data-testid={`checkBox${i}`}
          />
          {item?.label}
          {isCountShow && <span className="-ml-1">({item?.count})</span>}
        </label>
      </span>
    </div>
  ));

  return (
    <>
      <div
        data-testid="dropDown"
        className={`z-10 absolute ${
          disable ? "cursor-default" : "cursor-pointer"
        } w-60 border-[1px] border-cgy1 shadow-cgy6 rounded-[10px] bg-cwhite ${
          disable ? "" : styles.hover
        } ${
          open ? `${styles.openstate}` : `${styles.hoverstate} `
        } ${className}`}
        ref={multiSelectDropdownRef}
      >
        <div
          className="h-10 rounded-[10px] px-3 flex justify-between items-center group"
          onClick={handleToggle}
          data-testid="toggleButton"
        >
          <span
            className={`text-sm ${
              open && selectedOptions?.length
                ? "font-semibold"
                : "font-semibold"
            } flex items-center
             ${selectedOptions?.length ? "text-cgy4" : "text-cgy3"}`}
          >
            {`${
              selectedOptions?.length
                ? secondaryLabel?.length > 25
                  ? textEllipsis(secondaryLabel, 25) //to display as ... after certain characters as per wireframe
                  : secondaryLabel
                : primaryLabel
            }`}
          </span>
          <span>
            {open ? (
              <div
                className={`icon-small-arrow1 transition-all ${styles.openMultiSelect}`}
              />
            ) : (
              <div
                className={`icon-small-arrow1 transition-all ${
                  disable ? "" : "group-hover:text-cm4"
                } ${styles.closedDropdown}`}
              />
            )}
          </span>
        </div>
        {open && <div className="px-2 mb-1">{labelItems}</div>}
      </div>
    </>
  );
};
