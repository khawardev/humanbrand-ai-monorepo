"use client";

import React, { useMemo } from "react";
import { Table } from "@tanstack/react-table";
import { FilterIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

const typeOptions = [
  { value: "company", label: "Company Users" },
  { value: "external", label: "External Users" },
];

interface UserTypeFilterProps<TData> {
  table: Table<TData>;
}

export function UserTypeFilter<TData>({
  table,
}: UserTypeFilterProps<TData>) {
  const id = React.useId();
  const column = table.getColumn("userType");

  const selectedValues = useMemo(() => {
    const filterValue = column?.getFilterValue() as string[] | undefined;
    return new Set(filterValue ?? []);
  }, [column?.getFilterValue()]);

  const handleCheckedChange = (checked: boolean, value: string) => {
    const currentFilter = column?.getFilterValue() as
      | string[]
      | undefined;
    let newFilter: string[];

    if (checked) {
      newFilter = [...(currentFilter ?? []), value];
    } else {
      newFilter = (currentFilter ?? []).filter((v) => v !== value);
    }

    column?.setFilterValue(
      newFilter.length > 0 ? newFilter : undefined
    );
  };

  if (!column) {
    return null;
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size={'sm'} >
          <FilterIcon  />
          Type
          {selectedValues.size > 0 && (
            <>
              <Separator orientation="vertical" className="mx-2 h-4" />
              <span className="bg-secondary text-secondary-foreground rounded-sm px-1 font-normal lg:hidden">
                {selectedValues.size}
              </span>
              <span className="hidden lg:inline">
                {selectedValues.size} selected
              </span>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <div className="p-3">
          <p className="font-medium text-sm mb-2">Filter by type</p>
          <div className="space-y-2">
            {typeOptions.map((option) => (
              <div key={option.label} className="flex items-center gap-2">
                <Checkbox
                  id={`${id}-${option.label}`}
                  checked={selectedValues.has(option.value)}
                  onCheckedChange={(checked) =>
                    handleCheckedChange(Boolean(checked), option.value)
                  }
                />
                <Label
                  htmlFor={`${id}-${option.label}`}
                  className="font-normal text-sm"
                >
                  {option.label}
                </Label>
              </div>
            ))}
          </div>
        </div>
        {selectedValues.size > 0 && (
          <>
            <Separator />
            <div className="p-1">
              <Button
                onClick={() => column?.setFilterValue(undefined)}
                variant="ghost"
                className="w-full justify-center h-8 font-normal"
              >
                Clear filters
              </Button>
            </div>
          </>
        )}
      </PopoverContent>
    </Popover>
  );
}
