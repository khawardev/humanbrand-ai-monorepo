"use client";

import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    ChevronLeftIcon,
    ChevronRightIcon,
    ChevronsLeftIcon,
    ChevronsRightIcon,
} from "lucide-react";
import { useId } from "react";
import { Label } from "@/components/ui/label";

interface DataTablePaginationProps<TData> {
    table: any;
    pageSizeOptions?: number[];
}

export function DataTablePagination<TData>({
    table,
    pageSizeOptions = [5, 10, 25, 50, 100],
}: DataTablePaginationProps<TData>) {
    const id = useId();
    const currentPage = table.getState().pagination.pageIndex + 1;
    const pageCount = table.getPageCount();

    return (
        <div className="flex flex-col md:flex-row items-center justify-between px-2 gap-4 md:gap-8">
            <div className="flex-1 text-sm text-muted-foreground">
                {table.getFilteredSelectedRowModel().rows.length} of{" "}
                {table.getFilteredRowModel().rows.length} row(s) selected.
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 lg:gap-8 w-full sm:w-auto">
                <div className="flex items-center space-x-2">
                    <Label htmlFor={id} className="whitespace-nowrap text-sm font-medium">Rows per page</Label>
                    <Select
                        value={`${table.getState().pagination.pageSize}`}
                        onValueChange={(value) => {
                            table.setPageSize(Number(value));
                        }}
                    >
                        <SelectTrigger size="sm" id={id} className="w-[70px]">
                            <SelectValue placeholder={table.getState().pagination.pageSize} />
                        </SelectTrigger>
                        <SelectContent side="top">
                            {pageSizeOptions.map((pageSize) => (
                                <SelectItem key={pageSize} value={`${pageSize}`}>
                                    {pageSize}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex w-auto items-center justify-center text-sm font-medium whitespace-nowrap">
                    {pageCount > 0 ? (
                        `Page ${currentPage} of ${pageCount}`
                    ) : (
                        'Page 0 of 0'
                    )}
                </div>

                <div className="flex items-center space-x-2">
                    <Button
                        size={'icon'}
                        variant="outline"
                        onClick={() => table.setPageIndex(0)}
                        disabled={!table.getCanPreviousPage()}
                        aria-label="Go to first page"
                    >
                        <ChevronsLeftIcon className="h-4 w-4" />
                    </Button>
                    <Button
                        size={'icon'}
                        variant="outline"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                        aria-label="Go to previous page"
                    >
                        <ChevronLeftIcon className="h-4 w-4" />
                    </Button>
                    <Button
                        size={'icon'}
                        variant="outline"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                        aria-label="Go to next page"
                    >
                        <ChevronRightIcon className="h-4 w-4" />
                    </Button>
                    <Button
                        size={'icon'}
                        variant="outline"
                        className="hidden lg:flex"
                        onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                        disabled={!table.getCanNextPage()}
                        aria-label="Go to last page"
                    >
                        <ChevronsRightIcon className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}