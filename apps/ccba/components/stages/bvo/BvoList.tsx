import { getBrands } from "@/server/actions/brandActions";
import { getBvoHistory, getBvoAgentResults } from "@/server/actions/bvo/agenticActions";
import BvoItem from "./BvoItem";
import { Card } from "@/components/ui/card";
import { EmptyStateCard } from "@/components/shared/CardsUI";

export default async function BvoList() {
  const brands = await getBrands();

  if (!brands || brands.length === 0) {
    return <EmptyStateCard message="No brands found. Please add a brand first." />
  }

  const brandsWithHistory = await Promise.all(
    brands.map(async (brand:any) => {
      const historyRes = await getBvoHistory(brand.brand_id)

      const items = await Promise.all(
        historyRes.history.map(async (bvo:any) => {
          const results = await getBvoAgentResults(bvo.session_id, brand.brand_id)
          return { bvo, brand, results }
        })
      )

      return { brand, items }
    })
  )
  return (
    <div >
      {brandsWithHistory.map((entry) => {
        if (!entry) return null

        return entry.items.map((item: any) => (
          <BvoItem
            key={item.bvo.session_id}
            bvo={item.bvo}
            brand={item.brand}
            results={item.results}
          />
        ))
      })}
    </div>
  );
}
