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
        .replace(" years", "y")
        .replace(" year", "y")
        .replace(" months", "mo")
        .replace(" month", "mo")
        .replace(" days", "d")
        .replace(" day", "d")
        .replace(" hours", "h")
        .replace(" hour", "h")
        .replace(" minutes", "m")
        .replace(" minute", "m")
        .replace(" seconds", "s")
        .replace(" second", "s");
}