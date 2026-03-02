'use server';

import { getCurrentUser } from '../authActions';
import { brandRequest } from '@/server/api/brandRequest';

export async function getCcbaTaskStatus(brandId: string) {
  try {
    const user = await getCurrentUser();

    const { success, data, error } = await brandRequest(
      `/stage/running-tasks?stage=ccba&client_id=${user.client_id}&brand_id=${brandId}`, 'GET'
    );

    if (!success) return null;

    return data;
  } catch (error) {
    return null;
  }
}
