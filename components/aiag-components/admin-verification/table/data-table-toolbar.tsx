"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { CircleXIcon, Columns3Icon, ListFilterIcon, TrashIcon } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Spinner } from "@/shared/spinner";

export interface SearchableColumn<TData> {
    id: keyof TData | string;
    placeholder: string;
    label: string;
}

export interface FilterComponentProps<TData> {
    table: any;
}
export interface FilterComponent<TData> {
    id: string;
    component: React.ComponentType<FilterComponentProps<TData>>;
}

export interface DataTableToolbarProps<TData> {
    table: any;
    searchableColumns?: SearchableColumn<TData>[];
    filterComponents?: FilterComponent<TData>[];
    viewOptions?: boolean;
    onDeleteRows?: (selectedRows: TData[]) => Promise<void> | void;
    deleteConfirmMessage?: (count: number) => string;
    topBarComponents?: React.ReactNode;
}

export function DataTableToolbar<TData>({
    table,
    searchableColumns = [],
    filterComponents = [],
    viewOptions = true,
    onDeleteRows,
    deleteConfirmMessage = (count) => `This action cannot be undone. This will permanently delete ${count} selected item(s).`,
    topBarComponents,
}: DataTableToolbarProps<TData>) {

    const id = React.useId();
    const [primarySearchValue, setPrimarySearchValue] = React.useState("");
    const primarySearchColumnId = searchableColumns.length > 0 ? searchableColumns[0].id : undefined;
    const inputRef = React.useRef<HTMLInputElement>(null);
    const selectedRowCount = table.getFilteredSelectedRowModel().rows.length;

    const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
    const [isDeleting, setIsDeleting] = React.useState(false);

    React.useEffect(() => {
        if (!primarySearchColumnId) return;
        const timeout = setTimeout(() => {
            table.getColumn(primarySearchColumnId as string)?.setFilterValue(primarySearchValue);
        }, 300);

        return () => clearTimeout(timeout);
    }, [primarySearchValue, primarySearchColumnId, table]);

    const handleClearSearch = () => {
        if (!primarySearchColumnId) return;
        setPrimarySearchValue("");
        table.getColumn(primarySearchColumnId as string)?.setFilterValue("");
        inputRef.current?.focus();
    };

    const handleDeleteSelectedRows = async () => {
        if (!onDeleteRows) return;
        setIsDeleting(true);
        try {
            const selectedData = table.getFilteredSelectedRowModel().rows.map((row:any) => row.original);
            await onDeleteRows(selectedData);
            table.resetRowSelection();
            setDeleteDialogOpen(false);
        } catch (error) {
            console.error("Failed to delete rows:", error);
            toast.error("Failed to delete items. Please try again.");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex flex-row items-center sm:items-center gap-2 flex-grow">
                {primarySearchColumnId && searchableColumns.length > 0 && (
                    <div className="relative w-full sm:w-auto sm:min-w-60">
                        <Input
                            id={`${id}-search`}
                            ref={inputRef}
                            placeholder={searchableColumns[0].placeholder}
                            value={primarySearchValue}
                            onChange={(event) => setPrimarySearchValue(event.target.value)}
                            className={cn(
                                "pl-9 pr-9 w-full h-8",
                                Boolean(primarySearchValue) && "pr-9"
                            )}
                            aria-label={searchableColumns[0].label}
                        />
                        <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 left-0 flex items-center justify-center pl-3">
                            <ListFilterIcon size={16} aria-hidden="true" />
                        </div>
                        {Boolean(primarySearchValue) && (
                            <button
                                
                                className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 right-0 flex h-full w-9 items-center justify-center rounded-r-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                                aria-label="Clear search"
                                onClick={handleClearSearch}
                            >
                                <CircleXIcon size={16} aria-hidden="true" />
                            </button>
                        )}
                    </div>
                )}

                {filterComponents.map(filter => (
                    <filter.component key={filter.id} table={table} />
                ))}
            </div>

            <div className="flex items-center gap-2 flex-shrink-0 w-full md:w-auto justify-end">
                {selectedRowCount > 0 && onDeleteRows && (
                    <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm">
                                <TrashIcon className="mr-2 h-4 w-4" />
                                Delete ({selectedRowCount})
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    {deleteConfirmMessage(selectedRowCount)}
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                                <Button
                                    variant="destructive"
                                    onClick={handleDeleteSelectedRows}
                                    disabled={isDeleting}
                                >
                                    {isDeleting ? (
                                        <p className="flex items-center gap-2"><Spinner /> Deleting</p>
                                    ) : (
                                        "Delete"
                                    )}
                                </Button>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                )}
                {topBarComponents}
            </div>
        </div>
    );
}