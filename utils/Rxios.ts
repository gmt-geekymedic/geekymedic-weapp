import axios, { AxiosRequestConfig, AxiosResponse, AxiosInstance, AxiosInterceptorManager } from 'axios';
import { Observable, defer } from 'rxjs';

/**
 * axios的rxjs封装
 */
export class Rxios {
  static defaults: AxiosRequestConfig = axios.defaults;
  static interceptors: {
    request: AxiosInterceptorManager<AxiosRequestConfig>;
    response: AxiosInterceptorManager<AxiosResponse>;
  } = axios.interceptors;
  private axiosInstance: AxiosInstance;
  constructor(config?: AxiosRequestConfig | any) {
    this.axiosInstance = axios.create(config);
  }

  get defaults() {
    return this.axiosInstance.defaults;
  }

  get interceptors() {
    return this.axiosInstance.interceptors;
  }
  request<T>(config: AxiosRequestConfig): Observable<T> {
    return defer(() => this.axiosInstance.request(config).then((l) => l.data));
  }
  get<T>(url: string, config?: AxiosRequestConfig | any): Observable<T> {
    return defer(() => this.axiosInstance.get(url, config).then((l) => l.data));
  }
  delete<T>(url: string, config?: AxiosRequestConfig | any): Observable<T> {
    return defer(() => this.axiosInstance.delete(url, config).then((l) => l.data));
  }
  head<T>(url: string, config?: AxiosRequestConfig | any): Observable<T> {
    return defer(() => this.axiosInstance.head(url, config).then((l) => l.data));
  }
  post<T>(url: string, data?: any, config?: AxiosRequestConfig | any): Observable<T> {
    return defer(() => this.axiosInstance.post(url, data, config).then((l) => l.data));
  }
  put<T>(url: string, data?: any, config?: AxiosRequestConfig | any): Observable<T> {
    return defer(() => this.axiosInstance.put(url, data, config).then((l) => l.data));
  }
  patch<T>(url: string, data?: any, config?: AxiosRequestConfig | any): Observable<T> {
    return defer(() => this.axiosInstance.patch(url, data, config).then((l) => l.data));
  }
}
