import { encodePhoneNumber } from '../../utils/util';
import api from '../../utils/api';

const app = getApp<IAppOption>();
Page({
  data: {
    avatarUrl: app.globalData.baseImgUrl + 'my/avatar.png',
    addressUrl: app.globalData.baseImgUrl + 'my/address.png',
    aboutUrl: app.globalData.baseImgUrl + 'my/about.png',
    user: app.globalData.user,
  },
  onLoad() {
    this.setData({ user: app.globalData.user });
    app.userReadyCallback = (res) => {
      this.setData({ user: res });
    };
  },
  login() {
    wx.navigateTo({ url: '/pages/login/login' });
  },
});
