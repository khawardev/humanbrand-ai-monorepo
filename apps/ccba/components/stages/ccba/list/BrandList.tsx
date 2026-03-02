import { getBrandbyIdWithCompetitors, getBrands } from "@/server/actions/brandActions";
import BrandItem from "@/components/stages/ccba/list/BrandItem";
import { Card } from "@/components/ui/card";
import { getWebsiteBatchId } from "@/server/actions/ccba/website/websiteScrapeActions";
import { getCurrentUser } from "@/server/actions/authActions";
import { toast } from "sonner";
import { EmptyStateCard } from "@/components/shared/CardsUI";

async function BrandList() {
    const user = await getCurrentUser();
    const brands = await getBrands();

    if (!brands || brands.length === 0) {
        return (
            <EmptyStateCard message="Get started by adding your first brand." />
        );
    }

    const brandItemsData = await Promise.all(
        brands.map(async (brand: any) => {
            const brandData = await getBrandbyIdWithCompetitors(brand?.brand_id);

            if (!brandData || !brandData.brand_id) {
                return null;
            }

            const batch_id = await getWebsiteBatchId(brandData.brand_id);

            return {
                brand: brandData,
                isScrapped: batch_id ? true : false,
            };
        })
    );

    const filteredBrandItemsData = brandItemsData.filter((item: any) => item !== null);

    return (
        <div>
            {filteredBrandItemsData.map((item: any, index: any) => (
                <BrandItem
                    key={item.brand.brand_id}
                    index={index}
                    isScrapped={item.isScrapped}
                    brand={item.brand}
                />
            ))}
        </div>
    );
}

export default BrandList;