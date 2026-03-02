import { FILTER_CONFIG } from "@/config/brandPerception-config";
import { attributeKeys } from "@/types/brandPerception";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const getAttributeLabel = (attr: string): string => {
    return attr.charAt(0).toUpperCase() + attr.slice(1);
};

export const getAttributesByFilter = (filter: any): any[] => {
    if (filter === "all") {
        return [...attributeKeys];
    }
    return FILTER_CONFIG[filter]?.attributes || [];
};

export const exportToCSV = (data: any, fileName: string = "brand-perception-report.csv") => {
    if (!data || Object.keys(data).length === 0) return;

    const headers = ["Brand", "Attribute", "Type", "Content"];
    const rows = [headers];

    for (const brandName in data) {
        if (Object.prototype.hasOwnProperty.call(data, brandName)) {
            const brandAttributes = data[brandName];
            for (const attributeKey in brandAttributes) {
                if (Object.prototype.hasOwnProperty.call(brandAttributes, attributeKey)) {
                    const attributeData = brandAttributes[attributeKey];
                    
                    const escapeCSV = (str: string) => `"${str.replace(/"/g, '""')}"`;

                    const textContent = Array.isArray(attributeData.text)
                        ? attributeData.text.join("\n")
                        : attributeData.text;

                    if (textContent) {
                         rows.push([brandName, attributeKey, "Text", escapeCSV(textContent)]);
                    }
                    if (attributeData.implication) {
                        rows.push([brandName, attributeKey, "Implication", escapeCSV(attributeData.implication)]);
                    }
                }
            }
        }
    }

    const csvContent = "data:text/csv;charset=utf-8," + rows.map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};