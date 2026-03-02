'use client'
import { EmptyStateCard } from '@/components/shared/CardsUI';
import PlatformCard from './PlatformCard';
import { cn } from '@/lib/utils';

export default function SocialDataView({ socialScrapedData }: any) {

    if (!socialScrapedData || !socialScrapedData.social_platforms || socialScrapedData.social_platforms.length === 0) {
        return <EmptyStateCard message="No social media data available for this selection." />
    }

    const platformCount = socialScrapedData.social_platforms.length;
    const isMultiColumn = platformCount > 1;

    return (
        <div className={cn(
            "gap-6 space-y-6",
            isMultiColumn ? "columns-1 md:columns-2 md:space-y-0" : "w-full"
        )}>
            {socialScrapedData.social_platforms.map((platformData: any) => (
                <div key={platformData.platform} className={cn(
                    "break-inside-avoid",
                    isMultiColumn && "mb-6" 
                )}>
                    <PlatformCard platformData={platformData} />
                </div>
            ))}
        </div>
    );
}