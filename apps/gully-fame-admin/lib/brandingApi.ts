import { getAuthHeaders } from "./authApi";
import type { ApiResponse } from "./apiTypes";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://backend.gullyfame.com/v1/api/";

export interface LogoResponse {
  logoUrl: string;
}

export interface SplashResponse {
  images: string[];
}

export async function uploadLogo(file: File): Promise<ApiResponse<LogoResponse>> {
  const endpoint = `${BASE_URL}public/logo`;


  const formData = new FormData();
  formData.append("logo", file);
  formData.append("splash", "");

  const headers = getAuthHeaders();
  delete (headers as any)["Content-Type"];

  try {
    const httpResponse = await fetch(endpoint, {
      method: "POST",
      headers: headers,
      body: formData,
    });

    const responseText = await httpResponse.text();

    let responseData: any;
    try {
      responseData = JSON.parse(responseText);
    } catch (parseError) {
      console.error("[Branding API] POST Upload Logo - Parse error:", parseError);

      if (!httpResponse.ok) {
        console.error(
          "[Branding API] POST Upload Logo - Error:",
          httpResponse.status,
          httpResponse.statusText
        );
        return {
          success: false,
          message: `Upload failed: ${httpResponse.statusText} (Status: ${httpResponse.status})`,
          error: `HTTP ${httpResponse.status}`,
          data: undefined,
        };
      }

      return {
        success: false,
        message: "Invalid response format from server",
        error: "INVALID_JSON",
        data: undefined,
      };
    }

    if (!httpResponse.ok || responseData.code !== 1) {
      console.error("[Branding API] POST Upload Logo - API Error:", responseData);
      return {
        success: false,
        message: responseData.message || `Upload failed with status ${httpResponse.status}`,
        error: responseData.error || `HTTP ${httpResponse.status}`,
        data: undefined,
      };
    }


    return {
      success: true,
      message: responseData.message || "Logo uploaded successfully",
      data: { logoUrl: responseData.data?.logoUrl || "" },
    };
  } catch (error: any) {
    console.error("[Branding API] POST Upload Logo - Network error:", error);

    return {
      success: false,
      message: error.message || "Network error occurred",
      error: error.message || "NETWORK_ERROR",
      data: undefined,
    };
  }
}

export async function uploadSplash(files: File[]): Promise<ApiResponse<SplashResponse>> {
  const endpoint = `${BASE_URL}public/splash`;

  files.forEach((file, index) => {
  });

  const formData = new FormData();
  files.forEach((file) => {
    formData.append("splash", file);
  });

  const headers = getAuthHeaders();
  delete (headers as any)["Content-Type"];

  try {
    const httpResponse = await fetch(endpoint, {
      method: "POST",
      headers: headers,
      body: formData,
    });

    const responseText = await httpResponse.text();

    let responseData: any;
    try {
      responseData = JSON.parse(responseText);
    } catch (parseError) {
      console.error("[Branding API] POST Upload Splash - Parse error:", parseError);

      if (!httpResponse.ok) {
        console.error(
          "[Branding API] POST Upload Splash - Error:",
          httpResponse.status,
          httpResponse.statusText
        );
        return {
          success: false,
          message: `Upload failed: ${httpResponse.statusText} (Status: ${httpResponse.status})`,
          error: `HTTP ${httpResponse.status}`,
          data: undefined,
        };
      }

      return {
        success: false,
        message: "Invalid response format from server",
        error: "INVALID_JSON",
        data: undefined,
      };
    }

    if (!httpResponse.ok || responseData.code !== 1) {
      console.error("[Branding API] POST Upload Splash - API Error:", responseData);
      return {
        success: false,
        message: responseData.message || `Upload failed with status ${httpResponse.status}`,
        error: responseData.error || `HTTP ${httpResponse.status}`,
        data: undefined,
      };
    }


    return {
      success: true,
      message: responseData.message || "Splash images uploaded successfully",
      data: { images: responseData.data?.images || [] },
    };
  } catch (error: any) {
    console.error("[Branding API] POST Upload Splash - Network error:", error);

    return {
      success: false,
      message: error.message || "Network error occurred",
      error: error.message || "NETWORK_ERROR",
      data: undefined,
    };
  }
}

export async function getLogo(): Promise<ApiResponse<LogoResponse>> {
  const endpoint = `${BASE_URL}public/logo`;


  try {
    const httpResponse = await fetch(endpoint, {
      method: "GET",
      headers: getAuthHeaders({
        Accept: "application/json",
      }),
      cache: "no-store",
    });

    const responseText = await httpResponse.text();

    let responseData: any;
    try {
      responseData = JSON.parse(responseText);
    } catch (parseError) {
      console.error("[Branding API] GET Logo - Parse error:", parseError);

      if (!httpResponse.ok) {
        console.error(
          "[Branding API] GET Logo - Error:",
          httpResponse.status,
          httpResponse.statusText
        );
        return {
          success: false,
          message: `Failed to fetch logo: ${httpResponse.statusText} (Status: ${httpResponse.status})`,
          error: `HTTP ${httpResponse.status}`,
          data: undefined,
        };
      }

      return {
        success: false,
        message: "Invalid response format from server",
        error: "INVALID_JSON",
        data: undefined,
      };
    }

    if (!httpResponse.ok || responseData.code !== 1) {
      console.error("[Branding API] GET Logo - API Error:", responseData);
      return {
        success: false,
        message: responseData.message || `Failed to fetch logo with status ${httpResponse.status}`,
        error: responseData.error || `HTTP ${httpResponse.status}`,
        data: undefined,
      };
    }

    const logoUrl =
      typeof responseData.data === "string" ? responseData.data : responseData.data?.logoUrl || "";


    return {
      success: true,
      message: responseData.message || "Logo fetched successfully",
      data: { logoUrl },
    };
  } catch (error: any) {
    console.error("[Branding API] GET Logo - Network error:", error);

    return {
      success: false,
      message: error.message || "Network error occurred",
      error: error.message || "NETWORK_ERROR",
      data: undefined,
    };
  }
}

export async function getSplash(): Promise<ApiResponse<SplashResponse>> {
  const endpoint = `${BASE_URL}public/splash`;


  try {
    const httpResponse = await fetch(endpoint, {
      method: "GET",
      headers: getAuthHeaders({
        Accept: "application/json",
      }),
      cache: "no-store",
    });

    const responseText = await httpResponse.text();

    let responseData: any;
    try {
      responseData = JSON.parse(responseText);
    } catch (parseError) {
      console.error("[Branding API] GET Splash - Parse error:", parseError);

      if (!httpResponse.ok) {
        console.error(
          "[Branding API] GET Splash - Error:",
          httpResponse.status,
          httpResponse.statusText
        );
        return {
          success: false,
          message: `Failed to fetch splash images: ${httpResponse.statusText} (Status: ${httpResponse.status})`,
          error: `HTTP ${httpResponse.status}`,
          data: undefined,
        };
      }

      return {
        success: false,
        message: "Invalid response format from server",
        error: "INVALID_JSON",
        data: undefined,
      };
    }

    if (!httpResponse.ok || responseData.code !== 1) {
      console.error("[Branding API] GET Splash - API Error:", responseData);
      return {
        success: false,
        message:
          responseData.message ||
          `Failed to fetch splash images with status ${httpResponse.status}`,
        error: responseData.error || `HTTP ${httpResponse.status}`,
        data: undefined,
      };
    }

    const images = Array.isArray(responseData.data) ? responseData.data : [];


    return {
      success: true,
      message: responseData.message || "Splash images fetched successfully",
      data: { images },
    };
  } catch (error: any) {
    console.error("[Branding API] GET Splash - Network error:", error);

    return {
      success: false,
      message: error.message || "Network error occurred",
      error: error.message || "NETWORK_ERROR",
      data: undefined,
    };
  }
}
