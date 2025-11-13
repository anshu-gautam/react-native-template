import { logError } from '@/lib/sentry';
import type { ApiError, ApiResponse } from '@/types';
import axios, { type AxiosInstance, type AxiosError, type AxiosRequestConfig } from 'axios';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        // Add auth token if available
        // You can get the token from your auth store here
        // const token = getAuthToken();
        // if (token) {
        //   config.headers.Authorization = `Bearer ${token}`;
        // }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => {
        return response;
      },
      (error: AxiosError<ApiError>) => {
        const apiError: ApiError = {
          message: error.response?.data?.message || error.message || 'An error occurred',
          code: error.response?.data?.code || error.code,
          status: error.response?.status,
          errors: error.response?.data?.errors,
        };

        // Log error to Sentry
        logError(error as Error, {
          apiError,
          url: error.config?.url,
          method: error.config?.method,
        });

        return Promise.reject(apiError);
      }
    );
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.get<ApiResponse<T>>(url, config);
    return response.data;
  }

  async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.post<ApiResponse<T>>(url, data, config);
    return response.data;
  }

  async put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.put<ApiResponse<T>>(url, data, config);
    return response.data;
  }

  async patch<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await this.client.patch<ApiResponse<T>>(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.delete<ApiResponse<T>>(url, config);
    return response.data;
  }

  setAuthToken(token: string): void {
    this.client.defaults.headers.common.Authorization = `Bearer ${token}`;
  }

  removeAuthToken(): void {
    this.client.defaults.headers.common.Authorization = undefined;
  }
}

export const apiClient = new ApiClient();
