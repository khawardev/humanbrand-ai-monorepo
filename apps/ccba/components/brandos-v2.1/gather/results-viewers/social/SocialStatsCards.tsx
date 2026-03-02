import { Card, CardContent } from "@/components/ui/card";
import { Eye, Heart, MessageSquare, Share2, Users } from 'lucide-react';
import { formatNumber } from "../utils";
import { cn } from "@/lib/utils";

export function SocialStatCard({ icon: Icon, value, label, className, iconContainerClassName, iconClassName }: any) {
    return (
        <Card className={cn("border-2  rounded-2xl", className)}>
            <CardContent >
                <div className="flex items-center gap-3">
                    <div className={cn("p-2 rounded-lg", iconContainerClassName)}>
                        <Icon className={cn("w-5 h-5", iconClassName)} />
                    </div>
                    <div>
                        <p className="text-xl font-medium leading-none">{formatNumber(value)}</p>
                        <p className="text-xs text-muted-foreground mt-1">{label}</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

export function SocialStatsCards({ stats, platformCount, totalFollowers }: any) {
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
             <SocialStatCard 
                icon={Users} 
                value={totalFollowers} 
                label="Audience" 
                className="bg-gradient-to-br from-indigo-500/10 to-indigo-600/5 border-indigo-500/20"
                iconContainerClassName="bg-indigo-500/20"
                iconClassName="text-indigo-600"
            />
            <SocialStatCard 
                icon={MessageSquare} 
                value={stats.posts} 
                label="Posts" 
                className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20"
                iconContainerClassName="bg-blue-500/20"
                iconClassName="text-blue-600"
            />
            <SocialStatCard 
                icon={Eye} 
                value={stats.views} 
                label="Views" 
                className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-500/20"
                iconContainerClassName="bg-purple-500/20"
                iconClassName="text-purple-600"
            />
            <SocialStatCard 
                icon={Heart} 
                value={stats.likes} 
                label="Likes" 
                className="bg-gradient-to-br from-pink-500/10 to-pink-600/5 border-pink-500/20"
                iconContainerClassName="bg-pink-500/20"
                iconClassName="text-pink-600"
            />
            <SocialStatCard 
                icon={Share2} 
                value={stats.shares} 
                label="Shares" 
                className="bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-500/20"
                iconContainerClassName="bg-green-500/20"
                iconClassName="text-green-600"
            />
            <SocialStatCard 
                icon={Users} 
                value={platformCount} 
                label="Platforms" 
                className="bg-gradient-to-br from-orange-500/10 to-orange-600/5 border-orange-500/20"
                iconContainerClassName="bg-orange-500/20"
                iconClassName="text-orange-600"
            />
        </div>
    );
}
