import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function truncate(text: string, length: number) {
  return text.length > length ? text.slice(0, length) + "…" : text;
}

export function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

export const getErrorMessage = (error: unknown): string => {
  let message: string;

  if (error instanceof Error) {
    message = error.message;
  } else if (error && typeof error === "object" && "message" in error) {
    message = String((error as { message: unknown }).message);
  } else if (typeof error === "string") {
    message = error;
  } else {
    message = "Something went wrong";
  }

  return message;
};



export function formatCount(value: number) {
  if (value >= 1_000_000) return (value / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  if (value >= 1_000) return (value / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
  return value.toString();
}


export function timeAgo(dateString: string) {
  const date = new Date(dateString)
  date.setHours(date.getHours() + 5)
  const now = new Date()
  const diff = (now.getTime() - date.getTime()) / 1000
  const units = [
    { name: 'year', seconds: 31536000 },
    { name: 'month', seconds: 2592000 },
    { name: 'day', seconds: 86400 },
    { name: 'hour', seconds: 3600 },
    { name: 'min', seconds: 60 },
    { name: 'sec', seconds: 1 },
  ]

  for (const unit of units) {
    const interval = Math.floor(diff / unit.seconds)
    if (interval >= 1)
      return `${interval} ${unit.name}${interval > 1 ? 's' : ''} ago`
  }

  return 'just now'
}



export async function pollUntilComplete<T>(
  fn: () => Promise<T>,
  checkCondition: (res: T) => boolean,
  delayMs = 60000,
  maxRetries = 1000
) {
  const delay = (ms: number) => new Promise((res) => setTimeout(res, ms))

  for (let i = 0; i < maxRetries; i++) {
    const result = await fn()
    if (checkCondition(result)) return result
    await delay(delayMs)
  }

  throw new Error("Polling timed out")
}

export const extractFilePaths = (files?: File[]) =>
  (files || []).map((file: File & { path?: string; relativePath?: string }) =>
    file.path || file.relativePath || file.name
  );

export function arrangeAgentIds(ids: any) {
  const withMeta = ids.map((id: any) => {
    const [num, suffix] = id.split("-");
    return {
      raw: id,
      num: parseInt(num, 10),
      suffix: suffix || null
    };
  });

  withMeta.sort((a: any, b: any) => {
    if (a.num !== b.num) return a.num - b.num;
    if (a.suffix === null && b.suffix !== null) return -1;
    if (a.suffix !== null && b.suffix === null) return 1;
    return (a.suffix || "").localeCompare(b.suffix || "");
  });

  return withMeta.map((x: any) => x.raw);
}

export const normalizeImageUrl = (url: string | null | undefined): string => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;

  // Handle s3:// protocol
  if (url.startsWith('s3://')) {
    // Format: s3://bucket-name/path/to/key
    // Example: s3://east1-brandos-backend-dev/images/...
    const parts = url.replace('s3://', '').split('/');
    const bucket = parts[0];
    const key = parts.slice(1).join('/');

    // Construct standard S3 HTTP URL
    // Note: This assumes standard AWS S3 naming. 
    // If the bucket is in a specific region other than us-east-1 and not using CNAME, 
    // s3.amazonaws.com might redirect or fail. 
    // Ideally, we'd know the region, but this is a best-effort client-side conversion.
    return `https://${bucket}.s3.amazonaws.com/${key}`;
  }

  return url;
};

export function isStatusProcessing(status: string | null): boolean {
  if (!status) return false;
  const completedStatuses = ['Completed', 'CompletedWithErrors', 'Failed'];
  return !completedStatuses.includes(status);
}

export function isWithinOneDay(dateString: string | null | undefined): boolean {
  if (!dateString) return false;
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return false;
  const now = new Date();
  const oneDayInMs = 24 * 60 * 60 * 1000;
  const diff = now.getTime() - date.getTime();
  return diff >= 0 && diff <= oneDayInMs;
}
