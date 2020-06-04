import api from '../../utils/api';

const app = getApp();
Page({
  data: {
    url: '',
  },
  onLoad(query) {
    if (query?.url) {
      this.setData({ url: query.url });
    }
  },
});
