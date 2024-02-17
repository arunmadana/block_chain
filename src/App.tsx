import React from "react";
import { Provider } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Base from "./Pages/Base";
import BusinessProfiles from "./Pages/BusinessProfiles/BusinessProfiles";
import BusinessTracker from "./Pages/BusinessTracker/BusinessTracker";
import Employees from "./Pages/Employees/Employees";
import EmployeesDetails from "./Pages/EmployeesDetails/EmployeesDetails";
import Exports from "./Pages/Exports/Exports";
import { Login } from "./Pages/Login/Login";
import NewPermissionRole from "./Pages/NewPermissionRole/NewPermissionRole";
import { PhoneVerification } from "./Pages/PhoneVerification/PhoneVerification";
import { VerifyIdentity } from "./Pages/VerifyIdentity/VerifyIdentity";
import { ViewPermissionRole } from "./Pages/ViewPermissionRole/ViewPermissionRole";
import store from "./Store";
import { PrivateRoute } from "./components/PrivateRoute/PrivateRoute";
import Loader from "./components/common/loader/loader";
import { BusinessInformation } from "./Pages/BusinessInformation/BusinessInformation";

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
                  <Route
                    path="/dashboards/profiles/business-details/:id/business-info"
                    element={<BusinessInformation />}
                  />
                  <Route
                    path="dashboards/profiles/add-business"
                    element={<BusinessTracker />}
                  />
                  <Route
                    path={`/dashboards/employees`}
                    element={<Employees />}
                  />
                  <Route
                    path={`/dashboards/employees/details`}
                    element={<EmployeesDetails />}
                  />
                  <Route
                    path={`/dashboards/employees/new`}
                    element={<NewPermissionRole />}
                  />
                  <Route
                    path={`/dashboards/employees/view`}
                    element={<ViewPermissionRole />}
                  />
                  <Route path={`/dashboards/roles`} element={<Employees />} />
                  <Route path={`/dashboards/exports`} element={<Exports />} />
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
