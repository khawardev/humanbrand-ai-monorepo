import { formatDistanceToNowStrict, parseISO } from "date-fns";

export function formatSubs(num: number): string {
    if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(1).replace(/\.0$/, '') + 'B';
    if (num >= 1_000_000) return (num / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
    if (num >= 1_000) return (num / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
    return num.toString();
}


export function formatCompactTime(date: string | Date) {
    const parsedDate = typeof date === "string" ? parseISO(date) : date;
    const formatted = formatDistanceToNowStrict(parsedDate, {
        addSuffix: false,
    });

    return formatted
        .replace(" minutes", " min")
        .replace(" minute", " min")
        .replace(" hours", " hr")
        .replace(" hour", " hr")
        .replace(" seconds", " sec")
        .replace(" second", " sec")
        .replace(" days", " day")
        .replace(" day", " day")
        ;
}