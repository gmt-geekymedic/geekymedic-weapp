import http from './http';

class Api {
  /**
   * 初始登录
   * @param code
   */
  wxInitLogin(code: string) {
    return http.post<any>('api/applets/v1/yjtstore/login/wechat_applets_init', { Code: code }, { showLoading: false });
  }
}

const api = new Api();
export default api;
