import { getCamSessions } from "@/server/actions/cge/sessionActions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ClickableListCard } from "@/components/shared/CardsUI";

export async function CgeSessionsList({ brands }: { brands: any[] }) {
    return (
        <div >
            {brands.map(async (brand) => {
                const camSessionsResponse = await getCamSessions(brand.brand_id);
                if (camSessionsResponse) {
                    return (
                        camSessionsResponse.sessions.map((session: any) => (
                            <ClickableListCard isActive={true} href={`/dashboard/cge/${session.cam_session_id}?brand_id=${brand.brand_id}`} key={brand.brand_id}>
                                <CardHeader>
                                    <CardTitle>{brand.name}</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    <div key={session.cam_session_id} className="flex justify-between items-center p-2 border rounded-md">
                                        <div>
                                            <p className="font-medium">{session.cam_session_id}</p>
                                            <p className="text-sm text-muted-foreground">
                                                BVO Session: {session.bam_session_id}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                Created: {new Date(session.created_at).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </ClickableListCard>
                        ))
                    );
                }
                return null;
            })}
        </div>
    );
}
