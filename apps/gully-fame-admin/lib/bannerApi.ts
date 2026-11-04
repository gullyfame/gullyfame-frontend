import { getAuthHeaders } from './authApi';
import type { ApiResponse } from './apiTypes';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://backend.gullyfame.com/v1/api/';

export interface Banner {
  id: string;
  title: string;
  banner: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: any;
}

export async function createBanner(
  title: string,
  bannerFile: File
): Promise<ApiResponse<Banner>> {
  if (!title?.trim()) {
    console.warn('[Banners API] POST Create Banner - Missing title');
    return {
      success: false,
      message: 'Banner title is required',
      error: 'MISSING_TITLE',
    };
  }

  if (!bannerFile) {
    console.warn('[Banners API] POST Create Banner - Missing banner file');
    return {
      success: false,
      message: 'Banner image file is required',
      error: 'MISSING_FILE',
    };
  }

  const endpoint = `${BASE_URL}admin/banners`;
  

  const formData = new FormData();
  formData.append('title', title.trim());
  formData.append('banner', bannerFile);

  try {
    const httpResponse = await fetch(endpoint, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: formData,
    });

    const responseText = await httpResponse.text();

    let responseData: any;
    try {
      responseData = responseText ? JSON.parse(responseText) : {};
    } catch (parseError) {
      console.error('[Banners API] POST Create Banner - Parse error:', parseError);

      if (!httpResponse.ok) {
        console.error('[Banners API] POST Create Banner - Error:', httpResponse.status, httpResponse.statusText);
        return {
          success: false,
          message: `Failed to create banner: ${httpResponse.statusText} (Status: ${httpResponse.status})`,
          error: `HTTP ${httpResponse.status}`,
        };
      }

      return {
        success: false,
        message: 'Invalid response format from server',
        error: 'INVALID_JSON',
      };
    }

    if (!httpResponse.ok || responseData.code !== 1) {
      console.error('[Banners API] POST Create Banner - API Error:', responseData);
      return {
        success: false,
        message:
          responseData.message ||
          responseData.error ||
          `Failed to create banner with status ${httpResponse.status}`,
        error: responseData.error || `HTTP_${httpResponse.status}`,
        data: responseData.data,
      };
    }

    const payload = responseData.data || {};
    const banner: Banner = {
      id: payload._id?.toString() || payload.id?.toString() || '',
      title: payload.title || '',
      banner: payload.banner || payload.imageUrl || '',
      isActive: payload.isActive,
      createdAt: payload.createdAt,
      updatedAt: payload.updatedAt,
      ...payload,
    };


    return {
      success: true,
      message: responseData.message || 'Banner created successfully',
      data: banner,
    };
  } catch (error: any) {
    console.error('[Banners API] POST Create Banner - Network error:', error);

    return {
      success: false,
      message: error.message || 'Network error occurred',
      error: error.message || 'NETWORK_ERROR',
    };
  }
}

export async function getBanners(
  page: number = 1,
  limit: number = 50
): Promise<ApiResponse<{ items: Banner[]; total?: number; page?: number; limit?: number }>> {
  const endpoint = `${BASE_URL}admin/banners?page=${page}&limit=${limit}`;


  try {
    const httpResponse = await fetch(endpoint, {
      method: 'GET',
      headers: getAuthHeaders({
        Accept: 'application/json',
      }),
    });

    const responseText = await httpResponse.text();

    let responseData: any;
    try {
      responseData = responseText ? JSON.parse(responseText) : {};
    } catch (parseError) {
      console.error('[Banners API] GET Banners - Parse error:', parseError);

      if (!httpResponse.ok) {
        console.error('[Banners API] GET Banners - Error:', httpResponse.status, httpResponse.statusText);
        return {
          success: false,
          message: `Failed to fetch banners: ${httpResponse.statusText} (Status: ${httpResponse.status})`,
          error: `HTTP ${httpResponse.status}`,
        };
      }

      return {
        success: false,
        message: 'Invalid response format from server',
        error: 'INVALID_JSON',
      };
    }

    if (!httpResponse.ok || responseData.code !== 1) {
      console.error('[Banners API] GET Banners - API Error:', responseData);
      return {
        success: false,
        message:
          responseData.message ||
          responseData.error ||
          `Failed to fetch banners with status ${httpResponse.status}`,
        error: responseData.error || `HTTP ${httpResponse.status}`,
        data: responseData.data,
      };
    }

    const payload = responseData.data || {};
    let rawItems: any[] = [];

    if (Array.isArray(payload.Banners)) {
      rawItems = payload.Banners;
    } else if (Array.isArray(payload.banners)) {
      rawItems = payload.banners;
    } else if (Array.isArray(payload)) {
      rawItems = payload;
    } else if (Array.isArray(payload.data)) {
      rawItems = payload.data;
    }

    const items: Banner[] = rawItems.map((b) => ({
      id: b._id?.toString() || b.id?.toString() || '',
      title: b.title || '',
      banner: b.banner || b.imageUrl || '',
      isActive: b.isActive,
      createdAt: b.createdAt,
      updatedAt: b.updatedAt,
      ...b,
    }));

    const result = {
      items,
      total: payload.total,
      page: payload.page || page,
      limit: payload.limit || limit,
    };


    return {
      success: true,
      message: responseData.message || 'Banners fetched successfully',
      data: result,
    };
  } catch (error: any) {
    console.error('[Banners API] GET Banners - Network error:', error);

    return {
      success: false,
      message: error.message || 'Network error occurred',
      error: error.message || 'NETWORK_ERROR',
    };
  }
}

export async function getBanner(id: string): Promise<ApiResponse<Banner>> {
  if (!id) {
    console.warn('[Banners API] GET Banner - Missing banner ID');
    return {
      success: false,
      message: 'Banner ID is required',
      error: 'MISSING_ID',
    };
  }

  const safeId = encodeURIComponent(id.toString());
  const endpoint = `${BASE_URL}admin/banners/${safeId}`;


  try {
    const httpResponse = await fetch(endpoint, {
      method: 'GET',
      headers: getAuthHeaders({
        Accept: 'application/json',
      }),
    });

    const responseText = await httpResponse.text();

    let responseData: any;
    try {
      responseData = responseText ? JSON.parse(responseText) : {};
    } catch (parseError) {
      console.error('[Banners API] GET Banner - Parse error:', parseError);

      if (!httpResponse.ok) {
        console.error('[Banners API] GET Banner - Error:', httpResponse.status, httpResponse.statusText);
        return {
          success: false,
          message: `Failed to fetch banner: ${httpResponse.statusText} (Status: ${httpResponse.status})`,
          error: `HTTP ${httpResponse.status}`,
        };
      }

      return {
        success: false,
        message: 'Invalid response format from server',
        error: 'INVALID_JSON',
      };
    }

    if (!httpResponse.ok || responseData.code !== 1) {
      console.error('[Banners API] GET Banner - API Error:', responseData);
      return {
        success: false,
        message:
          responseData.message ||
          responseData.error ||
          `Failed to fetch banner with status ${httpResponse.status}`,
        error: responseData.error || `HTTP ${httpResponse.status}`,
      };
    }

    const payload = responseData.data || {};
    const banner: Banner = {
      id: payload._id?.toString() || payload.id?.toString() || '',
      title: payload.title || '',
      banner: payload.banner || payload.imageUrl || '',
      isActive: payload.isActive,
      createdAt: payload.createdAt,
      updatedAt: payload.updatedAt,
      ...payload,
    };


    return {
      success: true,
      message: responseData.message || 'Banner fetched successfully',
      data: banner,
    };
  } catch (error: any) {
    console.error('[Banners API] GET Banner - Network error:', error);

    return {
      success: false,
      message: error.message || 'Network error occurred',
      error: error.message || 'NETWORK_ERROR',
    };
  }
}

export async function updateBanner(
  id: string,
  title?: string,
  bannerFile?: File | null
): Promise<ApiResponse<Banner>> {
  if (!id) {
    console.warn('[Banners API] PUT Update Banner - Missing banner ID');
    return {
      success: false,
      message: 'Banner ID is required',
      error: 'MISSING_ID',
    };
  }

  const safeId = encodeURIComponent(id.toString());
  const endpoint = `${BASE_URL}admin/banners/${safeId}`;
  
  if (bannerFile) {
  }

  const formData = new FormData();

  if (title?.trim()) {
    formData.append('title', title.trim());
  }

  if (bannerFile) {
    formData.append('banner', bannerFile);
  }

  try {
    const httpResponse = await fetch(endpoint, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: formData,
    });

    const responseText = await httpResponse.text();

    let responseData: any;
    try {
      responseData = responseText ? JSON.parse(responseText) : {};
    } catch (parseError) {
      console.error('[Banners API] PUT Update Banner - Parse error:', parseError);

      if (!httpResponse.ok) {
        console.error('[Banners API] PUT Update Banner - Error:', httpResponse.status, httpResponse.statusText);
        return {
          success: false,
          message: `Failed to update banner: ${httpResponse.statusText} (Status: ${httpResponse.status})`,
          error: `HTTP ${httpResponse.status}`,
        };
      }

      return {
        success: false,
        message: 'Invalid response format from server',
        error: 'INVALID_JSON',
      };
    }

    if (!httpResponse.ok || responseData.code !== 1) {
      console.error('[Banners API] PUT Update Banner - API Error:', responseData);
      return {
        success: false,
        message:
          responseData.message ||
          responseData.error ||
          `Failed to update banner with status ${httpResponse.status}`,
        error: responseData.error || `HTTP ${httpResponse.status}`,
        data: responseData.data,
      };
    }

    const payload = responseData.data || {};
    const banner: Banner = {
      id: payload._id?.toString() || payload.id?.toString() || id,
      title: payload.title || title || '',
      banner: payload.banner || payload.imageUrl || '',
      isActive: payload.isActive,
      createdAt: payload.createdAt,
      updatedAt: payload.updatedAt,
      ...payload,
    };


    return {
      success: true,
      message: responseData.message || 'Banner updated successfully',
      data: banner,
    };
  } catch (error: any) {
    console.error('[Banners API] PUT Update Banner - Network error:', error);

    return {
      success: false,
      message: error.message || 'Network error occurred',
      error: error.message || 'NETWORK_ERROR',
    };
  }
}

export async function deleteBanner(id: string): Promise<ApiResponse<null>> {
  if (!id) {
    console.warn('[Banners API] DELETE Banner - Called without a valid id');
    return {
      success: false,
      message: 'Banner ID is required to delete a banner.',
      error: 'MISSING_ID',
      data: null,
    };
  }

  const safeId = encodeURIComponent(id.toString());
  const endpoint = `${BASE_URL}admin/banners/${safeId}`;


  try {
    const httpResponse = await fetch(endpoint, {
      method: 'DELETE',
      headers: getAuthHeaders({
        Accept: 'application/json',
      }),
    });

    const responseText = await httpResponse.text();

    let responseData: any;
    try {
      responseData = responseText ? JSON.parse(responseText) : {};
    } catch (parseError) {
      console.error('[Banners API] DELETE Banner - Parse error:', parseError);

      if (!httpResponse.ok) {
        console.error('[Banners API] DELETE Banner - Error:', httpResponse.status, httpResponse.statusText);
        return {
          success: false,
          message: `Failed to delete banner: ${httpResponse.statusText} (Status: ${httpResponse.status})`,
          error: `HTTP ${httpResponse.status}`,
          data: null,
        };
      }

      return {
        success: true,
        message: 'Banner deleted successfully',
        data: null,
      };
    }

    if (!httpResponse.ok || responseData.code !== 1) {
      console.error('[Banners API] DELETE Banner - API Error:', responseData);
      return {
        success: false,
        message:
          responseData.message ||
          responseData.error ||
          `Failed to delete banner with status ${httpResponse.status}`,
        error: responseData.error || `HTTP ${httpResponse.status}`,
        data: null,
      };
    }


    return {
      success: true,
      message: responseData.message || 'Banner deleted successfully',
      data: null,
    };
  } catch (error: any) {
    console.error('[Banners API] DELETE Banner - Network error:', error);

    return {
      success: false,
      message: error.message || 'Network error occurred',
      error: error.message || 'NETWORK_ERROR',
      data: null,
    };
  }
}

