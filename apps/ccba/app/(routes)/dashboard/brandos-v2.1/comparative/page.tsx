
import ComparativeDashboard from '@/components/brandos-v2.1/ComparativeDashboard';
import { DashboardLayoutHeading } from '@/components/brandos-v2.1/shared/DashboardComponents';
import { Suspense } from 'react';

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

export default async function ComparativePage(props: {
  searchParams: SearchParams
}) {
  const searchParams = await props.searchParams;
  const engagementId = typeof searchParams.engagementId === 'string' ? searchParams.engagementId : '';

  // Comparative might be accessible without specific engagement ID if it's cross-project, 
  // but for now we enforce it as mock data usually depends on it.
  // If no ID, we can pass a dummy or handle it in component.
  
  return (
    <>
      <DashboardLayoutHeading
        title="Comparative Analysis"
        subtitle="Cross-entity positioning and market landscape."
      />
      <Suspense fallback={<div>Loading Comparative Analysis...</div>}>
        {engagementId ?
          <ComparativeDashboard engagementId={engagementId} /> :
          <div className="p-8">Please select an engagement to view comparative analysis.</div>
        }
      </Suspense>
    </>
  );
}
