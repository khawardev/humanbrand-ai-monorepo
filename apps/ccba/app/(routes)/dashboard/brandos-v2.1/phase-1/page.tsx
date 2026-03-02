
import Phase1Dashboard from '@/components/brandos-v2.1/Phase1Dashboard';
import { DashboardLayoutHeading } from '@/components/brandos-v2.1/shared/DashboardComponents';
import { Suspense } from 'react';

export default function Phase1Page() {
  return (
      <>
        <DashboardLayoutHeading
          title="Phase 1: Extraction & Compilation"
          subtitle="Extracting structured data and compiling bedrocks."
        />
        <Suspense fallback={<div>Loading Phase 1 Dashboard...</div>}>
          <Phase1Dashboard engagementId={"345"} />
        </Suspense>
      </>
  );
}
