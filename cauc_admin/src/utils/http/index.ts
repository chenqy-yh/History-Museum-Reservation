import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { timeFormat } from '../fn';
import { get, remove, set } from '../store';
import { Auth } from '../store/keys';

interface PendingTask {
    config: InternalAxiosRequestConfig,
    resolve: Function
}


class ApiService {
    private readonly axiosInstance: AxiosInstance;

    private isRefreshing = false;
    private queue: PendingTask[] = [];
    constructor() {
        this.axiosInstance = axios.create({
            baseURL: import.meta.env.VITE_BASE_URL,
            timeout: 5000, // 设置请求超时时间
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // 添加请求拦截器
        this.axiosInstance.interceptors.request.use(
            (config) => {
                // 在发送请求之前做些什么
                // 所有不是刷新token的请求都需要在header中添加access_token
                if (!config.url?.includes('/auth/refresh')) {
                    const access_token = get<IAccessToken>(Auth.ACCESS_TOKEN)?.data.access_token;
                    if (access_token) {
                        config.headers['Authorization'] = access_token;
                    }
                }


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

                // 对响应数据做些什么
                // 从header中获取token
                const set_token = response.headers['set-token'];
                const access_token = response.headers['access-token'];
                const refresh_token = response.headers['refresh-token'];
                switch (set_token) {
                    case 'set-single':
                        console.log('set-single');
                        set<IAccessToken>(Auth.ACCESS_TOKEN, {
                            data: {
                                access_token: access_token
                            },
                            expires: Date.now() + timeFormat('7d')
                        });
                        break;
                    case 'set-both':
                        console.log('set-both');
                        set<IAccessToken>(Auth.ACCESS_TOKEN, {
                            data: {
                                access_token: access_token
                            },
                            expires: Date.now() + timeFormat('7d')
                        })
                        set<IRefreshToken>(Auth.REFRESH_TOKEN, {
                            data: {
                                refresh_token: refresh_token
                            },
                            expires: Date.now() + timeFormat('7d')
                        })
                        break;
                }
                return response;
            },
            async (error) => {
                const { data, config } = (error as AxiosError).response!;
                const statusCode = (data as any).statusCode;
                const url = config.url;

                if (this.isRefreshing) {
                    console.log('isRefreshing')
                    return new Promise((resolve) => {
                        this.queue.push({ config, resolve });
                    })
                }


                if (statusCode === 401 && !url?.includes('/auth/refresh')) {
                    this.isRefreshing = true;
                    const res = await this.refreshToken();

                    if (res.request.status === 200) {
                        if (this.queue.length > 0) {
                            this.queue.forEach((task) => task.resolve(this.axiosInstance(task.config)));
                            this.queue = [];
                        }
                        this.isRefreshing = false;
                        return this.axiosInstance(config)
                    } else {
                        console.log('refresh token is TIMEOUT');
                        remove(Auth.ACCESS_TOKEN);
                        remove(Auth.REFRESH_TOKEN);
                        this.isRefreshing = false;
                        window.location.reload();
                    }

                }

                return Promise.reject(error);
            }
        );
    }

    async get<T>(url: string, config?: AxiosRequestConfig<any>): Promise<AxiosResponse<T>> {
        return await this.axiosInstance.get(url, config);


    }

    async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        return await this.axiosInstance.post(url, data, config);
    }

    async delete<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        return await this.axiosInstance.delete(url, config);
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

    async refreshToken() {
        const res = await this.post('/auth/refresh', undefined, {
            headers: {
                Authorization: get<IRefreshToken>(Auth.REFRESH_TOKEN)?.data.refresh_token
            }
        });
        const access_token = res.headers['access-token'];
        set<IAccessToken>(Auth.ACCESS_TOKEN, {
            data: {
                access_token: access_token
            },
            expires: Date.now() + timeFormat('7d')
        });
        return res;
    };


}

const apiService = new ApiService();
export { apiService };
