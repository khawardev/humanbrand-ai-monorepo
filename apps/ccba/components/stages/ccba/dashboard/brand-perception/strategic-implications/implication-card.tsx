import { cn } from "../utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";



export default function ImplicationCard({ attribute, searchQuery, brandPerceptionReport }: any) {
    const brands = Object.keys(brandPerceptionReport);
    const primaryBrand = brands[0];

    const highlightText = (text: string) => {
        if (!searchQuery) return text;
        const regex = new RegExp(`(${searchQuery})`, 'gi');
        const parts = text.split(regex);
        return parts.map((part, index) =>
            regex.test(part) ? <span key={index} className="bg-primary/30 font-semibold">{part}</span> : part
        );
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {brands.map((brand) => {
                const implication = brandPerceptionReport[brand]?.[attribute]?.implication || "Strategic implication not available";

                return (
                    <Card key={brand} className={cn("transition-all shadow-sm", brand === primaryBrand && "bg-primary/10")}>
                        <CardHeader >
                            <CardTitle className={cn("text-base", brand === primaryBrand ? "text-primary" : "")}>
                                {brand}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm leading-relaxed text-muted-foreground">
                                {highlightText(implication)}
                            </p>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
}