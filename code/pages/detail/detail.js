'use strict'
import util from '../../utils/index'
import config from '../../utils/config'
//WxParse HtmlFormater 用来解析content文本为小程序视图
import WxParse from '../../lib/wxParse/wxParse'
// 把html转化为安全的格式，防范xss
import HtmlFormater from '../../lib/htmlFormater'
import {detail} from '../../utils/mock'

let app = getApp()

Page({
  data: {
    scrollTop: 0,
    detailData: {}
  },
  onLoad(option) {
    /**
     * 函数onload会在页面初始化的时候加载运行，其内部的`option`是路由跳转过来的参数对象
     * 我们从`option`中解析文章参数`contentId`，然后通过`util`中封装好的`request`函数来获取mock数据
     */
    let id = option.contentId || 0
    this.setData({
      isFromShare: !!option.share
    })
    this.init(id)
  },
  articleRevert() {
    let htmlContent = this.data.detailData && this.data.detailData.content
    WxParse.wxParse('article', 'html', htmlContent, this, 0)
  },
  init(contentId) {
    if (contentId) {
      this.goTop()
      this.requestDetail(contentId).then(data => {
        // 挂载数据
        util.log(data)
        this.configPageData(data)
      }).then(() => {
        this.articleRevert()
      })
    }
  },
  configPageData(data) {
    if (data) {
      this.setData({
        detailData: data
      })
      let title = this.data.detailData.title || config.defaultBarTitle
      wx.setNavigationBarTitle({
        title: title
      })
    }
  },
  requestDetail(contentId) {
    return util.request({
      url: `detail`,
      mock: true,
      data: {
        source: 1
      }
    }).then(res => {
      let formateUpdateTime = this.formateTime(res.data.lastUpdateTime)
      res.data.formateUpdateTime = formateUpdateTime
      return res.data
    })
  },
  formateTime(timeStr = '') {
    let year = timeStr.slice(0, 4)
    let month = timeStr.slice(5, 7)
    let day = timeStr.slice(8, 10)
    return `${year}/${month}/${day}`
  },
  next() {
    this.requestNextContentId().then(data => {
      let contentId = data && data.contentId || 0
      this.init(contentId)
    })
  },
  requestNextContentId() {
    let pubDate = this.data.detailData && this.data.detailData.lastUpdateTime || ''
    let contentId = this.data.detailData && this.data.detailData.contentId || 0
    return util.request({
      url: 'detail',
      mock: true,
      data: {
        tag: '微信热门',
        pubDate: pubDate,
        contentId: contentId,
        langs: config.appLang || 'en'
      }
    }).then(res => {
      if (res && res.status === 0 && res.data && res.data.contentId) {
        util.log(res)
        return res.data
      } else {
        util.alert('notice', 'noMore Passages')
        return null
      }
    })
  },
  goTop() {
    this.setData({
      scrollTop: 0
    })
  },
  onShareAppMessage() {
    let title = this.data.detailData && this.data.detailData.title || config.defaultShareText
    let contentId = this.data.detailData && this.data.detailData.contentId || 0
    return {
      title: title,
      path: `pages/detail/detail?share=1&contentId=${contentId}`,
      success: (res) => {
      },
      fail: (res) => {
      }
    }
  },
  notSupportShare() {
    let device = app.globalData.deivceInfo
    let sdkVersion = device && device.sdkVersion || '1.0.0'
    return /1\.0.\0|1\.0\.1|1\.1\.0|1\.1\.1/.test(sdkVersion)
  },
  share() {
    if (this.notSupportShare()) {
      wx.showModal({
        title: 'notice',
        content: 'can\'t support share,please click the right top ot share passage'
      })
    }
  },
  back() {
    if (this.data.isFromShare) {
      wx.navigateTo({
        url: '../index/index'
      })
    } else {
      wx.navigateBack()
    }
  }
})
