import "./CopyButton.style.scss";

function CopyButton({ message, className, size, ...props }) {
  const handleCopy = async () => {
    await navigator.clipboard.writeText(message);
  };

  return (
    <div className={`copy-clipboard ${className}`} {...props}>
      <div className="copy-clipboard__content">
        <button
          type="button"
          style={{ fontSize: size }}
          className="copy-image icon-copy"
          id={`copy-btn${message}`}
          data-for="copy-btn"
          data-place="top"
          onClick={handleCopy}
          data-testid="copy-button"
        />
      </div>
    </div>
  );
}

CopyButton.defaultProps = {
  size: 20,
};

export default CopyButton;
