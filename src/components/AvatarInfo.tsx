import React from "react";
import Avatar from "./Avatar";
import { BadgeCheck, Dot } from "lucide-react";
import { formatTimeDifference } from "@/lib/utils";
import Tooltip from "./Tooltip";
import Link from "next/link";

interface AvatarInfoProps {
  username: string;
  name: string;
  verified: boolean;
  createdAt?: Date;
  onClick?: () => void;
  showTooltip?: boolean;
  style?: React.CSSProperties;
  linkHref?: string;
  target?: string;
}

const AvatarInfo = ({
  name,
  username,
  verified,
  createdAt,
  onClick,
  style,
  linkHref,
  target,
}: AvatarInfoProps) => {
  const AvatarContent = () => {
    return (
      <>
        <Avatar name={name} />
        <div className={"flex h-fit"}>
          <div
            className={
              "flex flex-col relative justify-start items-start text-[15px] font-semibold"
            }
          >
            <div className="flex items-center gap-1">
              <span className="flex items-center h-[19px]">{name}</span>
              {verified && <BadgeCheck className="w-4 h-4 fill-blue-500" />}
            </div>
            <span
              className={
                "flex font-normal text-neutral-500 items-center h-full text-[12px]"
              }
            >
              @{username}
              {createdAt && (
                <>
                  <Dot className="w-[16px] h-full font-light text-neutral-600" />
                  <Tooltip
                    tooltipTrigger={
                      <span className="hover:underline font-extralight text-neutral-600">
                        {formatTimeDifference(createdAt)}
                      </span>
                    }
                    tooltipContent={
                      <>
                        <p>
                          {createdAt?.toLocaleString("en-US", {
                            hour: "numeric",
                            minute: "2-digit",
                            hour12: true,
                          })}{" "}
                        </p>
                        <Dot className="w-[16px] h-full font-light text-neutral-600" />
                        <p>
                          {createdAt?.toLocaleString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                      </>
                    }
                  />
                </>
              )}
            </span>
          </div>
        </div>
      </>
    );
  };

  return (
    <>
      {linkHref ? (
        <Link
          href={linkHref}
          target={target}
          onClick={onClick}
          style={style}
          className="flex select-none h-fit justify-start gap-2 items-center w-fit"
        >
          <AvatarContent />
        </Link>
      ) : (
        <div
          onClick={onClick}
          style={{
            cursor: onClick ? "pointer" : "default",
            ...style,
          }}
          className="flex select-none h-fit justify-start gap-2 items-center w-fit"
        >
          <AvatarContent />
        </div>
      )}
    </>
  );
};

export default AvatarInfo;
