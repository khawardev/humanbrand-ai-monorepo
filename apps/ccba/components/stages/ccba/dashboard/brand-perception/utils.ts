import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { AttributeKey, FilterType } from "./brand";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const attributes1to8: AttributeKey[] = ['mission', 'vision', 'purpose', 'values', 'positioning', 'themes', 'promise', 'tagline'];
export const attributes9to12: AttributeKey[] = ['voice', 'tone', 'lexicon', 'rhetoric'];
export const attributes13to14: AttributeKey[] = ['narrative', 'archetype'];
export const attributes15to18: AttributeKey[] = ['coherence', 'personas', 'portfolio', 'architecture'];

export const getAttributeLabel = (attr: AttributeKey): string => {
    const labels: Record<AttributeKey, string> = {
        mission: 'Mission',
        vision: 'Vision',
        purpose: 'Purpose',
        values: 'Values',
        positioning: 'Positioning',
        themes: 'Key Themes',
        promise: 'Brand Promise',
        tagline: 'Tagline',
        voice: 'Voice Personality',
        tone: 'Tonal Range',
        lexicon: 'Lexicon',
        rhetoric: 'Rhetorical Style',
        narrative: 'Brand Narrative',
        archetype: 'Jungian Archetype',
        coherence: 'Narrative Coherence',
        personas: 'Audience Personas',
        portfolio: 'Product Portfolio',
        architecture: 'Brand Architecture'
    };
    return labels[attr] || attr.charAt(0).toUpperCase() + attr.slice(1);
};

export const getAttributesByFilter = (filter: FilterType): AttributeKey[] => {
    switch (filter) {
        case 'narrative':
            return attributes1to8;
        case 'verbal':
            return attributes9to12;
        case 'archetype':
            return attributes13to14;
        case 'strategic':
            return attributes15to18;
        case 'all':
        default:
            return [...attributes1to8, ...attributes9to12, ...attributes13to14, ...attributes15to18];
    }
};

export const getComparativeAnalysis = (attr: AttributeKey): string => {
    const analyses: Record<AttributeKey, string> = {
        mission: "Industry converges on comprehensive B2B enabler positioning with universal tension between breadth and specialized depth.",
        vision: "All brands pursue similar electrification-autonomy-sustainability trinity, lacking distinctive differentiation.",
        purpose: "Generic ESG-aligned purposes dominate without unique contribution claims.",
        values: "Safety, sustainability, and integrity universally claimed, creating parity rather than differentiation.",
        positioning: "Split between comprehensive providers and specialized leaders, with integration as common theme.",
        themes: "All brands attempt 4-5 themes, creating universal messaging complexity and dilution.",
        promise: "Promises divide between complexity-solvers and possibility-enablers, most lacking memorable articulation.",
        tagline: "Range from functional to aspirational, majority lack distinctive memorability or unique claim.",
        voice: "Technical authority dominates across all brands, with varying degrees of approachability and humanization.",
        tone: "Trust-building universally dominant, with high positive-to-negative ratios limiting urgency creation.",
        lexicon: "Technical terminology dominates, with proprietary terms providing differentiation but risking complexity.",
        rhetoric: "Ethos-primary persuasion universal, with minimal emotional appeal limiting transformation buy-in.",
        narrative: "Bridge narratives common between heritage and future, with tensions in transformation credibility.",
        archetype: "Sage archetype prevalent, often paired with Creator or Caregiver, limiting distinctive positioning.",
        coherence: "Universal tensions between breadth/depth and heritage/future create industry-wide authenticity challenges.",
        personas: "B2B focus universal with limited consumer engagement, missing emerging ecosystem stakeholders.",
        portfolio: "Platform architectures emerging but hardware heritage still dominates perception and structure.",
        architecture: "Branded House dominates, maximizing equity efficiency but limiting segment-specific positioning."
    };
    return analyses[attr] || "Comparative analysis reveals both convergence and divergence in strategic approaches.";
};

export const getStrength = (attr: AttributeKey): string => {
    const strengths: Record<AttributeKey, string> = {
        mission: "Magna's 'transformation enabler' positioning with manufacturing excellence provides unique differentiation.",
        vision: "Accessible mobility focus more democratic than competitors' technology-first visions.",
        purpose: "Action-oriented 'responsibly advancing' versus passive benefit claims.",
        values: "'Collaborative Excellence' differentiates from generic partnership claims.",
        positioning: "'Transforms possibilities into realities' creates action-oriented differentiation.",
        themes: "'Manufacturing Mastery' unique among competitors—a differentiating pillar.",
        promise: "Directly addresses real customer pain point of complexity in transformation.",
        tagline: "'Responsibly' element differentiates from pure innovation taglines.",
        voice: "Balance of technical fluency with accessibility broader than most competitors.",
        tone: "Higher partnership-collaborative tone than competitors supports integration positioning.",
        lexicon: "Transformation vocabulary more developed while maintaining technical credibility.",
        rhetoric: "Higher logos component than competitors provides evidence-based differentiation.",
        narrative: "Manufacturing heritage to technology mastery arc unique among suppliers.",
        archetype: "Creator-Sage combination more balanced than competitors' single-archetype focus.",
        coherence: "Moderate-to-high coherence exceeds industry average despite breadth challenges.",
        personas: "Manufacturing Executive persona unique focus among primarily engineering-targeted competitors.",
        portfolio: "Platform-based architecture more evolved than competitors' category structures.",
        architecture: "Hybrid architecture provides more flexibility than pure Branded House competitors."
    };
    return strengths[attr] || "Magna demonstrates distinctive capabilities in this area.";
};

export const getRisk = (attr: AttributeKey): string => {
    const risks: Record<AttributeKey, string> = {
        mission: "Generic 'comprehensive solutions' risks jack-of-all-trades perception.",
        vision: "Lacks specificity of competitors' memorable visions (e.g., Aptiv's 'zero-zero-zero').",
        purpose: "Generic 'better world' lacks measurable impact metrics.",
        values: "Missing explicit 'speed/agility' value in fast-changing market.",
        positioning: "Generic 'essential partner' shared by multiple competitors.",
        themes: "Five themes create cognitive overload and diluted focus.",
        promise: "Generic articulation lacks memorability of specific competitor promises.",
        tagline: "'Creating Mobility' too generic—could apply to any mobility company.",
        voice: "Measured tone may not inspire versus bolder competitor voices.",
        tone: "12.3:1 positive ratio suggests insufficient problem awareness.",
        lexicon: "Less proprietary terminology than competitors reduces differentiation.",
        rhetoric: "10% pathos insufficient for transformation leadership.",
        narrative: "Lacks distinctive antagonist or unique transformation promise.",
        archetype: "Creator-Sage combination common among Tier 1 suppliers.",
        coherence: "Breadth-depth tension more pronounced than focused competitors.",
        personas: "Missing software developers and mobility service providers.",
        portfolio: "Breadth may obscure excellence in specific domains.",
        architecture: "Hybrid complexity may confuse versus pure architectures."
    };
    return risks[attr] || "Risk of being perceived as undifferentiated in crowded market.";
};

export const getOpportunity = (attr: AttributeKey): string => {
    const opportunities: Record<AttributeKey, string> = {
        mission: "Emphasize 'integrated manufacturing and technology excellence' for unique territory.",
        vision: "Claim 'manufacturing at scale' as unique enabler of accessible mobility.",
        purpose: "Position as 'democratizing advanced mobility through manufacturing scale.'",
        values: "Add 'Manufacturing Excellence' as explicit differentiating value.",
        positioning: "Own 'The Manufacturing Innovator' intersection competitors cannot match.",
        themes: "Prioritize three core themes for deeper ownership rather than broad coverage.",
        promise: "Connect manufacturing scale to promise uniqueness.",
        tagline: "Incorporate manufacturing/scale uniqueness for distinction.",
        voice: "Amplify innovation curiosity to balance measured authority.",
        tone: "Increase urgency and transformation imperative messaging.",
        lexicon: "Develop consumer-parallel vocabulary for broader reach.",
        rhetoric: "Increase pathos to 20-25% for transformation leadership.",
        narrative: "Introduce specific antagonist (complexity) for dramatic tension.",
        archetype: "Emphasize unique Creator aspects (manufacturing mastery).",
        coherence: "Resolve tensions through 'configured comprehensiveness' narrative.",
        personas: "Add software developers and mobility entrepreneurs.",
        portfolio: "Reorganize around integration capability as hero feature.",
        architecture: "Clarify when Magna leads versus category brands emerge."
    };
    return opportunities[attr] || "Opportunity to claim unique territory through distinctive capabilities.";
};

export const getRecommendation = (attr: AttributeKey): string => {
    const recommendations: Record<AttributeKey, string> = {
        mission: "Reframe to emphasize integrated manufacturing-technology excellence as core differentiator.",
        vision: "Sharpen to 'Making intelligent mobility accessible through manufacturing innovation at global scale.'",
        purpose: "Refine to 'Making advanced mobility accessible to millions through responsible manufacturing innovation.'",
        values: "Add 'Agile Innovation' and 'Manufacturing Excellence' to value set.",
        positioning: "Evolve to 'The only mobility partner that manufactures innovation at global scale.'",
        themes: "Implement hierarchy: Lead with Manufacturing Mastery, support with Integrated Intelligence.",
        promise: "Sharpen to 'We transform mobility's biggest challenges into manufactured realities at global scale.'",
        tagline: "Evolve to 'Manufacturing Tomorrow. Responsibly.' for distinctiveness.",
        voice: "Develop 'Manufacturing Innovator' personality balancing heritage and disruption.",
        tone: "Adjust to 8:1 positive ratio with increased urgency messaging.",
        lexicon: "Create 'Magna Manufacturing Method' proprietary framework.",
        rhetoric: "Rebalance to 50% ethos, 30% logos, 20% pathos.",
        narrative: "Develop 'From Factory Floor to Future Mobility' hero journey.",
        archetype: "Strengthen Creator with 'Master Craftsman' sub-archetype.",
        coherence: "Implement 'Both/And' strategy explicitly embracing paradoxes.",
        personas: "Develop tiered persona strategy with primary/secondary/emerging.",
        portfolio: "Restructure as 'Manufacturing Platform + Digital Layer + Future Ventures.'",
        architecture: "Implement clear 'Magna Inside' ingredient brand strategy."
    };
    return recommendations[attr] || "Strategic refinement recommended to strengthen competitive position.";
};

export const exportToCSV = (data: any, fileName: any): void => {
    {
        if (!data || Object.keys(data).length === 0) {
            console.error("Export failed: No data provided.");
            return;
        }

        const headers = ["Brand", "Attribute", "Type", "Content"];
        const rows = [headers];

        const escapeCSV = (value: string | undefined | null): string => {
            if (value === null || value === undefined) return '""';
            const stringValue = String(value);
            return `"${stringValue.replace(/"/g, '""')}"`;
        };

        for (const brandName in data) {
            if (Object.prototype.hasOwnProperty.call(data, brandName)) {
                const brandAttributes = data[brandName];
                for (const attributeKey in brandAttributes) {
                    if (Object.prototype.hasOwnProperty.call(brandAttributes, attributeKey)) {
                        const attributeData = brandAttributes[attributeKey];

                        const textContent = Array.isArray(attributeData.text)
                            ? attributeData.text.join("\n")
                            : attributeData.text;

                        if (textContent) {
                            rows.push([
                                brandName,
                                attributeKey,
                                "Text",
                                textContent
                            ]);
                        }

                        if (attributeData.implication) {
                            rows.push([
                                brandName,
                                attributeKey,
                                "Implication",
                                attributeData.implication
                            ]);
                        }
                    }
                }
            }
        }

        const csvContent = rows.map(row =>
            row.map(escapeCSV).join(',')
        ).join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", fileName);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }
}