export const formatNumber = (num: number | string | undefined): string => {
    if (num === undefined || num === null) return '0';
    const n = typeof num === 'string' ? parseInt(num) : num;
    if (isNaN(n)) return '0';
    if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
    if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
    return n.toString();
};

export const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
};

export const getPathname = (url: string): string => {
    try {
        return new URL(url).pathname || '/';
    } catch {
        return url;
    }
};

export const normalizeImageUrl = (url: string | null | undefined): string => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    
    // Handle s3:// protocol
    if (url.startsWith('s3://')) {
        // Format: s3://bucket-name/path/to/key
        const parts = url.replace('s3://', '').split('/');
        const bucket = parts[0];
        const key = parts.slice(1).join('/');
        
        // Assumption: Us-east-1 standard endpoint or generic s3 endpoint
        return `https://${bucket}.s3.amazonaws.com/${key}`;
    }
    
    return url;
};
