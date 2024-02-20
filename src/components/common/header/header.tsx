import { Fragment, useEffect, useState } from "react";
import { Dropdown } from "react-bootstrap";
import { connect, useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { logout } from "../../../Store/ducks/auth";
import desktopdark from "../../../assets/desktop-dark.png";
import desktoplogo from "../../../assets/desktop-logo.png";
import desktopwhite from "../../../assets/desktop-white.png";
import toggledark from "../../../assets/toggle-dark.png";
import togglelogo from "../../../assets/toggle-logo.png";
import togglewhite from "../../../assets/toggle-white.png";
import { useNavigate } from "react-router-dom";
import { fetchUserDetailsAction } from "../../../Store/ducks/adminUserDetails";
import capitalizeFirstLetter from "../../../helpers/capitalizeFirstLetter";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [fullScreen, setFullScreen] = useState(false);
  const { firstName, lastName } = useSelector(
    (store) => store?.adminUserDetails?.data
  );

  const toggleFullScreen = () => {
    const elem = document.documentElement;
    if (!document.fullscreenElement) {
      elem.requestFullscreen().then(() => setFullScreen(true));
    } else {
      document.exitFullscreen().then(() => setFullScreen(false));
    }
  };

  const handleFullscreenChange = () => {
    setFullScreen(!!document.fullscreenElement);
  };

  useEffect(() => {
    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  // function menuClose() {
  //   const theme = store.getState();
  //   ThemeChanger({ ...theme, toggled: "close" });
  // }

  // const toggleSidebar = () => {
  //   const theme = store.getState();
  //   const sidemenuType = theme.dataNavLayout;
  //   if (window.innerWidth >= 992) {
  //     if (sidemenuType === "vertical") {
  //       const verticalStyle = theme.dataVerticalStyle;
  //       const navStyle = theme.dataNavStyle;
  //       switch (verticalStyle) {
  //         // closed
  //         case "closed":
  //           ThemeChanger({ ...theme, dataNavStyle: "" });
  //           if (theme.toggled === "close-menu-close") {
  //             ThemeChanger({ ...theme, toggled: "" });
  //           } else {
  //             ThemeChanger({ ...theme, toggled: "close-menu-close" });
  //           }
  //           break;
  //         // icon-overlay
  //         case "overlay":
  //           ThemeChanger({ ...theme, dataNavStyle: "" });
  //           if (theme.toggled === "icon-overlay-close") {
  //             ThemeChanger({ ...theme, toggled: "" });
  //           } else {
  //             if (window.innerWidth >= 992) {
  //               ThemeChanger({ ...theme, toggled: "icon-overlay-close" });
  //             }
  //           }
  //           break;
  //         // icon-text
  //         case "icontext":
  //           ThemeChanger({ ...theme, dataNavStyle: "" });
  //           if (theme.toggled === "icon-text-close") {
  //             ThemeChanger({ ...theme, toggled: "" });
  //           } else {
  //             ThemeChanger({ ...theme, toggled: "icon-text-close" });
  //           }
  //           break;
  //         // doublemenu
  //         case "doublemenu":
  //           ThemeChanger({ ...theme, dataNavStyle: "" });
  //           if (theme.toggled === "double-menu-open") {
  //             ThemeChanger({ ...theme, toggled: "double-menu-close" });
  //           } else {
  //             const sidemenu = document.querySelector(
  //               ".side-menu__item.active"
  //             );
  //             if (sidemenu) {
  //               ThemeChanger({ ...theme, toggled: "double-menu-open" });
  //               if (sidemenu.nextElementSibling) {
  //                 sidemenu.nextElementSibling.classList.add(
  //                   "double-menu-active"
  //                 );
  //               } else {
  //                 ThemeChanger({ ...theme, toggled: "" });
  //               }
  //             }
  //           }

  //           // doublemenu(ThemeChanger);
  //           break;
  //         // detached
  //         case "detached":
  //           if (theme.toggled === "detached-close") {
  //             ThemeChanger({ ...theme, toggled: "" });
  //           } else {
  //             ThemeChanger({ ...theme, toggled: "detached-close" });
  //           }
  //           break;
  //         // default
  //         case "default":
  //           ThemeChanger({ ...theme, toggled: "" });
  //       }
  //       switch (navStyle) {
  //         case "menu-click":
  //           if (theme.toggled === "menu-click-closed") {
  //             ThemeChanger({ ...theme, toggled: "" });
  //           } else {
  //             ThemeChanger({ ...theme, toggled: "menu-click-closed" });
  //           }
  //           break;
  //         // icon-overlay
  //         case "menu-hover":
  //           if (theme.toggled === "menu-hover-closed") {
  //             ThemeChanger({ ...theme, toggled: "" });
  //           } else {
  //             ThemeChanger({ ...theme, toggled: "menu-hover-closed" });
  //           }
  //           break;
  //         case "icon-click":
  //           if (theme.toggled === "icon-click-closed") {
  //             ThemeChanger({ ...theme, toggled: "" });
  //           } else {
  //             ThemeChanger({ ...theme, toggled: "icon-click-closed" });
  //           }
  //           break;
  //         case "icon-hover":
  //           if (theme.toggled === "icon-hover-closed") {
  //             ThemeChanger({ ...theme, toggled: "" });
  //           } else {
  //             ThemeChanger({ ...theme, toggled: "icon-hover-closed" });
  //           }
  //           break;
  //       }
  //     }
  //   } else {
  //     if (theme.toggled === "close") {
  //       ThemeChanger({ ...theme, toggled: "open" });

  //       setTimeout(() => {
  //         if (theme.toggled == "open") {
  //           const overlay = document.querySelector("#responsive-overlay");

  //           if (overlay) {
  //             overlay.classList.add("active");
  //             overlay.addEventListener("click", () => {
  //               const overlay = document.querySelector("#responsive-overlay");

  //               if (overlay) {
  //                 overlay.classList.remove("active");
  //                 menuClose();
  //               }
  //             });
  //           }
  //         }

  //         window.addEventListener("resize", () => {
  //           if (window.screen.width >= 992) {
  //             const overlay = document.querySelector("#responsive-overlay");

  //             if (overlay) {
  //               overlay.classList.remove("active");
  //             }
  //           }
  //         });
  //       }, 100);
  //     } else {
  //       ThemeChanger({ ...theme, toggled: "close" });
  //     }
  //   }
  // };

  useEffect(() => {
    dispatch(fetchUserDetailsAction());
  }, []);

  const handleLogout = (e: any) => {
    e.stopPropagation();
    dispatch(logout());
    setTimeout(() => {
      navigate("login");
    }, 300);
  };

  return (
    <Fragment>
      <header className="app-header">
        <div className="main-header-container container-fluid">
          <div className="header-content-left">
            <div className="header-element">
              <div className="horizontal-logo">
                <Link to={`/dashboards/crm/`} className="header-logo">
                  <img src={desktoplogo} alt="logo" className="desktop-logo" />
                  <img src={togglelogo} alt="logo" className="toggle-logo" />
                  <img src={desktopdark} alt="logo" className="desktop-dark" />
                  <img src={toggledark} alt="logo" className="toggle-dark" />
                  <img
                    src={desktopwhite}
                    alt="logo"
                    className="desktop-white"
                  />
                  <img src={togglewhite} alt="logo" className="toggle-white" />
                </Link>
              </div>
            </div>
          </div>

          <div className="header-content-right">
            <div className="header-element header-fullscreen">
              <Link onClick={toggleFullScreen} to="#" className="header-link">
                {fullScreen ? (
                  <i className="bx bx-exit-fullscreen header-link-icon"></i>
                ) : (
                  <i className="bx bx-fullscreen header-link-icon"></i>
                )}
              </Link>
            </div>
            <Dropdown className="header-element header-profile">
              <Dropdown.Toggle
                variant=""
                className="header-link dropdown-toggle"
                id="mainHeaderProfile"
                data-bs-toggle="dropdown"
                data-bs-auto-close="outside"
                aria-expanded="false"
              >
                <div className="d-flex align-items-center">
                  <div className="d-sm-block d-none">
                    <p className="mb-0 fw-semibold lh-1">
                      {firstName === "" ||
                      firstName === null ||
                      firstName === undefined
                        ? "Block Admin"
                        : `${capitalizeFirstLetter(
                            firstName
                          )} ${capitalizeFirstLetter(lastName)}`}
                    </p>
                  </div>
                </div>
              </Dropdown.Toggle>
              <Dropdown.Menu
                align="end"
                as="ul"
                className="pt-0 overflow-hidden main-header-dropdown header-profile-dropdown"
                aria-labelledby="mainHeaderProfile"
                onClick={() => navigate("/dashboards/user-details")}
              >
                <Dropdown.Item className="d-flex" href="#">
                  <i className="ti ti-user-circle fs-18 me-2 op-7"></i>Profile
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={handleLogout}
                  className="d-flex"
                  href="#"
                >
                  <i className="ti ti-logout fs-18 me-2 op-7"></i>
                  Log Out
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>
      </header>
    </Fragment>
  );
};

const mapStateToProps = (state: any) => ({
  local_varaiable: state,
});
export default connect(mapStateToProps)(Header);
