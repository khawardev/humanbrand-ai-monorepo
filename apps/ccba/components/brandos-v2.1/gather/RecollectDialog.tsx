'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { DateRange } from 'react-day-picker';
import { format, subMonths } from 'date-fns';
import { toast } from 'sonner';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { DatePickerWithRange } from '@/components/stages/ccba/details/scraps-tab/social/DatePickerwithRange';
import { ChevronDown, Globe, Share2, RefreshCw, Loader2 } from 'lucide-react';


type RecollectDialogProps = {
    brandId: string;
    brandName?: string;
    trigger?: React.ReactNode;
    variant?: 'dropdown' | 'button';
    showWebsite?: boolean;
    showSocial?: boolean;
};

export function RecollectDialog({ 
    brandId, 
    brandName,
    trigger,
    variant = 'dropdown',
    showWebsite = true,
    showSocial = true
}: RecollectDialogProps) {
    const [openDialog, setOpenDialog] = useState<'website' | 'social' | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const today = new Date();
    const defaultStartDate = subMonths(today, 3);
    const [socialDateRange, setSocialDateRange] = useState<DateRange | undefined>({
        from: defaultStartDate,
        to: today,
    });

    const form = useForm({
        defaultValues: {
            webLimit: 10,
        }
    });

    const handleWebsiteScrape = () => {
        setIsLoading(true);
        try {
            const webLimit = form.getValues('webLimit');
            const redirectUrl = `/dashboard/brandos-v2.1/gather/collecting/${brandId}?triggerScrape=true&scrapeType=web&webLimit=${webLimit}`;
            router.push(redirectUrl);
        } catch (e) {
            toast.error('An error occurred');
            setIsLoading(false);
        }
    };

    const handleSocialScrape = () => {
        if (!socialDateRange?.from) {
            toast.error('Please select a date range');
            return;
        }
        setIsLoading(true);
        try {
            const startDate = format(socialDateRange.from, 'yyyy-MM-dd');
            const endDate = socialDateRange.to ? format(socialDateRange.to, 'yyyy-MM-dd') : format(today, 'yyyy-MM-dd');
            
            const redirectUrl = `/dashboard/brandos-v2.1/gather/collecting/${brandId}?triggerScrape=true&scrapeType=social&startDate=${startDate}&endDate=${endDate}`;
            router.push(redirectUrl);
        } catch (e) {
            toast.error('An error occurred');
            setIsLoading(false);
        }
    };

    const handleBothScrape = () => {
        if (!socialDateRange?.from) {
            toast.error('Please select a date range for social media');
            return;
        }
        setIsLoading(true);
        try {
            const webLimit = form.getValues('webLimit');
            const startDate = format(socialDateRange.from, 'yyyy-MM-dd');
            const endDate = socialDateRange.to ? format(socialDateRange.to, 'yyyy-MM-dd') : format(today, 'yyyy-MM-dd');

            const redirectUrl = `/dashboard/brandos-v2.1/gather/collecting/${brandId}?triggerScrape=true&scrapeType=both&webLimit=${webLimit}&startDate=${startDate}&endDate=${endDate}`;
            router.push(redirectUrl);
        } catch (e) {
            toast.error('An error occurred');
            setIsLoading(false);
        }
    };

    const WebsiteDialogContent = (
        <DialogContent className="sm:max-w-md">
            <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                    <Globe className="w-5 h-5" />
                    Website Capture Config
                </DialogTitle>
                <DialogDescription>
                    Configure website data collection settings{brandName ? ` for ${brandName}` : ''}.
                </DialogDescription>
            </DialogHeader>
            <div>
                <div className="space-y-2">
                    <Label>Max Pages to Capture</Label>
                    <Input
                        type="number"
                        placeholder="10"
                        className="h-11 text-lg"
                        {...form.register('webLimit', { valueAsNumber: true })}
                        defaultValue={10}
                    />
                    <p className="text-xs text-muted-foreground">
                        Number of pages to crawl per website (Client & Competitors).
                    </p>
                </div>
            </div>
            <DialogFooter>
                <Button variant="ghost" onClick={() => setOpenDialog(null)} disabled={isLoading}>
                    Cancel
                </Button>
                <Button onClick={handleWebsiteScrape} disabled={isLoading}>
                    {isLoading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Capturing</> : 'Capture'}
                </Button>
            </DialogFooter>
        </DialogContent>
    );

    const SocialDialogContent = (
        <DialogContent className="sm:max-w-md">
            <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                    <Share2 className="w-5 h-5" />
                    Social Capture Config
                </DialogTitle>
                <DialogDescription>
                    Configure social media data collection settings{brandName ? ` for ${brandName}` : ''}.
                </DialogDescription>
            </DialogHeader>
            <div>
                <div className="space-y-2">
                    <Label>Social Date Range</Label>
                    <DatePickerWithRange date={socialDateRange} setDate={setSocialDateRange} />
                    <p className="text-xs text-muted-foreground">
                        Select the start and end date for historical data collection.
                    </p>
                </div>
            </div>
            <DialogFooter>
                <Button variant="ghost" onClick={() => setOpenDialog(null)} disabled={isLoading}>
                    Cancel
                </Button>
                <Button onClick={handleSocialScrape} disabled={isLoading}>
                    {isLoading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Capturing</> : 'Capture'}
                </Button>
            </DialogFooter>
        </DialogContent>
    );

    const BothDialogContent = (
        <DialogContent className="sm:max-w-lg">
            <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                    <RefreshCw className="w-5 h-5" />
                    Recollect All Data
                </DialogTitle>
                <DialogDescription>
                    Configure data collection settings for both website and social media{brandName ? ` for ${brandName}` : ''}.
                </DialogDescription>
            </DialogHeader>
            <div className="space-y-6 py-4">
                <div className="space-y-4 border p-4 rounded-lg bg-accent/50">
                    <div className="flex items-center gap-2 mb-2">
                        <Globe className="w-4 h-4" />
                        <h4 className="font-medium">Website Config</h4>
                    </div>
                    <div className="space-y-2">
                        <Label>Max Pages to Capture</Label>
                        <Input
                            type="number"
                            placeholder="10"
                            className="h-10"
                            {...form.register('webLimit', { valueAsNumber: true })}
                            defaultValue={10}
                        />
                    </div>
                </div>
                <div className="space-y-4 border p-4 rounded-lg bg-accent/50">
                    <div className="flex items-center gap-2 mb-2">
                        <Share2 className="w-4 h-4" />
                        <h4 className="font-medium">Social Config</h4>
                    </div>
                    <div className="space-y-2">
                        <Label>Social Date Range</Label>
                        <DatePickerWithRange date={socialDateRange} setDate={setSocialDateRange} />
                    </div>
                </div>
            </div>
            <DialogFooter>
                <Button variant="ghost" onClick={() => setOpenDialog(null)} disabled={isLoading}>
                    Cancel
                </Button>
                <Button onClick={handleBothScrape} disabled={isLoading}>
                    {isLoading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Capturing</> : 'Capture'}
                </Button>
            </DialogFooter>
        </DialogContent>
    );

    if (variant === 'button') {
        return (
            <>
                <Dialog open={openDialog === 'website'} onOpenChange={(open) => setOpenDialog(open ? 'website' : null)}>
                    {WebsiteDialogContent}
                </Dialog>
                <Dialog open={openDialog === 'social'} onOpenChange={(open) => setOpenDialog(open ? 'social' : null)}>
                    {SocialDialogContent}
                </Dialog>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        {trigger || (
                            <Button variant="secondary">
                                <RefreshCw  />
                                Recollect
                                <ChevronDown className="w-4 h-4 ml-1" />
                            </Button>
                        )}
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {showWebsite && (
                            <DropdownMenuItem onClick={() => setOpenDialog('website')}>
                                <Globe  />
                                Website Data
                            </DropdownMenuItem>
                        )}
                        {showSocial && (
                            <DropdownMenuItem onClick={() => setOpenDialog('social')}>
                                <Share2  />
                                Social Media Data
                            </DropdownMenuItem>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
            </>
        );
    }

    return (
        <>
            <Dialog open={openDialog === 'website'} onOpenChange={(open) => setOpenDialog(open ? 'website' : null)}>
                {WebsiteDialogContent}
            </Dialog>
            <Dialog open={openDialog === 'social'} onOpenChange={(open) => setOpenDialog(open ? 'social' : null)}>
                {SocialDialogContent}
            </Dialog>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    {trigger || (
                        <Button>
                            Capture
                        </Button>
                    )}
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    {showWebsite && (
                        <DropdownMenuItem onClick={() => setOpenDialog('website')}>
                            <Globe  />
                            Website Data
                        </DropdownMenuItem>
                    )}
                    {showSocial && (
                        <DropdownMenuItem onClick={() => setOpenDialog('social')}>
                            <Share2  />
                            Social Media Data
                        </DropdownMenuItem>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
}
