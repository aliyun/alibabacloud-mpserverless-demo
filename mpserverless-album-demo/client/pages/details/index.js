const { mpserverless } = getApp()

Page({
  data: {
    imgs: [],
    isOpenModal: false,
    url: ''
  },
  onLoad(query) {
    // 页面加载
    this.setData({
      id: query.id
    })
  },
  async onReady() {
    // 页面加载完成
    const { id } = this.data
    await mpserverless.db.collection('photos').find({ fileId: id }).then((res) => {
      this.setData({ imgs: res.result });
    }).catch(console.error);
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
  // 选择并上传图片，获得图片 URL
  attach() {
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
          const { imgs } = this.data
          imgs.push({ name: image.fileUrl })
          this.setData({
            imgs,
          });
        }).catch(console.log);
      },
    });
  },
  /** 添加添加照片按钮 */
  onAdd() {
    my.navigateTo({ url: `../photo/index?id=${this.data.id}` })
  },
  onModalClose() {
    this.setData({
      isOpenModal: false
    })
  },
  /** 单击图片 */
  onImg(node) {
    const { value } = node.target.dataset
    this.setData({
      isOpenModal: true,
      url: value
    })
  }
});
