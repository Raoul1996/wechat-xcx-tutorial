'use strict'
import util from '../../utils/index'
import config from '../../utils/config'
import {list} from '../../utils/mock'

let app = getApp()
let idDEV = config.isDev
let handler = {

  data: {
    page: 1,
    days: 3,
    pageSize: 4,
    totalSize: 0,
    hasMore: true,
    articleList: [],
    defaultImg: config.defaultImg
  },
  onLoad: function (options) {
    this.requestArticle()
  },
  requestArticle() {
    util.request({
      url: list,
      mock: true,
      data: {
        tag: '微信热门',
        start: this.data.page || 1,
        days: this.data.days || 3,
        pageSize: this.data.pageSize,
        langs: config.appLang || 'en'
      }
    }).then((res) => {
      if (res && res.status === 0 && res.data && res.data.length) {
        let articleData = res.data
        //格式化原始数据
        let formatData = this.formatArticleData(articleData)
        console.log(formatData)
      }
      /**
       * 如果加载第一页就没有数据，那么说明数据存在异常情况
       * 处理方式：弹出异常提示信息（默认提示信息）并设置下拉加载功能不可用
       * */
      else if (this.data.page === 1 && res.data && res.data.length) {
        util.alert()
        this.setData({
          hasMore: false
        })
      }
      /**
       * 如果非第一页没有数据，那就是没有数据了，停用下拉加载功能
       * */
      else if (this.data.page !== 1 && res.data && res.data.length) {
        this.setData({
          hasMore: false
        })
      }
      /**
       * 返回异常错误
       * 展示错误信息，停用下拉加载
       * */
      else {
        util.alert('notice', res)
        this.setData({
          hasMore: false
        })
        return null
      }
    })
  },
  formatArticleData(data) {
    let formatData = undefined
    if (data && data.length) {
      formatData = data.map((group) => {
        // 格式化日期
        group.formateDate = this.dateConvert(group.date)
        if (group && group.articles) {
          let formatArticleItems = group.articles.map((item) => {
            // 判断是否已经访问过
            item.hasVisited = this.isVisited(item.contentId)
            return item
          }) || []
          group.articles = formatArticleItems
        }
        return group
      })
    }
    return formatData
  },
  dateConvert(dataStr) {
    if (!dataStr) {
      return ''
    }
    let today = new Date()
    let todayYear = today.getFullYear()
  },
  onReady: function () {
    // 生命周期函数--监听页面初次渲染完成
  },
  onShow: function () {
    // 生命周期函数--监听页面显示
  },
  onReachBottom: function () {
    // 页面上拉触底事件的处理函数
  },
  // 其他一些业务函数
  hello: function () {
    this.setData({
      text: 'hello world'
    })
  }

}

Page(handler)