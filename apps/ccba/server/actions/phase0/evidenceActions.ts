"use server";

import { brandRequest } from "@/server/api/brandRequest";
import { getCurrentUser } from "@/server/actions/authActions";
import { revalidatePath } from "next/cache";

export async function runEvidenceLedgerBuilderAction(
  brandId: string,
  websiteBatchId?: string | null,
  socialBatchId?: string | null
) {
  try {
    const user = await getCurrentUser();
    if (!user || !user.client_id) {
      return { success: false, message: "Unauthorized" };
    }

    if (!websiteBatchId && !socialBatchId) {
      return {
        success: false,
        message: "At least one batch ID (website or social) is required.",
      };
    }

    const queryParams = new URLSearchParams({
      client_id: user.client_id,
      brand_id: brandId,
    });

    if (websiteBatchId) queryParams.append("batch_website_task_id", websiteBatchId);
    if (socialBatchId) queryParams.append("batch_social_task_id", socialBatchId);

    const { success, data, error } = await brandRequest(
      `/run-evidence-ledger-builder?${queryParams.toString()}`,
      "POST",
      {} // Empty body as params are in query string
    );

    if (!success) {
      return { success: false, message: error || "Failed to run ledger builder" };
    }

    // Since this creates a new engagement, we can't easily revalidate a "list" unless we tracked it.
    // We will return the engagement_id so the UI can redirect.
    return { success: true, data };
  } catch (error) {
    console.error("runEvidenceLedgerBuilderAction Error:", error);
    return { success: false, message: "Internal Server Error" };
  }
}

export async function getEvidenceLedgerAction(engagementId: string) {
  try {
    const user = await getCurrentUser();
    if (!user || !user.client_id) {
      return { success: false, message: "Unauthorized" };
    }

    const queryParams = new URLSearchParams({
      client_id: user.client_id,
      engagement_id: engagementId,
    });

    const { success, data, error } = await brandRequest(
      `/get-evidence-ledger?${queryParams.toString()}`,
      "GET"
    );

    if (!success) {
      return { success: false, message: error || "Failed to fetch evidence ledger" };
    }

    return { success: true, data };
  } catch (error) {
    console.error("getEvidenceLedgerAction Error:", error);
    return { success: false, message: "Internal Server Error" };
  }
}

export async function getEvidenceAction(engagementId: string, evidenceId: string) {
  try {
    const user = await getCurrentUser();
    if (!user || !user.client_id) {
      return { success: false, message: "Unauthorized" };
    }

    const queryParams = new URLSearchParams({
      client_id: user.client_id,
      engagement_id: engagementId,
      evidence_id: evidenceId,
    });

    const { success, data, error } = await brandRequest(
      `/get-evidence?${queryParams.toString()}`,
      "GET"
    );

    if (!success) {
      return { success: false, message: error || "Failed to fetch evidence" };
    }

    return { success: true, data };
  } catch (error) {
    console.error("getEvidenceAction Error:", error);
    return { success: false, message: "Internal Server Error" };
  }
}

export async function validateEvidenceIdsAction(engagementId: string, evidenceIds: string[]) {
  try {
    const user = await getCurrentUser();
    if (!user || !user.client_id) {
      return { success: false, message: "Unauthorized" };
    }

    const queryParams = new URLSearchParams({
      client_id: user.client_id,
      engagement_id: engagementId,
      evidence_ids: evidenceIds.join(","),
    });

    const { success, data, error } = await brandRequest(
      `/validate-evidence-ids?${queryParams.toString()}`,
      "GET"
    );

    if (!success) {
      return { success: false, message: error || "Failed to validate evidence IDs" };
    }

    return { success: true, data };
  } catch (error) {
    console.error("validateEvidenceIdsAction Error:", error);
    return { success: false, message: "Internal Server Error" };
  }
}

export async function calculateEvidenceStrengthAction(engagementId: string, evidenceIds: string[]) {
  try {
    const user = await getCurrentUser();
    if (!user || !user.client_id) {
      return { success: false, message: "Unauthorized" };
    }

    const queryParams = new URLSearchParams({
      client_id: user.client_id,
      engagement_id: engagementId,
      evidence_ids: evidenceIds.join(","),
    });

    const { success, data, error } = await brandRequest(
      `/calculate-evidence-strength?${queryParams.toString()}`,
      "POST", // Note: Doc says POST but params in Query? Doc is slightly ambiguous "Input Parameters (Query Parameters)". Usually POST has body. I'll stick to query params as per doc table.
      {}
    );

    if (!success) {
      return { success: false, message: error || "Failed to calculate evidence strength" };
    }

    return { success: true, data };
  } catch (error) {
    console.error("calculateEvidenceStrengthAction Error:", error);
    return { success: false, message: "Internal Server Error" };
  }
}
