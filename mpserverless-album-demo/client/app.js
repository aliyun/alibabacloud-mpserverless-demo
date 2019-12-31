import MPServerless from '@alicloud/mpserverless-sdk';

const mpserverless = new MPServerless({
  uploadFile: my.uploadFile,
  request: my.request,
  getAuthCode: my.getAuthCode,
}, {
  appId: '****************', // 小程序应用标识
  spaceId: '*******************', // 服务空间标识
  clientSecret: '*****************', // 服务空间 secret key
  endpoint: '***************' // 服务空间地址，从小程序Serverless控制台处获得
});

App({
  mpserverless,
  async onLaunch(options) {
    // 第一次打开
    // options.query == {number:1}
    const res = my.getStorageSync({ key: 'userInfo' });
    if (res.data) {
      // 本地已有数据
      await mpserverless.user.authorize({
        authProvider: 'alipay_openapi',
        // authType: 'anonymous'
      })
    }
    console.info('App onLaunch');
  },
  onShow(options) {
    // 从后台被 scheme 重新打开
    // options.query == {number:1}
  },
});
