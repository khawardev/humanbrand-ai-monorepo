const normalizeBrandName = (name: string): string => {
    if (!name) return '';
    return name.toLowerCase().replace(/[^a-z0-9]/g, '');
};

export function prioritizeBrandReport(reportData: any, mainBrandName: string) {
    const reportKeys = Object.keys(reportData);
    const normalizedMainBrandName = normalizeBrandName(mainBrandName);
    const mainBrandKey = reportKeys.find(key => normalizeBrandName(key) === normalizedMainBrandName);

    if (mainBrandKey) {
        const prioritizedKeys = [
            mainBrandKey,
            ...reportKeys.filter(key => key !== mainBrandKey)
        ];

        return prioritizedKeys.reduce((acc: { [key: string]: any }, key) => {
            acc[key] = reportData[key];
            return acc;
        }, {});
    }

    return reportData;
}