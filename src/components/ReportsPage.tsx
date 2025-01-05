"use client";

import { useAuthContext } from "@/context/AuthContext";
import React from "react";
import { columns } from "./columns";
import { DataTable } from "./DataTable";

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
