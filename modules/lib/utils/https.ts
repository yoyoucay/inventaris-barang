// utils/http.ts
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

interface HttpRequestOptions {
    method: HttpMethod;
    headers?: Record<string, string>;
    body?: BodyInit | null;
}

export const httpRequest = async <T>(
    url: string,
    options: HttpRequestOptions
): Promise<T> => {
    const { method, headers = {}, body = null } = options;

    // Set default headers
    const defaultHeaders = {
        'Content-Type': 'application/json',
    };

    const response = await fetch(process.env.NEXT_PUBLIC_BASE_PATH + url, {
        method,
        headers: { ...defaultHeaders, ...headers },
        body: body ? JSON.stringify(body) : null,
    });
    return response.json() as Promise<T>;
};

export const httpGet = async <T>(url: string, headers?: Record<string, string>): Promise<T> => {
    return httpRequest<T>(url, { method: 'GET', headers });
};

export const httpPost = async <T>(url: string, body: any, headers?: Record<string, string>): Promise<T> => {
    return httpRequest<T>(url, { method: 'POST', headers, body });
};

export const httpPut = async <T>(url: string, body: any, headers?: Record<string, string>): Promise<T> => {
    return httpRequest<T>(url, { method: 'PUT', headers, body });
};

export const httpDelete = async <T>(url: string, headers?: Record<string, string>): Promise<T> => {
    return httpRequest<T>(url, { method: 'DELETE', headers });
};

