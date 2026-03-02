"use client"

import { LegendProps } from "recharts"

interface CustomLegendProps extends LegendProps {
    colors?: string[]
}

export default function CustomLegend({ payload, colors }: any) {
    if (!payload) return null
    return (
        <ul className="flex flex-wrap justify-center items-center list-none m-0 p-0">
            {payload.map((entry: any, index: any) => {
                const color = colors?.[index % colors.length] || entry.color
                return (
                    <li key={`item-${index}`} className="flex items-center  mr-3">
                        <span
                            className="inline-block rounded w-3 h-3 mr-1.5"
                            style={{ backgroundColor: color }}
                        />
                        <span className="text-sm">{entry.value}</span>
                    </li>
                )
            })}
        </ul>
    )
}