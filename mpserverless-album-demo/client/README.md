1、下载IDE
### 前提条件、
1.已[开通小程序云服务](https://docs.alipay.com/mini/cloudservice/aban9r)。
2.配置[小程云服务空间](https://help.aliyun.com/document_detail/123251.html)
3.已下载并安装[小程序开发工具](https://docs.alipay.com/mini/ide/download)

### 创建支付宝小程序应用和添加相关表
1、创建项目工程
2、[登入小程序云后台](https://mp.console.aliyun.com/cloudAppList)创建云数据库表(如photo)
3、修改数据表[数据权限](https://help.aliyun.com/document_detail/122577.html?spm=a2c4g.11186623.2.9.d2a817c4JkeuFx#concept-745012)，否则无法保存到云数据库。

### 配置serverless
下载sdk
> npm install @alicloud/mpserverless-sdk --save

初始化
```js
import MPServerless from '@alicloud/mpserverless-sdk';
const mpserverless = new MPServerless({
  uploadFile: my.uploadFile,
  request: my.request,
  getAuthCode: my.getAuthCode,
}, {
    appId: '填写小程序应用标识', // 小程序应用标识
    spaceId: '填写服务空间标识', // 服务空间标识
    clientSecret: '填写服务空间 secret key', // 服务空间 secret key
    endpoint: '填写服务空间地址' // 服务空间地址，从小程序Serverless控制台处获得
  });
```

页面加载时添加授权，否则会报错。
```js
await mpserverless.user.authorize({
  authProvider: 'alipay_openapi',
  // authType: 'anonymous'
})
```

### 选择本地照片
```js
my.chooseImage({
  chooseImage: 1,
  success: res => {
    const path = res.apFilePaths[0];
    const options = {
      filePath: path,
      headers: {
        contentDisposition: 'attachment',
      },
    };

    mpserverless.file.uploadFile(options).then((image) => {
      const { imgs, newImgs } = this.data
      imgs.push({ name: image.fileUrl })
      newImgs.push({ name: image.fileUrl })
      this.setData({
        imgs,
        newImgs
      });
    }).catch(console.log);
  },
});
```

### 保存到数据库
```js
async submit() {
  if (this.data.newImgs.length > 0) {
    await mpserverless.db.collection('photo').insertMany(this.data.newImgs)
    this.setData({
      newImgs: [],
      text: '上传成功'
    })
  } else {
    this.setData({
      text: '请选择要上传的图片'
    })
  }
  this.setData({
    modalOpened: true,
  });
}
```

### 读取数据库数据
```js
await mpserverless.db.collection('photo').find().then((res) => {
  this.setData({ imgs: res.result });
}).catch(console.error);
```
