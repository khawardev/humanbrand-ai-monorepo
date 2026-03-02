export interface ViewerProps {
    scrapsData: any;
    brandName: string;
    brandData?: any;
    status?: string | null;
}

export interface WebsitePage {
    url: string;
    content?: string;
    html_content?: string;
    image_urls?: string[];
}

export interface SocialStats {
    posts: number;
    views: number;
    likes: number;
    shares: number;
    comments: number;
}
