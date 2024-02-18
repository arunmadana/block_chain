import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ActivityTypeEnum } from "../../../Enums/ActivityTabEnum";
import { VBar } from "../../../components/Bars/Bars";
import Card from "../../../components/Card/Card";
import { getActivityLogs } from "../../../services/profiles/poc";
import styles from "./BusinessDetailsActivityLogs.module.scss";
import Spinner from "../../../components/Spinner/Spinner";

export default function BusinessDetailsActivityLogs() {
  const { id: userId } = useParams();
  const [isShowKeysIcon, setisShowKeysIcon] = useState(true);
  const [isShowHookIcon, setisShowHookIcon] = useState(false);
  const [isShowIpIcon, setisShowIpIcon] = useState(false);
  const [apiKeysData, setApiKeysData] = useState([]);
  const [storeId, setStoreId] = useState("Apikeys");
  const [isLoading, setIsLoading] = useState(false);
  const [webHooksData, setWebWooksData] = useState([]);
  const [ipAddressData, setIpAddressData] = useState([]);

  const handleSetActivity = (e) => {
    const value = e.currentTarget.id;
    setStoreId(value);
    if (value === "Webhooks") {
      setisShowKeysIcon(false);
      setisShowIpIcon(false);
      setisShowHookIcon(true);
    } else if (value === "Ip") {
      setisShowHookIcon(false);
      setisShowKeysIcon(false);
      setisShowIpIcon(true);
    } else {
      setisShowHookIcon(false);
      setisShowIpIcon(false);
      setisShowKeysIcon(true);
    }
  };

  const getActivity = () => {
    setIsLoading(true);
    const accountType =
      storeId === "Ip"
        ? ActivityTypeEnum.ipAddress
        : storeId === "Webhooks"
        ? ActivityTypeEnum.webHooks
        : storeId === "Apikeys" && ActivityTypeEnum.apiKeys;

    const payload = {
      tenantId: JSON.parse(userId),
      activityType: accountType,
    };

    getActivityLogs(payload)
      .then((res) => {
        const data = res?.data?.data?.reverse();
        if (storeId === "Ip") {
          setIpAddressData(data);
        } else if (storeId === "Webhooks") {
          setWebWooksData(data);
        } else if (storeId === "Apikeys") {
          setApiKeysData(data);
        }
        setIsLoading(false);
      })
      .catch((err) => {
        const error = err?.error?.errorDescription;
        console.log(error);
      });
  };

  useEffect(() => {
    getActivity();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storeId]);

  return (
    <div className={styles.mainActivity}>
      <div className={styles.sideText}>
        <div className={styles.mainLabel}>
          <div className={styles.keysLog}>
            <div
              className={`${
                isShowKeysIcon === true ? styles.activeLabel : styles.sideLabel
              }`}
              onClick={handleSetActivity}
              id="Apikeys"
            >
              API Keys
            </div>
            {isShowKeysIcon && (
              <p className={`icon-small-arrow1 ${styles.arrowStyles}`} />
            )}
          </div>
          <div className={styles.keysLog}>
            <div
              className={`${
                isShowHookIcon === true ? styles.activeLabel : styles.sideLabel
              }`}
              onClick={handleSetActivity}
              id="Webhooks"
            >
              Webhooks
            </div>
            {isShowHookIcon && (
              <p className={`icon-small-arrow1 ${styles.arrowStyles}`} />
            )}
          </div>
          <div className={styles.keysLog}>
            <div
              className={`${
                isShowIpIcon === true ? styles.activeLabel : styles.sideLabel
              }`}
              onClick={handleSetActivity}
              id="Ip"
            >
              IP Addresses
            </div>
            {isShowIpIcon && (
              <p className={`icon-small-arrow1 ${styles.arrowStyles}`} />
            )}
          </div>
        </div>
      </div>
      <VBar />
      <Card className={styles.mainLog} isHeader={false}>
        <ActivityLog
          data={
            storeId === "Ip"
              ? ipAddressData
              : storeId === "Webhooks"
              ? webHooksData
              : storeId === "Apikeys" && apiKeysData
          }
          isLoading={isLoading}
        />
      </Card>
    </div>
  );
}

const ActivityLog = ({ data, isLoading }) => {
  return (
    <div className={styles.log}>
      {isLoading === false ? (
        data?.length > 0 ? (
          data?.map((item, index) => (
            <div key={index}>
              <div className={styles.employeeDetail}>
                <p>
                  <p className={styles.employee}>
                    <div
                      className={`icon-green-circle ${styles.roundedIcon}`}
                    />
                    <span className={styles.name}>{item?.userName}&nbsp;-</span>
                    <span className={styles.date}>
                      &nbsp;
                      {item?.createdAt}
                    </span>
                  </p>
                  <p className={styles.key}>{item.comment}</p>
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className={styles.noLogs}>No Activity Logs Found</p>
        )
      ) : (
        <div className={styles.noLogs}>
          <Spinner />
        </div>
      )}
    </div>
  );
};
