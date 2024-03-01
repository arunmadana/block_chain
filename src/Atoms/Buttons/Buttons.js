import PropTypes from 'prop-types';
import React, { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import Spinner from '../Spinner/Spinner';
import styles from './Buttons.module.scss';
import './Buttons.style.scss';
import { useLocation } from 'react-router-dom';
import { useCycle } from 'framer-motion';
import MultiColorIcon from '../MultiColorIcon/MultiColorIcon';
import { useOutsideClick } from '../../Hooks/useOutsideClick';

export const CustomButton = ({
  id = '',
  className,
  children,
  icon,
  disable,
  isSelected = false,
  small = false,
  onClick,
  onBlur,
  border = false,
  'ui-auto': ui_auto = '',
  ...props
}) => {
  return (
    <button
      data-testid="customButton"
      className={` text-sm
      ${styles.btn} ${styles.btn__custom_button}  ${
        small ? `${styles.btn__icon__small}` : ''
      } ${isSelected ? `${styles.Active}` : ''} ${className} ${
        border && `${styles.buttonBorder}`
      }`}
      onClick={onClick}
      onBlur={onBlur}
      id={id}
      disabled={disable}
      ui-auto={ui_auto}
      {...props}
    >
      {icon != null ? (
        <MultiColorIcon
          icon={icon}
          className={`btn__custom_button__icon relative right-2`}
        />
      ) : null}
      {children}
    </button>
  );
};

CustomButton.propTypes = {
  variation: PropTypes.oneOf(['primary', 'secondary']),
  color: PropTypes.string,
  icon: PropTypes.string,
  children: PropTypes.string,
  small: PropTypes.bool,
  onClick: PropTypes.func,
  disable: PropTypes.bool,
  className: PropTypes.string,
  isSelected: PropTypes.bool,
  id: PropTypes.string,
  onBlur: PropTypes.any,
  border: PropTypes.bool
};
export const WalletButton = ({
  id = '',
  label = '',
  className,
  onClick = () => {}
}) => {
  return (
    <button
      data-testid="walletButton"
      id={id}
      type="button"
      className={`font-semibold cursor-pointer text-sm hover:underline hover:text-cm4 ${className}`}
      onClick={onClick}
    >
      {label}
    </button>
  );
};

WalletButton.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string.isRequired,
  className: PropTypes.string,
  onClick: PropTypes.func
};
export const Button = ({
  id = '',
  className = '',
  color = 'yellow',
  children,
  isLoading,
  disable = false,
  onClick = () => {},
  ...props
}) => {
  return (
    <button
      onClick={onClick}
      className={` ${styles.btn} ${styles.btn__primary} btn--primary--${color} ${className}`}
      disabled={disable || props.disabled || isLoading}
      id={id}
      {...props}
      data-testid="normal_Button"
    >
      {children}
      {isLoading && (
        <div className={`${styles.btn__loading_overlay}`}>
          <Spinner size={20} />
        </div>
      )}
    </button>
  );
};

Button.propTypes = {
  color: PropTypes.string,
  children: PropTypes.string,
  onClick: PropTypes.func,
  disable: PropTypes.bool,
  isLoading: PropTypes.bool,
  className: PropTypes.string,
  id: PropTypes.string,
  disabled: PropTypes.any
};

export const SecondaryButton = ({
  children = '',
  onClick = () => {},
  disable = false,
  className = '',
  id = '',
  ...props
}) => {
  return (
    <button
      onClick={onClick}
      className={` ${styles.btn} ${styles.btn__secondary} ${className}`}
      disabled={disable}
      id={id}
      {...props}
    >
      {children}
    </button>
  );
};

SecondaryButton.propTypes = {
  onClick: PropTypes.func,
  disable: PropTypes.bool,
  children: PropTypes.string,
  className: PropTypes.string,
  id: PropTypes.string
};

export const CancelButton = ({
  id = '',
  label = '',
  onClick = () => {},
  disable = false,
  className = '',
  children,
  ...props
}) => {
  return (
    <button
      id={id}
      data-testid={id}
      className={`group w-[170px] border-cm3 hover:bg-cgn12 border-2 text-sm font-bold text-center rounded-full text-cm3 cursor-pointer h-9 ${className}`}
      disabled={disable}
      type="button"
      onClick={onClick}
      {...props}
    >
      {children || label}
    </button>
  );
};

CancelButton.propTypes = {
  onClick: PropTypes.func,
  disable: PropTypes.bool,
  className: PropTypes.string,
  label: PropTypes.string,
  children: PropTypes.node,
  id: PropTypes.string
};

export const AnchorButton = ({
  id,
  className,
  children,
  disable,
  onClick,
  ...props
}) => {
  return (
    <button
      onClick={onClick}
      className={` ${styles.btn} ${styles.btn__anchor} ${className}`}
      disabled={disable}
      id={id}
      {...props}
    >
      {children}
    </button>
  );
};

AnchorButton.propTypes = {
  onClick: PropTypes.func,
  disable: PropTypes.bool,
  children: PropTypes.string,
  className: PropTypes.string,
  label: PropTypes.string,
  id: PropTypes.string
};

export const LinkButton = ({
  id,
  children,
  icon = '',
  locked = false,
  url,
  href,
  to,
  onClick = () => {},
  size,
  open,
  ...props
}) => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (location.pathname.includes(url)) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [location.pathname, url]);
  return (
    <NavLink
      className={`btn--link ${locked ? 'disabled' : ''} group`}
      to={to || url || href}
      disabled={locked}
      id={id}
      onClick={onClick}
      {...props}
    >
      {icon && (
        <div className="-ml-4 3xl:-ml-1">
          <span className={`icon-${icon} btn--link__icon text-${size}`} />
        </div>
      )}
      <span className="-ml-4 btn--link__label">{children}</span>
      {locked && <span className="icon-lock" />}
      <span
        className={`${styles.rightIcon} icon-arrow-down text-cm3 relative ${
          isOpen && open ? 'opacity-100' : 'opacity-0'
        } ${open && 'group-hover:opacity-100 '}`}
      />
    </NavLink>
  );
};

LinkButton.propTypes = {
  onClick: PropTypes.func,
  id: PropTypes.string,
  disable: PropTypes.bool,
  locked: PropTypes.bool,
  className: PropTypes.string,
  children: PropTypes.string,
  url: PropTypes.any,
  href: PropTypes.any,
  to: PropTypes.any,
  open: PropTypes.any,
  size: PropTypes.any,
  icon: PropTypes.string
};

export const TextButton = ({
  id = '',
  children = '',
  className = '',
  onClick = () => {},
  disable,
  ...props
}) => {
  return (
    <button
      onClick={onClick}
      className={` ${styles.btn} ${styles.btn__text} ${className}`}
      disabled={disable}
      id={id}
      {...props}
    >
      {children}
    </button>
  );
};

TextButton.propTypes = {
  id: PropTypes.string,
  children: PropTypes.string,
  className: PropTypes.string,
  disable: PropTypes.bool,
  onClick: PropTypes.func
};

export const ActionButton = ({
  id = '',
  color = '',
  children,
  onClick,
  disable,
  className,
  ...props
}) => {
  return (
    <button
      onClick={onClick}
      className={`${styles.btn} ${styles.btn__action} ${className} ${
        color ? `${className}--${color}` : ''
      } `}
      disabled={disable}
      id={id}
      {...props}
    >
      {children}
    </button>
  );
};

ActionButton.propTypes = {
  color: PropTypes.string,
  onClick: PropTypes.func,
  disable: PropTypes.bool,
  children: PropTypes.string,
  className: PropTypes.string,
  id: PropTypes.string
};

export const BigButton = ({
  onClick,
  color = 'green',
  children,
  className,
  id = '',
  disable,
  ...props
}) => (
  <button
    onClick={onClick}
    className={`bigButton bigButton--${color ? color : 'green'} ${className}`}
    disabled={disable}
    id={id}
    {...props}
  >
    {children}
  </button>
);

BigButton.propTypes = {
  onClick: PropTypes.func,
  color: PropTypes.oneOf(['green', 'yellow']),
  disable: PropTypes.bool,
  children: PropTypes.string,
  className: PropTypes.string,
  id: PropTypes.string
};

export const GiantButton = ({ label, image, id }) => (
  <button className={`${styles.btn} ${styles.btn__giant}`} id={id}>
    <img src={image} alt={label} className={`${styles.giant_button_image}`} />
    <span className={`${styles.giant_button_label}`}>{label}</span>
  </button>
);

GiantButton.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string,
  image: PropTypes.string,
  className: PropTypes.string,
  onClick: PropTypes.func
};

export const PrimaryButton = ({
  id = '',
  label = '',
  children,
  className = '',
  disable = false,
  type = 'button',
  onClick = () => {}
}) => {
  return (
    <button
      id={id}
      disabled={disable}
      data-testid={id}
      className={`${styles.primaryButton} ${
        !disable ? styles.notDisable : styles.isDisable
      } ${className}`}
      onClick={onClick}
      type={type}
    >
      {children || label}
    </button>
  );
};

PrimaryButton.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string,
  children: PropTypes.node,
  className: PropTypes.string,
  disable: PropTypes.bool,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  onClick: PropTypes.func
};

export const AddingButton = ({
  id = '',
  label = '',
  children,
  className = '',
  disable = false,
  type = 'button',
  icon,
  size,
  color = 'bg-cm3',
  onClick = () => {},
  disableClassName = ''
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
      {icon && (
        <span
          className={`icon-${icon} btn--link__icon text-${size} mr-[10px] ;`}
        />
      )}
      {children || label}
    </button>
  );
};

AddingButton.propTypes = {
  icon: PropTypes.any,
  size: PropTypes.any,
  color: PropTypes.any,
  id: PropTypes.string,
  label: PropTypes.string,
  children: PropTypes.node,
  className: PropTypes.string,
  disable: PropTypes.bool,
  disableClassName: PropTypes.string,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  onClick: PropTypes.func
};

export const GrayButton = ({
  id = '',
  label = '',
  children,
  className = '',
  disable = false,
  type = 'button',
  icon,
  size,
  color,
  onClick = () => {}
}) => {
  return (
    <button
      id={id}
      disabled={disable}
      data-testid={id}
      className={`px-6 py-3 rounded-lg font-bold text-center transition-all ease bg-cm1 hover:bg-cgy12 text-cgy2 ${className} ${
        color ? 'text-cgy3' : ''
      }`}
      onClick={onClick}
      type={type}
    >
      {icon && (
        <span className={`icon-${icon} btn--link__icon text-${size} mr-1.5`} />
      )}
      {children || label}
    </button>
  );
};
GrayButton.propTypes = {
  icon: PropTypes.string,
  size: PropTypes.any,
  color: PropTypes.any,
  id: PropTypes.string,
  label: PropTypes.string,
  children: PropTypes.node,
  className: PropTypes.string,
  disable: PropTypes.bool,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  onClick: PropTypes.func
};

export const SignupButton = ({
  id = '',
  label = '',
  className = '',
  disable = false,
  type = 'button',
  onClick = () => {}
}) => {
  return (
    <button
      id={id}
      disabled={disable}
      data-testid={id}
      className={`w-60 h-9 rounded-full font-bold text-center transition-all ease
      ${
        !disable
          ? 'bg-cm3 hover:opacity-100 opacity-80 text-cwhite'
          : styles.isDisabledTrue
      } ${className}`}
      onClick={onClick}
      type={type}
      style={{ fontSize: '14px' }}
    >
      {label}
    </button>
  );
};

SignupButton.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string.isRequired,
  className: PropTypes.string,
  disable: PropTypes.bool,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  onClick: PropTypes.func
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

PrimaryButtonSmall.propTypes = {
  id: PropTypes.string,
  children: PropTypes.node,
  className: PropTypes.string,
  disable: PropTypes.bool,
  type: PropTypes.string,
  onClick: PropTypes.func,
  label: PropTypes.string,
  leftImage: PropTypes.any,
  rightImage: PropTypes.any,
  isActionButton: PropTypes.bool
};

export const FilterButton = ({
  id = '',
  label = '',
  className,
  onClick = () => {}
}) => {
  return (
    <button
      id={id}
      data-testid={id}
      type="button"
      className={`${styles.group} ${styles.boxShadow} group w-24 bg-cwhite p-2.5
        flex flex-row justify-around rounded-lg
        cursor-pointer text-cgy4 font-semibold text-center ${className}`}
      onClick={onClick}
    >
      <div className="flex space-x-1.5">
        <div className={`${styles.filterIcon} w-5 h-5`}></div>
        <div className="p-0.5 group-hover:text-cm3">{label}</div>
      </div>
    </button>
  );
};

FilterButton.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string.isRequired,
  className: PropTypes.string,
  onClick: PropTypes.func
};

export const ExportButton = ({
  id = '',
  label = '',
  className,
  font = true,
  onClick = () => {}
}) => {
  return (
    <button
      id={id}
      data-testid={id}
      type="button"
      className={`${styles.group} ${styles.boxShadow} group w-24 p-2.5 bg-cwhite
        flex flex-row justify-around rounded-lg cursor-pointer text-cgy4
        font-semibold text-center ${className}`}
      onClick={onClick}
    >
      <div className="flex space-x-1.5">
        <div className={`${styles.exportIcon} w-5 h-5`}></div>
        <div
          className={`${
            font ? 'text-base' : 'text-sm'
          } p-0.5 group-hover:text-cm3`}
        >
          {label}
        </div>
      </div>
    </button>
  );
};

ExportButton.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string.isRequired,
  className: PropTypes.string,
  onClick: PropTypes.func,
  font: PropTypes.bool
};

export const ReminderButton = ({
  id = '',
  label = '',
  className,
  onClick = () => {}
}) => {
  return (
    <button
      id={id}
      data-testid={id}
      type="button"
      className={`w-20 p-1 bg-cm3 hover:bg-cm4 rounded-full text-xs text-cwhite
        font-semibold text-center cursor-pointer ${className}`}
      onClick={onClick}
    >
      {label}
    </button>
  );
};

ReminderButton.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string.isRequired,
  className: PropTypes.string,
  onClick: PropTypes.func
};

export const GreenButton = ({
  id = '',
  label = '',
  className,
  onClick = () => {}
}) => {
  return (
    <button
      id={id}
      data-testid={id}
      type="button"
      className={`w-52 p-2.5 bg-cgn5 hover:bg-cgn6 rounded-full text-cwhite text-xs text-center transition-all ease font-semibold cursor-pointer ${className}`}
      onClick={onClick}
    >
      {label}
    </button>
  );
};

GreenButton.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string.isRequired,
  className: PropTypes.string,
  onClick: PropTypes.func
};

export const BorderButton = ({
  children,
  onClick,
  disable,
  className,
  ...props
}) => {
  return (
    <button
      onClick={onClick}
      className={` btn btn--bordered ${className}`}
      disabled={disable}
      {...props}
    >
      {children}
    </button>
  );
};

BorderButton.propTypes = {
  children: PropTypes.any,
  disable: PropTypes.bool,
  className: PropTypes.any,
  onClick: PropTypes.func
};

export const ButtonSVG = ({
  svgIcon,
  iconSize = 12,
  className = '',
  children = '',
  ...props
}) => {
  return (
    <button className={`btn btn--svg btn--icon  ${className}`} {...props}>
      <img
        className="btn--svg__icon"
        width={iconSize}
        src={svgIcon}
        alt={`${children} icon`}
      />
      {children}
    </button>
  );
};

ButtonSVG.propTypes = {
  children: PropTypes.any,
  svgIcon: PropTypes.any,
  className: PropTypes.any,
  iconSize: PropTypes.any
};

export const MenuItemLinkButton = ({
  icon = '',
  url,
  label,
  onClick = () => {},
  open
}) => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(open);
  const [isSelectedButton, setIsSelectedButton] = useState(false);
  const [isClosed, setIsClosed] = useCycle(false, true);

  const onClickButton = (url) => {
    if (location.pathname.includes(url)) {
      setIsSelectedButton((prev) => !prev);
      setIsClosed(false);
    } else {
      setIsSelectedButton(true);
      setIsClosed(true);
    }
  };

  const buttonCloseRef = useRef(null);
  useOutsideClick(buttonCloseRef, () => {
    setIsOpen(false);
  });

  useEffect(() => {
    if (location.pathname.includes(url)) {
      setIsSelectedButton(true);
      setIsClosed(false);
    } else {
      setIsSelectedButton(false);
      setIsClosed(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location?.pathname, url]);

  return isOpen ? (
    <button
      className={`flex flex-col justify-center group ${
        styles.mainMenuButtonContainer
      } ${isSelectedButton ? `${styles.buttonActive}` : ''}`}
      onClick={() => {
        onClick();
        onClickButton(url);
      }}
      // ref={buttonCloseRef}
    >
      <div className="flex flex-row items-center justify-between gap-2 menu_item_small">
        <div
          className={`flex flex-row items-center sm:w-52 3xl:w-56  justify-evenly ${styles.menuItemsContent}
          ${styles.divArrowSelected}`}
        >
          <span className={`icon-${icon} w-9 text-3xl ${styles.iconMargin}`} />
          <span
            className={`${styles.buttonLabel}
              ${styles.activeLabel}`}
          >
            {label}
          </span>
        </div>
        <span
          className={`icon-small-arrow -ml-4 3xl:-ml-1 group-hover:text-cm3 ${
            styles.icon_arrow_right
          }
          ${styles.arrowSelected} ${
            isSelectedButton ? 'text-cm3' : 'text-cwhite'
          }`}
        ></span>
      </div>
    </button>
  ) : (
    <div ref={buttonCloseRef}>
      <button
        className={`flex flex-col justify-center group ${
          styles.ButtonContainerForLowerRes
        } ${isSelectedButton ? `${styles.buttonActive}` : ''}`}
        onClick={() => {
          onClick();
          onClickButton(url);
        }}
      >
        <div className="flex flex-row items-center justify-between gap-1 menu_item_small">
          <div
            className={`flex flex-row items-center  justify-evenly gap-2
            ${styles.menuItemsContent} ${styles.divArrowSelected}`}
          >
            <span
              className={`icon-${icon}  ml-1.5 text-3xl text-cgy3 ${
                isSelectedButton && 'text-cm3'
              }`}
            />
          </div>
        </div>
      </button>
    </div>
  );
};

MenuItemLinkButton.propTypes = {
  label: PropTypes.string,
  item: PropTypes.any,
  icon: PropTypes.any,
  url: PropTypes.string,
  onClick: PropTypes.func,
  size: PropTypes.any,
  open: PropTypes.bool
};

export const KeysButton = ({
  labelName = '',
  className = '',
  active = false,
  onClick = () => {}
}) => {
  return (
    <button
      className={`flex items-center mb-3 justify-between ${className}`}
      type="button"
      onClick={() => onClick()}
    >
      <span
        className={`text-xs xl:text-sm  font-semibold hover:text-cm3 ${
          active ? 'text-cgy4' : 'text-cgy3'
        } `}
      >
        {labelName}
      </span>
      {active && <span className="text-xs icon-arrow-right text-cm3" />}
    </button>
  );
};

KeysButton.propTypes = {
  active: PropTypes.bool,
  labelName: PropTypes.string,
  className: PropTypes.string,
  onClick: PropTypes.func
};

export const NewMenuLinkButton = ({
  icon,
  open,
  label,
  onClick = () => {},
  url
}) => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(open);
  const [isSelectedButton, setIsSelectedButton] = useState(false);

  const onClickButton = (url) => {
    if (location.pathname.includes(url)) {
      setIsSelectedButton(true);
    } else {
      setIsSelectedButton(false);
    }
  };

  const buttonCloseRef = useRef(null);
  useOutsideClick(buttonCloseRef, () => {
    if (isOpen) {
      setIsOpen(false);
    }
  });

  useEffect(() => {
    setIsOpen(open);
    if (location.pathname.includes(url)) {
      setIsSelectedButton(true);
    } else {
      setIsSelectedButton(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location?.pathname, url, open]);

  return isOpen ? (
    <button
      type="button"
      className={`${styles.mainMenueSideButton} ${
        isSelectedButton && styles.mainMenueSideButtonActiveClass
      }`}
      onClick={() => {
        onClick();
        onClickButton(url);
      }}
    >
      <div className={styles.iconLabelContainer}>
        <span
          className={`icon-${icon} ${styles.iconSize}`}
          data-testid={`icon-${icon}`}
        />
        <span className={styles.labelClass}>{label}</span>
      </div>
      <span className={`icon-small-arrow1 ${styles.sideArrowClass}`} />
    </button>
  ) : (
    <div ref={buttonCloseRef}>
      <button
        type="button"
        onClick={() => {
          onClick();
          onClickButton(url);
        }}
        className={`${styles.lowerButtonContainer} ${
          isSelectedButton && styles.activeLowerButton
        }`}
      >
        <span
          className={`icon-${icon} ${styles.lowerIconSize}`}
          data-testid={`icon-${icon}`}
        />
        {isSelectedButton && (
          <span className={`icon-small-arrow1 ${styles.lowerSideArrowClass}`} />
        )}
      </button>
    </div>
  );
};

NewMenuLinkButton.propTypes = {
  icon: PropTypes.any,
  label: PropTypes.string,
  onClick: PropTypes.func,
  open: PropTypes.bool,
  url: PropTypes.string
};
