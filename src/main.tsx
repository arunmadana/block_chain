import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { PrivateRoute } from "./components/PrivateRoute/PrivateRoute.tsx";
import Loader from "./components/common/loader/loader.tsx";
import Employees from "./container/Employees/Employees.tsx";
import EmployeesDetails from "./container/EmployeesDetails/EmployeesDetails.tsx";
import Exports from "./container/Exports/Exports.tsx";
import { Login } from "./container/Login/Login.tsx";
import NewPermissionRole from "./container/NewPermissionRole/NewPermissionRole.tsx";
import { PhoneVerification } from "./container/PhoneVerification/PhoneVerification.tsx";
import { VerifyIdentity } from "./container/VerifyIdentity/VerifyIdentity.tsx";
import { ViewPermissionRole } from "./container/ViewPermissionRole/ViewPermissionRole.tsx";
import Crm from "./container/dashboards/crm/crm.tsx";
import "./index.scss";
import store from "./Store";
import App from "./pages/App.tsx";
import BusinessProfiles from "./container/BusinessProfiles/BusinessProfiles.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <React.Fragment>
      <BrowserRouter>
        <React.Suspense fallback={<Loader />}>
          <Routes>
            <Route
              path={`${import.meta.env.BASE_URL}login`}
              element={<Login />}
            />
            <Route
              path={`${import.meta.env.BASE_URL}login/verify-identity`}
              element={<VerifyIdentity />}
            />
            <Route
              path={`${import.meta.env.BASE_URL}login/sms-otp`}
              element={<PhoneVerification />}
            />
            <Route path="/" element={<PrivateRoute />}>
              <Route path={`${import.meta.env.BASE_URL}`} element={<App />}>
                <Route index element={<Crm />} />
                <Route
                  path={`${import.meta.env.BASE_URL}dashboards/crm`}
                  element={<Crm />}
                />
                <Route
                  path={`${import.meta.env.BASE_URL}dashboards/profiles`}
                  element={<BusinessProfiles />}
                />
                <Route
                  path={`${import.meta.env.BASE_URL}dashboards/employees`}
                  element={<Employees />}
                />
                <Route
                  path={`${
                    import.meta.env.BASE_URL
                  }dashboards/employees/details`}
                  element={<EmployeesDetails />}
                />
                <Route
                  path={`${import.meta.env.BASE_URL}dashboards/employees/new`}
                  element={<NewPermissionRole />}
                />
                <Route
                  path={`${import.meta.env.BASE_URL}dashboards/employees/view`}
                  element={<ViewPermissionRole />}
                />
                <Route
                  path={`${import.meta.env.BASE_URL}dashboards/roles`}
                  element={<Employees />}
                />
                <Route
                  path={`${import.meta.env.BASE_URL}dashboards/exports`}
                  element={<Exports />}
                />
              </Route>
            </Route>
          </Routes>
        </React.Suspense>
      </BrowserRouter>
    </React.Fragment>
  </Provider>
);
