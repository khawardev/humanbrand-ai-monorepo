import { getBvoAgentResults } from "@/server/actions/bvo/agenticActions";
import { ContainerMd } from "@/components/shared/Containers";
import StaticBanner from "@/components/shared/StaticBanner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { DashboardInnerLayout, DashboardLayoutHeading } from "@/components/stages/ccba/dashboard/shared/DashboardComponents";
import { EmptyStateCard } from "@/components/shared/CardsUI";
import { MarkdownViewer } from "@/components/shared/MarkdownViewer";


export default async function BvoDetailPage({ params, searchParams }: any) {
  const { bvoId } = await params
  const sessionId = bvoId
  const { brand_id: brandId } = await searchParams
  if (!brandId) {
    return (
      <ContainerMd>
        <StaticBanner title="Error" badge="BVO Execution" />
        <Card>
          <CardContent>
            <p>Brand ID is missing from the URL. Please go back and try again.</p>
          </CardContent>
        </Card>
      </ContainerMd>
    );
  }

  const resultsResponse = await getBvoAgentResults(sessionId, brandId);

  if (!resultsResponse) {
    return (
      <ContainerMd>
        <StaticBanner title={`BVO Session: ${sessionId}`} badge="BVO Execution" />
        <EmptyStateCard message="No results found for this BVO session." />
      </ContainerMd>
    );
  }

  const { results, brand_id, client_id, task_id } = resultsResponse;

  return (
    <>
      <DashboardLayoutHeading
        title={'BVO Session Details'}
        subtitle={'Execution Reports'}
      />
      <DashboardInnerLayout>
        {/* <Card className="mb-6">
          <CardHeader>
            <CardTitle>Session Information</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <p><strong>Session ID:</strong> <span className="font-mono text-muted-foreground">{sessionId}</span></p>
            <p><strong>Task ID:</strong> <span className="font-mono text-muted-foreground">{task_id}</span></p>
            <p><strong>Brand ID:</strong> <span className="font-mono text-muted-foreground">{brand_id}</span></p>
            <p><strong>Client ID:</strong> <span className="font-mono text-muted-foreground">{client_id}</span></p>
          </CardContent>
        </Card> */}

        <h2 className="text-2xl font-bold mb-7">Agent Results</h2>
        <div className="space-y-6">
          {results.map((result: any) => (
            <Card key={result.agent_number}>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Agent: {result.agent_number}</CardTitle>
                  <Badge variant="secondary">{result.model_used}</Badge>
                </div>
                <CardDescription>
                  Timestamp: {new Date(result.timestamp).toLocaleString()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <h3 className="text-lg font-semibold mb-2">Agent Output</h3>
                <div className="prose dark:prose-invert max-w-none p-4 border rounded-md bg-muted/20">
                  <MarkdownViewer content={result.agent_output} />
                </div>
                <Separator className="my-6" />
                <h3 className="text-lg font-semibold mb-4">Additional Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 text-sm text-muted-foreground">
                  <p><strong>Entity Type:</strong> {result.entity_type}</p>
                  <p><strong>Session ID:</strong> <span className="font-mono">{result.session_id}</span></p>
                  <p><strong>PK:</strong> <span className="font-mono">{result.PK}</span></p>
                  <p><strong>SK:</strong> <span className="font-mono">{result.SK}</span></p>
                  <p><strong>Custom Instructions:</strong> {result.custom_instructions || "None"}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </DashboardInnerLayout>
    </>
  );
}
