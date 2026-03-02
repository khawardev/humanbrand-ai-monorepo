"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import { Link as LinkIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { deleteBrand } from "@/server/actions/brandActions";
import { BrandDashboardButton } from "./BrandDashboardButton";
import { BrandCompCrudButtons } from "@/components/stages/ccba/details/profile-tab/BrandCompCrudButtons";
import { DashboardHeader } from "../../dashboard/shared/DashboardComponents";
import { EmptyStateCard } from "@/components/shared/CardsUI";

const BrandProfile = ({ brand, isScrapped }: any) => {
  const router = useRouter();

  const confirmDelete = () => {
    toast(`Delete ${brand.name}?`, {
      description: "This action cannot be undone.",
      action: {
        label: "Confirm",
        onClick: async () => {
          const { success, message } = await deleteBrand(brand.brand_id);
          if (!success) return toast.error(message);
          router.refresh();
          toast.success(message);
        },
      },
    });
  };

  return (
    <div className="flex flex-col space-y-8">
     <DashboardHeader
        title="Brand Profile"
        subtitle="View detailed information about Brand and its Competitors"
      />

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl  tracking-tight capitalize">{brand?.name}</h1>
          <Link
            href={brand.url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-muted-foreground hover:underline"
          >
            {brand.url}
            <LinkIcon className="size-3" />
          </Link>
        </div>
        <div className="flex items-center space-x-2">
          <BrandCompCrudButtons brand={brand} />
          {/* <BrandDashboardButton brand_id={brand.brand_id} isScrapped={isScrapped} /> */}
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="text-lg font-medium">Social Links</h4>
        <div className="flex flex-wrap gap-2">
          {brand.facebook_url && (
            <Badge asChild variant="secondary">
              <Link href={brand.facebook_url} target="_blank">
                Facebook
              </Link>
            </Badge>
          )}
          {brand.instagram_url && (
            <Badge asChild variant="secondary">
              <Link href={brand.instagram_url} target="_blank">
                Instagram
              </Link>
            </Badge>
          )}
          {brand.linkedin_url && (
            <Badge asChild variant="secondary">
              <Link href={brand.linkedin_url} target="_blank">
                LinkedIn
              </Link>
            </Badge>
          )}
          {brand.x_url && (
            <Badge asChild variant="secondary">
              <Link href={brand.x_url} target="_blank">
                X
              </Link>
            </Badge>
          )}
          {brand.youtube_url && (
            <Badge asChild variant="secondary">
              <Link href={brand.youtube_url} target="_blank">
                YouTube
              </Link>
            </Badge>
          )}
        </div>
      </div>


      <div className="space-y-4">
        <h3 className="text-lg  font-medium ">Competitors</h3>
        {brand.competitors && brand.competitors.length > 0 ? (
          <div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Website</TableHead>
                  <TableHead>Socials</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {brand.competitors.map((competitor: any) => (
                  <TableRow key={competitor.competitor_id}>
                    <TableCell className="font-medium">
                      {competitor.name}
                    </TableCell>
                    <TableCell>
                      <Link
                        href={competitor.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 hover:underline"
                      >
                        {competitor.url}
                        <LinkIcon className="size-3" />
                      </Link>
                    </TableCell>
                    <TableCell className="flex flex-wrap gap-1">
                      {competitor.facebook_url && (
                        <Badge asChild variant="secondary">
                          <Link
                            href={competitor.facebook_url}
                            target="_blank"
                          >
                            Facebook
                          </Link>
                        </Badge>
                      )}
                      {competitor.instagram_url && (
                        <Badge asChild variant="secondary">
                          <Link
                            href={competitor.instagram_url}
                            target="_blank"
                          >
                            Instagram
                          </Link>
                        </Badge>
                      )}
                      {competitor.linkedin_url && (
                        <Badge asChild variant="secondary">
                          <Link
                            href={competitor.linkedin_url}
                            target="_blank"
                          >
                            LinkedIn
                          </Link>
                        </Badge>
                      )}
                      {competitor.x_url && (
                        <Badge asChild variant="secondary">
                          <Link href={competitor.x_url} target="_blank">
                            X
                          </Link>
                        </Badge>
                      )}
                      {competitor.youtube_url && (
                        <Badge asChild variant="secondary">
                          <Link
                            href={competitor.youtube_url}
                            target="_blank"
                          >
                            YouTube
                          </Link>
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : <EmptyStateCard message="No competitors found for this brand." />}
      </div>
    </div>
  )
}

export default BrandProfile