import { Rxios } from './Rxios';
import { getTrace, getSequence, getTime } from './util';

// 获取系统信息
let sysInfo: WechatMiniprogram.GetSystemInfoSuccessCallbackResult;
wx.getSystemInfo({
  success: (res) => {
    sysInfo = res;
  },
});
// 获取网络环境
let networkType = '';
wx.getNetworkType({
  success: (res) => {
    networkType = res.networkType;
  },
});
// 获取当前帐号信息
const accountInfo = wx.getAccountInfoSync();
const env = accountInfo?.miniProgram?.envVersion || 'release';
// 提审时将此处都改为正式环境后台url，不需要提交代码，提审后撤回
const baseApi = {
  develop: 'developUrl', // 开发版
  trial: 'trialUrl', // 体验版
  release: 'releaseUrl', // 正式版
};
// axios全局设置
const http = new Rxios({
  baseURL: baseApi[env],
  timeout: 20 * 1000,
  responseType: 'json',
});

// axios.defaults.timeout = 30000
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'

//划重点！ 由于微信小程序需要用微信官方请求接口，因此需要用adapter自定义
http.defaults.adapter = function (config) {
  // let baseURL = process.env.BASE_API
  // 发交易之前显示加载中
  const loading = (config as any).showLoading ?? true;
  if (loading) {
    wx.showLoading({
      title: '拼命加载中...',
    });
  }
  return new Promise((resolve, reject) => {
    const url =
      config.url.startsWith('http://') || config.url.startsWith('https://') ? config.url : config.baseURL + config.url;
    wx.request({
      url,
      method: config.method as any,
      data: config.data,
      success: (res) => {
        return resolve(res as any);
      },
      fail: (err) => {
        return reject(err);
      },
      complete: (res) => {
        if (loading) {
          wx.hideLoading();
        }
        // TODO:
      },
    });
  });
};

// axios请求拦截
http.interceptors.request.use(
  (config) => {
    // 若是有做鉴权token , 就给头部带上token
    // let token = window.sessionStorage.getItem(__TOKEN_KEY__)
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`
    // }
    if (!config.url.endsWith('wechat_applets_init')) {
      config.params = {
        ...config.params,
        _platform: 'WechatApp',
        _version: accountInfo?.miniProgram?.version,
        _net: networkType,
        _os: sysInfo?.system,
        _device: sysInfo?.model,
        _describe: sysInfo?.brand,
        _trace: getTrace(),
        _sequence: getSequence(),
        _time: getTime(),
      };
      const token = wx.getStorageSync('token');
      if (token) {
        config.params._token = token;
      }
      const uid = wx.getStorageSync('uid');
      if (uid) {
        config.params._uid = uid;
      }
    }
    if (config.params) {
      const params = Object.keys(config.params)
        .reduce((prev, item) => {
          prev.push(`${item}=${config.params[item]}`);
          return prev;
        }, [])
        .join('&');
      config.url = config.url.indexOf('?') > 0 ? `${config.url}&${params}` : `${config.url}?${params}`;
    }
    return config;
  },
  (error) => {
    sendError(error);
    return Promise.reject(error.data);
  },
);

// axios 响应拦截，对响应的状态处理
http.interceptors.response.use(
  //   function (response) {
  //     console.log(response.data.data) // 响应成功
  //     return response
  //   },
  //   function (error) {
  //     // console.log(error); //响应失败
  //     return Promise.reject(error)
  //   })
  (res) => {
    // 200,204为处理成功
    //注意这里statusCode有可能微信的ts声明文件里未定义，需要去声明文件里定义一下
    if ([200, 204].indexOf((res as any).statusCode) === -1) {
      sendError(res);
      return Promise.reject(res.data);
    }
    if (res.data.hasOwnProperty('Code')) {
      if (res.data.Code === 1005) {
        const pages = getCurrentPages();
        const curPage = pages[pages.length - 1];
        const url = curPage.route;
        let params = Object.keys(curPage.options)
          .map((key) => `${key}=${curPage.options[key]}`)
          .join('&');
        if (params) {
          params = '?' + params;
        }
        const redirectUrl = encodeURIComponent('/' + url + params);
        wx.redirectTo({ url: '/pages/login/login?redirect=' + redirectUrl });
      } else if (res.data.Code !== 0) {
        // 100003:自提人不存在 （不提示）
        if (res.data.Code !== 100003) {
          sendError(res);
        }
        return Promise.reject(res.data);
      }
      res.data = res.data.Data;
    }
    return res;
  },
  (error) => {
    sendError(error);
    return Promise.reject(error);
  },
);
/**
 * 此处为捕获到的异常，可以将此异常提交给Vuex的Store或者使用微信组件弹出
 * @param error
 */
function sendError(error) {
  let type = new Date().getMilliseconds();
  let data;
  var msg = '发生错误';
  if (error.data) {
    data = error.data.errors;
    msg = error.data.Message;
  } else if (error.response) {
    data = error.response.data;
    msg = data.message;
  } else {
    msg = error.message;
  }
  let errorData = {
    type,
    data,
    message: msg,
  };
  // 1。store.dispatch('error/appendError', errorData)
  // 2。弹出
  wx.showToast({
    title: errorData.message,
    icon: 'none',
    duration: 3000,
    complete: (res) => {},
  });
}
export default http;
