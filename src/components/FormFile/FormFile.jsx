import { useEffect, useRef, useState } from "react";
import featherupload from "../../assets/feather-upload.svg";
import PaperClip from "../../assets/gray-paperclip-attach-icon.svg";
import GreenRight from "../../assets/success-green-circle-icon.svg";
import { formatFileSize } from "../../helpers/formatFileSize";
import styles from "./FormFile.module.scss";

export const FormFile = ({
  label,
  children,
  className,
  isUploading = false,
  errorMessage = "",
  accept = "",
  successIcon = false,
  UploadIcon = true,
  onSelectFile = () => {},
  onRemoveFile = () => {},
  showMaxSize = false,
  maxFileSizeText,
  isUsedInModal = false,
}) => {
  const [file, setFile] = useState(null);
  const [showRemoveLabel, setShowRemoveLabel] = useState(false);
  const fileInputRef = useRef(null);
  const [maxSize, setMaxSize] = useState(showMaxSize);
  const [isHovering, setIsHovering] = useState(false);

  const handleContainerClick = () => {
    if (!file) {
      fileInputRef.current.value = null;
      fileInputRef.current.click();
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFile(file);
      onSelectFile(file);
      setMaxSize(false);
    }
  };

  const handleRemoveFile = (e) => {
    e.stopPropagation();
    setFile(null);
    setShowRemoveLabel(true);
    setTimeout(() => {
      setShowRemoveLabel(false);
      setMaxSize(true);
    }, 1000);
    onRemoveFile();
  };

  return (
    <button
      className={`${styles.form_file} ${errorMessage && "border-crd10"} ${
        file && !isUploading ? styles.file_selected : ""
      } group ${className} ${!file && styles.isFile}`}
      onClick={handleContainerClick}
      onMouseOver={() => setIsHovering(true)}
      onMouseOut={() => setIsHovering(false)}
    >
      <input
        type="file"
        hidden
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept={accept}
        data-testid="file-input"
      />
      {file && !isUploading && (
        <span
          data-testid="removefile"
          className={`${styles.file_cross} icon-plus`}
          onClick={handleRemoveFile}
        ></span>
      )}
      {children ? (
        children
      ) : (
        <>
          <div className="flex flex-col">
            <div className="flex items-center justify-center">
              {isUploading ? (
                <span className="text-sm italic font-semibold text-cgn5">
                  Uploading...
                </span>
              ) : file ? (
                <>
                  <img
                    src={PaperClip}
                    alt="file icon"
                    width="17.33px"
                    height="15.94px"
                  />
                  <p className="flex items-center mx-1">
                    <WidthCalculator
                      label={file?.name}
                      isUsedInModal={isUsedInModal}
                    />
                    <span className="text-xs uppercase text-cgy3">
                      &nbsp;({formatFileSize(file?.size)})
                    </span>
                    {successIcon && (
                      <img
                        src={GreenRight}
                        alt="success icon"
                        width="14"
                        height="14"
                        className="ml-1"
                        data-testid="icon-success"
                      />
                    )}
                  </p>
                </>
              ) : showRemoveLabel ? (
                <span className="text-sm italic font-semibold text-crd5">
                  File Removed
                </span>
              ) : (
                <div>
                  <div className="flex flex-col items-center justify-center">
                    <div
                      className="flex items-center"
                      data-testid="icon-upload"
                    >
                      {UploadIcon ? (
                        <div className="text-sm icon-plus text-cm3" />
                      ) : (
                        <img src={featherupload} width="20" alt="add icon" />
                      )}
                      <span className="ml-2 text-sm font-semibold text-[#404040] group-hover:underline">
                        {label}
                      </span>
                    </div>
                    <div
                      className={`mt-1 text-xs font-normal text-cgy3 ${
                        isHovering ? styles.slideUp : styles.slideDown
                      }`}
                    >
                      Max file size: [4]MB (PNG, JPG, PDF)
                    </div>
                  </div>
                </div>
              )}
            </div>
            {maxSize && maxFileSizeText && <div>{maxFileSizeText}</div>}
          </div>
          {/* float label to top when file is selected */}
          {file && !showRemoveLabel && !isUploading && (
            <span
              className="absolute left-2.5 -top-3 p-1 bg-cwhite text-[#404040]"
              style={{ fontSize: "10px", lineHeight: "normal" }}
            >
              {label}
            </span>
          )}
        </>
      )}
      {errorMessage && (
        <span
          data-testid="messageError"
          className="absolute left-0 text-xs italic font-semibold w-max -bottom-6 text-crd5"
        >
          {errorMessage}
        </span>
      )}
    </button>
  );
};

const WidthCalculator = ({ label, isUsedInModal }) => {
  const [width, setWidth] = useState(0);
  const textRef = useRef(null);
  useEffect(() => {
    if (textRef.current) {
      const boundingBox = textRef.current.getBoundingClientRect();
      setWidth(Math.floor(boundingBox.width));
    }
  }, []);

  return (
    <>
      <h1
        ref={textRef}
        data-tooltip-id={width > 270 ? "fullName" : ""}
        className={`inline-block text-sm font-semibold truncate text-[#404040] ${
          width > 270 && "truncate w-[270px]"
        }`}
      >
        {label}
      </h1>
    </>
  );
};
