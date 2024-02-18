import { useEffect, useState } from "react";
import styles from "./SelectableNodes.module.scss";
import tick from "../../assets/tick.svg";

export function SelectableNodes({
  className = "",
  nodeData,
  selectedNodeOption,
  onSelectNode,
}) {
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
      {nodeData?.length ? (
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
                  <img src={tick} className={styles.checkIcon} />
                ) : (
                  <div className={styles.emptyCircle} />
                )}

                <div className={styles.nodeLabelClass}>
                  {nodeConfig?.nodeName}
                </div>
              </div>
            );
          })}
        </>
      ) : (
        <div
          className={`${styles.nodeContainer} ${styles.isSelected} ${className}`}
        >
          <img src={tick} className={styles.checkIcon} />
          <div className={styles.nodeLabel}>{selectedNode?.nodeName}</div>
        </div>
      )}
    </>
  );
}
