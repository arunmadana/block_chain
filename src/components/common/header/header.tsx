import { Fragment, useEffect, useState } from "react";
import { Dropdown } from "react-bootstrap";
import { connect, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../../../Store/ducks/auth";
import desktopdark from "../../../assets/desktop-dark.png";
import desktoplogo from "../../../assets/desktop-logo.png";
import desktopwhite from "../../../assets/desktop-white.png";
import toggledark from "../../../assets/toggle-dark.png";
import togglelogo from "../../../assets/toggle-logo.png";
import togglewhite from "../../../assets/toggle-white.png";
import store from "../../../Store";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [fullScreen, setFullScreen] = useState(false);

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


  const toggleSidebar = () => {
    const theme = store.getState();
    const sidemenuType = theme.dataNavLayout;
  };

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
                <Link
                  to={`/dashboards/crm/`}
                  className="header-logo"
                >
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
            <div className="header-element">
              <Link
                aria-label="Hide Sidebar"
                onClick={() => toggleSidebar()}
                className="sidemenu-toggle header-link animated-arrow hor-toggle horizontal-navtoggle"
                data-bs-toggle="sidebar"
                to="#"
              >
                <span></span>
              </Link>
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
                    <p className="fw-semibold mb-0 lh-1">Json Taylor</p>
                  </div>
                </div>
              </Dropdown.Toggle>
              <Dropdown.Menu
                align="end"
                as="ul"
                className="main-header-dropdown  pt-0 overflow-hidden header-profile-dropdown"
                aria-labelledby="mainHeaderProfile"
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
