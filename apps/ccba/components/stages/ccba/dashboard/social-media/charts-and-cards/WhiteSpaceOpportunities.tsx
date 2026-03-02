import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import KpiCard from "./KpiCard"

export default function WhiteSpaceOpportunities({ data }: any) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>White Space Opportunities</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
                {data.map((item: any, index: number) => (
                    <KpiCard
                        key={index}
                        title={item.title}
                        value={item.value}
                        percent={true}
                    />
                ))}
            </CardContent>
        </Card>
    )
}