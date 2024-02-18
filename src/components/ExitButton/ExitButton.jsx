import { useNavigate } from "react-router-dom";
import styles from "./ExitButton.module.scss";

export default function ExitButton() {
  const navigateTo = useNavigate();
  return (
    <div className={styles.buttonContainer}>
      <span>All completed progress is saved.</span>&nbsp;
      <button
        className={styles.button}
        onClick={() => navigateTo("/dashboards/profiles")}
      >
        Exit
      </button>
    </div>
  );
}
