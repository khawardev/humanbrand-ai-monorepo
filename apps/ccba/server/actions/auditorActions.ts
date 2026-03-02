'use server';

import { agentRequest } from "../api/agentRequest";

// --- Types ---

export interface RunAuditorParams {
    client_id: string;
    brand_id: string;
    batch_id: string;
    model_name?: string;
    analysis_scope?: 'brand' | 'competitors' | 'both';
}

export interface GetAuditorOutputParams {
    client_id: string;
    brand_id: string;
    task_id: string;
}

export interface RunSocialAuditorParams {
    client_id: string;
    brand_id: string;
    batch_id: string;
    channel_name: 'facebook' | 'instagram' | 'linkedin' | 'x' | 'youtube' | 'tiktok';
    analysis_scope?: 'brand' | 'competitors' | 'both';
}

export interface GetSocialAuditorOutputParams {
    client_id: string;
    brand_id: string;
    task_id: string;
}

// --- Actions ---

export async function runAuditorAgent(params: RunAuditorParams) {
    const queryParams = new URLSearchParams({
        client_id: params.client_id,
        brand_id: params.brand_id,
        batch_id: params.batch_id,
    });

    if (params.model_name) queryParams.append('model_name', params.model_name);
    if (params.analysis_scope) queryParams.append('analysis_scope', params.analysis_scope);

    return await agentRequest(`/run-auditor-agent?${queryParams.toString()}`, 'POST');
}

export async function getAuditorOutput(params: GetAuditorOutputParams) {
    const queryParams = new URLSearchParams({
        client_id: params.client_id,
        brand_id: params.brand_id,
        task_id: params.task_id,
    });

    return await agentRequest(`/get-auditor-output?${queryParams.toString()}`, 'GET');
}

export async function runSocialAuditorAgent(params: RunSocialAuditorParams) {
    const queryParams = new URLSearchParams({
        client_id: params.client_id,
        brand_id: params.brand_id,
        batch_id: params.batch_id,
        channel_name: params.channel_name,
    });

    if (params.analysis_scope) queryParams.append('analysis_scope', params.analysis_scope);

    return await agentRequest(`/run-social-auditor-agent?${queryParams.toString()}`, 'POST');
}

export async function getSocialAuditorOutput(params: GetSocialAuditorOutputParams) {
    const queryParams = new URLSearchParams({
        client_id: params.client_id,
        brand_id: params.brand_id,
        task_id: params.task_id,
    });

    return await agentRequest(`/get-social-auditor-output?${queryParams.toString()}`, 'GET');
}
