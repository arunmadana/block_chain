import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CopyButton from "../../../components/CopyButton/CopyButton";
import Spinner from "../../../components/Spinner/Spinner";
import { textEllipsis } from "../../../helpers/textEllipsis";
import { getNodes } from "../../../services/profiles/poc";
import styles from "./BusinessDetailsNodes.module.scss";

const BusinessDetailsNodes = () => {
  const [nodeData, setNodeData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const { id: tenantId } = useParams();

  //fetching the Nodes Details
  const nodeDetails = () => {
    setIsLoading(true);
    getNodes(tenantId)
      .then((res) => {
        const data = res?.data?.data[0];
        setNodeData(data);
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    nodeDetails();
    // eslint-disable-next-line
  }, []);

  return (
    <div>
      {isLoading ? (
        <div className={styles.loadingContainer}>
          <Spinner />
        </div>
      ) : (
        <div className={styles.container}>
          <div className={styles.subContainer}>
            <div className={styles.currency}>
              <p className={styles.property}>Currency</p>
              <p className={styles.currencyValue}>{nodeData?.nodeName}</p>
            </div>
            <div className={styles.node}>
              <p className={styles.property}>Node ID</p>
              <div className={styles.nodeValue}>
                <span>{textEllipsis(nodeData?.nodeId, 12)}</span>
                <span>
                  <CopyButton message={nodeData?.nodeId} size={"19px"} />
                </span>
              </div>
            </div>
            <div className={styles.node}>
              <p className={styles.property}>Created</p>
              <p className={styles.nodeValue}>{nodeData?.createdDate}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BusinessDetailsNodes;
