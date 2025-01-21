"use client";

import React from "react";
import { columns } from "./columns";
import { DataTable } from "./DataTable";

const ReportsPage = () => {
  return (
    <div className="flex overflow-hidden w-full h-full">
      <DataTable columns={columns} />
    </div>
  );
};

export default ReportsPage;
