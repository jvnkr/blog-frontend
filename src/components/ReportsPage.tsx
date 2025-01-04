"use client";

import { useAuthContext } from "@/context/AuthContext";
import React from "react";
import { columns } from "./columns";
import { DataTable } from "./DataTable";

// Mock data for post reports
// const mockData = [
//   {
//     postTitle:
//       "Understanding React Hooks, lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
//     reportedBy: "user123",
//     postId: "2efdd0f8-b387-4074-b979-1866664ef3df",
//     reasons: [ReportReasons.Inappropriate],
//     status: ReportStatus.Pending,
//     createdAt: "2023-10-01",
//   },
//   {
//     postTitle: "JavaScript ES6 Features",
//     reportedBy: "user456",
//     postId: "2efdd0f8-b387-4074-b979-1866664ef3df",
//     reasons: [ReportReasons.Spam],
//     status: ReportStatus.Resolved,
//     createdAt: "2023-10-02",
//   },
//   {
//     postTitle: "CSS Grid Layout",
//     reportedBy: "user789",
//     postId: "2efdd0f8-b387-4074-b979-1866664ef3df",
//     reasons: [
//       ReportReasons.Harassment,
//       ReportReasons.Misinformation,
//       ReportReasons.Spam,
//       ReportReasons.Inappropriate,
//       ReportReasons.Other,
//     ],
//     status: ReportStatus.Dismissed,
//     details:
//       "This is a test details, lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
//     createdAt: "2023-10-03",
//   },
//   // Add more mock data as needed
// ] as Report[];

const ReportsPage = () => {
  const { loggedIn, role } = useAuthContext();

  if (loggedIn === undefined || role === undefined) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <DataTable columns={columns} />
    </div>
  );
};

export default ReportsPage;
