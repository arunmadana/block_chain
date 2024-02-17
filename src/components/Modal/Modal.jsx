import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import backArrowIcon from "../../assets/back-arrow.svg";
import { HBar } from "../Bars/Bars";
import Spinner from "../Spinner/Spinner";
import styles from "./Modal.module.scss";
import "./Modal.style.scss";

const variants = {
  modalHidden: { opacity: 0, transition: { duration: 0.2 } },
  modalVisible: {
    opacity: 1,
    transition: { duration: 0.2 },
  },
  bgHidden: {
    opacity: 0,
    transition: { duration: 0.3 },
  },
  bgVisible: {
    opacity: 1,
    transition: { duration: 0.3 },
  },
};

const Modal = ({
  ipaddress = false,
  onClose,
  onBackdropClick,
  onBack,
  show: isModalOpen,
  title,
  showCloseButton,
  showBackButton,
  children,
  className = "",
  isLoading = false,
  isProcessing = false,
  bar = false,
  smallModal = true,
  loadingSpinner = false,
  handleModalClose = false,
  ...props
}) => {
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  });

  return (
    <AnimatePresence>
      {isModalOpen ? (
        <motion.div
          key="bg"
          variants={variants}
          animate="bgVisible"
          initial="bgHidden"
          exit="bgHidden"
          onClick={onBackdropClick}
          className={styles.modal_bg}
          {...props}
        >
          <motion.div
            key="modal"
            variants={variants}
            animate="modalVisible"
            initial="modalHidden"
            exit="modalHidden"
            className={`modal ${className}`}
            Click={(e) => {
              if (handleModalClose) {
                e.stopPropagation();
              } else {
                return false;
              }
            }}
          >
            {/* Modal Header */}
            <div
              className={`w-full flex items-center ${
                showBackButton && showCloseButton
                  ? "justify-between"
                  : showCloseButton
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              {showBackButton && (
                <button onClick={onBack} type="button" className="self-start">
                  <img src={backArrowIcon} width="20" height="20" />
                </button>
              )}
              {title && (
                <div className="modal__header__infos">
                  <h3 className="modal__header__infos__title">{title}</h3>
                </div>
              )}
              {showCloseButton && (
                <button
                  onClick={onClose}
                  type="button"
                  className={`${
                    smallModal ? "self-end" : "self-end mb-4 -mr-5"
                  }`}
                >
                  <div
                    className={`${
                      smallModal
                        ? "icon-close text-cgy3 hover:text-cgy4"
                        : "icon-close text-cgy3 mr-5 hover:text-cgy4"
                    } h-[16px]`}
                  />
                </button>
              )}
            </div>
            {title && bar ? (
              <HBar className="mt-6 bg-cm2" />
            ) : (
              <div className={`${!ipaddress ? "" : "mt-0"}`} />
            )}
            {/* Modal Body */}
            <motion.div className="modal__body">
              {children}
              <AnimatePresence>
                {isLoading && (
                  <motion.div
                    variants={variants}
                    animate="modalVisible"
                    initial="modalHidden"
                    exit="modalHidden"
                    className="modal__loading-overlay"
                  >
                    <Spinner />
                  </motion.div>
                )}
                {loadingSpinner && (
                  <motion.div
                    variants={variants}
                    animate="modalVisible"
                    initial="modalHidden"
                    exit="modalHidden"
                    className="modal__loading-overlay"
                  >
                    <Spinner />
                  </motion.div>
                )}
                {isProcessing && (
                  <motion.div
                    variants={variants}
                    animate="modalVisible"
                    initial="modalHidden"
                    exit="modalHidden"
                    className="modal__loading-overlay"
                  >
                    <Spinner />
                    <p className="modal__loading-label">Processing...</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};

export default Modal;
