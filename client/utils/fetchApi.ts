// Environment variable for API base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://practice.local' || 'http://localhost:3001';

// Import axios
import axios, { AxiosResponse, AxiosError } from 'axios';

// Generic types for API responses
export interface ApiResponse<T = unknown> {
    data: T;
    message?: string;
    success: boolean;
}

export interface PaginatedResponse<T = unknown> {
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
    success: boolean;
}

// Request options interface for axios
export interface RequestOptions {
    params?: Record<string, string | number | boolean>;
    showLoading?: boolean;
    headers?: Record<string, string>;
    timeout?: number;
}

// Error class for API errors
export class ApiError extends Error {
    constructor(
        message: string,
        public status: number,
        public data?: unknown
    ) {
        super(message);
        this.name = 'ApiError';
    }
}

// Helper function to build URL with query parameters
const buildUrl = (endpoint: string, params?: Record<string, string | number | boolean>): string => {
    const url = new URL(`/api${endpoint}`, API_BASE_URL);
    if (params) {
        Object.entries(params).forEach(([key, value]) => {
            url.searchParams.append(key, String(value));
        });
    }

    return url.toString();
};

// Helper function to get default headers
const getDefaultHeaders = (customHeaders?: Record<string, string>): Record<string, string> => {
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...customHeaders,
    };

    // Add authorization header if token exists
    const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
};

// Helper function to handle axios response
const handleAxiosResponse = <T>(response: AxiosResponse): T => {
    return response.data;
};

// Helper function to handle axios error
const handleAxiosError = (error: AxiosError): never => {
    if (error.response) {
        // Server responded with error status
        const status = error.response.status;
        const data = error.response.data;
        throw new ApiError(
            (data as Record<string, unknown>)?.message as string || `HTTP error! status: ${status} `,
            status,
            data
        );
    } else if (error.request) {
        // Request was made but no response received
        throw new ApiError('Network error - no response received', 0);
    } else {
        // Something else happened
        throw new ApiError(error.message || 'Unknown error occurred', 0);
    }
};

// Main API class with all CRUD operations
export class FetchApi {

    // GET - Read data
    static async get<T = unknown>(
        endpoint: string,
        options: RequestOptions = {}
    ): Promise<T> {
        const { params, headers, ...axiosConfig } = options;
        const url = buildUrl(endpoint, params);
        try {
            const response = await axios.get(url, {
                headers: getDefaultHeaders(headers),
                ...axiosConfig,
            });
            return handleAxiosResponse<T>(response);
        } catch (error) {
            handleAxiosError(error as AxiosError);
            // This line will never be reached due to throw in handleAxiosError
            throw error;
        }
    }

    // POST - Create data
    static async post<T = unknown>(
        endpoint: string,
        data?: unknown,
        options: RequestOptions = {}
    ): Promise<T> {
        const { params, headers, ...axiosConfig } = options;
        const url = buildUrl(endpoint, params);

        try {
            const response = await axios.post(url, data, {
                headers: getDefaultHeaders(headers),
                ...axiosConfig,
            });
            return handleAxiosResponse<T>(response);
        } catch (error) {
            handleAxiosError(error as AxiosError);
            // This line will never be reached due to throw in handleAxiosError
            throw error;
        }
    }

    // PUT - Complete update
    static async put<T = unknown>(
        endpoint: string,
        data?: unknown,
        options: RequestOptions = {}
    ): Promise<T> {
        const { params, headers, ...axiosConfig } = options;
        const url = buildUrl(endpoint, params);

        try {
            const response = await axios.put(url, data, {
                headers: getDefaultHeaders(headers),
                ...axiosConfig,
            });
            return handleAxiosResponse<T>(response);
        } catch (error) {
            handleAxiosError(error as AxiosError);
            // This line will never be reached due to throw in handleAxiosError
            throw error;
        }
    }

    // PATCH - Partial update
    static async patch<T = unknown>(
        endpoint: string,
        data?: unknown,
        options: RequestOptions = {}
    ): Promise<T> {
        const { params, headers, ...axiosConfig } = options;
        const url = buildUrl(endpoint, params);

        try {
            const response = await axios.patch(url, data, {
                headers: getDefaultHeaders(headers),
                ...axiosConfig,
            });
            return handleAxiosResponse<T>(response);
        } catch (error) {
            handleAxiosError(error as AxiosError);
            // This line will never be reached due to throw in handleAxiosError
            throw error;
        }
    }

    // DELETE - Delete data
    static async delete<T = unknown>(
        endpoint: string,
        options: RequestOptions = {}
    ): Promise<T> {
        const { params, headers, ...axiosConfig } = options;
        const url = buildUrl(endpoint, params);

        try {
            const response = await axios.delete(url, {
                headers: getDefaultHeaders(headers),
                ...axiosConfig,
            });
            return handleAxiosResponse<T>(response);
        } catch (error) {
            handleAxiosError(error as AxiosError);
            // This line will never be reached due to throw in handleAxiosError
            throw error;
        }
    }

    // File upload with FormData
    static async upload<T = unknown>(
        endpoint: string,
        formData: FormData,
        options: RequestOptions = {}
    ): Promise<T> {
        const { params, headers, ...axiosConfig } = options;
        const url = buildUrl(endpoint, params);

        // Remove Content-Type header for FormData (axios will set it with boundary)
        const uploadHeaders = { ...getDefaultHeaders(headers) };
        delete uploadHeaders['Content-Type'];

        try {
            const response = await axios.post(url, formData, {
                headers: uploadHeaders,
                ...axiosConfig,
            });
            return handleAxiosResponse<T>(response);
        } catch (error) {
            handleAxiosError(error as AxiosError);
            // This line will never be reached due to throw in handleAxiosError
            throw error;
        }
    }

    // Batch operations
    static async batch<T = unknown>(
        requests: Array<{
            endpoint: string;
            method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
            data?: unknown;
            options?: RequestOptions;
        }>
    ): Promise<T[]> {
        const promises = requests.map(async (request) => {
            const { endpoint, method, data, options } = request;

            switch (method) {
                case 'GET':
                    return this.get<T>(endpoint, options);
                case 'POST':
                    return this.post<T>(endpoint, data, options);
                case 'PUT':
                    return this.put<T>(endpoint, data, options);
                case 'PATCH':
                    return this.patch<T>(endpoint, data, options);
                case 'DELETE':
                    return this.delete<T>(endpoint, options);
                default:
                    throw new Error(`Unsupported method: ${method} `);
            }
        });

        return Promise.all(promises);
    }
}

// Convenience functions for common use cases
export const api = {
    // User operations
    getUsers: (params?: Record<string, string | number | boolean>) =>
        FetchApi.get<PaginatedResponse>('/users', { params }),

    getUser: (id: string) =>
        FetchApi.get(`/users/${id}`),

    createUser: (userData: Record<string, unknown>) =>
        FetchApi.post('/users', userData),

    updateUser: (id: string, userData: Record<string, unknown>) =>
        FetchApi.put(`/users/${id}`, userData),

    partialUpdateUser: (id: string, userData: Record<string, unknown>) =>
        FetchApi.patch(`/users/${id}`, userData),

    deleteUser: (id: string) =>
        FetchApi.delete(`/users/${id}`),

    // Auth operations
    login: (credentials: { email: string; password: string }) =>
        FetchApi.post('/auth/login', credentials),

    register: (userData: Record<string, unknown>) =>
        FetchApi.post('/auth/register', userData),

    logout: () =>
        FetchApi.post('/auth/logout'),

    refreshToken: () =>
        FetchApi.post('/auth/refresh'),

    // Generic CRUD operations
    list: <T>(endpoint: string, params?: Record<string, string | number | boolean>) =>
        FetchApi.get<PaginatedResponse<T>>(endpoint, { params }),

    get: <T>(endpoint: string) =>
        FetchApi.get<T>(endpoint),

    create: <T>(endpoint: string, data: unknown) =>
        FetchApi.post<T>(endpoint, data),

    update: <T>(endpoint: string, data: unknown) =>
        FetchApi.put<T>(endpoint, data),

    partialUpdate: <T>(endpoint: string, data: unknown) =>
        FetchApi.patch<T>(endpoint, data),

    remove: (endpoint: string) =>
        FetchApi.delete(endpoint),

    // File operations
    upload: <T>(endpoint: string, formData: FormData) =>
        FetchApi.upload<T>(endpoint, formData),

    download: async (endpoint: string, filename?: string) => {
        try {
            const response = await axios.get(buildUrl(endpoint), {
                responseType: 'blob',
            });

            const blob = new Blob([response.data]);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = filename || 'download';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (error) {
            handleAxiosError(error as AxiosError);
        }
        return;
    },
};

// Export default for convenience
export default FetchApi;
