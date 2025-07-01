"use client";

import React, { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { FilterIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

const statusOptions = [
    { value: true, label: "Verified" },
    { value: false, label: "Not Verified" },
];

export function UserStatusFilter<TData>({ table }:any) {
    const id = React.useId();
    const statusColumn = table.getColumn('adminVerified');

    const selectedValues = useMemo(() => {
        const filterValue = statusColumn?.getFilterValue() as boolean[] | undefined;
        return new Set(filterValue ?? []);
    }, [statusColumn?.getFilterValue()]);

    const handleCheckedChange = (checked: boolean, value: boolean) => {
        const currentFilter = statusColumn?.getFilterValue() as boolean[] | undefined;
        let newFilter: boolean[];

        if (checked) {
            newFilter = [...(currentFilter ?? []), value];
        } else {
            newFilter = (currentFilter ?? []).filter(v => v !== value);
        }

        statusColumn?.setFilterValue(newFilter.length > 0 ? newFilter : undefined);
    };

    if (!statusColumn) {
        return null;
    }

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline" size="sm" >
                    <FilterIcon />
                    Status
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0" align="start">
                <div className="p-3">
                    <p className="font-medium text-sm mb-2">Filter by status</p>
                    <div className="space-y-2">
                        {statusOptions.map((option) => (
                            <div key={option.label} className="flex items-center gap-2">
                                <Checkbox
                                    id={`${id}-${option.label}`}
                                    checked={selectedValues.has(option.value)}
                                    onCheckedChange={(checked) => handleCheckedChange(Boolean(checked), option.value)}
                                />
                                <Label htmlFor={`${id}-${option.label}`} className="font-normal text-sm">
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
                                onClick={() => statusColumn?.setFilterValue(undefined)}
                                variant="ghost"
                                className="w-full justify-start h-8 font-normal"
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