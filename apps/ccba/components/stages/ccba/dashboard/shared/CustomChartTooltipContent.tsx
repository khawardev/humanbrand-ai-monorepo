function CustomChartTooltipContent({ active, payload, label, formatter }: any) {
    if (!active || !payload || !payload.length) return null;

    return (
        <div className='relative'>
            <div className=" dark:bg-accent/30 bg-border/80  border  backdrop-blur-2xl z-50 rounded-md p-1.5 text-sm">
                {label && <div className=" mb-2 text-xs">{label}</div>}
                {payload.map((entry: any,index:any) => {
                    const name = entry.name || entry.dataKey || 'Value';
                    const color = entry.color || entry.payload?.fill || 'var(--primary)';
                    return (
                        <div key={index} className="flex  items-center justify-between gap-8">
                                <div className=' flex items-center gap-2'>
                                    <span
                                        style={{ backgroundColor: color }}
                                        className="inline-block w-2 h-2 rounded-xs"
                                    />
                                    <span className=' text-xs'>{name}</span>
                                </div>
                            <span className=" text-xs">{formatter ? formatter(entry.value) : entry.value}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default CustomChartTooltipContent