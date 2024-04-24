import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

@Injectable()
export class HttpService {
    private readonly axiosInstance: AxiosInstance;
    constructor() {
        this.axiosInstance = axios.create({
            timeout: 5000, // 设置请求超时时间
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // 添加请求拦截器
        this.axiosInstance.interceptors.request.use(
            (config) => {
                return config;
            },
            (error) => {
                // 对请求错误做些什么
                return Promise.reject(error);
            }
        );

        // 添加响应拦截器
        this.axiosInstance.interceptors.response.use(
            (response) => {

                return response;
            },
            (error) => {
                return Promise.reject(error);
            }
        );
    }

    async get<T>(url: string, config: AxiosRequestConfig<any>): Promise<AxiosResponse<T>> {
        const response: AxiosResponse<T> = await this.axiosInstance.get(url, config);
        return response;
    }

    async post<T>(url: string, data: any): Promise<AxiosResponse<T>> {
        const response: AxiosResponse<T> = await this.axiosInstance.post(url, data);
        return response;
    }
    //设置 token   
    setAuthorizationToken(token: string): void {
        this.axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }

    // 可以添加其他HTTP请求方法（例如put、delete等）根据需要

    // 如果你想要提供直接访问axios实例的能力，可以添加一个getter方法
    getAxiosInstance(): AxiosInstance {
        return this.axiosInstance;
    }
}