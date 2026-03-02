
import Phase2Dashboard from '@/components/brandos-v2.1/Phase2Dashboard';
import { DashboardLayoutHeading } from '@/components/brandos-v2.1/shared/DashboardComponents';
import { Suspense } from 'react';

export default function Phase2Page() {
  return (
      <>
        <DashboardLayoutHeading
          title="Phase 2: Syn & Reporting"
          subtitle="Synthesizing meaning and generating strategic reports."
        />
        <Suspense fallback={<div>Loading Phase 2...</div>}>
          <Phase2Dashboard engagementId={"345"} />
        </Suspense>
      </>
  );
}
