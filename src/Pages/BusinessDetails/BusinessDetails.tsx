import { Outlet, useLocation } from "react-router-dom";
import "../BusinessProfiles/BusinessProfiles.styles.scss";
import styles from "./BusinessDetails.module.scss";
import { Fragment, useEffect, useState } from "react";
import { Breadcrumbs, Link, Typography } from "@mui/material";
import BusinessSettingsSideMenu from "../BusinessSettingsSideMenu/BusinessSettingsSideMenu";

type BusinessDetailsProps = {};

export const BusinessDetails: React.FunctionComponent<
  BusinessDetailsProps
> = () => {
  const location = useLocation();
  const profileListUpdate = location?.key;
  const [rowData, setRowData] = useState("");

  const breadcrumbData = [
    { label: "Business Profiles", url: "/business-profiles" },
    { label: rowData?.name },
  ];

  useEffect(() => {
    const rowDetails = localStorage?.getItem("businessDetails");
    const rowData = JSON?.parse(rowDetails);
    setRowData(rowData);
  }, [profileListUpdate]);

  return (
    <Fragment>
      <Breadcrumbs style={{ marginTop: "30px" }} aria-label="breadcrumb">
        <Link underline="hover" color="black" href="/dashboards/employees/">
          Business Profiles
        </Link>
        <Typography>{rowData?.name}</Typography>
      </Breadcrumbs>
      <div>
        <p className="fw-semibold text-black fs-30 mt-3">{rowData?.name}</p>
      </div>
      <div className={styles.container}>
        <BusinessSettingsSideMenu rowDatas={rowData} />
        <Outlet />
      </div>
    </Fragment>
  );
};
