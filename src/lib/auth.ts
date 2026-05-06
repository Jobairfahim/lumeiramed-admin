export const API_BASE_URL = "https://server.lumieramed.com/api/v1";

const ACCESS_TOKEN_KEY = "lumieramed_admin_access_token";
const REFRESH_TOKEN_KEY = "lumieramed_admin_refresh_token";

export interface LoginPayload {
  email: string;
  password: string;
}

interface LoginErrorSource {
  message?: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  statusCode: number;
  data: {
    accessToken: string;
    refreshToken: string;
  };
  errorSources?: LoginErrorSource[];
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ChangePasswordResponse {
  success: boolean;
  message: string;
  statusCode: number;
  errorSources?: LoginErrorSource[];
}

export async function loginAdmin(payload: LoginPayload) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const result = (await response.json()) as LoginResponse;

  if (!response.ok || !result.success) {
    throw new Error(
      result.errorSources?.[0]?.message ||
        result.message ||
        "Login failed. Please check your credentials."
    );
  }

  return result;
}

export async function changePassword(payload: ChangePasswordPayload): Promise<ChangePasswordResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/change-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(payload),
  });

  const result = (await response.json()) as ChangePasswordResponse;

  if (!response.ok || !result.success) {
    throw new Error(
      result.errorSources?.[0]?.message ||
        result.message ||
        "Failed to change password. Please try again."
    );
  }

  return result;
}

export function persistTokens(accessToken: string, refreshToken: string) {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
}

export function getAccessToken() {
  if (typeof window === "undefined") {
    return null;
  }

  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getAuthHeaders() {
  const accessToken = getAccessToken();

  if (!accessToken) {
    return {} as Record<string, string>;
  }

  return {
    Authorization: `Bearer ${accessToken}`,
  } as Record<string, string>;
}

export function getCurrentUserId(): string | null {
  const token = getAccessToken();
  if (!token) return null;

  try {
    // Decode JWT token (basic parsing without verification for UI purposes)
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.userId || payload.id || payload._id || null;
  } catch (error) {
    console.error("Failed to decode token:", error);
    return null;
  }
}

export async function logout(deviceToken?: string) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      body: JSON.stringify({
        deviceToken: deviceToken || "",
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("Logout failed:", result);
    }

    // Clear tokens regardless of API response
    clearTokens();
    
    return result;
  } catch (error) {
    console.error("Logout error:", error);
    clearTokens();
    throw error;
  }
}

export function clearTokens() {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}
