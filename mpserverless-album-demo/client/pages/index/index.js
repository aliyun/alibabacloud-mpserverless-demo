const { mpserverless, cloud } = getApp()

Page({
  data: {
    tabs: [
      { title: '相册' },
      { title: '用户' },
    ],
    activeTab: 1,
    files: [],
    userInfo: null,
    isAuthorize: false,
  },
  async onLoad(query) {
    // my.clearStorage()
    // 页面加载
    const res = my.getStorageSync({ key: 'userInfo' });
    if (res.data) {
      const result = await mpserverless.db.collection('files').find({ userId: res.data.userId })
      this.setData({
        userInfo: res.data,
        isAuthorize: true,
        files: result.result || []
      })
    }
  },
  async onReady() {
  },
  onShow() {
    // 页面显示
  },
  onHide() {
    // 页面隐藏
  },
  onUnload() {
    // 页面被关闭
  },
  onTitleClick() {
    // 标题被点击
  },
  onPullDownRefresh() {
    // 页面被下拉
  },
  onReachBottom() {
    // 页面被拉到底部
  },
  onShareAppMessage() {
    // 返回自定义分享信息
    return {
      title: 'My App',
      desc: 'My App description',
      path: 'pages/index/index',
    };
  },

  /** 授权serverless */
  async getAuthorize() {
    const res = await mpserverless.user.authorize({
      authProvider: 'alipay_openapi',
      // authType: 'anonymous'
    })
    this.setData({
      isAuthorize: true
    })
  },

  /**
   * 获取用户信息
   */
  async getUserInfo() {
    await my.getAuthCode({
      scopes: ['auth_base'],
      success: async (res) => {
        const tokenResult = await cloud.base.oauth.getToken(res.authCode);
        const userId = tokenResult.userId;
        my.getOpenUserInfo({
          scopes: 'auth_user',
          success: async (data) => {
            let result
            try {
              result = { ...JSON.parse(data.response).response, userId }
            } catch (err) {
              result = { ...data, userId }
            }
            this.setData({
              userInfo: result
            })
            const findUser = await mpserverless.db.collection('users').findOne({ userId })
            if (!findUser.result) {
              await mpserverless.db.collection('users').insertOne(result)
            }
            my.setStorage({
              key: 'userInfo',
              data: result,
            });
          },
        });
      }
    })
  },
  /**
   * @memberof Tab
   */
  async handleTab({ index }) {
    if (!this.data.userInfo) {
      // 未授权提示先授权
      my.alert({
        title: '亲',
        content: '请先授权登入',
        buttonText: '我知道了',
      });
      return;
    }
    if (index === 0) {
      const result = await mpserverless.db.collection('files').find({ userId: this.data.userInfo.userId })
      this.setData({
        files: result.result || []
      })
    }
    this.setData({
      activeTab: index,
    });
  },
  /** 添加相册文件夹 */
  onAdd() {
    my.navigateTo({ url: '../add-file/index' })
  },
  /** 查看相册 */
  onFile(node) {
    my.navigateTo({ url: `../details/index?id=${node.target.dataset.value._id}` })
  }
});
