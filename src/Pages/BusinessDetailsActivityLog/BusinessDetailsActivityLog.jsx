import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ActivityTypeEnum } from "../../Enums/ActivityTabEnum";
import Card from "../../components/Card/Card";
import Spinner from "../../components/Spinner/Spinner";
import { getActivityLogs } from "../../services/profiles/poc";
import styles from "./BusinessDetailsActivityLog.module.scss";

export default function BusinessDetailsActivityLog() {
  const { id: tenantId } = useParams();
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const getActivity = () => {
    setIsLoading(true);
    const payload = {
      tenantId: JSON.parse(tenantId),
      activityType: ActivityTypeEnum.businessDetailsActivity,
    };
    getActivityLogs(payload)
      .then((res) => {
        const data = res?.data?.data?.reverse();
        setData(data);
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
  }, []);

  return (
    <Card isHeader={false} className={styles.mainActivity}>
      <div className={styles.pocTitle}>Activity Log</div>
      <div className={styles.mainLog}>
        <ActivityLogData data={data} isLoading={isLoading} />
      </div>
    </Card>
  );
}

const ActivityLogData = ({ data, isLoading }) => {
  const createMarkup = (html) => {
    return { __html: html };
  };

  return (
    <div className={styles.log}>
      {isLoading === false ? (
        data?.length > 0 ? (
          data?.map((item, index) => {
            const getReason = item?.comment.split("<br><b>Reason:</b>");
            return (
              <div key={index}>
                <div className={styles.employeeDetail}>
                  <p>
                    <p className={styles.employee}>
                      <div
                        className={`icon-green-circle ${styles.roundedIcon}`}
                      />
                      <span className={styles.date}>
                        &nbsp;
                        {item?.createdAt}
                      </span>
                    </p>
                    <p className={styles.comment}>
                      <p className={styles.key}>
                        <span className={styles.userName}>
                          {item?.userName}&nbsp;
                        </span>
                        <span
                          dangerouslySetInnerHTML={createMarkup(
                            getReason[0].replace(/^"|"$/g, "")
                          )}
                        />
                      </p>
                      {getReason[1] != "" && (
                        <p className={styles.reasonkey}>
                          <span className={styles.reason}>Reason:</span>
                          <span>{getReason[1].replace(/^"|"$/g, "")}</span>
                        </p>
                      )}
                    </p>
                  </p>
                </div>
              </div>
            );
          })
        ) : (
          <p className={styles.noLogs}>No Activity Logs</p>
        )
      ) : (
        <div className={styles.noLogs}>
          <Spinner />
        </div>
      )}
    </div>
  );
};
