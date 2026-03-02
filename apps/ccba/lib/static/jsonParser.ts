export const parseJsonFromMarkdown = <T>(rawResponse: string): T | null => {
    if (!rawResponse || typeof rawResponse !== 'string') {
        return null;
    }

    const jsonStart = rawResponse.indexOf('{');
    const jsonEnd = rawResponse.lastIndexOf('}');

    if (jsonStart === -1 || jsonEnd === -1 || jsonEnd < jsonStart) {
        return null;
    }

    const jsonString = rawResponse.substring(jsonStart, jsonEnd + 1);

    try {
        const parsedJson = JSON.parse(jsonString);
        return parsedJson as T;
    } catch (error) {
        console.error("Failed to parse the extracted JSON string:", error);
        return null;
    }
};