import { useEffect, useRef, useState } from "react";
import { textEllipsis } from "../../helpers/textEllipsis";

export default function EmailWidthCalculatorWithTooltip({
  id,
  label,
  className,
  toolTipContent,
  labelTwo,
  compareWidth,
  compareClassName,
  ellipsisNumber,
}) {
  const [width, setWidth] = useState(0);
  const textRef = useRef(null);
  useEffect(() => {
    if (textRef.current) {
      const boundingBox = textRef.current.getBoundingClientRect();
      setWidth(Math.floor(boundingBox.width));
    }
  }, []);
  return (
    <div
      className={`${compareClassName} flex`}
      data-tooltip-id={width > compareWidth ? `fullName${id}` : ""}
      data-tooltip-content={width > compareWidth ? toolTipContent : ""}
    >
      <span
        id={`fullName${id}`}
        ref={textRef}
        className={`${width > compareWidth ? className : "w-fit"} `}
      >
        {label}
      </span>
      {width > compareWidth && labelTwo?.length > ellipsisNumber ? (
        <span>@{textEllipsis(labelTwo, ellipsisNumber)}</span>
      ) : (
        <p>{`@${labelTwo}`}</p>
      )}
    </div>
  );
}
