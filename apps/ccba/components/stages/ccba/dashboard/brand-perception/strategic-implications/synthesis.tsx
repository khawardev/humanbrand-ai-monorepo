import { AttributeKey } from "../brand";
import {
    getComparativeAnalysis,
    getStrength,
    getRisk,
    getOpportunity,
    getRecommendation,
    cn,
} from "../utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap, Shield, TrendingUp, Target, AlertTriangle } from "lucide-react";

interface SynthesisProps {
    attribute: AttributeKey;
    searchQuery: string;
}

export default function Synthesis({ attribute, searchQuery }: SynthesisProps) {
    const highlightText = (text: string) => {
        if (!searchQuery) return text;

        const regex = new RegExp(`(${searchQuery})`, 'gi');
        const parts = text.split(regex);

        return parts.map((part, index) =>
            regex.test(part) ? (
                <span key={index} className="bg-primary/30 font-semibold">
                    {part}
                </span>
            ) : (
                part
            )
        );
    };

    const insights = [
        {
            icon: Shield,
            title: "Strength to Leverage",
            content: getStrength(attribute),
            color: "text-primary",
            bgColor: "bg-primary/10",
            borderColor: "border-primary/30"
        },
        {
            icon: AlertTriangle,
            title: "Risk to Mitigate",
            content: getRisk(attribute),
            color: "text-red-500",
            bgColor: "bg-red-500/10",
            borderColor: "border-red-500/30"
        },
        {
            icon: TrendingUp,
            title: "Opportunity to Capture",
            content: getOpportunity(attribute),
            color: "text-blue-500",
            bgColor: "bg-blue-500/10",
            borderColor: "border-blue-500/30"
        },
        {
            icon: Target,
            title: "Strategic Recommendation",
            content: getRecommendation(attribute),
            color: "text-purple-500",
            bgColor: "bg-purple-500/10",
            borderColor: "border-purple-500/30"
        }
    ];

    return (
        <Card className=" bg-gradient-to-br from-primary/10 to-primary/5">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary">
                    <Zap className="h-5 w-5" />
                    Strategic Synthesis for Magna
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="p-4 bg-background/50 rounded-lg">
                    <p className="font-semibold mb-2">Comparative Analysis:</p>
                    <p className="text-muted-foreground">
                        {highlightText(getComparativeAnalysis(attribute))}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {insights.map((insight, index) => {
                        const Icon = insight.icon;
                        return (
                            <div
                                key={index}
                                className={cn(
                                    "p-4 rounded-lg border-l-4",
                                    insight.bgColor,
                                    insight.borderColor
                                )}
                            >
                                <div className={cn("flex items-center gap-2 mb-2", insight.color)}>
                                    <Icon className="h-4 w-4" />
                                    <h5 className="font-semibold text-sm uppercase">
                                        {insight.title}
                                    </h5>
                                </div>
                                <p className="text-sm leading-relaxed">
                                    {highlightText(insight.content)}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}