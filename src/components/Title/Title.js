import React from "react";
import "./Title.style.scss";

export default function Title({ title = "Title", children, id, className }) {
  return (
    <React.Fragment className="inline">
      <h1 className="title-container" id={id}>
        <span className={`text ${className}`} data-testid="text_className">
          {title}
        </span>
        {children}
      </h1>
    </React.Fragment>
  );
}
