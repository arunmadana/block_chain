import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import styles from "./BusinessConfiguration.module.scss";

const BusinessDetailsConfiguration = () => {
  const navigateTo = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const commonPath = `/dashboards/profiles/business-details/${id}/configuration`;

  const handleTabClick = (tabIndex) => {
    if (tabIndex === 1) {
      navigateTo(`${commonPath}/api-keys`);
    } else if (tabIndex === 2) {
      navigateTo(`${commonPath}/webhooks`);
    } else if (tabIndex === 3) {
      navigateTo(`${commonPath}/ip-addresses`);
    } else if (tabIndex === 4) {
      navigateTo(`${commonPath}/activity-logs`);
    } else {
      navigateTo(`${commonPath}/nodes`);
    }
  };

  const linkedtabs = [
    {
      tabName: "Nodes",
      path: `${commonPath}/nodes`,
    },
    {
      tabName: "API Keys",
      path: `${commonPath}/api-keys`,
    },
    {
      tabName: "Webhooks",
      path: `${commonPath}/webhooks`,
    },
    {
      tabName: "IP Addresses",
      path: `${commonPath}/ip-addresses`,
    },
    {
      tabName: "Activity Log",
      path: `${commonPath}/activity-logs`,
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.businessTitle}>Configuration</div>
      <div className={`${styles.tabsContainer}`}>
        {linkedtabs.map((tab, index) => (
          <button
            key={index}
            type="button"
            onClick={() => handleTabClick(index)}
            className={`${styles.tab} ${
              tab?.path == location.pathname && styles.active
            }`}
          >
            {tab.tabName}
          </button>
        ))}
      </div>
      <hr className={styles.hr} />
      <Outlet />
    </div>
  );
};

export default BusinessDetailsConfiguration;
