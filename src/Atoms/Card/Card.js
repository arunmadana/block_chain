import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IconButton, Spinner } from 'Components/Atoms';
import './Card.style.scss';

export default function Card({
  children,
  multiTitles = [],
  title = '',
  subTitle = '',
  defaultShow = true,
  header,
  show,
  icon = '',
  id,
  collapsible = false,
  isLoading = false,
  isProcessing = false,
  onCollapse = () => {},
  className,
  headerClassName,
  editButton,
  handleEdit,
  isHeader = true
}) {
  const [showBody, setShowBody] = useState(defaultShow);

  const handleToggleShow = () => {
    if (!collapsible) return;
    if (typeof show !== 'boolean') {
      setShowBody((prev) => !prev);
    }
    onCollapse();
  };

  const _show = typeof show === 'boolean' ? show : showBody;

  return (
    <div className={`card ${className ? className : ''} shadow-lg`} id={id}>
      {isHeader && (
        <header className="headers">
          <span className="title" onClick={handleToggleShow}>
            {icon && <span className={`icon-${icon} title-icon`} />}
            {multiTitles.length > 0 ? (
              <div className="title__multi">
                {multiTitles.map((item, index) => (
                  <span key={index} className="title__multi__item">
                    {item}
                  </span>
                ))}
              </div>
            ) : title ? (
              title
            ) : null}

            <span className="title__sub">{subTitle}</span>
            {editButton && (
              <button onClick={handleEdit} className="edit-class">
                <IconButton icon="edit" className="edit-icon" />
                <span className="edit-text">Edit</span>
              </button>
            )}
          </span>
          {collapsible && !header && (
            <IconButton
              icon="arrow-down"
              onClick={handleToggleShow}
              className={showBody ? 'expanded' : ''}
            />
          )}
          {header && (
            <div className={`header-controls ${headerClassName}`}>{header}</div>
          )}
        </header>
      )}
      <AnimatePresence>
        {_show && (
          <motion.div
            className="body"
            variants={collapsible ? variant : undefined}
            initial={'hidden'}
            exit="hidden"
            animate="visible"
          >
            {children}
            <AnimatePresence>
              {isLoading && (
                <motion.aside
                  key="loading-overlay"
                  layoutId="loading-overlay"
                  transition={{ duration: 0.2 }}
                  animate={{ opacity: 1 }}
                  initial={{ opacity: 0 }}
                  exit={{ opacity: 0 }}
                  className="loading-overlay"
                >
                  <Spinner />
                </motion.aside>
              )}
              {isProcessing && !isLoading && (
                <motion.aside
                  key="loading-overlay"
                  layoutId="loading-overlay"
                  transition={{ duration: 0.2 }}
                  animate={{ opacity: 1 }}
                  initial={{ opacity: 0 }}
                  exit={{ opacity: 0 }}
                  className="loading-overlay"
                >
                  <Spinner color size={80} />
                  <span className="processing-label">Processing</span>
                </motion.aside>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

Card.propTypes = {
  children: PropTypes.any,
  defaultShow: PropTypes.bool,
  title: PropTypes.any,
  disabled: PropTypes.bool,
  isLoading: PropTypes.bool,
  isProcessing: PropTypes.bool,
  multiTitles: PropTypes.array,
  subTitle: PropTypes.string,
  show: PropTypes.bool,
  icon: PropTypes.string,
  id: PropTypes.number || PropTypes.string,
  collapsible: PropTypes.bool,
  onCollapse: PropTypes.func,
  className: PropTypes.string,
  headerClassName: PropTypes.string,
  header: PropTypes.string,
  editButton: PropTypes.bool,
  handleEdit: PropTypes.func,
  isHeader: PropTypes.bool
};

const variant = {
  hidden: { height: 0, transition: { duration: 0.1 } },
  visible: { height: 'auto', transition: { duration: 0.1 } }
};
