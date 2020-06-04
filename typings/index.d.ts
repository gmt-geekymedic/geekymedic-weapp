interface IAppOption {
  globalData: {
    userInfo?: WechatMiniprogram.UserInfo; // 微信用户信息
    user?: any; // 系统用户信息(非微信用户)
    ossUrl?: string; // oss路径
    envVersion?: string; //'develop': 开发版;'trial': 体验版;'release': 正式版;
    share?: any; // 是否分享进入小程序
  };
  userInfoReadyCallback?: WechatMiniprogram.GetUserInfoSuccessCallback;
  userReadyCallback?: Function;
}
