const { mpserverless } = getApp()

let fileId = ''

Page({
  data: {
    imgs: [],
    inputValue: '',
    isOpenModal: false
  },
  onLoad(query) {
    // 页面加载
    fileId = query.id
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
          imgs.push(image.fileUrl)
          this.setData({
            imgs,
          });
        }).catch(console.log);
      },
    });
  },
  bindTextAreaBlur(e) {
    this.setData({
      inputValue: e.detail.value
    })
  },
  // 保存到数据库
  async submit() {
    if (this.data.imgs.length > 0) {
      const obj = { urls: this.data.imgs, details: this.data.inputValue, fileId }
      await mpserverless.db.collection('photos').insertOne(obj)
      let pages = getCurrentPages();//当前页面
      let prevPage = pages[pages.length - 2];//上一页面
      const { imgs } = prevPage.data
      imgs.push(obj)
      prevPage.setData({
        imgs
      })
      my.navigateBack()
    } else {
      my.alert({
        title: '亲',
        content: '请选择要上传的图片',
        buttonText: '我知道了',
      });
    }
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
  },
  /** 删除照片 */
  onRemove(node) {
    const { value } = node.target.dataset
    const { imgs } = this.data
    imgs.splice(value, 1)
    this.setData({
      imgs
    })
  }
});
