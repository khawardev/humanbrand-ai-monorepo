"use client"

import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { MoreHorizontalIcon } from "lucide-react"
import { useTransition } from "react"

import { scrapeBatchSocial } from "@/server/actions/ccba/social/socialScrapeActions"
import { scrapeBatchWebsite } from "@/server/actions/ccba/website/websiteScrapeActions"
import { ButtonSpinner } from "@/components/shared/SpinnerLoader"
import { WebsiteAskLimitDialog } from "@/components/stages/ccba/details/scraps-tab/website/WebsiteAskLimitDialog"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { SocialReportButton } from "@/components/stages/ccba/details/reports-tab/social/SocialReportButton"
import { WebsiteReportButton } from "@/components/stages/ccba/details/reports-tab/website/WebsiteReportButton"
import { MdOutlineWebAsset } from "react-icons/md";
import { RiGeminiFill } from "react-icons/ri"
import { ScrapeSocialDialog } from "./social/AskSocialScrapeDialog"
import { SCRAPE, SCRAPING } from "@/lib/constants"

export function ScrapeReportActionButtons({
  brand_id,
  website_batch_id,
  social_batch_id,
}: {
  brand_id: string
  website_batch_id: string | null
  social_batch_id: string | null
}) {
  const router = useRouter()
  const [isWebsiteScrapingPending, startWebsiteScrapingTransition] = useTransition()
  const [isSocialScrapingPending, startSocialScrapingTransition] = useTransition()

  // Website Scraping Logic from WebsiteScraps.tsx
  const scrapeWebsite = async (limit: number) => {
    startWebsiteScrapingTransition(() => {
      (async () => {
        toast.info(`Website ${SCRAPING} started...`)
        const { success, message } = await scrapeBatchWebsite(brand_id, limit);

        if (!success) {
          return toast.error(message || `${SCRAPING} failed.`);
        }
        router.refresh();
        toast.success(message || `${SCRAPING} completed successfully`);
      })();
    });
  }

  // Social Scraping Logic from SocialScraps.tsx
  const handleScrapeSocial = (details: {
    startDate: string
    endDate: string
  }) => {
    startSocialScrapingTransition(() => {
      (async () => {
        toast.info(`Social ${SCRAPING} started...`)
        const { success, message } = await scrapeBatchSocial(
          brand_id,
          details.startDate,
          details.endDate
        );

        if (!success) {
          return toast.error(message || `Social ${SCRAPING} failed.`);
        }
        toast.success(message || `Social ${SCRAPING} completed successfully`);
        router.refresh();
      })();
    });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          Actions
          <MoreHorizontalIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-34">
        {/* Website Sub Menu */}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger disabled={!website_batch_id}>
            <span>Website</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent sideOffset={10}>
            <WebsiteAskLimitDialog onConfirm={scrapeWebsite}>
              <DropdownMenuItem
                onSelect={(e) => e.preventDefault()}
                disabled={isWebsiteScrapingPending}
              >
                {isWebsiteScrapingPending ? (
                  <ButtonSpinner>{SCRAPING}</ButtonSpinner>
                ) : (
                  <MdOutlineWebAsset />
                )}
                <span>{SCRAPE}</span>
              </DropdownMenuItem>
            </WebsiteAskLimitDialog>
            <DropdownMenuSeparator />
            <WebsiteReportButton
              brand_id={brand_id}
              batch_id={website_batch_id}
            >
              <DropdownMenuItem
                onSelect={(e) => e.preventDefault()}
                disabled={!website_batch_id}
              >
                <RiGeminiFill />
                <span>Create Report</span>
              </DropdownMenuItem>
            </WebsiteReportButton>
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuSeparator />

        {/* Social Media Sub Menu */}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger >
            <span>Social Media</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent sideOffset={10}>
            <ScrapeSocialDialog
              isLoading={isSocialScrapingPending}
              onConfirm={handleScrapeSocial}
            >
              <DropdownMenuItem
                onSelect={(e) => e.preventDefault()}
                disabled={isSocialScrapingPending}
              >
                {isSocialScrapingPending ? (
                  <ButtonSpinner>{SCRAPING}</ButtonSpinner>
                ) : (
                  <MdOutlineWebAsset />
                )}
                {!isSocialScrapingPending && <span>{SCRAPE}</span>}
              </DropdownMenuItem>
            </ScrapeSocialDialog>
            <DropdownMenuSeparator />
            <SocialReportButton
              brand_id={brand_id}
              batch_id={social_batch_id}
            >
              <DropdownMenuItem
                onSelect={(e) => e.preventDefault()}
                disabled={!social_batch_id}
              >
                <RiGeminiFill />
                <span>Create Report</span>
              </DropdownMenuItem>
            </SocialReportButton>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
