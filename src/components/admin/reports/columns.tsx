"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ReasonCell } from "./ReasonCell";
import { ReportReasons, ReportStatus } from "@/lib/types";
import { Button } from "../../ui/button";
import { ArrowUpDown, Dot } from "lucide-react";
import { Checkbox } from "../../ui/checkbox";
import AvatarInfo from "../../profile/AvatarInfo";
import Tooltip from "../../Tooltip";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Report = {
  id: string;
  reportId: string; // mask id
  postTitle: string;
  postId: string;
  reportedBy: {
    username: string;
    name: string;
    verified: boolean;
  };
  reasons: Array<ReportReasons>;
  status: ReportStatus;
  details: string;
  createdAt: string;
};

export const columns: ColumnDef<Report>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        className="w-4 h-4 border-neutral-600"
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        className="w-4 h-4 border-neutral-600"
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "reportId",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="w-full flex justify-start items-center"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        #
        <ArrowUpDown className="w-4 h-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const reportId = row.getValue("reportId") as string;
      return (
        <div className="w-full text-zinc-500 flex justify-center items-center">
          {reportId}
        </div>
      );
    },
  },
  {
    accessorKey: "postTitle",
    header: ({ column }) => (
      <Button
        className="w-full flex justify-start items-center"
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Post Title
        <ArrowUpDown className="w-4 h-4" />
      </Button>
    ),
  },
  {
    accessorKey: "reportedBy",
    cell: ({ row }) => {
      const reportedBy = row.getValue("reportedBy") as {
        username: string;
        name: string;
        verified: boolean;
      };
      return (
        <AvatarInfo
          linkHref={`/@${reportedBy.username}`}
          target="_blank"
          username={reportedBy.username}
          name={reportedBy.name}
          verified={reportedBy.verified}
        />
      );
    },
    header: ({ column }) => (
      <Button
        className="w-full flex justify-start items-center"
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Reported By
        <ArrowUpDown className="w-4 h-4" />
      </Button>
    ),
    filterFn: (row, columnId, filterValue) => {
      const reportedBy = row.getValue(columnId) as {
        username: string;
        name: string;
        verified: boolean;
      };
      const lowerFilterValue = filterValue.toLowerCase();
      return (
        reportedBy.username.toLowerCase().includes(lowerFilterValue) ||
        reportedBy.name.toLowerCase().includes(lowerFilterValue)
      );
    },
  },
  {
    accessorKey: "reasons",
    header: ({ column }) => (
      <Button
        className="w-full flex justify-start items-center"
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Reason
        <ArrowUpDown className="w-4 h-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const reason = row.getValue("reasons") as Array<ReportReasons>;
      return (
        <div className="flex gap-2">
          {reason.map((reason) => (
            <div
              key={reason}
              className={`w-fit p-2 px-3 bg-opacity-50 rounded-full ${
                reason === ReportReasons.Spam
                  ? "bg-blue-500"
                  : reason === ReportReasons.Inappropriate
                  ? "bg-red-500"
                  : reason === ReportReasons.Harassment
                  ? "bg-purple-500"
                  : reason === ReportReasons.Misinformation
                  ? "bg-yellow-500"
                  : "bg-orange-500"
              }`}
            >
              {reason.toUpperCase()}
            </div>
          ))}
        </div>
      );
    },
    filterFn: (row, columnId, filterValue: string[]) => {
      const reasons = row.getValue(columnId) as Array<ReportReasons>;
      return reasons.some((reason) => filterValue.includes(reason));
    },
  },
  {
    accessorKey: "details",
    header: ({ column }) => (
      <Button
        className="w-full flex justify-start items-center"
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Details
        <ArrowUpDown className="w-4 h-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const details = row.getValue("details") as string;
      return <ReasonCell reason={details} />;
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <Button
        className="w-full flex justify-start items-center"
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Status
        <ArrowUpDown className="w-4 h-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const status = row.getValue("status") as ReportStatus;
      const backgroundColor =
        status === ReportStatus.Pending
          ? "bg-yellow-500"
          : status === ReportStatus.Resolved
          ? "bg-green-500"
          : "bg-gray-500";
      return (
        <div className="flex w-full justify-center items-center">
          <div
            className={`flex justify-center bg-opacity-80 p-2 px-6 rounded-full items-center gap-2 w-[6rem] ${backgroundColor}`}
          >
            {status.charAt(0) + status.slice(1).toLowerCase()}
          </div>
        </div>
      );
    },
    filterFn: (row, columnId, filterValue: string[]) => {
      const status = row.getValue(columnId) as ReportStatus;
      return filterValue.includes(status);
    },
  },
  {
    accessorKey: "createdAt",
    cell: ({ row }) => {
      const createdAt = row.getValue("createdAt") as string;
      const date = new Date(createdAt);
      const formattedDate = `${date.getDate().toString().padStart(2, "0")}/${(
        date.getMonth() + 1
      )
        .toString()
        .padStart(2, "0")}/${date.getFullYear()}`;
      return (
        <Tooltip
          triggerStyle={{
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
          tooltipTrigger={
            <div className="w-full flex justify-center items-center">
              {formattedDate}
            </div>
          }
          tooltipContent={
            <>
              <p>
                {date?.toLocaleString("en-US", {
                  hour: "numeric",
                  minute: "2-digit",
                  hour12: true,
                })}{" "}
              </p>
              <Dot className="w-[16px] h-full font-light text-neutral-600" />
              <p>
                {date?.toLocaleString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </>
          }
        />
      );
    },
    header: ({ column }) => (
      <Button
        className="w-full flex justify-start items-center"
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        <span className="flex flex-col justify-center items-center">
          Reported Date
          <span className="text-xs text-zinc-500">{"(dd/mm/yyyy)"}</span>
        </span>
        <ArrowUpDown className="w-4 h-4" />
      </Button>
    ),
  },
  {
    id: "actions",
    accessorKey: "actions",
    header: () => (
      <Button
        className="w-full flex justify-start items-center"
        variant="ghost"
      >
        <span className="flex flex-col justify-center items-center">
          Actions
        </span>
      </Button>
    ),
  },
];
