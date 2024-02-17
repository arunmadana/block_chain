import { useEffect, useState } from "react";
import styles from "./SelectableNodes.module.scss";

export const SelectableNodes = ({
  className = "",
  nodeData = [],
  selectedNodeOption = {},
  onSelectNode = () => {},
}) => {
  const [selectedNode, setSelectedNode] = useState({});

  useEffect(() => {
    if (nodeData.length == 1) {
      nodeData.forEach((node) => setSelectedNode(node));
    } else {
      setSelectedNode(selectedNodeOption);
    }
  }, [nodeData, selectedNodeOption]);

  const handleSelect = (node) => {
    setSelectedNode(node);
    onSelectNode(node);
  };

  return (
    <>
      {nodeData?.length > 0 ? (
        <>
          {nodeData?.map((nodeConfig, i) => {
            return (
              <div
                key={i}
                className={`${styles.nodeContainer} ${
                  nodeConfig?.nodeName === selectedNode?.nodeName
                    ? styles.isSelected
                    : styles.notSelected
                } ${className}`}
                onClick={() => handleSelect(nodeConfig)}
              >
                {nodeConfig?.nodeName == selectedNode?.nodeName ? (
                  <div className={`icon-verification ${styles.checkIcon}`} />
                ) : (
                  <div className={styles.emptyCircle} />
                )}

                <div className={styles.nodeLabelClass}>
                  {nodeConfig?.nodeName}aaa
                </div>
              </div>
            );
          })}
        </>
      ) : (
        <div
          className={`${styles.nodeContainer} ${styles.isSelected} ${className}`}
        >
          <div className={`icon-verification ${styles.checkIcon}`} />
          <div className={styles.nodeLabel}>{selectedNode?.nodeName}aaa</div>
        </div>
      )}
    </>
  );
};
