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
  data:{
    detailData:{}
  },
  onLoad(option) {
    /**
     * 函数onload会在页面初始化的时候加载运行，其内部的`option`是路由跳转过来的参数对象
     * 我们从`option`中解析文章参数`contentId`，然后通过`util`中封装好的`request`函数来获取mock数据
     */
    let id = option.contentId || 0
    this.init(id)
  },
  articleRevert(){
    let htmlContent = this.data.detailData && this.data.detailData.content
    WxParse.wxParse('article','html',htmlContent,this,0)
  },
  init(contentId) {
    if (contentId) {
      this.requestDetail(contentId).then(data => {
        // 挂载数据
        util.log(data)
        this.configPageData(data)
      }).then(()=>{
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
  }

})
