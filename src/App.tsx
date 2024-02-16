import { BrowserRouter, Route, Routes } from "react-router-dom";
import React from "react";
import "./App.css";
import { Provider } from "react-redux";
import store from "./Store";
import { Login } from "./Pages/Login/Login";
import { VerifyIdentity } from "./Pages/VerifyIdentity/VerifyIdentity";
import { PhoneVerification } from "./Pages/PhoneVerification/PhoneVerification";
import Loader from "./components/common/loader/loader";
import { PrivateRoute } from "./components/PrivateRoute/PrivateRoute";
import Base from "./Pages/Base";
import BusinessProfiles from "./Pages/BusinessProfiles/BusinessProfiles";

function App() {
  return (
    <Provider store={store}>
      <React.Fragment>
        <BrowserRouter>
          <React.Suspense fallback={<Loader />}>
            <Routes>
              <Route path={`/login`} element={<Login />} />
              <Route
                path={`/login/verify-identity`}
                element={<VerifyIdentity />}
              />
              <Route path={`/login/sms-otp`} element={<PhoneVerification />} />
              <Route path="/" element={<PrivateRoute />}>
                <Route path={`/`} element={<Base />}>
                <Route
                  path={`/dashboards/profiles`}
                  element={<BusinessProfiles />}
                />
              </Route>
              </Route>
            </Routes>
          </React.Suspense>
        </BrowserRouter>
      </React.Fragment>
    </Provider>
  );
}

export default App;
