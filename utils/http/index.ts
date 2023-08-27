import axios, { AxiosInstance } from 'axios';
import { showToastAlert } from '../contant';

export interface IApiClient {
    get<TResponse>(path: string): Promise<TResponse>;
    post<TRequest, TResponse>(path: string, body: TRequest): Promise<TResponse>;
    patch<TRequest, TResponse>(path: string, body: TRequest): Promise<TResponse>;
    put<TRequest, TResponse>(path: string, body: TRequest): Promise<TResponse>;
    delete<TResponse>(path: string): Promise<TResponse>;
}

export class ApiClient implements IApiClient {
    private client: AxiosInstance;
    createAxiosClient(): AxiosInstance {
        return axios.create({
            baseURL: process.env.NEXT_PUBLIC_API_LINK,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('loginToken')}`,
            },
        });
    }

    constructor() {
        this.client = this.createAxiosClient();
    }

    public async post<TRequest, TResponse>(path: string, body: TRequest): Promise<TResponse> {
        const response = await this.client.post<TResponse>(path, body);
        return response?.data;
    }

    public async get<TResponse>(path: string): Promise<TResponse> {
        try {
            const response = await this.client.get<TResponse>(path);
            return response?.data;
        } catch (error: any) {
            if (typeof error?.response === 'string') {
                showToastAlert(error?.response);
            } else if (typeof error?.response?.data?.error === 'string') {
                showToastAlert(error?.response?.data?.error);
            }
            console.log(error);
        }
        return null as TResponse;
    }
    public async patch<TRequest, TResponse>(path: string, body: TRequest): Promise<TResponse> {
        const response = await this.client.patch<TResponse>(path, body);
        return response?.data;
    }

    public async put<TRequest, TResponse>(path: string, body: TRequest): Promise<TResponse> {
        const response = await this.client.put<TResponse>(path, body);
        return response?.data;
    }
    public async delete<TResponse>(path: string): Promise<TResponse> {
        try {
            const response = await this.client.delete<TResponse>(path);
            return response?.data;
        } catch (error: any) {
            showToastAlert(error.response.data);
            console.log(error);
        }
        return {} as TResponse;
    }
}
