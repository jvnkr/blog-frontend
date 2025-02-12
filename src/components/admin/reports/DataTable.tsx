"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  Row,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";

import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Repeat,
} from "lucide-react";
import useFetcher from "@/hooks/useFetcher";
import { useAuthContext } from "@/context/AuthContext";
import { toast } from "sonner";
import { ReportReasons, ReportStatus } from "@/lib/types";
import { ActionCell } from "@/components/ActionCell";
import { Report } from "./columns";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenuCheckboxItem } from "@/components/ui/dropdown-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
}

export function DataTable<TData, TValue>({
  columns,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [pageCount, setPageCount] = useState(0);
  const [reports, setReports] = useState<TData[]>([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const fetcher = useFetcher();
  const { accessToken } = useAuthContext();
  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const updateReportStatus = async (reportId: string, newStatus: string) => {
    setReports((prevReports) =>
      prevReports.map((report) =>
        (report as Report).id === reportId
          ? { ...report, status: newStatus }
          : report
      )
    );
    const response = await fetcher("/api/v1/report", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ reportId, newStatus }),
    });
    if (response.ok) {
      toast.success("Report status updated successfully", {
        action: {
          label: "Close",
          onClick: () => null,
        },
      });
    } else {
      toast.error("Failed to update report status", {
        action: {
          label: "Close",
          onClick: () => null,
        },
      });
    }
  };

  const columnsWithUpdate = columns.map((column) => {
    if (column.id === "actions") {
      return {
        ...column,
        cell: ({ row }: { row: Row<TData> }) => (
          <ActionCell
            postTitle={(row.original as Report).postTitle}
            details={(row.original as Report).details}
            currentStatus={(row.original as Report).status}
            updateReportStatus={updateReportStatus}
            reportId={(row.original as Report).id}
            postId={(row.original as Report).postId}
          />
        ),
      };
    }
    return column;
  });

  const fetchReports = async (pageNumber = 0, batchSize = 10) => {
    setLoading(true);
    try {
      const response = await fetcher("/api/v1/report/batch", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          pageNumber,
          batchSize,
        }),
      });
      const data = await response.json();
      for (let i = 0; i < data.reports.length; i++) {
        data.reports[i].reportId = i + 1 + pageNumber * batchSize;
      }
      setPageCount(data.pages);
      setReports(data.reports);
      setPagination({ pageIndex: pageNumber, pageSize: batchSize });
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  };

  const table = useReactTable({
    data: reports,
    columns: columnsWithUpdate,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
    pageCount,
    manualPagination: true,
    onPaginationChange: async (updater) => {
      const newState =
        typeof updater === "function"
          ? updater(table.getState().pagination)
          : updater;
      await fetchReports(newState.pageIndex, newState.pageSize);
    },
  });

  useEffect(() => {
    fetchReports();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCheckboxChange = (reason: string, checked: boolean) => {
    const updatedReasons = checked
      ? [...selectedReasons, reason]
      : selectedReasons.filter((r) => r !== reason);

    setSelectedReasons(updatedReasons);
    table
      .getColumn("reasons")
      ?.setFilterValue(updatedReasons.length ? updatedReasons : undefined);
  };

  const handleStatusChange = (status: string, checked: boolean) => {
    const updatedStatus = checked
      ? [...selectedStatus, status]
      : selectedStatus.filter((s) => s !== status);

    setSelectedStatus(updatedStatus);
    table
      .getColumn("status")
      ?.setFilterValue(updatedStatus.length ? updatedStatus : undefined);
  };

  const resetAllFilters = () => {
    setSelectedReasons([]);
    setSelectedStatus([]);
    table.resetColumnFilters();
    table.setColumnVisibility({});
  };

  if (loading && reports.length === 0) {
    return (
      <div className="flex justify-center items-center h-full w-full">
        <LoadingSpinner />
      </div>
    );
  }

  if (!loading && reports.length === 0) {
    return (
      <div className="flex justify-center items-center h-full w-full">
        <div className="flex text-center flex-col items-center">
          <span className="text-lg font-semibold text-muted-foreground">
            No reports found
          </span>
          <span className="text-sm text-muted-foreground">
            When users report posts, they will appear here for review.
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1 overflow-hidden h-full w-full">
      <div className="md:flex hidden flex-wrap overflow-hidden min-h-[3.4rem] h-[3.4rem] justify-between items-center pb-4 w-full">
        <div className="flex overflow-hidden flex-wrap h-full w-fit gap-2">
          <Button
            variant="ghost"
            className="bg-zinc-900 h-full border border-[#272629] text-white"
            onClick={resetAllFilters}
          >
            <Repeat className="w-4 h-4" />
            Reset all filters
          </Button>
          <Input
            placeholder="Filter by username or name"
            value={
              (table.getColumn("reportedBy")?.getFilterValue() as string) ?? ""
            }
            onChange={(event) => {
              table.getColumn("reportedBy")?.setFilterValue(event.target.value);
            }}
            className="min-h-full w-[14rem]"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex justify-between items-center max-w-fit gap-2 bg-zinc-900 border border-[#272629] text-white px-3 py-2 rounded-md">
                <span className="flex whitespace-nowrap text-sm outline-none justify-center items-center">
                  {selectedReasons.length > 0
                    ? `Filtered by ${selectedReasons.length} ${
                        selectedReasons.length === 1 ? "reason" : "reasons"
                      }`
                    : "Filter by reason"}
                </span>
                <ChevronDown className="h-4 w-4 opacity-50" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="bg-zinc-900 border border-[#272629] text-white"
              align="start"
            >
              <DropdownMenuCheckboxItem
                className="pl-2 gap-2 flex"
                onClick={() => {
                  setSelectedReasons([]);
                  table.getColumn("reasons")?.setFilterValue(undefined);
                }}
              >
                <Repeat className="w-4 h-4" />
                Reset
              </DropdownMenuCheckboxItem>
              {Object.values(ReportReasons).map((reason) => (
                <DropdownMenuCheckboxItem
                  key={reason}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleCheckboxChange(
                      reason,
                      !selectedReasons.includes(reason)
                    );
                  }}
                  className="capitalize"
                  checked={selectedReasons.includes(reason)}
                  onCheckedChange={(value) =>
                    handleCheckboxChange(reason, value)
                  }
                >
                  {reason.charAt(0) + reason.slice(1).toLowerCase()}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex justify-between items-center max-w-fit gap-2 bg-zinc-900 border border-[#272629] text-white px-3 py-2 rounded-md">
                <span className="flex whitespace-nowrap text-sm outline-none justify-center items-center">
                  {selectedStatus.length > 0
                    ? `Filtered by ${selectedStatus.length} ${
                        selectedStatus.length === 1 ? "status" : "statuses"
                      }`
                    : "Filter by status"}
                </span>
                <ChevronDown className="h-4 w-4 opacity-50" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="bg-zinc-900 border border-[#272629] text-white"
              align="start"
            >
              <DropdownMenuCheckboxItem
                className="pl-2 gap-2 flex"
                onClick={() => {
                  setSelectedStatus([]);
                  table.getColumn("status")?.setFilterValue(undefined);
                }}
              >
                <Repeat className="w-4 h-4" />
                Reset
              </DropdownMenuCheckboxItem>
              {Object.values(ReportStatus).map((status) => (
                <DropdownMenuCheckboxItem
                  key={status}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleStatusChange(
                      status,
                      !selectedStatus.includes(status)
                    );
                  }}
                  className="capitalize"
                  checked={selectedStatus.includes(status)}
                  onCheckedChange={(value) => handleStatusChange(status, value)}
                >
                  {status.charAt(0) + status.slice(1).toLowerCase()}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex text-sm outline-none justify-center items-center h-full bg-zinc-900 border border-[#272629] text-white px-4 py-2 rounded-md">
                Columns
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="bg-zinc-900 border border-[#272629] text-white"
              align="end"
            >
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id === "createdAt" ? "Reported Date" : column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected
        </div>
      </div>
      <div className="flex w-full rounded-md border overflow-hidden">
        <Table className="w-full overflow-hidden">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="sticky top-0 z-[100]">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row, index) => (
                <TableRow
                  className={`${
                    index === table.getRowModel().rows.length - 1 &&
                    "rounded-b-lg"
                  }`}
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, {
                        ...cell.getContext(),
                        updateReportStatus,
                      })}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 rounded-lg text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="md:flex hidden min-h-[3.3rem] h-[3.3rem] justify-end w-full pt-4 items-center overflow-hidden">
        <div className="flex w-full items-center space-x-2 overflow-hidden">
          <p className="text-sm font-medium text-muted-foreground">
            Rows per page
          </p>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value));
              fetchReports(
                table.getState().pagination.pageIndex,
                Number(value)
              );
            }}
          >
            <SelectTrigger className="h-8 w-[70px] border border-[#272629] focus:outline-none focus:ring-0">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent
              side="top"
              className="bg-zinc-900 border border-[#272629] text-white"
            >
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex w-[100px] items-center justify-center text-sm font-medium text-muted-foreground">
          Page {pagination.pageIndex + 1} of {table.getPageCount()}
        </div>
        <div className="flex items-center space-x-2 overflow-hidden">
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to first page</span>
            <ChevronsLeft />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeft />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => {
              table.nextPage();
            }}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRight />
          </Button>
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to last page</span>
            <ChevronsRight />
          </Button>
        </div>
      </div>
    </div>
  );
}
