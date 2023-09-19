import axios, { AxiosInstance } from 'axios';
import { showToastAlert } from '../contant';
import Router from 'next/router';

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
                'x-tenant-id': localStorage.getItem('uid'),
            },
            withCredentials: true,
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
            if (error?.response?.status === 401) {
                Router.push('/auth/signin');
                return null as TResponse;
            }
            if (typeof error?.response === 'string') {
                showToastAlert(error?.response);
            } else if (typeof error?.response?.data?.error === 'string') {
                showToastAlert(error?.response?.data?.error);
            } else if (typeof error?.response?.data?.message) {
                showToastAlert(error?.response?.data?.message);
            }
            console.log(error);
            return null as TResponse;
        }
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
            if (typeof error?.response === 'string') {
                showToastAlert(error?.response);
            } else if (typeof error?.response?.data?.error === 'string') {
                showToastAlert(error?.response?.data?.error);
            } else if (typeof error?.response?.data?.message) {
                showToastAlert(error?.response?.data?.message);
            }
            // if (error?.response?.status === 401) {
            //     Router.push('/auth/signin');
            // }
            console.log(error);
        }
        return null as TResponse;
    }
}
