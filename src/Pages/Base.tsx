import { Fragment, useEffect, useState } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { Provider } from "react-redux";
import { Outlet } from "react-router-dom";
import store from "../Store";
import Footer from "../components/common/footer/footer";
import Header from "../components/common/header/header";
import Loader from "../components/common/loader/loader";
import Sidebar from "../components/common/sidebar/sidebar";
import TabToTop from "../components/common/tabtotop/tabtotop";

function Base() {
  const [MyclassName, setMyClass] = useState("");

  const Bodyclickk = () => {
    if (localStorage.getItem("ynexverticalstyles") == "icontext") {
      setMyClass("");
    }
  };

  const [isLoading, setIsLoading] = useState(
    localStorage.ynexloaderdisable != "disable"
  );

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 300);
  }, []);

  return (
    <Fragment>
      {isLoading && <Loader></Loader>}
      <Provider store={store}>
        <HelmetProvider>
          <Helmet
            htmlAttributes={{
              lang: "en",
              dir: "ltr",
              "data-menu-styles": "dark",
              "data-theme-mode": "light",
              "data-nav-layout": "vertical",
              "data-header-styles": "light",
              "data-vertical-style": "overlay",
              "data-loader": "disable",
              "data-icon-text": MyclassName,
            }}
          />
          <div className="page">
            <Header />
            <Sidebar />
            <div className="main-content app-content" onClick={Bodyclickk}>
              <div className="container-fluid">
                <Outlet />
              </div>
            </div>
            <Footer />
          </div>
          <TabToTop />
        </HelmetProvider>
        {/* <div id="responsive-overlay"></div> */}
      </Provider>
    </Fragment>
  );
}

export default Base;