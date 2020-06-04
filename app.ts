import api from './utils/api';
import { encodePhoneNumber } from './utils/util';

// app.ts
App<IAppOption>({
  globalData: {
    ossUrl: 'https://geeky-test-oss-1.oss-cn-shenzhen.aliyuncs.com/yjt-applets/',
    share: false,
  },
  onLaunch(options) {
    // 判断是否由分享进入小程序
    if (options.scene == 1007 || options.scene == 1008) {
      this.globalData.share = true;
    } else {
      this.globalData.share = false;
    }
    // 获取当前帐号信息
    const accountInfo = wx.getAccountInfoSync();
    const env = accountInfo?.miniProgram?.envVersion || 'release';
    this.globalData.envVersion = env;
    // 登录
    wx.login({
      success: (res) => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        // api.wxInitLogin(res.code).subscribe((res) => {
        //   wx.setStorage({ key: 'token', data: res.Token });
        //   wx.setStorage({ key: 'uid', data: res.MemberId });
        //   if (res.IsLogin) {
        //     const user: any = { MemberId: res.MemberId, Tel: res.Tel };
        //     user.TelDisplay = encodePhoneNumber(user.Tel);
        //     this.globalData.user = user;
        //     if (this.userReadyCallback) {
        //       this.userReadyCallback(user);
        //     }
        //   }
        // });
      },
    });
    // 获取用户信息
    wx.getSetting({
      success: (res) => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: (res) => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo;

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res);
              }
            },
          });
        }
      },
    });
  },
});
