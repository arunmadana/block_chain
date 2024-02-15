import { FC, Fragment } from "react";

interface ProfilesProps {}

const Profiles: FC<ProfilesProps> = () => {
  return (
    <Fragment>
      <div className="d-md-flex d-block align-items-center justify-content-between my-4 page-header-breadcrumb">
        <div>
          <p className="fw-semibold fs-18 mb-0">Welcome back, Json Taylor !</p>
          <span className="fs-semibold text-muted">
            Track your sales activity, leads and deals here.
          </span>
        </div>
      </div>
    </Fragment>
  );
};

export default Profiles;
