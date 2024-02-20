import "./Tabs.style.scss";

function Tabs({
  data = ["Tab 1", "Tab 2", "Tab 3"],
  activeTab = 0,
  disabledTabs = [],
  onChange = () => {},
  className = "",
  size,
  warningIcon = false,
  ...props
}) {
  const handleChange = (index) => {
    if (disabledTabs.includes(index)) {
      return;
    } else {
      onChange(index);
    }
  };

  return (
    <div className={`tabs ${className}`} {...props} data-testid="multi-tabs">
      {data.map((tab, index) => {
        return (
          <button
            type="button"
            key={index}
            onClick={() => handleChange(index)}
            className={`${warningIcon && "flex items-center"} tabs__tab ${
              size ?? "text-xl 3xl:text-2xl"
            }  font-semibold text-${size} ${
              index === activeTab ? " active selected-bar" : ""
            } ${disabledTabs.includes(index) ? "disabled" : ""}`}
          >
            <div className={`font-semibold h-8 capitalize`}>{tab}</div>
            {warningIcon && tab == "Bank Info" && (
              <div className="warning-symbol">!</div>
            )}
          </button>
        );
      })}
    </div>
  );
}

export default Tabs;
