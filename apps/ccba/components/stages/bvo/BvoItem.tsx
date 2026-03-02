"use client";
import {  CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ClickableListCard, EmptyStateCard } from "@/components/shared/CardsUI";

function BvoResults({ results }: { results: any }) {
  if (!results) {
    return <EmptyStateCard message="No results found for this session." />;
  }

  return (
    <div className="space-y-4">
      {results.results.map((result: any) => (
        <div key={result.agent_number}>
          <h4 className="font-medium">Agent: {result.agent_number}</h4>
          <p className="text-sm text-muted-foreground wrap-break-word overflow-hidden max-h-24 overflow-y-auto">
            {result.agent_output}
          </p>
        </div>
      ))}
    </div>
  );
}

export default function BvoItem({ bvo, brand, results }: { bvo: any; brand: any; results: any }) {
  
  return (
    <ClickableListCard isActive={true} href={`/dashboard/bvo/${bvo.session_id}?brand_id=${brand.brand_id}`}> 
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>BVO Execution</CardTitle>
            <CardDescription>Brand: {brand.name}</CardDescription>
            <CardDescription>Session ID: {bvo.session_id}</CardDescription>
            <CardDescription>Date: {new Date(bvo.date).toLocaleString()}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <BvoResults results={results} />
      </CardContent>
    </ClickableListCard>
  );
}
