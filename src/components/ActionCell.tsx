import { ReportStatus } from "@/lib/types";
import {
  CheckCircle,
  Copy,
  Ellipsis,
  Eye,
  Hourglass,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { toast } from "sonner";

type ActionCellProps = {
  postId: string;
  reportId: string;
  details: string;
  postTitle: string;
  currentStatus: ReportStatus;
  updateReportStatus: (reportId: string, newStatus: string) => void;
};

export const ActionCell: React.FC<ActionCellProps> = ({
  postId,
  reportId,
  details,
  postTitle,
  currentStatus,
  updateReportStatus,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const ellipsisRef = useRef<HTMLButtonElement>(null);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
    if (!isMenuOpen) updateMenuPosition();
  };

  const handleClick = () => {
    setIsMenuOpen(false);
  };

  const handleAction = (action: string) => {
    if (action === currentStatus) return;
    updateReportStatus(reportId, action);
  };

  const updateMenuPosition = () => {
    if (ellipsisRef.current) {
      const rect = ellipsisRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const menuWidth = 192; // Assuming the menu width is 48 * 4 (w-48)
      const menuHeight = 144; // Assuming the menu height is 48 * 3 (3 buttons)

      setMenuPosition({
        top: Math.min(rect.bottom, viewportHeight - menuHeight - 20),
        left: Math.min(rect.left, viewportWidth - menuWidth - 20),
      });
    }
  };

  useEffect(() => {
    window.addEventListener("click", handleClick);

    window.addEventListener("resize", updateMenuPosition);
    return () => {
      window.removeEventListener("resize", updateMenuPosition);
      window.removeEventListener("click", handleClick);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      style={{
        display: "flex",
        zIndex: 999,
        justifyContent: "center",
        alignItems: "center",
      }}
      onClick={(e) => e.stopPropagation()}
      className="relative flex w-full justify-center items-center"
    >
      <button
        ref={ellipsisRef}
        className="p-2 transition-colors duration-150 hover:bg-neutral-500 rounded-full"
        onClick={toggleMenu}
      >
        <Ellipsis className="min-w-4 min-h-4 max-w-4 max-h-4" />
      </button>
      {isMenuOpen &&
        createPortal(
          <div
            style={{
              zIndex: 999,
              position: "absolute",
              top: `${menuPosition.top}px`,
              left: `${menuPosition.left}px`,
            }}
            className="mt-2 p-1 w-48 bg-zinc-900 border border-[#272629] rounded-md shadow-lg"
          >
            <Link
              target={"_blank"}
              href={`/post/${postId}`}
              className="flex rounded-md hover:text-blue-500 transition-colors duration-150 items-center gap-2 w-full px-4 py-2 text-left hover:bg-black/20"
              onClick={() => {
                setIsMenuOpen(false);
                // Add your view logic here
              }}
            >
              <Eye className="min-w-5 max-w-5 min-h-5 max-h-5" />
              <span>View post</span>
            </Link>
            <button
              className="flex rounded-md hover:text-white transition-colors duration-150 items-center gap-2 w-full px-4 py-2 text-left hover:bg-black/20"
              onClick={() => {
                setIsMenuOpen(false);
                if (postTitle.length <= 0) {
                  toast.error("No post title to copy", {
                    action: {
                      label: "Close",
                      onClick: () => null,
                    },
                  });
                  return;
                }
                navigator.clipboard.writeText(postTitle);
                toast.success(
                  "Successfully copied post title to the clipboard",
                  {
                    action: {
                      label: "Close",
                      onClick: () => null,
                    },
                  }
                );
              }}
            >
              <Copy className="min-w-5 max-w-5 min-h-5 max-h-5" />
              <span>Copy Post Title</span>
            </button>
            <button
              className="flex rounded-md hover:text-white transition-colors duration-150 items-center gap-2 w-full px-4 py-2 text-left hover:bg-black/20"
              onClick={() => {
                setIsMenuOpen(false);
                if (details.length <= 0) {
                  toast.error("No details to copy", {
                    action: {
                      label: "Close",
                      onClick: () => null,
                    },
                  });
                  return;
                }
                navigator.clipboard.writeText(details);
                toast.success("Successfully copied details to the clipboard", {
                  action: {
                    label: "Close",
                    onClick: () => null,
                  },
                });
              }}
            >
              <Copy className="min-w-5 max-w-5 min-h-5 max-h-5" />
              <span>Copy Details</span>
            </button>
            <button
              disabled={ReportStatus.Pending === currentStatus}
              className="flex rounded-md disabled:cursor-not-allowed disabled:opacity-50 disabled:text-zinc-500 disabled:hover:text-zinc-500 disabled:bg-opacity-0 hover:text-yellow-500 transition-colors duration-150 items-center gap-2 w-full px-4 py-2 text-left hover:bg-black/20"
              onClick={() => {
                setIsMenuOpen(false);
                handleAction(ReportStatus.Pending);
              }}
            >
              <Hourglass className="min-w-5 max-w-5 min-h-5 max-h-5" />
              <span>Pending</span>
            </button>
            <button
              disabled={ReportStatus.Resolved === currentStatus}
              className="flex rounded-md disabled:cursor-not-allowed disabled:opacity-50 disabled:text-zinc-500 disabled:hover:text-zinc-500 disabled:bg-opacity-0 hover:text-green-500 transition-colors duration-150 items-center gap-2 w-full px-4 py-2 text-left hover:bg-black/20"
              onClick={() => {
                setIsMenuOpen(false);
                handleAction(ReportStatus.Resolved);
              }}
            >
              <CheckCircle className="min-w-5 max-w-5 min-h-5 max-h-5" />
              <span>Resolve</span>
            </button>
            <button
              disabled={ReportStatus.Dismissed === currentStatus}
              className="flex rounded-md disabled:cursor-not-allowed disabled:opacity-50 disabled:text-zinc-500 disabled:hover:text-zinc-500 disabled:bg-opacity-0 hover:text-neutral-500 transition-colors duration-150 items-center gap-2 w-full px-4 py-2 text-left hover:bg-black/20"
              onClick={() => {
                setIsMenuOpen(false);
                handleAction(ReportStatus.Dismissed);
              }}
            >
              <XCircle className="min-w-5 max-w-5 min-h-5 max-h-5" />
              <span>Dismiss</span>
            </button>
          </div>,
          document.body
        )}
    </div>
  );
};
