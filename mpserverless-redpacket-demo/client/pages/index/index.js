import F2 from '@antv/my-f2';
import drawChart, { chart } from './chart'

const { mpserverless } = getApp()

Page({
  data: {
    animation: null,
    openAnim: null,
    info: 0,  // 提示文案
    btmInfo: 0, // 按钮下方提示文案
  },
  onLoad(query) {
    // 页面加载
    this.num = 0  // 步数
    my.hideFavoriteMenu();
  },
  async onReady() {
    // 页面加载完成
    this.myChart()

    my.getStorage({
      key: '$count',
      success: (res) => {
        if (res.data && res.data.isCount) {
          this.getCount()
        }
      },
      fail: function (res) {
        my.alert({ content: '系统繁忙，请稍后重试!' });
      }
    });
  },
  /** 步数图表 */
  myChart() {
    my.createSelectorQuery()
      .select('#area')
      .boundingClientRect()
      .exec((res) => {
        // 获取分辨率
        const pixelRatio = my.getSystemInfoSync().pixelRatio;
        // 获取画布实际宽高
        // const canvasWidth = res[0].width;  // 300
        // const canvasHeight = res[0].height;  // 225
        const canvasWidth = 334;
        const canvasHeight = 250.5;
        // 高清解决方案
        this.setData({
          width: canvasWidth * pixelRatio,
          height: canvasHeight * pixelRatio
        });
        const myCtx = my.createCanvasContext('area');
        myCtx.scale(pixelRatio, pixelRatio); // 必要！按照设置的分辨率进行放大
        const canvas = new F2.Renderer(myCtx);
        this.canvas = canvas;
        drawChart(canvas, canvasWidth, canvasHeight, this.num);
      });
  },
  onShow() {
    // 页面显示
    this.anim()
    if (this.isInit && !this.isRunAuthorize && (my.getSystemInfoSync().platform).toLowerCase() !== "ios") {
      my.getStorage({
        key: '$count',
        success: (res) => {
          if (res.data && res.data.isCount && this.num === 0) {
            this.getCount(true)
          }
        }
      });
    }
  },
  onHide() {
    // 页面隐藏
    this.onClose()
  },
  onUnload() {
    // 页面被关闭
    this.onClose()
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
      title: '低碳出行抢红包',
      desc: '走满 2500 步，即可兑换奖励红包！',
    };
  },
  /** 动画 */
  anim() {
    this.animation = my.createAnimation({
      duration: 30000,
      delay: 0
    })
    this.animation.translate(0, 0).step()
    this.setData({ animation: this.animation.export() })
    this.timeout1 = setTimeout(() => {
      this.animation.translate('-2998rpx', 0).step({ duration: 0 })
      this.setData({ animation: this.animation.export() })
    }, 29900)
    this.setInt = setInterval(() => {
      this.animation.translate(0, 0).step()
      this.setData({ animation: this.animation.export() })
      this.timeout2 = setTimeout(() => {
        this.animation.translate('-2998rpx', 0).step({ duration: 0 })
        this.setData({ animation: this.animation.export() })
      }, 29900)
    }, 30000)
  },
  async getCount(isUse = false) {
    this.isInit = true
    const date = new Date()
    const month = date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1
    const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()
    setTimeout(() => {
      if ((my.getSystemInfoSync().platform).toLowerCase() !== "ios" && this.num === 0 && !isUse && !this.isRunAuthorize) {
        my.call('startApp', { appId: '20000869' });
      }
    }, 2000)
    // 获取步数
    await my.getRunData({
      countDate: `${date.getFullYear()}-${month}-${day}`,
      success: (res) => {
        mpserverless.function.invoke('stepdecryption', {
          "step": res.response,
        }).then(res => {
          this.isRunAuthorize = false
          my.setStorage({
            key: '$count',
            data: {
              isCount: true
            }
          });
          const data = JSON.parse(res.result.data)
          this.num = data.count || 0
          if (this.num < 2500) {
            this.setData({
              info: 1,
              btmInfo: 1
            })
          } else {
            this.setData({
              info: 2,
              btmInfo: 2
            })
          }
          if (!chart) return;
          chart.changeData([{
            x: '1',
            y: this.num / 25 >= 100 ? 100 : this.num / 25
          }])
          chart.guide().clear();
          chart.guide().arc({
            start: [0, 0],
            end: [1, 99.98],
            top: false,
            style: {
              lineWidth: 10,
              stroke: '#EDEDED',
            }
          });
          chart.guide().text({
            position: ['50%', '42%'],
            content: `今日步数`,
            style: {
              fill: '#999999',
              fontSize: 16,
            }
          });
          chart.guide().text({
            position: ['50%', '56%'],
            content: `${this.num}`,
            style: {
              fill: '#000000',
              fontSize: 32,
              fontWeight: 'bold',
            }
          });
          chart.render();
        }).catch(() => {
          my.showToast({
            content: '系统繁忙，请稍后重试！',
            duration: 3000,
          });
        })
      },
      fail: (res) => {
        if ((my.getSystemInfoSync().platform).toLowerCase() !== "ios") {
          this.isRunAuthorize = true
        }
      },
      complete: (res) => {
      },
    });
  },
  async onButton() {
    // 领取红包
    if (this.data.info === 0) {
      this.getCount()
      return true;
    }
    if (this.num < 2500) {
      // 步数小于2500
      my.showToast({
        content: '步数满 2500 步才能兑换奖励红包',
        duration: 3000,
      });
    } else {
      // 步数大于2500
      my.showToast({
        content: '感谢参与!',
        duration: 3000,
      });
    }
  },
  /** 页面关闭初始化数据 */
  onClose() {
    clearInterval(this.setInt)
    clearTimeout(this.timeout1)
    clearTimeout(this.timeout2)
    this.animation.translate('-3024rpx', 0).step({ duration: 0 })
    this.setData({ animation: this.animation.export() })
  },
  /** 单击分享 */
  onShare() {
    my.showSharePanel();
  },
});
