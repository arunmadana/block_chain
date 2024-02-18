import React from "react";
import "./Chip.style.scss";

const Chip = ({
  color = "green",
  children,
  className = "",
  backgroundColor = "",
  onClick = () => {},
  chipWidth = true,
}) => {
  return (
    <div
      className={` ${chipWidth ? "chip" : "chipset"} chip--${
        backgroundColor === "" ? color : backgroundColor
      } ${className}`}
      onClick={onClick}
      data-testid="chipid"
    >
      <div data-testid="colorChip" className={`chip__text--${color} `}>
        {children}
      </div>
    </div>
  );
};

export default Chip;
