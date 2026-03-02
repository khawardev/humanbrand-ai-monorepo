'use server';

import { agentRequest } from "../api/agentRequest";

export type SocialChannelName = 'facebook' | 'instagram' | 'linkedin' | 'x' | 'youtube' | 'tiktok';
export type AnalysisScope = 'brand' | 'competitors';
export type AnalysisPriority = 'employer_brand' | 'product_marketing' | 'thought_leadership' | 'community' | 'balanced';

export type MandatedDriver = {
    driver_name: string;
    definition: string;
    include_keywords?: string[];
    include_phrases?: string[];
    exclude_keywords?: string[];
};

export type UniversalConfig = {
    client_name: string;
    channel_account_name: string;
    analysis_window: string;
    priority_regions: string[];
    mandated_drivers: MandatedDriver[];
};

export type RunSocialReportsParams = {
    client_id: string;
    brand_id: string;
    batch_id: string;
    channel_name: SocialChannelName;
    analysis_scope?: AnalysisScope;
    competitor_id?: string;
    priority_regions?: string[];
    analysis_priority?: AnalysisPriority;
    mandated_drivers?: string;
    instruction?: string;
};

export type GetSocialReportsOutputParams = {
    client_id: string;
    brand_id: string;
    task_id: string;
};

export type ListSocialReportsTasksParams = {
    client_id: string;
    brand_id: string;
};

export type DeleteSocialReportsTaskParams = {
    client_id: string;
    brand_id: string;
    task_id: string;
};

export type SocialReportsRunOutput = {
    task_id: string;
    social_report: string;
    entity_name: string;
    analysis_scope: string;
    channel_name: string;
    universal_config: UniversalConfig;
};

export type SocialReportsTaskOutput = {
    task_id: string;
    client_id: string;
    brand_id: string;
    entity_name: string;
    analysis_scope: string;
    channel_name: string;
    universal_config: UniversalConfig;
    social_report: string;
    batch_id: string;
    model_used: string;
    timestamp: string;
    execution_time_seconds: number;
};

export type SocialReportsTaskListItem = {
    task_id: string;
    entity_name: string;
    analysis_scope: string;
    channel_name: string;
    timestamp: string;
    model_used: string;
    batch_id: string;
    scraped_urls_count: number;
    execution_time_seconds: number;
};

export type SocialReportsTaskListOutput = {
    tasks: SocialReportsTaskListItem[];
    count: number;
};

export async function runSocialReportsAgent(params: RunSocialReportsParams) {
    const queryParams = new URLSearchParams({
        client_id: params.client_id,
        brand_id: params.brand_id,
        batch_id: params.batch_id,
        channel_name: params.channel_name,
    });

    if (params.analysis_scope) queryParams.append('analysis_scope', params.analysis_scope);
    if (params.competitor_id) queryParams.append('competitor_id', params.competitor_id);
    if (params.priority_regions && params.priority_regions.length > 0) {
        params.priority_regions.forEach(region => queryParams.append('priority_regions', region));
    }
    if (params.analysis_priority) queryParams.append('analysis_priority', params.analysis_priority);
    if (params.mandated_drivers) queryParams.append('mandated_drivers', params.mandated_drivers);
    if (params.instruction) queryParams.append('instruction', params.instruction);

    return await agentRequest(`/run-social-reports-agent?${queryParams.toString()}`, 'POST');
}

export async function getSocialReportsOutput(params: GetSocialReportsOutputParams) {
    const queryParams = new URLSearchParams({
        client_id: params.client_id,
        brand_id: params.brand_id,
        task_id: params.task_id,
    });

    return await agentRequest(`/get-social-reports-output?${queryParams.toString()}`, 'GET');
}

export async function listSocialReportsTasks(params: ListSocialReportsTasksParams) {
    const queryParams = new URLSearchParams({
        client_id: params.client_id,
        brand_id: params.brand_id,
    });

    return await agentRequest(`/list-social-reports-tasks?${queryParams.toString()}`, 'GET');
}

export async function deleteSocialReportsTask(params: DeleteSocialReportsTaskParams) {
    const queryParams = new URLSearchParams({
        client_id: params.client_id,
        brand_id: params.brand_id,
    });

    return await agentRequest(`/delete-social-reports-task/${params.task_id}?${queryParams.toString()}`, 'DELETE');
}
