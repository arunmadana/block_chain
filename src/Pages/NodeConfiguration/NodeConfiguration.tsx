import { Button } from "@mui/joy";
import { useEffect, useState } from "react";
import { SelectableNodes } from "../../components/SelectableNodes/SelectableNodes";
import Spinner from "../../components/Spinner/Spinner";
import {
  configureNode,
  getConfiguredNodes,
  nodesList,
} from "../../services/profiles/poc";
import styles from "./NodeConfiguration.module.scss";
import ExitButton from "../../components/ExitButton/ExitButton";

type NodeConfigurationProps = {
  onBack: () => void;
  onNext: () => void;
  tenantId: any | null;
};

export const NodeConfiguration: React.FunctionComponent<
  NodeConfigurationProps
> = ({ onBack, onNext, tenantId }) => {
  const [selectedNode, setSelectedNode] = useState({});
  const [nodes, setNodes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [disable, setDisable] = useState(false);

  useEffect(() => {
    getConfiguredNode();

    getNodesList();
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (nodes?.length === 1) {
      setSelectedNode(nodes[0]);
    }
  }, [nodes, selectedNode]);
  //get nodes list....
  const getNodesList = () => {
    setIsLoading(true);
    nodesList()
      .then((res) => {
        const data = res?.data?.data;
        setNodes(data);
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  };

  // get configured node....
  const getConfiguredNode = () => {
    setIsLoading(true);
    const id = tenantId;
    getConfiguredNodes(id)
      .then(() => {
        const data = res?.data?.data;
        setSelectedNode(data[0] ?? {});
      })
      .catch(() => {
        setIsLoading(false);
      });
  };

  const handleConfigure = () => {
    setDisable(true);
    const payload = {
      tenantId: tenantId,
      currency: [selectedNode?.currency],
    };
    configureNode(payload)
      .then(() => {
        onNext();
        setDisable(false);
      })
      .catch(() => {
        setDisable(false);
      });
  };

  return (
    <>
      {isLoading ? (
        <div className={styles.loadingClass}>
          <Spinner />
        </div>
      ) : (
        <div className={styles.nodeContainer}>
          <div>
            <h1 className={styles.header}>Node Configuration</h1>
            <p className={styles.disclaimerClass}>
              Select the currency node this business will participate in.
            </p>
            <SelectableNodes
              className={styles.nodesClass}
              nodeData={nodes}
              selectedNodeOption={selectedNode}
              onSelectNode={(select) => setSelectedNode(select)}
            />
          </div>
          <div className={styles.navigationButtons}>
            <button
              type="button"
              className={styles.backButton}
              onClick={onBack}
            >
              Back
            </button>
            <div className={styles.exitRow}>
              <ExitButton />
              <Button
                disabled={Object.keys(selectedNode)?.length == 0 || disable}
                onClick={handleConfigure}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NodeConfiguration;
