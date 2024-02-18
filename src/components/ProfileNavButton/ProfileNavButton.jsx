import React from "react";
import { NavLink } from "react-router-dom";
import styles from "./ProfileNavButton.module.scss";
import ArrowRight from "../../assets/ryvyl_arrow.svg";

export function ProfileNavButton({
  id = "",
  to = "",
  label = "",
  activeClassName,
  imgClassName,
}) {
  return (
    <NavLink
      id={id}
      data-testid={id}
      to={to}
      className={`
        ${styles.profile_nav_btn} ${activeClassName}`}
    >
      <span>{label}</span>
      <img
        className={`${styles.caret} ${imgClassName}`}
        src={ArrowRight}
        alt={`arrow-${id}`}
      />
    </NavLink>
  );
}
