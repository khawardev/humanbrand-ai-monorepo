"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { Spinner } from "@/components/shared/Spinner";

import { DataTablePagination } from "./DataTablePagination";
import {
  DataTableToolbar,
  DataTableToolbarProps,
} from "./DataTableToolbar";

interface DataTableProps<TData, TValue>
  extends Omit<DataTableToolbarProps<TData>, "table"> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  title?: string;
  initialPageSize?: number;
  initialSort?: SortingState;
  initialColumnFilters?: ColumnFiltersState;
  initialColumnVisibility?: VisibilityState;
  isLoading?: boolean;
  noResultsMessage?: string;
  containerClassName?: string;
  tableClassName?: string;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchableColumns,
  filterComponents,
  viewOptions = true,
  title,
  onDeleteRows,
  deleteConfirmMessage,
  initialPageSize = 10,
  initialSort = [],
  initialColumnFilters = [],
  initialColumnVisibility = {},
  isLoading = false,
  noResultsMessage = "No results.",
  containerClassName,
  tableClassName,
  topBarComponents,
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>(initialColumnVisibility);
  const [columnFilters, setColumnFilters] =
    React.useState<ColumnFiltersState>(initialColumnFilters);
  const [sorting, setSorting] = React.useState<SortingState>(initialSort);
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: initialPageSize,
  });

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  return (
    <div className={cn("w-full space-y-8", containerClassName)}>
      <div className="md:space-y-8 mt-8">
        <DataTableToolbar
          table={table}
          searchableColumns={searchableColumns}
          filterComponents={filterComponents}
          viewOptions={viewOptions}
          onDeleteRows={onDeleteRows}
          deleteConfirmMessage={deleteConfirmMessage}
          topBarComponents={topBarComponents}
        />

        <div className="rounded-2xl border overflow-x-auto shadow">
          <Table className={cn("w-full table-auto", tableClassName)}>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow
                  key={headerGroup.id}
                  className="hover:bg-transparent border-b"
                >
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead
                        key={header.id}
                        colSpan={header.colSpan}
                        style={{
                          width:
                            header.getSize() !== 150
                              ? `${header.getSize()}px`
                              : undefined,
                        }}
                        className="h-11 whitespace-nowrap px-4 text-left align-middle font-medium text-muted-foreground"
                      >
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
              {isLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    <div className="flex justify-center items-center gap-2">
                      <Spinner />
                    </div>
                  </TableCell>
                </TableRow>
              ) : table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className="border-b transition-colors hover:bg-accent/50 data-[state=selected]:bg-accent"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className="p-4 align-middle [&:has([role=checkbox])]:pr-0"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    {noResultsMessage}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <DataTablePagination table={table} />
      </div>
    </div>
  );
}
