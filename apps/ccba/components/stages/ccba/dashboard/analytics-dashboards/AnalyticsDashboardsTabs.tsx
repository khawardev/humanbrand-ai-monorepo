'use client'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SocialMediaDashboard from "../social-media/SocialMediaDashboard";
import EarnedMediaDashboard from "../earned-media/EarnedMediaDashboard";
import BrandPerceptionDashboard from "../brand-perception/BrandPerceptionDashboard";
import { magnaData } from "@/data/other/brands/magna";

export default function AnalyticsDashboardsTabs({ brandPerceptionReport, socialAnalyticsDashboard }: any) {

  return (
    <Tabs defaultValue="social_media">
      <TabsList>
        <TabsTrigger value="social_media">Social Media</TabsTrigger>
        {/* <TabsTrigger value="earned_media">Earned Media</TabsTrigger> */}
        <TabsTrigger value="brand_perception">Brand Perception Audit</TabsTrigger>
      </TabsList>

      <TabsContent value="social_media" className=" space-y-14">
        <SocialMediaDashboard data={socialAnalyticsDashboard} />
        {/* <SocialMediaDashboard data={magnaData.socialMedia} /> */}
        {/* <SocialMediaDashboard data={BRAND_SOCIAL_DASHBOARD[0].brand.socialMedia} /> */}
      </TabsContent>

      {/* <TabsContent value="earned_media">
        <EarnedMediaDashboard data={magnaData.earnedMedia} />
      </TabsContent> */}

      <TabsContent value="brand_perception">
        <BrandPerceptionDashboard brandPerceptionReport={brandPerceptionReport} />
      </TabsContent>
    </Tabs>
  )
}
