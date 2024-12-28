import React from "react";
import {
  Tooltip as TooltipShad,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface TooltipProps {
  tooltipTrigger: React.ReactNode;
  tooltipContent: React.ReactNode;
}

const Tooltip = ({ tooltipTrigger, tooltipContent }: TooltipProps) => {
  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
      }}
    >
      <TooltipProvider>
        <TooltipShad delayDuration={400}>
          <TooltipTrigger>{tooltipTrigger}</TooltipTrigger>
          <TooltipContent className="flex py-1 px-2 bg-zinc-900 shadow-[0_0_10px_rgba(0,0,0,0.4)] border border-[#272629]">
            {tooltipContent}
          </TooltipContent>
        </TooltipShad>
      </TooltipProvider>
    </div>
  );
};

export default Tooltip;
