const { mpserverless } = getApp()

Page({
  data: {
    userInfo: null,
    inputValue: '',
  },
  onLoad(query) {
    // 页面加载
    const res = my.getStorageSync({ key: 'userInfo' });
    if (res.data) {
      this.setData({
        userInfo: res.data
      })
    }
  },
  async onReady() {
    // 页面加载完成
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
  bindKeyInput(e) {
    this.setData({
      inputValue: e.detail.value,
    });
  },
  /**
   * 提交表单
   */
  async onSubmit() {
    const { inputValue } = this.data
    if (inputValue.trim() === '') {
      my.alert({
        title: '亲',
        content: '相册名不能为空',
        buttonText: '我知道了',
      });
      return;
    }
    const res = my.getStorageSync({ key: 'userInfo' });
    const obj = { name: inputValue, userId: res.data.userId }
    await mpserverless.db.collection('files').insertOne(obj)
    let pages = getCurrentPages();//当前页面
    let prevPage = pages[pages.length - 2];//上一页面
    const { files } = prevPage.data
    files.push(obj)
    prevPage.setData({
      files: files
    })
    my.navigateBack()
  }
});
