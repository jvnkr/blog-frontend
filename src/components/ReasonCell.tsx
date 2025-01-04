import { useState } from "react";

interface ReasonCellProps {
  reason: string;
  style?: React.CSSProperties;
}

export const ReasonCell: React.FC<ReasonCellProps> = ({ reason, style }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <div
      style={style}
      className={`flex w-[10rem] items-center cursor-pointer${
        isExpanded && " whitespace-pre-wrap break-all"
      }`}
      onClick={() => setIsExpanded(!isExpanded)}
      title={isExpanded ? undefined : reason}
    >
      <span className={isExpanded ? "" : "truncate"}>{reason}</span>
    </div>
  );
};
