'use strict'
import Promise from '../lib/promise'
import config from './config'
import * as Mock from './mock'

const DEFAULT_REQUEST_OPTIONS = {
  url: '',
  data: {},
  header: {
    'Content-Type': 'application/json'
  },
  method: 'GET',
  dataType: 'json'
}

// util 工具类
let util = {
  isDEV: config.isDev,
  log() {
    this.isDEV && console.log(...arguments)
  },
  alert(title = 'notice', content = config.defaultAlertMsg) {
    if ('object' === typeof content) {
      content = this.isDEV && JSON.stringify(content) || config.defaultAlertMsg
    }
    wx.showModal({
      title,
      content
    })
  },
  getStorageData(key, cb) {
    let self = this
    wx.getStorage({
      key,
      success(res) {
        cb && cb(res.data)
      },
      fail(err) {
        let msg = err.errMsg || ''
        if (/getStorage:fail/.test(msg)) {
          self.setStorageData(key)
        }
      }
    })
  },
  setStorageData(key, value = '', cb) {
    wx.setStorage({
      key,
      data: value,
      success() {
        cb && cb()
      }
    })
  },
  request(opt) {
    let options = Object.assign({}, DEFAULT_REQUEST_OPTIONS, opt)
    let {url, data, header, method, dataType, mock = false} = opt
    let self = this
    // wo~_~,回调地狱
    return new Promise((resolve, reject) => {
      if (mock) {
        let res = {
          statusCode: 200,
          data: Mock[url]
        }
        if (res && res.statusCode === 200 && res.data) {
          resolve(res.data)
        } else {
          self.alert('notice', res)
          reject(res)
        }
      } else {
        wx.request({
          url: url,
          data: data,
          header: header,
          method: method,
          dataType: dataType,
          success: function (res) {
            if (res && res.statusCode === 200 && res.data) {
              resolve(res.data)
            } else {
              self.alert('notice', res)
              reject(res)
            }
          },
          fail: function (err) {
            self.log(err)
            self.alert('notice', err)
            reject(err)
          }
        })
      }
    })
  }
}
export default util