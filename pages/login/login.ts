import api from '../../utils/api';
import { encodePhoneNumber } from '../../utils/util';
import Dialog from '@vant/weapp/dialog/dialog';

const app = getApp<IAppOption>();
Page({
  data: {
    loginBgUrl: app.globalData.ossUrl + 'login-bg.png',
    redirect: '',
  },
  onLoad(options) {
    if (options.redirect) {
      this.setData({ redirect: decodeURIComponent(options.redirect) });
    }
  },
  getPhoneNumber(e) {
    if (!e.detail.encryptedData) {
      Dialog.alert({
        title: '提示',
        message: '为确保所有功能正常使用，请您授权',
      });
    } else {
      this.login(e.detail);
    }
  },
  login(detail) {
    // api.wxLogin(detail.encryptedData, detail.iv).subscribe((res) => {
    //   wx.setStorage({ key: 'token', data: res.Token });
    //   wx.setStorage({ key: 'uid', data: res.MemberId });
    //   const user: any = { MemberId: res.MemberId, Tel: res.Tel };
    //   user.TelDisplay = encodePhoneNumber(user.Tel);
    //   app.globalData.user = user;
    //   if (app.userReadyCallback) {
    //     app.userReadyCallback(user);
    //   }
    //   if (this.data.redirect) {
    //     wx.reLaunch({ url: this.data.redirect });
    //   } else {
    //     wx.navigateBack();
    //   }
    // });
  },
});
