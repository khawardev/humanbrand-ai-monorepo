'use server';

import { agentRequest } from "../api/agentRequest";

export type RunWebExtractionParams = {
    client_id: string;
    brand_id: string;
    batch_website_task_id: string;
    analysis_scope?: 'brand' | 'competitors';
    competitor_id?: string;
    instruction?: string;
}

export type GetWebExtractionOutputParams = {
    client_id: string;
    brand_id: string;
    task_id: string;
}

export type ListWebExtractionTasksParams = {
    client_id: string;
    brand_id: string;
}

export type DeleteWebExtractionTaskParams = {
    client_id: string;
    brand_id: string;
    task_id: string;
}

export type RunWebSynthesisParams = {
    client_id: string;
    brand_id: string;
    extraction_task_id: string;
    instruction?: string;
}

export type GetWebSynthesisOutputParams = {
    client_id: string;
    brand_id: string;
    task_id: string;
}

export type ListWebSynthesisTasksParams = {
    client_id: string;
    brand_id: string;
}

export type DeleteWebSynthesisTaskParams = {
    client_id: string;
    brand_id: string;
    task_id: string;
}

export type WebExtractionTask = {
    task_id: string;
    entity_name: string;
    analysis_scope: 'brand' | 'competitors';
    timestamp: string;
    model_used: string;
    batch_id: string;
    execution_time_seconds: number;
    scraped_urls_count?: number;
}

export type WebExtractionOutput = {
    task_id: string;
    client_id: string;
    brand_id: string;
    extraction_output: string;
    entity_name: string;
    analysis_scope: 'brand' | 'competitors';
    batch_id: string;
    scraped_urls_count: number;
    model_used: string;
    timestamp: string;
    execution_time_seconds: number;
}

export type WebSynthesisTask = {
    task_id: string;
    entity_name: string;
    analysis_scope: 'brand' | 'competitors';
    timestamp: string;
    model_used: string;
    batch_id: string;
    execution_time_seconds: number;
}

export type WebSynthesisOutput = {
    task_id: string;
    client_id: string;
    brand_id: string;
    synthesis_report: string;
    entity_name: string;
    analysis_scope: 'brand' | 'competitors';
    batch_id: string;
    model_used: string;
    timestamp: string;
    execution_time_seconds: number;
}

export async function runWebExtractionAgent(params: RunWebExtractionParams) {
    const queryParams = new URLSearchParams({
        client_id: params.client_id,
        brand_id: params.brand_id,
        batch_website_task_id: params.batch_website_task_id,
    });

    if (params.analysis_scope) queryParams.append('analysis_scope', params.analysis_scope);
    if (params.competitor_id) queryParams.append('competitor_id', params.competitor_id);
    if (params.instruction) queryParams.append('instruction', params.instruction);

    return await agentRequest(`/run-web-extraction-agent?${queryParams.toString()}`, 'POST');
}

export async function getWebExtractionOutput(params: GetWebExtractionOutputParams) {
    const queryParams = new URLSearchParams({
        client_id: params.client_id,
        brand_id: params.brand_id,
        task_id: params.task_id,
    });

    return await agentRequest(`/get-web-extraction-output?${queryParams.toString()}`, 'GET');
}

export async function listWebExtractionTasks(params: ListWebExtractionTasksParams) {
    const queryParams = new URLSearchParams({
        client_id: params.client_id,
        brand_id: params.brand_id,
    });

    return await agentRequest(`/list-web-extraction-tasks?${queryParams.toString()}`, 'GET');
}

export async function deleteWebExtractionTask(params: DeleteWebExtractionTaskParams) {
    const queryParams = new URLSearchParams({
        client_id: params.client_id,
        brand_id: params.brand_id,
    });

    return await agentRequest(`/delete-web-extraction-task/${params.task_id}?${queryParams.toString()}`, 'DELETE');
}

export async function runWebSynthesisAgent(params: RunWebSynthesisParams) {
    const queryParams = new URLSearchParams({
        client_id: params.client_id,
        brand_id: params.brand_id,
        extraction_task_id: params.extraction_task_id,
    });

    if (params.instruction) queryParams.append('instruction', params.instruction);

    return await agentRequest(`/run-web-synthesis-agent?${queryParams.toString()}`, 'POST');
}

export async function getWebSynthesisOutput(params: GetWebSynthesisOutputParams) {
    const queryParams = new URLSearchParams({
        client_id: params.client_id,
        brand_id: params.brand_id,
        task_id: params.task_id,
    });

    return await agentRequest(`/get-web-synthesis-output?${queryParams.toString()}`, 'GET');
}

export async function listWebSynthesisTasks(params: ListWebSynthesisTasksParams) {
    const queryParams = new URLSearchParams({
        client_id: params.client_id,
        brand_id: params.brand_id,
    });

    return await agentRequest(`/list-web-synthesis-tasks?${queryParams.toString()}`, 'GET');
}

export async function deleteWebSynthesisTask(params: DeleteWebSynthesisTaskParams) {
    const queryParams = new URLSearchParams({
        client_id: params.client_id,
        brand_id: params.brand_id,
    });

    return await agentRequest(`/delete-web-synthesis-task/${params.task_id}?${queryParams.toString()}`, 'DELETE');
}
