import util from './utils/index'

let handler = {
  //小程序初始化
  onLaunch() {
    this.getDeviceInfo()
    util.getStorageData('visited', (data) => {
      this.globalData.visitedArticles = data
    })
  },
  alert(title = 'notice', content = 'maybe have some trouble') {
    wx.showModal({
      title: title,
      content: content
    })
  },
  getDeviceInfo() {
    let self = this
    wx.getSystemInfo({
      success: res => {
        self.globalData.deviceInfo = res
      }
    })
  },
  //小程序全局数据
  globalData: {
    user: {
      openId: null
    },
    visitedArticles: '',
    deviceInfo: {}
  }
}
App(handler)