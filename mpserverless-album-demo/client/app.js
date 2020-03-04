import MPServerless from '@alicloud/mpserverless-sdk';
import cloud from 'alipay-serverless-sdk';

my.serverless = my.serverless || new MPServerless({
  uploadFile: my.uploadFile,
  request: my.request,
  getAuthCode: my.getAuthCode,
}, {
  appId: '******',
  spaceId: '******',
  clientSecret: '******',
  endpoint: '******',
});

// 必须要初始化哦~cloud 是一个单例，初始化一次 App 引入均可生效
cloud.init(my.serverless);

App({
  mpserverless: my.serverless,
  cloud: cloud,
  async onLaunch(options) {
    var result = await my.serverless.user.authorize({
      authProvider: 'alipay_openapi',
    });
    console.log('基础授权结果:' + result);
  },
});
